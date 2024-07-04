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
import IconTab from '../../components/Tab/IconTab';
import Modal from '../../components/Modal/Modal';
import ScreenNames from '../../utils/ScreenNames';
import Frequency from '../../components/Frequency/Frequency';
import RepeatOptions from '../../components/Repeat/RepeatOptions';
import {useAppDispatch, useAppSelector} from '../../redux/Store';
import Toast from 'react-native-toast-message';

type AddNewTaskParams = RouteProp<RootStackParamList, 'EditTask'>;

const dateTempCollection: Date[] = [];

const AddNewTask = () => {
  const navigation = useNavigation();
  const {params} = useRoute<AddNewTaskParams>();
  const dispatch = useAppDispatch();
  const token = useAppSelector(state => state.auth.token);
  const reloadRoutineDetails = useAppSelector(
    state => state.reload.RoutineDetailsWithTask,
  );
  const goalData = useAppSelector(state => state.goal);
  const [task, setTask] = React.useState<string>('');
  const [subTitle, setSubTitle] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
  const [goalId, setGoalId] = React.useState<number | undefined>();
  const [routineDuration, setRoutineDuration] = React.useState<string>('today');
  const [open, setOpen] = React.useState<boolean>(false);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [openRepeatModal, setopenRepeatModal] = React.useState<boolean>(false);
  const [time, setTime] = React.useState<Date[]>([]);
  const [editRoutine, setEditRoutine] = React.useState<boolean>(false);
  const [loader, setLoader] = React.useState<boolean>(false);
  const [repeatOption, setRepeatOption] = React.useState<{
    text: string;
    value: string | string[] | undefined;
  }>({text: 'Once', value: 'O'});

  React.useEffect(() => {
    setGoalId(params?.goalId);
  }, []);

  const renderCategoryTab = ({
    item,
  }: {
    item: {logo: string; name: string; id: number};
  }) => {
    return (
      <IconTab
        style={{
          ...styles.iconTab,
          borderColor:
            goalId?.toString() == item?.id.toString()
              ? globalStyles.themeBlue
              : 'white',
        }}
        imageUri={item.logo}
        text={item.name}
        onPress={() => {
          categoryHandler(item?.id);
        }}
      />
    );
  };

  const categoryHandler = (id: number) => {
    setGoalId(id);
  };

  const taskHandler = (value: string) => {
    setTask(value);
  };

  const modalHandler = () => {
    setOpenModal(false);
    navigation.navigate(ScreenNames.Routine);
  };

  const saveDateHandler = () => {
    if (dateTempCollection.length === 0 && time.length === 0) {
      setTime([new Date()]);
    } else if (dateTempCollection.length === 0 && time.length > 0) {
      let isDateAlreadyInclude = false;
      for (let i = 0; i < time.length; i++) {
        const itemTime = `${time[i].getHours()}:${time[i].getMinutes()}`;
        const currentTime = `${new Date().getHours()}:${new Date().getMinutes()}`;
        if (itemTime == currentTime) {
          isDateAlreadyInclude = true;
          break;
        }
      }
      if (!isDateAlreadyInclude) {
        setTime(preDates => [...preDates, new Date()]);
        setOpen(false);
        dateTempCollection.length = 0;
        return;
      }
    } else if (dateTempCollection.length > 0) {
      const temp = dateTempCollection[dateTempCollection.length - 1];
      setTime(preDates => [...preDates, temp]);
    }
    dateTempCollection.length = 0;
    setOpen(false);
  };

  const disableRepeatModal = () => {
    setopenRepeatModal(false);
  };

  const createRoutineHandler = async () => {
    setLoader(true);
    try {
      const formData = new FormData();
      formData.append('name', task);
      formData.append('description', description);
      formData.append('subtitle', subTitle);
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
        }
      }
      const response = await fetch(`${baseURL}${endPoint.createTask}`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = await response?.json();
      if (response?.ok) {
        dispatch(reloadHandler({[ScreenNames.Routine]: !reloadRoutineDetails}));
        Toast.show({
          type: 'success',
          text1: data?.message,
        });
        navigation.goBack();
      }
      if (!response?.ok) {
        Toast.show({
          type: 'error',
          text1: data?.message,
        });
      }
    } catch (err: any) {
      console.log('error in creating routine', err?.message);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <Container headerText={'Add New Task'} reloadOnScroll={false}>
        {/* category tabs */}
        <View style={styles.categoriesTabs}>
          <FlatList
            data={goalData}
            renderItem={renderCategoryTab}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            style={styles.flatlist}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <TextInput
          value={task}
          onChangeText={taskHandler}
          style={styles.task}
          placeholder="Task Title"
        />

        <TextInput
          value={subTitle}
          onChangeText={text => {
            setSubTitle(text);
          }}
          style={{...styles.task, marginTop: responsiveHeight(2)}}
          placeholder="Task Subtitle"
        />

        {/* select time */}

        <Time
          value={time}
          placeholder="Select Time"
          onClick={() => {
            setOpen(true);
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
          containerStyle={styles.description}
          placeholder="Type Your Description Here…"
          onChangeText={text => {
            setDescription(text);
          }}
          multiline={true}
        />

        {/* create Routine Button */}
        <BorderBtn
          loader={loader}
          buttonText={'Create Task'}
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
                dateTempCollection.push(selectedDate);
              }}
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
            text={
              editRoutine
                ? 'Routine Edit Successful'
                : 'Routine Create Successful'
            }
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

export default AddNewTask;

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
  },
  createRoutineButtonStyle: {
    marginTop: responsiveHeight(2),
    width: '100%',
  },
});

// import {View, Text, TextInput, StyleSheet, Image, FlatList} from 'react-native';
// import React from 'react';
// import Container from '../../components/Container/Container';
// import {
//   responsiveFontSize,
//   responsiveHeight,
//   responsiveWidth,
// } from 'react-native-responsive-dimensions';
// import {globalStyles} from '../../utils/constant';
// import IconButton from '../../components/Button/IconButton';
// import tickBlue from '../../assets/Icons/tick-circle.png';
// import tickGray from '../../assets/Icons/tick-circle-gray.png';
// import HorizontalCalendarStrip from '../../components/Calendar/HorizontalCalendarStrip';
// import Time from '../../components/Time/Time';
// import DatePicker from 'react-native-date-picker';
// import BorderBtn from '../../components/Button/BorderBtn';
// import TextInputWithoutIcon from '../../components/CustomInput/TextInputWithoutIcon';
// import {useNavigation, useRoute} from '@react-navigation/native';
// import ScreenNames from '../../utils/ScreenNames';
// import {useAppSelector} from '../../redux/Store';
// import SvgUri from 'react-native-svg-uri';
// import {RouteProp} from '@react-navigation/native';
// import {RootStackParamList} from '../../navigation/MainNavigation';

// const tickBluePath = Image.resolveAssetSource(tickBlue).uri;
// const tickGrayPath = Image.resolveAssetSource(tickGray).uri;

// type EditTaskParams = RouteProp<RootStackParamList, 'EditTask'>;

// const EditTask = () => {
//   const {params} = useRoute<EditTaskParams>();
//   const navigation = useNavigation();
//   const goalData = useAppSelector(state => state.goal);
//   const [task, setTask] = React.useState<string>('');
//   const [routineDuration, setRoutineDuration] = React.useState<string>('today');
//   const [open, setOpen] = React.useState<boolean>(false);
//   const [openModal, setOpenModal] = React.useState<boolean>(false);
//   const [time, setTime] = React.useState<Date | string>('');
//   const [date, setDate] = React.useState<Date>(new Date());
//   const [category, setCategory] = React.useState<string>('');
//   const [showCustomRoutine, setShowCustomRoute] =
//     React.useState<boolean>(false);

//   const categoryHandler = (text: string) => {
//     setCategory(text ? text : '');
//   };

//   const renderCategoryTab = ({
//     item,
//   }: {
//     item: {logo: string; name: string; id: number};
//   }) => (
//     <View
//       style={{
//         ...styles.svgImageContainer,
//         borderColor:
//           item?.id === params?.goal ? globalStyles.themeBlue : 'white',
//       }}>
//       <SvgUri
//         width={responsiveWidth(20)}
//         height={responsiveWidth(22)}
//         source={{uri: item?.logo}}
//       />
//       <Text style={{fontSize: responsiveFontSize(1.6)}}>{item?.name}</Text>
//     </View>
//   );

//   const taskHandler = (value: string) => {
//     setTask(value);
//   };

//   const routineDurationHandler = (value: string) => {
//     if (value === 'today') {
//       setRoutineDuration(value);
//     } else {
//       setRoutineDuration(value);
//     }
//     console.log({value});
//   };

//   const setCustomDateAndTimeHandler = () => {
//     navigation.navigate(ScreenNames.CustomRoutineDateTime);
//   };

//   const createTask = async () => {
//     try {
//     } catch (err: any) {
//       console.log('err in create task', err.message);
//     }
//   };

//   return (
//     <>
//       <Container
//         headerText={params?.editTask ? 'Edit Task' : 'Add Task'}
//         style={{paddingBottom: responsiveHeight(8)}}>
//         {/* category tabs */}
//         <View style={styles.categoriesTabs}>
//           <FlatList
//             data={goalData}
//             renderItem={renderCategoryTab}
//             keyExtractor={(_, index) => _?.id.toString()}
//             horizontal
//             style={styles.flatlist}
//             showsHorizontalScrollIndicator={false}
//             bounces={false}
//           />
//         </View>

//         <TextInput
//           value={task}
//           onChangeText={taskHandler}
//           style={styles.task}
//           placeholder="Focus On Deep Breath"
//         />

//         {/* set routine duration */}
//         <Text style={styles.routineDurationText}>Set Routine Duration</Text>
//         <View style={styles.routineDurationButtonContainer}>
//           <IconButton
//             text="Today"
//             iconUri={routineDuration === 'today' ? tickBluePath : tickGrayPath}
//             iconSide="right"
//             onPress={() => {
//               routineDurationHandler('today');
//             }}
//             style={{
//               ...styles.durationButtonStyle,
//               borderColor:
//                 routineDuration === 'today' ? globalStyles.themeBlue : 'white',
//               borderWidth: responsiveWidth(0.23),
//             }}
//             textStyle={{
//               color:
//                 routineDuration === 'today'
//                   ? globalStyles.themeBlue
//                   : globalStyles.textGray,
//             }}
//           />

//           <IconButton
//             text="Tomorrow"
//             iconUri={
//               routineDuration === 'tomorrow' ? tickBluePath : tickGrayPath
//             }
//             iconSide="right"
//             onPress={() => {
//               routineDurationHandler('tomorrow');
//             }}
//             style={{
//               ...styles.durationButtonStyle,
//               borderColor:
//                 routineDuration === 'tomorrow'
//                   ? globalStyles.themeBlue
//                   : 'white',
//               borderWidth: responsiveWidth(0.23),
//             }}
//             textStyle={{
//               color:
//                 routineDuration === 'tomorrow'
//                   ? globalStyles.themeBlue
//                   : globalStyles.textGray,
//             }}
//           />
//         </View>

//         {/* set custom routine */}
//         {!params?.editTask && (
//           <View style={styles.routineContainer}>
//             <View style={styles.routineSubContainer}>
//               <Image
//                 source={require('../../assets/Icons/calendar-blue.png')}
//                 resizeMode="contain"
//                 style={{
//                   height: responsiveHeight(2),
//                   width: responsiveHeight(2),
//                 }}
//               />
//               <TextInput
//                 placeholder="26 Dec, 2023 - 25 Jan, 2024"
//                 style={{
//                   flex: 1,
//                   height: responsiveHeight(6),
//                   paddingLeft: responsiveWidth(2),
//                 }}
//               />
//             </View>
//             <BorderBtn
//               buttonText="Set Custom Routine"
//               onClick={setCustomDateAndTimeHandler}
//               containerStyle={{width: '38%'}}
//               buttonTextStyle={{
//                 fontSize: responsiveFontSize(1.5),
//                 fontWeight: '600',
//               }}
//             />
//           </View>
//         )}

//         {/* horizontal calendar strip */}
//         <HorizontalCalendarStrip
//           selected={date.toString()}
//           onSelectDate={date => {
//             setDate(date);
//           }}
//         />

//         {/* select time */}

//         <Time
//           value={new Date(time).toLocaleString().split(',')[1]}
//           placeholder="Select Time"
//           onClick={() => {
//             setOpen(true);
//           }}
//         />

//         <TextInputWithoutIcon
//           containerStyle={styles.description}
//           placeholder="Type Your Description Here…"
//           onChangeText={() => {}}
//           multiline={true}
//         />

//         {/* create Routine Button */}
//         <BorderBtn
//           buttonText={params?.editTask ? 'Save' : 'Create Task'}
//           containerStyle={styles.createRoutineButtonStyle}
//           onClick={createTask}
//         />
//         {params?.editTask && (
//           <BorderBtn
//             buttonText="Delete Task"
//             containerStyle={{
//               ...styles.createRoutineButtonStyle,
//               backgroundColor: 'red',
//             }}
//             onClick={() => {}}
//           />
//         )}
//       </Container>
//       {open && (
//         <View style={styles.timePickerContainer}>
//           <View style={styles.timeSubContainer}>
//             <DatePicker
//               mode="time"
//               open={open}
//               date={time === '' ? new Date() : time}
//               onDateChange={selectedDate => {
//                 setTime(selectedDate);
//               }}
//               style={styles.time}
//             />
//             <BorderBtn
//               buttonText="Save"
//               onClick={() => {
//                 setOpen(false);
//               }}
//               containerStyle={styles.saveTimeButton}
//             />
//           </View>
//         </View>
//       )}

//       {/* {openModal && (
//         <View style={styles.timePickerContainer}>
//           <Modal
//             text="Routine Create Successful"
//             buttonText="Close"
//             modalHandler={() => {
//               setOpenModal(false);
//             }}
//           />
//         </View>
//       )} */}
//     </>
//   );
// };

// export default EditTask;

// const styles = StyleSheet.create({
//   categoriesTabs: {
//     marginTop: responsiveHeight(1),
//     height: responsiveHeight(15),
//   },
//   flatlist: {
//     flex: 1,
//     marginBottom: responsiveHeight(2),
//   },
//   iconTab: {
//     height: responsiveHeight(13),
//   },
//   task: {
//     paddingHorizontal: responsiveWidth(2),
//     height: responsiveHeight(6),
//     fontSize: responsiveFontSize(1.8),
//     letterSpacing: 1,
//     color: globalStyles.textGray,
//     borderRadius: responsiveWidth(2),
//     elevation: 2,
//     shadowColor: globalStyles.shadowColor,
//     shadowOffset: {width: 0, height: 0},
//     shadowOpacity: 0.6,
//     shadowRadius: 3,
//     backgroundColor: 'white',
//   },
//   routineDurationText: {
//     marginTop: responsiveHeight(2),
//     fontSize: responsiveFontSize(1.6),
//     color: 'black',
//     fontWeight: '400',
//   },
//   routineDurationButtonContainer: {
//     flexDirection: 'row',
//     marginTop: responsiveHeight(1),
//   },
//   durationButtonStyle: {
//     marginRight: responsiveWidth(2),
//     width: '30%',
//     elevation: 2,
//     shadowColor: globalStyles.shadowColor,
//     shadowOffset: {width: 0, height: 0},
//     shadowOpacity: 0.6,
//     shadowRadius: 3,
//     backgroundColor: 'white',
//   },
//   routineContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: responsiveHeight(2),
//   },
//   routineSubContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 7,
//     backgroundColor: 'white',
//     width: '60%',
//     borderRadius: responsiveWidth(2),
//   },
//   timePickerContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     left: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//   },
//   timeSubContainer: {
//     backgroundColor: 'white',
//     elevation: 2,
//     shadowColor: globalStyles.shadowColor,
//     shadowOffset: {width: 0, height: 0},
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//     borderRadius: responsiveWidth(2),
//     padding: 10,
//   },
//   saveTimeButton: {
//     marginTop: responsiveHeight(2),
//     width: responsiveWidth(75),
//   },
//   time: {
//     fontSize: responsiveFontSize(2),
//     backgroundColor: 'white',
//     width: responsiveWidth(75),
//   },
//   description: {
//     marginTop: responsiveHeight(2),
//     backgroundColor: 'white',
//     height: responsiveHeight(15),
//     width: '100%',
//     elevation: 2,
//     shadowColor: globalStyles.shadowColor,
//     shadowOffset: {width: 0, height: 0},
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//     borderRadius: responsiveWidth(2),
//   },
//   createRoutineButtonStyle: {
//     marginTop: responsiveHeight(2),
//     width: '100%',
//   },
//   svgImageContainer: {
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     marginRight: responsiveWidth(2),
//     paddingBottom: responsiveHeight(0.5),
//     height: responsiveWidth(28),
//     width: responsiveWidth(24),
//     ...globalStyles.shadowStyle,
//     borderWidth: responsiveWidth(0.23),
//     borderRadius: responsiveWidth(2),
//   },
// });
