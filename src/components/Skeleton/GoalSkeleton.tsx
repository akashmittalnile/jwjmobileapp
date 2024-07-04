import React from 'react';
import Wrapper from '../Wrapper/Wrapper';
import {
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {StyleSheet} from 'react-native';

const GoalSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <SkeletonPlaceholder.Item
        height={responsiveWidth(22)}
        width={responsiveWidth(20)}></SkeletonPlaceholder.Item>
         <SkeletonPlaceholder.Item
        height={responsiveWidth(2)}
        width={responsiveWidth(15)}></SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default GoalSkeleton;
