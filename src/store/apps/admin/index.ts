import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Dispatch } from 'redux'
import axiosConfig from 'src/configs/axiosConfig'

interface DataParams {
  q: string
  status: string
  school: any
  role: string
}
interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch Users
export const fetchData = createAsyncThunk('appUsers/fetchData', async (params: DataParams) => {
  const storedToken = window.localStorage.getItem('token')
  const userData = JSON.parse(localStorage.getItem('userData') as string)

  const customConfig = {
    params,
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + storedToken
    }
  }
  const response = await axiosConfig.get('/list-admin', customConfig)

  // Cek apakah school_id ada di params, dan filter berdasarkan school_id
  const school_id = userData.school_id

  let filteredData

  if (school_id == 1) {
    // Jika school_id = 1, tampilkan semua data
    filteredData = response.data
  } else {
    // Filter data berdasarkan school_id
    filteredData = response.data.filter((item: any) => item.school_id === school_id && item.role !== 180)
  }

  return filteredData
})

export const deleteUser = createAsyncThunk(
  'appUsers/deleteUser',
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
    const response = await axiosConfig.post('/delete-admin', dataAll, customConfig)
    const { role, status, school, q } = getState().Admin

    // Memanggil fetchData untuk memperbarui data setelah penghapusan
    dispatch(fetchData({ role, status, school, q }))

    return response.data
  }
)
export const appUsersSlice = createSlice({
  name: 'appUsers',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.allData
    })
  }
})

export default appUsersSlice.reducer
