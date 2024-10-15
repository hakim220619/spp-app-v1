// ** React Imports
import { useState, useEffect, ChangeEvent, forwardRef } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import { Box } from '@mui/system'
import Link from 'next/link'
import { CircularProgress, IconButton, InputAdornment } from '@mui/material'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Custom Imports
import axiosConfig from '../../../configs/axiosConfig'
import { useRouter } from 'next/navigation'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import Icon from 'src/@core/components/icon'

// User Interface
interface User {
  nisn: string
  full_name: string
  email: string
  phone: string
  password: string
  major: string
  status: 'ON' | 'OFF'
  class: string
  unit_id: string
  address: string
  gambar: File | null // Keep as is to handle file uploads
  date_of_birth: string
  school_id: string
}

// Major Interface
interface Major {
  id: string
  major_name: string
  unit_id: string
}

// Class Interface
interface Class {
  id: any
  class_name: string
  unit_id: string
}

// Unit Interface
interface Unit {
  id: string
  unit_name: string
}

// Custom Input Component
const CustomInput = forwardRef(
  ({ ...props }: { value: DateType; label: string; error: boolean; onChange: (event: ChangeEvent) => void }, ref) => {
    return <CustomTextField fullWidth inputRef={ref} {...props} sx={{ width: '100%' }} />
  }
)

// Validation Schema
const schema = yup.object().shape({
  nisn: yup.string().required('NISN is required').min(3),
  full_name: yup.string().required('Full name is required').min(3),
  email: yup.string().email().required('Email is required'),
  phone: yup.string().required('Phone is required').min(10, 'Phone must be at least 10 digits'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  major: yup.string().required('Major is required'),
  status: yup.string().oneOf(['ON', 'OFF'], 'Invalid status').required('Status is required'),
  class: yup.string().required('Class is required'),
  unit_id: yup.string().required('Unit is required'),
  address: yup.string().required('Address is required')
})

// Main Component
const FormValidationSchema = () => {
  const router = useRouter()
  const [majors, setMajorses] = useState<Major[]>([])
  const [clas, setClas] = useState<Class[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [filteredMajors, setFilteredMajors] = useState<Major[]>([])
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([])
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedUnitId, setSelectedUnitId] = useState<string | undefined>()
  const [gambar, setGambarValue] = useState<File>()

  const data = localStorage.getItem('userData') as string
  const getDataLocal = JSON.parse(data)
  const schoolId = getDataLocal?.school_id

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const defaultValues: User = {
    nisn: '',
    full_name: '',
    email: '',
    phone: '',
    password: '',
    major: '',
    status: 'ON',
    class: '',
    unit_id: '',
    address: '',
    gambar: null,
    date_of_birth: '',
    school_id: ''
  }

  // Fetch Majors, Classes, and Units using useEffect
  useEffect(() => {
    const fetchMajorsAndClasses = async () => {
      const storedToken = window.localStorage.getItem('token')
      try {
        const majorsResponse = await axiosConfig.get(`/getMajors/?schoolId=${schoolId}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          }
        })
        setMajorses(majorsResponse.data)

        const classesResponse = await axiosConfig.get(`/getClass/?schoolId=${schoolId}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          }
        })
        setClas(classesResponse.data)
      } catch (error) {
        console.error('Error fetching majors or classes:', error)
      }
    }

    const fetchUnits = async () => {
      const storedToken = window.localStorage.getItem('token')
      try {
        const response = await axiosConfig.get('/getUnit', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          }
        })
        const filteredUnits = response.data.filter((unit: any) => unit.school_id === schoolId)
        setUnits(filteredUnits)
      } catch (error) {
        console.error('Failed to fetch units:', error)
        toast.error('Failed to load units')
      }
    }

    fetchMajorsAndClasses()
    fetchUnits()
  }, [schoolId])

  // Form hook setup
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<User>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // Handle unit selection
  useEffect(() => {
    // Reset major and class fields when unit_id changes
    setValue('major', '')
    setValue('class', '')
    setFilteredMajors(majors.filter(major => major.unit_id === selectedUnitId))
    setFilteredClasses(clas.filter(cls => cls.unit_id === selectedUnitId))
  }, [selectedUnitId, majors, clas, setValue])

  const onSubmit = async (data: User) => {
    setLoading(true)
    const localDate = new Date(data.date_of_birth).toLocaleDateString('en-CA')
    const formData = new FormData()
    formData.append('nisn', data.nisn)
    formData.append('full_name', data.full_name.toUpperCase())
    formData.append('email', data.email)
    formData.append('phone', data.phone)
    formData.append('password', data.password)
    formData.append('major_id', data.major)
    formData.append('status', data.status)
    formData.append('class_id', data.class)
    formData.append('unit_id', data.unit_id)
    formData.append('address', data.address)
    formData.append('school_id', schoolId)
    formData.append('date_of_birth', localDate)

    if (gambar) {
      formData.append('gambar', gambar)
    }

    const storedToken = window.localStorage.getItem('token')
    try {
      await axiosConfig.post('/create-siswa', formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${storedToken}`
        }
      })

      toast.success('Successfully Added!')
      router.push('/ms/siswa')
    } catch (error: any) {
      if (error.response) {
        if (error.response.data.message.includes('users.users_email_unique')) {
          toast.error('Duplicate entry: Email already exists.')
        } else if (error.response.data.message.includes('users.nisn')) {
          toast.error('Duplicate entry: Nisn already exists.')
        } else {
          toast.error('Failed to add user')
        }
      } else {
        toast.error('Failed to add user')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader title='Tambah Siswa' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} justifyContent='center' alignItems='center'>
            {/* Unit ID Field */}
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <Controller
                name='unit_id'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    value={value}
                    label='Unit'
                    onChange={e => {
                      setSelectedUnitId(e.target.value)
                      onChange(e)
                    }}
                    error={Boolean(errors.unit_id)}
                    helperText={errors.unit_id?.message}
                  >
                    {units.map(data => (
                      <MenuItem key={data.id} value={data.id}>
                        {data.unit_name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4}>
              <Controller
                name='nisn'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='NISN'
                    onChange={onChange}
                    placeholder='1242324534'
                    error={Boolean(errors.nisn)}
                    helperText={errors.nisn?.message}
                    inputProps={{
                      inputMode: 'numeric',
                      pattern: '[0-9]*',
                      onKeyPress: event => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault() // Blocks any non-numeric input
                        }
                      }
                    }}
                  />
                )}
              />
            </Grid>

            {/* Full Name Field */}
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <Controller
                name='full_name'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Nama Lengkap'
                    onChange={onChange}
                    placeholder='Leonard'
                    error={Boolean(errors.full_name)}
                    helperText={errors.full_name?.message}
                  />
                )}
              />
            </Grid>

            {/* Email Field */}
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <Controller
                name='email'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    type='email'
                    value={value}
                    label='Email'
                    onChange={onChange}
                    placeholder='leonard@gmail.com'
                    error={Boolean(errors.email)}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name='phone'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value.startsWith('62') ? value : `62${value}`} // Ensure the value always starts with 62
                    label='No. Wa'
                    onChange={e => {
                      const newValue = e.target.value
                      
                      // Allow only numeric characters and prevent deletion of the '62' prefix
                      if (/^\d*$/.test(newValue)) {
                        if (newValue.startsWith('62')) {
                          onChange(newValue)
                        } else if (!newValue) {
                          // If input is cleared, reset it to '62'
                          onChange('62')
                        }
                      }
                    }}
                    placeholder='628123456789'
                    error={Boolean(errors.phone)}
                    helperText={errors.phone?.message}
                    inputProps={{ maxLength: 15 }} // Limit max length if necessary
                  />
                )}
              />
            </Grid>

            {/* Password Field */}
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <Controller
                name='password'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Password'
                    onChange={onChange}
                    type={showPassword ? 'text' : 'password'}
                    error={Boolean(errors.password)}
                    helperText={errors.password?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            aria-label='toggle password visibility'
                            onClick={handleClickShowPassword}
                            edge='end'
                          >
                            <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
            </Grid>

            {/* Class Dropdown */}
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <Controller
                name='class'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    value={value}
                    label='Kelas'
                    onChange={onChange}
                    error={Boolean(errors.class)}
                    helperText={errors.class?.message}
                  >
                    {filteredClasses.map(data => (
                      <MenuItem key={data.id} value={data.id}>
                        {data.class_name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>

            {/* Major Dropdown */}
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <Controller
                name='major'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    value={value}
                    label='Jurusan'
                    onChange={onChange}
                    error={Boolean(errors.major)}
                    helperText={errors.major?.message}
                  >
                    {filteredMajors.map(data => (
                      <MenuItem key={data.id} value={data.id}>
                        {data.major_name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>

            {/* Status Dropdown */}
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <Controller
                name='status'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    value={value}
                    label='Status'
                    onChange={onChange}
                    error={Boolean(errors.status)}
                    helperText={errors.status?.message}
                  >
                    <MenuItem value='ON'>ON</MenuItem>
                    <MenuItem value='OFF'>OFF</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>

            {/* Gambar Upload */}
            <Grid item xs={12} sm={6} md={4} lg={6}>
              <Controller
                name='gambar'
                control={control}
                render={({ field: { onChange } }) => (
                  <CustomTextField
                    fullWidth
                    name='gambar'
                    type='file'
                    label='Upload Gambar'
                    InputLabelProps={{
                      shrink: true
                    }}
                    inputProps={{
                      accept: 'image/*'
                    }}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      const file = event.target.files?.[0]
                      setGambarValue(file)
                      onChange(event)
                    }}
                    error={Boolean(errors.gambar)}
                    helperText={errors.gambar?.message}
                  />
                )}
              />
            </Grid>

            {/* Date of Birth Field */}
            <Grid item xs={12} sm={6} md={4} lg={6}>
              <Controller
                name='date_of_birth'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <DatePickerWrapper>
                    <DatePicker
                      selected={value ? new Date(value) : null}
                      onChange={(date: Date | null) => onChange(date)}
                      placeholderText='MM/DD/YYYY'
                      dateFormat='MM/dd/yyyy'
                      customInput={
                        <CustomInput
                          value={(value as any) ? (new Date(value).toLocaleDateString('en-US') as any) : ''}
                          onChange={onChange}
                          label='Tanggal Lahir'
                          error={Boolean(errors.date_of_birth)}
                          {...(errors.date_of_birth && { helperText: 'This field is required' })}
                        />
                      }
                    />
                  </DatePickerWrapper>
                )}
              />
            </Grid>

            {/* Address Field */}
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Controller
                name='address'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    multiline
                    rows={2}
                    value={value}
                    label='Alamat'
                    onChange={onChange}
                    placeholder='Jl Hr Agung'
                    error={Boolean(errors.address)}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>

            {/* Submit and Back Buttons */}
            <Grid item xs={12}>
              <Button type='submit' variant='contained' disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Submit'}
              </Button>
              <Box m={1} display='inline' />
              <Link href='/ms/siswa' passHref>
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
