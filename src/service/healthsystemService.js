import axiosInstance  from "../_helpers/axiosinstance";


export const getHealthSystemList=(data) => axiosInstance.post(`healthSystem/list`,data);
export const getHealthSystemListCount= (data)=> axiosInstance.post(`healthSystem/count`,data);

export const addHealthSystemNew=(data)=>axiosInstance.post(`healthSystem`, data);


