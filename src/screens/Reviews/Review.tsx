/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React from 'react';
import Header from '../../components/Header/Header';
import {globalStyles} from '../../utils/constant';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import SearchBar from '../../components/SearchBar/SearchBar';
import ReviewTab from '../../components/Tab/ReviewTab';
import BorderBtn from '../../components/Button/BorderBtn';

const Review = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header title="Reviews" notificationButton={false} />
      </View>
      <View style={styles.subContainer}>
        <SearchBar placeholder="Search" />

        {/* review tab list */}
        <ScrollView bounces={false}>
          <ReviewTab />
          <ReviewTab
            style={{
              borderLeftColor: globalStyles.themeBlue,
              borderLeftWidth: responsiveWidth(0.5),
            }}
          />
        </ScrollView>
      </View>
      <View style={styles.buttonContainer}>
        <BorderBtn buttonText="Rate Us" onClick={() => {}} />
      </View>
    </View>
  );
};

export default Review;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: globalStyles.themeBlue,
    paddingBottom: responsiveHeight(1.5),
  },
  subContainer: {
    width: responsiveWidth(95),
  },
  buttonContainer: {
    position: 'absolute',
    bottom: responsiveHeight(5),
    alignItems: 'center',
    width: '100%',
  },
});
