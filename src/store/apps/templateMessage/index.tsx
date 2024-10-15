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
export const fetchDataTemplateMessage = createAsyncThunk('appData/fetchDataTemplateMessage', async (params: DataParams) => {
  const storedToken = window.localStorage.getItem('token')
  const customConfig = {
    params,
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + storedToken
    }
  }
  const response = await axiosConfig.get('/list-templateMessage', customConfig)

  return response.data
})

export const deleteTemplateMessage = createAsyncThunk(
  'appData/deleteTemplateMessage',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const storedToken = window.localStorage.getItem('token')
    const dataAll = {
      data: id
    }
    const customConfig = {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + storedToken
      }
    }
    const response = await axiosConfig.post('/delete-templateMessage', dataAll, customConfig)
    const { school_id, q } = getState().Permission

    // Memanggil fetchDataTemplateMessage untuk memperbarui data setelah penghapusan
    dispatch(fetchDataTemplateMessage({ school_id, q }))

    return response.data
  }
)
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
    builder.addCase(fetchDataTemplateMessage.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.allData
    })
  }
})

export default appDataSlice.reducer
