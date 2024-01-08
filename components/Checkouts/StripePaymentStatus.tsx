import React, {useState, useEffect} from 'react';
import {useStripe} from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation'

const PaymentStatus = () => {
  const stripe = useStripe();
  const [message, setMessage] = useState<string>('');
  const [status, setStatus] = useState<string>('loading');
 
  const router = useRouter()

  useEffect(() => {
    if (!stripe) {
      return;
    }

    // Retrieve the "payment_intent_client_secret" query parameter appended to
    // your return_url by Stripe.js
    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    // Retrieve the PaymentIntent
    stripe
      .retrievePaymentIntent(clientSecret ?? '')
      .then(({paymentIntent}) => {
        // Inspect the PaymentIntent `status` to indicate the status of the payment
        // to your customer.
        //
        // Some payment methods will [immediately succeed or fail][0] upon
        // confirmation, while others will first enter a `processing` state.
        //
        setStatus(paymentIntent?.status ?? 'loading')
        // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
        switch (paymentIntent?.status) {
          case 'succeeded':
            setMessage('Success! Payment received.');
            break;

          case 'processing':
            setMessage("Payment processing. We'll update you when payment is received.");
            break;

          case 'requires_payment_method':
            // Redirect your user back to your payment page to attempt collecting
            // payment again
            setMessage('Payment failed. Please try another payment method.');
            break;

          default:
            setMessage('Something went wrong.');
            break;
        }
      });
  }, [stripe]);

  useEffect(() => {
    let url = '/';
    if (status === 'loading') {
        return;
    }
    if (status !== 'sucess') {
        url = '/checkout'    
    }
    setTimeout(() => router.push(url), 1000)
  }, [status])


  return <div className="">
    {message}
  </div>;
};

export default PaymentStatus;