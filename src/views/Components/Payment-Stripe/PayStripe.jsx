/* eslint-disable eqeqeq */

import React, { useEffect, useState } from 'react'

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useHistory } from 'react-router'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { notify } from 'reapop'
import ReactGA from 'react-ga4'
import { getOrderSuccessByOrderId } from 'src/service/paymentService'
import { ServiceMsg } from 'src/reusable/enum'
import OnError from 'src/_helpers/onerror'
import PaymentCompletedAlert from '../payment/PaymentCompletedAlert'

const CARD_OPTIONS = {
  hidePostalCode: true,
  iconStyle: 'solid',
  border: 'red',
  style: {
    base: {
      width: '100px',
      iconColor: '#7A7E83',
      color: '#7A7E83',
      fontWeight: 500,
      fontFamily: 'Lato ,Open Sans, Segoe UI, sans-serif',
      fontSize: '20px',
      border: ' gray',
      fontSmoothing: 'antialiased',
      ':-webkit-autofill': {
        color: '#black'
      },
      '::placeholder': {
        color: '#7A7E83'
      }
    },
    invalid: {
      iconColor: 'red',
      color: 'red'
    }
  }
}

const PayStripe = ({ billingDetails, orderDetail, stKey, isValid, orderId }) => {
  // eslint-disable-next-line no-unused-vars
  const [billDet, setBillDet] = useState(null)
  const [stripeKeySes, setStripeKeySes] = useState(null)
  const [validDetail, setIsvalidDetail] = useState(false)
  const dispatch = useDispatch()
  const history = useHistory()
  // let btnRef = useRef();
  const [isNotify, setIsNotify] = useState(false)
  const [gaParams, setGaParams] = useState({})

  useEffect(() => {
    // if (btnRef.current) {
    // btnRef.current.removeAttribute('disabled');
    // }
    setBillDet(billingDetails?.order)
    setStripeKeySes(stKey)
    setIsvalidDetail(isValid)
    const gaParamsFromOrderDetails = {
      currency: 'USD',
      value: +orderDetail.orderTotal,
      items: orderDetail.orderDetails.map((od) => ({
        item_id: od.code,
        item_name: od.description,
        currency: 'USD',
        price: od.discountedPrice
      })),
      order_id: orderId
    }
    ReactGA.event('begin_checkout', gaParamsFromOrderDetails)
    setGaParams(gaParamsFromOrderDetails)
  }, [billingDetails, orderDetail, stKey, isValid])

  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (event) => {
    // Block native form submission.
    // if (btnRef.current) {
    // 	btnRef.current.setAttribute('disabled', 'disabled');
    // }
    event.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    // eslint-disable-next-line no-unused-vars
    const cardElement = elements.getElement(CardElement)

    // Use your card Element with other Stripe.js APIs
    // const {error, paymentMethod} = await stripe.createPaymentMethod({
    //   type: 'card',
    //   card: cardElement,
    //   billing_details: billingDetails

    // });
    let Key = String(stripeKeySes)
    delete billingDetails.billing
    delete billingDetails.orderId
    //  const result = await stripe.confirmCardPayment('pi_3JbTJsBOELX9tyni04ZI8oOZ_secret_WT1Iou4419shrypuGR6OqIO2C',{
    ReactGA.event('add_payment_info', gaParams)

    const result = await stripe.confirmCardPayment(Key, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: billingDetails
      }
    })

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.error(result.error.message)
      ReactGA.event('purchase_failed', gaParams)
      dispatch(notify(result.error.message, 'error'))
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        ReactGA.event('purchase', { ...gaParams, transaction_id: result.paymentIntent.id })
        let data = {
          paymentStatus: JSON.stringify(result.paymentIntent)
        }
        try {
          let saveResult = await getOrderSuccessByOrderId(orderId, data)
          if (saveResult.data.message == ServiceMsg.OK) {
            dispatch(notify('Paid successfully', 'success'))
            // history.push('/main')
            setIsNotify(true)
          } else {
            dispatch(notify('Paid successfully but not saved in history', 'error'))
          }
        } catch (error) {
          OnError(error, dispatch)
        }

        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
      }
    }
  }

  const modelCancel = () => {
    setIsNotify(!isNotify)
    history.push('/main')
  }

  return (
    <>
      {/* <Elements stripe={stripePromise}> */}
      <div className="card  cover-content p-3 pt-5 ">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-7 mb-4">
              <div className="FormRow form-group">
                <CardElement options={CARD_OPTIONS} />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={!stripe || !validDetail}>
            Pay Now
          </button>
        </form>
      </div>

      <PaymentCompletedAlert
        isNotify={isNotify}
        handleCancel={modelCancel}
        orderId={orderId}
        orderDetail={billingDetails}
      />

      {/* </Elements> */}
    </>
  )
}

PayStripe.propTypes = {
  billingDetails: PropTypes.any,
  stKey: PropTypes.any,
  isValid: PropTypes.any,
  orderId: PropTypes.any
}

export default PayStripe
