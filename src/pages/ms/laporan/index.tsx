import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { Button, Grid } from '@mui/material'
import axiosConfig from 'src/configs/axiosConfig'
import { useCallback, useEffect, useState } from 'react'
import { GridSearchIcon } from '@mui/x-data-grid'
import UserDetailsCard from './userDetail'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import CustomTextField from 'src/@core/components/mui/text-field'
import TabelReportPaymentMonth from './TabelReportPaymentMonth'
import TabelReportPaymentFree from './TabelReportPaymentFree'

const PaymentInAdmin = () => {
  const userData = JSON.parse(localStorage.getItem('userData') as string)
  const storedToken = localStorage.getItem('token')
  const schoolId = userData.school_id

  const [selectedUser, setSelectedUser] = useState<string>('')
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [unit, setUnit] = useState<string>('')
  const [units, setUnits] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [showTable, setShowTable] = useState<boolean>(false)
  const [searchParams, setSearchParams] = useState({ schoolId: '', unitId: '', userId: '' })
  const [userDetails, setUserDetails] = useState<any>(null)
  const [years, setYears] = useState<any[]>([])
  const [year, setYear] = useState<string | null>(null)
  const [optionses] = useState([
    { id: 'bulanan', full_name: 'BULANAN' },
    { id: 'bebas', full_name: 'BEBAS' }
  ])
  const [selectedOption, setSelectedOption] = useState<any>(null)
  const [PaymentNames, setPaymentNames] = useState<any[]>([])
  const [PaymentName, setPaymentName] = useState<any>(null)
  const [filteredPaymentNames, setFilteredPaymentNames] = useState<any[]>([])
  const [refreshTable, setRefreshTable] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [unitsResponse, usersResponse, paymentsResponse] = await Promise.all([
          axiosConfig.get('/getUnit', { headers: { Authorization: `Bearer ${storedToken}` } }),
          axiosConfig.get(`/list-siswa/?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${storedToken}` } }),
          axiosConfig.get('getListPayment', { headers: { Authorization: `Bearer ${storedToken}` } })
        ])

        setUnits(unitsResponse.data.filter((unit: any) => unit.school_id === schoolId))
        setUsers(usersResponse.data)
        setPaymentNames(paymentsResponse.data.filter((payment: any) => payment.school_id === schoolId))
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [schoolId, storedToken])

  // Filter users based on the selected unit
  useEffect(() => {
    setFilteredUsers(unit ? users.filter(user => user.unit_id === unit && user.school_id === schoolId) : [])
  }, [unit, users, schoolId])

  // Handle Search
  const onSearch = useCallback(() => {
    if (unit && selectedUser && selectedOption) {
      setSearchParams({ schoolId, unitId: unit, userId: selectedUser })
      setShowTable(true)
      setRefreshTable(prev => !prev) // Toggle the refresh state to trigger a refresh
    } else {
      setShowTable(false)
    }
  }, [unit, selectedUser, schoolId, selectedOption])

  // Set years for the year selection
  useEffect(() => {
    const currentYear = new Date().getFullYear()
    const yearsArray = []
    for (let i = currentYear - 2; i <= currentYear + 2; i++) {
      yearsArray.push(`${i}/${i + 1}`)
    }
    setYears(yearsArray)
  }, [])

  // Filter Payment Names based on selected option
  useEffect(() => {
    setFilteredPaymentNames(
      selectedOption ? PaymentNames.filter((payment: any) => payment.sp_type === selectedOption.full_name) : []
    )
  }, [selectedOption, PaymentNames])

  return (
    <Card>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          Laporan Pembayaran
        </Typography>

        <Grid container spacing={2} alignItems='center'>
          {/* Unit Selection */}
          <Grid item xs={12} sm={2}>
            <CustomAutocomplete
              fullWidth
              value={units.find(unitObj => unitObj.id === unit) || null}
              options={units}
              onChange={(event, newValue) => {
                setUnit(newValue ? newValue.id : '')
                setUserDetails(null)
                setShowTable(false)
              }}
              id='autocomplete-unit'
              getOptionLabel={option => option.unit_name || ''}
              renderInput={params => <CustomTextField {...params} label='Unit' variant='outlined' />}
            />
          </Grid>

          {/* Siswa Selection */}
          <Grid item xs={12} sm={2}>
            <CustomAutocomplete
              fullWidth
              value={filteredUsers.find(user => user.id === selectedUser) || null}
              options={filteredUsers}
              onChange={(event, newValue) => {
                const userId = newValue ? newValue.id : ''
                setSelectedUser(userId)
                setUserDetails(newValue ? users.find(user => user.id === userId) : null)
              }}
              id='autocomplete-siswa'
              getOptionLabel={option => option.full_name || ''}
              renderInput={params => <CustomTextField {...params} label='Siswa' variant='outlined' />}
            />
          </Grid>

          {/* Year Selection Menu */}
          <Grid item xs={12} sm={2}>
            <CustomAutocomplete
              fullWidth
              value={year}
              options={years}
              onChange={(event, newValue) => setYear(newValue || null)}
              id='autocomplete-year'
              getOptionLabel={option => option || ''}
              renderInput={params => <CustomTextField {...params} label='Tahun' variant='outlined' />}
            />
          </Grid>

          {/* Option Selection */}
          <Grid item xs={12} sm={2}>
            <CustomAutocomplete
              fullWidth
              value={selectedOption || null}
              options={optionses}
              onChange={(event, newValue) => {
                setSelectedOption(newValue || null), setPaymentName(null)
              }}
              id='autocomplete-option'
              getOptionLabel={option => option.full_name || ''}
              renderInput={params => <CustomTextField {...params} label='Tipe' variant='outlined' />}
            />
          </Grid>

          {/* Payment Name Selection */}
          <Grid item xs={12} sm={2}>
            <CustomAutocomplete
              fullWidth
              value={PaymentName || null}
              options={filteredPaymentNames}
              onChange={(event, newValue) => setPaymentName(newValue || null)}
              id='autocomplete-payment-name'
              getOptionLabel={option => option.sp_name || ''}
              renderInput={params => <CustomTextField {...params} label='Nama Pembayaran' variant='outlined' />}
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
              style={{ minHeight: '30px', marginTop: '17px' }}
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

        {/* Show Payment Table */}
        {
          showTable &&
            selectedOption &&
            (selectedOption.id === 'bulanan' ? (
              <TabelReportPaymentMonth
                school_id={searchParams.schoolId}
                unit_id={searchParams.unitId}
                user_id={searchParams.userId}
                year={year}
                setting_payment_uid={PaymentName?.uid}
                type={selectedOption.id}
                refresh={refreshTable} // Pass the refresh state
              />
            ) : selectedOption.id === 'bebas' ? (
              <TabelReportPaymentFree
                school_id={searchParams.schoolId}
                unit_id={searchParams.unitId}
                user_id={searchParams.userId}
                year={year}
                setting_payment_uid={PaymentName?.uid}
                type={selectedOption.id}
                refresh={refreshTable} // Pass the refresh state
              />
            ) : null) // Render nothing if the type doesn't match
        }
      </CardContent>
    </Card>
  )
}

export default PaymentInAdmin
