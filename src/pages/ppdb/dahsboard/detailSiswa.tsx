import React, { useEffect, useState } from 'react'
import { Grid } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'

interface DetailSiswaProps {
  data: {
    no_registrasi: string
    nik: string
    date_of_birth: string
    full_name: string
    phone: string
    username: string
    email: string
    status_pembayaran: string
  }
  icon: React.ReactNode
}

const DetailSiswa: React.FC<DetailSiswaProps> = props => {
  const { data } = props

  // Initialize states for each field
  const [noRegistrasi, setNoRegistrasi] = useState(data?.no_registrasi || '')
  const [nik, setNik] = useState(data?.nik || '')
  const [dateOfBirth, setDateOfBirth] = useState(data?.date_of_birth || '')
  const [fullName, setFullName] = useState(data?.full_name || '')
  const [phone, setPhone] = useState(data?.phone || '')
  const [username, setUsername] = useState(data?.username || '')
  const [email, setEmail] = useState(data?.email || '')
  const [statusPembayaran, setStatusPembayaran] = useState(data?.status_pembayaran || '')

  useEffect(() => {
    if (data) {
      setNoRegistrasi(data.no_registrasi || '')
      setNik(data.nik || '')
      setDateOfBirth(data.date_of_birth || '')
      setFullName(data.full_name || '')
      setPhone(data.phone || '')
      setUsername(data.username || '')
      setEmail(data.email || '')
      setStatusPembayaran(data.status_pembayaran || '')
    }
  }, [data])
  function formatDate(dateString: any) {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0') // Bulan mulai dari 0 di JavaScript
    const year = date.getFullYear()
    
    return `${day}-${month}-${year}`
  }

  return (
    <Grid container spacing={2} sx={{ margin: '20px' }}>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          fullWidth
          label='No Registrasi'
          value={noRegistrasi}
          placeholder='123456'
          InputProps={{
            readOnly: true
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          fullWidth
          label='NIK'
          value={nik}
          placeholder='9876543210'
          InputProps={{
            readOnly: true
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          fullWidth
          label='Date of Birth'
          value={formatDate(dateOfBirth)}
          placeholder='YYYY-MM-DD'
          InputProps={{
            readOnly: true
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          fullWidth
          label='Full Name'
          value={fullName}
          placeholder='Carter Leonard'
          InputProps={{
            readOnly: true
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          fullWidth
          label='Phone'
          value={phone}
          placeholder='08123456789'
          InputProps={{
            readOnly: true
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          fullWidth
          label='Username'
          value={username}
          placeholder='carterLeonard'
          InputProps={{
            readOnly: true
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          fullWidth
          label='Status Pembayaran'
          value={statusPembayaran === 'Paid' ? 'Lunas' : 'Belum Lunas'}
          placeholder='Lunas/Belum Lunas'
          InputProps={{
            readOnly: true
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <CustomTextField
          fullWidth
          type='email'
          label='Email'
          value={email}
          placeholder='carterleonard@gmail.com'
          InputProps={{
            readOnly: true
          }}
        />
      </Grid>
    </Grid>
  )
}

export default DetailSiswa
