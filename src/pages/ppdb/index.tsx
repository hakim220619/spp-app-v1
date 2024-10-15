import { ReactNode, useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'
import CircularProgress from '@mui/material/CircularProgress'
import CustomTextField from 'src/@core/components/mui/text-field'
import Swal from 'sweetalert2'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useSettings } from 'src/@core/hooks/useSettings'
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import { MenuItem } from '@mui/material'
import axiosConfig from 'src/configs/axiosConfig'
import Link from 'next/link'

const RegisterIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 600,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750
  }
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1.75),
  '& .MuiFormControlLabel-label': {
    color: theme.palette.text.secondary
  }
}))
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const Register = () => {
  const schoolId = 530
  const [loading, setLoading] = useState<boolean>(false)
  const [checked, setChecked] = useState(false) // Set default to false
  const [formData, setFormData] = useState({
    nik: '',
    full_name: '',
    email: '',
    phone: '62',
    date_of_birth: '',
    unit_id: '',
    school_id: schoolId
  })
  const [units, setUnits] = useState([])
  const [formErrors, setFormErrors] = useState<any>({})
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)

  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const { skin } = settings
  const imageSource = skin === 'bordered' ? 'auth-v2-register-illustration-bordered' : 'auth-v2-register-illustration'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleValidation = () => {
    const errors: any = {} // Use 'const' instead of 'let'
    let formIsValid = true

    // Validate NIK
    if (!formData.nik) {
      formIsValid = false
      errors['nik'] = 'NIK is required'
    }

    // Validate full name
    if (!formData.full_name) {
      formIsValid = false
      errors['full_name'] = 'Full Name is required'
    }

    // Validate email
    if (!formData.email) {
      formIsValid = false
      errors['email'] = 'Email is required'
    }

    // Validate phone
    if (!formData.phone || formData.phone.length < 10) {
      formIsValid = false
      errors['phone'] = 'Phone number is required'
    }

    // Validate date of birth
    if (!formData.date_of_birth) {
      formIsValid = false
      errors['date_of_birth'] = 'Date of Birth is required'
    }

    // Validate unit_id
    if (!formData.unit_id) {
      formIsValid = false
      errors['unit_id'] = 'You must select a unit'
    }

    setFormErrors(errors)

    return formIsValid
  }

  const isFormComplete = () => {
    return (
      formData.nik &&
      formData.full_name &&
      formData.email &&
      formData.phone &&
      formData.date_of_birth &&
      formData.unit_id &&
      isCheckboxChecked
    )
  }
  console.log(checked)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (handleValidation()) {
      setLoading(true)
      setTimeout(async () => {
        try {
          const response = await axiosConfig.post('/registerSiswa', formData)
          console.log('Result from API:', response.data)
          setChecked(false)
          Swal.fire({
            title: 'Registrasi Siswa Baru Berhasil',
            text: 'Segera cek nomor wa anda untuk melakukan proses pembayaran.',
            icon: 'success',
            confirmButtonText: 'OK'
          })

          setFormData({
            nik: '',
            full_name: '',
            email: '',
            phone: '62',
            date_of_birth: '',
            unit_id: '',
            school_id: schoolId
          })
        } catch (error) {
          console.error('Error:', error)
          Swal.fire({
            title: 'Error',
            text: 'Terjadi kesalahan saat registrasi, silakan coba lagi.',
            icon: 'error',
            confirmButtonText: 'OK'
          })
        } finally {
          setLoading(false)
        }
      }, 3000)
    }
  }

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axiosConfig.get('/getUnits')
        const filteredUnits = response.data.filter((unit: any) => unit.school_id === schoolId)
        setUnits(filteredUnits)
      } catch (error) {
        console.error('Error fetching units:', error)
      }
    }

    fetchUnits()
  }, [])

  const handleCheckboxChange = (event: any) => {
    setIsCheckboxChecked(event.target.checked)
    setChecked(event.target.checked)
  }

  return (
    <Box className='content-right' sx={{ backgroundColor: 'background.paper' }}>
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            borderRadius: '20px',
            justifyContent: 'center',
            backgroundColor: 'customColors.bodyBg',
            margin: theme => theme.spacing(8, 0, 8, 8)
          }}
        >
          <RegisterIllustration
            alt='register-illustration'
            src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
          />
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper>
        <Box
          sx={{
            p: [6, 12],
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <Box display='flex' justifyContent='center' alignItems='center'>
              <img src='/images/logo.png' alt='Logo' width={100} height={100} />
            </Box>
            <Box sx={{ my: 6 }}>
              <Typography variant='h3' sx={{ mb: 1.5 }}>
                Registrasi Siswa Baru 🚀
              </Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit}>
              <CustomTextField
                select
                fullWidth
                name='unit_id'
                value={formData.unit_id}
                onChange={handleChange as any}
                label='Pilih Unit'
                error={!!formErrors.unit_id}
                helperText={formErrors.unit_id}
              >
                {units.map((unit: any) => (
                  <MenuItem key={unit.id} value={unit.id}>
                    {unit.unit_name}
                  </MenuItem>
                ))}
              </CustomTextField>

              <CustomTextField
                fullWidth
                name='nik'
                value={formData.nik}
                onChange={(e: any) => {
                  const numericValue = e.target.value.replace(/[^0-9]/g, '')
                  setFormData({ ...formData, nik: numericValue })
                }}
                label='Nik'
                placeholder='123456789'
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                error={!!formErrors.nik}
                helperText={formErrors.nik}
              />

              <CustomTextField
                fullWidth
                name='full_name'
                value={formData.full_name.toUpperCase()}
                onChange={handleChange as any}
                label='Nama Lengkap'
                error={!!formErrors.full_name}
                helperText={formErrors.full_name}
              />

              <CustomTextField
                fullWidth
                name='email'
                value={formData.email}
                onChange={handleChange as any}
                label='Email'
                error={!!formErrors.email}
                helperText={formErrors.email}
              />

              <CustomTextField
                fullWidth
                name='phone'
                value={formData.phone}
                onChange={(e: any) => {
                  let value = e.target.value.replace(/[^0-9]/g, '')

                  if (!value.startsWith('62')) {
                    value = '62' + value
                  }

                  setFormData({ ...formData, phone: value })
                }}
                label='No. Wa'
                error={!!formErrors.phone}
                helperText={formErrors.phone}
              />

              <CustomTextField
                fullWidth
                type='date'
                name='date_of_birth'
                value={formData.date_of_birth}
                onChange={handleChange as any}
                label='Tanggal Lahir'
                error={!!formErrors.date_of_birth}
                helperText={formErrors.date_of_birth}
              />

              <FormControlLabel
                control={<Checkbox checked={checked} onChange={handleCheckboxChange} />}
                label='Saya setuju dengan kebijakan privasi dan syarat ketentuan.'
              />

              <Button fullWidth type='submit' variant='contained' disabled={!isFormComplete()}>
                Register
              </Button>
              <Box m={1} display='inline'></Box>

              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography sx={{ color: 'text.secondary', mr: 2 }}>Sudah Punya Akun?</Typography>
                <Typography href='/ppdb/login' component={LinkStyled}>
                  Login
                </Typography>
              </Box>
            </form>
          </Box>
        </Box>
      </RightWrapper>
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999
          }}
        >
          <CircularProgress color='primary' />
        </Box>
      )}
    </Box>
  )
}

Register.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

Register.guestGuard = true

export default Register
