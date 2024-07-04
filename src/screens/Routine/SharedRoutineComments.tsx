import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import Container from '../../components/Container/Container';
import RoutineListItemDetails from '../../components/Routine/RoutineListItemDetails';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import BorderBtn from '../../components/Button/BorderBtn';
import CommentTab from '../../components/Tab/CommentTab';
import Wrapper from '../../components/Wrapper/Wrapper';
import {globalStyles} from '../../utils/constant';
import CommentModal from '../../components/Modal/CommentModal';

const comments: any = [
  //   {number: 1, isReplied: false},
  //   {number: 1, isReplied: false},
  //   {number: 1, isReplied: true},
  //   {number: 1, isReplied: false},
  //   {number: 1, isReplied: false},
];

const SharedRoutineComments = () => {
  const [showCommentModal, setShowCommentModal] =
    React.useState<boolean>(false);
  const renderCommentTabs = comments?.map((item: any, index: number) => (
    <CommentTab
      key={index.toString()}
      name="Amyrobson"
      comment="Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. "
      date="1 month ago"
      style={styles.commentTab}
      isReplied={item.isReplied}
    />
  ));

  const showCommentModalHandler = () => {
    setShowCommentModal(preValue => !preValue);
  };

  const commentHandler = (value: string) => {
    // if (value.length > 0) {
    //   setShowCommentModal(preValue => !preValue);
    // }
    setShowCommentModal(preValue => !preValue);
  };

  return (
    <>
      <Container
        headerText="Shared Routine"
        scrollViewContentContainerStyle={{paddingBottom: responsiveHeight(8)}}>
        <RoutineListItemDetails
          headerText="Meditation"
          headerDate="05-02-2024"
          totalShare={4}
          showShareButton={true}
        />

        {/* comments */}

        <View style={styles.commentButtonHeader}>
          <Text style={styles.commentHeadingText}>Comments</Text>
          <BorderBtn
            buttonText="Add Comment"
            onClick={showCommentModalHandler}
            containerStyle={styles.commentButton}
            buttonTextStyle={styles.commentButtonTextStyle}
          />
        </View>
        {comments.length > 0 ? (
          <View style={styles.commentsContainer}>{renderCommentTabs}</View>
        ) : (
          <Wrapper containerStyle={styles.noComments}>
            <Image
              source={require('../../assets/Icons/comments.png')}
              style={styles.noCommentsImage}
            />
            <Text style={styles.noCommentsText}>No Comment yet</Text>
            <Text
              style={{
                marginBottom: responsiveHeight(2),
                ...styles.noCommentsText,
                color: globalStyles.textGray,
              }}>
              Be the first to share what you think!
            </Text>
          </Wrapper>
        )}
      </Container>
      {showCommentModal && <CommentModal onClick={commentHandler} />}
    </>
  );
};

export default SharedRoutineComments;

const styles = StyleSheet.create({
  commentButtonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: responsiveHeight(2),
  },
  commentHeadingText: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '600',
    opacity: 0.6,
  },
  commentButton: {
    height: responsiveHeight(5),
    width: responsiveWidth(30),
  },
  commentButtonTextStyle: {
    fontSize: responsiveFontSize(1.5),
    fontWeight: '600',
  },
  commentsContainer: {
    alignItems: 'flex-end',
  },
  commentTab: {
    marginTop: responsiveHeight(1.25),
  },
  noComments: {
    marginTop: responsiveHeight(1.2),
    paddingTop: responsiveHeight(1.5),
    width: '100%',
    borderRadius: responsiveWidth(2),
  },
  noCommentsImage: {
    height: responsiveHeight(8),
    width: responsiveHeight(8),
  },
  noCommentsText: {
    marginTop: responsiveHeight(1.5),
    fontSize: responsiveFontSize(1.8),
    color: 'black',
    fontWeight: '400',
  },
});
