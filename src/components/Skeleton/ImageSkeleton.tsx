import React from 'react';
import Wrapper from '../Wrapper/Wrapper';
import {
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {StyleSheet} from 'react-native';

interface ImageSkeletonProps {
  height?: number;
  width?: number;
}

const ImageSkeleton: React.FC<ImageSkeletonProps> = ({height, width}) => {
  return (
    <Wrapper containerStyle={styles.wrapper}>
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item
          width={width ? width : responsiveWidth(80)}
          flexDirection="row">
          <SkeletonPlaceholder.Item
            width={width ? width : responsiveWidth(80)}
            height={height ? height : responsiveWidth(12)}
            borderRadius={responsiveWidth(2)}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </Wrapper>
  );
};

export default ImageSkeleton;

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'flex-start',
    marginTop: responsiveHeight(2),
    alignItems: 'flex-start',
    paddingTop: responsiveHeight(2),
    paddingLeft: responsiveWidth(2),
    paddingVertical: responsiveHeight(2),
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: responsiveWidth(2),
  },
});
