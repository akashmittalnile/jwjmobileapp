import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import Wrapper from '../Wrapper/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import BorderBtn from '../Button/BorderBtn';
// import RNFetchBlob from 'rn-fetch-blob';
import Pdf from 'react-native-pdf';
import {Modal} from 'react-native';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import {globalStyles} from '../../utils/constant';
import {fetchPdf} from '../../utils/Method';

interface PdfCardProps {
  pdfLink: string;
  startDate: string;
  paymentDate: string;
}

const PdfCard: React.FC<PdfCardProps> = ({pdfLink, startDate, paymentDate}) => {
  const [showPdf, setShowPdf] = React.useState<boolean>(false);

  const fileName = pdfLink?.substring(pdfLink.lastIndexOf('/') + 1);

  const ViewPdfHandler = () => {
    setShowPdf(true);
  };
  const closePdf = () => {
    setShowPdf(false);
  };

  const onPdfLoad = () => {
    setTimeout(() => {
      Toast.show({
        type: 'success',
        text1: 'Pdf loaded successfully',
      });
    }, 1000);
  };

  const onPdfLoadError = () => {
    setTimeout(() => {
      Toast.show({
        type: 'error',
        text1: 'Pdf loading failed',
      });
    }, 1000);
  };

  const downloadPdf = async () => {
    setShowPdf(false);
    const result = await fetchPdf(pdfLink);
  };

  return (
    <>
      <Wrapper containerStyle={styles.wrapper}>
        <View style={styles.subContainer}>
          <View>
            <Image
              source={require('../../assets/Icons/pdf.png')}
              resizeMode="contain"
              style={styles.pdfIcon}
            />
          </View>
          <View>
            <Text style={styles.text} numberOfLines={1}>
              {/* {fileName ? fileName : 'Pdf'} */}
              Journal Records
            </Text>
            <Text
              style={{
                ...styles.text,
                marginTop: responsiveHeight(0.4),
                color: 'gray',
              }}
              numberOfLines={1}>
              {`${startDate} -> ${moment(startDate, 'MM-DD-YYYY')
                .add(6, 'month')
                .format('MM-DD-YYYY')}`}
            </Text>
          </View>
        </View>
        <BorderBtn
          buttonText="View"
          onClick={ViewPdfHandler}
          containerStyle={styles.button}
        />
      </Wrapper>
      <Modal animationType="slide" transparent={true} visible={showPdf}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={{
              ...styles.touch,
              left: responsiveWidth(2),
            }}
            onPress={closePdf}>
            <Image
              source={require('../../assets/Icons/cancel.png')}
              resizeMode="contain"
              style={styles.closeIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{...styles.touch, right: responsiveWidth(2)}}
            onPress={downloadPdf}>
            <Image
              source={require('../../assets/Icons/download-white.png')}
              resizeMode="contain"
              style={styles.closeIcon}
            />
          </TouchableOpacity>
          <Toast />
          <Pdf
            source={{
              uri: pdfLink,
              cache: true,
            }}
            onLoadComplete={onPdfLoad}
            onPageChanged={(page, numberOfPages) => {
              console.log(`Current page: ${page}`);
            }}
            onError={onPdfLoadError}
            onPressLink={uri => {
              console.log(`Link pressed: ${uri}`);
            }}
            style={styles.pdf}
            enablePaging={true}
          />
        </View>
      </Modal>
    </>
  );
};

export default PdfCard;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: responsiveHeight(2),
    paddingHorizontal: '3%',
    paddingTop: responsiveHeight(2),
    paddingBottom: responsiveHeight(2),
    width: '100%',
    borderRadius: responsiveWidth(3),
  },
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    maxWidth: '80%',
  },
  text: {
    paddingHorizontal: responsiveWidth(2),
    fontSize: responsiveFontSize(1.7),
    fontWeight: '400',
    color: 'black',
    maxWidth: '100%',
  },
  pdfIcon: {
    height: responsiveHeight(5),
    width: responsiveWidth(10),
  },
  button: {
    paddingHorizontal: responsiveWidth(2.5),
    height: responsiveHeight(3),
    width: 'auto',
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  touch: {
    position: 'absolute',
    bottom: responsiveHeight(74.5),
    zIndex: 1000,
    height: responsiveHeight(3.5),
    width: responsiveHeight(3.5),
    borderRadius: responsiveHeight(3.5),
  },
  closeIcon: {
    height: responsiveHeight(3.5),
    width: responsiveHeight(3.5),
  },
  pdf: {
    height: responsiveHeight(80),
    width: '100%',
    backgroundColor: 'white',
  },
});
