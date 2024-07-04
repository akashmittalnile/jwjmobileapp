import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import React, {memo} from 'react';
import Wrapper from '../Wrapper/Wrapper';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import BorderBtn from '../Button/BorderBtn';
import SvgUri from 'react-native-svg-uri';
import GoalSkeleton from '../Skeleton/GoalSkeleton';
import {useAppSelector} from '../../redux/Store';

interface GoalModalProps {
  onClick: (goal: string) => void;
  disableModal?: () => void;
}

const TestSvgUri = memo((props: {uri: any}) => {
  const _Image = props?.uri?.logo?.endsWith('.svg') ? <SvgUri
    width={responsiveWidth(20)}
    height={responsiveWidth(22)}
    source={{uri: props?.uri.logo}}
  /> : <Image style={{height: responsiveWidth(22), width: responsiveWidth(20)}} source={{uri: props?.uri?.logo}} resizeMode='contain'/>
  return _Image
});

const GoalModal: React.FC<GoalModalProps> = ({onClick, disableModal}) => {
  const data = useAppSelector(state => state.goal);
  const [goal, setGoal] = React.useState<string>('');
  const [err, setErr] = React.useState<boolean>(false);

  const onChangeGoal = (id: string) => {
    setErr(false);
    if (id) {
      setGoal(id);
    }
  };

  const goalHandler = () => {
    if (goal) {
      onClick(goal);
    } else {
      setErr(true);
    }
  };

  const renderGoalsContainer = data.map((item: any, index: number) => (
    <View
      key={index.toString()}
      style={{
        ...styles.goalItemContainer,
        borderColor: goal === item.id ? globalStyles.themeBlue : 'white',
      }}>
      <TouchableOpacity
        style={styles.touch}
        onPress={() => {
          onChangeGoal(item.id);
        }}>
        {<View style={styles.image}>{<TestSvgUri uri={item} />}</View>}
        <Text style={{fontSize: responsiveHeight(1.5), color: 'black'}}>{item.name}</Text>
      </TouchableOpacity>
    </View>
  ));

  const GoalSkeletonContainer = data.map(_ => <GoalSkeleton />);

  const disableModalHandler = () => {
    if (disableModal) {
      disableModal();
    }
  };

  return (
    <View style={styles.container}>
      <Wrapper containerStyle={styles.wrapper}>
        <Text style={styles.heading}>Which Goal Do You Want To Focus On?</Text>
       <ScrollView>
        <View style={styles.goalContainer}>
          {data.length > 0 && renderGoalsContainer}
        </View>
        </ScrollView>
        <View style={{height: responsiveHeight(2),}}>
          {err && (
            <Text style={{fontSize: responsiveHeight(1.5), color: 'red'}}>
              Please select one goal
            </Text>
          )}
        </View>
        <BorderBtn
          buttonText="Continue"
          onClick={goalHandler}
          containerStyle={styles.buttonStyle}
        />
        <View style={styles.cancel}>
          <TouchableOpacity onPress={disableModalHandler}>
            <Image
              style={styles.img}
              source={require('../../assets/Icons/cancel.png')}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </Wrapper>
    </View>
  );
};

export default GoalModal;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: responsiveWidth(100),
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  wrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveWidth(2),
    width: '88%',
    elevation: 2,
    shadowColor: globalStyles.shadowColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.6,
    shadowRadius: 5,
    backgroundColor: 'white',
  },
  heading: {
    marginBottom: responsiveHeight(1),
    fontSize: responsiveFontSize(1.8),
    fontWeight: '500',
    opacity: 0.9,
  },
  buttonStyle: {
    marginTop: responsiveHeight(1),
    marginBottom: responsiveHeight(3),
    width: '90%',
  },
  goalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
    maxHeight: responsiveHeight(45)
  },
  touch: {
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(2),
    paddingBottom: responsiveHeight(1),
     shadowColor: 'gray',
    ...Platform.select({
      ios: {
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 5.5,
      },
    }),
    backgroundColor: 'white',
    borderRadius: responsiveWidth(1.5),
  },
  image: {
    height: responsiveWidth(22),
    width: responsiveWidth(20),
  },
  goalItemContainer: {
    alignItems: 'center',
    marginBottom: responsiveHeight(2),
    borderRadius: responsiveWidth(1.5),
    borderWidth: responsiveWidth(0.23),
  },
  cancel: {
    position: 'absolute',
    top: responsiveHeight(1),
    right: responsiveWidth(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    height: responsiveHeight(2.5),
    width: responsiveHeight(2.5),
  },
});
