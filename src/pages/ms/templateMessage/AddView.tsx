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
import { TextField } from '@mui/material'

interface FormInputs {
  school_id: string
  template_name: string
  deskripsi: string
  message: string
  status: 'ON' | 'OFF'
}

const schema = yup.object().shape({
  school_id: yup.string().required('School ID is required'),
  template_name: yup.string().required('Template Name is required'),
  deskripsi: yup.string().required('Deskripsi is required'),
  status: yup.string().oneOf(['ON', 'OFF'], 'Invalid status').required('Status is required')
})

const ClassFormComponent = () => {
  const router = useRouter()
  const [schools, setSchools] = useState([]) // State for school options
  const [message, setMessage] = useState('')
  const defaultValues: FormInputs = {
    school_id: '',
    template_name: '',
    deskripsi: '',
    message: '',
    status: 'ON'
  }

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInputs>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axiosConfig.get('/getSchool', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${window.localStorage.getItem('token')}`
          }
        })
        setSchools(response.data) // Assuming response.data is an array of schools
      } catch (error) {
        console.error('Failed to fetch schools:', error)
        toast.error('Failed to load schools')
      }
    }

    fetchSchools()
  }, [])

  const onSubmit = (data: FormInputs) => {
    const formData = new FormData()
    formData.append('school_id', data.school_id)
    formData.append('template_name', data.template_name)
    formData.append('deskripsi', data.deskripsi)
    formData.append('message', message)
    formData.append('status', data.status)
    console.log(formData)

    const storedToken = window.localStorage.getItem('token')
    axiosConfig
      .post('/create-templateMessage', formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${storedToken}`
        }
      })
      .then(response => {
        console.log(response)
        toast.success('Successfully Added Template!')
        router.push('/ms/templateMessage') // Adjust the route as necessary
      })
      .catch(() => {
        toast.error('Failed to add template')
      })
  }
  const nama_variable = '${nama_variable}'

  return (
    <Card>
      <CardHeader title='Tambah Template' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={6}>
              <Controller
                name='school_id'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    value={value}
                    label='School'
                    onChange={onChange}
                    error={Boolean(errors.school_id)}
                    helperText={errors.school_id?.message}
                  >
                    {schools.map((school: any) => (
                      <MenuItem key={school.id} value={school.id}>
                        {school.school_name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='template_name'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Template Name'
                    onChange={onChange}
                    placeholder='e.g. Template A'
                    error={Boolean(errors.template_name)}
                    helperText={errors.template_name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='deskripsi'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Deskripsi'
                    onChange={onChange}
                    placeholder='Enter deskripsi'
                    error={Boolean(errors.deskripsi)}
                    helperText={errors.deskripsi?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
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
            <Grid item xs={12} md={12}>
              <TextField
                fullWidth
                rows={12}
                multiline
                label={
                  <>
                    Message:{' '}
                    <span style={{ color: 'red' }}>
                      Harap tidak mengganti {nama_variable} karena sudah menjadi bagian dari default sistem
                    </span>
                  </>
                }
                value={message} // Menggunakan state sebagai nilai TextField
                onChange={e => setMessage(e.target.value)} // Update state saat input berubah
                id='textarea-outlined-static'
              />
            </Grid>

            <Grid item xs={12}>
              <Button type='submit' variant='contained'>
                Submit
              </Button>
              <Box m={1} display='inline' />
              <Button
                type='button'
                variant='contained'
                color='secondary'
                onClick={() => router.push('/ms/templateMessage')}
              >
                Back
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default ClassFormComponent
