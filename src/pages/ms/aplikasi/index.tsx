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
  DialogTitle,
  CardContent,
  Typography
} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDataAplikasi } from 'src/store/apps/aplikasi/index'
import { RootState, AppDispatch } from 'src/store'
import { UsersType } from 'src/types/apps/userTypes'
import TableHeader from 'src/pages/ms/aplikasi/TableHeader'
import { useRouter } from 'next/router'

interface CellType {
  row: UsersType
}

const RowOptions = ({ uid, row }: { uid: any; row: any }) => {
  const [openDetail, setOpenDetail] = useState(false)
  const [selectedData, setSelectedData] = useState<any>(null)
  const router = useRouter()

  const handleRowEditedClick = () => router.push('/ms/aplikasi/' + uid)

  const handleRowDetailClick = (data: any) => {
    setSelectedData(data)
    setOpenDetail(true)
  }

  const handleCloseDetail = () => {
    setOpenDetail(false)
    setSelectedData(null)
  }

  return (
    <>
      <IconButton size='small' color='success' onClick={handleRowEditedClick}>
        <Icon icon='tabler:edit' />
      </IconButton>
      <IconButton size='small' color='primary' onClick={() => handleRowDetailClick(row)}>
        <Icon icon='tabler:info-circle' />
      </IconButton>

      {/* Detail Modal */}
      <Dialog open={openDetail} onClose={handleCloseDetail} fullWidth maxWidth='xl'>
        <DialogTitle>Detail Information</DialogTitle>
        <DialogContent>
          {selectedData && (
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant='subtitle1'>
                      <strong>School Name:</strong> {selectedData.school_name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant='subtitle1'>
                      <strong>Owner:</strong> {selectedData.owner}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='subtitle1'>
                      <strong>Address:</strong> {selectedData.address}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant='subtitle1'>
                      <strong>Phone:</strong> {selectedData.phone}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant='subtitle1'>
                      <strong>Title:</strong> {selectedData.title}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant='subtitle1'>
                      <strong>App Name:</strong> {selectedData.aplikasi_name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant='subtitle1'>
                      <strong>Logo:</strong> <img src={selectedData.logo} alt='Logo' width='50' height='50' />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant='subtitle1'>
                      <strong>Copyright:</strong> {selectedData.copy_right}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant='subtitle1'>
                      <strong>Version:</strong> {selectedData.versi}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant='subtitle1'>
                      <strong>WhatsApp Token:</strong> {selectedData.token_whatsapp}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant='subtitle1'>
                      <strong>Midtrans Create URL:</strong> {selectedData.urlCreateTransaksiMidtrans}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant='subtitle1'>
                      <strong>Midtrans Check URL:</strong> {selectedData.urlCekTransaksiMidtrans}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant='subtitle1'>
                      <strong>Client Key:</strong> {selectedData.clientKey}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant='subtitle1'>
                      <strong>Server Key:</strong> {selectedData.serverKey}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetail} color='primary'>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const columns: GridColDef[] = [
  { field: 'no', headerName: 'No', width: 70 },
  { field: 'school_name', headerName: 'School Name', flex: 0.175, minWidth: 270 },
  { field: 'aplikasi_name', headerName: 'App Name', flex: 0.25, minWidth: 280 },
  { field: 'owner', headerName: 'Owner', flex: 0.175, minWidth: 140 },
  { field: 'address', headerName: 'Address', flex: 0.25, minWidth: 180 },
  { field: 'phone', headerName: 'Phone', flex: 0.175, minWidth: 140 },
  { field: 'title', headerName: 'Title', flex: 0.175, minWidth: 140 },
  { field: 'logo', headerName: 'Logo', flex: 0.175, minWidth: 140 },
  {
    flex: 0,
    minWidth: 200,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }: CellType) => <RowOptions uid={row.id} row={row} />
  }
]

const AplikasiList = () => {
  const [value, setValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [loading, setLoading] = useState<boolean>(true)
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.Aplikasi)

  useEffect(() => {
    setLoading(true)
    dispatch(fetchDataAplikasi({ q: value })).finally(() => {
      setLoading(false)
    })
  }, [dispatch, value])

  const handleFilter = useCallback((val: string) => setValue(val), [])

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}></Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Data Aplikasi' />
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

export default AplikasiList
