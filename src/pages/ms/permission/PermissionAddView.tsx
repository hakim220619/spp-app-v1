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

interface FormInputs {
  school_id: string
  title: string
  icon: string
  path: string
  role: string
  status: 'ON' | 'OFF'
}

const schema = yup.object().shape({
  school_id: yup.string().required('School ID is required'),
  title: yup.string().required('Title is required'),
  role: yup.string().required('Role is required'),
  status: yup.string().oneOf(['ON', 'OFF'], 'Invalid status').required('Status is required')
})

const ClassFormComponent = () => {
  const router = useRouter()
  const [schools, setSchools] = useState([]) // State for school options
  const [roles, setRoles] = useState([]) // State for role options

  const defaultValues: FormInputs = {
    school_id: '',
    title: '',
    icon: '',
    path: '',
    role: '',
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

    const fetchRoles = async () => {
      try {
        const response = await axiosConfig.get('/getRole', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${window.localStorage.getItem('token')}`
          }
        })
        setRoles(response.data) // Assuming response.data is an array of roles
      } catch (error) {
        console.error('Failed to fetch roles:', error)
        toast.error('Failed to load roles')
      }
    }

    fetchSchools()
    fetchRoles()
  }, [])

  const onSubmit = (data: FormInputs) => {
    const formData = new FormData()
    formData.append('school_id', data.school_id)
    formData.append('title', data.title)
    formData.append('icon', data.icon)
    formData.append('path', data.path)
    formData.append('role', data.role)
    formData.append('status', data.status)
    console.log(formData)

    const storedToken = window.localStorage.getItem('token')
    axiosConfig
      .post('/create-permission', formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${storedToken}`
        }
      })
      .then(response => {
        console.log(response)
        toast.success('Successfully Added Class!')
        router.push('/ms/permission') // Adjust the route as necessary
      })
      .catch(() => {
        toast.error('Failed to add class')
      })
  }

  return (
    <Card>
      <CardHeader title='Tambah Kelas' />
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
                name='title'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Title'
                    onChange={onChange}
                    placeholder='e.g. Class A'
                    error={Boolean(errors.title)}
                    helperText={errors.title?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='icon'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Icon'
                    onChange={onChange}
                    placeholder='Enter icon URL'
                    error={Boolean(errors.icon)}
                    helperText={errors.icon?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='path'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Path'
                    onChange={onChange}
                    placeholder='Enter path'
                    error={Boolean(errors.path)}
                    helperText={errors.path?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='role'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    value={value}
                    label='Role'
                    onChange={onChange}
                    error={Boolean(errors.role)}
                    helperText={errors.role?.message}
                  >
                    {roles.map((role: any) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.role_name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
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

            <Grid item xs={12}>
              <Button type='submit' variant='contained'>
                Submit
              </Button>
              <Box m={1} display='inline' />
              <Button type='button' variant='contained' color='secondary' onClick={() => router.push('/ms/classes')}>
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
