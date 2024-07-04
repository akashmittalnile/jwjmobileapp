import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import Wrapper from '../Wrapper/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';

interface RejectedCommunityRequestTabProps {
  name: string;
  description: string;
  images: string[];
}

const RejectedCommunityRequestTab: React.FC<
  RejectedCommunityRequestTabProps
> = ({name, description, images}) => {

  return (
    <Wrapper containerStyle={styles.wrapper}>
      {/* header */}
      <View style={styles.header}>
        <View style={styles.planDetailsContainer}>
          {/* <Image
            source={require('../../assets/Icons/plan-b.png')}
            resizeMode="contain"
            style={styles.headerIcon}
          /> */}
          <View style={styles.planDetails}>
            <Text style={styles.planName}>{name}</Text>
            {/* <Text style={styles.planPrice}>$5.99/Monthly</Text> */}
          </View>
        </View>
        <View>
          <TouchableOpacity style={styles.touch} disabled={true}>
            <Image
              source={require('../../assets/Icons/close-circle.png')}
              style={styles.closeIcon}
              resizeMode="contain"
            />
            <Text style={styles.buttonText}>Rejected</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* profile */}
      <View style={styles.profileImagesContainer}>
        {images?.length > 0 &&
          images?.map((item: any, index: number) => (
            <View style={styles.profileImageContainer} key={index}>
              <Image
                source={{uri: item?.image}}
                style={styles.profileImage}
                resizeMode="cover"
              />
            </View>
          ))}
        {/* <View style={styles.profileImageContainer}>
          <Image
            source={require('../../assets/Images/tab-profile-2.png')}
            style={styles.profileImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.profileImageContainer}>
          <Image
            source={require('../../assets/Images/tab-profile-3.png')}
            style={styles.profileImage}
            resizeMode="cover"
          />
        </View> */}
      </View>
      <Text style={styles.text} ellipsizeMode="tail" numberOfLines={1}>
        {description}
        {/* The Spirit’s Embrace: A Christian Community’s … */}
      </Text>
    </Wrapper>
  );
};

export default RejectedCommunityRequestTab;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: responsiveHeight(1.2),
    paddingTop: responsiveHeight(0),
    width: '100%',
    borderRadius: responsiveWidth(2),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: responsiveHeight(1),
    paddingHorizontal: '5%',
    width: '100%',
    borderBottomWidth: responsiveWidth(0.2),
    borderBlockColor: globalStyles.veryLightGray,
  },
  headerIcon: {
    height: responsiveHeight(6),
    width: responsiveWidth(9),
  },
  closeIcon: {
    height: responsiveHeight(1.5),
    width: responsiveHeight(1.5),
  },
  planDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planDetails: {
    // marginLeft: responsiveWidth(2),
    justifyContent: 'space-between',
  },
  planName: {
    fontSize: responsiveFontSize(1.8),
    color: 'black',
    fontWeight: '500',
  },
  planPrice: {
    marginTop: responsiveHeight(0.7),
    fontSize: responsiveFontSize(1.4),
    color: globalStyles.textGray,
    opacity: 0.8,
  },
  touch: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: responsiveHeight(1),
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: responsiveWidth(5),
    borderWidth: 1,
    borderColor: 'red',
    overflow: 'hidden',
  },
  buttonText: {
    color: 'red',
    fontSize: responsiveFontSize(1.6),
    marginLeft: responsiveWidth(2),
  },
  profileImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: responsiveHeight(1.5),
    paddingHorizontal: '5%',
    width: '100%',
  },
  profileImageContainer: {
    marginRight: responsiveWidth(1),
    height: responsiveHeight(6),
    width: responsiveWidth(12),
    overflow: 'hidden',
    borderRadius: responsiveWidth(2),
    ...globalStyles.shadowStyle,
    borderColor: globalStyles.veryLightGray,
    borderWidth: 1,
  },
  profileImage: {
    height: '100%',
    width: '100%',
  },
  text: {
    marginTop: responsiveHeight(1),
    marginBottom: responsiveHeight(2),
    paddingLeft: '5%',
    width: '100%',
    color: 'black',
    fontSize: responsiveFontSize(1.6),
    textAlign: 'left',
  },
});
