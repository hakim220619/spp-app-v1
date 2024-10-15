import { useState, useEffect } from 'react'

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

interface SchoolForm {
  school_name: string
  address: string
  phone: string
  bank: string
  account_name: string
  account_number: string
  status: 'ON' | 'OFF'
  type_payment: string
}

interface TypePaymentOption {
  id: string
  tp_name: string
}

const schema = yup.object().shape({
  school_name: yup.string().required('School Name is required'),
  address: yup.string().required('Address is required'),
  phone: yup.string().required('Phone number is required'),
  bank: yup.string().required('Bank name is required'),
  account_name: yup.string().required('Account Name is required'),
  account_number: yup.string().required('Account Number is required'),
  status: yup.string().oneOf(['ON', 'OFF'], 'Invalid status').required('Status is required'),
  type_payment: yup.string().required('Type of Payment is required')
})

const SchoolFormComponent = () => {
  const router = useRouter()

  const defaultValues: SchoolForm = {
    school_name: '',
    address: '',
    phone: '',
    bank: '',
    account_name: '',
    account_number: '',
    status: 'ON',
    type_payment: ''
  }

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<SchoolForm>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })
  const [typePaymentOptions, setTypePaymentOptions] = useState<TypePaymentOption[]>([])

  useEffect(() => {
    const fetchTypePaymentOptions = async () => {
      const storedToken = window.localStorage.getItem('token')

      try {
        const response = await axiosConfig.get('/getTypePayment', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          }
        })
        setTypePaymentOptions(response.data)
      } catch (error) {
        console.error('Error fetching type payment options:', error)
        toast.error('Failed to load payment options')
      }
    }

    fetchTypePaymentOptions()
  }, [])

  const onSubmit = (data: SchoolForm) => {
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      formData.append(key, (data as any)[key])
    })

    const storedToken = window.localStorage.getItem('token')
    axiosConfig
      .post('/create-sekolah', formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${storedToken}`
        }
      })
      .then(response => {
        console.log(response)
        toast.success('Successfully Added School!')
        router.push('/ms/sekolah')
      })
      .catch(() => {
        toast.error('Failed to add school')
      })
  }

  return (
    <Card>
      <CardHeader title='Tambah Sekolah' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={6}>
              <Controller
                name='school_name'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value.toUpperCase()}
                    label='Nama Sekolah'
                    onChange={onChange}
                    placeholder='e.g. ABC School'
                    error={Boolean(errors.school_name)}
                    helperText={errors.school_name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='address'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Alamat'
                    onChange={onChange}
                    placeholder='e.g. Jl. Example No.1'
                    error={Boolean(errors.address)}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='phone'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Telepon'
                    onChange={onChange}
                    placeholder='e.g. 123-456-7890'
                    error={Boolean(errors.phone)}
                    helperText={errors.phone?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='bank'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Bank'
                    onChange={onChange}
                    placeholder='e.g. BCA'
                    error={Boolean(errors.bank)}
                    helperText={errors.bank?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='account_name'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Nama Rekening'
                    onChange={onChange}
                    placeholder='e.g. John Doe'
                    error={Boolean(errors.account_name)}
                    helperText={errors.account_name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='account_number'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Nomor Rekening'
                    onChange={onChange}
                    placeholder='e.g. 1234567890'
                    error={Boolean(errors.account_number)}
                    helperText={errors.account_number?.message}
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
            {/* Other fields */}
            <Grid item xs={6}>
              <Controller
                name='type_payment'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    value={value}
                    label='Tipe Pembayaran'
                    onChange={onChange}
                    error={Boolean(errors.type_payment)}
                    helperText={errors.type_payment?.message}
                  >
                    {typePaymentOptions.map(option => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.tp_name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type='submit' variant='contained'>
                Submit
              </Button>
              <Box m={1} display='inline' />
              <Button type='button' variant='contained' color='secondary' onClick={() => router.push('/ms/sekolah')}>
                Back
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default SchoolFormComponent
