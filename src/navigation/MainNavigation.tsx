/* eslint-disable prettier/prettier */
import {Appearance} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAppDispatch, useAppSelector} from '../redux/Store';
import SignIn from '../screens/Auth/SignIn';
import SignUp from '../screens/Auth/SignUp';
import ForgotPassword from '../screens/Auth/ForgotPassword';
import ResetPassword from '../screens/Auth/ResetPassword';
import VerifyOtp from '../screens/Auth/VerifyOtp';
import Splash from '../screens/Splash/Splash';
import SubscriptionPlans from '../screens/Subscription/SubscriptionPlans';
import Payment from '../screens/Payment/Payment';
import Notification from '../screens/Notification/Notification';
import AddNewRoutine from '../screens/Routine/AddNewRoutine';
import SharedRoutine from '../screens/Routine/SharedRoutine';
import SharedRoutineComments from '../screens/Routine/SharedRoutineComments';
import RoutineDetailsWithTask from '../screens/Routine/RoutineDetailsWithTask';
import EditTask from '../screens/Task/EditTask';
import CustomRoutineDateTime from '../screens/Routine/CustomRoutineDateTime';
import MyCommunity from '../screens/Community/MyCommunity';
import FollowedCommunity from '../screens/Community/FollowedCommunity';
import FollowedCommunityDetails from '../screens/Community/FollowedCommunityDetails';
import FollowedCommunityPost from '../screens/Community/FollowedCommunityPost';
import AddNewPost from '../screens/Post/AddNewPost';
import Messages from '../screens/Messages/Messages';
import MemberList from '../screens/MemberList/MemberList';
import Welcome from '../screens/Auth/Welcome';
import EditProfile from '../screens/Auth/EditProfile';
import ChangePassword from '../screens/Auth/ChangePassword';
import AddNewJournals from '../screens/Journals/AddNewJournals';
import JournalsInfo from '../screens/Journals/JournalsInfo';
import Review from '../screens/Reviews/Review';
import AllComments from '../screens/AllComments/AllComments';
import Chat from '../screens/Chat/Chat';
import RejectedCommunityRequest from '../screens/Community/RejectedCommunityRequest';
import DrawerNavigation from './DrawerNavigation';
import TermAndCondition from '../screens/T&C/T&C';
import Contact from '../screens/Contact/Contact';
import ContactForQuery from '../screens/Contact/ContactForQuery';
import Search from '../screens/Search/Search';
import Calendar from '../screens/Calendar/Calendar';
import DownloadJournal from '../screens/Journals/DownloadJournal';
import ScreenNames from '../utils/ScreenNames';
import {userDetailsHandler} from '../redux/UserDetails';

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  SignUp: {
    emailVerified: boolean;
    id: number;
  };
  AddNewJournals: {
    mood?: string;
    data: any;
  };
  JournalsInfo: {
    mood: string | undefined;
    title: string;
    content: string;
    file: string;
    criteria: {}[];
    journalsId: string;
  };
  FollowedCommunityDetails: {
    community_id: string;
  };
  AddNewPost: {
    createCommunity: boolean;
    editCommunity: boolean;
    community_id: string;
    editPost: boolean;
    data: any;
  };
  FollowedCommunityPost: {
    postId: number;
  };
  ResetPassword: {
    email: string;
    otp: string;
  };
  VerifyOtp: {
    verifyEmail: boolean;
    email: string;
    otp: string;
  };
  AddNewRoutine: {
    goal: string;
    edit: boolean;
    data: any;
  };
  EditTask: {
    editTask: boolean;
    id: number;
    goalId: number;
  };
  Calendar: {
    date: string;
  };
  RoutineDetailsWithTask: {
    id: number;
  };
  AllComments: {
    id: number;
  };
  Chat: {
    chatId: number;
    chatUsername: string;
  };
  Payment: any;
};

const MainNavigation = () => {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(state => state.auth.token);
  const isValid = useAppSelector(state => state.splash.isValid);
  const colorScheme = Appearance.getColorScheme();
  React.useEffect(() => {
    if (colorScheme === 'dark') {
      dispatch(userDetailsHandler({darkTheme: true}));
    }
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: 'white'},
      }}>
      {!isAuth ? (
        <>
          {isValid && (
            <>
              <Stack.Screen name={ScreenNames.Splash} component={Splash} />
              <Stack.Screen name={ScreenNames.Welcome} component={Welcome} />
            </>
          )}
          <Stack.Screen name={ScreenNames.SignIn} component={SignIn} />
          <Stack.Screen name={ScreenNames.SignUp} component={SignUp} />
          <Stack.Screen
            name={ScreenNames.ForgotPassword}
            component={ForgotPassword}
          />
          <Stack.Screen
            name={ScreenNames.ResetPassword}
            component={ResetPassword}
          />
          <Stack.Screen name={ScreenNames.VerifyOtp} component={VerifyOtp} />
          <Stack.Screen
            name={ScreenNames.ChangePassword}
            component={ChangePassword}
          />
          <Stack.Screen
            name={ScreenNames.SubscriptionPlans}
            component={SubscriptionPlans}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name={ScreenNames.Drawer}
            component={DrawerNavigation}
          />
          <Stack.Screen
            name={ScreenNames.ChangePassword}
            component={ChangePassword}
          />
          <Stack.Screen
            name={ScreenNames.SubscriptionPlans}
            component={SubscriptionPlans}
          />
          <Stack.Screen name={ScreenNames.Payment} component={Payment} />
          <Stack.Screen
            name={ScreenNames.SharedRoutine}
            component={SharedRoutine}
          />
          <Stack.Screen
            name={ScreenNames.Notification}
            component={Notification}
          />
          <Stack.Screen
            name={ScreenNames.EditProfile}
            component={EditProfile}
          />
          <Stack.Screen
            name={ScreenNames.SharedRoutineComments}
            component={SharedRoutineComments}
          />
          <Stack.Screen
            name={ScreenNames.RoutineDetailsWithTask}
            component={RoutineDetailsWithTask}
          />
          <Stack.Screen
            name={ScreenNames.AddNewRoutine}
            component={AddNewRoutine}
          />
          <Stack.Screen name={ScreenNames.EditTask} component={EditTask} />
          <Stack.Screen
            name={ScreenNames.CustomRoutineDateTime}
            component={CustomRoutineDateTime}
          />
          <Stack.Screen
            name={ScreenNames.MyCommunity}
            component={MyCommunity}
          />
          <Stack.Screen
            name={ScreenNames.FollowedCommunity}
            component={FollowedCommunity}
          />
          <Stack.Screen
            name={ScreenNames.FollowedCommunityDetails}
            component={FollowedCommunityDetails}
          />
          <Stack.Screen
            name={ScreenNames.FollowedCommunityPost}
            component={FollowedCommunityPost}
          />
          <Stack.Screen
            name={ScreenNames.RejectedCommunityRequest}
            component={RejectedCommunityRequest}
          />
          <Stack.Screen name={ScreenNames.AddNewPost} component={AddNewPost} />
          <Stack.Screen name={ScreenNames.Search} component={Search} />
          <Stack.Screen name={ScreenNames.Messages} component={Messages} />
          <Stack.Screen name={ScreenNames.MemberList} component={MemberList} />
          <Stack.Screen
            name={ScreenNames.AddNewJournals}
            component={AddNewJournals}
          />
          <Stack.Screen
            name={ScreenNames.JournalsInfo}
            component={JournalsInfo}
          />
          <Stack.Screen name={ScreenNames.Review} component={Review} />
          <Stack.Screen
            name={ScreenNames.AllComments}
            component={AllComments}
          />
          <Stack.Screen name={ScreenNames.Chat} component={Chat} />
          <Stack.Screen
            name={ScreenNames.TermAndCondition}
            component={TermAndCondition}
          />
          <Stack.Screen name={ScreenNames.Contact} component={Contact} />
          <Stack.Screen
            name={ScreenNames.ContactForQuery}
            component={ContactForQuery}
          />
          <Stack.Screen name={ScreenNames.Calendar} component={Calendar} />
          <Stack.Screen
            name={ScreenNames.DownloadJournal}
            component={DownloadJournal}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default MainNavigation;
