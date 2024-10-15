import { useState, useEffect } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import Backdrop from '@mui/material/Backdrop'
import { Box } from '@mui/system'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Custom Imports
import axiosConfig from '../../../../configs/axiosConfig'
import { useRouter } from 'next/navigation'

// ** Interface for form data
interface PaymentForm {
  sp_name: string
  sp_desc: string
  year: string
  sp_type: string
  sp_status: 'ON' | 'OFF'
  unit_id: string // Added unit_id to form data
}

// ** Validation schema using Yup
const schema = yup.object().shape({
  sp_name: yup.string().required('Nama Pembayaran wajib diisi'),
  sp_desc: yup.string().required('Deskripsi Pembayaran wajib diisi'),
  year: yup.string().required('Tahun wajib diisi'),
  sp_type: yup.string().required('Tipe Pembayaran wajib diisi'),
  sp_status: yup.string().oneOf(['ON', 'OFF'], 'Status tidak valid').required('Status wajib diisi'),
  unit_id: yup.string().required('Unit wajib dipilih') // Validation for unit_id
})

const SettingAddPembayaran = () => {
  const router = useRouter()
  const [years, setYears] = useState<string[]>([])
  const [units, setUnits] = useState<{ id: string; name: string }[]>([]) // State for units
  const [isLoading, setIsLoading] = useState(false) // State for overlay loading
  const [selectedSchoolId, setSelectedSchoolId] = useState(null)

  const defaultValues: PaymentForm = {
    sp_name: '',
    sp_desc: '',
    year: '',
    sp_type: '',
    sp_status: 'ON',
    unit_id: '' // Initialize unit_id
  }

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<PaymentForm>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const data = localStorage.getItem('userData') as string
  const getDataLocal = JSON.parse(data)
  const schoolId = getDataLocal?.school_id

  useEffect(() => {
    const currentYear = new Date().getFullYear()
    const generatedYears = []

    for (let i = currentYear - 2; i <= currentYear + 2; i++) {
      generatedYears.push(`${i}/${i + 1}`)
    }
    setYears(generatedYears)

    // Fetch units from API
    const storedToken = window.localStorage.getItem('token')
    axiosConfig
      .get('/getUnit', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${storedToken}`
        }
      })
      .then(response => {
        setUnits(response.data) // Assuming the response contains an array of units
      })
      .catch(() => {
        toast.error('Gagal memuat unit')
      })
  }, [])

  const onSubmit = (formData: PaymentForm) => {
    const data = new FormData()
    data.append('school_id', schoolId)
    data.append('sp_name', formData.sp_name.toUpperCase())
    data.append('sp_desc', formData.sp_desc.toUpperCase())
    data.append('years', formData.year)
    data.append('sp_type', formData.sp_type)
    data.append('sp_status', formData.sp_status)
    data.append('unit_id', formData.unit_id) // Include unit_id in submission

    const storedToken = window.localStorage.getItem('token')

    setIsLoading(true) // Show loading overlay
    axiosConfig
      .post('/create-setting-pembayaran', data, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${storedToken}`
        }
      })
      .then(() => {
        toast.success('Pembayaran berhasil ditambahkan!')
        router.push('/ms/setting/pembayaran')
      })
      .catch(() => {
        toast.error('Gagal menambahkan pembayaran')
      })
      .finally(() => {
        setIsLoading(false) // Hide loading overlay
      })
  }

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') as any)
    if (userData && userData.school_id) {
      setSelectedSchoolId(userData.school_id)
    }
  }, [])

  return (
    <>
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color='inherit' />
      </Backdrop>

      <Card>
        <CardHeader title='Tambah Pembayaran' />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <Controller
                  name='sp_name'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='Nama Pembayaran'
                      onChange={onChange}
                      placeholder='Contoh: SP A'
                      error={Boolean(errors.sp_name)}
                      helperText={errors.sp_name?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <Controller
                  name='year'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      value={value}
                      label='Tahun'
                      onChange={onChange}
                      error={Boolean(errors.year)}
                      helperText={errors.year?.message}
                    >
                      {years.map(year => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6} lg={4}>
                <Controller
                  name='sp_type'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      value={value}
                      label='Tipe Pembayaran'
                      onChange={onChange}
                      error={Boolean(errors.sp_type)}
                      helperText={errors.sp_type?.message}
                    >
                      <MenuItem value='BULANAN'>BULANAN</MenuItem>
                      <MenuItem value='BEBAS'>BEBAS</MenuItem>
                    </CustomTextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6} lg={4}>
                <Controller
                  name='sp_status'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      value={value}
                      label='Status'
                      onChange={onChange}
                      error={Boolean(errors.sp_status)}
                      helperText={errors.sp_status?.message}
                    >
                      <MenuItem value='ON'>ON</MenuItem>
                      <MenuItem value='OFF'>OFF</MenuItem>
                    </CustomTextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6} lg={4}>
                <Controller
                  name='unit_id'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      value={value}
                      label='Unit'
                      onChange={onChange}
                      error={Boolean(errors.unit_id)}
                      helperText={errors.unit_id?.message}
                    >
                      {units
                        .filter((unit: any) => unit.school_id === selectedSchoolId) // Adjust this line
                        .map((unit: any) => (
                          <MenuItem key={unit.id} value={unit.id}>
                            {unit.unit_name}
                          </MenuItem>
                        ))}
                    </CustomTextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6} lg={4}>
                <Controller
                  name='sp_desc'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='Deskripsi'
                      onChange={onChange}
                      placeholder='Contoh: Deskripsi SP A'
                      error={Boolean(errors.sp_desc)}
                      helperText={errors.sp_desc?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <Button type='submit' variant='contained' disabled={isLoading}>
                  {isLoading ? <CircularProgress size={24} /> : 'Submit'}
                </Button>

                <Box m={1} display='inline' />
                <Button
                  type='button'
                  variant='contained'
                  color='secondary'
                  onClick={() => router.push('/ms/setting/pembayaran')}
                >
                  Back
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </>
  )
}

export default SettingAddPembayaran
