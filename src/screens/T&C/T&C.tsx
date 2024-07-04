import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import Container from '../../components/Container/Container';
import Wrapper from '../../components/Wrapper/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useRoute, RouteProp} from '@react-navigation/native';

interface ParamsProps {
  privacy: boolean;
}
type TermAndConditionRouteProp = RouteProp<
  Record<string, ParamsProps>,
  'privacy'
>;
const TermAndCondition = () => {
  const {params} = useRoute<TermAndConditionRouteProp>();
  return (
    <Container
      headerText={params?.privacy ? 'Privacy Policy' : 'Terms & Conditions'}>
      <Wrapper containerStyle={styles.wrapper}>
        <Text style={styles.text}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Leo vel
          fringilla est ullamcorper eget nulla. Gravida cum sociis natoque
          penatibus et magnis. Nunc eget lorem dolor sed. Aenean euismod
          elementum nisi quis. Non quam lacus suspendisse faucibus interdum
          posuere. Condimentum vitae sapien pellentesque habitant morbi. Diam
          vulputate ut pharetra sit amet. At lectus urna duis convallis
          convallis tellus id interdum velit. Vel quam elementum pulvinar etiam.
          Sagittis eu volutpat odio facilisis. Egestas pretium aenean pharetra
          magna ac placerat vestibulum lectus mauris. At volutpat diam ut
          venenatis tellus in metus vulputate. Imperdiet sed euismod nisi porta
          lorem mollis aliquam ut. Viverra mauris in aliquam sem fringilla ut
          morbi tincidunt augue. Semper feugiat nibh sed pulvinar. Pulvinar
          neque laoreet suspendisse interdum. Sed viverra ipsum nunc aliquet
          bibendum. Sed libero enim sed faucibus turpis. Interdum varius sit
          amet mattis vulputate enim. Non blandit massa enim nec dui nunc.
          Fermentum leo vel orci porta non pulvinar neque. Habitant morbi
          tristique senectus et netus. Sollicitudin tempor id eu nisl nunc mi
          ipsum faucibus. Nisi lacus sed viverra tellus in hac habitasse. Enim
          nunc faucibus a pellentesque sit. Sit amet nisl suscipit adipiscing.
        </Text>
      </Wrapper>
    </Container>
  );
};

export default TermAndCondition;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingTop: responsiveHeight(0),
    borderRadius: responsiveWidth(2),
  },
  text: {
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(3),
    fontSize: responsiveFontSize(1.6),
    color: 'black',
    fontWeight: '400',
    letterSpacing: 1,
    lineHeight: responsiveHeight(2.5),
  },
});
