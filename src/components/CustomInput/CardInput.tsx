/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable curly */
/* eslint-disable prettier/prettier */
/* eslint-disable eol-last */
/* eslint-disable prettier/prettier */
import {
  View,
  Image,
  StyleSheet,
  ViewStyle,
  TextInput,
  ImageStyle,
} from 'react-native';
import React from 'react';
import cardValidator from 'card-validator';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import visa from '../../assets/Icons/visa.png';
import mastercard from '../../assets/Icons/master-card.png';
import americanExpress from '../../assets/Icons/american-express.png';
import maestro from '../../assets/Icons/maestro.png';
import creditCard from '../../assets/Icons/credit-card.png';

interface CardInputProps {
  containerStyle?: ViewStyle;
  imageContainer?: ViewStyle;
  ImageStyle?: ImageStyle;
  inputStyle?: ViewStyle;
  onChangeText?: ({
    number,
    isValid,
  }: {
    number: string;
    isValid: boolean;
  }) => void;
  placeholder?: string;
}

const visaPath = Image.resolveAssetSource(visa).uri;
const mastercardPath = Image.resolveAssetSource(mastercard).uri;
const americanExpressPath = Image.resolveAssetSource(americanExpress).uri;
const maestroPath = Image.resolveAssetSource(maestro).uri;
const creditCardPath = Image.resolveAssetSource(creditCard).uri;

const CardInput: React.FC<CardInputProps> = ({
  containerStyle,
  imageContainer,
  ImageStyle,
  inputStyle,
  onChangeText,
  placeholder,
}) => {
  const [imageUri, setImageUri] = React.useState<string>(creditCardPath);
  const [cardNumber, setCardNumber] = React.useState<string>('');

  const handleCardValidation = (text: string) => {
    const number = text.replace(/[^\d]/g, '');
    cardImageHandler(number);
    cardNumberFormatHandler(number);
  };

  const cardImageHandler = (number: string) => {
    if (number[0] === cardNumber[0] && number.length > 2) {
      return;
    } else {
      const cardType = cardValidator.number(number).card?.type;
      if (cardType === 'visa') {
        setImageUri(visaPath);
      } else if (cardType === 'mastercard') {
        setImageUri(mastercardPath);
      } else if (cardType === 'american-express') {
        setImageUri(americanExpressPath);
      } else if (cardType === 'maestro') {
        setImageUri(maestroPath);
      } else {
        setImageUri(creditCardPath);
      }
    }
  };

  const cardNumberFormatHandler = (number: string) => {
    if (number.length > 12) {
      const firstPart = number.substring(0, 4);
      const secondPart = number.substring(4, 8);
      const thirdPart = number.substring(8, 12);
      const fourthPart = number.substring(12);
      number = `${firstPart}-${secondPart}-${thirdPart}-${fourthPart}`;
    } else if (number.length > 8) {
      const firstPart = number.substring(0, 4);
      const secondPart = number.substring(4, 8);
      const thirdPart = number.substring(8);
      number = `${firstPart}-${secondPart}-${thirdPart}`;
    } else if (number.length > 4) {
      const firstPart = number.substring(0, 4);
      const secondPart = number.substring(4);
      number = `${firstPart}-${secondPart}`;
    }
    setCardNumber(number);
    if (onChangeText) {
      const isValid = cardValidator.number(number).isValid;
      onChangeText({number, isValid});
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.imgContainer, imageContainer]}>
        {imageUri && (
          <Image
            source={{uri: imageUri}}
            style={[styles.img, ImageStyle]}
            resizeMode="contain"
          />
        )}
      </View>
      <View style={styles.line} />
      <TextInput
        value={cardNumber}
        autoFocus={true}
        onChangeText={handleCardValidation}
        style={[styles.textInput, inputStyle]}
        maxLength={19}
        placeholder={placeholder}
      />
    </View>
  );
};

export default CardInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: responsiveHeight(7),
    width: responsiveWidth(91),
    paddingHorizontal: responsiveWidth(2),
    backgroundColor: 'white',
    borderRadius: responsiveWidth(2),
    elevation: 3,
    shadowColor: globalStyles.shadowColor,
  },
  imgContainer: {
    justifyContent: 'center',
    height: '100%',
    width: '10%',
  },
  img: {
    height: '60%',
    width: '100%',
  },
  line: {
    marginHorizontal: responsiveWidth(3),
    height: '70%',
    width: 1,
    backgroundColor: globalStyles.shadowColor,
  },
  textInput: {
    flex: 1,
    fontSize: responsiveFontSize(2),
    fontWeight: '400',
  },
});
