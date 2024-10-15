// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import Link from 'next/link'
import { useState } from 'react'
import axiosConfig from 'src/configs/axiosConfig'

interface TableHeaderProps {
  value: string
  handleFilter: (val: string) => void
}

const TableHeader = (props: TableHeaderProps) => {
  const { handleFilter, value } = props

  // State for dialog
  const [openDialog, setOpenDialog] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      setFile(files[0])
    }
  }
  const userData = JSON.parse(localStorage.getItem('userData') as string)
  const schoolId = userData.school_id

  // Handle file upload
  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('school_id', schoolId)
    console.log(formData)

    try {
      const token = localStorage.getItem('token') // Replace with your method of getting the token
      await axiosConfig.post('/upload-siswa', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })

      // Optionally handle success (e.g., show a success message)
      console.log('File uploaded successfully')

      // Refresh the window
      window.location.reload()
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error('Error uploading file:', error)
    } finally {
      setOpenDialog(false) // Close dialog after upload
      setFile(null) // Reset file input
    }
  }

  return (
    <>
      <Box
        sx={{
          py: 4,
          px: 6,
          rowGap: 2,
          columnGap: 4,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Button
          color='secondary'
          variant='tonal'
          startIcon={<Icon icon='tabler:upload' />}
          onClick={() => setOpenDialog(true)}
        >
          Upload
        </Button>
        <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          <CustomTextField
            value={value}
            sx={{ mr: 4 }}
            placeholder='Search Name'
            onChange={e => handleFilter(e.target.value)}
          />
          <Link href='/ms/siswa/SiswaAddView' passHref>
            <Button variant='contained' sx={{ '& svg': { mr: 2 } }}>
              <Icon fontSize='1.125rem' icon='tabler:plus' />
              Tambah
            </Button>
          </Link>
        </Box>
      </Box>

      {/* Upload Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Upload File</DialogTitle>
        <DialogContent>
          <input
            type='file'
            accept='.xlsx, .xls' // Add accepted file types here
            onChange={handleFileChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleUpload} color='primary' disabled={!file}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default TableHeader
