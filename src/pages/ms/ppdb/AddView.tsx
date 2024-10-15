import React, { useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import { Box } from '@mui/system'

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

interface FormData {
  nik: string
  date_of_birth: string
  email: string
  full_name: string
  phone: string
  unit_id: string // New field for unit
}

const schema = yup.object().shape({
  nik: yup.string().required('Nik is required'),
  date_of_birth: yup.date().required('Date of Birth is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  full_name: yup.string().required('Full Name is required'),
  phone: yup.string().required('Phone is required'),
  unit_id: yup.string().required('Unit is required') // Validation for unit
})

const PpdbForm = () => {
  const router = useRouter()
  const [units, setUnits] = useState([]) // State for unit options
  const userData = JSON.parse(localStorage.getItem('userData') as string)
  const defaultValues: FormData = {
    nik: '',
    date_of_birth: '',
    email: '',
    full_name: '',
    phone: '',
    unit_id: ''
  }

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axiosConfig.get('/getUnit', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${window.localStorage.getItem('token')}`
          }
        })

        const userData = JSON.parse(localStorage.getItem('userData') as any)
        const schoolId = userData ? userData.school_id : null // Retrieve school_id from userData

        if (schoolId) {
          const filteredUnits = response.data.filter((unit: any) => unit.school_id === schoolId)
          setUnits(filteredUnits) // Set the filtered units
        } else {
          console.warn('No school_id found in userData')
          setUnits([]) // Handle no school_id case
        }
      } catch (error) {
        console.error('Failed to fetch units:', error)
        toast.error('Failed to load units')
      }
    }

    fetchUnits()
  }, [])

  const onSubmit = (data: FormData) => {
    const date = new Date(data.date_of_birth)
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')}`

    const formData = new FormData()
    formData.append('nik', data.nik)
    formData.append('date_of_birth', formattedDate)
    formData.append('email', data.email)
    formData.append('full_name', data.full_name)
    formData.append('phone', data.phone)
    formData.append('unit_id', data.unit_id)
    formData.append('school_id', userData.school_id)
    console.log(formData)
    const storedToken = window.localStorage.getItem('token')
    axiosConfig
      .post('/registerSiswa', formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${storedToken}`
        }
      })
      .then(response => {
        console.log(response)

        toast.success('Successfully Added Student!')
        router.push('/ms/ppdb')
      })
      .catch(() => {
        toast.error('Failed to add student')
      })
  }

  return (
    <Card>
      <CardHeader title='Add Student' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6} md={4} lg={6}>
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
                    {units.map((unit: any) => (
                      <MenuItem key={unit.id} value={unit.id}>
                        {unit.unit_name}
                      </MenuItem> // Assuming each unit has an id and a name
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={6}>
              <Controller
                name='nik'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Nik'
                    onChange={onChange}
                    placeholder='1242324534'
                    error={Boolean(errors.nik)}
                    helperText={errors.nik?.message}
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

            <Grid item xs={12} sm={6} md={4} lg={6}>
              <Controller
                name='email'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Email'
                    onChange={onChange}
                    placeholder='Enter email'
                    error={Boolean(errors.email)}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={6}>
              <Controller
                name='full_name'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Nama Lengkap'
                    onChange={onChange}
                    placeholder='Enter full name'
                    error={Boolean(errors.full_name)}
                    helperText={errors.full_name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={6}>
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
            <Grid item xs={12} sm={6} md={4} lg={6}>
              <Controller
                name='date_of_birth'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    type='date'
                    label='Tanggal Lahir'
                    value={value} // Ensure you're using the value from the field
                    onChange={onChange} // Handle the change event correctly
                    error={Boolean(errors.date_of_birth)} // Use the correct error reference
                    helperText={errors.date_of_birth ? 'This field is required' : ''}
                    InputLabelProps={{
                      shrink: true // Ensures the label stays in place when the date picker is used
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Button type='submit' variant='contained'>
                Simpan
              </Button>
              <Box m={1} display='inline' />
              <Button type='button' variant='contained' color='secondary' onClick={() => router.push('/ms/ppdb')}>
                Kembali
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default PpdbForm
