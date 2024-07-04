/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable eol-last */
/* eslint-disable prettier/prettier */
import {View, Text, Image, ViewStyle, StyleSheet} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';

interface SubscriptionPlanHeaderProps {
  imageUrl?: string;
  planName: string;
  planDetails: string;
  planPrice: string;
  planTenure?: string;
  containerStyle?: ViewStyle;
}

const SubscriptionPlanHeader: React.FC<SubscriptionPlanHeaderProps> = ({
  imageUrl,
  planName,
  planDetails,
  planPrice,
  planTenure,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.imgSection}>
        {imageUrl && (
          <Image
            source={{uri: imageUrl}}
            style={styles.img}
            resizeMode="contain"
          />
        )}
        {imageUrl && (
          <View>
            <View
              style={{
                paddingLeft: responsiveWidth(2),
                justifyContent: 'center',
              }}>
              <Text style={styles.heading}>{planName}</Text>
              {planDetails && <Text style={styles.details}>{planDetails}</Text>}
            </View>
          </View>
        )}
      </View>
      <View style={styles.priceSection}>
        <Text style={[styles.heading, {height: '100%'}]}>{planPrice}</Text>
        {planTenure && <Text style={styles.tenure}>{planTenure}</Text>}
      </View>
    </View>
  );
};

export default SubscriptionPlanHeader;

const styles = StyleSheet.create({
  container: {
    height: responsiveHeight(11),
  },
  imgSection: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '65%',
    width: '100%',
  },
  img: {
    height: '100%',
    width: '10%',
  },
  heading: {
    fontSize: responsiveFontSize(2.2),
    color: 'black',
    fontWeight: '700',
    textAlignVertical: 'center',
  },
  details: {
    fontSize: responsiveFontSize(1.5),
    color: globalStyles.midGray,
  },
  priceSection: {
    flexDirection: 'row',
    paddingLeft: '1%',
    height: '35%',
    width: '100%',
  },
  tenure: {
    height: '100%',
    fontSize: responsiveFontSize(1.4),
    paddingLeft: responsiveWidth(1.2),
    paddingTop: '1.3%',
    color: globalStyles.lightGray,
  },
});
