import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Dispatch } from 'redux'
import axiosConfig from 'src/configs/axiosConfig'

interface DataParams {
  q: string
  school_id: string
  user_id: string
  id_payment: any
}
interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch Users
export const fetchDataPaymentPayByFree = createAsyncThunk(
  'appPembayaranPayByFree/fetchDataPaymentPayByFree',
  async (params: DataParams) => {
    const storedToken = window.localStorage.getItem('token')
    const customConfig = {
      params,
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + storedToken
      }
    }
    const response = await axiosConfig.get('/list-payment-pay-byFreeDetail', customConfig)

    return response.data
  }
)

export const deleteSekolah = createAsyncThunk(
  'appPembayaranPayByFree/deleteSekolah',
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
    const { school_id, id_payment, user_id, q } = getState().Sekolah

    // Memanggil fetchDataPaymentPayByFree untuk memperbarui data setelah penghapusan
    dispatch(fetchDataPaymentPayByFree({ school_id, id_payment, user_id, q }))

    return response.data
  }
)
export const appPembayaranPayByFreeSlice = createSlice({
  name: 'appPembayaranPayByFree',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchDataPaymentPayByFree.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.allData
    })
  }
})

export default appPembayaranPayByFreeSlice.reducer
