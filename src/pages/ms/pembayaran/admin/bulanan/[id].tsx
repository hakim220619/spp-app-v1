import { useState, useEffect, useCallback } from 'react'
import {
  Card,
  Grid,
  Divider,
  IconButton,
  CardHeader,
  CircularProgress,
  Button,
  InputLabel,
  TextField,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import CustomChip from 'src/@core/components/mui/chip'
import { fetchDataPaymentPayByMonth } from 'src/store/apps/pembayaran/bulanan/index'
import { RootState, AppDispatch } from 'src/store'
import { UsersType } from 'src/types/apps/userTypes'
import TableHeader from 'src/pages/ms/pembayaran/bulanan/TableHeader'
import { useRouter } from 'next/router'
import Typography from '@mui/material/Typography'
import axiosConfig from '../../../../../configs/axiosConfig'
import { Box } from '@mui/system'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

interface CellType {
  row: UsersType
}

const statusObj: any = {
  Pending: { title: 'Belum Bayar', color: 'error' },
  Paid: { title: 'Lunas', color: 'success' },
  Verified: { title: 'Proses Verifikasi', color: 'warning' }
}
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

const RowOptions = ({ data }: { uid: any; data: any }) => {
  const [openPdfPreview, setOpenPdfPreview] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  const handleRowRedirectClick = () => window.open(data.redirect_url)
  const formattedUpdatedAt = new Date(data.updated_at).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })

  const createPdf = async () => {
    const doc = new jsPDF()

    // Change this line to reference the local image directly
    const logoImageUrl = '/images/logo.png'

    try {
      // Fetch the image
      const response = await fetch(logoImageUrl)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const blob = await response.blob()
      const imgUrl = URL.createObjectURL(blob) // Create a URL for the blob

      const img = new Image()
      img.src = imgUrl

      img.onload = () => {
        document.body.appendChild(img) // Optional: add the image to the DOM for visual confirmation
        // Add the logo
        doc.addImage(img, 'PNG', 10, 10, 20, 20)

        // Add school name and address
        doc.setFontSize(14)
        doc.setFont('verdana', 'bold')
        const schoolNameWidth = doc.getTextWidth(data.school_name)
        const xSchoolNamePosition = (doc.internal.pageSize.getWidth() - schoolNameWidth) / 2

        doc.text(data.school_name, xSchoolNamePosition, 20)
        doc.setFontSize(10)
        doc.setFont('verdana', 'normal')

        const addressWidth = doc.getTextWidth(data.school_address)
        const xAddressPosition = (doc.internal.pageSize.getWidth() - addressWidth) / 2

        doc.text(data.school_address, xAddressPosition, 26)

        // Draw a horizontal line
        doc.line(10, 32, 200, 32)

        // Student Information
        const studentInfoY = 40 // Base Y position for student info
        const lineSpacing = 4 // Adjust this value to reduce spacing

        const infoLines = [
          { label: 'NIS', value: data.nisn },
          { label: 'Nama', value: data.full_name },
          { label: 'Kelas', value: data.class_name },
          { label: 'Jurusan', value: data.major_name }
        ]

        // Set positions for left and right columns
        const leftColumnX = 10 // X position for the left column
        const rightColumnX = 100 // X position for the right column
        const labelOffset = 30 // Offset for the label and value

        infoLines.forEach((info, index) => {
          const yPosition = studentInfoY + Math.floor(index / 2) * lineSpacing // Increment y for each pair

          if (index % 2 === 0) {
            // Even index: Left column for the first two entries
            doc.text(info.label, leftColumnX, yPosition)
            doc.text(`: ${info.value}`, leftColumnX + labelOffset, yPosition) // Adjust padding for alignment
          } else {
            // Odd index: Right column for the last two entries
            doc.text(info.label, rightColumnX, yPosition)
            doc.text(`: ${info.value}`, rightColumnX + labelOffset, yPosition) // Adjust padding for alignment
          }
        })

        // Draw another horizontal line below the student information
        doc.line(10, studentInfoY + 2 * lineSpacing, 200, studentInfoY + 2 * lineSpacing)

        // Payment details header
        doc.text('Dengan rincian pembayaran sebagai berikut:', 10, studentInfoY + infoLines.length * 3)

        const tableBody = [
          [
            data.id,
            data.sp_name + ' ' + data.years,
            data.month,
            data.status == 'Paid' ? 'Lunas' : 'Belum Lunas',
            formattedUpdatedAt,
            `Rp. ${data.total_payment.toLocaleString()}`
          ]
        ]

        // Set up the table
        doc.autoTable({
          startY: studentInfoY + infoLines.length * 3 + 4,
          margin: { left: 10 },
          head: [['ID', 'Pembayaran', 'Bulan', 'Status', 'Dibuat', 'Total Tagihan']],
          body: tableBody,
          theme: 'grid',
          headStyles: {
            fillColor: [50, 50, 50],
            textColor: [255, 255, 255],
            fontSize: 10,
            font: 'verdana',
            fontStyle: 'bold'
          },
          styles: {
            fontSize: 8,
            font: 'verdana'
          },
          alternateRowStyles: {
            fillColor: [230, 230, 230] // Change this to your desired secondary color
          },
          columnStyles: {
            0: { cellWidth: 20 }, // ID column width
            1: { cellWidth: 50 }, // Pembayaran column width
            2: { cellWidth: 20 }, // Status column width
            3: { cellWidth: 20 }, // Dibuat column width
            4: { cellWidth: 50 }, // Total Tagihan column width
            5: { cellWidth: 30 } // Total Tagihan column width
          }
        })

        // Create a Blob URL for the PDF
        const pdfOutput = doc.output('blob')
        const blobUrl = URL.createObjectURL(pdfOutput)
        setPdfUrl(blobUrl) // Set the URL for the dialog
        setOpenPdfPreview(true) // Open the dialog
      }

      img.onerror = () => {
        console.error('Failed to load image:', logoImageUrl)
      }
    } catch (error) {
      console.error('Error fetching image:', error)
    }
  }

  return (
    <>
      {data.status === 'Paid' && (
        <IconButton size='small' color='error' onClick={createPdf}>
          <Icon icon='tabler:file-type-pdf' />
        </IconButton>
      )}

      {data.status === 'Verified' && data.redirect_url && (
        <IconButton size='small' color='success' onClick={handleRowRedirectClick}>
          <Icon icon='tabler:link' />
        </IconButton>
      )}

      <Dialog
        open={openPdfPreview}
        onClose={() => {
          setOpenPdfPreview(false)
          setPdfUrl(null) // Clear the URL when closing
        }}
        maxWidth='lg'
        fullWidth
        PaperProps={{
          style: {
            minHeight: '600px'
          }
        }}
      >
        <DialogTitle style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Preview Payment Receipt
          <Button
            onClick={() => {
              setOpenPdfPreview(false)
              setPdfUrl(null) // Clear the URL when closing
            }}
            color='error'
            style={{ position: 'absolute', top: '8px', right: '8px' }} // Position the button in the top-right corner
          >
            Cancel
          </Button>
        </DialogTitle>
        <DialogContent>
          {pdfUrl && <iframe src={pdfUrl} width='100%' height='800px' title='PDF Preview' style={{ border: 'none' }} />}
        </DialogContent>
      </Dialog>
    </>
  )
}

const columns: GridColDef[] = [
  { field: 'month_number', headerName: 'No', width: 70 },
  { field: 'month', headerName: 'Bulan', flex: 0.175, minWidth: 140 },
  {
    field: 'total_payment',
    headerName: 'Jumlah',
    flex: 0.175,
    minWidth: 140,
    valueFormatter: ({ value }) =>
      new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
      }).format(value)
  },
  { field: 'years', headerName: 'Tahun', flex: 0.175, minWidth: 140 },
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
    renderCell: ({ row }: CellType) => <RowOptions uid={row.id} data={row} />
  }
]

const UserList: React.FC = () => {
  const data = localStorage.getItem('userData') as string
  const getDataLocal = JSON.parse(data)
  const [value, setValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 15 })
  const [loading, setLoading] = useState<boolean>(true)
  const [rowSelectionModel, setRowSelectionModel] = useState<number[]>([])
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [spName, setSpName] = useState<any>('')
  const [jumlah, setJumlah] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [selectedPaymentDetails, setSelectedPaymentDetails] = useState<any[]>([]) // New state for payment details
  const [isLoading, setIsLoading] = useState(false) // State for overlay loading
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.PembayaranByMonth)
  const router = useRouter()
  const [openPdfPreview, setOpenPdfPreview] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const { id, school_id, user_id } = router.query
  useEffect(() => {
    setLoading(true)
    dispatch(
      fetchDataPaymentPayByMonth({
        id_payment: id,
        school_id: school_id as any,
        user_id: user_id as any,
        q: value
      })
    ).finally(() => {
      setLoading(false)
    })
  }, [dispatch, value, id, school_id, user_id])

  useEffect(() => {
    if (store.data && store.data.length > 0) {
      const firstItem = store.data[0]
      setSpName(firstItem)
    }
  }, [store.data])

  const handleFilter = useCallback((val: string) => setValue(val), [])

  const onsubmit = async () => {
    setIsLoading(true)
    if (spName && jumlah) {
      try {
        const filteredRows = selectedRows.filter(row => row.status !== 'Verified' && row.status !== 'Paid')
        const token = localStorage.getItem('token')
        const response = await axiosConfig.post(
          '/create-payment-pending-byAdmin',
          {
            dataUsers: spName,
            dataPayment: filteredRows,
            admin_id: getDataLocal.id,
            total_affiliate: spName.affiliate * filteredRows.length
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}` // Add the token here
            }
          }
        )

        if (response.status == 200) {
          dispatch(
            fetchDataPaymentPayByMonth({
              id_payment: id,
              school_id: school_id as any,
              user_id: user_id as any,
              q: value
            })
          ).finally(() => {
            setLoading(false)
            handleClose(false)
            setJumlah('0')
            setIsLoading(false)
            setRowSelectionModel([])
          })
        }
        toast.success('Pembayaran Berhasil!')
      } catch (error) {
        setIsLoading(false)
        toast.error('Terjadi kesalahan saat memproses pembayaran.')
        console.error(error) // Log the error for debugging
      }
    } else {
      setIsLoading(false)
      toast.error('Data tidak lengkap. Pastikan semua informasi sudah diisi.')
    }
  }

  const handleClickOpen = () => {
    const filteredRows = selectedRows.filter(row => row.status !== 'Verified' && row.status !== 'Paid')
    setSelectedPaymentDetails(filteredRows)
    setOpen(true)
  }

  const handleClose = (confirm: any) => {
    setOpen(false)
    if (confirm) {
      onsubmit() // Call the payment submission function here
    }
  }

  const createPdf = async () => {
    const doc = new jsPDF()

    // Check if store.data has any items
    if (store.data && store.data.length > 0) {
      const pdfData: any = store.data[0] // Assuming you want to use the first item for the PDF

      const logoImageUrl = '/images/logo.png'

      const img = new Image()
      img.src = logoImageUrl

      img.onload = () => {
        // Add the logo
        doc.addImage(img, 'PNG', 10, 10, 20, 20)

        // Add school name and address
        doc.setFontSize(14)
        doc.setFont('verdana', 'arial', 'sans-serif')
        const schoolNameWidth = doc.getTextWidth(pdfData.school_name)
        const xSchoolNamePosition = (doc.internal.pageSize.getWidth() - schoolNameWidth) / 2

        doc.text(pdfData.school_name, xSchoolNamePosition, 20)
        doc.setFontSize(10)
        doc.setFont('verdana', 'arial', 'sans-serif')

        const addressWidth = doc.getTextWidth(pdfData.school_address)
        const xAddressPosition = (doc.internal.pageSize.getWidth() - addressWidth) / 2

        doc.text(pdfData.school_address, xAddressPosition, 26)

        // Draw a horizontal line
        doc.line(10, 32, 200, 32)

        // Student Information
        const studentInfoY = 40 // Base Y position for student info
        const lineSpacing = 4 // Adjust this value to reduce spacing

        const infoLines = [
          { label: 'NIS', value: pdfData.nisn },
          { label: 'Nama', value: pdfData.full_name },
          { label: 'Kelas', value: pdfData.class_name },
          { label: 'Jurusan', value: pdfData.major_name }
        ]

        // Set positions for left and right columns
        const leftColumnX = 10 // X position for the left column
        const rightColumnX = 100 // X position for the right column
        const labelOffset = 30 // Offset for the label and value

        infoLines.forEach((info, index) => {
          const yPosition = studentInfoY + Math.floor(index / 2) * lineSpacing // Increment y for each pair

          if (index % 2 === 0) {
            // Even index: Left column for the first two entries
            doc.text(info.label, leftColumnX, yPosition)
            doc.text(`: ${info.value}`, leftColumnX + labelOffset, yPosition) // Adjust padding for alignment
          } else {
            // Odd index: Right column for the last two entries
            doc.text(info.label, rightColumnX, yPosition)
            doc.text(`: ${info.value}`, rightColumnX + labelOffset, yPosition) // Adjust padding for alignment
          }
        })

        // Draw another horizontal line below the student information
        doc.line(10, studentInfoY + 2 * lineSpacing, 200, studentInfoY + 2 * lineSpacing)

        // Payment details header
        doc.text('Dengan rincian pembayaran sebagai berikut:', 10, studentInfoY + infoLines.length * 3)

        // Initialize tableBody array
        const tableBody: any = []

        let totalPayment = 0 // Initialize total payment

        // Populate tableBody using forEach
        store.data.forEach((item: any) => {
          const formattedUpdatedAt = new Date(item.updated_at).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          })

          tableBody.push([
            item.id,
            item.sp_name + ' ' + item.years,
            item.month,
            item.status === 'Paid' ? 'Lunas' : item.status === 'Verified' ? 'Verifikasi Pembayaran' : 'Belum Lunas',
            formattedUpdatedAt, // Assuming you have a created_at field
            `Rp. ${item.total_payment.toLocaleString()}`
          ])

          // Add to total payment
          totalPayment += item.total_payment
        })

        // Add the total row
        tableBody.push([
          { content: 'Total', colSpan: 5, styles: { halign: 'right', fontStyle: 'bold' } },
          `Rp. ${totalPayment.toLocaleString()}` // Display the total payment sum
        ])

        // Set up the table
        doc.autoTable({
          startY: studentInfoY + infoLines.length * 3 + 4,
          head: [['ID', 'Pembayaran', 'Bulan', 'Status', 'Created', 'Total Tagihan']],
          margin: { left: 10 },
          body: tableBody,
          theme: 'grid',
          headStyles: {
            fillColor: [50, 50, 50],
            textColor: [255, 255, 255],
            fontSize: 10,
            font: 'verdana',
            fontStyle: 'bold'
          },
          styles: {
            fontSize: 8,
            font: 'verdana'
          },
          alternateRowStyles: {
            fillColor: [230, 230, 230] // Change this to your desired secondary color
          },
          columnStyles: {
            0: { cellWidth: 20 }, // ID column width
            1: { cellWidth: 50 }, // Pembayaran column width
            2: { cellWidth: 20 }, // Status column width
            3: { cellWidth: 20 }, // Dibuat column width
            4: { cellWidth: 50 }, // Total Tagihan column width
            5: { cellWidth: 30 } // Total Tagihan column width
          }
        })

        // Create a Blob URL for the PDF
        const pdfOutput = doc.output('blob')
        const blobUrl = URL.createObjectURL(pdfOutput)
        setPdfUrl(blobUrl) // Set the URL for the dialog
        setOpenPdfPreview(true) // Open the dialog
      }

      img.onerror = () => {
        console.error('Failed to load image:', logoImageUrl)
      }
    } else {
      toast.error('Tidak ada data untuk membuat PDF.')
    }
  }

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12} md={9}>
        {' '}
        {/* Full width on mobile, 9/12 on medium screens and up */}
        <Card>
          <CardHeader
            title='Data Pembayaran'
            action={
              <Button
                variant='contained'
                color='error'
                onClick={() => {
                  createPdf()
                }}
                startIcon={<Icon icon='tabler:file-type-pdf' />} // Add the icon here
              >
                Cetak Semua Data
              </Button>
            }
          />
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
              checkboxSelection
              rowSelectionModel={rowSelectionModel}
              isRowSelectable={params => params.row.status === 'Pending'}
              onRowSelectionModelChange={newSelectionModel => {
                setRowSelectionModel(newSelectionModel as any)

                const filteredData = newSelectionModel.map(id => {
                  const selectedRow: any = store.data.find((row: any) => row.id === id)

                  return {
                    id: selectedRow.id,
                    total_payment: selectedRow.total_payment,
                    month: selectedRow.month,
                    years: selectedRow.years,
                    status: selectedRow.status
                  }
                })

                setSelectedRows(filteredData)

                const totalAmount = filteredData
                  .filter(row => row.status !== 'Verified' && row.status !== 'Paid')
                  .reduce((sum, row) => sum + row.total_payment, 0)

                const formattedTotalAmount = new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  maximumFractionDigits: 0
                }).format(totalAmount)

                setJumlah(formattedTotalAmount)
              }}
              sx={{
                '& .MuiDataGrid-checkboxInput': {
                  ml: 0
                },
                '& .Mui-checked.Mui-disabled': {
                  color: 'rgba(0, 0, 0, 0.6)'
                }
              }}
            />
          )}
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        {' '}
        {/* Full width on mobile, 3/12 on medium screens and up */}
        <Card>
          <CardContent>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                Pembayaran Details
              </Typography>
            </Grid>
            <Box m={1} display='inline' />
            <Grid item xs={12} sm={12}>
              <InputLabel id='form-layouts-separator-select-label'>Nama Pembayaran</InputLabel>
              <TextField
                fullWidth
                value={spName ? spName.sp_name : ''}
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>
            <Box m={1} display='inline' />
            <Grid item xs={12} sm={12}>
              <InputLabel id='form-layouts-separator-select-label'>Tipe</InputLabel>
              <TextField
                fullWidth
                value={spName ? spName.type : ''}
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>
            <Box m={1} display='inline' />
            <Grid item xs={12} sm={12}>
              <InputLabel id='form-layouts-separator-select-label'>Jumlah</InputLabel>
              <TextField
                fullWidth
                value={jumlah}
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>
            <Box m={2} display='inline' />
            <Grid container justifyContent='flex-start'>
              <Button
                variant='contained'
                color='primary'
                onClick={handleClickOpen}
                disabled={rowSelectionModel.length === 0}
              >
                Bayar
              </Button>

              <Box m={1} display='inline' />

              <Button
                variant='outlined'
                color='secondary'
                onClick={() => {
                  window.history.back()
                }}
              >
                Kembali
              </Button>
            </Grid>
          </CardContent>
        </Card>
        {/* Dialog Konfirmasi Pembayaran */}
        <Dialog open={open} onClose={() => handleClose(false)} maxWidth='sm' fullWidth>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='h6' sx={{ ml: 1 }}>
                Konfirmasi Pembayaran
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>Apakah Anda yakin ingin melanjutkan pembayaran ini?</DialogContentText>
            <Box mt={2}>
              {selectedPaymentDetails
                .filter(payment => payment.status === 'Pending')
                .map(payment => (
                  <Typography
                    key={payment.id}
                    sx={{
                      mb: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px',
                      borderRadius: '4px',
                      backgroundColor: theme => (theme.palette.mode === 'dark' ? '#424242' : '#f9f9f9'),
                      color: theme => (theme.palette.mode === 'dark' ? '#fff' : '#000'),
                      boxShadow: 1,
                      transition: 'background-color 0.3s, color 0.3s',
                      '&:hover': {
                        backgroundColor: theme => (theme.palette.mode === 'dark' ? '#616161' : '#e0e0e0')
                      }
                    }}
                  >
                    <span>
                      <strong>Bulan:</strong> {payment.month}
                    </span>
                    <span>
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0
                      }).format(payment.total_payment)}
                    </span>
                  </Typography>
                ))}

              <Typography
                sx={{
                  mt: 2,
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px',
                  borderRadius: '4px',
                  backgroundColor: theme => (theme.palette.mode === 'dark' ? '#424242' : '#f9f9f9'),
                  color: theme => (theme.palette.mode === 'dark' ? '#fff' : '#000'),
                  boxShadow: 1
                }}
              >
                <span>
                  <strong>Total Pembayaran:</strong>
                </span>
                <span>
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    maximumFractionDigits: 0
                  }).format(
                    selectedPaymentDetails
                      .filter(payment => payment.status === 'Pending')
                      .reduce((total, payment) => total + payment.total_payment, 0)
                  )}
                </span>
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleClose(false)} variant='contained' color='error'>
              Batal
            </Button>
            <Button
              onClick={() => {
                setIsLoading(true)
                onsubmit()
              }}
              variant='contained'
              color='primary'
              disabled={isLoading}
            >
              {isLoading ? (
                <Box display='flex' alignItems='center'>
                  <CircularProgress size={24} sx={{ marginRight: 1 }} />
                  <Typography variant='body2'>Loading...</Typography>
                </Box>
              ) : (
                'Ya, Lanjutkan'
              )}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openPdfPreview}
          onClose={() => {
            setOpenPdfPreview(false)
            setPdfUrl(null) // Clear the URL when closing
          }}
          maxWidth='lg'
          fullWidth
          PaperProps={{
            style: {
              minHeight: '600px'
            }
          }}
        >
          <DialogTitle style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Preview Payment Receipt
            <Button
              onClick={() => {
                setOpenPdfPreview(false)
                setPdfUrl(null) // Clear the URL when closing
              }}
              color='error'
              style={{ position: 'absolute', top: '8px', right: '8px' }} // Position the button in the top-right corner
            >
              Cancel
            </Button>
          </DialogTitle>
          <DialogContent>
            {pdfUrl && (
              <iframe src={pdfUrl} width='100%' height='800px' title='PDF Preview' style={{ border: 'none' }} />
            )}
          </DialogContent>
        </Dialog>
      </Grid>
    </Grid>
  )
}

export default UserList
