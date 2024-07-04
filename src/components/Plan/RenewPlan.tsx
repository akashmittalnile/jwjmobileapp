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

interface RenewPlanProps {
  style?: ViewStyle;
  planName: string;
  planPrice: string;
  buttonText: string;
  onClick?: () => void
}

const RenewPlan: React.FC<RenewPlanProps> = ({
  style,
  planPrice,
  planName,
  buttonText,
  onClick
}) => {
  const [planIcon, setPlanIcon] = React.useState<any>('');
  React.useEffect(() => {
    planIconHandler();
  }, [planName]);

  const planIconHandler = () => {
    if (planName === 'Plan A') {
      setPlanIcon(require('../../assets/Icons/free.png'));
    } else if (planName === 'Plan B') {
      setPlanIcon(require('../../assets/Icons/plan-b.png'));
    } else {
      setPlanIcon(require('../../assets/Icons/plan-c.png'));
    }
  };

  const clickHandler = () => {
    onClick && onClick()
  }

  return (
    <Wrapper containerStyle={{...styles.wrapper, ...style}}>
      <View style={styles.planDetailsContainer}>
        <View style={styles.iconContainer}>
          {planIcon && (
            <Image source={planIcon} resizeMode="contain" style={styles.icon} />
          )}
        </View>
        <View
          style={{
            justifyContent: 'space-between',
            height: responsiveHeight(5.5),
            paddingLeft: responsiveWidth(2.5),
          }}>
          <Text style={styles.planType}>
            {planName}
          </Text>
          <Text style={styles.planPrice}>{planPrice}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <BorderBtn
          buttonText={buttonText}
          onClick={clickHandler}
          containerStyle={styles.button}
        />
      </View>
    </Wrapper>
  );
};

export default RenewPlan;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: responsiveHeight(2),
    paddingBottom: responsiveHeight(2),
    borderWidth: responsiveWidth(0.3),
    borderColor: '#EAEDF7',
    borderRadius: responsiveWidth(2),
    elevation: 2,
    shadowColor: globalStyles.shadowColor,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.7,
    shadowRadius: 3,
    backgroundColor: 'white',
  },
  planDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 2,
    paddingLeft: responsiveWidth(7),
  },
  iconContainer: {
    height: responsiveHeight(6),
    width: responsiveWidth(10),
  },
  icon: {
    height: responsiveHeight(6),
    width: responsiveWidth(10),
  },
  buttonContainer: {
    flex: 1,
  },
  planType: {
    color: 'black',
    fontSize: responsiveFontSize(1.7),
    fontWeight: '500',
  },
  planPrice: {
    fontSize: responsiveFontSize(2.8),
    fontWeight: '600',
    color: globalStyles.themeBlue,
  },
  button: {
    height: responsiveHeight(4),
    width: '80%',
  },
});
