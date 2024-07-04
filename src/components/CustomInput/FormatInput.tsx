import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Keyboard,
} from 'react-native';
import React from 'react';
import Wrapper from '../Wrapper/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import BorderBtn from '../Button/BorderBtn';
import IconButton from '../Button/IconButton';

interface FormatInputProps {
  placeholder?: string;
  textButtunIcon: string;
  micButtonIcon: string;
  _micButtonIcon: string;
  textButtonText: string;
  micButtonText: string;
  onClickBottomLeftButton: () => void;
  onClickBottomRightButton: () => void;
  onChangeText?: (text: string) => void;
  value?: string;
  editable?: boolean;
}

const initialValue = {
  bold: false,
  italic: false,
  underline: false,
  automatic: false,
};

const initialValue2 = {
  left: false,
  right: false,
  center: false,
  bullet: false,
};

const FormatInput: React.FC<FormatInputProps> = ({
  placeholder,
  textButtunIcon,
  micButtonIcon,
  _micButtonIcon,
  textButtonText,
  micButtonText,
  onClickBottomLeftButton,
  onClickBottomRightButton,
  onChangeText,
  value,
  editable = true,
}) => {
  const [fontStyle, setFontStyle] = React.useState<{
    bold: boolean;
    italic: boolean;
    underline: boolean;
    automatic: boolean;
  }>(initialValue);
  const [fontAlignment, setFontAlignment] = React.useState<{
    left: boolean;
    right: boolean;
    center: boolean;
    bullet: boolean;
  }>(initialValue2);
  const [selectedButton, setSelectedButton] = React.useState<string>('text');
  const [text, setText] = React.useState<string>('');

  React.useEffect(() => {
    if (value) {
      setText(value);
    }
  }, [value]);

  const fontStyleHandler = (style: object) => {
    setFontStyle({...initialValue, ...style});
  };

  const fontAlignmentHandler = (style: object) => {
    setFontAlignment({...initialValue2, ...style});
  };

  const selectedButtonHandler = (text: string) => {
    if (!editable) {
      return;
    }
    setSelectedButton(text);
  };

  const textHandler = (text: string) => {
    setText(text);
    if (onChangeText) {
      onChangeText(text);
    }
  };

  return (
    <Wrapper containerStyle={styles.wrapper}>
      {/* <View style={styles.header}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '45%',
          }}>
          <TouchableOpacity
            onPress={() => fontStyleHandler({bold: true})}
            style={{
              backgroundColor: fontStyle.bold
                ? globalStyles.veryLightGray
                : 'transparent',
            }}>
            <Image
              source={require('../../assets/Icons/bold.png')}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => fontStyleHandler({italic: true})}
            style={{
              backgroundColor: fontStyle.italic
                ? globalStyles.veryLightGray
                : 'transparent',
            }}>
            <Image
              source={require('../../assets/Icons/italic.png')}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => fontStyleHandler({underline: true})}
            style={{
              backgroundColor: fontStyle.underline
                ? globalStyles.veryLightGray
                : 'transparent',
            }}>
            <Image
              source={require('../../assets/Icons/underline.png')}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require('../../assets/Icons/automatic.png')}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '45%',
          }}>
          <TouchableOpacity
            onPress={() => fontAlignmentHandler({left: true})}
            style={{
              backgroundColor: fontAlignment.left
                ? globalStyles.veryLightGray
                : 'transparent',
            }}>
            <Image
              source={require('../../assets/Icons/Paragraph-left.png')}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => fontAlignmentHandler({center: true})}
            style={{
              backgroundColor: fontAlignment.center
                ? globalStyles.veryLightGray
                : 'transparent',
            }}>
            <Image
              source={require('../../assets/Icons/Paragraph-center.png')}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require('../../assets/Icons/Paragraph-bullet.png')}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require('../../assets/Icons/Paragraph-3.png')}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View> */}
      <View style={styles.textInputContainer}>
        <TextInput
          editable={editable}
          value={text}
          placeholder={placeholder}
          placeholderTextColor={globalStyles.textGray}
          onChangeText={textHandler}
          blurOnSubmit={true}
          onSubmitEditing={() => {
            Keyboard.dismiss();
          }}
          style={[
            styles.textInput,
            fontStyle.bold && {fontWeight: 'bold'},
            fontStyle.underline && {textDecorationLine: 'underline'},
            fontStyle.italic && {fontStyle: 'italic'},
            fontAlignment.left && {textAlign: 'left'},
            fontAlignment.center && {textAlign: 'center'},
            // fontStyle.bold && {fontWeight: 'bold'},
          ]}
          multiline={true}
        />
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <View style={{width: '48%'}}>
          <IconButton
            disable={!editable}
            text={textButtonText}
            iconUri={textButtunIcon}
            style={{
              backgroundColor:
                selectedButton === 'text' ? globalStyles.themeBlue : 'white',
            }}
            textStyle={{color: selectedButton === 'text' ? 'white' : 'black'}}
            onPress={() => {
              selectedButtonHandler('text');
              onClickBottomLeftButton();
            }}
          />
        </View>
        <View style={{width: '48%'}}>
          <IconButton
            disable={!editable}
            text={micButtonText}
            iconUri={selectedButton === 'text' ? micButtonIcon : _micButtonIcon}
            style={{
              backgroundColor:
                selectedButton === 'mic' ? globalStyles.themeBlue : 'white',
            }}
            textStyle={{color: selectedButton === 'mic' ? 'white' : 'black'}}
            onPress={() => {
              selectedButtonHandler('mic');
              onClickBottomRightButton();
            }}
          />
        </View>
      </View>
    </Wrapper>
  );
};

export default FormatInput;

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: responsiveHeight(0),
    paddingBottom: responsiveHeight(1.2),
    borderRadius: responsiveWidth(2),
    width: '100%',
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: responsiveHeight(1),
    paddingVertical: responsiveHeight(1.5),
    width: '100%',
    borderBottomWidth: responsiveHeight(0.1),
    borderBottomColor: globalStyles.lightGray,
  },
  textInputContainer: {
    height: responsiveHeight(17),
    width: '100%',
    borderBottomWidth: responsiveHeight(0.1),
    borderBottomColor: globalStyles.lightGray,
    marginBottom: responsiveHeight(1),
  },
  textInput: {
    padding: responsiveWidth(3),
    height: responsiveHeight(17),
    width: '100%',
    fontSize: responsiveFontSize(1.6),
    fontWeight: '300',
    color: globalStyles.textGray,
    letterSpacing: 1.5,
    lineHeight: responsiveHeight(2),
  },
});
