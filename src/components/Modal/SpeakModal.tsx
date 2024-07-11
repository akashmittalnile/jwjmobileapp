import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Vibration,
  Platform,
  TextInput,
  // NativeModules,
  // NativeEventEmitter,
} from 'react-native';
import React from 'react';
import Wrapper from '../Wrapper/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Voice from '@react-native-voice/voice';
import {globalStyles} from '../../utils/constant';
import BorderBtn from '../Button/BorderBtn';
import AnimatedCircle from '../AnimatedCircle/AnimatedCircle';

interface TodayMoodProps {
  onPress: (mood: string) => void;
  disableModal?: (text: string) => void;
  value?: string;
}

// const voiceDetails = NativeModules.Voice;
// const voiceEmitter = new NativeEventEmitter(voiceDetails);

let myText: any = null;

const SpeakModal: React.FC<TodayMoodProps> = ({
  onPress,
  disableModal,
  value,
}) => {
  const [recognizedText, setRecognizedText] = React.useState('');
  const [oldText, setOldText] = React.useState<string>('');
  const [isListening, setIsListening] = React.useState<boolean>(false);
  const [showFinishButton, setShowFinishButton] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    myText = value ? value : '';
    // if (!oldText) {
    //   setRecognizedText(value);
    // }
    // value && setOldText(value);
    setRecognizedText(value ? value : '');
  }, []);

  React.useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    // Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechPartialResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStartHandler = async () => {
    // setIsListening(true);
    Vibration?.vibrate(70);
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid?.request(
        PermissionsAndroid?.PERMISSIONS.RECORD_AUDIO,
      );
      if (result === 'granted') {
        Voice.start('en-US', {partialResults: false});
      } else {
        console.log('failed', {result});
      }
    } else {
      Voice.start('en-US');
    }
  };

  const onSpeechStart = () => {
    setIsListening(true);
  };

  const onSpeechRecognized = () => {
    // console.log('Speech recognized');
  };

  // const onSpeechEnd = () => {
  //   setIsListening(false);
  // };

  const onSpeechError = (error: any) => {
    // console.error('Speech error: ', error);
  };

  const onSpeechResults = (event: any) => {
    setRecognizedText(
      myText ? myText + ' ' + event?.value[0] : event?.value[0],
    );
    // setRecognizedText(() => event.value[0]);
  };

  // const startListening = async () => {
  //   try {
  //     await Voice.start('en-US');
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  const stopListening = async () => {
    setTimeout(() => {
      myText = recognizedText;
    }, 100);
    setIsListening(false);
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  const _disableModalHandler = () => {
    disableModal && disableModal(myText);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%',
        }}
        onPress={_disableModalHandler}
        activeOpacity={1}>
        <Wrapper containerStyle={styles.wrapper}>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: responsiveHeight(2.5),
              width: '100%',
            }}
            activeOpacity={1}>
            <Image
              source={require('../../assets/Icons/speak-to-text.png')}
              resizeMode="contain"
              style={styles.headingImage}
            />
            <Text style={styles.speakText}>Speak!!!</Text>
            <TextInput
              value={recognizedText}
              style={styles.thought}
              editable={false}
              multiline={true}
            />
            <View style={styles.buttonContainer}>
              {
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View style={styles.micButton}>
                    <TouchableOpacity
                      style={styles.touch}
                      // onPress={isListening ? stopListening : startListening}
                      onPressIn={onSpeechStartHandler}
                      onPressOut={stopListening}>
                      <Image
                        source={require('../../assets/Icons/microphone-2.png')}
                        resizeMode="contain"
                        style={{
                          height: responsiveHeight(4),
                          width: responsiveHeight(4),
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  {showFinishButton && (
                    <BorderBtn
                      buttonText="Finish"
                      onClick={_disableModalHandler}
                      containerStyle={{
                        ...styles.micButton,
                        marginLeft: responsiveWidth(2),
                      }}
                      buttonTextStyle={{fontSize: responsiveFontSize(2)}}
                    />
                  )}
                </View>
              }
            </View>
            <Text style={styles.holdButtonText}>Tap & Hold To Speak</Text>
          </TouchableOpacity>
          {isListening && (
            <View style={styles.animatedCircleStyle}>
              <AnimatedCircle />
            </View>
          )}
        </Wrapper>
      </TouchableOpacity>
    </View>
  );
};

export default SpeakModal;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  wrapper: {
    position: 'relative',
    paddingTop: responsiveHeight(0),
    borderRadius: responsiveWidth(2),
  },
  headingImage: {
    height: responsiveHeight(10),
    width: responsiveHeight(10),
  },
  speakText: {
    marginTop: responsiveHeight(1),
    fontSize: responsiveFontSize(1.8),
    color: 'black',
  },
  thought: {
    marginTop: responsiveHeight(0.5),
    paddingHorizontal: 3,
    width: '100%',
    color: globalStyles.midGray,
    maxHeight: responsiveHeight(40),
  },
  buttonContainer: {
    marginTop: responsiveHeight(1),
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveHeight(6),
    width: '100%',
  },
  micButton: {
    height: responsiveHeight(6),
    width: responsiveHeight(15),
    borderRadius: responsiveHeight(5),
    backgroundColor: globalStyles.themeBlue,
  },
  touch: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  holdButtonText: {
    marginTop: responsiveHeight(1),
    fontSize: responsiveFontSize(1.6),
    fontWeight: '500',
    color: globalStyles.themeBlue,
  },
  animatedCircleStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: responsiveHeight(0),
    left: responsiveWidth(0),
    height: responsiveHeight(10),
    width: responsiveWidth(20),
  },
});
