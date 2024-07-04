/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
import {Image, ImageBackground, StyleSheet} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Routine from '../screens/Routine/Routine';
import Community from '../screens/Community/Community';
import Profile from '../screens/Profile/Profile';
import Journals from '../screens/Journals/Journals';
import CurveTab from '../components/Tab/CurveTab';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Home from '../screens/Home/Home';

const Tab = createBottomTabNavigator();

const BottomTab = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={() => ({
        tabBarBackground: () => (
          <Image
            source={require('../assets/Icons/bottomTab.png')}
            style={{height: '100%', width: '100%'}}
          />
        ),
        headerShown: false,
        tabBarStyle: {...styles.tabBarStyle, backgroundColor: 'white'},
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarHideOnKeyboard: true,
      })}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={() => ({
          tabBarItemStyle: {backgroundColor: 'white'},
          tabBarIcon: ({focused}) =>
            focused ? (
              <Image source={require('../assets/Icons/home-2.png')} />
            ) : (
              <Image source={require('../assets/Icons/home.png')} />
            ),
        })}
      />
      <Tab.Screen
        name="Routine"
        component={Routine}
        options={() => ({
          tabBarItemStyle: {
            backgroundColor: 'white',
            borderTopRightRadius: responsiveWidth(8),
          },
          tabBarIcon: ({focused}) =>
            focused ? (
              <Image source={require('../assets/Icons/routine-2.png')} />
            ) : (
              <Image source={require('../assets/Icons/routine.png')} />
            ),
        })}
      />
      <Tab.Screen
        name="Journals"
        component={Journals}
        options={() => ({
          tabBarButton: () => <CurveTab />,
          tabBarItemStyle: {backgroundColor: 'transparent'},
          tabBarLabel: '',
          tabBarLabelStyle: {backgroundColor: 'white'},
        })}
      />
      <Tab.Screen
        name="Community"
        component={Community}
        options={() => ({
          tabBarItemStyle: {
            backgroundColor: 'white',
            borderTopLeftRadius: responsiveWidth(8),
          },
          tabBarIcon: ({focused}) =>
            focused ? (
              <Image source={require('../assets/Icons/community-2.png')} />
            ) : (
              <Image source={require('../assets/Icons/community.png')} />
            ),
        })}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={() => ({
          tabBarItemStyle: {backgroundColor: 'white'},
          tabBarIcon: ({focused}) =>
            focused ? (
              <Image source={require('../assets/Icons/profile-2.png')} />
            ) : (
              <Image source={require('../assets/Icons/profile.png')} />
            ),
        })}
      />
    </Tab.Navigator>
  );
};
export default BottomTab;
const styles = StyleSheet.create({
  tabBarStyle: {
    height: responsiveHeight(10),
    backgroundColor: 'transparent',
    elevation: 0,
    position: 'absolute',
  },
  tabBarLabelStyle: {
    transform: [{translateY: responsiveHeight(-1.3)}],
    fontSize: responsiveFontSize(1.4),
    fontWeight: '400',
  },
});
