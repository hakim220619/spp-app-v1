import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Dispatch } from 'redux'
import axiosConfig from 'src/configs/axiosConfig'

interface DataParams {
  q: string
}
interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch Users
export const fetchDataAplikasi = createAsyncThunk('appAplikasi/fetchDataAplikasi', async (params: DataParams) => {
  const storedToken = window.localStorage.getItem('token')
  const customConfig = {
    params,
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + storedToken
    }
  }
  const response = await axiosConfig.get('/list-aplikasi', customConfig)

  return response.data
})

export const deleteAplikasi = createAsyncThunk(
  'appAplikasi/deleteAplikasi',
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
    const { q } = getState().Sekolah

    // Memanggil fetchDataAplikasi untuk memperbarui data setelah penghapusan
    dispatch(fetchDataAplikasi({ q }))

    return response.data
  }
)
export const appAplikasiSlice = createSlice({
  name: 'appAplikasi',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchDataAplikasi.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.allData
    })
  }
})

export default appAplikasiSlice.reducer
