/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router'
import { loaderHide, loaderShow } from 'src/actions/loaderAction'
import { ServiceMsg } from 'src/reusable/enum'
import { getOpenOrderById } from 'src/service/orderService'
import DateSelector from 'src/views/common/dateSelector'
import OnError from 'src/_helpers/onerror'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { notify } from 'reapop'
import { facilityPaymentVerification, providerPaymentVerification } from 'src/service/paymentService'

const PaymentVerificationValidation = ({ verifyHandle, verificationMsg = null }) => {
  const location = useLocation()
  const dispatch = useDispatch()
  let history = useHistory()
  const [idNumber, handleIdChange] = useState(null)
  const [detail, setDetail] = useState(null)
  const [orderId, setOrderId] = useState(null)
  const [providerId, setProviderId] = useState(null)
  const [checked, setChecked] = useState(null)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const id = params.get('id')
    const providerId = params.get('providerid')
    setProviderId(providerId)

    setOrderId(id)

    const fetchData = async () => {
      dispatch(loaderShow())
      try {
        let result = await getOpenOrderById(id)
        if (result.data.message == ServiceMsg.OK) {
          setDetail(result.data.data)
        }
      } catch (error) {
        OnError(error, dispatch)
      }
      dispatch(loaderHide())
    }

    fetchData()
  }, [location])

  const submitAccount = () => {
    if (idNumber) {
      if (location.pathname == '/paymentverificationprovider') {
        let data = { orderId: orderId, providerPartyRoleID: providerId, providerUniqueNumber: idNumber }
        providerVerification(data)
      } else if (location.pathname == '/paymentverificationfacility') {
        let data = { orderId: orderId, facilityUniqueNumber: idNumber }
        facilityVerification(data)
      } else {
      }
    }
  }

  const providerVerification = async (data) => {
    try {
      const result = await providerPaymentVerification(data)
      if (result.data.message === ServiceMsg.OK) {
        dispatch(notify(`Successfully updated`, 'success'))
        history.push('/successaction')
      }
    } catch (error) {
      OnError(error, dispatch)
    }
  }

  const facilityVerification = async (data) => {
    try {
      const result = await facilityPaymentVerification(data)
      if (result.data.message === ServiceMsg.OK) {
        dispatch(notify(`Successfully updated`, 'success'))
        history.push('/successaction')
      }
    } catch (error) {
      OnError(error, dispatch)
    }
  }

  return (
    <>
      <div className="container">
        <div className="row mt-3">
          <div className="col-md-3"></div>
          <div className="col-md-6 ">
            <div className="card boxshadow p-3 radius-1">
              <div className="row">
                <div className="col-md-12">
                  <h3 className="text-center font-weight-bold">Payment Verification</h3>
                  <p className="col-md-6 m-auto text-center p-2 font-lato-bold">
                    Enter your unique patient billing ID to verify the procedure and the payment
                  </p>
                </div>
                <div className="col-md-12">
                  <div className="text-center pt-4 pb-2  ">Patient Name</div>

                  <div className="text-center font-weight-bold h5 mb-2">
                    {detail && detail?.orderPatientDetails?.firstName} {detail && detail?.orderPatientDetails.lastName}{' '}
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="text-center pt-4 pb-2  ">Date Of Birth</div>
                  <div className="text-center font-weight-bold h5 mb-2">
                    {detail && detail?.orderPatientDetails?.DOB}{' '}
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="text-center pt-4 pb-2  ">Hospital</div>
                  <div className="text-center font-weight-bold h5 mb-2">
                    {detail && detail?.orderPatientDetails?.facilityName}{' '}
                  </div>
                </div>

                <div className="col-md-12">
                  {detail && detail?.orderDetails.length > 0 && detail?.orderDetails[0].description && (
                    <div className="text-center pt-4 pb-2  ">Procedure </div>
                  )}
                  <ul className="text-center font-weight-bold h5 mb-2 mb-2 list-unstyled">
                    {detail &&
                      detail?.orderDetails.length > 0 &&
                      detail?.orderDetails.map((item, index) => (
                        <li key={index} value={item}>
                          {item.description}
                        </li>
                      ))}{' '}
                  </ul>
                </div>

                <div className="col-md-6  offset-md-3  text-center">
                  <input
                    type="text"
                    className="form-control-sm "
                    onChange={(e) => handleIdChange(e.target.value)}
                    placeholder="Enter Id Here"
                  />
                  {/* <DateSelector className={'form-control-sm calendar-font '} selectedDate={idNumber} handleDateChange={handleIdChange} disableFuture={true} /> */}
                  {/* <p className="text-danger text-left mt-4">{verificationMsg && verificationMsg}</p> */}

                </div>
                <div className="col-md-12 offset-md-2 mt-4 text-center">
                  <div className='row'>
                    <div className="">
                      <input type="checkbox" id="confirmSubmit" onChange={() => setChecked(!checked)} name="confirmSubmit" value="Bike" />

                      <label className='ml-2'>I entered the Clear Health Payor ID into the patient's account in the EHR</label>
                    </div>
                  </div>
                </div>
                <div className="col-md-6  offset-md-3  text-center">
                  <button type="button" disabled={!checked || idNumber == null ? true : false || idNumber == '' ? true : false} className="btn btn-primary  btn-lg  mt-3 mb-2" onClick={submitAccount}>
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

PaymentVerificationValidation.propTypes = {
  verifyHandle: PropTypes.func,
  verificationMsg: PropTypes.string
}

export default PaymentVerificationValidation
