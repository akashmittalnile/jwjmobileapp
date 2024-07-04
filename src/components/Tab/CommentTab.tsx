import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React from 'react';
import Wrapper from '../Wrapper/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import userIcon from '../../assets/Icons/user.png';
import FastImage from 'react-native-fast-image';
import moment from 'moment';

interface CommentTabProps {
  id: number;
  style?: ViewStyle;
  name: string;
  date: string;
  imageUri?: string;
  comment: string;
  isReplied?: boolean;
  replyHandler?: (id: number, name: string) => void;
  editHandler?: (obj: {comment: string; id: number}) => void;
  deleteHandler?: (id: number) => void;
  isEdit?: boolean;
  isDelete?: boolean;
}

const userIconPath = Image.resolveAssetSource(userIcon).uri;
const CommentTab: React.FC<CommentTabProps> = ({
  id,
  style,
  imageUri,
  name,
  date,
  comment,
  isReplied = false,
  replyHandler,
  editHandler,
  deleteHandler,
  isEdit = false,
  isDelete = false,
}) => {
  const replyingBtn = () => {
    replyHandler && replyHandler(id, name);
  };

  const _editHandler = () => {
    if (editHandler) {
      editHandler({comment, id});
    }
  };

  const _deleteHandler = () => {
    if (deleteHandler) {
      deleteHandler(id);
    }
  };

  return (
    <Wrapper
      containerStyle={{
        ...styles.wrapper,
        width: isReplied ? '90%' : '100%',
        ...style,
      }}>
      <View style={styles.header}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingLeft: responsiveWidth(3),
          }}>
          <FastImage
            source={{
              uri: imageUri ? imageUri : userIconPath,
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.cover}
            style={styles.img}
          />
          <Text style={styles.name}>{name}</Text>
        </View>
        <Text style={styles.date}>
          {' '}
          {moment(date, 'DD MMM, YYYY hh:mm A').format('MMM DD, YYYY') +
            ' ' +
            moment(date, 'DD MMM, YYYY hh:mm A').format('hh:mm A')}
        </Text>
      </View>
      <Text style={styles.comment}>{comment}</Text>
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          {!isReplied && (
            <TouchableOpacity
              style={{...styles.touch, marginRight: responsiveWidth(3)}}
              onPress={replyingBtn}>
              <Image
                source={require('../../assets/Icons/reply.png')}
                resizeMode="contain"
                style={styles.buttonImage}
              />
              <Text style={styles.buttonText}>Reply</Text>
            </TouchableOpacity>
          )}
          {isEdit && (
            <TouchableOpacity
              style={{...styles.touch, marginRight: responsiveWidth(2)}}
              onPress={_editHandler}>
              <Image
                source={require('../../assets/Icons/edit-text.png')}
                resizeMode="contain"
                style={styles.buttonImage}
              />
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
          )}
          {isDelete && (
            <TouchableOpacity
              style={{...styles.touch}}
              onPress={_deleteHandler}>
              <Image
                source={require('../../assets/Icons/delete.png')}
                resizeMode="contain"
                style={styles.buttonImage}
              />
              <Text style={{...styles.buttonText, color: 'red'}}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Wrapper>
  );
};

export default CommentTab;

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: responsiveHeight(1.5),
    borderRadius: responsiveWidth(2),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  img: {
    height: responsiveHeight(4),
    width: responsiveHeight(4),
    borderRadius: responsiveHeight(2),
    overflow: 'hidden',
  },
  name: {
    marginLeft: responsiveWidth(2),
    fontSize: responsiveFontSize(1.8),
    fontWeight: '500',
    color: 'black',
  },
  date: {
    flex: 0.7,
    textAlign: 'right',
    paddingRight: responsiveWidth(3),
    fontSize: responsiveFontSize(1.4),
    fontWeight: '500',
    color: globalStyles.lightGray,
  },
  comment: {
    marginTop: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(4),
    width: '100%',
    fontSize: responsiveFontSize(1.6),
    color: globalStyles.textGray,
    textAlign: 'left',
    letterSpacing: 1,
    lineHeight: responsiveHeight(2.3),
  },
  buttonContainer: {
    alignItems: 'flex-start',
    width: '92%',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: responsiveHeight(4),
  },
  touch: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100%',
    width: responsiveWidth(15),
  },
  buttonImage: {
    height: responsiveHeight(2),
    width: responsiveWidth(7),
  },
  buttonText: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: '600',
    color: globalStyles.themeBlue,
  },
});
