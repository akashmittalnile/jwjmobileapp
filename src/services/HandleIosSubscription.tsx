import RNIap, {
  finishTransaction,
  purchaseUpdatedListener,
  purchaseErrorListener,
  requestSubscription,
  initConnection,
  endConnection,
  getSubscriptions,
  getProducts,
} from 'react-native-iap';

let purchaseUpdateSubscription: any = null;
let purchaseErrorSubscription: any = null;

export const subscribedToSubscriptionListener = async (callback: Function) => {
  initConnection();
  await getSubscriptions({
    skus: [
      'prod_PVqNani9ws1r6k',
      'prod_PVqNHEOuvDDSKy_plan_c_yearly',
      'prod_PVqNani9ws1r6k_plan_b_monthly',
      'prod_PVqNHEOuvDDSKy_plan_c_monthly',
    ],
  });
  await getProducts({
    skus: ['journeywithjournaltest'],
  });
  purchaseUpdateSubscription = purchaseUpdatedListener(async purchase => {
    const receipt = purchase.transactionReceipt;
    if (receipt) {
      try {
        await finishTransaction({
          purchase,
          isConsumable: false,
        });
      } catch (err) {
        // console.error('Error finishing transaction:', err);
      } finally {
        // setNextButtonLoader(false);
        callback(false);
      }
    } else {
      // console.log('No transaction receipt found');
    }
  });

  purchaseErrorSubscription = purchaseErrorListener(error => {
    // console.error('Purchase Error:', error?.message);
  });
};

export const unSubscribedToSubscriptionListener = () => {
  purchaseUpdateSubscription && purchaseUpdateSubscription.remove();
  purchaseErrorSubscription && purchaseErrorSubscription.remove();
  endConnection();
};

export const handleSubscription = async (
  sku: string,
  callback?: (response: any) => void,
) => {
  try {
    const response: any = await requestSubscription({sku});
    callback && callback(response);
  } catch (err) {
    console.log('error in requestSubscription', err);
    callback && callback(Error);
  }
};
