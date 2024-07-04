import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import BorderBtn from '../Button/BorderBtn';
import {
  responsiveHeight,
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import moment from 'moment';

interface SearchCriteriaProps {
  data: any;
  date?: string;
}

const SearchCriteria: React.FC<SearchCriteriaProps> = ({data, date}) => {
  return (
    <>
      <Text style={styles.searchCriteriaText}>Search Criteria</Text>
      <View style={styles.criteriaButtonsContainer}>
        {data?.map((item: any) => (
          <BorderBtn
            key={item?.name}
            buttonText={item?.name}
            onClick={() => {}}
            activeOpacity={1}
            containerStyle={{...styles.criteriaButtonStyle}}
            buttonTextStyle={{...styles.criteriaButtonTextStyle}}
          />
        ))}
      </View>
      {date && (
        <Text
          style={{
            ...styles.searchCriteriaText,
            color: globalStyles.lightGray,
          }}>
          {moment(date, 'DD MMM, YYYY hh:mm A').format('MMM DD, YYYY') +
            ' ' +
            moment(date, 'DD MMM, YYYY hh:mm A').format('hh:mm A')}
        </Text>
      )}
    </>
  );
};

export default SearchCriteria;

const styles = StyleSheet.create({
  searchCriteriaText: {
    marginTop: responsiveHeight(1.5),
    fontSize: responsiveFontSize(1.6),
    fontWeight: '400',
    width: '100%',
  },
  criteriaButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: responsiveHeight(1),
    width: '100%',
  },
  criteriaButtonStyle: {
    marginBottom: responsiveHeight(0.5),
    width: 'auto',
    height: responsiveHeight(4),
    paddingHorizontal: responsiveWidth(2),
    marginRight: responsiveWidth(3),
  },
  criteriaButtonTextStyle: {
    fontSize: responsiveFontSize(1.4),
    fontWeight: '600',
  },
});
