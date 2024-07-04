import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import Container from '../../components/Container/Container';
import TextInputField from '../../components/CustomInput/TextInputField';
import calendarIcon from '../../assets/Icons/calendar-black.png';
import clockIcon from '../../assets/Icons/clock-black.png';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import DatePicker from 'react-native-date-picker';
import BorderBtn from '../../components/Button/BorderBtn';
import TextWithIcon from '../../components/CustomText/TextWithIcon';
import {globalStyles} from '../../utils/constant';
import CustomCalendar from '../../components/Calendar/CustomCalendar';
import {useNavigation} from '@react-navigation/native';

const calendarIconPath = Image.resolveAssetSource(calendarIcon).uri;
const clockIconPath = Image.resolveAssetSource(clockIcon).uri;

let calendarHeading = '';

const CustomRoutineDateTime = () => {
  const navigation = useNavigation();
  const [routineStartDate, setRoutineStartDate] = React.useState<string>(
    'Select Routine Start DATE',
  );
  const [routineStartTime, setRoutineStartTime] =
    React.useState<string>('Select Start Time');

  const [routineEndDate, setRoutineEndDate] = React.useState<string>(
    'Select Routine End DATE',
  );
  const [routineEndTime, setRoutineEndTime] =
    React.useState<string>('Select End Time');

  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [modalType, setModalType] = React.useState<{
    startDate: boolean;
    startTime: boolean;
    endDate: boolean;
    endTime: boolean;
  }>({
    startDate: false,
    startTime: false,
    endDate: false,
    endTime: false,
  });

  const [modalData, setModalData] = React.useState<{
    startDate: string;
    startTime: Date | string;
    endDate: string;
    endTime: Date | string;
  }>({
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
  });

  const modalHandler = (text: string) => {
    calendarHeading = text;
    if (text === 'Select Routine Start DATE') {
      setModalType(_ => ({
        startDate: true,
        startTime: false,
        endDate: false,
        endTime: false,
      }));
    } else if (text === 'Select Start Time') {
      setModalType(_ => ({
        startDate: false,
        startTime: true,
        endDate: false,
        endTime: false,
      }));
    } else if (text === 'Select Routine End DATE') {
      setModalType(_ => ({
        startDate: false,
        startTime: false,
        endDate: true,
        endTime: false,
      }));
    } else if (text === 'Select End Time') {
      setModalType(_ => ({
        startDate: false,
        startTime: false,
        endDate: false,
        endTime: true,
      }));
    }
    setOpenModal(true);
  };

  const saveDateAndTimeHandler = () => {
    navigation.goBack();
  };

  return (
    <>
      <Container headerText="Set Custom Routine Date & Time">
        <View style={styles.subContainer}>
          <TextWithIcon
            text={
              modalData.startDate !== ''
                ? modalData.startDate
                : routineStartDate
            }
            containerStyle={styles.inputStyle}
            textStyle={styles.textStyle}
            imageUri={calendarIconPath}
            iconSide="right"
            onPress={() => {
              modalHandler('Select Routine Start DATE');
            }}
          />
          <TextWithIcon
            text={
              modalData.startTime !== ''
                ? new Date(modalData.startTime).toLocaleString().split(',')[1]
                : routineEndTime
            }
            containerStyle={styles.inputStyle}
            textStyle={styles.textStyle}
            imageUri={clockIconPath}
            iconSide="right"
            onPress={() => {
              modalHandler('Select Start Time');
            }}
          />
          <TextWithIcon
            text={modalData.endDate !== '' ? modalData.endDate : routineEndDate}
            containerStyle={styles.inputStyle}
            textStyle={styles.textStyle}
            imageUri={calendarIconPath}
            iconSide="right"
            onPress={() => {
              modalHandler('Select Routine End DATE');
            }}
          />
          <TextWithIcon
            text={
              modalData.endTime !== ''
                ? new Date(modalData.endTime).toLocaleString().split(',')[1]
                : routineEndTime
            }
            containerStyle={styles.inputStyle}
            textStyle={styles.textStyle}
            imageUri={clockIconPath}
            iconSide="right"
            onPress={() => {
              modalHandler('Select End Time');
            }}
          />
          <BorderBtn
            containerStyle={styles.buttonStyle}
            onClick={saveDateAndTimeHandler}
            buttonText="Save"
          />
        </View>
      </Container>
      {openModal && (
        <View style={styles.modalContainer}>
          <View style={styles.modalSubContainer}>
            <Text style={styles.calendarHeading}>{calendarHeading}</Text>

            {(modalType.startDate || modalType.endDate) && (
              <CustomCalendar
                containerStyle={styles.calendarStyle}
                dateHandler={date => {
                  setModalData(preData => ({
                    ...preData,
                    [modalType.startDate ? 'startDate' : 'endDate']: date,
                  }));
                }}
              />
            )}

            {(modalType.startTime || modalType.endTime) && (
              <DatePicker
                mode="time"
                open={modalType.startTime || modalType.endTime}
                date={
                  calendarHeading === 'Select Start Time'
                    ? modalData.startTime === ''
                      ? new Date()
                      : modalData.startTime
                    : modalData.endTime === ''
                    ? new Date()
                    : modalData.endTime
                }
                onDateChange={selectedDate => {
                  setModalData(preData => ({
                    ...preData,
                    [modalType.startTime ? 'startTime' : 'endTime']:
                      selectedDate,
                  }));
                }}
                style={styles.time}
              />
            )}

            <BorderBtn
              buttonText="Close"
              containerStyle={styles.calendarButtonStyle}
              onClick={() => {
                setOpenModal(false);
              }}
            />
          </View>
        </View>
      )}
    </>
  );
};

export default CustomRoutineDateTime;

const styles = StyleSheet.create({
  subContainer: {
    marginTop: responsiveHeight(1),
  },
  inputStyle: {
    justifyContent: 'flex-start',
    marginBottom: responsiveHeight(2),
    height: responsiveHeight(7),
    paddingHorizontal: responsiveWidth(3),
    width: '100%',
    borderRadius: responsiveWidth(2),
    elevation: 2,
    shadowColor: globalStyles.shadowColor,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    backgroundColor: 'white',
  },
  textStyle: {
    fontSize: responsiveFontSize(1.6),
    color: 'black',
  },
  buttonStyle: {
    width: '100%',
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalSubContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: responsiveWidth(2),
    paddingBottom: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(5),
  },
  calendarHeading: {
    marginVertical: responsiveHeight(1),
    width: '100%',
    fontSize: responsiveFontSize(1.6),
    color: 'black',
    fontWeight: '500',
  },
  calendarStyle: {
    padding: 10,
    width: responsiveWidth(75),
    borderRadius: responsiveWidth(2),
  },
  calendarButtonStyle: {
    marginTop: responsiveHeight(2),
    width: responsiveWidth(75),
  },
  time: {
    fontSize: responsiveFontSize(2),
    backgroundColor: 'white',
    width: responsiveWidth(75),
  },
});
