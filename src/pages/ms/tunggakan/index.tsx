import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { Button, CircularProgress, Grid } from '@mui/material'
import axiosConfig from 'src/configs/axiosConfig'
import { useCallback, useEffect, useState } from 'react'
import { GridSearchIcon } from '@mui/x-data-grid'
import UserDetailsCard from './userDetail'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import CustomTextField from 'src/@core/components/mui/text-field'
import TabelReportPayment from './TabelReportPayment'
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'

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
  const [searchParams, setSearchParams] = useState({ schoolId: '', unitId: '', userId: '', clas: '', major: '' })
  const [userDetails, setUserDetails] = useState<any>(null)
  const [clases, setClass] = useState<any[]>([])
  const [filteredClasses, setFilteredClasses] = useState<any[]>([]) // Filtered classes based on the selected unit
  const [clas, setClas] = useState<string | null>(null)
  const [majors, setMajors] = useState<any[]>([])
  const [filteredMajors, setFilteredMajors] = useState<any[]>([]) // Filtered majors based on the selected unit
  const [major, setMajor] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [refreshTable, setRefreshTable] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [unitsResponse, usersResponse, majorsResponse, clasesResponse] = await Promise.all([
          axiosConfig.get('/getUnit', { headers: { Authorization: `Bearer ${storedToken}` } }),
          axiosConfig.get(`/list-siswa/?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${storedToken}` } }),
          axiosConfig.get(`/getMajors/?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${storedToken}` } }),
          axiosConfig.get(`/getClass/?schoolId=${schoolId}`, { headers: { Authorization: `Bearer ${storedToken}` } })
        ])

        setUnits(unitsResponse.data.filter((unit: any) => unit.school_id === schoolId))
        setUsers(usersResponse.data)
        setClass(clasesResponse.data.filter((cla: any) => cla.school_id === schoolId))
        setMajors(majorsResponse.data.filter((mjr: any) => mjr.school_id === schoolId))
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [schoolId, storedToken])

  // Filter users, classes, and majors based on the selected unit
  useEffect(() => {
    if (unit) {
      setFilteredUsers(
        users.filter(
          user =>
            user.unit_id === unit && user.school_id === schoolId && user.class_id === clas && user.major_id === major
        )
      )

      setFilteredClasses(clases.filter(cla => cla.unit_id === unit && cla.school_id === schoolId))
      setFilteredMajors(majors.filter(majorObj => majorObj.unit_id === unit && majorObj.school_id === schoolId))
    } else {
      setFilteredUsers([]) // Clear filtered users if conditions aren't met
      setFilteredClasses([])
      setFilteredMajors([])
    }
  }, [unit, clas, major, users, clases, majors, schoolId])

  // Handle Search
  const onSearch = useCallback(() => {
    if (unit && selectedUser) {
      setSearchParams({ schoolId, unitId: unit, userId: selectedUser, clas: clas || '', major: major || '' })
      setShowTable(true)
      setRefreshTable(prev => !prev) // Toggle the refresh state to trigger a refresh
    } else {
      setShowTable(false)
    }
  }, [unit, selectedUser, schoolId, clas, major])
  const onSendMessage = async () => {
    setLoading(true)
    try {
      // Retrieve the stored token from localStorage
      const storedToken = localStorage.getItem('token')

      // Check if token exists
      if (!storedToken) {
        throw new Error('No authentication token found.')
      }

      // Prepare the request body
      const requestBody = {
        school_id: searchParams.schoolId,
        unit_id: searchParams.unitId,
        user_id: searchParams.userId,
        clas: searchParams.clas,
        major: searchParams.major
      }

      // Make the API request to /sendTunggakanSiswa
      const response = await axiosConfig.post('/sendTunggakanSiswa', requestBody, {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      })

      // Handle the response
      if (response.status === 200) {
        setLoading(false)
        toast.success('Tagihan berhasil dikirim!')
      } else {
        setLoading(false)

        toast.error('Gagal mengirim tagihan.')
      }
    } catch (error) {
      setLoading(false)
      console.error('Failed to send billing message:', error)
      toast.error('Gagal mengirim tagihan. Silakan coba lagi.')
    }
  }

  return (
    <Card>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          Laporan Tunggakan
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
                setClas(null)
                setMajor(null)
                setShowTable(false)
              }}
              id='autocomplete-unit'
              getOptionLabel={option => option.unit_name || ''}
              renderInput={params => <CustomTextField {...params} label='Unit' variant='outlined' />}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <CustomAutocomplete
              fullWidth
              value={filteredClasses.find(cls => cls.id === clas) || null} // Ensure selected class is properly reflected
              options={filteredClasses} // Use filtered classes
              onChange={(event, newValue) => setClas(newValue ? newValue.id : null)} // Safely extract id or set null if no value
              id='autocomplete-year'
              getOptionLabel={option => option.class_name || ''} // Get the class name for display
              renderInput={params => <CustomTextField {...params} label='Kelas' variant='outlined' />}
            />
          </Grid>

          {/* Major Selection */}
          <Grid item xs={12} sm={2}>
            <CustomAutocomplete
              fullWidth
              value={filteredMajors.find(mjr => mjr.id === major) || null} // Ensure selected major is properly reflected
              options={filteredMajors} // Use filtered majors
              onChange={(event, newValue) => setMajor(newValue ? newValue.id : null)} // Safely extract id or set null if no value
              id='autocomplete-option'
              getOptionLabel={option => option.major_name || ''} // Get the major name for display
              renderInput={params => <CustomTextField {...params} label='Jurusan' variant='outlined' />}
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
          <Grid item xs={12} sm={2} container alignItems='center' justifyContent='center'>
            <Button
              variant='contained'
              color='success'
              startIcon={<Icon icon='tabler:brand-whatsapp' />}
              onClick={onSendMessage}
              fullWidth
              style={{ minHeight: '30px', marginTop: '17px' }}
              disabled={userDetails === null || major === null || loading} // Nonaktifkan tombol jika loading
            >
              {loading ? <CircularProgress size={24} color='inherit' /> : 'Kirim Pesan Tagihan'}
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
        {showTable && (
          <TabelReportPayment
            school_id={searchParams.schoolId}
            unit_id={searchParams.unitId}
            user_id={searchParams.userId}
            clas={searchParams.clas}
            major={searchParams.major}
            refresh={refreshTable} // Pass the refresh state
          />
        )}
      </CardContent>
    </Card>
  )
}

export default PaymentInAdmin
