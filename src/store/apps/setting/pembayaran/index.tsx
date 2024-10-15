import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Dispatch } from 'redux'
import axiosConfig from 'src/configs/axiosConfig'

interface DataParams {
  school_id: number
  q: string
  year: string
  sp_type: string
  unit_id: string
}
interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch Users
export const fetchDataSettingPembayaran = createAsyncThunk(
  'appSettingPembayaran/fetchDataSettingPembayaran',
  async (params: DataParams) => {
    const storedToken = window.localStorage.getItem('token')
    const customConfig = {
      params,
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + storedToken
      }
    }
    const response = await axiosConfig.get('/list-setting-pembayaran', customConfig)

    return response.data
  }
)

export const deleteSettingPembayaran = createAsyncThunk(
  'appSettingPembayaran/deleteSettingPembayaran',
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
    const response = await axiosConfig.post('/delete-setting-pembayaran', dataAll, customConfig)
    const { school_id, year, sp_type, unit_id, q } = getState().kelas

    // Memanggil fetchDataSettingPembayaran untuk memperbarui data setelah penghapusan
    dispatch(fetchDataSettingPembayaran({ school_id, year, sp_type, unit_id, q }))

    return response.data
  }
)
export const appSettingPembayaranSlice = createSlice({
  name: 'appSettingPembayaran',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchDataSettingPembayaran.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.allData
    })
  }
})

export default appSettingPembayaranSlice.reducer
