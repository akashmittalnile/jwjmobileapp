import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Container from '../../components/Container/Container';
import SearchBarWithInsideIcon from '../../components/SearchBar/SearchBarWithInsideIcon';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import RoutineListItem from '../../components/Routine/RoutineListItem';
import {GetApiWithToken, endPoint} from '../../services/Service';
import {useAppSelector} from '../../redux/Store';
import ScreenNames from '../../utils/ScreenNames';
import SkeletonContainer from '../../components/Skeleton/SkeletonContainer';

let cleartimeout: any;

const SharedRoutine = () => {
  const navigation = useNavigation();
  const token = useAppSelector(state => state.auth.token);
  const reload = useAppSelector(state => state.reload);
  const [loader, setLoader] = React.useState<boolean>(false);
  const [sharedRoutineList, setSharedRoutineList] = React.useState<any[]>([]);
  const [searchKey, setSearchKey] = React.useState<string>('');

  React.useEffect(() => {
    getSharedRoutineListHandler('');
  }, [reload.SharedRoutine]);

  const debounceHandler = (key: string) => {
    if (cleartimeout) {
      clearTimeout(cleartimeout);
    }
    cleartimeout = setTimeout(() => {
      getSharedRoutineListHandler(key);
      setSearchKey(key?.split('=')[1]);
    }, 400);
  };

  const onClear = () => {
    getSharedRoutineListHandler('');
  };

  const getSharedRoutineListHandler = async (params?: string) => {
    setLoader(true);
    try {
      const response = await GetApiWithToken(
        `${endPoint.shareRoutineList}${params}`,
        token,
      );
      if (response?.data?.status) {
        setSharedRoutineList(response?.data?.data?.data);
      }
    } catch (err: any) {
      console.log('err in shared routine', err?.message);
    } finally {
      setLoader(false);
    }
  };

  const routineCommentHandler = (id: number) => {
    navigation.navigate(ScreenNames.RoutineDetailsWithTask, {id});
  };

  return (
    <Container
      headerText="Shared Routine"
      scrollViewContentContainerStyle={{paddingBottom: responsiveHeight(8)}}>
      <View style={styles.searchBarContainer}>
        <SearchBarWithInsideIcon
          searchKey="name"
          onSearch={(key: string) => {
            debounceHandler(key);
          }}
          onClear={onClear}
        />
      </View>
      {loader ? (
        <SkeletonContainer />
      ) : sharedRoutineList?.length > 0 ? (
        sharedRoutineList?.map((item: any, index) => (
          <RoutineListItem
            key={index}
            imageUri={item?.category_logo}
            headerText={item?.routinename}
            descriptionHeading={item?.routinesubtitle}
            description={item?.description}
            headerDate={item?.created_at}
            onClick={() => {
              routineCommentHandler(item?.routineid);
            }}
            // routineType={item?.routinetype}
            routineType={
              item?.created_by === 'mySelf' ? 'Private Routine' : 'Shared Routine'
            }
          />
        ))
      ) : (
        <View style={styles.noDataFoundContainer}>
          <Image
            source={require('../../assets/Icons/no-data-found.png')}
            style={styles.noDataFoundImage}
          />
          <Text style={styles.noDataText}>
            {searchKey ? 'No data found' : 'No shared routines found'}
          </Text>
        </View>
      )}
    </Container>
  );
};

export default SharedRoutine;

const styles = StyleSheet.create({
  searchBar: {
    height: responsiveHeight(7),
  },
  searchBarContainer: {
    height: responsiveHeight(7),
  },
  noDataFoundContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(5),
  },
  noDataFoundImage: {
    height: responsiveHeight(15),
    width: responsiveWidth(30),
  },
  noDataText: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: '400',
    color: 'black',
  },
});
