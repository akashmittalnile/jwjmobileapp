import React from 'react';
import Wrapper from '../Wrapper/Wrapper';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {StyleSheet} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const Skeleton = () => {
  return (
    <Wrapper containerStyle={styles.wrapper}>
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item
          width={responsiveWidth(80)}
          flexDirection="row">
          <SkeletonPlaceholder.Item
            width={responsiveWidth(12)}
            height={responsiveWidth(12)}
            borderRadius={responsiveWidth(12)}
          />
          <SkeletonPlaceholder.Item marginLeft={20}>
            <SkeletonPlaceholder.Item
              width={responsiveWidth(75)}
              height={responsiveWidth(5)}
              borderRadius={4}
            />
            <SkeletonPlaceholder.Item
              marginTop={6}
              width={responsiveWidth(30)}
              height={20}
              borderRadius={4}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          flexDirection="row"
          marginTop={20}
          width={responsiveWidth(70)}>
          <SkeletonPlaceholder.Item marginLeft={20}>
            <SkeletonPlaceholder.Item
              width={responsiveWidth(70)}
              height={responsiveWidth(5)}
              borderRadius={4}
            />
            <SkeletonPlaceholder.Item
              marginTop={6}
              width={responsiveWidth(70)}
              height={20}
              borderRadius={4}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </Wrapper>
  );
};

export default Skeleton;

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
