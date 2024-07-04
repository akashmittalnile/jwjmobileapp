import {View, Text} from 'react-native';
import React from 'react';
import Container from '../../components/Container/Container';
import RejectedCommunityRequestTab from '../../components/CommunityListItem/RejectedCommunityRequestTab';
import {GetApiWithToken, endPoint} from '../../services/Service';
import {useAppSelector} from '../../redux/Store';
import SkeletonContainer from '../../components/Skeleton/SkeletonContainer';

const RejectedCommunityRequest = () => {
  const token = useAppSelector(state => state.auth.token);
  const [data, setData] = React.useState<any[]>([]);
  const [showSkeleton, setShowSkeleton] = React.useState<boolean>(false);
  React.useEffect(() => {
    getRejectedCommunityData();
  }, []);

  const getRejectedCommunityData = async () => {
    setShowSkeleton(true);
    try {
      const response = await GetApiWithToken(
        `${endPoint.MyCommunity}?status=3`,
        token,
      );
      if (response?.data?.status) {
        setData(response?.data?.data);
      }
    } catch (err: any) {
      console.log('error in rejected community', err?.message);
    } finally {
      setShowSkeleton(false);
    }
  };

  return (
    <Container headerText="Rejected Community Request">
      {showSkeleton ? (
        <SkeletonContainer />
      ) : (
        data?.length > 0 &&
        data?.map((item: any, index: number) => (
          <RejectedCommunityRequestTab
            key={index}
            name={item?.name}
            description={item?.description}
            images={item?.image}
          />
        ))
      )}
    </Container>
  );
};

export default RejectedCommunityRequest;
