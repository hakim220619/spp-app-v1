// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import Link from 'next/link'
import { useCallback } from 'react'
import axiosConfig from 'src/configs/axiosConfig'

interface TableHeaderProps {
  value: string
  handleFilter: (val: string) => void
  handleTable: (val: any) => void // This should be of the correct type if it's called with a value
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, value, handleTable } = props // Include handleTable

  // ** Function to handle "Cek Pembayaran" button click
  const fetchPaymentTransactions = useCallback(async () => {
    try {
      const token = localStorage.getItem('token') // Retrieve the token from local storage

      const response = await axiosConfig.get('/cekTransaksiPaymentSiswaBaru', {
        headers: {
          Authorization: `Bearer ${token}` // Include token in the headers
        }
      })

      // Handle response data as needed
      console.log(response.data)

      // Call handleTable after successful fetch
      handleTable(response.data) // Pass the data or a relevant value to handleTable
    } catch (error) {
      console.error('Error fetching payment transactions:', error)

      // Handle error (show notification, alert, etc.)
    }
  }, [handleTable]) // Add handleTable to dependencies

  return (
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
      <Button color='secondary' variant='tonal' startIcon={<Icon icon='tabler:upload' />}>
        Export
      </Button>
      <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <CustomTextField
          value={value}
          sx={{ mr: 4 }}
          placeholder='Search Name'
          onChange={e => handleFilter(e.target.value)}
        />
        <Link href='/ms/ppdb/AddView' passHref>
          <Button variant='contained' sx={{ '& svg': { mr: 2 } }}>
            <Icon fontSize='1.125rem' icon='tabler:plus' />
            Tambah
          </Button>
        </Link>
        <Box m={1} display='inline'></Box>

        <Button
          variant='contained'
          color='warning'
          sx={{ '& svg': { mr: 2 } }}
          onClick={fetchPaymentTransactions} // Call the API on button click
        >
          <Icon fontSize='1.125rem' icon='tabler:reload' />
          Cek Pembayaran
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeader
