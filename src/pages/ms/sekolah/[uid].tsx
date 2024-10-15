import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

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

interface FormValues {
  school_name: string
  address: string
  phone: string
  bank: string
  account_name: string
  account_number: string
  status: string
  type_payment: string
}

interface TypePaymentOption {
  id: string // Ensure id is a string for consistency
  tp_name: string
}

const FormValidationSchema = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      school_name: '',
      address: '',
      phone: '',
      bank: '',
      account_name: '',
      account_number: '',
      status: 'ON',
      type_payment: '' // Initialize as empty string
    }
  })

  const [typePaymentOptions, setTypePaymentOptions] = useState<TypePaymentOption[]>([])

  const router = useRouter()
  const { uid } = router.query

  // Retrieve token safely (avoids SSR issues)
  const storedToken = typeof window !== 'undefined' ? window.localStorage.getItem('token') : null

  // Fetch Type Payment Options
  useEffect(() => {
    const fetchTypePaymentOptions = async () => {
      if (!storedToken) {
        toast.error('Authentication token not found.')

        return
      }

      try {
        const response = await axiosConfig.get('/getTypePayment', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          }
        })
        const options: TypePaymentOption[] = response.data.map((option: any) => ({
          id: String(option.id),
          tp_name: option.tp_name
        }))
        setTypePaymentOptions(options)
      } catch (error) {
        console.error('Error fetching type payment options:', error)
        toast.error('Failed to load payment options')
      }
    }

    fetchTypePaymentOptions()
  }, [storedToken])

  // Fetch School Details and Populate Form Fields
  useEffect(() => {
    const fetchSchoolDetails = async () => {
      if (!storedToken || !uid) {
        return
      }

      try {
        const response = await axiosConfig.post(
          '/detailSekolah',
          { uid },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${storedToken}`
            }
          }
        )
        const { school_name, address, phone, bank, account_name, account_number, status, type_payment } = response.data

        // Log fetched data for debugging
        console.log('Fetched School Details:', {
          school_name,
          address,
          phone,
          bank,
          account_name,
          account_number,
          status,
          type_payment
        })

        // Set form values
        setValue('school_name', school_name)
        setValue('address', address)
        setValue('phone', phone)
        setValue('bank', bank)
        setValue('account_name', account_name)
        setValue('account_number', account_number)
        setValue('status', status)
        setValue('type_payment', String(type_payment)) // Ensure it's a string
      } catch (error) {
        console.error('Error fetching school details:', error)
        toast.error('Failed to load school details')
      }
    }

    fetchSchoolDetails()
  }, [storedToken, uid, setValue])

  const onSubmit = async (data: FormValues) => {
    const formData = {
      ...data,
      id: uid
    }

    if (!storedToken) {
      toast.error('Authentication token not found.')

      return
    }
    console.log(formData)

    try {
      await axiosConfig.post(
        '/update-sekolah',
        { data: formData },
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          }
        }
      )
      toast.success('Successfully Updated!')
      router.push('/ms/sekolah')
    } catch (error) {
      console.error('Error updating school:', error)
      toast.error("Failed. This didn't work.")
    }
  }

  return (
    <Card>
      <CardHeader title='Update Sekolah' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            {/* School Name Field */}
            <Grid item xs={6}>
              <Controller
                name='school_name'
                control={control}
                rules={{ required: 'School name is required' }}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='School Name'
                    {...field}
                    onChange={e => field.onChange(e.target.value.toUpperCase())} // Convert to uppercase on change
                    value={field.value || ''} // Ensure the field has a value
                    error={!!errors.school_name}
                    helperText={errors.school_name?.message}
                  />
                )}
              />
            </Grid>

            {/* Address Field */}
            <Grid item xs={6}>
              <Controller
                name='address'
                control={control}
                rules={{ required: 'Address is required' }}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Address'
                    {...field}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>

            {/* Phone Field */}
            <Grid item xs={6}>
              <Controller
                name='phone'
                control={control}
                rules={{ required: 'Phone is required' }}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Phone'
                    {...field}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                )}
              />
            </Grid>

            {/* Bank Field */}
            <Grid item xs={6}>
              <Controller
                name='bank'
                control={control}
                rules={{ required: 'Bank is required' }}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Bank'
                    {...field}
                    error={!!errors.bank}
                    helperText={errors.bank?.message}
                  />
                )}
              />
            </Grid>

            {/* Account Name Field */}
            <Grid item xs={6}>
              <Controller
                name='account_name'
                control={control}
                rules={{ required: 'Account Name is required' }}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Account Name'
                    {...field}
                    error={!!errors.account_name}
                    helperText={errors.account_name?.message}
                  />
                )}
              />
            </Grid>

            {/* Account Number Field */}
            <Grid item xs={6}>
              <Controller
                name='account_number'
                control={control}
                rules={{ required: 'Account Number is required' }}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Account Number'
                    {...field}
                    error={!!errors.account_number}
                    helperText={errors.account_number?.message}
                  />
                )}
              />
            </Grid>

            {/* Status Field */}
            <Grid item xs={6}>
              <Controller
                name='status'
                control={control}
                render={({ field }) => (
                  <CustomTextField select fullWidth label='Status' {...field}>
                    <MenuItem value='ON'>ON</MenuItem>
                    <MenuItem value='OFF'>OFF</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>

            {/* Type of Payment Field */}
            <Grid item xs={6}>
              <Controller
                name='type_payment'
                control={control}
                rules={{ required: 'Type of Payment is required' }}
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
                    {/* Optional: Add a placeholder MenuItem */}
                    <MenuItem value=''>
                      <em>Select Payment Type</em>
                    </MenuItem>
                    {typePaymentOptions.map(option => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.tp_name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button type='submit' variant='contained'>
                Save
              </Button>
              <Box m={1} display='inline'></Box>
              <Link href='/ms/sekolah' passHref>
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
