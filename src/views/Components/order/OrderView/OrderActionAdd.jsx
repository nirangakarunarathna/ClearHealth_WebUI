/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getCPTCodesByHospital } from 'src/service/hospitalsService'
import OnError from 'src/_helpers/onerror'
import Select from 'react-select'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'

const schema = yup.object().shape({
  cptDetail: yup.object().shape({
    code: yup.string(),
    description: yup.string(),
    packagePrice: yup.string(),
    providerPartyRoleId: yup.string()
  })
})

const OrderActionAdd = ({ data, handleChangeCpt }) => {
  const [cptList, setCptList] = useState([])
  const [providersList, setProvidersList] = useState([])
  const [defaultValue, setDefaultValue] = useState([])
  const [editDetail, seteditDetail] = useState(data)
  const [selectedCPT, setSelectedCPT] = useState(data)
  const dispatch = useDispatch()
  const { register, getValues, reset, formState } = useForm({ resolver: yupResolver(schema), mode: 'all' })
  //const [selectedCPT, setSelectedCPT] = useState([]);

  const handleChange = (newValue: any, actionMeta: any) => {
    setProvidersList(newValue.providers)

    let changeValue = {
      ...editDetail,
      ...newValue,
      codeId: newValue.Id,
      providerPartyRoleId: newValue.providers[0].partyRoleId
    }
    // delete changeValue['Id'];
    let formDetail = {
      cptDetail: { ...changeValue }
    }

    reset(formDetail)
    handleChangeCpt(formDetail.cptDetail)
    setSelectedCPT(formDetail.cptDetail)
  }

  const providerChange = (event) => {
    let changeValue = { ...selectedCPT, providerPartyRoleId: event.target.value }
    handleChangeCpt(changeValue)

    // console.log(event.target.value);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        let result = await getCPTCodesByHospital(data.orderPatientDetails.hospitalPartyRoleId, {})
        //let selected = result.data.data.filter(x => x.Id == data.codeId);

        // let newListCpt=result.data.data.filter((e)=>{
        //   if(!selectedCPT?.orderDetails.find(x => x.code== e.code)) {
        //    return e;
        //   }
        //  });
        setCptList(result.data.data)

        // setCptList(newListCpt)

        // setProvidersList(selected[0].providers);
        //setDefaultValue(selected);

        let formDetail = {
          cptDetail: { ...data }
        }

        reset(formDetail)
      } catch (error) {
        OnError(error, dispatch)
      }
    }
    fetchData()
  }, [data])

  return (
    <>
      <div className="row">
        <div className="col-md-12 mb-3">
          <label className="mr-4 float-left pt-2">CPT Code </label>
          {cptList.length > 0 && (
            <Select
              options={cptList}
              defaultValue={defaultValue[0]}
              onChange={handleChange}
              getOptionLabel={(option) => `${option.code} - ${option.description}`}
              getOptionValue={(option) => `${option.Id}`}
            />
          )}
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <label className="form-text">Code</label>
            <input className="form-control-sm" type="text" {...register('cptDetail.code')} readOnly />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-text">Description</label>
            <input className="form-control-sm" type="text" {...register('cptDetail.description')} readOnly />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-text">Package Price</label>
            <input className="form-control-sm" type="text" {...register('cptDetail.packagePrice')} readOnly />
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <label className="form-text">Provider</label>

            <select
              name=""
              id=""
              className="form-control-sm"
              {...register('cptDetail.providerPartyRoleId')}
              onChange={providerChange}
            >
              {providersList.map((item, index) => (
                <option key={index} value={item.partyRoleId}>
                  {item.firstName} {item.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </>
  )
}

OrderActionAdd.propTypes = {
  handleChangeCpt: PropTypes.func,
  data: PropTypes.any
}

export default OrderActionAdd
