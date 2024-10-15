import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import toast from 'react-hot-toast'

// Axios Import
import axiosConfig from '../../../configs/axiosConfig'
import { useRouter } from 'next/router'
import Link from 'next/link'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Box } from '@mui/system'

const FormValidationSchema = () => {
  const { handleSubmit } = useForm()
  const router = useRouter()
  const { uid } = router.query
  const storedToken = window.localStorage.getItem('token')

  // State variables
  const [nik, setNik] = useState<string>('')
  const [date_of_birth, setDateOfBirth] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [full_name, setFullName] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [unit_id, setUnitId] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [units, setUnits] = useState<any[]>([]) // State to hold unit data

  // Fetch details
  useEffect(() => {
    if (storedToken) {
      axiosConfig
        .post(
          '/detailPpdb',
          { id: uid },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${storedToken}`
            }
          }
        )
        .then(response => {
          const { nik, date_of_birth, email, full_name, phone, unit_id, status } = response.data
          const date = new Date(date_of_birth)
          const year = date.getFullYear() // Local year
          const month = `0${date.getMonth() + 1}`.slice(-2) // Local month (getMonth() is zero-based)
          const day = `0${date.getDate()}`.slice(-2) // Local day

          // Format date in the way you need (e.g., YYYY-MM-DD)
          const formattedDateOfBirth = `${year}-${month}-${day}`
          setNik(nik)
          setDateOfBirth(formattedDateOfBirth)
          setEmail(email)
          setFullName(full_name)
          setPhone(phone)
          setUnitId(unit_id) // Set unit_id from response
          setStatus(status)
        })
        .catch(error => {
          console.error('Error fetching details:', error)
        })
    }
  }, [uid, storedToken])

  // Fetch units
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axiosConfig.get('/getUnit', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          }
        })

        const userData = JSON.parse(localStorage.getItem('userData') as any)
        const schoolId = userData ? userData.school_id : null

        if (schoolId) {
          const filteredUnits = response.data.filter((unit: any) => unit.school_id === schoolId)
          setUnits(filteredUnits)
        } else {
          console.warn('No school_id found in userData')
          setUnits([])
        }
      } catch (error) {
        console.error('Failed to fetch units:', error)
        toast.error('Failed to load units')
      }
    }

    fetchUnits()
  }, [storedToken])

  const onSubmit = () => {
    const date = new Date(date_of_birth)
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')}`
    console.log(formattedDate)

    const formData = {
      id: uid,
      nik,
      date_of_birth: formattedDate,
      email,
      full_name,
      phone,
      unit_id,
      status
    }

    if (storedToken) {
      axiosConfig
        .post(
          '/update-ppdb',
          { data: formData },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${storedToken}`
            }
          }
        )
        .then(() => {
          toast.success('Successfully Updated!')
          router.push('/ms/ppdb')
        })
        .catch(() => {
          toast.error("Failed. This didn't work.")
        })
    }
  }

  return (
    <Card>
      <CardHeader title='Update Siswa Baru' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <CustomTextField select fullWidth label='Unit' value={unit_id} onChange={e => setUnitId(e.target.value)}>
                {units.map(unit => (
                  <MenuItem key={unit.id} value={unit.id}>
                    {unit.unit_name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            {/* NISN Field */}
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <CustomTextField
                fullWidth
                label='NIK'
                value={nik}
                onChange={e => setNik(e.target.value)}
                placeholder='NIK'
              />
            </Grid>

            {/* Date of Birth Field */}
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <CustomTextField
                fullWidth
                type='date'
                label='Date of Birth'
                value={date_of_birth}
                onChange={e => setDateOfBirth(e.target.value)}
              />
            </Grid>

            {/* Email Field */}
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <CustomTextField
                fullWidth
                label='Email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder='Email'
              />
            </Grid>

            {/* Full Name Field */}
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <CustomTextField
                fullWidth
                label='Full Name'
                value={full_name}
                onChange={e => setFullName(e.target.value)}
                placeholder='Full Name'
              />
            </Grid>

            {/* Phone Field */}
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <CustomTextField
                fullWidth
                label='Phone'
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder='Phone'
              />
            </Grid>

            {/* Unit Selection Field */}

            <Grid item xs={12} sm={6} md={4} lg={12}>
              <CustomTextField select fullWidth label='Status' value={status} onChange={e => setStatus(e.target.value)}>
                <MenuItem value={'Registered'}>Registered</MenuItem>
                <MenuItem value={'Pending'}>Pending</MenuItem>
                <MenuItem value={'Rejected'}>Rejected</MenuItem>
                <MenuItem value={'Accepted'}>Accepted</MenuItem>
              </CustomTextField>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button type='submit' variant='contained'>
                Save
              </Button>
              <Box m={1} display='inline'></Box>
              <Link href='/ms/ppdb' passHref>
                <Button type='button' variant='contained' color='secondary'>
                  Back
                </Button>
              </Link>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default FormValidationSchema
