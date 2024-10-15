import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import { Box } from '@mui/system'
import CustomTextField from 'src/@core/components/mui/text-field'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import axiosConfig from '../../../configs/axiosConfig'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface ClassForm {
  users: string
  bank: string
  account_name: string
  account_number: string
  type: string
  amount: string
  status: 'ON' | 'OFF'
}

const schema = yup.object().shape({
  users: yup.string().required('Users is required'),
  bank: yup.string().required('Bank is required'),
  account_name: yup.string().required('Account Name is required'),
  account_number: yup.string().required('Account Number is required'),
  amount: yup.string().required('Account Number is required'),
  status: yup.string().oneOf(['ON', 'OFF'], 'Invalid status').required('Status is required'),
  type: yup.string().oneOf(['SERVER', 'PERSON'], 'Invalid status').required('Type is required')
})

const ClassFormComponent = () => {
  const router = useRouter()
  const [affiliateUsers, setAffiliateUsers] = useState([])
  const [GetValueUserIdandSchoolId, onGetValueUserIdandSchoolId] = useState<any>()
  console.log(GetValueUserIdandSchoolId)

  const defaultValues: ClassForm = {
    users: '',
    bank: '',
    account_name: '',
    account_number: '',
    type: '',
    amount: '',
    status: 'ON'
  }

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ClassForm>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: ClassForm) => {
    const formData = new FormData()
    formData.append('user_id', GetValueUserIdandSchoolId.id)
    formData.append('school_id', GetValueUserIdandSchoolId.schoolId)
    formData.append('bank', data.bank.toUpperCase())
    formData.append('account_name', data.account_name.toUpperCase())
    formData.append('account_number', data.account_number)
    formData.append('amount', data.amount)
    formData.append('type', data.type)
    formData.append('status', data.status)
    console.log(formData)

    const storedToken = window.localStorage.getItem('token')
    axiosConfig
      .post('/create-account-affiliate', formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${storedToken}`
        }
      })
      .then(response => {
        console.log(response)

        toast.success('Successfully Added Account!')
        router.push('/ms/affiliate')
      })
      .catch(() => {
        toast.error('Failed to add account')
      })
  }
  useEffect(() => {
    // Fetch affiliate users from the API
    const fetchAffiliateUsers = async () => {
      const storedToken = window.localStorage.getItem('token') // Get the token from localStorage
      try {
        const response = await axiosConfig.get('/getUsersAffiliate', {
          headers: {
            Accept: 'application/json', // Add any additional headers if necessary
            Authorization: `Bearer ${storedToken}` // Include the token in the Authorization header
          }
        })
        setAffiliateUsers(response.data) // Assuming the response contains an array of users
      } catch (error) {
        toast.error('Failed to fetch affiliate users')
      }
    }

    fetchAffiliateUsers()
  }, [])
  const handleUserChange = (event: any) => {
    const [id, schoolId] = event.target.value.split(',')
    onGetValueUserIdandSchoolId({ id, schoolId }) // Store user_id and school_id
  }

  return (
    <Card>
      <CardHeader title='Tambah Akun' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={6}>
              <Controller
                name='users'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    value={value || ''} // Ensure value is never undefined
                    label='Affiliate User'
                    onChange={event => {
                      onChange(event) // Update the form state
                      handleUserChange(event) // Handle user ID and school ID
                    }}
                    error={Boolean(errors.users)}
                    helperText={errors.users?.message}
                  >
                    {affiliateUsers.map((user: any) => (
                      <MenuItem key={user.id} value={`${user.id},${user.school_id}`}>
                        {user.full_name} - {user.school_name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
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
            <Grid item xs={6}>
              <Controller
                name='type'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    value={value}
                    label='Tipe'
                    onChange={onChange}
                    error={Boolean(errors.status)}
                    helperText={errors.status?.message}
                  >
                    <MenuItem value='SERVER'>SERVER</MenuItem>
                    <MenuItem value='PERSON'>PERSON</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='amount'
                control={control}
                render={({ field: { value, onChange } }) => {
                  // Format the input value as Rupiah
                  const formatRupiah = (value: any) => {
                    if (!value) return ''

                    return (
                      'Rp. ' +
                      Number(value).toLocaleString('id-ID', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      })
                    )
                  }

                  // Handle change event
                  const handleChange = (event: any) => {
                    // Remove 'Rp. ' and format it
                    const rawValue = event.target.value.replace(/\D/g, '')
                    onChange(rawValue)
                  }

                  return (
                    <CustomTextField
                      fullWidth
                      value={formatRupiah(value)}
                      label='Biaya Server'
                      onChange={handleChange}
                      placeholder='e.g. Rp. '
                      error={Boolean(errors.amount)}
                      helperText={errors.amount?.message}
                    />
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type='submit' variant='contained'>
                Submit
              </Button>
              <Box m={1} display='inline' />
              <Button type='button' variant='contained' color='secondary' onClick={() => router.push('/ms/account')}>
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
