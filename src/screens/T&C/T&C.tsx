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
import {endPoint, GetApiWithToken} from '../../services/Service';
import {useAppSelector} from '../../redux/Store';
import WebView from 'react-native-webview';
import SkeletonContainer from '../../components/Skeleton/SkeletonContainer';

interface ParamsProps {
  privacy: boolean;
}
type TermAndConditionRouteProp = RouteProp<
  Record<string, ParamsProps>,
  'privacy'
>;
const TermAndCondition = () => {
  const token = useAppSelector(state => state.auth.token);
  const {params} = useRoute<TermAndConditionRouteProp>();
  const [polocies, setPolicies] = React.useState<any>(undefined);
  const [loader, setLoader] = React.useState<boolean>(false);
  React.useEffect(() => {
    getPolicies();
  }, []);

  const getPolicies = async () => {
    try {
      setLoader(true);
      const response = await GetApiWithToken(endPoint.policies, token);
      if (response?.data?.status) {
        setPolicies(response?.data?.data);
      }
    } catch (err: any) {
      setLoader(false);
      console.log('err in getting policies', err?.message);
    }
  };

  return (
    <Container
      headerText={params?.privacy ? 'Privacy Policy' : 'Terms & Conditions'}
      style={styles.container}
      subContainerStyle={styles.subContainerStyle}
      reloadOnScroll={false}>
      {!polocies && <SkeletonContainer />}
      {polocies && (
        <WebView
          source={{
            uri: params?.privacy
              ? polocies?.['privacy-policy']
              : polocies?.['term-condition'],
          }}
          style={styles.webView}
          onLoadEnd={() => {
            setLoader(false);
          }}
        />
      )}
    </Container>
  );
};

export default TermAndCondition;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainerStyle: {
    width: responsiveWidth(100),
  },
  webView: {
    height: responsiveHeight(90),
  },
});
