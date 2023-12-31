import React, { useEffect, useState } from 'react'
import { CModal, CModalBody, CModalHeader } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
// import greenTick from '../../assets/images/icons/greentick.png';
import { getViewReceipt } from 'src/service/orderService'
const PaymentCompletedAlert = ({ orderId = null, isNotify, handleCancel, orderDetail = null }) => {
  const [modal, setModal] = useState(false)
  const [facilityName, setFacilityName] = useState(null)
  useEffect(() => {
    setModal(isNotify)
    setFacilityName(orderDetail?.orderPatientDetails?.facilityName)
  }, [isNotify])

  const downlaodPdf = async () => {
    try {
      let result = await getViewReceipt({
        orderId: orderId
      })

      var downloadLink = document.createElement('a')
      downloadLink.target = '_blank'
      downloadLink.download = orderId + '.pdf'
      // convert downloaded data to a Blob
      var blob = new Blob([result.data], { type: 'application/pdf' })

      // create an object URL from the Blob
      var URL = window.URL || window.webkitURL
      var downloadUrl = URL.createObjectURL(blob)

      // set object URL as the anchor's href
      downloadLink.href = downloadUrl

      // append the anchor to document body
      document.body.append(downloadLink)

      // fire a click event on the anchor
      downloadLink.click()

      // cleanup: remove element and revoke object URL
      document.body.removeChild(downloadLink)
      URL.revokeObjectURL(downloadUrl)
    } catch (error) {}
  }

  return (
    <CModal show={modal} onClose={setModal} closeOnBackdrop={false}>
      <CModalHeader>
        <CModalBody>
          <div className="row m-2">
            <FontAwesomeIcon icon={faCheckCircle} className="fa-6x m-auto check-circle" />
          </div>

          <div className="text-center pb-2 font-weight-bold">
            <h3>Successfully Completed</h3>
          </div>
          <div className="text-center">
            Thank you for completing your order. A copy of your order will be emailed to you shortly. If you're not
            already scheduled for your procedure, you will be receiving a call from hospital to schedule.{' '}
          </div>

          <div className="row  m-2 pt-3">
            <button type="button" className="btn btn-primary btn-lg col-md-6 m-auto" onClick={downlaodPdf}>
              View Order
            </button>
          </div>
          <div className="row m-2">
            <button type="button" className="btn btn-lg col-md-6 m-auto" onClick={handleCancel}>
              Back to Home
            </button>
          </div>
        </CModalBody>
      </CModalHeader>
    </CModal>
  )
}

export default PaymentCompletedAlert
