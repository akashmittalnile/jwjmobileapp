import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import FastImage from 'react-native-fast-image';

interface FollowersModalProps {
  disableModalHandler: () => void;
  data: any[];
}

const FollowersModal: React.FC<FollowersModalProps> = ({
  disableModalHandler,
  data,
}) => {
  const cancelModal = () => {
    disableModalHandler && disableModalHandler();
  };

  const renderUsers = data?.map((item: any, index: number) => (
    <View style={styles.itemContainer} key={index}>
      <View style={styles.profileContainer}>
        <FastImage
          source={{uri: item?.profile, priority: 'high'}}
          resizeMode={FastImage.resizeMode.cover}
          style={styles.img}
        />
      </View>
      <View style={styles.textContainer}>
        {/* <Text>{item?.name}</Text> */}
        <Text style={styles.text}>{item?.user_name}</Text>
      </View>
    </View>
  ));

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Text style={styles.heading}>Followers</Text>
        <View style={styles.scrollviewContainer}>
          {renderUsers?.length > 0 ? (
            <ScrollView
              contentContainerStyle={styles.scrollView}
              showsVerticalScrollIndicator={false}
              bounces={false}>
              {renderUsers}
            </ScrollView>
          ) : (
            <View style={{marginTop: responsiveHeight(4)}}>
              <Text
                style={{fontSize: responsiveFontSize(3), textAlign: 'center', color: 'black'}}>
                No Followers
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.canceltouch} onPress={cancelModal}>
          <Image
            source={require('../../assets/Icons/cancel.png')}
            resizeMode="contain"
            style={styles.cancelIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FollowersModal;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  subContainer: {
    position: 'relative',
    paddingTop: responsiveHeight(2),
    paddingBottom: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(4),
    width: '95%',
    backgroundColor: 'white',
    borderRadius: responsiveWidth(4),
  },
  heading: {
    marginBottom: responsiveHeight(1),
    fontSize: responsiveFontSize(2),
    color: 'black',
    letterSpacing: 0.8,
  },
  search: {
    marginTop: responsiveHeight(0.5),
    height: responsiveHeight(6),
    borderWidth: responsiveWidth(0.23),
    borderColor: globalStyles.lightGray,
  },
  scrollviewContainer: {
    height: responsiveHeight(50),
  },
  scrollView: {
    marginTop: responsiveHeight(1),
  },
  shareButton: {
    marginTop: responsiveHeight(1),
    width: '100%',
  },
  canceltouch: {
    position: 'absolute',
    top: responsiveHeight(1),
    right: responsiveWidth(3),
  },
  cancelIcon: {
    height: responsiveHeight(3),
    width: responsiveHeight(3),
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: responsiveHeight(1),
    paddingVertical: responsiveHeight(0.7),
    borderWidth: responsiveWidth(0.23),
    borderColor: globalStyles.lightGray,
    borderRadius: responsiveWidth(2),
  },
  profileContainer: {
    marginLeft: responsiveWidth(1.5),
    height: responsiveHeight(5),
    width: responsiveHeight(5),
    borderRadius: responsiveHeight(2.5),
    borderWidth: 1,
    borderColor: globalStyles.lightGray,
    overflow: 'hidden',
  },
  img: {
    height: responsiveHeight(5),
    width: responsiveHeight(5),
  },
  textContainer: {
    marginLeft: responsiveWidth(3),
  },
  text: {
    fontSize: responsiveFontSize(2),
    color: 'black',
    fontWeight: '400',
    letterSpacing: 0.8,
  },
});
