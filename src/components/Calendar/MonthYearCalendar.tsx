import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import ArrowButton from '../Button/ArrowButton';
import {
  responsiveHeight,
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {months} from '../../utils/tempData';
import BorderBtn from '../Button/BorderBtn';
import {globalStyles} from '../../utils/constant';

interface MonthYearCalendarProps {
  value?: string;
  onSelectMonth: (value: string) => void;
  onCancel?: () => void;
}

const MonthYearCalendar: React.FC<MonthYearCalendarProps> = ({
  value,
  onSelectMonth,
  onCancel,
}) => {
  const [year, setYear] = React.useState<number>(new Date().getFullYear());
  const [month, setMonth] = React.useState<string>(
    `${
      new Date().getMonth() + 1 < 10
        ? '0' + (new Date().getMonth() + 1)
        : new Date().getMonth() + 1
    }`,
  );

  React.useEffect(() => {
    if (value) {
      const temp = value?.split('-');
      if (temp?.length > 0) {
        setMonth(temp[1]);
        setYear(Number(temp[0]));
      }
    }
  }, []);
  // const [month, setMonth] = React.useState<string>(
  //   `${new Date().getFullYear()}-${
  //     new Date().getMonth() + 1 < 10
  //       ? '0' + (new Date().getMonth() + 1)
  //       : new Date().getMonth() + 1
  //   }`,
  // );

  const onSelectMonthHandler = (_month: string) => {
    console.log(_month);
    setMonth(_month);
  };

  const yearHandler = (buttonType: number) => {
    // buttonType respresent icreament or decreament => 1 for increament
    if (buttonType) {
      setYear(preValue => preValue + 1);
    } else {
      setYear(preValue => preValue - 1);
    }
  };

  const submitHandler = () => {
    onSelectMonth && onSelectMonth(`${year}-${month}`);
  };

  const cancelHandler = () => {
    onCancel && onCancel();
  };

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          marginBottom: responsiveHeight(1),
        }}>
        <ArrowButton
          arrowType="left"
          onPress={() => {
            yearHandler(0);
          }}
        />
        <Text
          style={{
            textAlign: 'center',
            fontSize: responsiveFontSize(2.5),
            fontWeight: '500',
            width: responsiveWidth(25),
            color: 'gray',
          }}>
          {year}
        </Text>
        <ArrowButton
          disable={new Date().getFullYear() === year}
          onPress={() => {
            yearHandler(1);
          }}
        />
      </View>
      <View style={styles.MonthPickerContainer}>
        {months.map((item: any) => (
          <BorderBtn
            disable={
              new Date().getFullYear() === year &&
              item?.number > new Date().getMonth() + 1
            }
            key={item?.name + item?.number}
            buttonText={item?.name}
            onClick={() => {
              onSelectMonthHandler(item?.number);
            }}
            containerStyle={{
              marginBottom: responsiveHeight(1),
              width: responsiveWidth(20),
              backgroundColor: 'white',
              borderWidth: responsiveWidth(0.23),
              borderColor:
                Number(month) === Number(item?.number)
                  ? globalStyles.themeBlue
                  : 'transparent',
            }}
            buttonTextStyle={{color: globalStyles.themeBlue}}
          />
        ))}
      </View>
      <View style={styles.btnContainer}>
        <BorderBtn
          buttonText="Cancel"
          onClick={cancelHandler}
          containerStyle={{
            width: responsiveWidth(30),
            backgroundColor: 'white',
            borderColor: 'red',
            borderWidth: responsiveWidth(0.23),
          }}
          buttonTextStyle={{color: 'red'}}
        />
        <BorderBtn
          buttonText="Submit"
          onClick={submitHandler}
          containerStyle={{width: responsiveWidth(30)}}
        />
      </View>
    </>
  );
};

export default MonthYearCalendar;

const styles = StyleSheet.create({
  MonthPickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: responsiveHeight(1),
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: responsiveHeight(2),
  },
});
