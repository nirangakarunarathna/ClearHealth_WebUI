/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from 'react'
import { useForm, useFormState } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch } from 'react-redux'
import { MaskFormat, PartyTypeEnum, ServiceMsg, ValidationPatterns } from 'src/reusable/enum'
import { useHistory } from 'react-router-dom'
import OnError from 'src/_helpers/onerror'
import { notify } from 'reapop'
import { savePatient, updatePatientByPartyRoleId } from 'src/service/patientService'
import { loaderHide, loaderShow } from 'src/actions/loaderAction'
import PhoneNumberMaskValidation from 'src/reusable/PhoneNumberMaskValidation'
import InputMask from 'react-input-mask'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { TextField } from '@material-ui/core'
import DateSelector from 'src/views/common/dateSelector'
import FormatText from 'src/reusable/FormatText'
import moment from 'moment'
import { EnableMaskPhone } from 'src/reusable'

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().required('Email is required').email('Email must be a valid email'),
  dateOfBirth: yup.string().required('Date of birth is required').nullable(),
  address1: yup.string().required('Address line1 is required'),
  address2: yup.string(),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zip: yup.string().required('Zip is required').matches(ValidationPatterns.zip, 'Zip is not valid'),
  phone: yup
    .string()
    .required('Phone is required')
    .test('phoneNO', 'Please enter a valid Phone Number', (value) => PhoneNumberMaskValidation(value))
})

const PatientForm = ({ defaultValues, isEdit = false, partyRoleId = null, stateList = [] }) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    control,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema), mode: 'all' })
  var initMonth = new Date()
  initMonth.setMonth(initMonth.getMonth() - 3)
  // const watchAllFields = watch(); // when pass nothing as argument, you are watching everything
  const { dirtyFields } = useFormState({ control })
  const dispatch = useDispatch()
  let history = useHistory()
  const [stateOption, setStateOption] = React.useState(defaultValues.state)
  const [fromDate, handlefromDateChange] = useState(null)

  useEffect(() => {
    dispatch(loaderShow())
    reset(defaultValues)
    dispatch(loaderHide())
    setStateOption(getValues('state'))
    if (getValues('dateOfBirth') != '') {
      handlefromDateChange(getValues('dateOfBirth'))
    }
  }, [defaultValues])

  useEffect(() => {
    let val = getValues('dateOfBirth')
    if (val == '') {
      setValue('dateOfBirth', fromDate, { shouldValidate: false, shouldDirty: false })
    } else {
      setValue('dateOfBirth', fromDate, { shouldValidate: true, shouldDirty: true })
    }
  }, [fromDate])

  // form submit
  const patientFormSubmit = (data) => {
    if (isEdit) {
      updatePatientInfo()
    } else {
      addPatient(data)
    }
  }

  // save Patient
  const addPatient = async (data) => {
    const newPatient = {
      patient: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        dateOfBirth: moment(data.dateOfBirth).format('MM-DD-YYYY')
      },

      postalAddress: [
        {
          partyContactTypeId: PartyTypeEnum.primary,
          address1: data.address1,
          address2: data.address2,
          city: data.city,
          state: data.state,
          zip: data.zip
        }
      ],
      telecommunicationsNumber: {
        partyContactTypeId: PartyTypeEnum.telecommunicationsNumber,
        number: data.phone
      }
    }
    try {
      if (newPatient) {
        let result = await savePatient(newPatient)
        if (result.data.message === ServiceMsg.OK) {
          dispatch(notify(`Successfully added`, 'success'))
          history.push('/patients')
        }
      }
    } catch (error) {
      OnError(error, dispatch)
    }
  }

  const stateSelect = (event) => {
    setValue('state', event.target.innerText, { shouldValidate: true, shouldDirty: true })
  }

  // update Patient
  const updatePatientInfo = async () => {
    try {
      const updatePatient = {
        ...((dirtyFields.firstName || dirtyFields.lastName || dirtyFields.email || dirtyFields.dateOfBirth) && {
          patient: {
            firstName: getValues('firstName'),
            lastName: getValues('lastName'),
            email: getValues('email'),
            dateOfBirth: moment(getValues('dateOfBirth')).format('MM-DD-YYYY')
          }
        }),

        ...((dirtyFields.address1 ||
          dirtyFields.address2 ||
          dirtyFields.city ||
          dirtyFields.state ||
          dirtyFields.zip) && {
          postalAddress: [
            ...(dirtyFields.address1 || dirtyFields.address2 || dirtyFields.city || dirtyFields.state || dirtyFields.zip
              ? [
                  {
                    partyContactTypeId: PartyTypeEnum.primary,
                    address1: getValues('address1'),
                    address2: getValues('address2'),
                    city: getValues('city'),
                    state: getValues('state'),
                    zip: getValues('zip')
                  }
                ]
              : [])
          ]
        }),

        ...(dirtyFields.phone && {
          telecommunicationsNumber: {
            partyContactTypeId: PartyTypeEnum.telecommunicationsNumber,
            number: getValues('phone')
          }
        })
      }
      if (Object.keys(updatePatient).length == 0) {
        dispatch(notify(`No record to update`, 'error'))
      } else {
        try {
          const result = await updatePatientByPartyRoleId(partyRoleId, updatePatient)
          if (result.data.message == ServiceMsg.OK) {
            dispatch(notify(`Successfully updated`, 'success'))
            history.push('/patients')
          }
        } catch (error) {
          OnError(error, dispatch)
        }
      }
    } catch (error) {
      OnError(error, dispatch)
    }
  }

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit(patientFormSubmit)}>
        {/* hospital details */}
        <h5 className="font-weight-bold mt-1">Personal Information</h5>

        <div className="row mb-3">
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-text">
                {' '}
                First Name <span className="text-danger font-weight-bold ">*</span>{' '}
              </label>
              <input
                className="form-control-sm"
                type="text"
                {...register('firstName')}
                onInput={(e) => (e.target.value = FormatText(e.target.value))}
              />
              <div className="small text-danger  pb-2   ">{errors.firstName?.message}</div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-text">
                Address Line 1 <span className="text-danger font-weight-bold ">*</span>
              </label>
              <input
                type="text"
                className="form-control-sm"
                {...register('address1')}
                onInput={(e) => (e.target.value = FormatText(e.target.value))}
              />
              <div className="small text-danger  pb-2   ">{errors.address1?.message}</div>
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-text">
                {' '}
                Last Name <span className="text-danger font-weight-bold ">*</span>{' '}
              </label>
              <input
                className="form-control-sm"
                type="text"
                {...register('lastName')}
                onInput={(e) => (e.target.value = FormatText(e.target.value))}
              />
              <div className="small text-danger  pb-2   ">{errors.lastName?.message}</div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-text">Address Line 2 </label>
              <input
                type="text"
                className="form-control-sm"
                {...register('address2')}
                onInput={(e) => (e.target.value = FormatText(e.target.value))}
              />
              <div className="small text-danger  pb-2   ">{errors.address2?.message}</div>
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-text">
                {' '}
                DOB <span className="text-danger font-weight-bold ">*</span>{' '}
              </label>
              {/* <input className='form-control-sm' type='text' {...register('dateOfBirth')} /> */}
              <DateSelector
                className={'form-control-sm calendar-font'}
                selectedDate={fromDate}
                handleDateChange={handlefromDateChange}
                disableFuture={true}
              />
              <div className="small text-danger  pb-2   ">{errors.dateOfBirth?.message}</div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="row">
              <div className="form-group col-md-6">
                <label className="form-text">
                  City <span className="text-danger font-weight-bold ">*</span>
                </label>
                <input
                  type="text"
                  className="form-control-sm"
                  {...register('city')}
                  onInput={(e) => (e.target.value = FormatText(e.target.value))}
                />
                <div className="small text-danger  pb-2   ">{errors.city?.message}</div>
              </div>
              <div className="form-group col-md-6">
                <label className="form-text">
                  State <span className="text-danger font-weight-bold ">*</span>
                </label>
                <Autocomplete
                  id="combo-box-demo"
                  options={stateList}
                  inputValue={stateOption}
                  onInputChange={(event, newInputValue) => {
                    setStateOption(newInputValue)
                  }}
                  getOptionLabel={(option) => option.stateName}
                  onChange={stateSelect}
                  renderInput={(params) => (
                    <TextField {...params} {...register('state')} className="control-autocomplete" variant="outlined" />
                  )}
                />
                {/* <input type='text' className='form-control-sm' {...register('state')} /> */}
                <div className="small text-danger  pb-2   ">{errors.state?.message}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-text">
                Phone <span className="text-danger font-weight-bold ">*</span>
              </label>
              <InputMask
                {...register('phone')}
                mask={MaskFormat.phoneNumber}
                alwaysShowMask={EnableMaskPhone(isEdit, getValues('phone'))}
                className="form-control-sm"
              />
              {/* <input type='text' className='form-control-sm' {...register('phone')} /> */}
              <div className="small text-danger  pb-2   ">{errors.phone?.message}</div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-text">
                Zip <span className="text-danger font-weight-bold ">*</span>
              </label>
              <input type="text" className="form-control-sm" {...register('zip')} />
              <div className="small text-danger  pb-2   ">{errors.zip?.message}</div>
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-text">
                Email <span className="text-danger font-weight-bold ">*</span>
              </label>
              <input type="text" className="form-control-sm" {...register('email')} />
              <div className="small text-danger  pb-2   ">{errors.email?.message}</div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <button type="submit" className="btn btn-primary btn-lg float-right">
              {isEdit ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default PatientForm
