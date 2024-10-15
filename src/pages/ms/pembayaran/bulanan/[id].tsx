import { useState, useEffect } from 'react'
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
  DialogTitle,
  Dialog,
  DialogContent
} from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import CustomChip from 'src/@core/components/mui/chip'
import { fetchDataPaymentPayByMonth } from 'src/store/apps/pembayaran/bulanan/index'
import { RootState, AppDispatch } from 'src/store'
import { UsersType } from 'src/types/apps/userTypes'
import { useRouter } from 'next/router'
import Typography from '@mui/material/Typography'
import axiosConfig from '../../../../configs/axiosConfig'
import { Box } from '@mui/system'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

interface CellType {
  row: UsersType
}

const statusObj: any = {
  Pending: { title: 'Pending', color: 'error' },
  Paid: { title: 'Paid', color: 'success' },
  Verified: { title: 'Verified', color: 'warning' }
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

    const logoImageUrl = '/images/logo.png'

    const img = new Image()
    img.src = logoImageUrl

    img.onload = () => {
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
      // Student Information
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
  const [value] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 15 })
  const [loading, setLoading] = useState<boolean>(true)
  const [rowSelectionModel, setRowSelectionModel] = useState<number[]>([])
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [spName, setSpName] = useState<any>('')
  const [jumlah, setJumlah] = useState<string>('')
  const [clientKey, setClientKey] = useState('')
  const [snapUrl, setSnapUrl] = useState('')
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.PembayaranByMonth)
  const router = useRouter()
  const { id } = router.query
  const [openPdfPreview, setOpenPdfPreview] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const storedToken = window.localStorage.getItem('token')

  useEffect(() => {
    setLoading(true)
    dispatch(
      fetchDataPaymentPayByMonth({
        id_payment: id,
        school_id: getDataLocal.school_id,
        user_id: getDataLocal.id,
        q: value
      })
    ).finally(() => {
      setLoading(false)
    })
  }, [dispatch, value, id, getDataLocal.school_id, getDataLocal.id])

  useEffect(() => {
    if (store.data && store.data.length > 0) {
      const firstItem = store.data[0]
      setSpName(firstItem)
    }
  }, [store.data])

  const [toastShown, setToastShown] = useState(false)
  const onsubmit = async () => {
    if (spName && jumlah) {
      try {
        const totalAmount = jumlah.replace(/[^\d]/g, '') // Hanya angka
        const filteredRows = selectedRows.filter(row => row.status !== 'Verified')

        const response = await fetch('/api/createMidtransTransaction', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            dataUsers: spName,
            dataPayment: filteredRows,
            total_amount: totalAmount,
            user_id: getDataLocal.id,
            school_id: getDataLocal.school_id
          })
        })

        const { transactionToken, orderId, transactionUrl } = await response.json() // Hapus transactionUrl

        if (transactionToken) {
          ;(window as any).snap.pay(transactionToken, {
            // autoRedirect: false, // Disable auto redirect for all statuses
            onSuccess: function () {
              if (!toastShown) {
                toast.success('Data pembayaran pending berhasil dikirim.')
                setToastShown(true)
              }
              try {
                // Mengirim data pending payment ke API /create-payment-pending menggunakan Axios
                axiosConfig
                  .post(
                    '/create-payment-pending',
                    {
                      dataUsers: spName,
                      dataPayment: filteredRows,
                      order_id: orderId,
                      redirect_url: transactionUrl,
                      total_amount: totalAmount
                    },
                    {
                      headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${storedToken}`
                      }
                    }
                  )
                  .then(response => {
                    if (response.status === 200) {
                      setJumlah('')
                      setLoading(true)
                      dispatch(
                        fetchDataPaymentPayByMonth({
                          id_payment: id,
                          school_id: getDataLocal.school_id,
                          user_id: getDataLocal.id,
                          q: value
                        })
                      ).finally(() => {
                        setLoading(false)
                      })
                    } else {
                      toast.error('Gagal mengirim data pembayaran pending.')
                    }
                  })
                  .catch(error => {
                    console.error('Error sending pending payment data:', error)
                    toast.error('Terjadi kesalahan saat mengirim data pembayaran pending.')
                  })
              } catch (error) {
                console.error('Error:', error)

                // toast.error('Terjadi kesalahan saat mengirim data pembayaran pending.')
              }
            },
            onPending: function () {
              if (!toastShown) {
                toast.success('Data pembayaran pending berhasil dikirim.')
                setToastShown(true)
              }
              try {
                // Mengirim data pending payment ke API /create-payment-pending menggunakan Axios
                axiosConfig
                  .post(
                    '/create-payment-pending',
                    {
                      dataUsers: spName,
                      dataPayment: filteredRows,
                      order_id: orderId,
                      redirect_url: transactionUrl,
                      total_amount: totalAmount
                    },
                    {
                      headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${storedToken}`
                      }
                    }
                  )
                  .then(response => {
                    if (response.status === 200) {
                      setJumlah('')
                      setLoading(true)
                      dispatch(
                        fetchDataPaymentPayByMonth({
                          id_payment: id,
                          school_id: getDataLocal.school_id,
                          user_id: getDataLocal.id,
                          q: value
                        })
                      ).finally(() => {
                        setLoading(false)
                      })
                    } else {
                      toast.error('Gagal mengirim data pembayaran pending.')
                    }
                  })
                  .catch(error => {
                    console.error('Error sending pending payment data:', error)
                    toast.error('Terjadi kesalahan saat mengirim data pembayaran pending.')
                  })
              } catch (error) {
                console.error('Error:', error)

                // toast.error('Terjadi kesalahan saat mengirim data pembayaran pending.')
              }

              // Logika lain untuk status pending
            },
            onError: function () {
              // Hapus event listener ketika terjadi error

              toast.error('Pembayaran gagal!')
            }
          })
        } else {
          toast.error('Gagal mendapatkan token pembayaran dari Midtrans.')
        }
      } catch (error) {
        toast.error('Terjadi kesalahan saat memproses pembayaran.')
      }
    } else {
      toast.error('Data tidak lengkap. Pastikan semua informasi sudah diisi.')
    }
  }

  useEffect(() => {
    async function fetchClientKey() {
      try {
        const response = await fetch(`/api/getsettingapk?school_id=${getDataLocal.school_id}`)
        const data = await response.json()
        if (response.ok) {
          setClientKey(data.data.claientKey)
          setSnapUrl(data.data.snapUrl)
        } else {
          console.error(data.message)
        }
      } catch (error) {
        console.error('Error fetching client key:', error)
      }
    }
    fetchClientKey()
  }, [getDataLocal.school_id])
  useEffect(() => {
    if (clientKey && snapUrl) {
      const script = document.createElement('script')
      script.src = snapUrl // Use dynamic snap URL from API
      script.setAttribute('data-client-key', clientKey)
      document.body.appendChild(script)

      return () => {
        document.body.removeChild(script)
      }
    }
  }, [clientKey, snapUrl])

  const cekTransaksiById = () => {
    setJumlah('')

    // Mengambil token yang disimpan (misalnya, dari local storage)
    const token = localStorage.getItem('token')

    // Memanggil API menggunakan axios dengan query parameter user_id
    axiosConfig
      .get('/cekTransaksiSuccesMidtransByUserIdByMonth', {
        headers: {
          Authorization: `Bearer ${token}` // Menambahkan token di header
        },
        params: {
          user_id: getDataLocal.id // Menambahkan user_id sebagai query parameter
        }
      })
      .then(response => {
        console.log(response)

        if (response.data.success == true) {
          setLoading(true)
          setJumlah('')
          dispatch(
            fetchDataPaymentPayByMonth({
              id_payment: id,
              school_id: getDataLocal.school_id,
              user_id: getDataLocal.id,
              q: value
            })
          ).finally(() => {
            setLoading(false)
            setJumlah('')
          })
        }
      })
      .catch(error => {
        // Menangani error jika terjadi
        console.error('Error fetching transaction:', error)
      })
  }
  const backtodashboard = () => {
    router.push('/ms/dashboard/siswa/')
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
        <Card>
          <CardHeader
            title='Data Pembayaran'
            action={
              <div style={{ display: 'flex', gap: '10px' }}>
                {' '}
                {/* Use a div or Box for proper layout */}
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
                <Button
                  variant='contained'
                  color='warning'
                  onClick={() => {
                    cekTransaksiById()
                  }}
                >
                  Cek Transaksi
                </Button>
              </div>
            }
          />

          <Divider sx={{ m: '0 !important' }} />

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
              isRowSelectable={params => params.row.status !== 'Verified' && params.row.status !== 'Paid'}
              onRowSelectionModelChange={(newSelectionModel: any) => {
                setRowSelectionModel(newSelectionModel)

                // Only include rows where status is not 'Verified' or 'Paid'
                const filteredData = newSelectionModel
                  .map((id: any) => store.data.find((row: any) => row.id === id))
                  .filter((selectedRow: any) => selectedRow.status !== 'Verified' && selectedRow.status !== 'Paid')
                  .map((selectedRow: any) => ({
                    id: selectedRow.id,
                    total_payment: selectedRow.total_payment,
                    month: selectedRow.month,
                    years: selectedRow.years,
                    status: selectedRow.status
                  }))

                setSelectedRows(filteredData)

                const totalAmount = filteredData.reduce((sum: any, row: any) => sum + row.total_payment, 0)

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
              <TextField fullWidth value={spName ? spName.sp_name : ''} InputProps={{ readOnly: true }} />
            </Grid>
            <Box m={1} display='inline' />
            <Grid item xs={12} sm={12}>
              <InputLabel id='form-layouts-separator-select-label'>Tipe</InputLabel>
              <TextField fullWidth value={spName ? spName.type : ''} InputProps={{ readOnly: true }} />
            </Grid>
            <Box m={1} display='inline' />
            <Grid item xs={12} sm={12}>
              <InputLabel id='form-layouts-separator-select-label'>Jumlah</InputLabel>
              <TextField fullWidth value={jumlah} InputProps={{ readOnly: true }} />
            </Grid>
            <Box m={2} display='inline' />

            <Grid container justifyContent={{ xs: 'center', md: 'left' }}>
              <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  onsubmit()
                }}
              >
                Bayar
              </Button>
              <Box m={1} display='inline' />
              <Button
                variant='outlined'
                color='secondary'
                onClick={() => {
                  backtodashboard()
                }}
              >
                Kembali
              </Button>
            </Grid>
          </CardContent>
        </Card>
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
