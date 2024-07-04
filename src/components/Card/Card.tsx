import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import {PaymentIcon} from 'react-native-payment-icons';

interface CardProps {
    cardId: string;
  isSelected?: boolean;
  onPress: (text: string) => void;
  name: string;
  lastDigit: string;
  expire: string;
}

const Card: React.FC<CardProps> = ({
    cardId,
  isSelected = false,
  onPress,
  name,
  lastDigit,
  expire,
}) => {
  const handleCardSelection = () => {
    onPress && onPress(cardId);
  };
  return (
    <View style={styles.container}>
      <View style={styles.cardType}>
        <PaymentIcon type={name} width={responsiveWidth(11)} />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardInfoText}>**** **** **** {lastDigit}</Text>
        <Text style={styles.cardInfoText}>Expires {expire}</Text>
      </View>
      <View style={styles.checkBoxContainer}>
        <TouchableOpacity
          style={{
            ...styles.touch,
            borderColor: isSelected ? globalStyles.themeBlue : 'gray',
            backgroundColor: isSelected
              ? globalStyles?.themeBlue
              : 'transparent',
          }}
          onPress={handleCardSelection}>
          {isSelected && (
            <Image
              source={require('../../assets/Icons/tick.png')}
              resizeMode="contain"
              style={styles.img}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: responsiveHeight(2),
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(3),
    shadowColor: 'rgba(0,0,0,0.7)',
    ...Platform.select({
      ios: {
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 5.5,
      },
    }),
    backgroundColor: 'white',
    borderRadius: responsiveWidth(2),
  },
  cardType: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: responsiveWidth(5),
    width: responsiveWidth(12),
    overflow: 'hidden',
  },
  cardTypeText: {
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
    color: globalStyles.themeBlue,
  },
  cardInfo: {
    justifyContent: 'center',
  },
  cardInfoText: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: '400',
    color: 'black',
  },
  checkBoxContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  touch: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveHeight(3),
    width: responsiveHeight(3),
    borderRadius: responsiveWidth(1),
    borderWidth: responsiveWidth(0.23),
  },
  img: {
    height: responsiveHeight(2),
    width: responsiveHeight(2),
  },
});
