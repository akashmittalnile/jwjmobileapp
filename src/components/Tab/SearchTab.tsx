import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import Wrapper from '../Wrapper/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import BorderBtn from '../Button/BorderBtn';
import {globalStyles} from '../../utils/constant';
import SearchCriteria from '../Search/SearchCriteria';

interface SearchTabProps {
  onPress?: () => void;
}

const SearchTab: React.FC<SearchTabProps> = ({onPress}) => {
  return (
    <Wrapper containerStyle={styles.wrapper}>
      {/* header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Work</Text>
        <BorderBtn
          buttonText="View"
          onClick={() => {
            onPress && onPress();
          }}
          containerStyle={styles.headerButtonStyle}
        />
      </View>
      <View style={styles.emojiContainer}>
        <Image
          source={require('../../assets/Icons/happy.png')}
          resizeMode="contain"
          style={styles.emoji}
        />
        <Text style={styles.emojiText}>Happy</Text>
      </View>
      <Text style={styles.storyHeading}>Jesus I Trust in you</Text>
      <Text style={styles.story}>
        Today Wins A Good Din I Washed This Morning And Everyone Showed For
        Their Shift. The Boss Bought Lunch For Us All.
      </Text>
      <SearchCriteria />
    </Wrapper>
  );
};

export default SearchTab;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: responsiveHeight(1),
    paddingTop: responsiveHeight(0),
    paddingBottom: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(3),
    borderRadius: responsiveWidth(2),
    width: '100%',
    elevation: 3,
    shadowColor: globalStyles.shadowColor,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsiveHeight(1.5),
    borderBottomWidth: responsiveHeight(0.1),
    borderBottomColor: globalStyles.veryLightGray,
    width: '100%',
  },
  headerText: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '400',
  },
  headerButtonStyle: {
    height: responsiveHeight(3.5),
    width: '18%',
    elevation: 3,
    shadowColor: globalStyles.shadowColor,
    backgroundColor: '#3DA1E3',
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: responsiveHeight(1),
    width: '100%',
  },
  emoji: {
    height: responsiveHeight(5),
    width: responsiveHeight(5),
  },
  emojiText: {
    paddingLeft: responsiveWidth(2),
    fontSize: responsiveFontSize(1.6),
    color: 'black',
    fontWeight: '500',
  },
  storyHeading: {
    marginTop: responsiveHeight(0.5),
    fontSize: responsiveFontSize(1.6),
    color: 'black',
    fontWeight: '500',
    width: '100%',
  },
  story: {
    marginTop: responsiveHeight(0.8),
    fontSize: responsiveFontSize(1.6),
    color: globalStyles.textGray,
    fontWeight: '400',
    width: '100%',
    letterSpacing: 1,
  },
});
