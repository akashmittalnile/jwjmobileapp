/* eslint-disable prettier/prettier */
import { View, StyleSheet, ViewStyle } from 'react-native';
import React from 'react';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import SingleStar from './SingleStar';

interface ReviewProps {
    style?: ViewStyle,
    starStyle?: ViewStyle,
    onPress: (value: number) => void,
};
const Review: React.FC<ReviewProps> = ({ style, starStyle, onPress }) => {
    const [review, setReview] = React.useState<number>(1);
    const clickHandler = (value: number) => {
        setReview(value);
        if (onPress) {
            onPress(value);
        }
    };

    return (
        <View style={[styles.container, style]}>
            <SingleStar onPress={clickHandler} uniqueNumber={1} value={review >= 1 ? true : false} style={starStyle} />
            <SingleStar onPress={clickHandler} uniqueNumber={2} value={review >= 2 ? true : false} style={starStyle} />
            <SingleStar onPress={clickHandler} uniqueNumber={3} value={review >= 3 ? true : false} style={starStyle} />
            <SingleStar onPress={clickHandler} uniqueNumber={4} value={review >= 4 ? true : false} style={starStyle} />
            <SingleStar onPress={clickHandler} uniqueNumber={5} value={review >= 5 ? true : false} style={starStyle} />
        </View>
    );
};

export default Review;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: responsiveHeight(1),
    },
});