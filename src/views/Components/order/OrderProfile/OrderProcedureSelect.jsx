/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import Select from 'react-select'
import { getCPTCodesByHospital } from 'src/service/hospitalsService'
import DataTable from 'src/views/common/dataTable'
import OnError from 'src/_helpers/onerror'
import PropTypes from 'prop-types'

const OrderProcedureSelect = ({ handleCPTChange }) => {
  const location = useLocation()
  const dispatch = useDispatch()

  const [selectedCPT, setSelectedCPT] = useState([])
  const [cptList, setCptList] = useState([])

  const [changedTable, setchangedTable] = useState([])

  const handleChange = (newValue: any, actionMeta: any) => {
    // TO add the data to list which is selected .
    if (actionMeta.action == 'select-option') {
      cptList.concat(actionMeta.option)
      let newId = `${actionMeta.option.Id} - ${Math.floor(Math.random() * 100)} `
      let newCptList = [...cptList, { ...actionMeta.option, Id: newId }]
      setCptList(newCptList)
    }

    let updateData = newValue.map((x) => {
      let previousSelect = selectedCPT.find((y) => y.Id == x.Id)
      if (previousSelect) {
        return previousSelect
      } else {
        return x
      }
    })
    // setting default  provoider first value
    let defalultProviderData = updateData.map((x) => {
      return {
        ...x,
        ...(x.providers.length > 0 && {
          providerPartyRoleID: x.providers[0]?.partyRoleId
        })
      }
    })

    setSelectedCPT(defalultProviderData)
    handleCPTChange(defalultProviderData)
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const hospitalId = params.get('hospitalId')

    const fetchData = async () => {
      try {
        let result = await getCPTCodesByHospital(hospitalId, {})

        setCptList(result.data.data)
      } catch (error) {
        OnError(error, dispatch)
      }
    }
    fetchData()
  }, [location])

  useEffect(() => {
    // console.log(changedTable);
    setSelectedCPT(changedTable)
    handleCPTChange(changedTable)
  }, [changedTable])

  const providerSelect = ({ row, data }) => {
    const handleProviderChange = (e) => {
      let updateData = data.map((x) => (x.Id === row.original.Id ? { ...x, providerPartyRoleID: e.target.value } : x))
      setchangedTable(updateData)
    }

    return (
      <>
        <select name="" id="" className="form-control-sm" onChange={handleProviderChange}>
          {row.original.providers.map((item, index) => (
            <option key={index} value={item.partyRoleId}>
              {item.firstName} {item.lastName}
            </option>
          ))}
        </select>
      </>
    )
  }

  //SETTING COLUMNS NAMES
  const columns = useMemo(
    () => [
      {
        Header: 'CPT Code',
        accessor: 'code', // accessor is the "key" in the data
        disableSortBy: true,
        Cell: ({ value }) => <h6 className="font-weight-normal text-black ml-4"> {value} </h6>
      },
      {
        Header: 'CPT Name',
        accessor: 'description', // accessor is the "key" in the data
        disableSortBy: true
      },
      {
        Header: 'Providers',
        accessor: '', // accessor is the "key" in the data
        disableSortBy: true,
        Cell: providerSelect
      }
    ],
    []
  )

  return (
    <div className="row">
      <div className="col-md-10 mb-3">
        <label className="mr-4 float-left pt-2">CPT Code</label>
        <Select
          options={cptList}
          closeMenuOnSelect={false}
          onChange={handleChange}
          isMulti
          // multiple
          // hideSelectedOptions={false}
          getOptionLabel={(option) => ` ${option.code} - ${option.description}`}
          getOptionValue={(option) => `${option.Id}`}
          // getOptionValue={(option) => `${option.indexId}-${option.Id}`}
          // controlShouldRenderValue={true}
        />
      </div>
      <div className="col-md-12">
        <DataTable columns={columns} data={selectedCPT} />
      </div>
    </div>
  )
}

OrderProcedureSelect.propTypes = {
  handleCPTChange: PropTypes.func
}

export default OrderProcedureSelect
