import React, { useEffect, useRef, useState } from 'react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { getSpecialityList } from 'src/service/providerService'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { deleteFeeSchedule, saveFeeSchedule, saveLogo } from 'src/service/hospitalsService'
import { useHistory } from 'react-router-dom'
import { ServiceMsg } from 'src/reusable/enum'
import { useDispatch } from 'react-redux'
import { notify } from 'reapop'
const schema = yup.object().shape({
  speciality: yup.string().required('Speciality is required'),
  file: yup.string().required('File is required'),
  logo: yup.string()
})

const AddFeeSchedules = ({ edit, partyRoleId, isFeeSchedule }) => {
  let history = useHistory()
  let btnRef = useRef();
  let btnLogoRef = useRef()
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    control,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema), mode: 'all' })
  const [modal, setModal] = useState(false);
  const [specialityData, setSpecialityData] = useState([]);
  const [submittedFile, setSubmittedFile] = useState([]);
  const [selectedFile, setSelectedFile] = useState();
  const [selectedLogo, setSelectedLogo] = useState();
  const [preview, setPreview] = useState(null)
  const [selectedSpeciality, setSelectedSpeciality] = useState();
  const [table, setTable] = useState([]);

  useEffect(() => {
    // @ts-ignore
    btnRef.current.setAttribute('disabled', 'disabled');
    // @ts-ignore
    btnLogoRef.current.setAttribute('disabled', 'disabled')

    const fetchData = async () => {
      setModal(isFeeSchedule)
      const specialityList = await getSpecialityList()
      setSpecialityData(specialityList.data.data)
    }
    fetchData()
  }, [isFeeSchedule])

  useEffect(() => {
    if (selectedSpeciality != undefined && selectedFile != undefined) {
      // @ts-ignore
      btnRef.current.removeAttribute('disabled')
    }
  }, [selectedFile, selectedSpeciality])

  const onClickDelete = async (event) => {
    let fileName = {
      fileName: event.fileName
    }
    const result = await deleteFeeSchedule(partyRoleId, event.speciality, fileName)
    if (result.data.message == 'OK') {
      let index = submittedFile.findIndex((x) => x.speciality === event.speciality)
      submittedFile.splice(index, 1)
      setSubmittedFile(submittedFile)
      let data = submittedFile.map(function (obj) {
        let selected = specialityData.filter((x) => x.ID == obj.speciality)
        return (
          <div key={obj} className="row ml-2 ">
            <div className="col-5">{selected[0].speciality}</div>
            <div className="col-5">{obj.file.name} </div>
            <div className="col-2">
              <FontAwesomeIcon onClick={() => onClickDelete(obj)} icon={faTimesCircle} className="pr-1 fa-2x" />
            </div>
          </div>
        )
      })

      setTable(data)
    }
  }

  const onChangeFile = (event) => {
    setSelectedFile(event.target.files[0])
  }

  const onChangeLogo = (event) => {
    setSelectedLogo(event.target.files[0]);
    // @ts-ignore
    btnLogoRef.current.removeAttribute('disabled')
    const objectUrl = URL.createObjectURL(event.target.files[0])
    setPreview(objectUrl)
  }

  const onChangeSpeciality = (event) => {
    setSelectedSpeciality(event.target.value)
  }

  const handleSubmission = async () => {
    const formData = new FormData()
    formData.append(selectedSpeciality, selectedFile)
    let result = await saveFeeSchedule(partyRoleId, formData)
    if (result.data.message == 'OK') {
      submittedFile.push({ speciality: selectedSpeciality, file: selectedFile })
      let data = submittedFile.map(function (obj) {
        let selected = specialityData.filter((x) => x.ID == obj.speciality)
        return (
          <div key={obj.speciality} className="row ml-2 ">
            <div className="col-5">{selected[0].speciality}</div>
            <div className="col-5">{obj.file.name} </div>
            <div className="col-2">
              <FontAwesomeIcon onClick={() => onClickDelete(obj)} icon={faTimesCircle} className="pr-1 fa-2x" />
            </div>
          </div>
        )
      })
      setSelectedFile(null)
      setSelectedSpeciality(null)
      // @ts-ignore
      btnRef.current.setAttribute('disabled', 'disabled')
      setValue('speciality', '')
      setValue('file', '')
      setTable(data)
    }

  }


  const onClickUpload = async () => {
    const formData = new FormData()
    formData.append('1', selectedLogo)
    let result = await saveLogo(partyRoleId, formData)
    if (result.data.message == ServiceMsg.OK) {
      dispatch(notify(`Successfully updated`, 'success'))
    }

  }

  const onClose = (event) => {
    setModal(false)
    history.push(`/hospitals`)
  }

  return (
    <CModal show={true} onClose={setModal} closeOnBackdrop={false} size="lg">
      <CModalHeader>
        <CModalTitle>Add Fee Schedules</CModalTitle>
      </CModalHeader>

      <CModalBody>
        <div className="row ml-2 ">
          <div className="col-5">
            <label className="form-text">
              {' '}
              Select Speciality <span className="text-danger font-weight-bold ">*</span>{' '}
            </label>

            <select name="" id="" className="form-control-sm" {...register('speciality')} onChange={onChangeSpeciality}>
              <option value="">Select</option>
              {specialityData.map((item, index) => (
                <option key={index} value={item.ID}>
                  {item.speciality}
                </option>
              ))}
            </select>
          </div>
          <div className="col-5">
            <label className="form-text">
              {' '}
              Select File <span className="text-danger font-weight-bold ">*</span>{' '}
            </label>
            <input type="file" name="file" className="form-control" {...register('file')} onChange={onChangeFile} />
          </div>

          <div className="col-2 mt-5">
            <button type="button" className="btn btn-primary" ref={btnRef} onClick={handleSubmission}>
              Submit
            </button>
          </div>
        </div>
        {table.length != 0 && (
          <div className="row ml-2 mt-3">
            <div className="col-5">
              <h5>Speciality</h5>
            </div>
            <div className="col-5">
              <h5>File Name</h5>
            </div>
          </div>
        )}
        {table}
      </CModalBody>


      <CModalTitle><div className='ml-3'>Add Hospital Logo</div></CModalTitle>

      <CModalBody>
        <div className="row ml-2 ">
          {selectedLogo && <div className="col-5">
            {selectedLogo && <img src={preview} width='200' />}
          </div>}
          <div className="col-5">
            <label className="form-text">
              {' '}
              Select File <span className="text-danger font-weight-bold ">*</span>{' '}
            </label>

            <input type="file" name="logo" className="form-control" {...register('logo')} onChange={onChangeLogo} />
          </div>

          <div className="col-2 mt-5">
            <button type="button" className="btn btn-primary" ref={btnLogoRef} onClick={onClickUpload}>
              Upload
            </button>
          </div>
        </div>
       
      </CModalBody>





      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default AddFeeSchedules
