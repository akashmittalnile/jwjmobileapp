import {View, Text, StyleSheet, TextInput, ViewStyle} from 'react-native';
import React from 'react';
import CountryPicker from 'react-native-country-picker-modal';
import Wrapper from '../Wrapper/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';

interface PhoneInputProps {
  style?: ViewStyle;
  disabled?: boolean;
  onCountryChange?: (text: any) => void;
  onChangeText: (text: any) => void;
  value: string;
  maxLength?: number;
  placeHolder?: string;
  countryCode:
    | 'AF'
    | 'AL'
    | 'DZ'
    | 'AS'
    | 'AD'
    | 'AO'
    | 'AI'
    | 'AQ'
    | 'AG'
    | 'AR'
    | 'AM'
    | 'AW'
    | 'AU'
    | 'AT'
    | 'AZ'
    | 'BS'
    | 'BH'
    | 'BD'
    | 'BB'
    | 'BY'
    | 'BE'
    | 'BZ'
    | 'BJ'
    | 'BM'
    | 'BT'
    | 'BO'
    | 'BA'
    | 'BW'
    | 'BV'
    | 'BR'
    | 'IO'
    | 'VG'
    | 'BN'
    | 'BG'
    | 'BF'
    | 'BI'
    | 'KH'
    | 'CM'
    | 'CA'
    | 'CV'
    | 'BQ'
    | 'KY'
    | 'CF'
    | 'TD'
    | 'CL'
    | 'CN'
    | 'CX'
    | 'CC'
    | 'CO'
    | 'KM'
    | 'CK'
    | 'CR'
    | 'HR'
    | 'CU'
    | 'CW'
    | 'CY'
    | 'CZ'
    | 'CD'
    | 'DK'
    | 'DJ'
    | 'DM'
    | 'DO'
    | 'EC'
    | 'EG'
    | 'SV'
    | 'GQ'
    | 'ER'
    | 'EE'
    | 'SZ'
    | 'ET'
    | 'FK'
    | 'FO'
    | 'FJ'
    | 'FI'
    | 'FR'
    | 'GF'
    | 'PF'
    | 'TF'
    | 'GA'
    | 'GM'
    | 'GE'
    | 'DE'
    | 'GH'
    | 'GI'
    | 'GR'
    | 'GL'
    | 'GD'
    | 'GP'
    | 'GU'
    | 'GT'
    | 'GG'
    | 'GN'
    | 'GW'
    | 'GY'
    | 'HT'
    | 'HM'
    | 'HN'
    | 'HU'
    | 'IS'
    | 'IN'
    | 'ID'
    | 'IR'
    | 'IQ'
    | 'IE'
    | 'IM'
    | 'IL'
    | 'IT'
    | 'CI'
    | 'JM'
    | 'JP'
    | 'JE'
    | 'JO'
    | 'KZ'
    | 'KE'
    | 'XK'
    | 'KW'
    | 'KG'
    | 'LA'
    | 'LV'
    | 'LB'
    | 'LS'
    | 'LR'
    | 'LY'
    | 'LI'
    | 'LT'
    | 'LU'
    | 'MO'
    | 'MK'
    | 'MG'
    | 'MW'
    | 'MY'
    | 'MV'
    | 'ML'
    | 'MT'
    | 'MH'
    | 'MQ'
    | 'MR'
    | 'MU'
    | 'YT'
    | 'MX'
    | 'FM'
    | 'MD'
    | 'MC'
    | 'MN'
    | 'ME'
    | 'MS'
    | 'MA'
    | 'MZ'
    | 'MM'
    | 'NA'
    | 'NR'
    | 'NP'
    | 'NL'
    | 'NC'
    | 'NZ'
    | 'NI'
    | 'NE'
    | 'NG'
    | 'NU'
    | 'NF'
    | 'KP'
    | 'MP'
    | 'NO'
    | 'OM'
    | 'PK'
    | 'PW'
    | 'PS'
    | 'PA'
    | 'PG'
    | 'PY'
    | 'PE'
    | 'PH'
    | 'PN'
    | 'PL'
    | 'PT'
    | 'PR'
    | 'QA'
    | 'CG'
    | 'RO'
    | 'RU'
    | 'RW'
    | 'RE'
    | 'BL'
    | 'SH'
    | 'KN'
    | 'LC'
    | 'MF'
    | 'PM'
    | 'VC'
    | 'WS'
    | 'SM'
    | 'SA'
    | 'SN'
    | 'RS'
    | 'SC'
    | 'SL'
    | 'SG'
    | 'SX'
    | 'SK'
    | 'SI'
    | 'SB'
    | 'SO'
    | 'ZA'
    | 'GS'
    | 'KR'
    | 'SS'
    | 'ES'
    | 'LK'
    | 'SD'
    | 'SR'
    | 'SJ'
    | 'SE'
    | 'CH'
    | 'SY'
    | 'ST'
    | 'TW'
    | 'TJ'
    | 'TZ'
    | 'TH'
    | 'TL'
    | 'TG'
    | 'TK'
    | 'TO'
    | 'TT'
    | 'TN'
    | 'TR'
    | 'TM'
    | 'TC'
    | 'TV'
    | 'UG'
    | 'UA'
    | 'AE'
    | 'GB'
    | 'US'
    | 'UM'
    | 'VI'
    | 'UY'
    | 'UZ'
    | 'VU'
    | 'VA'
    | 'VE'
    | 'VN'
    | 'WF'
    | 'EH'
    | 'YE'
    | 'ZM'
    | 'ZW'
    | 'KI'
    | 'HK'
    | 'AX'
    | string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  style,
  disabled = false,
  onCountryChange,
  onChangeText,
  value = '',
  countryCode = 'US',
  maxLength,
  placeHolder = '',
}) => {
  const countryCodeHandler = (text: any) => {
    onCountryChange && onCountryChange(text);
  };

  return (
    <Wrapper
      containerStyle={{
        ...styles.wrapper,
        backgroundColor: disabled ? 'rgba(137, 137, 137, .2)' : 'white',
        ...style,
      }}>
      <View style={{position: 'relative'}}>
        <CountryPicker
          countryCode={countryCode}
          containerButtonStyle={styles.countryPicker}
          onSelect={countryCodeHandler}
          withFilter={true}
        />
        {disabled && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'transparent',
            }}
          />
        )}
      </View>
      <TextInput
        // keyboardType="numeric"
        editable={!disabled}
        style={styles.textInput}
        value={value}
        onChangeText={onChangeText}
        maxLength={maxLength}
        placeholder={placeHolder}
        placeholderTextColor="gray"
      />
    </Wrapper>
  );
};

export default PhoneInput;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: responsiveHeight(0),
    marginBottom: responsiveHeight(2),
    paddingTop: 0,
    height: responsiveHeight(7),
    width: '100%',
    borderRadius: responsiveWidth(2),
    overflow: 'hidden',
  },
  countryPicker: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: responsiveWidth(15),
    borderRightWidth: responsiveWidth(0.25),
    borderColor: globalStyles.midGray,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: responsiveWidth(2),
    height: '100%',
    fontSize: responsiveFontSize(2),
    color: 'black',
  },
});
