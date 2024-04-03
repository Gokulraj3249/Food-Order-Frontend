import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripePayment from './StripeButtons'; 

const stripePromise = loadStripe('pk_test_51P174OSJanGu1kzMO6TwKn6eNw6Uwi8HHzlU7GE7i6XMHPj49Ivijdj46HE801DEWSeBfk9x8Hpi02xDDELr28Wl00B3kePEDT');

function StripeButtons({ order }) {
  return (
    <Elements stripe={stripePromise}>
      <StripePayment order={order} />
    </Elements>
  );
}

export default StripeButtons;
