import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Dispatch } from 'redux'
import axiosConfig from 'src/configs/axiosConfig'

interface DataParams {
  school_id: number
  q: string
}
interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch Users
export const fetchDataBulan = createAsyncThunk('appBulan/fetchDataBulan', async (params: DataParams) => {
  const storedToken = window.localStorage.getItem('token')
  const customConfig = {
    params,
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + storedToken
    }
  }
  const response = await axiosConfig.get('/list-bulan', customConfig)

  return response.data
})

export const deleteBulan = createAsyncThunk(
  'appBulan/deleteBulan',
  async (uid: number | string, { getState, dispatch }: Redux) => {
    console.log(getState().jurusan)

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
    const response = await axiosConfig.post('/delete-bulan', dataAll, customConfig)
    const { school_id, q } = getState().Bulan

    // Memanggil fetchDataBulan untuk memperbarui data setelah penghapusan
    dispatch(fetchDataBulan({ school_id, q }))

    return response.data
  }
)
export const appBulanSlice = createSlice({
  name: 'appBulan',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchDataBulan.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.allData
    })
  }
})

export default appBulanSlice.reducer
