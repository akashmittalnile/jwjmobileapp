import {
  View,
  Text,
  StyleSheet,
  Image,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Wrapper from '../Wrapper/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import {useNavigation} from '@react-navigation/native';
import ScreenNames from '../../utils/ScreenNames';

interface MessageTabProps {
  id: number;
  profileIconUri?: string;
  name: string;
  groupName: string;
  description: string;
  time: string;
  style?: ViewStyle;
}

const MessageTab: React.FC<MessageTabProps> = ({
  id,
  profileIconUri,
  name,
  groupName,
  description,
  time,
  style,
}) => {
  const navigation = useNavigation();
  const [nameSign, setNameSign] = React.useState<string>('');

  React.useEffect(() => {
    nameSignHandler();
  }, [name]);

  const nameSignHandler = () => {
    const tempArray = name?.split(' ');
    const sign = tempArray?.reduce(
      (accumulator, currentValue) => accumulator + currentValue[0],
      '',
    );
    setNameSign(sign);
  };

  const goToChatScreen = () => {
    navigation.navigate(ScreenNames.Chat, {chatId: id, chatUsername: name});
  };

  return (
    <Wrapper containerStyle={{...styles.wrapper, ...style}}>
      <TouchableOpacity style={styles.touch} onPress={goToChatScreen}>
        <View style={{flex: 1}}>
          <View style={styles.signContainer}>
            {profileIconUri ? (
              <Image source={{uri: profileIconUri}} style={styles.img} />
            ) : (
              <Text style={styles.nameSignText}>{nameSign}</Text>
            )}
          </View>
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.nameAndTime}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.time}>{time}</Text>
          </View>
          <Text style={styles.groupName}>{groupName}</Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.description}>
            {description}
          </Text>
        </View>
      </TouchableOpacity>
    </Wrapper>
  );
};

export default MessageTab;

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 0,
    width: '100%',
    borderRadius: responsiveWidth(2),
  },
  touch: {
    flexDirection: 'row',
    paddingTop: responsiveHeight(1.5),
    paddingBottom: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(3),
    width: '100%',
  },
  signContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveHeight(5),
    width: responsiveHeight(5),
    borderRadius: responsiveHeight(2.5),
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
  },
  img: {
    height: responsiveHeight(5),
    width: responsiveHeight(5),
  },
  nameSignText: {
    color: globalStyles.themeBlue,
    fontSize: responsiveFontSize(1.7),
    fontWeight: '600',
  },
  detailsContainer: {
    flex: 7,
    marginLeft: responsiveWidth(2),
  },
  nameAndTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveHeight(0.5),
  },
  name: {
    color: 'black',
    fontSize: responsiveFontSize(1.6),
    fontWeight: '500',
  },
  time: {
    color: globalStyles.midGray,
    fontSize: responsiveFontSize(1.4),
  },
  groupName: {
    color: globalStyles.themeBlue,
    fontSize: responsiveFontSize(1.4),
    fontWeight: '500',
    marginBottom: responsiveHeight(0.5),
  },
  description: {
    color: globalStyles.textGray,
    fontSize: responsiveFontSize(1.4),
    fontWeight: '500',
  },
});
