import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
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

  const [monthStatus, setMonthStatus] = useState('ON')
  const [month, setMonth] = useState('')
  const [monthNumber, setMonthNumber] = useState('')
  const [schoolId, setSchoolId] = useState('')
  const [loading, setLoading] = useState(false) // New state for loading

  useEffect(() => {
    if (storedToken) {
      axiosConfig
        .post(
          '/detailBulan',
          { uid },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${storedToken}`
            }
          }
        )
        .then(response => {
          const { month, month_number, month_status, school_id } = response.data
          setMonth(month)
          setMonthNumber(month_number)
          setMonthStatus(month_status)
          setSchoolId(school_id)
        })
        .catch(error => {
          console.error('Error fetching class details:', error)
        })
    }
  }, [uid, storedToken])

  const onSubmit = () => {
    setLoading(true) // Start loading
    const formData = {
      uid,
      school_id: schoolId,
      month_number: monthNumber,
      month_status: monthStatus
    }

    if (storedToken) {
      axiosConfig
        .post(
          '/update-bulan',
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
          router.push('/ms/bulan')
        })
        .catch(() => {
          toast.error("Failed. This didn't work.")
        })
        .finally(() => {
          setLoading(false) // Stop loading
        })
    }
  }

  return (
    <>
      <Card>
        <CardHeader title='Update Bulan' />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={4}>
                <CustomTextField
                  fullWidth
                  value={month}
                  label='Nama Bulan'
                  placeholder='Nama Bulan'
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item xs={4}>
                <CustomTextField
                  fullWidth
                  value={monthNumber}
                  onChange={e => {
                    const newValue = e.target.value.replace(/[^0-9]/g, '')
                    if (newValue === '' || Number(newValue) <= 12) {
                      setMonthNumber(newValue)
                    }
                  }}
                  label='Nomor Urut Bulan'
                  placeholder='No Urut Bulan'
                />
              </Grid>

              <Grid item xs={4}>
                <CustomTextField
                  select
                  fullWidth
                  label='Status'
                  value={monthStatus}
                  onChange={e => setMonthStatus(e.target.value)}
                >
                  <MenuItem value='ON'>ON</MenuItem>
                  <MenuItem value='OFF'>OFF</MenuItem>
                </CustomTextField>
              </Grid>

              <Grid item xs={12}>
                <Button
                  type='submit'
                  variant='contained'
                  sx={{ marginRight: 2 }}
                  disabled={loading} // Disable button when loading
                >
                  {loading ? <CircularProgress size={24} /> : 'Save'}
                </Button>

                <Box m={1} display='inline'></Box>
                <Link href='/ms/bulan' passHref>
                  <Button type='button' variant='contained' color='secondary'>
                    Back
                  </Button>
                </Link>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </>
  )
}

export default FormValidationSchema
