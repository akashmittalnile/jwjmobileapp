import {View, Text} from 'react-native';
import React from 'react';
import ContactTabContainer from './ContactTabContainer';
import ContactTab from './ContactTab';
import moment from 'moment';

interface ContactMainTabProps {
  data: any;
}

const ContactMainTab: React.FC<ContactMainTabProps> = ({data}) => {
  const [statusCompletedAdminTab, setStatusCompletedAdminTab] =
    React.useState<boolean>(false);

  return (
    <ContactTabContainer
      status={data?.status_name?.toLowerCase()}
      showButton={data?.admin_reply}
      onPress={() => {
        setStatusCompletedAdminTab(value => !value);
      }}>
      <ContactTab
        profile={data?.profile}
        name={data?.name}
        text={data?.message}
        date={moment(data?.query_date, 'DD MMM, YYYY hh:mm A').format(
          'MMM DD, YYYY hh:mm A',
        )}
        enquiryText={data?.type_name}
        onPress={() => {}}
      />
      {statusCompletedAdminTab && (
        <ContactTab
          admin={true}
          profile={data?.admin_profile}
          name={data?.admin_name}
          text={data?.admin_reply}
          date={`Response Received on ${moment(
            data?.admin_reply_date,
            'DD MMM, YYYY hh:mm A',
          ).format('MMM DD, YYYY hh:mm A')}`}
          onPress={() => {}}
        />
      )}
    </ContactTabContainer>
  );
};

export default ContactMainTab;
