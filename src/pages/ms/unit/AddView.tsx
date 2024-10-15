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

interface UnitForm {
  unit_name: string
  unit_desc: string
  unit_status: 'ON' | 'OFF'
}

const schema = yup.object().shape({
  unit_name: yup.string().required('Unit Name is required'),
  unit_desc: yup.string().required('Unit Description is required'),
  unit_status: yup.string().oneOf(['ON', 'OFF'], 'Invalid Unit status').required('Unit Status is required')
})

const UnitFormComponent = () => {
  const router = useRouter()

  const defaultValues: UnitForm = {
    unit_name: '',
    unit_desc: '',
    unit_status: 'ON'
  }

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<UnitForm>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })
  const data = localStorage.getItem('userData') as string
  const getDataLocal = JSON.parse(data)
  const schoolId = getDataLocal?.school_id
  const onSubmit = (data: UnitForm) => {
    const formData = new FormData()
    formData.append('school_id', schoolId)
    formData.append('unit_name', data.unit_name.toUpperCase())
    formData.append('unit_desc', data.unit_desc.toUpperCase())
    formData.append('unit_status', data.unit_status)

    const storedToken = window.localStorage.getItem('token')
    axiosConfig
      .post('/create-unit', formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${storedToken}`
        }
      })
      .then(response => {
        console.log(response)
        toast.success('Successfully Added Unit!')
        router.push('/ms/unit')
      })
      .catch(() => {
        toast.error('Failed to add Unit')
      })
  }

  return (
    <Card>
      <CardHeader title='Tambah Unit' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={6}>
              <Controller
                name='unit_name'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Nama Unit'
                    onChange={onChange}
                    placeholder='e.g. Unit A'
                    error={Boolean(errors.unit_name)}
                    helperText={errors.unit_name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='unit_status'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    value={value}
                    label='Status'
                    onChange={onChange}
                    error={Boolean(errors.unit_status)}
                    helperText={errors.unit_status?.message}
                  >
                    <MenuItem value='ON'>ON</MenuItem>
                    <MenuItem value='OFF'>OFF</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='unit_desc'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Deskripsi'
                    onChange={onChange}
                    placeholder='Enter unit description'
                    error={Boolean(errors.unit_desc)}
                    helperText={errors.unit_desc?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Button type='submit' variant='contained'>
                Submit
              </Button>
              <Box m={1} display='inline' />
              <Button type='button' variant='contained' color='secondary' onClick={() => router.push('/ms/unit')}>
                Back
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default UnitFormComponent
