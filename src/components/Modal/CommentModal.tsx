import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import React from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import BorderBtn from '../Button/BorderBtn';

interface CommentModalProps {
  onClick: (value: string) => void;
}

const CommentModal: React.FC<CommentModalProps> = ({onClick}) => {
  const [comment, setComment] = React.useState<string>('');
  const onChangeText = (value: string) => {
    setComment(value);
  };

  const commentHandler = () => {
    onClick(comment);
  };
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView>
          <View style={styles.subContainer}>
            <TextInput
              style={styles.textInput}
              placeholder={`What's on your mind`}
              multiline={true}
              onChangeText={onChangeText}
            />
            <BorderBtn
              buttonText="Send"
              onClick={commentHandler}
              containerStyle={styles.button}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CommentModal;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    height: responsiveHeight(100),
    width: responsiveWidth(100),
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  subContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveHeight(30),
    width: '100%',
    backgroundColor: 'white',
  },
  textInput: {
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(2),
    height: '50%',
    width: '75%',
    elevation: 2,
    shadowColor: globalStyles.shadowColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.6,
    shadowRadius: 5,
    backgroundColor: 'white',
  },
  button: {
    marginTop: responsiveHeight(3),
    width: '75%',
  },
});
