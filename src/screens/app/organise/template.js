/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  FlatList,
  Platform,
  Keyboard,
} from 'react-native';
import React, {useState, useEffect, useRef, useMemo, useCallback} from 'react';
import AppView from '../../../components/AppView';
import ArrowLeftIconSvg from '../../../assets/svgs/arrowLeftIconSvg';
import {BOTTOM_SPACE, globalStyles} from '../../../styles/globalStyles';
import CenteredHeader from '../../../components/centeredHeader';
import CornerHeader from '../../../components/cornerHeader';
import LargeEditIconSvg from '../../../assets/svgs/largeEditIconSvg';
import MoreVerticleIconSvg from '../../../assets/svgs/moreVerticleIconSvg';
import {colors} from '../../../styles/colors';
import DeleteIconSvg from '../../../assets/svgs/deleteIconSvg';
import UncheckedGraySvg from '../../../assets/svgs/uncheckedGraySvg';
import {APP_IMAGE, templateImages} from '../../../utils/constants';
import LinearGradient from 'react-native-linear-gradient';
import AppButton from '../../../components/appButton';
import RedCrossIconSvg from '../../../assets/svgs/redCrossIconSvg';
import {scale} from '../../../utils/metrics';
import BlueCloseCircleIconSvg from '../../../assets/svgs/blueCloseCircleIconSvg';
import CheckedOneSvg from '../../../assets/svgs/checkedOneSvg';

import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';

import {useNetInfo} from '@react-native-community/netinfo';
import {useSelector, useDispatch} from 'react-redux';
import {
  AddTemplate,
  ClearAction,
  DeleteTemplate,
  EditTemplate,
  GetTemplates,
} from '../../../redux/actions';
import {VARIABLES} from '../../../utils/variables';
import {getData, setData} from '../../../utils/storage';
import * as actions from '../../../redux/actionTypes';
import {EventRegister} from 'react-native-event-listeners';
import FastImage from 'react-native-fast-image';
import BagpackIconSvg from '../../../assets/svgs/templates/bagpackIconSvg';
import ExperienceIconSvg from '../../../assets/svgs/templates/experienceIconSvg';
import StayIconSvg from '../../../assets/svgs/templates/stayIconSvg';
import TravelIconSvg from '../../../assets/svgs/templates/travelIconSvg';
import {
  BottomSheetFlatList,
  BottomSheetModal,
  SCREEN_WIDTH,
  WINDOW_WIDTH,
} from '@gorhom/bottom-sheet';
import AddMediaIconSvg from '../../../assets/svgs/addMediaIconSvg';
import AddNameTagSvg from '../../../assets/svgs/addNameTagSvg';
import {ToastMessage} from '../../../components/toastMessage';
import {cloneDeep} from 'lodash';
import CheckedTwoSvg from '../../../assets/svgs/checkedTwoSvg';
import {delay, getStateDataAsync} from '../../../utils/helpers';
import TemplateItem from './TemplateItem';
import moment from 'moment';
import OverlayLoader from '../../../components/overlayLoader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';

const CleverTap = require('clevertap-react-native');

const TEMPLATES = [
  {
    id: 1,
    title: 'Plan a trip',
    template: APP_IMAGE.templateOne,
  },
  {
    id: 2,
    title: 'Date plan',
    template: APP_IMAGE.templateTwo,
  },
  {
    id: 3,
    title: 'Rituals',
    template: APP_IMAGE.templateThree,
  },
];

const CONTENT = [
  {
    id: 2,
    key: 'Tags',
    label: 'Add name tag',
    icon: <AddNameTagSvg />,
  },
  {
    id: 2,
    key: 'Delete',
    label: 'Delete List',
    icon: <DeleteIconSvg />,
  },
];

export default function Template(props) {
  const {id, data, headerName, newTemplate, addNewTemplate} =
    props?.route?.params;
  const inputRef = useRef(null);
  const isBackClicked = useRef(null);
  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const netInfo = useNetInfo();
  const [loading, setLoading] = useState(false);

  const [headerTitleFocused, setHeaderTitleFocused] = useState(false);
  const [headerTitleInput, setHeaderTitleInput] = useState('');
  const [headerTitle, setHeaderTitle] = useState(headerName);
  const [sheetEnabled, setSheetEnabled] = useState(false);
  const [addTag, setAddTag] = useState(false);
  const [deleteEnable, setdeleteEnable] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [isEdited, setisEdited] = useState(false);
  // ref
  const bottomSheetModalRef = useRef(null);

  // variables
  const snapPoints = useMemo(
    () => [
      SCREEN_WIDTH / 3.5 + BOTTOM_SPACE,
      SCREEN_WIDTH / 3.5 + BOTTOM_SPACE,
    ],
    [],
  );

  const handleSheetChanges = useCallback(index => {
    if (index == -1) {
      setSheetEnabled(false);

      bottomSheetModalRef.current?.dismiss?.();
    }
  }, []);

  const deleteTemplateHandler = () => {
    if (!data.length) {
      props.navigation.goBack();
      return;
    }

    let params = {
      id: id,
    };

    if (netInfo.isConnected === false) {
      ToastMessage('Network issue :(', 'Please Check Your Network !');
      return;
    }

    setLoading(true), dispatch(DeleteTemplate(params));
  };

  const confirmDeletion = () => {
    Alert.alert(
      'Delete Template',
      'Are you sure, you want to delete this option?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => deleteTemplateHandler()},
      ],
    );
  };

  const addContentItem = ({item, index}) => {
    console.log(templates, 'ftyugihoj');
    let disable = true;
    templates.map(t => {
      if (t.notes.length) {
        disable = false;
      }
    });
    return (
      <Pressable
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
        }}
        onPress={() => {
          setSheetEnabled(false);
          bottomSheetModalRef.current?.dismiss?.();
          if (item.key === 'Tags') {
            setAddTag(!addTag);
            setdeleteEnable(false);
          } else if (item.key === 'Delete') {
            // confirmDeletion();
            setAddTag(false);
            setdeleteEnable(!deleteEnable);
          }
        }}
        disabled={disable}>
        {/* <Image source={item.image}/> */}
        <View
          style={{
            opacity: disable ? 0.5 : 1,
          }}>
          {item.icon}
        </View>
        <Text
          style={{
            ...globalStyles.regularLargeText,
            marginStart: scale(16),
            color: disable ? '#929292' : colors.text,
          }}>
          {item.key === 'Tags'
            ? addTag
              ? 'Remove name tag'
              : 'Add name tag'
            : item.key === 'Delete'
            ? !deleteEnable
              ? 'Delete'
              : 'Remove Delete'
            : item.label}
        </Text>
      </Pressable>
    );
  };

  const itemContentSeparatorComponent = () => {
    return (
      <View
        style={{
          height: 1.5,
          backgroundColor: colors.red4,
          marginVertical: scale(10),
          marginHorizontal: 16,
        }}
      />
    );
  };

  const TitleHeader = () => {
    return (
      <>
        {headerTitleFocused ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1.5,
              borderColor: colors.red4,
              borderRadius: scale(10),
              paddingEnd: scale(10),
              flex: 1,
            }}>
            <TextInput
              maxLength={19}
              placeholder="Add Title"
              placeholderTextColor={colors.grey9}
              value={headerTitleInput}
              onChangeText={text => setHeaderTitleInput(text)}
              style={{
                paddingVertical: scale(8),
                paddingHorizontal: scale(10),
                flex: 1,
                ...globalStyles.regularLargeText,
              }}
              onBlur={() => setHeaderTitleFocused(false)}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={({nativeEvent: {text, eventCount, target}}) => {
                if (headerTitleInput.trim().length !== 0) {
                  setHeaderTitleFocused(!headerTitleFocused);
                  setHeaderTitle(headerTitleInput);
                }
              }}
            />
            <Pressable
              hitSlop={15}
              onPress={() => setHeaderTitleFocused(!headerTitleFocused)}>
              <BlueCloseCircleIconSvg />
            </Pressable>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: scale(10),
            }}>
            <View style={{maxWidth: SCREEN_WIDTH - 120, marginRight: 10}}>
              <Text
                style={{
                  ...globalStyles.standardLargeText,
                  fontSize: scale(26),
                  lineHeight: scale(39),
                }}
                numberOfLines={1}>
                {headerTitle}
              </Text>
            </View>
            <Pressable
              style={{marginEnd: scale(12)}}
              hitSlop={15}
              onPress={() => {
                if (VARIABLES.disableTouch) {
                  ToastMessage(
                    'You can’t edit a template as you are not connected to any partner yet',
                  );
                  return;
                }
                setHeaderTitleInput(headerTitle || '');
                setHeaderTitleFocused(!headerTitleFocused);
                setisEdited(true);
              }}>
              <LargeEditIconSvg />
            </Pressable>
          </View>
        )}
      </>
    );
  };
  const AppHeader = () => {
    return (
      <CornerHeader
        leftIcon={
          <Image
            source={APP_IMAGE.backImage}
            style={{
              width: 24,
              height: 24,
            }}
          />
        }
        leftPress={async () => {
          Keyboard.dismiss();
          if (isBackClicked.current) {
            return;
          }
          isBackClicked.current = true;
          // await delay(1000);
          if (deleteEnable || addTag) {
            Alert.alert('Leave', 'Are you sure you want to go back?', [
              {
                text: 'Cancel',
                onPress: () => {
                  isBackClicked.current = false;
                },
                style: 'cancel',
              },
              {text: 'OK', onPress: () => props.navigation.goBack()},
            ]);
            return;
          }
          let isListPResent = false;
          const currentTemplateState = await getStateDataAsync(setTemplates);
          const currentEditedState = await getStateDataAsync(setisEdited);
          currentTemplateState.map(t => {
            if (t.notes.length) {
              isListPResent = true;
            }
          });
          if (!isListPResent) {
            if (!newTemplate) {
              ToastMessage('Cannot save an empty list');
            } else {
              props.navigation.goBack();
            }
            return;
          }
          if (!newTemplate) {
            if (currentEditedState) {
              editTemplateHandler();
            } else {
              //  editTemplateHandler();
              props.navigation.goBack();
            }
          } else {
            addTemplateHandler();
          }
        }}
        titleBox={TitleHeader()}
        rightIcon={
          true && (
            <Pressable
              onPress={() => {
                if (VARIABLES.disableTouch) {
                  isBackClicked.current = false;
                  ToastMessage(
                    'You can’t edit templates as you are not connected to any partner yet',
                  );
                  return;
                }
                Keyboard.dismiss();
                setSheetEnabled(true);
                bottomSheetModalRef.current?.present?.();
              }}>
              <MoreVerticleIconSvg fill={'rgb(128, 126, 138)'} />
              {/* <Menu
                visible={visible}
                onRequestClose={() => setVisible(false)}
                anchor={
                  <Pressable onPress={() => setVisible(true)}>
                  </Pressable>
                }
                // style={{margin:20,marginTop:80}}
              >
                <MenuItem
                  textStyle={{color: '#000'}}
                  onPress={() => confirmDeletion()}>
                  Delete
                </MenuItem>
              </Menu> */}
            </Pressable>
          )
        }
        // rightPress={menuHandler}
        // titleStyle={styles.headerTitleStyle}
      />
    );
  };

  const removeNoteConfirmation = index => {
    if (VARIABLES.disableTouch) {
      isBackClicked.current = false;
      ToastMessage(
        'You can’t edit templates as you are not connected to any partner yet',
      );
      return;
    }
    Alert.alert(
      'Delete Template Option',
      'Are you sure, you want to delete this option?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => removeNoteHandler(index)},
      ],
    );
  };

  const removeNoteHandler = index => {
    if (templates.length === 1) {
      isBackClicked.current = false;
      ToastMessage('Minimum one template required');
      return;
    }
    const newTemplates = cloneDeep(templates);
    const newList = newTemplates.filter((item, idx) => index !== idx);
    setisEdited(true);
    setTemplates(newList);
  };

  const templateItem = ({item, index}) => {
    console.log(item.title, 'crfyvgubhijknlm');
    return (
      <TemplateItem
        item={item}
        title={item.title}
        index={index}
        addTag={addTag}
        deleteEnable={deleteEnable}
        removeNoteConfirmation={removeNoteConfirmation}
        setTemplates={tempData => {
          setisEdited(true);
          setTemplates(tempData);
        }}
        styles={styles}
        templateImages={templateImages}
        templates={templates}
      />
    );
  };

  const itemSeparatorComponent = () => {
    return <View style={{height: 36}} />;
  };

  const Footer = () => {
    return <View style={{height: 20}} />;
  };

  const addTemplateHandler = async () => {
    const newTemplateData = await getStateDataAsync(setTemplates);
    let params = {
      id: id,
      items: newTemplateData.map(item => {
        return {
          ...item,
          notes: item.notes.map(element => {
            const obj = {
              note: element.note,
              tag: element.tag,
              isMarked: element.isMarked,
              createdBy: element?.createdBy || VARIABLES.user._id,
            };
            if (element.isMarked) {
              obj.markedBy = element?.markedBy || VARIABLES.user._id;
            }
            return obj;
          }),
          templateIcon: item.templateIcon,
        };
      }),
      name: headerTitle,
    };

    if (netInfo.isConnected === false) {
      isBackClicked.current = false;
      alert('Network issue :(', 'Please Check Your Network !');
      return;
    }

    CleverTap.recordEvent(`Template ${headerName} used`);
    setLoading(true), dispatch(AddTemplate(params));
  };

  const editTemplateHandler = async () => {
    const newTemplateData = await getStateDataAsync(setTemplates);
    let params = {
      templateId: id,
      items: newTemplateData.map(item => {
        return {
          ...item,
          notes: item.notes.map(element => {
            const obj = {
              note: element.note,
              tag: element.tag,
              isMarked: element.isMarked,
              createdBy: element?.createdBy || VARIABLES.user._id,
            };
            if (element.isMarked) {
              obj.markedBy = element?.markedBy || VARIABLES.user._id;
            }
            return obj;
            // return {
            //   note: element.note,
            //   tag: element.tag,
            //   isMarked: element.isMarked,
            //   createdBy: element.createdBy || VARIABLES.user._id,
            // };
          }),
          templateIcon: item.templateIcon,
        };
      }),
      name: headerTitle,
    };

    if (netInfo.isConnected === false) {
      isBackClicked.current = false;
      alert('Network issue :(', 'Please Check Your Network !');
      return;
    }
    console.log('template params', JSON.stringify(params));
    setLoading(true), dispatch(EditTemplate(params));
  };

  useEffect(() => {
    props.navigation.addListener('beforeRemove', e => {
      if (isBackClicked.current) {
        return;
      }
      EventRegister.emit('addNewTemplate', {
        setTemplates,
        setHeaderTitle,
        id,
        newTemplate,
        setisEdited,
      });
    });
    return () => {};
  }, []);

  useEffect(() => {
    if (state.reducer.case === actions.ADD_TEMPLATE_SUCCESS) {
      CleverTap.recordEvent('Templates used');

      if (state?.status?.name === 'Plan a trip') {
        CleverTap.recordEvent('Templates Travel');
      } else if (state?.status?.name === 'Weekends') {
        CleverTap.recordEvent('Templates Weekend');
      } else if (state?.status?.name === 'Watchlist') {
        CleverTap.recordEvent('Templates Watchlist');
      } else if (state?.status?.name === 'Dineout') {
        CleverTap.recordEvent('Templates Dineout');
      }

      setLoading(false);
      ToastMessage('Template saved successfully');
      props.navigation.goBack();
      dispatch(ClearAction());
      EventRegister.emit('changeList');
    } else if (state.reducer.case === actions.ADD_TEMPLATE_FAILURE) {
      console.log('ERROR-FAILURE', state);
      isBackClicked.current = false;
      setLoading(false);
      alert(state.reducer.message);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.EDIT_TEMPLATE_SUCCESS) {
      EventRegister.emit('changeList');
      setLoading(false);
      ToastMessage('Template updated successfully');
      dispatch(GetTemplates());
      props.navigation.goBack();
      // alert('Registered Successfully');
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.EDIT_TEMPLATE_FAILURE) {
      console.log('ERROR-FAILURE', state);
      isBackClicked.current = false;
      setLoading(false);
      alert(state.reducer.message);
      isBackClicked.current = false;
      dispatch(ClearAction());
    }
    // else if (state.reducer.case === actions.EDIT_TEMPLATE_SUCCESS) {
    //     setLoading(false)
    //     // alert('Registered Successfully');
    //     dispatch(ClearAction())
    // }
    // else if (state.reducer.case === actions.EDIT_TEMPLATE_FAILURE) {
    //     console.log('ERROR-FAILURE', state)
    //     setLoading(false)
    //     alert(state.message)
    //     dispatch(ClearAction())
    // }
    else if (state.reducer.case === actions.DELETE_TEMPLATE_SUCCESS) {
      setLoading(false);
      alert('Removed Successfully');
      // setPrevTemplates(TEMPLATES)
      dispatch(GetTemplates());
      props.navigation.goBack();
      EventRegister.emit('deleteTemplate', {data: TEMPLATES});
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.DELETE_TEMPLATE_FAILURE) {
      console.log('ERROR-FAILURE', state);
      isBackClicked.current = false;
      setLoading(false);
      alert(state.reducer.message);
      dispatch(ClearAction());
    }
  }, [state]);

  useEffect(() => {
    if (data && data.length > 0) {
      setTemplates(cloneDeep(data));
    }
  }, []);

  return (
    <>
      <AppView
        scrollContainerRequired={false}
        isScrollEnabled={false}
        header={AppHeader}>
        <OverlayLoader visible={loading} />

        <View style={{...globalStyles.apphorizontalSpacing, marginTop: 12}}>
          <FlatList
            renderScrollComponent={props => (
              <KeyboardAwareScrollView disableScrollOnKeyboardHide {...props} />
            )}
            data={templates}
            renderItem={templateItem}
            keyExtractor={(item, index) => index}
            contentContainerStyle={{
              paddingTop: scale(20),
              paddingBottom: 100,
            }}
            ItemSeparatorComponent={itemSeparatorComponent}
            ListFooterComponent={Footer}
          />
        </View>
      </AppView>
      {(addTag || deleteEnable) && (
        <AppButton
          text="Done"
          style={{margin: scale(16), marginTop: 0, marginBottom: 24}}
          onPress={() => {
            setAddTag(false);
            setdeleteEnable(false);
          }}
        />
      )}
      <View>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          backgroundStyle={{
            backgroundColor: '#F5F1F0',
          }}>
          <BottomSheetFlatList
            data={CONTENT}
            keyExtractor={(i, index) => index}
            renderItem={addContentItem}
            contentContainerStyle={{...styles.contentContainer}}
            ItemSeparatorComponent={itemContentSeparatorComponent}
            style={{
              marginTop: 8,
            }}
          />
        </BottomSheetModal>
      </View>
      {sheetEnabled && (
        <Pressable
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
          }}
          onPress={() => {
            setSheetEnabled(false);
            bottomSheetModalRef.current.dismiss?.();
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  headerTitleStyle: {
    ...globalStyles.semiBoldLargeText,
    fontSize: scale(24),
    // color: colors.blue1
  },
  templateItemContainer: {
    backgroundColor: colors.red2,
    borderRadius: scale(10),
  },
  templateTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  templateItem: {
    ...globalStyles.semiBoldLargeText,
    fontSize: scale(20),
    marginTop: scale(4),
    // fontWeight:500,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    margin: 0,
    padding: 0,
    marginStart: scale(8),
    paddingVertical: scale(10),
    ...globalStyles.regularLargeText,
    fontSize: scale(18),
    marginTop: Platform.OS === 'android' ? 2 : 0,
  },
  gradientContainer: {
    position: 'absolute',
    top: -scale(24),
    left: scale(16),
  },

  templateGradientIcon: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(21),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: scale(4),
    borderColor: colors.primary,
    // marginBottom: -20,
    // marginTop: -8
  },
  editByUser: {
    backgroundColor: colors.red4,
    borderRadius: scale(20),
    padding: 2,
    paddingHorizontal: scale(6),
    position: 'absolute',
    top: -2,
    right: scale(20),
    flexDirection: 'row',
    alignItems: 'center',
  },
  user: {
    ...globalStyles.regularSmallText,
    fontSize: scale(10),
    color: colors.red3,
  },
  sepratorLine: {
    height: scale(10),
    marginHorizontal: scale(4),
    width: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.11)',
  },
  listItemInput: {
    ...globalStyles.regularLargeText,
    fontSize: scale(18),
    margin: 0,
    padding: 0,
    marginStart: scale(8),
    flex: 1,
    marginTop: Platform.OS === 'android' ? 2 : 0,
  },
});
