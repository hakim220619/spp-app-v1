import { useState, useEffect, useCallback } from 'react'
import { Card, Grid, CircularProgress, IconButton, Dialog, DialogTitle, Button, DialogContent } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useDispatch, useSelector } from 'react-redux'
import CustomChip from 'src/@core/components/mui/chip'
import { ListPaymentReportAdmin } from 'src/store/apps/laporan/index'
import { RootState, AppDispatch } from 'src/store'
import TableHeader from 'src/pages/ms/laporan/TableHeader'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import { UsersType } from 'src/types/apps/userTypes'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const statusObj: any = {
  Pending: { title: 'Proses Pembayaran', color: 'error' },
  Verified: { title: 'Belum Lunas', color: 'warning' },
  Paid: { title: 'Lunas', color: 'success' }
}
const typeObj: any = {
  BULANAN: { title: 'BULANAN', color: 'info' },
  BEBAS: { title: 'BEBAS', color: 'warning' }
}

interface CellType {
  row: UsersType
}

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

const RowOptions = ({ data }: { uid: any; data: any }) => {
  const [openPdfPreview, setOpenPdfPreview] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
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
      <IconButton size='small' color='error' onClick={createPdf}>
        <Icon icon='tabler:file-type-pdf' />
      </IconButton>

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
  { field: 'no', headerName: 'No', width: 70 },
  { field: 'unit_name', headerName: 'Unit', flex: 0.175, minWidth: 140 },
  { field: 'full_name', headerName: 'Nama Siswa', flex: 0.175, minWidth: 140 },
  { field: 'sp_name', headerName: 'Pembayaran', flex: 0.175, minWidth: 140 },
  {
    field: 'total_payment',
    headerName: 'Jumlah',
    flex: 0.175,
    minWidth: 140,
    renderCell: params => {
      const formattedAmount = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(params.value)

      return <span>{formattedAmount}</span> // Render the formatted amount
    }
  },
  {
    field: 'type',
    headerName: 'Tipe Pembayaran',
    flex: 0.175,
    minWidth: 120,
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
  { field: 'years', headerName: 'Tahun', flex: 0.175, minWidth: 120 },
  {
    field: 'status',
    headerName: 'Status',
    flex: 0.175,
    minWidth: 140,
    renderCell: (params: GridRenderCellParams) => {
      const status = statusObj[params.row.status]

      return (
        <CustomChip
          rounded
          size='small'
          skin='light'
          color={status?.color}
          label={status?.title}
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

interface TabelReportPaymentMonthProps {
  school_id: any
  unit_id: any
  user_id: any
  setting_payment_uid: any
  year: any
  type: string
  refresh: any
}

const TabelReportPaymentMonth = ({
  school_id,
  unit_id,
  user_id,
  year,
  type,
  setting_payment_uid,
  refresh
}: TabelReportPaymentMonthProps) => {
  const [value, setValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })
  const [loading, setLoading] = useState<boolean>(true)
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.ListPaymentReportAdmin)
  const [openPdfPreview, setOpenPdfPreview] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        await dispatch(
          ListPaymentReportAdmin({ school_id, unit_id, user_id, year, type, setting_payment_uid, q: value })
        )
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to fetch data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dispatch, setting_payment_uid, type, year, school_id, unit_id, user_id, value, refresh])

  const handleFilter = useCallback((val: string) => setValue(val), [])

  const createPdf = async () => {
    console.log('asd')

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
    <Card>
      <Grid item xl={12}>
        <TableHeader value={value} handleFilter={handleFilter} cetakPdfAll={createPdf} />
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
      </Grid>
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
    </Card>
  )
}

export default TabelReportPaymentMonth
