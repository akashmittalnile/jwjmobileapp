import {View, StyleSheet, FlatList, ViewStyle} from 'react-native';
import React from 'react';
import IconTab from '../Tab/IconTab';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import ImageSkeleton from '../Skeleton/ImageSkeleton';
import {useAppSelector} from '../../redux/Store';
import {globalStyles} from '../../utils/constant';

interface RoutineCategoryTabHorizontalPorps {
  goalId: string | undefined;
  onClick: (value: string) => void;
  style?: ViewStyle;
}

const RoutineCategoryTabHorizontal: React.FC<
  RoutineCategoryTabHorizontalPorps
> = ({goalId, onClick, style}) => {
  const goalData = useAppSelector(state => state.goal);
  const renderCategoryTab = ({
    item,
  }: {
    item: {logo: string; name: string; id: string};
  }) => {
    return (
      <IconTab
        style={{
          ...styles.iconTab,
          borderColor: goalId === item?.id ? globalStyles.themeBlue : 'white',
          ...style,
        }}
        imageUri={item.logo}
        text={item.name}
        onPress={() => {
          categoryHandler(item.id);
        }}
        showPercentage={false}
      />
    );
  };

  const categoryHandler = (value: string) => {
    onClick && onClick(value);
  };

  return (
    <View style={styles.categoriesTabs}>
      {goalData?.length > 0 ? (
        <FlatList
          data={goalData}
          renderItem={renderCategoryTab}
          keyExtractor={(_: any, index: number) => index.toString()}
          horizontal
          style={styles.flatlist}
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <ImageSkeleton />
      )}
    </View>
  );
};

export default React.memo(RoutineCategoryTabHorizontal);

const styles = StyleSheet.create({
  categoriesTabs: {
    marginTop: responsiveHeight(1),
    height: responsiveHeight(15.5),
  },
  iconTab: {
    height: responsiveHeight(13),
  },
  flatlist: {
    flex: 1,
    marginBottom: responsiveHeight(2),
  },
});
