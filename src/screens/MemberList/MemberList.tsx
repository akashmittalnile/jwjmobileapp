import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import Container from '../../components/Container/Container';
import SearchBar from '../../components/SearchBar/SearchBar';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import MemberListTab from '../../components/MemberList/MemberListTab';
import freeIcon from '../../assets/Icons/free.png';
import planBIcon from '../../assets/Icons/plan-b.png';
import userIcon from '../../assets/Images/user-2.png';

const freeIconPath = Image.resolveAssetSource(freeIcon).uri;
const planBIconPath = Image.resolveAssetSource(planBIcon).uri;
const userIconPath = Image.resolveAssetSource(userIcon).uri;

const MemberList = () => {
  return (
    <Container
      headerText="Member List"
      subContainerStyle={{paddingTop: responsiveHeight(0)}}>
      <SearchBar containerStyle={styles.searchbar} />
      <View style={styles.memberListTabContainer}>
        <MemberListTab
          name="Jane K"
          planName="Plan B Member"
          planIconUri={planBIconPath}
          profileIconUri={userIconPath}
        />
        <MemberListTab
          name="Jane K"
          planName="Plan B Member"
          planIconUri={freeIconPath}
        />
        <MemberListTab
          name="Jane K"
          planName="Plan B Member"
          planIconUri={planBIconPath}
        />
        <MemberListTab
          name="Jane K"
          planName="Plan B Member"
          planIconUri={planBIconPath}
          profileIconUri={userIconPath}
        />
        <MemberListTab
          name="Jane K"
          planName="Plan B Member"
          planIconUri={freeIconPath}
          profileIconUri={userIconPath}
        />
        <MemberListTab
          name="Jane K"
          planName="Plan B Member"
          planIconUri={freeIconPath}
        />
      </View>
    </Container>
  );
};

export default MemberList;

const styles = StyleSheet.create({
  container: {},
  searchbar: {},
  memberListTabContainer: {
    marginTop: responsiveHeight(1.2),
  },
});
