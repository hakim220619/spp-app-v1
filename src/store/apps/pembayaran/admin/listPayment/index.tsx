import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosConfig from 'src/configs/axiosConfig'

interface DataParams {
  q: string
  school_id: string
  user_id: string
  unit_id: string
}

// ** Fetch Users
export const ListPaymentDashboardByMonthAdmin = createAsyncThunk(
  'appListPaymentByAdmin/ListPaymentDashboardByMonthAdmin',
  async (params: DataParams) => {
    const storedToken = window.localStorage.getItem('token')
    const customConfig = {
      params,
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + storedToken
      }
    }
    const response = await axiosConfig.get('/dashboard-list-payment-month-byAdmin', customConfig)

    return response.data
  }
)

export const appListPaymentByAdminSlice = createSlice({
  name: 'appListPaymentByAdmin',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(ListPaymentDashboardByMonthAdmin.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.allData
    })
  }
})

export default appListPaymentByAdminSlice.reducer
