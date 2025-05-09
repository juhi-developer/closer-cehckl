/* eslint-disable no-shadow */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  FlatList,
  Keyboard,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {scale} from '../../../utils/metrics';
import {globalStyles} from '../../../styles/globalStyles';
import {APP_IMAGE} from '../../../utils/constants';
import UncheckedGraySvg from '../../../assets/svgs/uncheckedGraySvg';
import {colors} from '../../../styles/colors';
import CheckedTwoSvg from '../../../assets/svgs/checkedTwoSvg';
import CheckedOneSvg from '../../../assets/svgs/checkedOneSvg';
import {VARIABLES} from '../../../utils/variables';
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import {Menu, MenuItem} from 'react-native-material-menu';
import RedCrossIconSvg from '../../../assets/svgs/redCrossIconSvg';
import {cloneDeep} from 'lodash';
import {ToastMessage} from '../../../components/toastMessage';
import {delay} from '../../../utils/helpers';

let focuss;

const TemplateItem = ({
  templates,
  setTemplates,
  item,
  index,
  styles,
  removeNoteConfirmation,
  addTag,
  templateImages,
  deleteEnable,
  title: propTitle,
}) => {
  console.log(propTitle);
  const textInputRef = useRef(null);
  const [input, setInput] = useState('');
  const [title, setTitle] = useState(propTitle);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const AddTitle = () => {
    let obj = {
      ...templates[focusedIndex],
      title: title.trim().length === 0 ? templates[focusedIndex].title : title,
    };
    const prevTemplates = [...templates];
    prevTemplates[focusedIndex] = obj;
    setTemplates(prevTemplates);
  };
  useEffect(() => {
    setTitle(propTitle);
  }, [propTitle]);

  const AddListHandler = async focus => {
    if (input.trim().length > 0) {
      let listObj = {
        note: input,
        isMarked: false,
        tag: '',
        tagMenuVisible: false,
        markedBy: '',
      };

      let obj = {
        ...templates[focusedIndex],
        notes: [...templates[focusedIndex].notes, listObj],
      };
      const prevTemplates = [...templates];
      prevTemplates[focusedIndex] = obj;
      setTemplates(prevTemplates);
      setInput('');
      await delay(300);
      console.log('both index', focusedIndex, index, focuss);
      if (focuss === index && focus) {
        textInputRef?.current?.focus?.();
      }
    }
  };

  const hideMenu = (listIndex, user) => {
    // const prevTemplates = [...templates];
    // prevTemplates[index].notes[listIndex].tagMenuVisible = false;

    // setTemplates(prevTemplates);
    if (user && user !== '') {
      const prevTemplates = [...templates];
      prevTemplates[index].notes[listIndex].tag = user;
      prevTemplates[index].notes[listIndex].createdBy = user;
      setTemplates(prevTemplates);
    }
  };

  const renderListItem = ({item, index, templateIndex}) => {
    return (
      <ListItem
        element={item}
        listIndex={index}
        templateIndex={templateIndex}
        templates={templates}
        addTag={addTag}
        deleteEnable={deleteEnable}
        hideMenu={hideMenu}
        index={templateIndex}
        setTemplates={setTemplates}
        styles={styles}
      />
    );
  };
  return (
    <View
      style={{
        ...styles.templateItemContainer,
        paddingBottom: scale(14),
      }}>
      <View
        style={{
          ...styles.templateTitleContainer,
          paddingTop: scale(16),
          paddingLeft: 22,
          paddingRight: 12,
        }}>
        <HeadingEditor
          AddTitle={AddTitle}
          setFocusedIndex={() => setFocusedIndex(index)}
          propTitle={propTitle}
        />
        {deleteEnable && (
          <Pressable
            hitSlop={10}
            style={{marginTop: -scale(6), marginRight: 2}}
            onPress={() => removeNoteConfirmation(index)}>
            <Image
              source={APP_IMAGE.templateTrash}
              style={{
                width: 24,
                height: 24,
              }}
            />
          </Pressable>
        )}
      </View>
      <View style={{}}>
        {item?.notes?.length > 0 && (
          <FlatList
            data={item.notes}
            keyExtractor={(noteItem, noteIndex) => noteIndex}
            renderItem={({item: noteItem, index: todo}) =>
              renderListItem({
                item: noteItem,
                index: todo,
                templateIndex: index,
              })
            }
            style={{
              marginLeft: 8,
            }}
          />
        )}
      </View>
      <View
        style={{
          ...styles.inputContainer,
          marginLeft: 22.5,
          marginTop: 3,
        }}>
        <UncheckedGraySvg />
        <TextInput
          ref={textInputRef}
          editable={!VARIABLES.disableTouch}
          placeholder="Add your list here"
          placeholderTextColor={'#929292'}
          style={{
            ...styles.input,
            paddingVertical: addTag ? scale(10) : scale(5),
            marginRight: 50,
          }}
          multiline
          value={input}
          onChangeText={text => {
            if (text.includes('\n')) {
              AddListHandler(true);
              return;
            }
            setInput(text);
          }}
          numberOfLines={1}
          blurOnSubmit={false}
          //  blurOnSubmit={true}
          onSubmitEditing={() => AddListHandler(true)}
          returnKeyType="go"
          onBlur={() => {
            AddListHandler(false);
          }}
          onFocus={() => {
            focuss = index;
            console.log('focueddddd fix', index);
            setFocusedIndex(index);
          }}
        />
      </View>
      <View style={styles.gradientContainer}>
        <Image
          source={templateImages[item.templateIcon]}
          style={{width: scale(45), height: scale(45)}}
        />
        {/* <LinearGradient
                style={styles.templateGradientIcon}
                colors={[colors.blue6, colors.blue7]}
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}>
                <FastImage
                  source={item.templateIcon}
                  style={{width: scale(20), height: scale(20)}}
                  // resizeMode='contain'
                />
                {/* {item.icon} */}
        {/* <BagpackIconSvg/> */}
        {/* <Text style={{color:'#fff'}}>K</Text> */}
      </View>
    </View>
  );
};

export default TemplateItem;

const HeadingEditor = ({AddTitle, setFocusedIndex, propTitle}) => {
  const [title, setTitle] = useState(propTitle);
  useEffect(() => {
    setTitle(propTitle);
    return () => {};
  }, [propTitle]);

  return (
    <TextInput
      style={{
        color: '#000',
        ...globalStyles.regularLargeText,
        fontSize: scale(20),
        margin: 0,
        padding: 0,
        marginTop: 6,
        fontWeight: '500',
        flex: 1,
      }}
      maxLength={19}
      value={title}
      onChangeText={text => setTitle(text)}
      onSubmitEditing={() => AddTitle(title)}
      blurOnSubmit={false}
      editable={!VARIABLES.disableTouch}
      returnKeyType="go"
      onFocus={() => {
        setFocusedIndex();
      }}
    />
  );
};

const ListItem = ({
  element,
  listIndex,
  templateIndex,
  templates,
  styles,
  addTag,
  index,
  setTemplates,
  deleteEnable,
  hideMenu,
}) => {
  const [listInput, setListInput] = useState(element.note);
  const cretaedByUser = element.markedBy ? (
    element.markedBy === VARIABLES.user._id ? (
      VARIABLES.user.iconColor === 1 ? (
        <CheckedTwoSvg />
      ) : (
        <CheckedOneSvg />
      )
    ) : VARIABLES?.user?.partnerData?.partner?.iconColor === 1 ? (
      <CheckedTwoSvg />
    ) : (
      <CheckedOneSvg />
    )
  ) : VARIABLES.user.iconColor === 1 ? (
    <CheckedTwoSvg />
  ) : (
    <CheckedOneSvg />
  );
  const newInputs = [...templates]; // always take existing inputs globally when rendering textinput inside nested flatlist

  const [showMenu, setshowMenu] = useState(false);

  useEffect(() => {
    setListInput(element.note);
  }, [element]);

  return (
    <View>
      <View
        style={{
          ...styles.inputContainer,
          padding: scale(6),
          borderWidth: element?.tag || addTag ? 0.8 : 0,
          borderRadius: scale(4),
          borderColor: colors.red4,
          marginHorizontal: scale(10),
          marginVertical: element?.tag || addTag ? scale(8) : 3,
          flex: 1,
        }}>
        <Pressable
          onPress={() => {
            if (VARIABLES.disableTouch) {
              ToastMessage(
                'You can’t create a template as you are not connected to any partner yet',
              );
              return;
            }
            const prevTemplates = [...templates];
            prevTemplates[index].notes[listIndex].isMarked =
              !prevTemplates[index].notes[listIndex].isMarked;
            prevTemplates[index].notes[listIndex].markedBy =
              VARIABLES.user?._id;
            setTemplates(prevTemplates);
          }}
          hitSlop={{
            top: 20,
            right: 20,
            left: 20,
            bottom: 20,
          }}>
          {element.isMarked ? cretaedByUser : <UncheckedGraySvg />}
        </Pressable>
        <TextInput
          value={listInput}
          onChangeText={text => {
            if (text.includes('\n')) {
              Keyboard.dismiss();
              return;
            }
            setListInput(text);
          }}
          style={{...styles.listItemInput, marginRight: 30}}
          multiline
          editable={
            VARIABLES.disableTouch
              ? false
              : element.createdBy
              ? element.createdBy === VARIABLES.user._id
                ? true
                : false
              : true
          }
          onBlur={() => {
            if (listInput.trim().length > 0) {
              newInputs[index].notes[listIndex].note = listInput;
              setTemplates(newInputs); // for textinput inside nested flatlistit will create "dismiss keyboard" issue
            }
          }}
          onSubmitEditing={async () => {
            if (listInput.trim().length > 0) {
              newInputs[index].notes[listIndex].note = listInput;
              setTemplates(newInputs); // for textinput inside nested flatlistit will create "dismiss keyboard" issue
            }
          }}
        />
      </View>
      {(element?.tag || addTag) && (
        <View style={styles.editByUser}>
          <Pressable
            onPress={() => {
              setshowMenu(true);
            }}
            hitSlop={10}>
            <Text style={styles.user}>
              {element?.tag === ''
                ? 'Add Tag'
                : element.createdBy === VARIABLES.user._id
                ? 'You'
                : VARIABLES.user.partnerData.partner.name}
              {/* {element?.tag === '' ? 'Add Tag' : element?.tag} */}
            </Text>
            <Menu
              visible={showMenu}
              onRequestClose={() => {
                setshowMenu(false);
                hideMenu(listIndex);
              }}>
              <MenuItem
                textStyle={{color: '#000'}}
                onPress={() => {
                  hideMenu(
                    listIndex,
                    VARIABLES.user?.partnerData?.partner?._id,
                  );
                  setshowMenu(false);
                }}
                style={{...globalStyles.regularLargeText}}>
                {VARIABLES.user?.partnerData?.partner?.name
                  ? VARIABLES.user?.partnerData?.partner?.name
                  : 'Partner'}
              </MenuItem>
              <MenuItem
                textStyle={{color: '#000'}}
                onPress={() => {
                  setshowMenu(false);
                  hideMenu(listIndex, VARIABLES.user._id);
                }}
                style={{...globalStyles.regularLargeText}}>
                You
              </MenuItem>
            </Menu>
          </Pressable>
          <View style={styles.sepratorLine} />
          <Pressable
            hitSlop={10}
            onPress={() => {
              const prevTemplates = [...templates];
              prevTemplates[index].notes[listIndex].tag = '';
              setTemplates(prevTemplates);
            }}>
            <RedCrossIconSvg />
          </Pressable>
        </View>
      )}
      {deleteEnable && (
        <Pressable
          style={{
            position: 'absolute',
            top: 2,
            right: 14,
          }}
          onPress={() => {
            const newList = cloneDeep(templates);
            newList[templateIndex].notes.splice(listIndex, 1);
            setTemplates(newList);
          }}>
          <Image
            source={APP_IMAGE.templateTrash}
            style={{
              width: 24,
              height: 24,
              marginVertical: 4,
              marginStart: 8,
            }}
          />
        </Pressable>
      )}
    </View>
  );
};
