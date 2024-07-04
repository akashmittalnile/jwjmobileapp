import {View} from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

interface TempProps {
  height?: number;
  width?: number;
}

const Temp: React.FC<TempProps> = ({
  height = responsiveHeight(6),
  width = responsiveWidth(90),
}) => {
  return (
    <View style={{marginBottom: responsiveHeight(1)}}>
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item
          width={width}
          flexDirection="row">
          <SkeletonPlaceholder.Item
            width={width}
            height={height}
            borderRadius={responsiveWidth(2)}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  );
};

interface ImageSkeletonContainerProps {
  height?: number;
  width?: number;
}

const ImageSkeletonContainer: React.FC<ImageSkeletonContainerProps> = ({
  height = responsiveHeight(6),
  width = responsiveWidth(90),
}) => {
  return (
    <>
      {arr?.map((item: number) => (
        <Temp key={item} height={height} width={width} />
      ))}
    </>
  );
};

export default ImageSkeletonContainer;
