import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  NativeModules,
} from 'react-native';
import React from 'react';
import Header from '../../components/Header/Header';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';
import CustomCalendar from '../../components/Calendar/CustomCalendar';
import {globalStyles} from '../../utils/constant';
import Wrapper from '../../components/Wrapper/Wrapper';
import SearchCriteria from '../../components/Search/SearchCriteria';
import {useRoute, RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation/MainNavigation';
import {GetApiWithToken, endPoint} from '../../services/Service';
import {useAppSelector} from '../../redux/Store';
import ImageSlider from '../../components/Slider/ImageSlider';
import ScreenNames from '../../utils/ScreenNames';
import moment from 'moment';

type JournalsInfoRouteParams = RouteProp<RootStackParamList, 'JournalsInfo'>;
const JournalsInfo = () => {
  const navigation = useNavigation();
  const {params} = useRoute<JournalsInfoRouteParams>();
  const token = useAppSelector(state => state.auth.token);
  const [date, setDate] = React.useState<string>('10/10/2023');
  const [data, setData] = React.useState<any>({});
  const [openCalendarModal, setDateOpenModal] = React.useState<boolean>(false);

  React.useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    if (params?.journalsId) {
      const response = await GetApiWithToken(
        endPoint.journalsDetails + params?.journalsId,
        token,
      );
      if (response?.data?.status) {
        setData(response?.data?.data);
      }
    }
  };

  const dateHandler = (date: string) => {
    let resultString = date.replace(/[^0-9]/g, '');
    const year = resultString.slice(0, 4);
    const month = resultString.slice(4, 6);
    const day = resultString.slice(6);
    setDate(`${day}/${month}/${year}`);
    setDateOpenModal(false);
  };

  const goToHomeScreen = () => {
    navigation.navigate(ScreenNames.Home);
  };
  return (
    <>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Header
            title="Journals Info"
            notificationButton={false}
            onClick={goToHomeScreen}
          />
        </View>
        <View style={styles.subContainer}>
          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            {/* calendar */}
            <View style={styles.calendarContainer}>
              <TouchableOpacity
                disabled={true}
                style={styles.touch}
                onPress={() => {
                  setDateOpenModal(true);
                }}>
                <Image
                  source={require('../../assets/Icons/calendar-blue.png')}
                  resizeMode="contain"
                  style={styles.img}
                />
              </TouchableOpacity>
              <Text style={{color: 'black'}}>
                {data?.created_at
                  ? moment(data?.created_at, 'DD MMM, YYYY hh:mm A').format(
                      'MMM DD, YYYY',
                    )
                  : ''}
              </Text>
            </View>

            {/* story */}
            <Wrapper containerStyle={styles.wrapper}>
              <View style={styles.emojiContainer}>
                {data.mood_logo && (
                  <Image
                    source={{uri: data.mood_logo}}
                    style={styles.emojiIcon}
                  />
                )}
                <Text style={styles.emojiText}>{data?.mood_name}</Text>
              </View>

              {/* story heading */}
              <Text style={styles.storyHeading}>{data?.title}</Text>
              <Text style={styles.storyText}>{data?.content}</Text>
              {data?.images?.length > 0 && (
                <ImageSlider
                  imageStyle={{width: responsiveWidth(88)}}
                  data={data?.images?.map((item: any) => `${item?.img_path}`)}
                />
              )}
              {data?.images?.length === 0 && (
                <>
                  <Image
                    source={require('../../assets/Icons/no-data-found.png')}
                    resizeMode="contain"
                    style={{
                      marginTop: responsiveHeight(2),
                      height: responsiveHeight(15),
                    }}
                  />
                  <View
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text
                      style={{color: 'black', fontSize: responsiveFontSize(2)}}>
                      No Image
                    </Text>
                  </View>
                </>
              )}
              <SearchCriteria
                data={data?.search_criteria}
                date={data?.created_at}
              />
            </Wrapper>
          </ScrollView>
        </View>
      </View>
      {openCalendarModal && (
        <View style={styles.customCalendarPicker}>
          <CustomCalendar
            containerStyle={styles.customCalendarStyle}
            dateHandler={dateHandler}
          />
        </View>
      )}
    </>
  );
};

export default JournalsInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: responsiveHeight(2),
    backgroundColor: globalStyles.themeBlue,
  },
  subContainer: {
    flex: 1,
    width: responsiveWidth(95),
    paddingTop: responsiveHeight(1.5),
  },
  calendarContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: responsiveHeight(6),
    width: '100%',
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: globalStyles.shadowColor,
    borderRadius: responsiveWidth(2),
  },
  touch: {
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveHeight(6),
    width: responsiveWidth(12),
  },
  img: {
    height: responsiveHeight(2.2),
    width: responsiveHeight(2.2),
  },
  textInput: {
    fontSize: responsiveFontSize(2),
    textAlignVertical: 'center',
  },
  wrapper: {
    marginTop: responsiveHeight(1.5),
    paddingTop: responsiveHeight(2.5),
    padding: responsiveWidth(3),
    width: '100%',
    borderRadius: responsiveWidth(2),
  },
  emojiContainer: {
    alignItems: 'center',
  },
  emojiIcon: {
    height: responsiveHeight(9),
    width: responsiveHeight(9),
  },
  emojiText: {
    marginTop: responsiveHeight(0.5),
    fontSize: responsiveFontSize(1.8),
    fontWeight: '600',
    color: globalStyles.textGray,
  },
  storyHeading: {
    marginTop: responsiveHeight(1),
    fontSize: responsiveFontSize(1.6),
    fontWeight: '600',
    width: '100%',
  },
  storyText: {
    marginTop: responsiveHeight(0.5),
    marginBottom: responsiveHeight(0.5),
    fontSize: responsiveFontSize(1.6),
    fontWeight: '400',
    color: globalStyles.textGray,
    letterSpacing: 1,
  },
  storyImageContainer: {
    marginTop: responsiveHeight(1.5),
    height: responsiveHeight(17),
    width: responsiveWidth(90),
    borderRadius: responsiveWidth(2),
    overflow: 'hidden',
  },
  storyImage: {
    height: '100%',
    width: '100%',
  },
  searchCriteriaText: {
    marginTop: responsiveHeight(1.5),
    fontSize: responsiveFontSize(1.6),
    fontWeight: '400',
    width: '100%',
  },
  criteriaButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: responsiveHeight(1),
    width: '100%',
  },
  criteriaButtonStyle: {
    width: 'auto',
    height: responsiveHeight(4),
    paddingHorizontal: responsiveWidth(2),
    marginRight: responsiveWidth(3),
  },
  criteriaButtonTextStyle: {
    fontSize: responsiveFontSize(1.4),
    fontWeight: '600',
  },
  customCalendarPicker: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  customCalendarStyle: {
    padding: responsiveWidth(7),
    width: responsiveWidth(80),
    borderRadius: responsiveWidth(3),
  },
});
