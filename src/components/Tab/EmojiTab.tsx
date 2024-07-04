/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Image,
  ImageStyle,
  Modal,
  Alert,
} from 'react-native';
import React from 'react';
import Wrapper from '../Wrapper/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import defaultImage from '../../assets/Icons/happy.png';
import {globalStyles} from '../../utils/constant';
import FastImage from 'react-native-fast-image';
import IconButton from '../Button/IconButton';
import editIcon from '../../assets/Icons/edit.png';
import trashIcon from '../../assets/Icons/trash.png';
import {DeleteApi, endPoint} from '../../services/Service';
import {useAppDispatch, useAppSelector} from '../../redux/Store';
import Toast from 'react-native-toast-message';
import {reloadHandler} from '../../redux/ReloadScreen';
import ScreenNames from '../../utils/ScreenNames';
import {useNavigation} from '@react-navigation/native';
import DeleteModal from '../Modal/DeleteModal';
import moment from 'moment';

interface EmojiTabProps {
  data?: any;
  id: number;
  imageUri?: string;
  showHeader?: boolean;
  headerText?: string;
  headerTextStyle?: TextStyle;
  headerButtonContainerStyle?: ViewStyle;
  headerButtonText?: string;
  headerButtonTextStyle?: TextStyle;
  headerButtonStyle?: ViewStyle;
  iconStyle?: ImageStyle;
  emojiText?: string;
  description?: string;
  date?: string;
  onClick?: () => void;
  heading?: string;
  isEditable?: boolean;
  isDeletable?: boolean;
}

const EmojiTab: React.FC<EmojiTabProps> = ({
  data,
  id,
  imageUri,
  showHeader = true,
  headerText,
  headerTextStyle,
  headerButtonStyle,
  headerButtonText,
  headerButtonTextStyle,
  headerButtonContainerStyle,
  iconStyle,
  emojiText,
  description,
  date,
  onClick,
  heading = '',
  isEditable = true,
  isDeletable = true,
}) => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(state => state.auth.token);
  const reload = useAppSelector(state => state.reload);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [loader, setLoader] = React.useState<{delete: boolean}>({
    delete: false,
  });

  const defaultImagePath = Image.resolveAssetSource(defaultImage).uri;
  const editIconPath = Image.resolveAssetSource(editIcon).uri;
  const deleteIconPath = Image.resolveAssetSource(trashIcon).uri;

  const editHandler = () => {
    navigation.navigate(ScreenNames.AddNewJournals, {data});
  };

  const _deleteHandler = () => {
    setModalVisible(true);
  };

  const deleteHandler = async () => {
    setModalVisible(true);
    setLoader(preData => ({...preData, delete: true}));
    try {
      const response = await DeleteApi(
        `${endPoint.deleteJournal}?id=${id}`,
        token,
      );
      if (response?.data?.status) {
        dispatch(
          reloadHandler({
            [ScreenNames.Journals]: !reload.Journals,
            [ScreenNames.Search]: !reload.Search,
            [ScreenNames.Home]: !reload.Home,
          }),
        );
      }
      Toast.show({
        type: response?.data?.status ? 'success' : 'error',
        text1: response?.data?.message,
      });
    } catch (err: any) {
      console.log('err in deleting journal', err?.message);
    } finally {
      setLoader(preData => ({...preData, delete: false}));
      setModalVisible(false);
    }
  };
  return (
    <View>
      <Wrapper containerStyle={styles.Wrapper}>
        {showHeader && (
          <View style={styles.header}>
            <Text numberOfLines={1} style={[styles.text, headerTextStyle]}>
              {headerText}
            </Text>
            <View
              style={[
                styles.headerButtonContainer,
                headerButtonContainerStyle,
              ]}>
              {isEditable && (
                <IconButton
                  iconUri={editIconPath}
                  onPress={editHandler}
                  style={{...styles.touch, width: responsiveWidth(10)}}
                />
              )}
              {isDeletable && (
                <IconButton
                  iconUri={deleteIconPath}
                  onPress={_deleteHandler}
                  style={{
                    ...styles.touch,
                    width: responsiveWidth(10),
                    backgroundColor: 'red',
                  }}
                />
              )}
              <TouchableOpacity
                style={[styles.touch, headerButtonStyle]}
                onPress={onClick}>
                <Text
                  style={[styles.headerButtonTextStyle, headerButtonTextStyle]}>
                  {' '}
                  {headerButtonText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View
          style={{
            width: '100%',
            alignItems: 'center',
            marginTop: responsiveHeight(2),
          }}>
          <View style={styles.imgTextContainer}>
            <FastImage
              source={{
                uri: imageUri ? imageUri : defaultImagePath,
                priority: FastImage.priority.high,
              }}
              style={{...styles.img, ...iconStyle}}
              resizeMode={FastImage.resizeMode.contain}
            />
            <Text style={[styles.text, {paddingLeft: responsiveWidth(2)}]}>
              {emojiText}
            </Text>
          </View>
          {heading && (
            <Text
              style={{
                color: 'black',
                fontWeight: '600',
                width: '100%',
                paddingHorizontal: responsiveWidth(1.5),
              }}>
              {heading}
            </Text>
          )}
          <Text style={styles.description}>{description}</Text>
          <Text style={{...styles.description, color: globalStyles.lightGray}}>
            {moment(date, 'DD MMM, YYYY hh:mm A').format('MMM DD, YYYY') +
              ' ' +
              moment(date, 'DD MMM, YYYY hh:mm A').format('hh:mm A')}
          </Text>
        </View>
      </Wrapper>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <DeleteModal
          title="Are you sure want to delete this journal?"
          loader={loader.delete}
          confirmButtonHandler={deleteHandler}
          cancelButtonHandler={() => {
            setModalVisible(false);
          }}
        />
      </Modal>
    </View>
  );
};

export default EmojiTab;

const styles = StyleSheet.create({
  Wrapper: {
    marginTop: responsiveHeight(2),
    paddingBottom: 0,
    width: '100%',
    borderRadius: responsiveWidth(2),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '95%',
    paddingBottom: responsiveHeight(0.5),
    borderBottomWidth: 0.2,
    borderBottomColor: globalStyles.lightGray,
  },
  headerButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    height: responsiveHeight(4),
    flex: 0.7,
  },
  touch: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: responsiveWidth(1),
    height: '90%',
    width: '40%',
    backgroundColor: globalStyles.themeBlue,
    borderRadius: responsiveWidth(2),
    elevation: 3,
  },
  headerButtonTextStyle: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: '500',
    color: 'white',
  },
  imgTextContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '95%',
    paddingHorizontal: responsiveWidth(1),
  },
  img: {
    height: responsiveHeight(5),
    width: responsiveWidth(8),
  },
  text: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: '500',
    color: globalStyles.textGray,
    flex: 1,
  },
  description: {
    width: '100%',
    paddingHorizontal: responsiveWidth(1.5),
    marginTop: responsiveHeight(0.5),
    fontSize: responsiveFontSize(1.5),
    letterSpacing: 1,
    marginBottom: responsiveHeight(1),
    color: globalStyles.textGray,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
});
