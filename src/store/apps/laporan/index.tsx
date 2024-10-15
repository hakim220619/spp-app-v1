import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosConfig from 'src/configs/axiosConfig'

interface DataParams {
  school_id: any
  q: string
  user_id: any
  unit_id: any
  year: any
  type: string
  setting_payment_uid: any
}

// ** Fetch Users
export const ListPaymentReportAdmin = createAsyncThunk('appData/ListPaymentReportAdmin', async (params: DataParams) => {
  const storedToken = window.localStorage.getItem('token')
  const customConfig = {
    params,
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + storedToken
    }
  }
  const response = await axiosConfig.get('/list-report', customConfig)

  return response.data
})

export const appDataSlice = createSlice({
  name: 'appData',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(ListPaymentReportAdmin.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.allData
    })
  }
})

export default appDataSlice.reducer
