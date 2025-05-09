import axios from 'axios';
import {API_BASE_URL} from '../../utils/urls';
import {VARIABLES} from '../../utils/variables';
import {removeData} from '../../utils/storage';
import {getCurrentTimezone} from '../../utils/utils';
import navigationServices from '../../navigations/navigationServices';
import * as Sentry from '@sentry/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function API(variable, method, info, formData) {
  const headers = {
    Authorization: `Bearer ${VARIABLES.token}`,
    Accept: 'application/json',
    timezone: getCurrentTimezone(),
  };

  if (formData) {
    headers['Content-Type'] = 'multipart/form-data';
  } else {
    headers['Content-Type'] = 'application/json';
  }

  const axiosConfig = {
    method: method,
    url: `${API_BASE_URL + variable}`,
    headers: headers,
    timeout: 27000, // setting the timeout to 27 seconds
  };

  if (method !== 'GET') {
    axiosConfig.data = formData ? info : JSON.stringify(info);
  }
  console.log(axiosConfig);
  return axios(axiosConfig)
    .then(response => {
      const data = {
        status: 200,
        body: response.data,
      };

      if (response.data.statusCode === 401) {
        alert('Your session expired');
        navigationServices.resetToTop('Auth');
        setTimeout(async () => {
          await removeData('TOKEN'),
            await removeData('USER'),
            (VARIABLES.token = ''),
            (VARIABLES.user = null);
        }, 1);
        return;
      }

      return data;
    })
    .catch(error => {
      if (error?.message === 'Network Error') {
        alert('Please check your internet connection and try again.');
      }
      console.log('error message axios', error?.message);
      //   Sentry.captureException(JSON.stringify(error));
      console.error('AXIOS BASE RESPONSE', error?.response?.data ?? error);

      if (error.response.status === 429) {
        alert('Please try again later after some time.');
        return;
      }

      // if (error.response.status === 401) {
      //   alert('Your session expired');
      //   setTimeout(async () => {
      //     await removeData('TOKEN');
      //     await removeData('USER');
      //     VARIABLES.token = '';
      //     VARIABLES.user = null;
      //   }, 1);
      //   setTimeout(() => {
      //     navigationServices.resetToTop('Auth');
      //   }, 100);
      //   return;
      // }
      if (error?.response?.data?.statusCode === 500) {
        alert('Something went wrong, please try again later.');
      }

      return {
        status: error.response ? error.response.status : 500,
        body: {
          status: 400,
          statusCode: error.response.data.statusCode,
          Message: error.response.data.message,
          isBlocked: error.response.data?.isBlocked,
        },
      };
    });
}
