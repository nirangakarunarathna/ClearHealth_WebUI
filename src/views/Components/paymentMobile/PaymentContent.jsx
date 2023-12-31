import React, { useEffect } from 'react'
import { OrderType, OutOfPocketReason } from 'src/reusable/enum'
import PaymentPrice from './paymentPrice'

const PaymentContent = ({ details, orderId }) => {
  return (
    <div>
      {details?.orderDetails.orderType == OrderType.ClearPackage && details?.orderDetails.orderAttempts == 1 && (
        <div>
          <p>
            Your provider has requested a diagnostic imaging scan as a necessary part of your care. In reviewing your
            payment responsibility for this procedure, it has been determined that you will owe 100% of the costs
            out-of-pocket.
          </p>
          {(details?.orderDetails.outOfPocketReason == OutOfPocketReason.HealthInsurance ||
            details?.orderDetails.outOfPocketReason == OutOfPocketReason.AnnualDeductible ||
            details?.orderDetails.outOfPocketReason == OutOfPocketReason.DeniedPayment) && (
              <p>This is due to the following reason:</p>
            )}

          <ul className="list-unstyled">
            {details?.orderDetails.outOfPocketReason == OutOfPocketReason.HealthInsurance && (
              <li> - You are currently without a health insurance plan </li>
            )}
            {details?.orderDetails.outOfPocketReason == OutOfPocketReason.AnnualDeductible && (
              <li> - You have not yet met your annual deductible </li>
            )}
            {details?.orderDetails.outOfPocketReason == OutOfPocketReason.DeniedPayment && (
              <li> - Your insurance company has denied payment for the procedure</li>
            )}
          </ul>

          {details?.orderDetails.outOfPocketReason == OutOfPocketReason.Other && (
            <>
              <p>This could be due to one of the following reason:</p>
              <ul className="list-unstyled">
                <li> - You are currently without a health insurance plan </li>
                <li> - You have not yet met your annual deductible or </li>
                <li> - Your insurance company has denied payment for the procedure</li>
              </ul>
            </>
          )}

          <p>
            {' '}
            {details?.orderDetails?.facilityName} would like to offer you a discounted, all-inclusive rate to pay for
            your procedure if you pay in advance of your care. Through a partnership with Clear Health, the hospital fee
            and all associated physician fees are included in this discounted rate, and you should not receive any
            further bills related to this procedure unless additional care is required.
          </p>
          <div>
            <PaymentPrice orderDetail={details} orderId={orderId} />
          </div>

          <p>
            To take advantage of this offer, you must pay the full discounted price prior to your procedure. You may
            view your discounted package price and simplify your billing now.
          </p>

          <div>Thank you, </div>
          <h6 className="font-weight-bold">Customer Support Team </h6>

          <div className="mt-4"> *Please note by utilizing Clear Health, you elected to pay cash. This payment will not be filed with your insurance company. If you would like Clear Health to facilitate your ability to self file please contact us. Your insurer will determine if the claim may be counted towards your deductible.</div>
        </div>
      )}

      {details?.orderDetails.orderType == OrderType.ClearPackage && details?.orderDetails.orderAttempts == 2 && (
        <div>
          <p>
            We want to make sure you are aware of a discounted, all-inclusive payment option for your upcoming
            procedure.
          </p>

          <p>
            While it has been determined that you are responsible for 100% of costs out-of-pocket for your procedure,{' '}
            {details?.orderDetails?.facilityName}, in partnership with Clear Health, is offering you the option to
            pre-pay for your care and receive a reduced, all-inclusive rate. All associated hospital and physician fees
            are included in this discounted offer, and you will not receive additional bills for this procedure unless
            additional care is required.
          </p>
          <div>
            <PaymentPrice orderDetail={details} orderId={orderId} />
          </div>
          <p>Take advantage of this rate now and make your day of care hassle-free.</p>

          <div>Thank you, </div>
          <h6 className="font-weight-bold">Customer Support Team </h6>

          <div className="mt-4"> *Please note by utilizing Clear Health, you elected to pay cash. This payment will not be filed with your insurance company. If you would like Clear Health to facilitate your ability to self file please contact us. Your insurer will determine if the claim may be counted towards your deductible.</div>

        </div>
      )}

      {details?.orderDetails.orderType == OrderType.ClearPackage && details?.orderDetails.orderAttempts == 3 && (
        <div>
          <p>It’s almost time for your scheduled procedure at {details?.orderDetails?.facilityName}.</p>
          <p>
            As a reminder, we have partnered with Clear Health to offer you a discounted, all-inclusive option to pay
            for your care. By paying in advance, you will pay less than if you wait to pay on the day of your procedure
            and avoid any additional procedure-related bills for hospital and provider fees.
          </p>
          <div>
            <PaymentPrice orderDetail={details} orderId={orderId} />
          </div>
          <p>
            Please note that this is the last communication you will receive with this offer. You can take advantage of
            this special discounted rate today and simplify your visit.
          </p>

          <div>Thank you, </div>
          <h6 className="font-weight-bold">Customer Support Team </h6>

          <div className="mt-4"> *Please note by utilizing Clear Health, you elected to pay cash. This payment will not be filed with your insurance company. If you would like Clear Health to facilitate your ability to self file please contact us. Your insurer will determine if the claim may be counted towards your deductible.</div>

        </div>
      )}

      {details?.orderDetails.orderType == OrderType.PatientResponsibility && details?.orderDetails.orderAttempts == 1 && (
        <div>
          <p>
          Your provider has decided further treatment is a necessary part of your care. After reviewing your insurance eligibility 
          for this procedure, it has been determined that you are responsible for a deductible payment. 
          </p>
          <div>
            <PaymentPrice orderDetail={details} orderId={orderId} />
          </div>
          <p>
            {details?.orderDetails?.facilityName} is offering you a discount if you pay your deductible in advance of your care. 
             To take advantage of this offer, you must pay prior to the day of your procedure. 
             View your reduced price offer and simplify your billing now.
          </p>

          <div>Thank you, </div>
          <h6 className="font-weight-bold">Customer Support Team </h6>
        </div>
      )}

      {details?.orderDetails.orderType == OrderType.PatientResponsibility && details?.orderDetails.orderAttempts == 2 && (
        <div>
          <p>
            We want to make sure you are aware of a discounted payment option for your upcoming procedure.
          </p>

          <p>
            While it has been determined that you are responsible for a deductible for your procedure,{' '}
            {details?.orderDetails?.facilityName}, in partnership with Clear Health, is offering you the option to
            pre-pay for your care and receive a reduced rate.
          </p>
          <div>
            <PaymentPrice orderDetail={details} orderId={orderId} />
          </div>

          <p>Take advantage of this rate now and make your day of care hassle-free.</p>

          <div>Thank you, </div>
          <h6 className="font-weight-bold">Customer Support Team </h6>
        </div>
      )}

      {details?.orderDetails.orderType == OrderType.PatientResponsibility && details?.orderDetails.orderAttempts == 3 && (
        <div>
          <p>It’s almost time for your scheduled procedure at {details?.orderDetails?.facilityName}.</p>
          <p>
            As a reminder, we have partnered with Clear Health to offer you a discounted option to pay for your care. By
            paying in advance, you will pay less than if you wait to pay on the day of your procedure.
          </p>
          <div>
            <PaymentPrice orderDetail={details} orderId={orderId} />
          </div>
          <p>
            Please note that this is the last communication you will receive with this offer. You can take advantage of
            this special discounted rate today and simplify your visit.
          </p>

          <div>Thank you, </div>
          <h6 className="font-weight-bold">Customer Support Team </h6>
        </div>
      )}
    </div>
  )
}

export default PaymentContent
