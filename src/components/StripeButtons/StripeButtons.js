import StripeCheckout from 'react-stripe-checkout'
import React, { useEffect } from 'react';
import { useLoading } from '../../hooks/useLoading';
import { pay } from '../../services/orderService';
import { useCart } from '../../hooks/useCart';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function StripeButtons({order}) {
  return (
    <StripeCheckout
    options={{
      clientId:
        'pk_test_51P174OSJanGu1kzMO6TwKn6eNw6Uwi8HHzlU7GE7i6XMHPj49Ivijdj46HE801DEWSeBfk9x8Hpi02xDDELr28Wl00B3kePEDT',
    }}
    >

      <Buttons order={order}/>
    </StripeCheckout>
  );
}
function Buttons({ order }) {
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [{ isPending }] = {};
  const { showLoading, hideLoading } = useLoading();
  useEffect(() => {
    isPending ? showLoading() : hideLoading();
  });

  const createOrder = (data, actions) => {
    return actions.order.create({ 
      purchase_units: [
        {
          amount: {
            currency_code: 'INR',
            value: order.totalPrice,
          },
        },
      ],
    });
  }
  const onApprove = async (data, actions) => {
    try {
      const payment = await actions.order.capture();
      const orderId = await pay(payment.id);
      clearCart();
      toast.success('Payment Saved Successfully', 'Success');
      navigate('/track/' + orderId);
    } catch (error) {
      toast.error('Payment Save Failed', 'Error');
    }
  };

  const onError = err => {
    toast.error('Payment Failed', 'Error');
  };

  return (
    <StripeCheckout
      createOrder={createOrder}
      onApprove={onApprove}
      onError={onError}
    />
  );
}