import React, {useEffect, useState} from 'react';
import {StatusBar, Platform} from 'react-native';
import {Provider} from 'react-redux';
import {store, useAppDispatch, useAppSelector} from './src/redux/Store';
import {NavigationContainer} from '@react-navigation/native';
import Toast, {
  BaseToast,
  ErrorToast,
  InfoToast,
} from 'react-native-toast-message';
import MyNavigationContainer from './src/navigation/MyNavigationContainer';
import NetInfo from '@react-native-community/netinfo';
import NoInternet from './src/screens/NoInternet/NoInternet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StripeProvider} from '@stripe/stripe-react-native';
import messaging from '@react-native-firebase/messaging';
import {triggerNotification} from './src/utils/Method';
import {notificationCounter} from './src/redux/TrackNumbers';
import {responsiveHeight} from 'react-native-responsive-dimensions';

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        height: 'auto',
        paddingVertical: responsiveHeight(1),
        borderLeftColor: 'green',
        minHeight: responsiveHeight(7),
      }}
      text1NumberOfLines={100}
      text2NumberOfLines={100}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        height: 'auto',
        paddingVertical: responsiveHeight(1),
        borderLeftColor: 'red',
        minHeight: responsiveHeight(7),
      }}
      text1NumberOfLines={100}
      text2NumberOfLines={100}
    />
  ),
  info: (props: any) => (
    <InfoToast
      {...props}
      style={{
        height: 'auto',
        paddingVertical: responsiveHeight(1),
        borderLeftColor: 'yellow',
        minHeight: responsiveHeight(7),
      }}
      text1NumberOfLines={100}
      text2NumberOfLines={100}
    />
  ),
};

function App(): React.ReactElement {
  const [isInternetReachable, setIsInternetReachable] = useState<
    boolean | null
  >(true);
  const [showNoInternet, setShowNoInternet] = useState<boolean | null>(false);

  useEffect(() => {
    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      setIsInternetReachable(state.isInternetReachable ?? true);
      setShowNoInternet(!state.isInternetReachable);
    });

    return () => unsubscribeNetInfo();
  }, []);

  useEffect(() => {
    requestUserPermission()
      .then(permissionGranted => {
        if (permissionGranted) {
          messaging().onMessage(async remoteMessage => {
            console.log('Foreground message received!', remoteMessage);
            store.dispatch(notificationCounter({notificationCount: 1}));
            triggerNotification(
              remoteMessage?.notification?.title,
              remoteMessage?.notification?.body,
            );
          });
        } else {
          console.log('Permission denied for FCM');
        }
      })
      .catch(err => {
        console.log('err in push notification', err);
      });
  }, []);

  const requestUserPermission = async (): Promise<boolean> => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      return enabled;
    } catch (error) {
      console.log('Error requesting FCM permission:', error);
      return false;
    }
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StripeProvider
        publishableKey="pk_test_51OgoamGdqn1JkKNJkKB19GFHa1Tsp6vjfpPNSViGDwDYOsPPbqk6HSqp4z542P55IlQLCReRQr96ibkc2OCXwiAd00FqBen60M"
        merchantIdentifier="merchant.identifier"
        urlScheme="your-url-scheme">
        <NavigationContainer>
          <Provider store={store}>
            <StatusBar
              translucent
              backgroundColor="transparent"
              barStyle="light-content"
            />
            <MyNavigationContainer />
            <Toast config={toastConfig} />
          </Provider>
        </NavigationContainer>
        {showNoInternet && (
          <NoInternet
            setIsInternetReachable={setIsInternetReachable}
            setShowNoInternet={setShowNoInternet}
          />
        )}
      </StripeProvider>
    </GestureHandlerRootView>
  );
}

export default App;
