import React, { useEffect, useState } from 'react';
import { useLoading } from '../../hooks/useLoading';
import { pay } from '../../services/orderService';
import { useCart } from '../../hooks/useCart';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import classes from'./stripeButtons.module.css'
import Button from '../Button/Button';

export default function StripePayment({ order }) {
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    showLoading();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      const orderId = await pay(paymentMethod.id); // Assuming pay method handles payment processing

      clearCart();
      toast.success('Payment Saved Successfully', 'Success');
      navigate('/track/' + orderId);
    } catch (error) {
      toast.error('Payment Save Failed', 'Error');
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  return (
    <div className={classes.buttons_container}>
      <div className={classes.buttons}>
    <form onSubmit={handleSubmit}>
      <CardElement />
      <Button type="submit" 
              text="Pay"
              width="100%"
              height="3rem"
              disabled={!stripe || loading}>
        Pay
      </Button>
      {error && <div>{error}</div>}
    </form>
    </div>
    </div>
  );
}
