import { useState, useEffect, useCallback } from 'react'
import {
  Card,
  Grid,
  Divider,
  IconButton,
  CardHeader,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CardContent,
  MenuItem,
  Backdrop
} from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import CustomChip from 'src/@core/components/mui/chip'
import { fetchDataSettingPembayaran, deleteSettingPembayaran } from 'src/store/apps/setting/pembayaran/index'
import { RootState, AppDispatch } from 'src/store'
import { UsersType } from 'src/types/apps/userTypes'
import TableHeader from 'src/pages/ms/setting/pembayaran/TableHeader'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import axiosConfig from 'src/configs/axiosConfig'

interface CellType {
  row: UsersType
}

const statusObj: any = {
  ON: { title: 'ON', color: 'primary' },
  OFF: { title: 'OFF', color: 'error' }
}

const typeObj: any = {
  BULANAN: { title: 'BULANAN', color: 'success' },
  BEBAS: { title: 'BEBAS', color: 'warning' }
}

const RowOptions = ({ uid, dataAll }: { uid: any; dataAll: any }) => {
  const data = localStorage.getItem('userData') as string
  const getDataLocal = JSON.parse(data)
  const [open, setOpen] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false) // Track loading state for delete action
  const [school_id] = useState<number>(getDataLocal.school_id)
  const [value] = useState<string>('')
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const handleRowEditedClick = () => {
    dataAll.sp_type === 'BULANAN'
      ? router.push('/ms/setting/pembayaran/bulanan/' + uid + '?unit_id=' + dataAll.unit_id)
      : router.push('/ms/setting/pembayaran/bebas/' + uid + '?unit_id=' + dataAll.unit_id)
  }

  const handleDelete = async () => {
    setLoadingDelete(true) // Activate loading state
    try {
      await dispatch(deleteSettingPembayaran(uid)).unwrap()
      await dispatch(fetchDataSettingPembayaran({ school_id, year: '', sp_type: '', unit_id: '', q: value }))
      toast.success('Successfully deleted!')
      setOpen(false)
    } catch (error) {
      toast.error('Failed to delete jurusan. Please try again.')
    } finally {
      setLoadingDelete(false) // Deactivate loading state
    }
  }

  const handleClickOpenDelete = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <IconButton size='large' color='success' onClick={handleRowEditedClick}>
        <Icon icon='tabler:settings' />
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
          <Button onClick={handleDelete} color='error' disabled={loadingDelete}>
            {loadingDelete ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Backdrop for loading overlay during delete action */}
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loadingDelete}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </>
  )
}

const columns: GridColDef[] = [
  { field: 'no', headerName: 'No', width: 70 },
  { field: 'unit_name', headerName: 'Nama Unit', flex: 0.175, minWidth: 140 },
  { field: 'sp_name', headerName: 'Nama Pembayaran', flex: 0.175, minWidth: 140 },
  { field: 'sp_desc', headerName: 'Deskripsi', flex: 0.175, minWidth: 140 },
  { field: 'years', headerName: 'Tahun', flex: 0.175, minWidth: 140 },
  {
    field: 'sp_type',
    headerName: 'Tipe Pembayaran',
    flex: 0.175,
    minWidth: 120,
    renderCell: (params: GridRenderCellParams) => {
      const type = typeObj[params.row.sp_type]

      return (
        <CustomChip
          rounded
          size='small'
          skin='light'
          color={type.color}
          label={type.title}
          sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
        />
      )
    }
  },
  {
    field: 'sp_status',
    headerName: 'Status',
    flex: 0.175,
    minWidth: 120,
    renderCell: (params: GridRenderCellParams) => {
      const status = statusObj[params.row.sp_status]

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
    renderCell: ({ row }: CellType) => <RowOptions uid={row.uid} dataAll={row} />
  }
]

const SettingPembayaran = () => {
  const data = localStorage.getItem('userData') as string
  const getDataLocal = JSON.parse(data)
  const [school_id] = useState<number>(getDataLocal.school_id)
  const [value, setValue] = useState<string>('')
  const [year, setYear] = useState<string>('')
  const [years, setYears] = useState<any[]>([])
  const [sp_type, setSpType] = useState<string>('')
  const [sp_types] = useState<any[]>(['BULANAN', 'BEBAS'])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [loading, setLoading] = useState<boolean>(true)
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.SettingPembayaran)
  const [units, setUnits] = useState<any[]>([])
  const [unit, setUnit] = useState<string>('')
  const storedToken = window.localStorage.getItem('token')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        await dispatch(fetchDataSettingPembayaran({ school_id, year, sp_type, unit_id: unit, q: value }))
      } catch (error) {
        toast.error('Failed to fetch data. Please try again.')
      } finally {
        setLoading(false)
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
        const filteredUnits = response.data.filter((unit: any) => unit.school_id === school_id)

        setUnits(filteredUnits)
      } catch (error) {
        console.error('Failed to fetch units:', error)
        toast.error('Failed to load units')
      }
    }
    fetchData()
    fetchUnits()
  }, [dispatch, school_id, year, sp_type, unit, storedToken, value])

  useEffect(() => {
    const currentYear = new Date().getFullYear()
    const years = []

    for (let i = currentYear - 2; i <= currentYear + 2; i++) {
      years.push(`${i}/${i + 1}`)
    }
    setYears(years)
  }, [])

  const handleFilter = useCallback((val: string) => setValue(val), [])
  const handleYearChange = useCallback((e: any) => setYear(e.target.value as string), [])
  const handleTypeChange = useCallback((e: any) => setSpType(e.target.value as string), [])
  const handleUnitChange = useCallback((e: any) => setUnit(e.target.value as string), [])

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Pengaturan Pembayaran' />
          <CardContent>
            <Grid container spacing={12}>
              <Grid item sm={4} xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue='Pilih Unit'
                  SelectProps={{
                    value: unit,
                    displayEmpty: true,
                    onChange: handleUnitChange // Perbaiki ini dengan benar mengikat handleUnitChange
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
                  defaultValue='Pilih Tahun'
                  SelectProps={{
                    value: year,
                    displayEmpty: true,
                    onChange: handleYearChange
                  }}
                >
                  <MenuItem value=''>Pilih Tahun</MenuItem>
                  {years.map(data => (
                    <MenuItem key={data} value={data}>
                      {data}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
              <Grid item sm={4} xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue='Pilih Tipe'
                  SelectProps={{
                    value: sp_type,
                    displayEmpty: true,
                    onChange: handleTypeChange
                  }}
                >
                  <MenuItem value=''>Pilih Tipe</MenuItem>
                  {sp_types.map(data => (
                    <MenuItem key={data} value={data}>
                      {data}
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

export default SettingPembayaran
