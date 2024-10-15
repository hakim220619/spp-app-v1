import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Dispatch } from 'redux'
import axiosConfig from 'src/configs/axiosConfig'

interface DataParams {
  q: string
  school_id: string
  user_id: string
  setting_payment_uid: string
}
interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch Users
export const ListPaymentDashboardByMonth = createAsyncThunk(
  'appListPayment/ListPaymentDashboardByMonth',
  async (params: DataParams) => {
    const storedToken = window.localStorage.getItem('token')
    const customConfig = {
      params,
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + storedToken
      }
    }
    const response = await axiosConfig.get('/dashboard-list-payment-month', customConfig)

    return response.data
  }
)

export const deleteSekolah = createAsyncThunk(
  'appListPayment/deleteSekolah',
  async (uid: number | string, { getState, dispatch }: Redux) => {
    const storedToken = window.localStorage.getItem('token')
    const dataAll = {
      data: uid
    }
    const customConfig = {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + storedToken
      }
    }
    const response = await axiosConfig.post('/delete-sekolah', dataAll, customConfig)
    const { school_id, user_id, setting_payment_uid, q } = getState().Sekolah

    // Memanggil ListPaymentDashboardByMonth untuk memperbarui data setelah penghapusan
    dispatch(ListPaymentDashboardByMonth({ school_id, user_id, setting_payment_uid, q }))

    return response.data
  }
)
export const appListPaymentSlice = createSlice({
  name: 'appListPayment',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(ListPaymentDashboardByMonth.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.allData
    })
  }
})

export default appListPaymentSlice.reducer
