import axiosInstance from '../_helpers/axiosinstance'

export const getProvidersList = (data) => axiosInstance.post(`provider/list`, data)
export const getProvidersListCount = (data) => axiosInstance.post(`provider/count`, data)
export const getProviderByPartyRoleId = (partyRoleId) => axiosInstance.get(`provider/${partyRoleId}`)
export const saveProvider = (data) => axiosInstance.post(`provider`, data)
export const updateProviderByPartyRoleId = (partyRoleId, data) => axiosInstance.put(`provider/${partyRoleId}`, data)
export const getSpecialityList = (data) => axiosInstance.get(`speciality`, data)
export const getProcedureByProvideId = (providerId, data) =>
  axiosInstance.post(`provider/${providerId}/procedurecodes`, data)
export const saveProcedureByProviderId = (providerId, data) =>
  axiosInstance.post(`provider/${providerId}/procedures`, data)
export const viewProcedureByProviderId = (providerId) => axiosInstance.get(`provider/${providerId}/procedures`)
export const getProviderFeeSchedule = (providerId) => axiosInstance.get(`provider/feeSchedule/${providerId}`)
export const deleteProviderFeeSchedule = (providerId, specialityId, fileName) =>
  axiosInstance.delete(`provider/feeSchedule/${providerId}/${specialityId}`, { data: { fileName: fileName } })
export const saveProviderFeeSchedule = (providerId, data) =>
  axiosInstance.post(`provider/saveProviderProcedure/${providerId}`, data)
export const getServiceProviders = (hospitalId, specialtyId) =>
  axiosInstance.get(`provider/serviceProviders/${hospitalId}/${specialtyId}`)
