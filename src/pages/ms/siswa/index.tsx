import { useState, useEffect, useCallback } from 'react'
import {
  Card,
  Grid,
  Divider,
  MenuItem,
  IconButton,
  CardHeader,
  CardContent,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { SelectChangeEvent } from '@mui/material/Select'
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import CustomChip from 'src/@core/components/mui/chip'
import CustomTextField from 'src/@core/components/mui/text-field'
import { fetchDataSiswa, deleteUserSiswa } from 'src/store/apps/siswa/index'
import { RootState, AppDispatch } from 'src/store'
import { UsersType } from 'src/types/apps/userTypes'
import TableHeader from 'src/pages/ms/siswa/TableHeader'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import axiosConfig from '../../../configs/axiosConfig'
import urlImage from '../../../configs/url_image'

interface CellType {
  row: UsersType
}

const statusObj: any = {
  ON: { title: 'ON', color: 'primary' },
  OFF: { title: 'OFF', color: 'error' }
}

const RowOptions = ({ uid }: { uid: any }) => {
  const data = localStorage.getItem('userData') as string
  const getDataLocal = JSON.parse(data)
  const [open, setOpen] = useState(false)
  const [school_id] = useState<number>(getDataLocal.school_id)
  const [value] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false) // Tambahkan state isLoading
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const handleRowEditedClick = () => router.push('/ms/siswa/' + uid)

  const handleDelete = async () => {
    setIsLoading(true) // Set isLoading menjadi true saat mulai delete
    try {
      await dispatch(deleteUserSiswa(uid)).unwrap()
      await dispatch(fetchDataSiswa({ school_id, major: '', clas: '', unit_id: '', q: value }))
      toast.success('Successfully deleted!')
      setOpen(false)
    } catch (error) {
      console.error('Failed to delete user:', error)
      toast.error('Failed to delete user. Please try again.')
    } finally {
      setIsLoading(false) // Set isLoading menjadi false setelah proses selesai
    }
  }

  const handleClickOpenDelete = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <IconButton size='small' color='success' onClick={handleRowEditedClick}>
        <Icon icon='tabler:edit' />
      </IconButton>
      <IconButton size='small' color='error' onClick={handleClickOpenDelete}>
        <Icon icon='tabler:trash' />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{'Are you sure you want to delete this user?'}</DialogTitle>
        <DialogContent>
          <DialogContentText>You won't be able to revert this action!</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button color='error' type='submit' disabled={isLoading} onClick={handleDelete}>
            {isLoading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const columns: GridColDef[] = [
  { field: 'no', headerName: 'No', width: 70 },
  { field: 'unit_name', headerName: 'Unit', flex: 0.175, minWidth: 160 },
  { field: 'nisn', headerName: 'Nisn', flex: 0.175, minWidth: 130 },
  { field: 'full_name', headerName: 'Nama Lengkap', flex: 0.25, minWidth: 180 },
  { field: 'email', headerName: 'Email', flex: 0.25, minWidth: 200 },
  { field: 'phone', headerName: 'No. Wa', flex: 0.175, minWidth: 130 },
  { field: 'class_name', headerName: 'Kelas', flex: 0.175, minWidth: 140 },
  { field: 'major_name', headerName: 'Jurusan', flex: 0.175, minWidth: 140 },
  {
    field: 'date_of_birth',
    headerName: 'Tanggal Lahir',
    flex: 0.175,
    minWidth: 120,
    valueFormatter: params => {
      if (!params.value) return ''
      const date = new Date(params.value)
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()

      return `${day}/${month}/${year}`
    }
  },
  {
    field: 'image',
    headerName: 'Gambar',
    flex: 0.175,
    minWidth: 70,
    renderCell: params => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center', // Center horizontally
          alignItems: 'center', // Center vertically
          height: '100%' // Ensure the cell height is utilized
        }}
      >
        <img
          src={`${urlImage}uploads/school/siswa/${params.row.school_id}/${params.value}`}
          alt='image'
          style={{
            padding: 2,
            width: '40px', // Reduced width
            height: '40px', // Reduced height for a circular shape
            borderRadius: '50%', // Makes the image circular
            objectFit: 'cover' // Ensures the image covers the area without stretching
          }}
        />
      </div>
    )
  },

  {
    field: 'status',
    headerName: 'Status',
    flex: 0.175,
    minWidth: 80,
    renderCell: (params: GridRenderCellParams) => {
      const status = statusObj[params.row.status]

      return (
        <CustomChip
          rounded
          size='small'
          skin='light'
          color={status.color}
          label={status.title}
          sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
        />
      )
    }
  },
  {
    flex: 0,
    minWidth: 200,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }: CellType) => <RowOptions uid={row.uid} />
  }
]

interface Major {
  id: string
  major_name: string
  unit_id: string // Assuming each major has an associated unit_id
}
interface Clases {
  id: any
  class_name: string
}
interface Unit {
  id: string
  unit_name: string
}

const UserList = () => {
  const data = localStorage.getItem('userData') as string
  const getDataLocal = JSON.parse(data)
  const [school_id] = useState<number>(getDataLocal.school_id)
  const [clases, setClases] = useState<Clases[]>([])
  const [clas, setClas] = useState<string>('')
  const [filteredClasses, setFilteredClasses] = useState<Clases[]>([]) // New state for filtered classes
  const [value, setValue] = useState<string>('')
  const [major, setMajor] = useState<string>('')
  const [filteredMajors, setFilteredMajors] = useState<Major[]>([]) // New state for filtered majors
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [loading, setLoading] = useState<boolean>(true)
  const [majors, setMajors] = useState<any[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [unit, setUnit] = useState<string>('')

  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.siswa)
  const schoolId = getDataLocal.school_id

  useEffect(() => {
    const storedToken = window.localStorage.getItem('token')

    setLoading(true)
    dispatch(fetchDataSiswa({ school_id, major, clas, unit_id: unit, q: value })).finally(() => {
      setLoading(false)
    })

    const fetchMajors = async () => {
      try {
        const response = await axiosConfig.get(`/getMajors/?schoolId=${schoolId}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          }
        })
        setMajors(response.data)
      } catch (error) {
        console.error('Error fetching majors:', error)
      }
    }

    const fetchClases = async () => {
      try {
        const response = await axiosConfig.get(`/getClass/?schoolId=${schoolId}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          }
        })
        setClases(response.data)
      } catch (error) {
        console.error('Error fetching classes:', error)
      }
    }
    const fetchUnits = async () => {
      try {
        const response = await axiosConfig.get('/getUnit', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          }
        })
        const filteredUnits = response.data.filter((unit: any) => unit.school_id === schoolId)
        setUnits(filteredUnits)
      } catch (error) {
        console.error('Failed to fetch units:', error)
        toast.error('Failed to load units')
      }
    }

    fetchMajors()
    fetchClases()
    fetchUnits()
  }, [dispatch, major, clas, unit, schoolId, school_id, value])

  useEffect(() => {
    const selectedUnitId = unit // Mengambil unit yang dipilih dari state
    const newFilteredMajors = selectedUnitId
      ? majors.filter((major: Major) => major.unit_id === selectedUnitId)
      : majors
    const newFilteredClasses = selectedUnitId ? clases.filter((cls: any) => cls.unit_id === selectedUnitId) : clases

    setFilteredMajors(newFilteredMajors)
    setFilteredClasses(newFilteredClasses)

    // Reset major dan class jika unit berubah
    if (!selectedUnitId) {
      setMajor('')
      setClas('')
    }
  }, [unit, majors, clases])

  const handleFilter = useCallback((val: string) => setValue(val), [])
  const handleMajorChange = useCallback((e: SelectChangeEvent<unknown>) => setMajor(e.target.value as string), [])
  const handleClasChange = useCallback((e: SelectChangeEvent<unknown>) => setClas(e.target.value as string), [])

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}></Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Data Siswa' />
          <CardContent>
            <Grid container spacing={12}>
              <Grid item sm={4} xs={4}>
                <CustomTextField
                  select
                  fullWidth
                  value={unit}
                  label='Pilih Unit'
                  onChange={e => {
                    setUnit(e.target.value)
                    setMajor('') // Reset major ketika unit berubah
                    setClas('') // Reset class ketika unit berubah
                  }}
                >
                  <MenuItem value=''>Pilih Unit</MenuItem>
                  {units.map(data => (
                    <MenuItem key={data.id} value={data.id}>
                      {data.unit_name}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
              <Grid item sm={4} xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  label='Pilih Jurusan'
                  SelectProps={{
                    value: major,
                    displayEmpty: true,
                    onChange: handleMajorChange
                  }}
                >
                  <MenuItem value=''>Pilih Jurusan</MenuItem>
                  {filteredMajors.map(data => (
                    <MenuItem key={data.id} value={data.id}>
                      {data.major_name}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>

              <Grid item sm={4} xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  label='Pilih Kelas'
                  SelectProps={{
                    value: clas,
                    displayEmpty: true,
                    onChange: handleClasChange
                  }}
                >
                  <MenuItem value=''>Pilih Kelas</MenuItem>
                  {filteredClasses.map(data => (
                    <MenuItem key={data.id} value={data.id}>
                      {data.class_name}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
            </Grid>
          </CardContent>
          <Divider sx={{ m: '0 !important' }} />
          <TableHeader value={value} handleFilter={handleFilter} />
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
              <CircularProgress color='secondary' />
            </div>
          ) : (
            <DataGrid
              autoHeight
              rowHeight={50}
              rows={store.data}
              columns={columns}
              disableRowSelectionOnClick
              pageSizeOptions={[20, 40, 60, 100]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              sx={{
                '& .MuiDataGrid-cell': {
                  fontSize: '0.75rem'
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontSize: '0.75rem'
                }
              }}
            />
          )}
        </Card>
      </Grid>
    </Grid>
  )
}

export default UserList
