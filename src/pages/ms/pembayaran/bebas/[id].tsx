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
  DialogContent
} from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import CustomChip from 'src/@core/components/mui/chip'
import { fetchDataPaymentPayByFree } from 'src/store/apps/pembayaran/bebas/index'
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
  const handleRowRedirectClick = () => window.open(data.redirect_url)
  const [openPdfPreview, setOpenPdfPreview] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  const formattedUpdatedAt = new Date(data.created_at).toLocaleString('id-ID', {
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
      doc.setFont('verdana', 'arial', 'sans-serif')

      const schoolNameWidth = doc.getTextWidth(data.school_name)
      const xSchoolNamePosition = (doc.internal.pageSize.getWidth() - schoolNameWidth) / 2

      doc.text(data.school_name, xSchoolNamePosition, 20)
      doc.setFontSize(10)
      doc.setFont('verdana', 'arial', 'sans-serif')

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
          data.status === 'Paid' ? 'Lunas' : data.status === 'Verified' ? 'Verifikasi Pembayaran' : 'Belum Lunas',
          formattedUpdatedAt,
          `Rp. ${(data.amount + data.affiliate).toLocaleString()}`
        ]
      ]

      // Set up the table
      doc.autoTable({
        startY: studentInfoY + infoLines.length * 4,
        margin: { left: 10 },
        head: [['ID', 'Pembayaran', 'Status', 'Dibuat', 'Total Tagihan']],
        body: tableBody,
        theme: 'grid',
        headStyles: {
          fillColor: [30, 30, 30],
          textColor: [255, 255, 255],
          fontSize: 10,
          font: 'verdana',
          fontStyle: 'arial'
        },
        styles: {
          fontSize: 8,
          font: 'verdana',
          fontStyle: 'arial'
        },
        alternateRowStyles: {
          fillColor: [230, 230, 230] // Change this to your desired secondary color
        },
        columnStyles: {
          0: { cellWidth: 20 }, // ID column width
          1: { cellWidth: 70 }, // Pembayaran column width
          2: { cellWidth: 20 }, // Status column width
          3: { cellWidth: 50 }, // Dibuat column width
          4: { cellWidth: 30 } // Total Tagihan column width
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
  {
    field: 'no',
    headerName: 'No',
    width: 70,
    renderCell: (params: GridRenderCellParams) => {
      return params.api.getRowIndexRelativeToVisibleRows(params.id) + 1 // Menghasilkan nomor urut otomatis dimulai dari 1
    },
    sortable: false // Menonaktifkan sorting untuk kolom ini
  },
  {
    field: 'full_name',
    headerName: 'Pembayaran ke',
    flex: 0.175,
    minWidth: 140,
    renderCell: (params: GridRenderCellParams) => {
      const sortedRowIds = params.api.getSortedRowIds() // Mendapatkan urutan ID setelah sorting
      const rowIndex = sortedRowIds.indexOf(params.id) + 1 // Mencari index dari ID dan increment

      return `Pembayaran ke ${rowIndex}`
    },
    sortable: false // Menonaktifkan sorting untuk kolom ini
  },
  {
    field: 'amount',
    headerName: 'Jumlah',
    flex: 0.175,
    minWidth: 140,
    valueGetter: ({ row }) => row.amount + row.affiliate, // Summing amount and affiliate
    valueFormatter: ({ value }) =>
      new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
      }).format(value)
  },
  { field: 'metode_pembayaran', headerName: 'Metode Pembayaran', flex: 0.175, minWidth: 140 },
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
    field: 'created_at',
    headerName: 'Dibuat',
    flex: 0.175,
    minWidth: 140,
    valueFormatter: params => {
      const date = new Date(params.value)

      // Format date
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0') // Month is 0-based, so add 1
      const year = date.getFullYear()

      // Format time
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')

      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`
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
  const [dataPayment, setDataPayment] = useState<any>('')
  const [jumlah, setJumlah] = useState<string>('')
  const [clientKey, setClientKey] = useState('')
  const [snapUrl, setSnapUrl] = useState('')
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.PembayaranByFree)
  const router = useRouter()
  const { id } = router.query
  const [openPdfPreview, setOpenPdfPreview] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const storedToken = window.localStorage.getItem('token')
  const fetchPaymentDetails = useCallback(
    async (id: string) => {
      try {
        const storedToken = window.localStorage.getItem('token')

        // Get additional data from local storage or another function as necessary
        const school_id = getDataLocal.school_id
        const user_id = getDataLocal.id

        // Send all parameters as query parameters
        const response = await axiosConfig.get('/list-payment-pay-byFree', {
          params: {
            uid: id,
            id_payment: id,
            school_id,
            user_id
          },
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          }
        })
        setDataPayment(response.data)
      } catch (error) {
        console.error('Error fetching payment details:', error)
      }
    },
    [getDataLocal.school_id, getDataLocal.id] // You should include these dependencies instead of `id`
  )

  useEffect(() => {
    setLoading(true)
    dispatch(
      fetchDataPaymentPayByFree({
        id_payment: id,
        school_id: getDataLocal.school_id,
        user_id: getDataLocal.id,
        q: value
      })
    ).finally(() => {
      setLoading(false)
    })

    fetchPaymentDetails(id as any)
  }, [dispatch, value, id, getDataLocal.school_id, getDataLocal.id, fetchPaymentDetails])

  const [toastShown, setToastShown] = useState(false)
  const onsubmit = async () => {
    if (dataPayment && jumlah) {
      try {
        const totalAmount = parseInt(jumlah.replace(/[^\d]/g, ''), 10) || 0

        // Ensure affiliate is an integer (it should already be, but just in case)
        const affiliateAmount = dataPayment.affiliate || 0
        const total_amount = totalAmount + affiliateAmount
        const response = await fetch('/api/createMidtransTransactionFree', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            dataPayment: dataPayment,
            total_amount: total_amount,
            user_id: dataPayment.user_id,
            school_id: getDataLocal.school_id
          })
        })
        const { transactionToken, orderId, transactionUrl } = await response.json()
        console.log(transactionUrl)

        if (transactionToken) {
          ;(window as any).snap.pay(transactionToken, {
            // autoRedirect: false, // Disable auto redirect for all statuses
            onSuccess: function () {
              toast.success('Pembayaran berhasil!')
              if (!toastShown) {
                toast.success('Data pembayaran pending berhasil dikirim.')
                setToastShown(true) // Set state to true to prevent multiple toasts
              }

              try {
                // Mengirim data pending payment ke API /create-payment-pending menggunakan Axios
                axiosConfig
                  .post(
                    '/create-payment-pending-Free',
                    {
                      dataPayment: dataPayment,
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
                      setLoading(true)
                      dispatch(
                        fetchDataPaymentPayByFree({
                          id_payment: id,
                          school_id: getDataLocal.school_id,
                          user_id: getDataLocal.id,
                          q: value
                        })
                      ).finally(() => {
                        setLoading(false)
                        setJumlah('0')
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
                setToastShown(true) // Set state to true to prevent multiple toasts
              }

              try {
                // Mengirim data pending payment ke API /create-payment-pending menggunakan Axios
                axiosConfig
                  .post(
                    '/create-payment-pending-Free',
                    {
                      dataPayment: dataPayment,
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
                      setLoading(true)
                      dispatch(
                        fetchDataPaymentPayByFree({
                          id_payment: id,
                          school_id: getDataLocal.school_id,
                          user_id: getDataLocal.id,
                          q: value
                        })
                      ).finally(() => {
                        setLoading(false)
                        setJumlah('0')
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
            onError: function () {
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
        console.log(response.ok)

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

  // useEffect(() => {
  //   const script = document.createElement('script')
  //   script.src = `${process.env.NEXT_PUBLIC_MIDTRANS_URL_PROD}` // Ubah ke URL Production
  //   script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY_PROD!)
  //   document.body.appendChild(script)
  // }, [])
  const formatRupiah = (value: any) => {
    if (!value) return ''

    return 'Rp ' + Number(value).toLocaleString('id-ID', { minimumFractionDigits: 0 })
  }
  const handleChange = (e: any) => {
    const value = e.target.value.replace(/[^0-9]/g, '') // Hanya angka
    setJumlah(value)
  }

  const cekTransaksiById = () => {
    // Mengambil token yang disimpan (misalnya, dari local storage)
    const token = localStorage.getItem('token')

    // Memanggil API menggunakan axios dengan query parameter user_id
    axiosConfig
      .get('/cekTransaksiSuccesMidtransByUserIdFree', {
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
          dispatch(
            fetchDataPaymentPayByFree({
              id_payment: id,
              school_id: getDataLocal.school_id,
              user_id: getDataLocal.id,
              q: value
            })
          ).finally(() => {
            setLoading(false)
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
          const formattedUpdatedAt = new Date(item.created_at).toLocaleString('id-ID', {
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
            item.status === 'Paid' ? 'Lunas' : item.status === 'Verified' ? 'Verifikasi Pembayaran' : 'Belum Lunas',
            formattedUpdatedAt, // Assuming you have a created_at field
            `Rp. ${(item.amount + item.affiliate).toLocaleString()}`
          ])

          // Add to total payment
          totalPayment += item.amount + item.affiliate
        })

        // Add the total row
        tableBody.push([
          { content: 'Total', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold' } },
          `Rp. ${totalPayment.toLocaleString()}` // Display the total payment sum
        ])

        // Set up the table
        doc.autoTable({
          startY: studentInfoY + infoLines.length * 3 + 4,
          head: [['ID', 'Pembayaran', 'Status', 'Dibuat', 'Total Tagihan']],
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
            2: { cellWidth: 30 }, // Dibuat column width
            3: { cellWidth: 60 }, // Total Tagihan column width
            4: { cellWidth: 30 } // Total Tagihan column width
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
    <Grid container spacing={2}>
      {/* Main Content */}
      <Grid item xs={12} md={9}>
        {' '}
        {/* Full width on xs (mobile), 9 columns on md (tablet and desktop) */}
        <Card>
          <CardHeader
            title='Data Pembayaran'
            action={
              <div style={{ display: 'flex', gap: '10px' }}>
                {' '}
                {/* Wrap the buttons in a container */}
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
            />
          )}
        </Card>
      </Grid>

      {/* Sidebar Content */}
      <Grid item xs={12} md={3}>
        {' '}
        {/* Full width on xs, 3 columns on md */}
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  Pembayaran Details
                </Typography>
              </Grid>
              <Box m={1} display='inline' />
              <Grid item xs={12}>
                <InputLabel id='form-layouts-separator-select-label'>Nama Pembayaran</InputLabel>
                <TextField
                  fullWidth
                  value={dataPayment ? dataPayment.sp_name : ''}
                  InputProps={{
                    readOnly: true
                  }}
                />
              </Grid>
              <Box m={1} display='inline' />
              <Grid item xs={12}>
                <InputLabel id='form-layouts-separator-select-label'>Tipe</InputLabel>
                <TextField
                  fullWidth
                  value={dataPayment ? dataPayment.type : ''}
                  InputProps={{
                    readOnly: true
                  }}
                />
              </Grid>
              <Box m={1} display='inline' />
              <Grid item xs={12}>
                <InputLabel id='form-layouts-separator-select-label'>Total Pembayaran</InputLabel>
                <TextField
                  fullWidth
                  value={formatRupiah(
                    dataPayment.amount - store.data.reduce((acc: number, curr: any) => acc + curr.amount, 0)
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel id='form-layouts-separator-select-label'>Jumlah</InputLabel>
                <TextField fullWidth value={formatRupiah(jumlah)} onChange={handleChange} />
              </Grid>
              <Box m={2} display='inline' />
              <Grid container justifyContent='left'>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => {
                    onsubmit()
                  }}
                  disabled={
                    parseInt(jumlah.replace(/[^\d]/g, ''), 10) >
                    dataPayment.amount - store.data.reduce((acc: number, curr: any) => acc + curr.amount, 0)
                  }
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
