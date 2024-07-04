import {View, Text, StyleSheet, Image, ViewStyle} from 'react-native';
import React from 'react';
import Wrapper from '../Wrapper/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import BorderBtn from '../Button/BorderBtn';

interface MemberListTabProps {
  profileIconUri?: string;
  name: string;
  planName: string;
  style?: ViewStyle;
  planIconUri?: string;
}

const MemberListTab: React.FC<MemberListTabProps> = ({
  profileIconUri,
  name,
  planName,
  style,
  planIconUri,
}) => {
  const [nameSign, setNameSign] = React.useState<string>('');

  React.useEffect(() => {
    nameSignHandler();
  }, [name]);

  const nameSignHandler = () => {
    const tempArray = name.split(' ');
    const sign = tempArray.reduce(
      (accumulator, currentValue) => accumulator + currentValue[0],
      '',
    );
    setNameSign(sign);
  };

  return (
    <Wrapper containerStyle={{...styles.wrapper, ...style}}>
      <View style={{flex: 1}}>
        <View style={styles.signContainer}>
          {profileIconUri ? (
            <Image source={{uri: profileIconUri}} style={styles.img} />
          ) : (
            <Text style={styles.nameSignText}>{nameSign}</Text>
          )}
        </View>
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.nameAndTime}>
          <Text style={styles.name}>{name}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <Image
            source={{uri: planIconUri}}
            resizeMode="contain"
            style={styles.planIconUri}
          />
          <Text style={styles.planName}>{planName}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <BorderBtn
          buttonText="Message"
          onClick={() => {}}
          containerStyle={styles.button}
          buttonTextStyle={styles.buttonTextStyle}
        />
      </View>
    </Wrapper>
  );
};

export default MemberListTab;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    marginTop: responsiveHeight(1),
    paddingTop: responsiveHeight(1.5),
    paddingBottom: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(3),
    width: '100%',
    borderRadius: responsiveWidth(2),
  },
  signContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveHeight(5),
    width: responsiveHeight(5),
    borderRadius: responsiveHeight(2.5),
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
  },
  img: {
    height: responsiveHeight(5),
    width: responsiveHeight(5),
  },
  nameSignText: {
    color: globalStyles.themeBlue,
    fontSize: responsiveFontSize(1.7),
    fontWeight: '600',
  },
  detailsContainer: {
    flex: 4,
    marginLeft: responsiveWidth(1),
  },
  nameAndTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveHeight(0.5),
  },
  name: {
    color: 'black',
    fontSize: responsiveFontSize(1.6),
    fontWeight: '500',
  },
  time: {
    color: globalStyles.midGray,
    fontSize: responsiveFontSize(1.4),
  },
  planName: {
    color: globalStyles.themeBlue,
    fontSize: responsiveFontSize(1.4),
    fontWeight: '500',
  },
  description: {
    color: globalStyles.textGray,
    fontSize: responsiveFontSize(1.4),
    fontWeight: '500',
  },
  planIconUri: {
    height: responsiveHeight(1.8),
    width: responsiveHeight(1.8),
  },
  buttonContainer: {
    flex: 2,
    alignItems: 'center',
  },
  button: {
    height: responsiveHeight(3),
    width: responsiveWidth(20),
    borderRadius: responsiveWidth(1),
    ...globalStyles.shadowStyle,
    backgroundColor: '#3DA1E3',
  },
  buttonTextStyle: {
    fontSize: responsiveFontSize(1.4),
    fontWeight: '700',
  },
});
