/* eslint-disable prettier/prettier */
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import React, {ReactNode} from 'react';
import {responsiveHeight} from 'react-native-responsive-dimensions';

interface KeyboardAvoidingViewWrapperProps {
  children: ReactNode;
  KeyboardAvoidingViewStyle?: ViewStyle;
  scrollViewContentContainerStyle?: ViewStyle;
}

const KeyboardAvoidingViewWrapper: React.FC<
  KeyboardAvoidingViewWrapperProps
> = ({
  children,
  KeyboardAvoidingViewStyle,
  scrollViewContentContainerStyle,
}) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.keyboardAvoidingView, KeyboardAvoidingViewStyle]}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: responsiveHeight(10),
          ...scrollViewContentContainerStyle,
        }}>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoidingViewWrapper;

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'white',
  },
});
