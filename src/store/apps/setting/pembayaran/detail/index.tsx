import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosConfig from 'src/configs/axiosConfig'

interface DataParams {
  school_id: number
  q: string
  clas: string
  major: string
  setting_payment_uid: string
  unit_id: string
}
export const fetchDataSettingPembayaranDetail = createAsyncThunk(
  'appSettingPembayaranDetail/fetchDataSettingPembayaranDetail',
  async (params: DataParams) => {
    const storedToken = window.localStorage.getItem('token')
    const customConfig = {
      params,
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + storedToken
      }
    }
    const response = await axiosConfig.get('/list-setting-pembayaran-detail', customConfig)

    return response.data
  }
)

export const deleteSettingPembayaranDetail = createAsyncThunk(
  'appSettingPembayaranDetail/deleteSettingPembayaranDetail',
  async ({
    uid,
    setting_payment_id,
    user_id
  }: {
    uid: string
    setting_payment_id: any | string
    user_id: any | string
  }) => {
    const storedToken = window.localStorage.getItem('token')

    // Updated dataAll to include setting_payment_id and user_id
    const dataAll = {
      data: uid,
      setting_payment_id,
      user_id
    }

    const customConfig = {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + storedToken
      }
    }

    const response = await axiosConfig.post('/delete-setting-pembayaran-detail', dataAll, customConfig)

    return response.data
  }
)

export const appSettingPembayaranDetailSlice = createSlice({
  name: 'appSettingPembayaranDetail',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchDataSettingPembayaranDetail.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.allData
    })
  }
})

export default appSettingPembayaranDetailSlice.reducer
