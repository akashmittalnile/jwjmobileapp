import {View, Text, ViewStyle, StyleSheet, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import Wrapper from '../Wrapper/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import BorderBtn from '../Button/BorderBtn';
import {useNavigation} from '@react-navigation/native';
import ScreenNames from '../../utils/ScreenNames';

interface SubscriptionProps {
  style?: ViewStyle;
  type: string;
  price: string;
  current: boolean;
  onClick?: () => void;
  buttonText?: string;
}

const Subscription: React.FC<SubscriptionProps> = ({
  style,
  type,
  price,
  current,
  onClick,
  buttonText = 'Upgrade',
}) => {
  const [planLogo, setPlanLogo] = useState<Function | null>();
  const navigation = useNavigation();

  useEffect(() => {
    if (type === 'a') {
      setPlanLogo(require('../../assets/Icons/plan.png'));
    } else if (type === 'b') {
      setPlanLogo(require('../../assets/Icons/plan-b.png'));
    } else if (type === 'c') {
      setPlanLogo(require('../../assets/Icons/plan-c.png'));
    }
  }, [type]);

  const updatePlanHandler = () => {
    onClick && onClick();
  };

  return (
    <Wrapper containerStyle={{...styles.wrapper, ...style}}>
      <View style={styles.header}>
        <View>
          {planLogo && (
            <Image
              source={
                planLogo ? planLogo : require('../../assets/Icons/plan.png')
              }
              resizeMode="contain"
              style={styles.img}
            />
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={{color: 'black'}}>{`Plan ${type?.toUpperCase()}`}</Text>
          <Text
            style={{
              fontSize: responsiveFontSize(2.6),
              fontWeight: '600',
              color: globalStyles.themeBlue,
            }}>
            {price}
          </Text>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        {/* {current && (
          <BorderBtn
            disable={true}
            containerStyle={styles.current}
            buttonText="Current plan"
            onClick={() => {}}
            buttonTextStyle={styles.btnText}
          />
        )} */}
        {/* {!current && (
          <BorderBtn
            disable={true}
            containerStyle={styles.current}
            buttonText="Monthly"
            onClick={() => {}}
            buttonTextStyle={styles.btnText}
          />
        )} */}
        <BorderBtn
          containerStyle={styles.buy}
          buttonText={buttonText}
          onClick={updatePlanHandler}
          buttonTextStyle={{
            fontSize: responsiveFontSize(1.8),
            fontWeight: '500',
          }}
        />
      </View>
    </Wrapper>
  );
};

export default Subscription;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'flex-start',
    borderRadius: responsiveWidth(2),
    width: responsiveWidth(60),
    paddingTop: responsiveWidth(2.5),
    padding: responsiveWidth(2.5),
    elevation: 3,
    shadowColor: globalStyles.shadowColor,
  },
  header: {
    flexDirection: 'row',
    // marginBottom: responsiveHeight(2)
  },
  img: {
    height: responsiveHeight(6),
    width: responsiveHeight(6),
    borderRadius: responsiveWidth(3),
  },
  textContainer: {
    marginLeft: responsiveWidth(2),
    justifyContent: 'space-between',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: responsiveHeight(1.5),
    width: responsiveWidth(45),
  },
  current: {
    height: responsiveHeight(5),
    paddingHorizontal: '3%',
    marginRight: '3%',
    width: 'auto',
    backgroundColor: 'white',
    borderWidth: responsiveWidth(0.15),
    borderColor: 'gray',
    borderEndWidth: 1,
  },
  btnText: {
    color: 'black',
    fontSize: responsiveFontSize(1.8),
    fontWeight: '500',
    width: responsiveWidth(40),
  },
  buy: {
    height: responsiveHeight(5),
    marginRight: '3%',
    width: '100%',
    // width: responsiveWidth(40),
  },
});
