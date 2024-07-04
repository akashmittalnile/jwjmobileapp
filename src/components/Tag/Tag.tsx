import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Keyboard,
  TouchableOpacity,
  Image,
  ViewStyle,
} from 'react-native';
import React from 'react';
import Wrapper from '../Wrapper/Wrapper';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import {GetApiWithToken, endPoint} from '../../services/Service';
import {useAppSelector} from '../../redux/Store';

let timerId: any;

interface TagProps {
  edit?: boolean;
  value: any[];
  tagHandler?: (tags: {}[], isValid?: boolean) => void;
  style?: ViewStyle;
  disableButtons?: boolean;
}

const Tag: React.FC<TagProps> = ({
  tagHandler,
  style,
  disableButtons,
  value,
  edit = false,
}) => {
  const token = useAppSelector(state => state.auth.token);
  const [criteria, setCriteria] = React.useState<
    {id: number | string; name: string}[]
  >([]);
  const [editCriteria, setEditCriteria] = React.useState<
    {id: number | string; name: string}[]
  >([]);
  const [openList, setOpenList] = React.useState<boolean>(false);
  const [tempList, setTempList] = React.useState<string[]>([]);
  const [loader, setLoader] = React.useState<boolean>(false);
  const [inputValue, setInputValue] = React.useState<string>('');

  React.useEffect(() => {
    if (value) {
      const temp = value?.map(item => ({...item, editable: true}));
      setCriteria(temp);
      tagHandler && tagHandler([], true);
    }
    handleDebounce('');
  }, [edit]);

  const getData = async (text?: string) => {
    try {
      const response = await GetApiWithToken(
        text ? `${endPoint.searchCriteria}${text}` : endPoint.searchCriteria,
        token,
      );
      return response?.data;
    } catch (err: any) {
      console.log('err in get criteria', err.message);
      return {status: false, message: err.message};
    }
  };

  const handleDebounce = async (value: string) => {
    try {
      setLoader(true);
      const response = await getData(value);
      if (response?.status) {
        setTempList(response?.data);
      }
    } catch (err: any) {
      console.log('err in criteria tag', err.message);
    } finally {
      setLoader(false);
    }
  };

  const handleChange = (inputText: string) => {
    setInputValue(inputText?.trimStart());
    if (inputText?.trimStart()?.includes(' ')) {
      criteriaHandler(inputText?.trim(), inputText?.trim());
      setInputValue('');
    }
    const debounceTime = 500;
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      handleDebounce(inputText);
    }, debounceTime);
  };

  const getTagsOnFocus = async () => {
    try {
      if (criteria.length === 0) {
        setLoader(true);
        const response = await getData();
        if (response?.status) {
          response.data.length > 0 && setOpenList(true);
          response.data.length > 0 && setTempList(response.data);
        }
      }
    } catch (err: any) {
      console.log('err in criteria list on focus', err.message);
    } finally {
      setLoader(false);
    }
  };

  const criteriaHandler = (name: any, id: number | string) => {
    let result: any = [];
    if (edit) {
      let isEditCriteriaIncludes = false;
      let isCriteriaIncludes = false;
      for (
        let i = 0;
        i <
        (editCriteria?.length > criteria?.length
          ? editCriteria?.length
          : criteria?.length);
        i++
      ) {
        if (editCriteria[i]?.id === id) {
          isEditCriteriaIncludes = true;
        }
        if (criteria[i]?.id === id) {
          isCriteriaIncludes = true;
        }
      }
      if (isEditCriteriaIncludes && !isCriteriaIncludes) {
        const temp = editCriteria.filter(item => item?.id !== id);
        result = temp;
        setEditCriteria(temp);
      } else if (!isEditCriteriaIncludes && !isCriteriaIncludes) {
        result = [...editCriteria, {id, name}];
        setEditCriteria(preData => [...preData, {id, name}]);
      }
    }
    let isAvailable = false;
    for (let i = 0; i < criteria?.length; i++) {
      if (criteria[i]?.id === id) {
        isAvailable = true;
        break;
      }
    }
    if (!isAvailable && !edit) {
      result = [...criteria, {id, name}];
    }
    tagHandler && !isAvailable && tagHandler(result);
    !isAvailable && setCriteria(preData => [...preData, {id, name}]);
  };

  const deletetagHandler = (id: number, name: string) => {
    let result: any = [];
    if (edit) {
      const temp = value?.filter((item: any) => item?.id === id);
      if (temp?.length > 0) {
        result = [...editCriteria, {id, name, editable: true}];
        setEditCriteria(preData => [...preData, {id, name, editable: true}]);
      } else {
        const _temp = editCriteria?.filter(
          (item: any) => item?.id !== id && item?.name != name,
        );
        result = _temp;
        setEditCriteria(_temp);
      }
    }
    const temp = criteria?.filter(
      (item: any) => item?.id !== id && item?.name != name,
    );
    if (!edit) {
      result = temp;
    }
    tagHandler && tagHandler(result);
    setCriteria(temp);
  };

  return (
    <Wrapper containerStyle={{...styles.wrapper, ...style}}>
      <TextInput
        value={inputValue}
        placeholder="Type Search Criteria Tag Here…"
        placeholderTextColor={globalStyles.textGray}
        style={styles.textInputCriteria}
        multiline={true}
        onChangeText={handleChange}
        onFocus={getTagsOnFocus}
        onBlur={() => {
          setTempList([]);
        }}
        blurOnSubmit={true}
        onSubmitEditing={() => {
          Keyboard.dismiss();
        }}
        // onKeyPress={value => {
        //   customCriteriaHandler(value);
        // }}
        returnKeyType="done"
        editable={!disableButtons}
      />
      <View style={styles.criteriaButtonsContainer}>
        {criteria.length > 0 &&
          criteria?.map((item: any, index: number) => (
            <View
              style={{position: 'relative', marginBottom: responsiveHeight(1.5)}}
              key={item.id + item?.name + index}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{item?.name}</Text>
              </View>
              <TouchableOpacity
                style={styles.cancel}
                onPress={() => {
                  deletetagHandler(item?.id, item?.name);
                }}
                disabled={disableButtons}>
                <Image
                  source={require('../../assets/Icons/cancel.png')}
                  resizeMode="contain"
                  style={{
                    height: responsiveHeight(2.5),
                    width: responsiveHeight(2.5),
                  }}
                />
              </TouchableOpacity>
            </View>
          ))}
      </View>
      <Text style={styles.criteriaText}>
        {/* Add Comma To Separate Tag Ex: Event, */}
        Use spacebar to add more tags
      </Text>
      <View style={styles.criteriaButtonsContainer}>
        {loader && (
          <View style={{width: '100%'}}>
            <ActivityIndicator color={globalStyles.themeBlue} />
          </View>
        )}
        {!loader &&
          tempList?.map((item: any, index: number) => (
            <View style={styles.tagButton} key={item?.name + item?.id}>
              <TouchableOpacity
                disabled={disableButtons}
                style={{padding: 10}}
                onPress={() => {
                  criteriaHandler(item?.name, item?.id);
                }}>
                <Text style={styles.tagButtonText}>{item?.name}</Text>
              </TouchableOpacity>
            </View>
          ))}
      </View>
    </Wrapper>
  );
};

export default React.memo(Tag);

const styles = StyleSheet.create({
  wrapper: {
    marginTop: responsiveHeight(2),
    paddingTop: responsiveHeight(2),
    paddingBottom: responsiveHeight(2),
    borderRadius: responsiveWidth(2),
    width: '100%',
    borderWidth: responsiveWidth(0.23),
  },
  tag: {
    backgroundColor: globalStyles.themeBlue,
    paddingHorizontal: responsiveWidth(2),
    paddingVertical: responsiveHeight(1),
    marginRight: responsiveWidth(3),
    borderRadius: responsiveWidth(2),
  },
  tagText: {
    color: 'white',
    fontSize: responsiveFontSize(1.6),
    fontWeight: '500',
  },
  textInputCriteria: {
    padding: responsiveWidth(3),
    width: '100%',
    fontSize: responsiveFontSize(1.6),
    minHeight: responsiveHeight(5),
    borderBottomWidth: responsiveHeight(0.1),
    borderBottomColor: globalStyles.lightGray,
    color: 'black'
  },
  criteriaText: {
    paddingLeft: responsiveWidth(3),
    fontSize: responsiveFontSize(1.6),
    fontWeight: '500',
    color: globalStyles.textGray,
    width: '100%',
    letterSpacing: 0.5,
  },
  criteriaButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: responsiveHeight(1),
    paddingLeft: responsiveWidth(3),
    width: '100%',
  },
  criteriaButtonStyle: {
    width: 'auto',
    height: responsiveHeight(4),
    paddingHorizontal: responsiveWidth(2),
    marginRight: responsiveWidth(3),
    borderWidth: responsiveWidth(0.2),
  },
  criteriaButtonTextStyle: {
    fontSize: responsiveFontSize(1.4),
    fontWeight: '600',
  },
  tagButton: {
    position: 'relative',
    marginBottom: responsiveHeight(0.5),
    marginRight: responsiveWidth(3),
    borderRadius: responsiveWidth(2),
    borderWidth: 1,
    borderColor: globalStyles.lightGray,
  },
  tagButtonText: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: '600',
    letterSpacing: 0.8,
    color: globalStyles.themeBlue,
  },
  cancel: {
    position: 'absolute',
    top: responsiveHeight(-1),
    right: responsiveHeight(0.5),
  },
});
