import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React from 'react';
import Container from '../../components/Container/Container';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import CustomCalendar from '../../components/Calendar/CustomCalendar';
import {endPoint, GetApiWithToken} from '../../services/Service';
import {useAppSelector} from '../../redux/Store';
import SkeletonContainer from '../../components/Skeleton/SkeletonContainer';
import Toast from 'react-native-toast-message';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation/MainNavigation';
import Wrapper from '../../components/Wrapper/Wrapper';
import SvgUri from 'react-native-svg-uri';
import ScreenNames from '../../utils/ScreenNames';
import ImageSlider from '../../components/Slider/ImageSlider';
import moment from 'moment';

type CalendarRouteParams = RouteProp<RootStackParamList, 'Calendar'>;

interface CategoryTabProps {
  categoryName: string;
  imageUri: string;
  type: string;
  title: string;
  description: string;
  task?: string[];
  onPress?: () => void;
  sliderImages?: string[];
  date: string;
}

const CategoryTab: React.FC<CategoryTabProps> = ({
  categoryName,
  imageUri,
  type,
  title,
  description,
  task,
  onPress,
  sliderImages,
  date,
}) => {
  const temp = imageUri?.split('.');
  let imageType;
  if (temp?.length > 0) {
    imageType = temp[temp?.length - 1];
  }

  const onPressHandler = () => {
    if (onPress) {
      onPress();
    }
  };
  return (
    <Wrapper containerStyle={styles.wrapper}>
      <TouchableOpacity
        style={styles.touch1}
        activeOpacity={0.5}
        onPress={onPressHandler}>
        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <Text style={styles.categoryName}>{categoryName}</Text>
          {Array.isArray(task) && task?.length > 0 && (
            <View
              style={{
                marginLeft: responsiveWidth(1),
                backgroundColor: globalStyles.themeBlue,
                borderRadius: responsiveWidth(1),
                paddingVertical: 2,
                paddingHorizontal: 4,
              }}>
              <Text style={{color: 'white', fontSize: responsiveFontSize(1.6)}}>
                Daily
              </Text>
            </View>
          )}
        </View>
        <View style={styles.line} /> */}
        <View style={styles.categoryTabHeader}>
          {imageType === 'svg' ? (
            <View style={styles.imgContainer}>
              <SvgUri
                source={{uri: imageUri}}
                height={responsiveHeight(6)}
                width={responsiveHeight(6)}
              />
            </View>
          ) : (
            <View style={styles.imgContainer}>
              <Image
                source={{uri: imageUri}}
                resizeMode="cover"
                style={{
                  height: responsiveHeight(6),
                  width: responsiveHeight(6),
                  borderRadius: responsiveHeight(3),
                }}
              />
            </View>
          )}
          <Text style={styles.categoryTabHeaderText}>{type}</Text>
          <Text style={{flex: 1, textAlign: 'right', color: 'gray', fontSize: responsiveFontSize(1.6), fontWeight: '500'}}>
            {date}
          </Text>
        </View>
        {Array.isArray(sliderImages) && sliderImages?.length > 0 && (
          <ImageSlider data={sliderImages} />
        )}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </TouchableOpacity>
    </Wrapper>
  );
};

const Calendar = () => {
  const token = useAppSelector(state => state.auth.token);
  const {params} = useRoute<CalendarRouteParams>();
  const navigation = useNavigation();
  const [date, setDate] = React.useState<string | undefined>('');
  const [showCalendar, setShowCalendar] = React.useState<boolean>(false);
  const [showSkeleton, setShowSkeleton] = React.useState<boolean>(false);
  const [data, setData] = React.useState<
    {
      community: any[];
      journal: any[];
      routine: any[];
    }[]
  >([{community: [], journal: [], routine: []}]);

  React.useEffect(() => {
    setDate(params?.date);
    getJournalsList(params?.date);
  }, []);

  const getJournalsList = async (listParams?: {}) => {
    !showSkeleton && setShowSkeleton(true);
    try {
      const response = await GetApiWithToken(
        listParams
          ? `${endPoint.search}?date=${listParams}`
          : endPoint.journals,
        token,
      );
      if (response?.data?.status) {
        setData(response?.data?.data);
      }
      if (!response?.data?.status) {
        Toast.show({
          type: 'error',
          text1: response?.data?.message,
        });
      }
    } catch (err: any) {
      console.log('err in getting journasl list', err.message);
    } finally {
      setShowSkeleton(false);
    }
  };

  const calendarHandler = () => {
    setShowCalendar(true);
  };
  const _dateHandler = async (date: string) => {
    setDate(date);
    showCalendar && setShowCalendar(false);
    await getJournalsList(date);
  };

  const goToJournalInfo = (journalsId: number) => {
    navigation.navigate(ScreenNames.JournalsInfo, {journalsId});
  };

  const goToRoutineDetails = (routineId: number) => {
    navigation.navigate(ScreenNames.RoutineDetailsWithTask, {id: routineId});
  };

  return (
    <>
      <Container
        headerText=""
        scrollViewContentContainerStyle={{
          paddingBottom: responsiveHeight(5),
          minHeight: responsiveHeight(85),
        }}>
        <View style={styles.addnewJournalsContainer}>
          <View
            style={{
              ...styles.addnewJournalsCalendar,
            }}>
            <TouchableOpacity style={styles.touch} onPress={calendarHandler}>
              <Image
                source={require('../../assets/Icons/calendar-blue.png')}
                resizeMode="contain"
                style={styles.img}
              />
              {/* <Text style={styles.textInput}>{date ? date?.split('-').reverse().join('-') : 'YYYY-MM-DD'?.split('-').reverse().join('-')}</Text> */}
              <Text style={styles.textInput}>
                {date ? moment(date).format('MM-DD-YYYY') : 'MM-DD-YYYY'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {!showSkeleton && data[0].journal?.length > 0 && (
          <>
            <View style={{marginTop: responsiveHeight(2)}}>
              <Text
                style={{
                  fontSize: responsiveFontSize(1.8),
                  fontWeight: '500',
                  color: 'black',
                }}>
                {data[0].journal?.length > 1 ? 'Journals' : 'Journal'}
              </Text>
            </View>
            {data[0]?.journal?.map((item, index) => (
              <CategoryTab
                key={index}
                categoryName="Journal"
                imageUri={item?.mood_logo}
                type={item?.mood_name}
                title={item?.title}
                description={item?.content}
                onPress={() => {
                  goToJournalInfo(item?.id);
                }}
                date={item?.created_at}
              />
            ))}
          </>
        )}
        {!showSkeleton && data[0].routine?.length > 0 && (
          <>
            <View
              style={{
                marginTop: responsiveHeight(2),
              }}>
              <Text
                style={{
                  fontSize: responsiveFontSize(1.8),
                  fontWeight: '500',
                  color: 'black',
                }}>
                {data[0].routine?.length > 1 ? 'Routines' : 'Routine'}
              </Text>
            </View>
            {data[0]?.routine?.map((item, index) => (
              <CategoryTab
                key={index}
                categoryName=""
                imageUri={item?.category_logo}
                type={item?.category_name}
                title={item?.routinename}
                description={item?.description}
                onPress={() => {
                  goToRoutineDetails(item?.routineid);
                }}
                date={item?.created_at}
              />
            ))}
          </>
        )}
        {/* {!false && data[0].community?.length > 0 && (
          <CategoryTab
            categoryName="Community"
            imageUri={data[0].community[0].category_logo}
          />
        )} */}
        {!showSkeleton &&
          data[0].routine?.length === 0 &&
          data[0].journal?.length === 0 && (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: responsiveHeight(10),
              }}>
              <Image
                source={require('../../assets/Icons/no-data-found.png')}
                resizeMode="contain"
                style={{
                  height: responsiveHeight(15),
                  width: responsiveWidth(30),
                }}
              />
              <Text
                style={{
                  fontSize: responsiveFontSize(2.7),
                  fontWeight: '400',
                  textAlign: 'center',
                  color: 'black',
                }}>
                No Data Found
              </Text>
            </View>
          )}
        {showSkeleton && <SkeletonContainer />}
      </Container>
      {showCalendar && (
        <View style={styles.calendarContainer}>
          <CustomCalendar
            value={date}
            containerStyle={styles.calendarStyle}
            dateHandler={_dateHandler}
          />
        </View>
      )}
    </>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  addnewJournalsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: responsiveHeight(7),
    width: '100%',
  },
  addnewJournalsCalendar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: '2%',
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: responsiveWidth(2),
    elevation: 3,
    shadowColor: globalStyles.veryLightGray,
    overflow: 'hidden',
  },
  touch: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: responsiveWidth(60),
  },
  img: {
    flex: 1.2,
    height: '50%',
  },
  textInput: {
    flex: 8,
    fontSize: responsiveFontSize(2),
    color: 'black',
    fontWeight: '400',
    paddingLeft: responsiveWidth(2),
  },
  calendarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  calendarStyle: {
    width: responsiveWidth(80),
    padding: 10,
    borderRadius: responsiveWidth(2),
  },
  wrapper: {
    marginTop: responsiveHeight(1.5),
    paddingTop: responsiveHeight(1),
    width: '100%',
    borderRadius: responsiveWidth(2),
    overflow: 'hidden',
  },
  touch1: {
    paddingBottom: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(5),
    width: '100%',
  },
  categoryName: {
    textAlign: 'left',
    fontSize: responsiveFontSize(2.2),
    fontWeight: '500',
  },
  line: {
    marginTop: responsiveHeight(1),
    width: '100%',
    borderBottomWidth: responsiveHeight(0.1),
    borderColor: 'rgba(0,0,0,0.2)',
  },
  categoryTabHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: responsiveHeight(1),
    height: responsiveHeight(6),
    width: '100%',
  },
  categoryTabHeaderText: {
    paddingLeft: responsiveWidth(4),
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    letterSpacing: 0.8,
    color: 'black',
  },
  imgContainer: {
    height: responsiveHeight(6),
    width: responsiveHeight(6),
    borderRadius: responsiveHeight(3),
  },
  title: {
    marginTop: responsiveHeight(1),
    fontSize: responsiveFontSize(1.8),
    fontWeight: '500',
    width: '100%',
    textAlign: 'left',
    letterSpacing: 1,
    color: 'black',
  },
  description: {
    marginTop: responsiveHeight(1),
    fontSize: responsiveFontSize(1.6),
    width: '100%',
    color: 'black',
  },
});
