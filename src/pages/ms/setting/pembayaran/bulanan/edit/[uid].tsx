// ** React Imports
import { ChangeEvent, useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import InputLabel from '@mui/material/InputLabel'
import toast from 'react-hot-toast'
import axiosConfig from '../../../../../../configs/axiosConfig'
import { useRouter } from 'next/router'
import { CircularProgress } from '@mui/material'

const AddPaymentDetailByClass = () => {
  const [SpByUid, setSpByUid] = useState<string[]>([])
  const [spName, setSpName] = useState<string>('')
  const [years, setYears] = useState<string>('')
  const [spType, setSpType] = useState<string>('')
  const [kelas] = useState<string>('')
  const [ClassName, setClassName] = useState<any[]>([])
  const [major] = useState<string>('')
  const [MajorName, setMajorName] = useState<any[]>([])
  const [months, setMonths] = useState<any[]>([])
  const [amount] = useState<string>('')
  const [Loading, setLoading] = useState<boolean>(false)
  const userData = JSON.parse(localStorage.getItem('userData') as string)
  const storedToken = window.localStorage.getItem('token')
  const schoolId = userData.school_id
  const router = useRouter()
  const { uid } = router.query

  const handleMonthChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const updatedMonths = [...months]
    const numericValue = event.target.value.replace(/\D/g, '')
    const formattedValue = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(parseInt(numericValue || '0', 10))
    updatedMonths[index].amount = formattedValue
    setMonths(updatedMonths)
  }

  useEffect(() => {
    if (storedToken) {
      axiosConfig
        .post(
          '/detailSettingPembayaranByUid',
          { uid },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${storedToken}`
            }
          }
        )
        .then(response => {
          setMonths(response.data)
          response.data.forEach(
            (item: {
              setting_payment_uid: any
              sp_name: any
              years: any
              sp_type: any
              class_name: any
              major_name: any
            }) => {
              const { setting_payment_uid, sp_name, years, sp_type, class_name, major_name } = item
              setSpByUid(setting_payment_uid)
              setSpName(sp_name)
              setYears(years)
              setSpType(sp_type)
              setClassName(class_name)
              setMajorName(major_name)
            }
          )
        })
        .catch(error => {
          console.error('Error fetching class details:', error)
        })
    }
  }, [uid, storedToken])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true) // Set loading to true when the form is submitted
    const formData = {
      setting_payment_uid: SpByUid,
      school_id: schoolId,
      sp_name: spName,
      years: years,
      sp_type: spType,
      class_id: kelas,
      major_id: major,
      amount: amount,
      uid: uid,
      months: months.map(month => {
        let cleanedPayment = month.amount

        // Check if payment contains "Rp", ".", or spaces
        if (/Rp|\.|\s/.test(cleanedPayment)) {
          // Remove "Rp.", "." and spaces from the payment value
          cleanedPayment = cleanedPayment.replace(/[Rp.\s]/g, '')
        }

        // Convert the cleaned payment to an integer
        const numericPayment = parseInt(cleanedPayment, 10) || 0 // Ensure it defaults to 0 if NaN

        return {
          payment: numericPayment, // Use the cleaned and converted integer value
          id: month.month_id // ID for the month
        }
      })
    }
    try {
      const response = await axiosConfig.post('/update-payment-updateSettingPaymentByMonth', formData, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${storedToken}`
        }
      })
      if (response.status === 200) {
        toast.success('Pembayaran berhasil disimpan!')
        window.history.back()
      } else {
        toast.error('Terjadi kesalahan saat menyimpan pembayaran. Silakan coba lagi.')
      }
    } catch (error: any) {
      toast.error('Terjadi kesalahan saat menyimpan pembayaran: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false) // Set loading to false after the request completes
    }
  }

  return (
    <Card>
      <CardHeader title='Tambah Pembayaran Baru' />
      <Divider />
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                Pembayaran Details
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <InputLabel>Nama Pembayaran</InputLabel>
              <TextField fullWidth value={spName} InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <InputLabel>Tahun</InputLabel>
              <TextField fullWidth value={years} InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <InputLabel>Tipe</InputLabel>
              <TextField fullWidth value={spType} InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>Kelas</InputLabel>
              <TextField fullWidth value={ClassName} InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>Jurusan</InputLabel>
              <TextField fullWidth value={MajorName} InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                Bulan
              </Typography>
            </Grid>
            {months.map((data, index) => (
              <Grid item xs={12} sm={3} key={index}>
                <InputLabel>{data.month}</InputLabel>
                <TextField fullWidth value={data.amount || ''} onChange={e => handleMonthChange(e as any, index)} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            size='large'
            type='submit'
            variant='contained'
            disabled={Loading} // Disable button when loading
            startIcon={Loading ? <CircularProgress size={20} /> : null} // Show CircularProgress when loading
          >
            {Loading ? 'Loading...' : 'Simpan'}
          </Button>
          <Button size='large' color='secondary' variant='outlined' onClick={() => window.history.back()}>
            Kembali
          </Button>
        </CardActions>
      </form>
    </Card>
  )
}

export default AddPaymentDetailByClass
