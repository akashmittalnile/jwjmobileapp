import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React from 'react';
import {
  responsiveHeight,
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

interface TabProps {
  selected: boolean;
  onPress: () => void;
  name: string;
  imageUri: any;
}

const Tab: React.FC<TabProps> = ({selected, onPress, name, imageUri}) => {
  return (
    <View
      style={{
        marginTop: responsiveHeight(1),
        backgroundColor: selected ? 'white' : 'transparent',
      }}>
      <TouchableOpacity style={styles.logoutTouch} onPress={onPress}>
        {imageUri && (
          <Image
            source={imageUri}
            resizeMode="contain"
            style={styles.drawerIcon}
          />
        )}
        <Text
          style={{
            ...styles.text,
            marginLeft: responsiveWidth(2),
            fontSize: responsiveFontSize(1.6),
          }}>
          {name}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Tab;

const styles = StyleSheet.create({
  logoutTouch: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: '2%',
    paddingLeft: '7%',
    width: '90%',
    borderRadius: responsiveWidth(1),
  },
  text: {
    color: 'white',
    fontSize: responsiveFontSize(1.6),
    fontWeight: '500',
  },
  drawerIcon: {
    height: responsiveHeight(3),
    width: responsiveHeight(3),
  },
});
