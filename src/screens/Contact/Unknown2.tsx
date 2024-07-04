import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import React from 'react';
import Container from '../../components/Container/Container';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import CustomCalendar from '../../components/Calendar/CustomCalendar';
import happy from '../../assets/Icons/happy.png';
import meditation from '../../assets/Icons/meditation.png';
import learning from '../../assets/Icons/learn.png';
import EmojiTab from '../../components/Tab/EmojiTab';

const tempData = [
  {
    headerText: 'Journals',
    text: 'Happy',
    url: Image.resolveAssetSource(happy).uri,
    percentage: '70%',
    date: '01 Wed, 09:30',
    heading: 'Jesus I Trust in you',
    description:
      'Today Wins A Good Din I Washed This Morning And Everyone Showed For Their Shift. The Boss Bought Lunch For Us All.',
  },
  {
    headerText: 'Routine',
    text: 'Meditation',
    url: Image.resolveAssetSource(meditation).uri,
    percentage: '88%',
    date: '01 Wed, 09:30',
    heading: 'Jesus I Trust in you',
    description:
      'Today Wins A Good Din I Washed This Morning And Everyone Showed For Their Shift. The Boss Bought Lunch For Us All.',
  },
  {
    headerText: 'Routine',
    text: 'Learning',
    url: Image.resolveAssetSource(learning).uri,
    percentage: '43%',
    date: '01 Wed, 09:30',
    heading: 'Jesus I Trust in you',
    description:
      'Today Wins A Good Din I Washed This Morning And Everyone Showed For Their Shift. The Boss Bought Lunch For Us All.',
  },
];

const Unkonwn2 = () => {
  const [modal, setModal] = React.useState<boolean>(false);
  const [date, setDate] = React.useState<string>('10/10/2023');
  const dateHandler = (date: any) => {
    setDate(`${date}`);
    setModal(value => !value);
  };
  return (
    <>
      <Container headerText="Contact us">
        <View style={styles.add}>
          <View style={styles.touch}>
            <Image
              source={require('../../assets/Icons/calendar-blue.png')}
              resizeMode="contain"
              style={styles.icon}
            />
            <Text style={styles.addText}>{date}</Text>
          </View>
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{
            marginBottom: responsiveHeight(5),
          }}>
          {tempData.map((item, index) => (
            <EmojiTab
              key={index.toString()}
              imageUri={item.url}
              headerText={item.headerText}
              headerButtonText="View"
              heading={item.heading}
              emojiText={item.text}
              date={item.date}
              description={item.description}
              headerButtonStyle={{
                height: responsiveHeight(4),
                backgroundColor: '#3DA1E3',
              }}
              iconStyle={{width: responsiveWidth(12)}}
            />
          ))}
        </ScrollView>
      </Container>
      {modal && (
        <View style={styles.calendarContainer}>
          <CustomCalendar
            containerStyle={styles.calendar}
            dateHandler={dateHandler}
          />
        </View>
      )}
    </>
  );
};

export default Unkonwn2;

const styles = StyleSheet.create({
  add: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    height: responsiveHeight(2),
    width: responsiveHeight(2),
  },
  touch: {
    flex: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginRight: responsiveWidth(1.5),
    paddingHorizontal: responsiveWidth(3),
    height: responsiveHeight(7),
    borderRadius: responsiveWidth(2),
    ...globalStyles.shadowStyle,
  },
  addText: {
    marginLeft: responsiveWidth(2),
    color: globalStyles.midGray,
  },
  buttonStyle: {
    flex: 1,
  },
  buttonText: {
    fontSize: responsiveFontSize(3),
  },
  scrollView: {
    flex: 1,
    marginTop: responsiveHeight(1.2),
  },
  calendarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  calendar: {
    width: responsiveWidth(85),
    borderRadius: responsiveWidth(2),
    paddingVertical: responsiveHeight(1),
  },
});
