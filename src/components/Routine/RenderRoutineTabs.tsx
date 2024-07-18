import React from 'react';
import RoutineListItem from './RoutineListItem';
import {useNavigation} from '@react-navigation/native';
import ScreenNames from '../../utils/ScreenNames';

const RenderRoutineTabs = ({data}: {data: any}) => {
  const navigation = useNavigation();
  const [routines, setRoutines] = React.useState<any[]>([]);
  React.useEffect(() => {
    if (data?.length > 0) {
      const temp = data?.map((item: any, index: number) => {
        return (
          <RoutineListItem
            key={index}
            imageUri={item?.category_logo}
            headerText={item?.category_name}
            headerDate={item?.created_at}
            descriptionHeading={item?.routinename}
            description={item?.description}
            onClick={() => {
              goToRoutineDetailsScreen(item?.routineid);
            }}
            // routineType={item?.routinetype}
            routineType={
              item?.created_by == 'mySelf' || item?.createdBy == 'mySelf'
                ? 'Private Routine'
                : `Shared Routine`
            }
            sharedBy={
              item?.shared_by_user_name ? item?.shared_by_user_name : ''
            }
          />
        );
      });
      setRoutines(temp);
    }
  }, [data]);
  const goToRoutineDetailsScreen = (id: number) => {
    navigation.navigate(ScreenNames.RoutineDetailsWithTask, {id});
  };
  return <>{routines}</>;
};

export default React.memo(RenderRoutineTabs);
