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
export const fetchDataAffiliate = createAsyncThunk('appAffiliate/fetchDataAffiliate', async (params: DataParams) => {
  const storedToken = window.localStorage.getItem('token')
  const customConfig = {
    params,
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + storedToken
    }
  }
  const response = await axiosConfig.get('/list-affiliate', customConfig)

  return response.data
})

export const deleteAffiliate = createAsyncThunk(
  'appAffiliate/deleteAffiliate',
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
    const response = await axiosConfig.post('/delete-affiliate', dataAll, customConfig)
    const { q } = getState().Jurusan

    // Memanggil fetchDataAffiliate untuk memperbarui data setelah penghapusan
    dispatch(fetchDataAffiliate({ q }))

    return response.data
  }
)
export const appAffiliateSlice = createSlice({
  name: 'appAffiliate',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchDataAffiliate.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.allData
    })
  }
})

export default appAffiliateSlice.reducer
