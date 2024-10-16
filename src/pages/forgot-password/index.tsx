// ** React Imports
import { ReactNode, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'

import Swal from 'sweetalert2'
import axiosConfig from 'src/configs/axiosConfig'

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

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main,
  fontSize: theme.typography.body1.fontSize
}))

const ForgotPassword = () => {
  // ** Hooks
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** State for form input
  const [input, setInput] = useState('')

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Mengirim permintaan POST ke endpoint API
      const response = await axiosConfig.post('/forgot-password', {
        emailOrWhatsapp: input
      })

      // Cek status respons dari server
      if (response.status === 200) {
        // Jika status 200, tampilkan pesan sukses
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Reset link has been sent to your email/Whatsapp!'
        })
      } else {
        // Jika status bukan 200, tampilkan pesan error dari server
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: response.data.message || 'Something went wrong!'
        })
      }
    } catch (error: any) {
      // Jika ada error dari catch block, tampilkan error lebih informatif
      if (error.response) {
        // Server merespons dengan status error (contoh: 400, 404, 500)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response.data.message || 'An error occurred on the server.'
        })
      } else if (error.request) {
        // Permintaan dibuat tetapi tidak ada respons
        Swal.fire({
          icon: 'error',
          title: 'Network Error',
          text: 'No response from the server. Please try again later.'
        })
      } else {
        // Terjadi kesalahan saat mengatur permintaan
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong while making the request.'
        })
      }
    }
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
          <img src='/images/logo.png' alt='Logo' width={400} height={400} />
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
            <Box sx={{ my: 6 }}>
              <Typography sx={{ mb: 1.5, fontWeight: 500, fontSize: '1.625rem', lineHeight: 1.385 }}>
                Forgot Password? 🔒
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Enter your email or Nomor Whatsapp and we&prime;ll send you instructions to reset your password
              </Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit}>
              <CustomTextField
                fullWidth
                autoFocus
                type='text'
                label='Email/No. Whatsapp'
                value={input}
                onChange={e => setInput(e.target.value)}
                sx={{ display: 'flex', mb: 4 }}
              />
              <Button
                fullWidth
                type='submit'
                variant='contained'
                sx={{ mb: 4 }}
                disabled={!input} // Disabled jika input kosong
              >
                Send reset link
              </Button>

              <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', '& svg': { mr: 1 } }}>
                <LinkStyled href='/login'>
                  <Icon fontSize='1.25rem' icon='tabler:chevron-left' />
                  <span>Back to login</span>
                </LinkStyled>
              </Typography>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}

ForgotPassword.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

ForgotPassword.guestGuard = true

export default ForgotPassword
