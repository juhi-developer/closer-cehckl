import React from 'react';
import FastImage from 'react-native-fast-image';
import {useAppContext} from '../utils/VariablesContext';
import {AWS_URL_S3} from '../utils/urls';
import {colors} from '../styles/colors';
import {InitialsAvatar} from '../screens/app/moments/components/InitialsAvatar';
import {VARIABLES} from '../utils/variables';

export const ProfileAvatar = ({type, style}) => {
  //const {user} = useAppContext();

  const userData =
    type === 'partner'
      ? VARIABLES?.user?.partnerData?.partner
      : VARIABLES?.user;

  if (userData?.profilePic) {
    return (
      <FastImage
        resizeMode="cover"
        source={{
          uri: `${AWS_URL_S3}${userData.profilePic}`,
        }}
        style={[
          {
            backgroundColor: colors.borderColor,
          },
          style,
        ]}
      />
    );
  }

  return <InitialsAvatar type={type} name={userData?.name} viewStyle={style} />;
};
