import {View, Text, StyleSheet, FlatList, Image} from 'react-native';
import React from 'react';
import Header from '../../components/Header/Header';
import {globalStyles} from '../../utils/constant';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {endPoint, GetApiWithToken} from '../../services/Service';
import {useAppSelector} from '../../redux/Store';
import SkeletonContainer from '../../components/Skeleton/SkeletonContainer';
import PdfCard from '../../components/Pdf/PdfCard';

const DownloadedPdf = () => {
  const token = useAppSelector(state => state.auth.token);
  const [pdfList, setPdfList] = React.useState<any[] | undefined>(undefined);
  const [skeleton, setSkeleton] = React.useState<boolean>(false);

  React.useEffect(() => {
    getPdfList();
  }, []);

  const getPdfList = async () => {
    try {
      setSkeleton(true);
      const response = await GetApiWithToken(endPoint?.journalPdf, token);
      if (response?.data?.status) {
        setPdfList(response?.data?.data);
      }
    } catch (err: any) {
      console.log('err in getting pdf list', err?.message);
    } finally {
      setSkeleton(false);
    }
  };
  const renderPdfCard = ({item}: {item: any}) => {
    console.log(item?.download_url);
    return (
      <PdfCard
        pdfLink={item?.download_url}
        startDate={item?.start_date}
        paymentDate={item?.payment_date}
      />
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Header title="Printed Pdf" notificationButton={false} />
      </View>
      <View style={styles.subContainer}>
        {skeleton && <SkeletonContainer />}
        {!skeleton && Array.isArray(pdfList) && pdfList?.length > 0 && (
          <FlatList
            data={pdfList}
            renderItem={renderPdfCard}
            style={styles.flatlist}
          />
        )}
        {!skeleton && Array.isArray(pdfList) && pdfList?.length === 0 && (
          <View>
            <Image
              source={require('../../assets/Icons/no-data-found.png')}
              resizeMode="contain"
              style={styles.noDataFoundIcon}
            />
            <Text style={styles.text}>No Data Found</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default DownloadedPdf;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: globalStyles.backgroundColor,
  },
  followedCommunityTabStyle: {
    marginTop: responsiveHeight(1.5),
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: responsiveHeight(2),
    backgroundColor: globalStyles.themeBlue,
  },
  subContainer: {
    flex: 1,
    width: responsiveWidth(95),
  },
  flatlist: {
    flex: 1,
  },
  noDataFoundIcon: {
    marginTop: responsiveHeight(25),
    height: responsiveHeight(18),
    width: 'auto',
  },
  text: {
    textAlign: 'center',
    fontSize: responsiveFontSize(2.6),
    color: 'black',
    fontWeight: '500',
  },
});
