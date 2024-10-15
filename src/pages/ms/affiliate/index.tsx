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
  DialogTitle
} from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import CustomChip from 'src/@core/components/mui/chip'
import { fetchDataAffiliate, deleteAffiliate } from 'src/store/apps/affiliate/index'
import { RootState, AppDispatch } from 'src/store'
import { UsersType } from 'src/types/apps/userTypes'
import TableHeader from 'src/pages/ms/affiliate/TableHeader'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

interface CellType {
  row: UsersType
}

const statusObj: any = {
  ON: { title: 'ON', color: 'primary' },
  OFF: { title: 'OFF', color: 'error' }
}
const tipeObj: any = {
  SERVER: { title: 'SERVER', color: 'success' },
  PERSON: { title: 'PERSON', color: 'warning' }
}

const RowOptions = ({ uid }: { uid: any }) => {
  const [open, setOpen] = useState(false)
  const [value] = useState<string>('')
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const handleRowEditedClick = () => router.push('/ms/jurusan/' + uid)

  const handleDelete = async () => {
    try {
      await dispatch(deleteAffiliate(uid)).unwrap()
      await dispatch(fetchDataAffiliate({ q: value }))
      toast.success('Successfully deleted!')
      setOpen(false)
    } catch (error) {
      console.error('Failed to delete jurusan:', error)
      toast.error('Failed to delete jurusan. Please try again.')
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
          <Button onClick={handleDelete} color='error'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const columns: GridColDef[] = [
  { field: 'no', headerName: 'No', width: 70 },
  { field: 'full_name', headerName: 'Nama Lengkap', flex: 0.175, minWidth: 140 },
  { field: 'school_name', headerName: 'Sekolah', flex: 0.175, minWidth: 140 },
  { field: 'bank', headerName: 'Bank', flex: 0.175, minWidth: 120 },
  { field: 'account_name', headerName: 'Nama Rekening', flex: 0.175, minWidth: 140 },
  { field: 'account_number', headerName: 'Nomor Rekening', flex: 0.175, minWidth: 140 },
  {
    field: 'amount',
    headerName: 'Biaya Pertransaksi',
    flex: 0.175,
    minWidth: 180,
    valueFormatter: ({ value }) => (value ? `Rp ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}` : '0')
  },
  {
    field: 'debit',
    headerName: 'Debit',
    flex: 0.175,
    minWidth: 140,
    valueFormatter: ({ value }) => (value ? `Rp ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}` : '0')
  },
  {
    field: 'kredit',
    headerName: 'Kredit',
    flex: 0.175,
    minWidth: 140,
    valueFormatter: ({ value }) => (value ? `Rp ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}` : '0')
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
    field: 'type',
    headerName: 'Tipe',
    flex: 0.175,
    minWidth: 120,
    renderCell: (params: GridRenderCellParams) => {
      const type = tipeObj[params.row.type]

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
    flex: 0,
    minWidth: 200,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }: CellType) => <RowOptions uid={row.id} />
  }
]

const JurusanList = () => {
  const data = localStorage.getItem('userData') as string
  const getDataLocal = JSON.parse(data)
  const [school_id] = useState<number>(getDataLocal.school_id)
  const [value, setValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [loading, setLoading] = useState<boolean>(true)
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.Affiliate)

  useEffect(() => {
    setLoading(true)
    dispatch(fetchDataAffiliate({ q: value })).finally(() => {
      setLoading(false)
    })
  }, [dispatch, school_id, value])

  const handleFilter = useCallback((val: string) => setValue(val), [])

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}></Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Data Affiliate' />
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

export default JurusanList
