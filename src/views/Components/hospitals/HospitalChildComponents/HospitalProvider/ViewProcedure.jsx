import React, { useEffect, useMemo, useState } from 'react'
import { viewProcedureByProviderId } from 'src/service/providerService';
import DataTable from 'src/views/common/dataTable';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { loaderHide, loaderShow } from 'src/actions/loaderAction';
import OnError from 'src/_helpers/onerror';


const ViewProcedure = ({providerId}) => {

	const dispatch = useDispatch();
    const [viewProcedure, setViewProcedure] = useState([])

    useEffect(() => {
        

        const fetchData = async () => {
			try {
                dispatch(loaderShow());
                let result =await viewProcedureByProviderId(providerId);
                setViewProcedure(result.data.data);
                dispatch(loaderHide());
			} catch (error) {
				 OnError(error, dispatch);
			}
		};

		fetchData();
        
      
       
    }, [providerId])

    const subColumns = useMemo(
		() => [
			{
				Header: 'Procedure',
				accessor: 'description', // accessor is the "key" in the data				
			},
			{
				Header: 'Primary CPT',
				accessor: 'code', // accessor is the "key" in the data				
			},
			
			{
				Header: 'Optimized Facility Rate',
				accessor: 'facility', // accessor is the "key" in the data				
			},
			{
				Header: 'Optimized Physician Rate',
				accessor: 'physician', // accessor is the "key" in the data				
			},
			{
				Header: 'Anesthesia Rate',
				accessor: 'anesthesia', // accessor is the "key" in the data				
			},
          
            {
				Header: 'Pathology Rate',
				accessor: 'pathology', // accessor is the "key" in the data				
			},

           
            {
				Header: 'Clear Transactional Fee',
				accessor: 'clearFee', // accessor is the "key" in the data				
			},
            {
				Header: 'Package Price',
				accessor: 'total', // accessor is the "key" in the data				
			}






		],[]
		);
        
    return (
        <div>
            <DataTable columns={subColumns} data={viewProcedure}  />
            
        </div>
    )
}


ViewProcedure.propTypes = {
	providerId: PropTypes.string,
   
};


export default ViewProcedure;