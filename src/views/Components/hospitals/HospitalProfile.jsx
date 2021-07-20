/* eslint-disable eqeqeq */
import React, {useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import {useLocation} from 'react-router-dom';
import { loaderHide, loaderShow } from 'src/actions/loaderAction';
import { getHealthSystemList } from 'src/service/healthsystemService';
import {getHospitalByPartyRoleId} from 'src/service/hospitalsService';
import AdminTitle from 'src/views/common/adminTitle';
import HospitalForm from './HospitalForm';

const defalutFormValue = {
	hospitalName: '',
	healthSystemPartyRoleId: '',
	address1: '',
	address2: '',
	city: '',
	state: '',
	zip: '',
    phone:'',
	businessAddress1: '',
	businessAddress2: '',
	businessCity: '',
	businessState: '',
	businessZip: '',
	patientContactName: '',
	patientContactPhone: '',
	patientContactEmail: '',
	consolidatedInvoice: false,
	applySAASTax: false,
	taxId: '',
	invoiceReceiveMethod: '',
	accountNumber: '',
	routing: '',
	bankName: '',
	contactEmail: '',
	contactPhone: '',
	contactName: '',
};

const HospitalProfile = () => {
	const location = useLocation();
	const [partyRoleId, setPartyRoleId] = useState(null);
	const [editProfile, setEditProfile] = useState(false);

	const [hospitalData, setHospitalData] = useState(defalutFormValue);
	const [healthSystems, setHealthSystem] = useState([]);
	const dispatch = useDispatch();


	//if this a edit form get the data
	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const id = params.get('id');
		setPartyRoleId(id);
		id ? setEditProfile(true) : setEditProfile(false);

		const fetchData = async () => {
			try {
				dispatch(loaderShow());
				const res = await getHealthSystemList({});
				setHealthSystem(res.data.data);
			} catch (error) {	}
			if (id) {
				try {
					// const res = await getHealthSystemList({});
					// setHealthSystem(res.data.data);
					const result = await getHospitalByPartyRoleId(id);
					const formatedData = await updateFormFields(result.data.data);

					setHospitalData(formatedData);
				} catch (error) {}

			}
								dispatch(loaderHide());
	
			
		};
		fetchData();
	}, [location]);

  // updated form fields
	const updateFormFields = (data) => {
    
		const hospitalData = {
			hospitalName: data.hospital.name,
			healthSystemPartyRoleId: data.hospital.healthSystemPartyRoleId,
			address1: data.hospital.primaryAddress1,
			address2: data.hospital.primaryAddress2,
			city: data.hospital.primaryCity,
			state: data.hospital.primaryState,
			zip: data.hospital.primaryZip,
            phone:data.hospital.phoneNumber,
			businessAddress1: data.hospital.secondaryAddress1,
			businessAddress2: data.hospital.secondaryAddress2,
			businessCity: data.hospital.secondaryCity,
			businessState: data.hospital.secondaryState,
			businessZip: data.hospital.secondaryZip,
			patientContactName: data.primaryContact.name,
			patientContactPhone: data.primaryContact.phone,
			patientContactEmail: data.primaryContact.email,
			consolidatedInvoice: data.paymentInfo.consolidatedInvoice ==1 ?true:false,
			applySAASTax: data.paymentInfo.applySAASTax ==1 ?true:false,
			taxId: data.paymentInfo.taxId,
			invoiceReceiveMethod: data.paymentInfo.invoiceReceiveMethod,
			accountNumber: data.paymentInfo.accountNumber,
			routing: data.paymentInfo.routing,
			bankName: data.paymentInfo.bankName,
			contactEmail: data.paymentInfo.email,
			contactPhone: data.paymentInfo.phone,
			contactName: data.paymentInfo.name,
		};    
		return hospitalData;
    
	};

	return (
		<div className="card  cover-content pt-2 ">
			<AdminTitle title={editProfile ? 'Edit Hospital' : 'Add Hospital'} />

			<HospitalForm defaultValues={hospitalData} isEdit={editProfile} healthSystems={healthSystems} partyRoleId={partyRoleId} />
		</div>
	);
};

export default HospitalProfile;