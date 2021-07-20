import axiosInstance  from "../_helpers/axiosinstance";


export const getHospitalsList=(data) => axiosInstance.post(`hospital/list`,data);
export const getHospitalsListCount= (data)=> axiosInstance.post(`hospital/count`,data);
export const saveHospital=(data)=>axiosInstance.post(`hospital`,data);
export const updateHospitalByPartyRoleId=(partyRoleId,data)=>axiosInstance.put(`hospital/${partyRoleId}`,data);
export const getHospitalByPartyRoleId=(partyRoleId)=>axiosInstance.get(`hospital/${partyRoleId}`);


export const getProviderListByHospitalId=(hospitalId,data) =>axiosInstance.post(`hospital/${hospitalId}/providers`,data);
export const getProviderListCountByHospitalId=(hospitalId,data) =>axiosInstance.post(`hospital/${hospitalId}/providers/count`,data);




