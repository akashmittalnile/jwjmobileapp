/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import Wrapper from '../Wrapper/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import defaultImage from '../../assets/Icons/meditation.png';
import user from '../../assets/Icons/user.png';
import editIcon from '../../assets/Icons/edit.png';
import tarshIcon from '../../assets/Icons/trash.png';
import shareIcon from '../../assets/Icons/share.png';
import IconButton from '../Button/IconButton';
import SvgUri from 'react-native-svg-uri';
import Skeleton from '../Skeleton/Skeleton';
import FastImage from 'react-native-fast-image';
import moment from 'moment';

interface RoutineListItemDetailsProps {
  myRoutine: boolean;
  id: number;
  imageUri?: string;
  headerText?: string;
  headerDate?: string;
  descriptionHeading?: string;
  description?: string;
  routineType?: string;
  sharedBy?: string;
  onClick?: () => void;
  totalShare?: number;
  showShareButton?: boolean;
  editButtonHandler?: () => void;
  shareButtonHandler?: () => void;
  showSharedUserList?: boolean;
  showSharedUserListHandler?: () => void;
  shareMemberList?: any[];
  loader?: boolean;
  deleteHandler?: () => void;
}

const userIcon = Image.resolveAssetSource(user).uri;
const editIconPath = Image.resolveAssetSource(editIcon).uri;
const tarshIconPath = Image.resolveAssetSource(tarshIcon).uri;
const shareIconPath = Image.resolveAssetSource(shareIcon).uri;

const RoutineListItemDetails: React.FC<RoutineListItemDetailsProps> = ({
  myRoutine,
  id,
  imageUri,
  headerText = '',
  headerDate = '',
  descriptionHeading = '',
  description = '',
  totalShare = 0,
  showShareButton = false,
  routineType = '',
  sharedBy,
  editButtonHandler,
  shareButtonHandler,
  showSharedUserList = false,
  showSharedUserListHandler,
  shareMemberList,
  loader,
  deleteHandler,
}) => {
  const defaultImagePath = Image.resolveAssetSource(defaultImage).uri;
  let imageType;
  if (imageUri) {
    const temp = imageUri?.split('.');
    if (temp?.length > 0) {
      imageType = temp[temp?.length - 1];
    }
  }

  const deleteButtonHandler = async () => {
    deleteHandler && deleteHandler();
  };

  const _showSharedUserListHandler = () => {
    showSharedUserListHandler && showSharedUserListHandler();
  };

  return (
    <Wrapper containerStyle={styles.wrapper}>
      {descriptionHeading ? (
        <>
          <View style={styles.header}>
            <View style={styles.imgContainer}>
              <View
                style={{
                  height: responsiveHeight(6),
                  width: responsiveHeight(6),
                }}>
                {imageUri &&
                  (imageType === 'svg' ? (
                    <SvgUri
                      source={{uri: imageUri}}
                      height={responsiveHeight(6)}
                      width={responsiveHeight(6)}
                    />
                  ) : (
                    <FastImage
                      source={{
                        uri: imageUri,
                        priority: FastImage.priority.high,
                      }}
                      style={styles.img}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                  ))}
              </View>
              <View>
                <Text style={styles.textBold}>{headerText}</Text>
                {routineType && (
                  <Text style={{...styles.routineTypeText, fontWeight: '500'}}>
                    {routineType}
                  </Text>
                )}
                {sharedBy && (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                    }}>
                    <Text style={{...styles.routineTypeText}}>by</Text>
                    <Text
                      style={{
                        ...styles.routineTypeText,
                        color: 'black',
                        marginLeft: responsiveWidth(1),
                      }}>
                      {sharedBy}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <Text style={styles.text}>
              {' '}
              {moment(headerDate, 'DD MMM, YYYY hh:mm A').format(
                'MMM DD, YYYY',
              ) +
                ' ' +
                moment(headerDate, 'DD MMM, YYYY hh:mm A').format('hh:mm A')}
            </Text>
          </View>
          <View style={{width: '100%'}}>
            <Text style={styles.routineText}>{descriptionHeading}</Text>
            <Text
              style={{
                ...styles.routineText,
                color: globalStyles.textGray,
                lineHeight: 20,
              }}>
              {description}
            </Text>
          </View>
        </>
      ) : (
        <Skeleton />
      )}
      {totalShare > 0 && (
        <View style={styles.tabMembersContainer}>
          <TouchableOpacity
            onPress={_showSharedUserListHandler}
            disabled={!showSharedUserList}
            style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                flex: 1,
                position: 'relative',
                height: responsiveHeight(5),
                width: responsiveHeight(5),
              }}>
              <View style={styles.tabMemberContainer}>
                <FastImage
                  source={{
                    uri: shareMemberList[0]?.share_to_user_profile || userIcon,
                    priority: FastImage.priority.high,
                  }}
                  style={[
                    styles.memberImg,
                    {left: responsiveWidth(1), zIndex: 1000},
                  ]}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </View>
              <View style={styles.tabMemberContainer}>
                <FastImage
                  source={{
                    uri: shareMemberList[1]?.share_to_user_profile || userIcon,
                    priority: FastImage.priority.high,
                  }}
                  style={[
                    styles.memberImg,
                    {left: responsiveWidth(3.3), zIndex: 2000},
                  ]}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </View>
            </View>
            <Text
              style={{
                flex: 7,
                color: 'black',
                marginLeft: responsiveWidth(5),
              }}>{`Shared To ${totalShare} ${
              totalShare === 1 ? 'Member' : 'Members'
            }`}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* buttons */}
      <View style={styles.buttonContainer}>
        {showShareButton && (
          <IconButton
            text="Share"
            style={{...styles.iconButton, backgroundColor: '#505A61'}}
            iconUri={shareIconPath}
            onPress={shareButtonHandler}
            textStyle={{color: 'white'}}
          />
        )}
        {myRoutine && (
          <IconButton
            text="Edit"
            style={styles.iconButton}
            iconUri={editIconPath}
            onPress={editButtonHandler}
            textStyle={{color: 'white'}}
          />
        )}
        {myRoutine && (
          <IconButton
            text="Delete"
            style={{...styles.iconButton, backgroundColor: 'red'}}
            iconUri={tarshIconPath}
            onPress={deleteButtonHandler}
            textStyle={{color: 'white'}}
            loader={loader}
          />
        )}
      </View>
    </Wrapper>
  );
};

export default RoutineListItemDetails;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: responsiveHeight(2),
    paddingTop: responsiveHeight(1.2),
    paddingBottom: responsiveHeight(1.5),
    width: '100%',
    borderRadius: responsiveWidth(2),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveHeight(1),
    paddingHorizontal: '2%',
    width: '100%',
  },
  imgContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: responsiveHeight(7),
  },
  img: {
    height: responsiveHeight(7),
    width: responsiveHeight(7),
  },
  routineText: {
    marginBottom: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(2),
    width: '100%',
    fontSize: responsiveFontSize(1.8),
    fontWeight: '500',
    color: 'black',
  },
  textBold: {
    fontSize: responsiveFontSize(1.6),
    color: 'black',
    textAlignVertical: 'center',
    marginLeft: responsiveWidth(2),
  },
  routineTypeText: {
    marginTop: responsiveHeight(0),
    marginLeft: responsiveWidth(2),
    color: globalStyles.themeBlue,
    fontSize: responsiveFontSize(1.5),
  },
  text: {
    fontSize: responsiveFontSize(1.2),
    color: globalStyles.lightGray,
    textAlignVertical: 'center',
  },
  tabMembersContainer: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: responsiveHeight(1.2),
  },
  tabMemberContainer: {
    position: 'absolute',
    height: responsiveHeight(5),
    width: responsiveHeight(5),
    marginRight: responsiveWidth(1),
    borderRadius: responsiveWidth(2.5),
    // overflow: 'hidden',
  },
  memberImg: {
    height: responsiveHeight(5),
    width: responsiveHeight(5),
    borderRadius: responsiveHeight(2.5),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: responsiveHeight(2),
    width: '100%',
  },
  iconButton: {
    marginLeft: '1.75%',
    height: responsiveHeight(5),
    width: '31%',
    backgroundColor: globalStyles.themeBlue,
  },
});
