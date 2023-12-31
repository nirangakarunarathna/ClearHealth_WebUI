import React from 'react'
import AdminTitle from 'src/views/common/adminTitle'
import Goback from 'src/views/common/Goback'
import MetaTitles from 'src/views/common/metaTitles'
import OrderForm from './OrderForm'

const OrderProfile = () => {
  return (
    <>
      <Goback step={-2} />
      {/* for addeing page metas  */}
      <MetaTitles title="Clear Health | Order Profile" description=" Add Order  " />
      <div className="card  cover-content pt-2 ">
        <AdminTitle title={'Create New Order'} />

        <OrderForm />
      </div>
    </>
  )
}

export default OrderProfile
