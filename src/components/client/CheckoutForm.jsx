import React, { useEffect, useState } from 'react'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { Button, LoadingOverlay } from '@mantine/core'
import { toast } from 'react-toastify'

const CheckoutForm = ({order, setModal}) => {

  // useStripe hook
  const stripe = useStripe();

  // useElement hook
  const elements = useElements();

  // Overlay loader state
  const [overlayLoading, setOverlayLoading] = useState(false);

  // Client secret state
  const [clientSecret, setClientSecret] = useState("");

  // Order price
  const { _id, name, email, price } = order;

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch(`${import.meta.env.VITE_API_Server}/create-payment-intent`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ price })
    })
    .then((res) => res.json())
    .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  // Handle submit
  const handleSubmit = async (e) => {
    // Disabling form default behavior
    e.preventDefault();

    if (!stripe || !elements) {
      // Disable the overlay loader
      setOverlayLoading(false);
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    };

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const card = elements.getElement(CardElement);

    if (card == null) {
      // Disable the overlay loader
      setOverlayLoading(false);
      return;
    };

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    // Handle error
    if (error) {
      // Error toast
      toast.error(error?.message, {
        autoClose: 1500, position: toast.POSITION.TOP_CENTER
      });
      // Disable the overlay loader
      setOverlayLoading(false);
    };

    // Confirm card payment
    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: card,
          billing_details: {
            name,
            email,
          },
        },
      },
    );

    // Handle confirError
    if (confirmError) {
      // Error toast
      toast.error(confirmError?.message, {
        autoClose: 1500, position: toast.POSITION.TOP_CENTER
      });
      // Disable the overlay loader
      setOverlayLoading(false);
      return;
    };

    // Handle success
    if (paymentIntent?.status === 'succeeded') {
      fetch(`${import.meta.env.VITE_API_Server}/update-order/${_id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ trxId: paymentIntent?.id, status: 'Paid' })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Successful toast
          toast.success(data.message, {
            autoClose: 1500, position: toast.POSITION.TOP_CENTER
          });
          // Form reset
          e.target.reset();
          // Close the modal
          setModal({ pay: false });
          // Disable the overlay loader
          setOverlayLoading(false);
        } else {
          // Error toast
          toast.error(data.message, {
            autoClose: 1500, position: toast.POSITION.TOP_CENTER
          });
          // Disable the overlay loader
          setOverlayLoading(false);
        };
      })
      .catch(error => {
        // Error toast
        toast.error(error.message, {
          autoClose: 1500, position: toast.POSITION.TOP_CENTER
        });
        // Disable the overlay loader
        setOverlayLoading(false);
      });
    };
  };

  return (
    <form onSubmit={e => { handleSubmit(e); setOverlayLoading(true) }} >
      <LoadingOverlay visible={overlayLoading} overlayBlur={1} radius="sm" />
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
      <Button type="submit" mt={30} className="!flex ml-auto" disabled={!stripe || !clientSecret}>Pay Now</Button>
    </form>
  )
};

export default CheckoutForm;