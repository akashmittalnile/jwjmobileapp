import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React, {ReactNode} from 'react';
import Wrapper from '../Wrapper/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';

interface ContactTabContainerProps {
  status?: 'completed' | 'progress' | 'pending' | 'closed';
  onPress?: (value: boolean) => void;
  children: ReactNode;
  style?: ViewStyle;
  showButton?: boolean;
}

const ContactTabContainer: React.FC<ContactTabContainerProps> = ({
  status = 'completed',
  onPress,
  children,
  style,
  showButton = false,
}) => {
  const [showAdminTab, setShowAdminTab] = React.useState<boolean>(false);
  const touchHandler = () => {
    if (onPress) {
      onPress(!showAdminTab);
    }
    setShowAdminTab(value => !value);
  };

  const statusHandler = () => {
    if (status === 'closed') {
      return (
        <View style={styles.status}>
          <Image
            source={require('../../assets/Icons/tick-green.png')}
            resizeMode="contain"
            style={styles.icon}
          />
          <Text style={{color: '#82AD26'}}>Closed</Text>
        </View>
      );
    } else if (status === 'completed') {
      return (
        <View style={styles.status}>
          <Image
            source={require('../../assets/Icons/tick-green.png')}
            resizeMode="contain"
            style={styles.icon}
          />
          <Text style={{color: '#82AD26'}}>Completed</Text>
        </View>
      );
    } else if (status === 'progress') {
      return (
        <View style={{...styles.status, borderColor: globalStyles.themeBlue}}>
          <Image
            source={require('../../assets/Icons/progress.png')}
            resizeMode="contain"
            style={styles.icon}
          />
          <Text style={{color: globalStyles.themeBlue}}>In-progress</Text>
        </View>
      );
    } else if (status === 'pending') {
      return (
        <View style={{...styles.status, borderColor: '#FFA412'}}>
          <Image
            source={require('../../assets/Icons/timer.png')}
            resizeMode="contain"
            style={styles.icon}
          />
          <Text style={{color: '#FFA412'}}>Pending</Text>
        </View>
      );
    } else {
      return <View style={{...styles.status, borderColor: globalStyles.midGray}}>
        <Text style={{color: 'black', paddingLeft: responsiveWidth(2)}}>{status}</Text>
      </View>;
    }
  };

  return (
    <Wrapper containerStyle={{...styles.wrapper, ...style}}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text
            style={{
              marginRight: responsiveWidth(2),
              color: 'black',
              fontSize: responsiveFontSize(1.6),
            }}>
            Status:
          </Text>
          {statusHandler()}
        </View>
        <View style={styles.headerRight}>
          {showButton && showAdminTab && (
            <TouchableOpacity style={styles.touch} onPress={touchHandler}>
              <Image
                source={require('../../assets/Icons/minus.png')}
                resizeMode="contain"
                style={styles.buttonIcon}
              />
            </TouchableOpacity>
          )}
          {showButton && !showAdminTab && (
            <TouchableOpacity style={styles.touch} onPress={touchHandler}>
              <Image
                source={require('../../assets/Icons/add.png')}
                resizeMode="contain"
                style={styles.buttonIcon}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {children}
    </Wrapper>
  );
};

export default ContactTabContainer;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: responsiveHeight(1.2),
    paddingTop: responsiveHeight(1),
    paddingBottom: responsiveHeight(1),
    width: '100%',
    borderRadius: responsiveWidth(2),
  },
  header: {
    flexDirection: 'row',
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: responsiveWidth(3),
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveHeight(0.3),
    paddingRight: responsiveWidth(2.5),
    borderWidth: responsiveWidth(0.2),
    borderRadius: responsiveWidth(1),
    borderColor: '#82AD26',
  },
  icon: {
    height: responsiveHeight(1.7),
    width: responsiveWidth(8),
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: responsiveWidth(3),
  },
  touch: {
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveHeight(3.5),
    width: responsiveHeight(3.5),
    borderRadius: responsiveHeight(2),
    backgroundColor: '#EFEFEF',
  },
  buttonIcon: {
    height: responsiveHeight(2),
    width: responsiveHeight(2),
  },
});
