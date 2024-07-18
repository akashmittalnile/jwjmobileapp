import {View, Text, TextInput, StyleSheet, Image, FlatList} from 'react-native';
import React from 'react';
import Container from '../../components/Container/Container';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {reloadHandler} from '../../redux/ReloadScreen';
import {RootStackParamList} from '../../navigation/MainNavigation';
import {globalStyles} from '../../utils/constant';
import {baseURL, endPoint} from '../../services/Service';
import Time from '../../components/Time/Time';
import DatePicker from 'react-native-date-picker';
import BorderBtn from '../../components/Button/BorderBtn';
import TextInputWithoutIcon from '../../components/CustomInput/TextInputWithoutIcon';
import Modal from '../../components/Modal/Modal';
import ScreenNames from '../../utils/ScreenNames';
import Frequency from '../../components/Frequency/Frequency';
import RepeatOptions from '../../components/Repeat/RepeatOptions';
import {useAppDispatch, useAppSelector} from '../../redux/Store';
import Toast from 'react-native-toast-message';
import RoutineCategoryTabHorizontal from '../../components/Routine/RoutineCategoryTabHorizontal';

type AddNewRoutineParams = RouteProp<RootStackParamList, 'AddNewRoutine'>;

let dateTempCollection: Date[] = [];

const AddNewRoutine = () => {
  const navigation = useNavigation();
  const {params} = useRoute<AddNewRoutineParams>();
  const dispatch = useAppDispatch();
  const token = useAppSelector(state => state.auth.token);
  const reload = useAppSelector(state => state.reload);
  const [task, setTask] = React.useState<string>('');
  const [subTitle, setSubTitle] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
  const [open, setOpen] = React.useState<boolean>(false);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openRepeatModal, setopenRepeatModal] = React.useState<boolean>(false);
  const [time, setTime] = React.useState<Date[]>([]);
  const [goalId, setGoalId] = React.useState<string | undefined>();
  const [category, setCategory] = React.useState<string>('');
  const [loader, setLoader] = React.useState<boolean>(false);
  const [err, setErr] = React.useState<{
    title: boolean;
    subtitle: boolean;
    description: boolean;
    time: boolean;
  }>({
    title: false,
    subtitle: false,
    description: false,
    time: false,
  });
  const [repeatOption, setRepeatOption] = React.useState<{
    text: string;
    value: string | string[] | undefined;
    schedule_startdate?: string;
    schedule_enddate?: string;
  }>({text: 'Once', value: 'O'});

  React.useEffect(() => {
    // if (!params?.goal) {
    //   setEditRoutine(true);
    // }
    if (params?.goal) {
      setGoalId(params.goal);
    } else {
      setGoalId(params?.data?.category_id);
      getParamsData();
    }
  }, [params?.goal]);

  const refreshHandler = () => {
    if (params?.goal) {
      setGoalId(params.goal);
      setTask('');
      setSubTitle('');
      setDescription('');
      setTime([]);
      setRepeatOption({text: 'Once', value: 'O'});
    } else {
      setGoalId(params?.data?.category_id);
      getParamsData();
    }
  };

  const getParamsData = () => {
    setTask(params?.data?.name);
    setDescription(params?.data?.description);
    setSubTitle(params?.data?.subtitle);
    // const _temp = params?.data?.interval?.map((item: any) => {
    //   const _date = item?.interval_time?.split(':');
    //   const date = new Date();
    //   date.setHours(_date[0]);
    //   date.setMinutes(_date[1]);
    //   return date;
    // });
    const _date = params?.data?.interval[0]?.interval_time?.split(':');
    const date = new Date();
    date.setHours(_date[0]);
    date.setMinutes(_date[1]);
    setTime([date]);
    if (params?.data?.schedule_frequency?.toLowerCase() === 'c') {
      let text = '';
      for (let i = 0; i < params?.data?.interval?.length; i++) {
        if (i === params?.data?.interval?.length - 1) {
          text = text + params?.data?.interval[i]?.interval_weak;
        } else {
          text = text + params?.data?.interval[i]?.interval_weak + ', ';
        }
      }
      const custom = params?.data?.interval.map(
        (item: any) => item?.interval_weak,
      );
      setRepeatOption({text, value: custom});
    } else if (params?.data?.schedule_frequency?.toLowerCase() === 'd') {
      setRepeatOption({text: 'Daily', value: 'D'});
    } else if (params?.data?.schedule_frequency?.toLowerCase() === 'o') {
      setRepeatOption({text: 'Once', value: 'O'});
    } else {
      setRepeatOption({
        text: params?.data?.schedule_date,
        value: params?.data?.schedule_date,
      });
    }
  };

  const categoryHandler = React.useCallback((id: string) => {
    setGoalId(id);
  }, []);

  const taskHandler = (value: string) => {
    setTask(value);
    setErr(preData => ({...preData, title: false}));
  };

  // const routineDurationHandler = (value: string) => {
  //   if (value === 'today') {
  //     setRoutineDuration(value);
  //   } else {
  //     setRoutineDuration(value);
  //   }
  // };

  const modalHandler = () => {
    setOpenModal(false);
    navigation.navigate(ScreenNames.Routine);
  };

  const saveDateHandler = () => {
    if (dateTempCollection.length === 0 && time.length === 0) {
      setTime([new Date()]);
    } else {
      setTime(dateTempCollection);
    }
    setOpen(false);
  };

  const disableRepeatModal = () => {
    setopenRepeatModal(false);
  };

  const createRoutineHandler = async () => {
    setLoader(true);
    try {
      if (
        task.length === 0 ||
        (Array.isArray(time) && time?.length === 0) ||
        description?.length === 0
      ) {
        if (description?.length === 0) {
          setErr(preData => ({...preData, description: true}));
        }
        if (task?.length === 0) {
          setErr(preData => ({...preData, title: true}));
        }
        // if (subTitle?.length === 0) {
        //   setErr(preData => ({...preData, subtitle: true}));
        // }
        if (time?.length === 0) {
          setErr(preData => ({...preData, time: true}));
        }
        return;
      }
      const formData = new FormData();
      formData.append('name', task);
      formData.append('description', description);
      // formData.append('subtitle', subTitle);
      formData.append('category_id', goalId);
      if (Array.isArray(time)) {
        for (let i = 0; i < time?.length; i++) {
          const hours = time[i].getHours();
          const minutes = time[i].getMinutes();
          formData.append(
            'schedule_time[]',
            `${hours < 10 ? '0' + hours : hours}:${
              minutes < 10 ? '0' + minutes : minutes
            }`,
          );
        }
      }
      if ([...repeatOption.text]?.includes('-')) {
        formData.append('frequency', 'T');
        formData.append('date', repeatOption?.value);
      } else if (repeatOption.text?.toLowerCase() === 'once') {
        formData.append('frequency', 'O');
      } else if (repeatOption.text?.toLowerCase() === 'daily') {
        formData.append('frequency', 'D');
      } else {
        if (repeatOption?.value) {
          formData.append('frequency', 'C');
          for (let i = 0; i < repeatOption?.value?.length; i++) {
            formData.append('custom[]', repeatOption?.value[i]);
          }
          formData.append(
            'schedule_startdate',
            repeatOption?.schedule_startdate,
          );
          formData.append('schedule_enddate', repeatOption?.schedule_enddate);
        }
      }
      if (params?.edit) {
        formData.append('id', params?.data?.id);
      }
      const response = await fetch(
        `${baseURL}${
          params?.edit ? endPoint.EditRoutine : endPoint.createRoutine
        }`,
        {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      const data = await response?.json();
      if (data?.status) {
        dispatch(
          reloadHandler({
            [ScreenNames.Routine]: !reload.Routine,
            [ScreenNames.Home]: !reload.Home,
            [ScreenNames.RoutineDetailsWithTask]:
              !reload.RoutineDetailsWithTask,
          }),
        );
        navigation.goBack();
      }
      Toast.show({
        type: data?.status ? 'success' : 'error',
        text1: data?.message,
      });
    } catch (err: any) {
      console.log('error in creating routine', err?.message);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <Container
        headerText={params.edit ? 'Edit Routine' : 'Add New Routine'}
        reloadOnScroll={true}
        onRefreshHandler={refreshHandler}
        scrollViewContentContainerStyle={{height: responsiveHeight(85)}}>
        {/* category tabs */}
        <RoutineCategoryTabHorizontal
          goalId={goalId}
          onClick={categoryHandler}
          style={{height: responsiveHeight(11.5)}}
        />
        <TextInput
          value={task}
          onChangeText={taskHandler}
          style={{
            ...styles.task,
            borderWidth: err.title ? responsiveWidth(0.23) : 0,
          }}
          placeholder="Routine Title"
          placeholderTextColor="gray"
        />

        {/* <TextInput
          value={subTitle}
          onChangeText={text => {
            setSubTitle(text);
            setErr(preData => ({...preData, subtitle: false}));
          }}
          style={{
            ...styles.task,
            marginTop: responsiveHeight(2),
            borderWidth: err.subtitle ? responsiveWidth(0.23) : 0,
          }}
          placeholder="Routine Subtitle"
          placeholderTextColor="gray"
        /> */}

        {/* select time */}

        <Time
          value={time}
          placeholder="Select Time"
          onClick={() => {
            setOpen(true);
            setErr(preData => ({...preData, time: false}));
          }}
          style={{
            borderColor: 'red',
            borderWidth: err.time ? responsiveWidth(0.23) : 0,
          }}
        />

        <Frequency
          placeholder="Select Repeat Option"
          value={repeatOption.text}
          onClick={() => {
            setopenRepeatModal(true);
          }}
        />

        <TextInputWithoutIcon
          value={description}
          containerStyle={{
            ...styles.description,
            borderWidth: err.description ? responsiveWidth(0.23) : 0,
          }}
          placeholder="Type Your Description Here…"
          onChangeText={text => {
            setDescription(text);
            setErr(preData => ({...preData, description: false}));
          }}
          multiline={true}
        />

        {/* create Routine Button */}
        <BorderBtn
          loader={loader}
          buttonText={params.edit ? 'Update Routine' : 'Save & Create Routine'}
          containerStyle={styles.createRoutineButtonStyle}
          onClick={createRoutineHandler}
        />
      </Container>
      {open && (
        <View style={styles.timePickerContainer}>
          <View style={styles.timeSubContainer}>
            <DatePicker
              is24hourSource="device"
              mode="time"
              open={open}
              date={new Date()}
              onDateChange={selectedDate => {
                dateTempCollection = [selectedDate];
                // dateTempCollection.push(selectedDate);
              }}
              textColor={globalStyles.themeBlue}
              style={styles.time}
            />
            <BorderBtn
              buttonText="Save"
              onClick={saveDateHandler}
              containerStyle={styles.saveTimeButton}
            />
          </View>
        </View>
      )}

      {openModal && (
        <View style={{...styles.timePickerContainer}}>
          <Modal
            text="Routine Create Successful"
            buttonText="Close"
            modalHandler={modalHandler}
          />
        </View>
      )}
      {openRepeatModal && (
        <View
          style={{
            ...styles.frequencyPickerContainer,
          }}>
          <RepeatOptions
            routineStartDate={
              params?.data?.schedule_start_date
                ? params?.data?.schedule_start_date
                : repeatOption?.schedule_startdate
            }
            routineEndDate={
              params?.data?.schedule_end_date
                ? params?.data?.schedule_end_date
                : repeatOption?.schedule_enddate
            }
            initialValue={repeatOption.value}
            disableModal={disableRepeatModal}
            onClick={value => {
              setRepeatOption(value);
              setopenRepeatModal(false);
            }}
          />
        </View>
      )}
    </>
  );
};

export default AddNewRoutine;

const styles = StyleSheet.create({
  categoriesTabs: {
    marginTop: responsiveHeight(1),
  },
  flatlist: {
    flex: 1,
    marginBottom: responsiveHeight(2),
  },
  iconTab: {
    height: responsiveHeight(13),
  },
  task: {
    paddingHorizontal: responsiveWidth(2),
    height: responsiveHeight(6),
    fontSize: responsiveFontSize(1.8),
    letterSpacing: 1,
    color: globalStyles.textGray,
    borderRadius: responsiveWidth(2),
    elevation: 2,
    shadowColor: globalStyles.shadowColor,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.6,
    shadowRadius: 3,
    backgroundColor: 'white',
    borderColor: 'red',
  },
  routineDurationText: {
    marginTop: responsiveHeight(2),
    fontSize: responsiveFontSize(1.6),
    color: 'black',
    fontWeight: '400',
  },
  routineDurationButtonContainer: {
    flexDirection: 'row',
    marginTop: responsiveHeight(1),
  },
  durationButtonStyle: {
    marginRight: responsiveWidth(2),
    width: '30%',
    elevation: 2,
    shadowColor: globalStyles.shadowColor,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.6,
    shadowRadius: 3,
    backgroundColor: 'white',
  },
  timePickerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  frequencyPickerContainer: {
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  timeSubContainer: {
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: globalStyles.shadowColor,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderRadius: responsiveWidth(2),
    padding: 10,
  },
  saveTimeButton: {
    marginTop: responsiveHeight(2),
    width: responsiveWidth(75),
  },
  time: {
    fontSize: responsiveFontSize(2),
    backgroundColor: 'white',
    width: responsiveWidth(75),
  },
  description: {
    marginTop: responsiveHeight(2),
    backgroundColor: 'white',
    height: responsiveHeight(15),
    width: '100%',
    elevation: 2,
    shadowColor: globalStyles.shadowColor,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderRadius: responsiveWidth(2),
    borderColor: 'red',
  },
  createRoutineButtonStyle: {
    marginTop: responsiveHeight(2),
    width: '100%',
  },
});
