import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
} from 'react-native';
import React from 'react';
import Wrapper from '../Wrapper/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
// import {LiveAudioVisualizer} from 'react-audio-visualize';
import Voice from '@react-native-voice/voice';
import {globalStyles} from '../../utils/constant';

interface TodayMoodProps {
  onPress: (mood: string) => void;
  disableModal?: () => void;
}

const AudioModal: React.FC<TodayMoodProps> = ({onPress, disableModal}) => {
  React.useEffect(() => {
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const askForPermissions = async () => {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    );
    if (result === 'granted') {
      console.log({result});
      Voice.start('en-US');
    } else {
      console.log('failed', {result});
    }
  };

  const onSpeechStartHandler = () => {};

  const onSpeechEndHandler = () => {
    // Your logic for speech end
  };

  const onSpeechResultsHandler = (event: any) => {
    // Your logic for speech results
    console.log('Speech Results:', event.value);
  };

  const moodHandler = (mood: string) => {
    onPress(mood);
  };

  const disableModalHandler = () => {
    disableModal && disableModal();
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
        activeOpacity={1}
        onPress={disableModalHandler}>
        <Wrapper containerStyle={styles.wrapper}>
          <TouchableOpacity
            activeOpacity={1}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: responsiveHeight(2.5),
              width: '100%',
            }}>
            <Image
              source={require('../../assets/Icons/speak-to-text.png')}
              resizeMode="contain"
              style={styles.headingImage}
            />
            <Text style={styles.thought}>A Good day</Text>
            {/* audio visualizer */}
            <View style={styles.audioVisualizerContainer}>
              <View style={styles.audioTimeCounter}>
                <Text style={styles.audioTimeCounterText}>01:15</Text>
              </View>
              <View style={{width: '70%'}}>
                {/* {true && (
              <LiveAudioVisualizer
              width={200}
              height={75}
            />
            )} */}
              </View>
              <View style={styles.audioTimeCounter}>
                <Text style={styles.audioTimeCounterText}>03:11</Text>
              </View>
            </View>
            <View style={styles.micButton}>
              <TouchableOpacity
                style={styles.touch}
                onPress={askForPermissions}>
                <Image
                  source={require('../../assets/Icons/pause.png')}
                  resizeMode="contain"
                  style={{
                    height: responsiveHeight(3),
                    width: responsiveHeight(3),
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.touch,
                  backgroundColor: globalStyles.veryLightGray,
                }}
                onPress={askForPermissions}>
                <Image
                  source={require('../../assets/Icons/microphone-blue.png')}
                  resizeMode="contain"
                  style={{
                    height: responsiveHeight(3),
                    width: responsiveHeight(3),
                  }}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.holdButtonText}>Tap & Hold To Speak</Text>
          </TouchableOpacity>
        </Wrapper>
      </TouchableOpacity>
    </View>
  );
};

export default AudioModal;

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
  audioVisualizerContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    width: '95%',
  },
  audioTimeCounter: {
    width: '15%',
    alignItems: 'center',
  },
  audioTimeCounterText: {
    fontSize: responsiveFontSize(1.6),
    color: globalStyles.textGray,
  },
  thought: {
    marginTop: responsiveHeight(2),
    color: globalStyles.midGray,
  },
  micButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: responsiveHeight(1),
    width: responsiveHeight(14),
  },
  touch: {
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveHeight(6),
    width: responsiveHeight(6),
    backgroundColor: globalStyles.themeBlue,
    borderRadius: responsiveHeight(3),
  },
  holdButtonText: {
    marginTop: responsiveHeight(1),
    fontSize: responsiveFontSize(1.6),
    fontWeight: '500',
    color: globalStyles.themeBlue,
  },
});
