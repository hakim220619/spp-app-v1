import { useState, useEffect, useCallback, ChangeEvent } from 'react'
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
  InputLabel
} from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import CustomChip from 'src/@core/components/mui/chip'
import {
  fetchDataSettingPembayaranDetail,
  deleteSettingPembayaranDetail
} from 'src/store/apps/setting/pembayaran/detail/index'
import { RootState, AppDispatch } from 'src/store'
import TableHeader from 'src/pages/ms/setting/pembayaran/TabelHeaderDetail'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import axiosConfig from '../../../../../configs/axiosConfig'
import CustomTextField from 'src/@core/components/mui/text-field'

const statusObj: any = {
  Pending: { title: 'Pending', color: 'info' }
}
const typeObj: any = {
  BULANAN: { title: 'BULANAN', color: 'success' },
  BEBAS: { title: 'BEBAS', color: 'warning' }
}

const RowOptions = ({
  uid,
  setting_payment_id,
  user_id,
  dataAll
}: {
  uid: any
  setting_payment_id: any
  user_id: any
  dataAll: any
}) => {
  const data = localStorage.getItem('userData') as string
  const getDataLocal = JSON.parse(data)
  const [open, setOpen] = useState(false)
  const [school_id] = useState<number>(getDataLocal.school_id)
  const [value] = useState<string>('')
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      // Memanggil action untuk menghapus detail pembayaran dengan argumen yang benar
      await dispatch(
        deleteSettingPembayaranDetail({
          uid,
          setting_payment_id,
          user_id
        })
      ).unwrap()

      // Mengambil ulang data setelah penghapusan berhasil
      await dispatch(
        fetchDataSettingPembayaranDetail({
          unit_id: '',
          school_id,
          clas: '',
          major: '',
          setting_payment_uid: setting_payment_id,
          q: value
        })
      )

      // Menampilkan notifikasi kesuksesan
      toast.success('Successfully deleted!')

      // Menutup modal atau dialog setelah penghapusan berhasil
      setOpen(false)
    } catch (error: any) {
      // Menangani dan menampilkan kesalahan jika penghapusan gagal
      console.error('Failed to delete payment setting:', error)

      // Jika error memiliki pesan, tampilkan di notifikasi
      const errorMessage = error?.message || 'Failed to delete. Please try again.'
      toast.error(errorMessage)

      // Menutup modal atau dialog meskipun ada error
      setOpen(false)
    } finally {
      setIsDeleting(false) // Set isDeleting kembali false setelah proses selesai
    }
  }

  const handleClickOpenDelete = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleRowEditedClick = () => {
    router.push(`/ms/setting/pembayaran/bebas/edit/${uid}`)
  }

  return (
    <>
      {dataAll.jml_paydetail === null && (
        <>
          <IconButton size='large' color='success' onClick={handleRowEditedClick}>
            <Icon icon='tabler:edit' />
          </IconButton>

          <IconButton size='small' color='error' onClick={handleClickOpenDelete}>
            <Icon icon='tabler:trash' />
          </IconButton>
        </>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{'Are you sure you want to delete this user?'}</DialogTitle>
        <DialogContent>
          <DialogContentText>You won't be able to revert this action!</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleDelete} color='error' disabled={isDeleting}>
            {isDeleting ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const columns: GridColDef[] = [
  { field: 'no', headerName: 'No', width: 70 },
  { field: 'unit_name', headerName: 'Nama Unit', flex: 0.175, minWidth: 140 },
  { field: 'full_name', headerName: 'Nama Siswa', flex: 0.175, minWidth: 140 },
  { field: 'class_name', headerName: 'Kelas', flex: 0.175, minWidth: 140 },
  { field: 'major_name', headerName: 'Jurusan', flex: 0.175, minWidth: 140 },
  {
    field: 'jumlah',
    headerName: 'Jumlah',
    flex: 0.175,
    minWidth: 140,
    valueFormatter: params => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(params.value)
    }
  },
  { field: 'years', headerName: 'Tahun', flex: 0.175, minWidth: 140 },
  {
    field: 'type',
    headerName: 'Tipe Pembayaran',
    flex: 0.175,
    minWidth: 150,
    renderCell: (params: GridRenderCellParams) => {
      const type = typeObj[params.row.type]

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
    field: 'status',
    headerName: 'Status',
    flex: 0.175,
    minWidth: 120,
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
    renderCell: ({ row }: any) => (
      <RowOptions uid={row.uid} setting_payment_id={row.setting_payment_uid} user_id={row.user_id} dataAll={row} />
    )
  }
]

const SettingPembayaran = () => {
  const router = useRouter()
  const { uid, unit_id } = router.query
  const data = localStorage.getItem('userData') as string
  const getDataLocal = JSON.parse(data)
  const [school_id] = useState<number>(getDataLocal.school_id)
  const [value, setValue] = useState<string>('')
  const [clas, setClas] = useState<string>('')
  const [classes, setClases] = useState<any[]>([])
  const [major, setMajor] = useState<string>('')
  const [majors, setMajors] = useState<any[]>([])
  const [setting_payment_uid] = useState<any>(uid)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [loading, setLoading] = useState<boolean>(true)
  const [units, setUnits] = useState<any[]>([])
  const [unit, setUnit] = useState<string>('')
  const [filteredMajors, setFilteredMajors] = useState<any[]>([])
  const [filteredClasses, setFilteredClasses] = useState<any[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.SettingPembayaranDetail)
  const userData = JSON.parse(localStorage.getItem('userData') as string)
  const storedToken = window.localStorage.getItem('token')
  const schoolId = userData.school_id
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        await dispatch(
          fetchDataSettingPembayaranDetail({ unit_id: unit, school_id, clas, major, setting_payment_uid, q: value })
        )
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to fetch data. Please try again.')
      } finally {
        setLoading(false)
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
    fetchUnits()
    fetchClases()
    fetchMajors()
    fetchData()
  }, [dispatch, unit, school_id, clas, major, setting_payment_uid, schoolId, storedToken, value])

  useEffect(() => {
    const selectedUnitId = unit
    const newFilteredMajors = selectedUnitId ? majors.filter((major: any) => major.unit_id == unit_id) : majors
    const newFilteredClasses = selectedUnitId ? classes.filter((cls: any) => cls.unit_id == unit_id) : classes

    setFilteredMajors(newFilteredMajors)
    setFilteredClasses(newFilteredClasses)
    setUnit(unit_id as string)
  }, [unit, unit_id, majors, classes, clas])
  const handleFilter = useCallback((val: string) => setValue(val), [])
  const handleClassChange = useCallback((e: ChangeEvent<{ value: unknown }>) => {
    setClas(e.target.value as any)
  }, [])
  const handleMajorChange = useCallback((e: ChangeEvent<{ value: unknown }>) => {
    setMajor(e.target.value as any)
  }, [])
  const handleNavigate = () => {
    router.push(`/ms/setting/pembayaran/bebas/kelas/${uid}?unit_id=${unit_id}`)
  }
  const handleNavigateSiswa = () => {
    router.push(`/ms/setting/pembayaran/bebas/siswa/${uid}?unit_id=${unit_id}`)
  }
  const handleNavigateBack = () => {
    router.push(`/ms/setting/pembayaran`)
  }
  const handleUnitChange = useCallback((e: ChangeEvent<{ value: unknown }>) => {
    setUnit(e.target.value as any)
  }, [])

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Pengaturan Pembayaran' />
          <CardContent>
            <Grid container spacing={3}>
              {/* Button for Pembayaran Baru Kelas */}
              <Grid item xs={12} sm={4}>
                <Button
                  variant='contained'
                  color='primary'
                  sx={{ '& svg': { mr: 2 }, width: '100%' }}
                  onClick={handleNavigate}
                >
                  <Icon fontSize='1.125rem' icon='tabler:plus' />
                  Pembayaran Baru Kelas
                </Button>
              </Grid>

              {/* Button for Buat Pembayaran Siswa */}
              <Grid item xs={12} sm={4}>
                <Button
                  variant='contained'
                  color='success'
                  sx={{ '& svg': { mr: 2 }, width: '100%' }}
                  onClick={handleNavigateSiswa}
                >
                  <Icon fontSize='1.125rem' icon='tabler:plus' />
                  Buat Pembayaran Siswa
                </Button>
              </Grid>

              {/* Button for Kembali */}
              <Grid item xs={12} sm={4}>
                <Button
                  variant='contained'
                  color='secondary'
                  sx={{ '& svg': { mr: 2 }, width: '100%' }}
                  onClick={handleNavigateBack}
                >
                  <Icon fontSize='1.125rem' icon='tabler:reload' />
                  Kembali
                </Button>
              </Grid>

              {/* Unit Selection */}
              <Grid item xs={12} sm={4}>
                <InputLabel>Unit</InputLabel>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue='Pilih Unit'
                  SelectProps={{
                    value: unit,
                    displayEmpty: true,
                    onChange: handleUnitChange as any,
                    disabled: true
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

              {/* Major Selection */}
              <Grid item xs={12} sm={4}>
                <InputLabel>Jurusan</InputLabel>
                <CustomTextField
                  select
                  fullWidth
                  value={major}
                  SelectProps={{
                    displayEmpty: true,
                    onChange: handleMajorChange as any
                  }}
                >
                  <MenuItem value=''>Pilih Jurusan</MenuItem>
                  {unit &&
                    filteredMajors.map(major => (
                      <MenuItem key={major.id} value={major.id}>
                        {major.major_name}
                      </MenuItem>
                    ))}
                </CustomTextField>
              </Grid>

              {/* Class Selection */}
              <Grid item xs={12} sm={4}>
                <InputLabel>Kelas</InputLabel>
                <CustomTextField
                  select
                  fullWidth
                  value={clas}
                  SelectProps={{
                    displayEmpty: true,
                    onChange: handleClassChange as any
                  }}
                >
                  <MenuItem value=''>Pilih Kelas</MenuItem>
                  {unit &&
                    filteredClasses.map(kelas => (
                      <MenuItem key={kelas.id} value={kelas.id}>
                        {kelas.class_name}
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
