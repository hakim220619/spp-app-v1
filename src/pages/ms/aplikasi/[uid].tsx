import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import toast from 'react-hot-toast'

// Axios Import
import axiosConfig from '../../../configs/axiosConfig'
import { useRouter } from 'next/router'
import Link from 'next/link'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Box } from '@mui/system'

const FormValidationSchema = () => {
  const { handleSubmit } = useForm()

  const router = useRouter()
  const { uid } = router.query
  const storedToken = window.localStorage.getItem('token')

  // Initial states for form fields
  const [formData, setFormData] = useState({
    school_name: '',
    owner: '',
    phone: '',
    title: '',
    aplikasi_name: '',
    logo: '',
    copy_right: '',
    versi: '',
    token_whatsapp: '',
    urlCreateTransaksiMidtrans: '',
    urlCekTransaksiMidtrans: '',
    claientKey: '',
    serverKey: ''
  })

  useEffect(() => {
    if (storedToken) {
      axiosConfig
        .post(
          '/detailAplikasi',
          { uid },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${storedToken}`
            }
          }
        )
        .then(response => {
          const data = response.data
          setFormData({
            school_name: data.school_name || '',
            owner: data.owner || '',
            phone: data.phone || '',
            title: data.title || '',
            aplikasi_name: data.aplikasi_name || '',
            logo: data.logo || '',
            copy_right: data.copy_right || '',
            versi: data.versi || '',
            token_whatsapp: data.token_whatsapp || '',
            urlCreateTransaksiMidtrans: data.urlCreateTransaksiMidtrans || '',
            urlCekTransaksiMidtrans: data.urlCekTransaksiMidtrans || '',
            claientKey: data.claientKey || '',
            serverKey: data.serverKey || ''
          })
        })
        .catch(error => {
          console.error('Error fetching class details:', error)
        })
    }
  }, [uid, storedToken])

  const onSubmit = (data: any) => {
    const updatedData = {
      uid,
      ...formData,
      ...data
    }

    if (storedToken) {
      axiosConfig
        .post(
          '/update-aplikasi',
          { data: updatedData },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${storedToken}`
            }
          }
        )
        .then(() => {
          toast.success('Successfully Updated!')
          router.push('/ms/aplikasi')
        })
        .catch(() => {
          toast.error("Failed. This didn't work.")
        })
    }
  }

  return (
    <Card>
      <CardHeader title='Update Aplikasi' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            {/* School ID Field */}
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                label='School ID'
                value={formData.school_name}
                onChange={e => setFormData({ ...formData, school_name: e.target.value })}
                placeholder='School ID'
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>

            {/* Owner Field */}
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                label='Owner'
                value={formData.owner}
                onChange={e => setFormData({ ...formData, owner: e.target.value })}
                placeholder='Owner'
              />
            </Grid>

            {/* Phone Field */}
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                label='Phone'
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder='Phone'
              />
            </Grid>

            {/* Title Field */}
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                label='Title'
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder='Title'
              />
            </Grid>

            {/* Aplikasi Name Field */}
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                label='Aplikasi Name'
                value={formData.aplikasi_name}
                onChange={e => setFormData({ ...formData, aplikasi_name: e.target.value })}
                placeholder='Aplikasi Name'
              />
            </Grid>

            {/* Logo Field */}
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                label='Logo'
                value={formData.logo}
                onChange={e => setFormData({ ...formData, logo: e.target.value })}
                placeholder='Logo URL'
              />
            </Grid>

            {/* Copyright Field */}
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                label='Copyright'
                value={formData.copy_right}
                onChange={e => setFormData({ ...formData, copy_right: e.target.value })}
                placeholder='Copyright Text'
              />
            </Grid>

            {/* Versi Field */}
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                label='Versi'
                value={formData.versi}
                onChange={e => setFormData({ ...formData, versi: e.target.value })}
                placeholder='Version'
              />
            </Grid>

            {/* Token WhatsApp Field */}
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                label='Token WhatsApp'
                value={formData.token_whatsapp}
                onChange={e => setFormData({ ...formData, token_whatsapp: e.target.value })}
                placeholder='WhatsApp Token'
              />
            </Grid>

            {/* URL Create Transaksi Midtrans */}
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                label='URL Create Transaksi Midtrans'
                value={formData.urlCreateTransaksiMidtrans}
                onChange={e => setFormData({ ...formData, urlCreateTransaksiMidtrans: e.target.value })}
                placeholder='URL Create Transaksi'
              />
            </Grid>

            {/* URL Cek Transaksi Midtrans */}
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                label='URL Cek Transaksi Midtrans'
                value={formData.urlCekTransaksiMidtrans}
                onChange={e => setFormData({ ...formData, urlCekTransaksiMidtrans: e.target.value })}
                placeholder='URL Cek Transaksi'
              />
            </Grid>

            {/* Client Key */}
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                label='Client Key'
                value={formData.claientKey}
                onChange={e => setFormData({ ...formData, claientKey: e.target.value })}
                placeholder='Client Key'
              />
            </Grid>

            {/* Server Key */}
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                label='Server Key'
                value={formData.serverKey}
                onChange={e => setFormData({ ...formData, serverKey: e.target.value })}
                placeholder='Server Key'
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button type='submit' variant='contained'>
                Save
              </Button>
              <Box m={1} display='inline'></Box>
              <Link href='/ms/aplikasi' passHref>
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
