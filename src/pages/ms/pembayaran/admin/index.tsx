// Other imports remain the same
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { Button, Grid } from '@mui/material'
import axiosConfig from 'src/configs/axiosConfig'
import { useCallback, useEffect, useState } from 'react'
import { GridSearchIcon } from '@mui/x-data-grid'
import TabelPaymentMonth from 'src/pages/ms/pembayaran/admin/TabelPaymentMonth'
import UserDetailsCard from './userDetail'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import CustomTextField from 'src/@core/components/mui/text-field'

const PaymentInAdmin = () => {
  const userData = JSON.parse(localStorage.getItem('userData') as string)
  const storedToken = window.localStorage.getItem('token')
  const schoolId = userData.school_id
  const [selectedUser, setSelectedUser] = useState<string>('')
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [unit, setUnit] = useState<string>('')
  const [units, setUnits] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [showTable, setShowTable] = useState<boolean>(false)
  const [searchParams, setSearchParams] = useState({ schoolId: '', unitId: '', userId: '' })
  const [userDetails, setUserDetails] = useState<any>(null)

  // Fetch units and users
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axiosConfig.get(`/getUnit`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          }
        })
        const filteredUnits = response.data.filter((unit: any) => unit.school_id === schoolId)
        setUnits(filteredUnits)
      } catch (error) {
        console.error('Error fetching units:', error)
      }
    }

    const fetchUsers = async () => {
      try {
        const response = await axiosConfig.get(`/list-siswa/?schoolId=${schoolId}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          }
        })
        setUsers(response.data)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUnits()
    fetchUsers()
  }, [schoolId, storedToken])

  // Filter users based on the selected unit
  useEffect(() => {
    if (unit) {
      const filtered = users.filter(user => user.unit_id === unit && user.school_id === schoolId)
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers([])
    }
  }, [unit, users, schoolId])

  // Handle Search
  const onSearch = useCallback(() => {
    if (unit && selectedUser) {
      setSearchParams({ schoolId, unitId: unit, userId: selectedUser })
      setShowTable(true)
    } else {
      setShowTable(false)
    }
  }, [unit, selectedUser, schoolId])

  return (
    <Card>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          Pembayaran Details
        </Typography>

        <Grid container spacing={3} alignItems='center'>
          {/* Unit Selection */}
          <Grid item xs={12} sm={5}>
            <CustomAutocomplete
              fullWidth
              value={units.find(unitObj => unitObj.id === unit) || null} // Correctly set the value
              options={units}
              onChange={(event, newValue) => {
                setUnit(newValue ? newValue.id : '') // Set unit ID based on selection
                setUserDetails(null) // Reset user details on unit change
                setShowTable(false)
              }}
              id='autocomplete-unit'
              getOptionLabel={option => option.unit_name || ''}
              renderInput={params => <CustomTextField {...params} label='Unit' variant='outlined' />}
            />
          </Grid>

          {/* Siswa Selection */}
          <Grid item xs={12} sm={5}>
            <CustomAutocomplete
              fullWidth
              value={filteredUsers.find(user => user.id === selectedUser) || null} // Correctly set the value
              options={filteredUsers}
              onChange={(event, newValue) => {
                setSelectedUser(newValue ? newValue.id : '') // Set selected user ID based on selection
                const userDetail = newValue ? users.find(user => user.id === newValue.id) : null
                setUserDetails(userDetail || null) // Set user details
              }}
              id='autocomplete-siswa'
              getOptionLabel={option => option.full_name || ''}
              renderInput={params => <CustomTextField {...params} label='Siswa' variant='outlined' />}
            />
          </Grid>

          {/* Search Button */}
          <Grid item xs={12} sm={2} container alignItems='center' justifyContent='center'>
            <Button
              variant='contained'
              color='primary'
              startIcon={<GridSearchIcon />}
              onClick={onSearch}
              fullWidth
              style={{ minHeight: '30px', marginTop: '17px' }} // Ensure button height matches the Autocomplete height
            >
              Cari
            </Button>
          </Grid>
        </Grid>

        {/* Display User Details */}
        {userDetails ? (
          <UserDetailsCard userDetails={userDetails} />
        ) : (
          <Typography variant='body2' color='textSecondary'></Typography>
        )}

        <Box m={1} display='inline'></Box>

        {/* Show Payment Table */}
        {showTable && searchParams.schoolId && searchParams.unitId && searchParams.userId && (
          <TabelPaymentMonth
            school_id={searchParams.schoolId}
            unit_id={searchParams.unitId}
            uid={searchParams.userId}
          />
        )}
      </CardContent>
    </Card>
  )
}

export default PaymentInAdmin
