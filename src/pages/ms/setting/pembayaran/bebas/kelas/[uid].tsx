// ** React Imports
import { ChangeEvent, useCallback, useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import toast from 'react-hot-toast'
import Select from '@mui/material/Select'
import axiosConfig from '../../../../../../configs/axiosConfig'
import { useRouter } from 'next/router'
import { Box, CircularProgress } from '@mui/material'

const AddPaymentDetailByClass = () => {
  const [spName, setSpName] = useState<string>('')
  const [years, setYears] = useState<string>('')
  const [spType, setSpType] = useState<string>('')
  const [kelas, setKelas] = useState<string>('')
  const [kelases, setKelases] = useState<any[]>([])
  const [major, setMajor] = useState<string>('')
  const [majors, setMajors] = useState<any[]>([])
  const [amount, setAmount] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [unit, setUnit] = useState<string>('')
  const [units, setUnits] = useState<any[]>([])
  const [filteredMajors, setFilteredMajors] = useState<any[]>([])
  const [filteredClasses, setFilteredClasses] = useState<any[]>([])
  const userData = JSON.parse(localStorage.getItem('userData') as string)
  const storedToken = window.localStorage.getItem('token')
  const schoolId = userData.school_id
  const router = useRouter()
  const { uid, unit_id } = router.query

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = event.target.value
    const numericValue = newAmount.replace(/\D/g, '') // Remove non-numeric characters
    const formattedValue = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(parseInt(numericValue || '0', 10)) // Format as currency
    setAmount(formattedValue)
  }

  useEffect(() => {
    if (storedToken) {
      axiosConfig
        .post(
          '/detailSettingPembayaran',
          { uid },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${storedToken}`
            }
          }
        )
        .then(response => {
          const { sp_name, years, sp_type } = response.data
          setSpName(sp_name)
          setYears(years)
          setSpType(sp_type)
        })
        .catch(error => {
          console.error('Error fetching class details:', error)
        })
    }

    const fetchUnits = async () => {
      try {
        const response = await axiosConfig.get(`/getUnit`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          }
        })
        const filteredUnits = response.data.filter((unit: any) => unit.school_id === schoolId)
        setUnits(filteredUnits) // Assuming response.data contains unit information
      } catch (error) {
        console.error('Error fetching units:', error)
      }
    }

    const fetchClases = async () => {
      try {
        const response = await axiosConfig.get(`/getClass/?schoolId=${schoolId}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          }
        })
        setKelases(response.data)
      } catch (error) {
        console.error('Error fetching classes:', error)
      }
    }

    const fetchMajors = async () => {
      try {
        const response = await axiosConfig.get(`/getMajors/?schoolId=${schoolId}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          }
        })
        setMajors(response.data)
      } catch (error) {
        console.error('Error fetching majors:', error)
      }
    }
    fetchUnits() // Fetch units
    fetchMajors()
    fetchClases()
  }, [uid, schoolId, storedToken])

  useEffect(() => {
    const selectedUnitId = unit
    const newFilteredMajors = selectedUnitId ? majors.filter((major: any) => major.unit_id == unit_id) : majors
    const newFilteredClasses = selectedUnitId ? kelases.filter((cls: any) => cls.unit_id == unit_id) : kelases

    setFilteredMajors(newFilteredMajors)
    setFilteredClasses(newFilteredClasses)
    setUnit(unit_id as string)
  }, [unit, unit_id, majors, kelases])

  const handleClassChange = useCallback((e: ChangeEvent<{ value: unknown }>) => {
    setKelas(e.target.value as string)
  }, [])

  const handleMajorChange = useCallback((e: ChangeEvent<{ value: unknown }>) => {
    setMajor(e.target.value as string)
  }, [])

  const handleUnitChange = useCallback((e: ChangeEvent<{ value: unknown }>) => {
    setUnit(e.target.value as string) // Handle unit change
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    const formData = {
      school_id: schoolId,
      sp_name: spName,
      years: years,
      sp_type: spType,
      class_id: kelas,
      major_id: major,
      unit_id: unit, // Include unit_id
      amount: amount.replace(/\D/g, ''),
      uid: uid // Add uid from router.query
    }

    try {
      const response = await axiosConfig.post('/create-payment-byFree', formData, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${storedToken}`
        }
      })

      if (response.status === 200) {
        toast.success('Pembayaran berhasil disimpan!')
        router.push(`/ms/setting/pembayaran/bebas/${uid}?unit_id=${unit_id}`)
      } else if (response.status === 404) {
        toast.error('Users Not found')
      } else {
        toast.error('Terjadi kesalahan saat menyimpan pembayaran. Silakan coba lagi.')
      }
    } catch (error: any) {
      console.error('Error creating payment:', error)
      toast.error('Terjadi kesalahan saat menyimpan pembayaran: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false) // Set loading to false once the process is done
    }
  }

  return (
    <Card>
      <CardHeader title='Tambah Pembayaran Baru' />
      <Divider sx={{ m: '0 !important' }} />
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                Pembayaran Details
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <InputLabel id='form-layouts-separator-select-label'>Nama Pembayaran</InputLabel>
              <TextField
                fullWidth
                label=''
                placeholder=''
                value={spName}
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <InputLabel id='form-layouts-separator-select-label'>Tahun</InputLabel>
              <TextField
                fullWidth
                label=''
                placeholder=''
                value={years}
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <InputLabel id='form-layouts-separator-select-label'>Tipe</InputLabel>
              <TextField
                fullWidth
                label=''
                placeholder=''
                value={spType}
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <InputLabel id='form-layouts-separator-select-label'>Unit</InputLabel>
              <FormControl fullWidth>
                <Select
                  label='Unit'
                  defaultValue=''
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                  value={unit}
                  onChange={handleUnitChange as any} // Handle unit change
                  disabled
                >
                  {units.map(data => (
                    <MenuItem key={data.id} value={data.id}>
                      {data.unit_name} {/* Assuming unit_name is the field for display */}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <InputLabel>Jurusan</InputLabel>
              <FormControl fullWidth>
                {unit ? (
                  <Select value={major} onChange={handleMajorChange as any}>
                    {filteredMajors.map(major => (
                      <MenuItem key={major.id} value={major.id}>
                        {major.major_name}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  <Select disabled>
                    <MenuItem value=''>Pilih Jurusan</MenuItem>
                  </Select>
                )}
              </FormControl>
            </Grid>

            {/* Filtered Class Selection */}
            <Grid item xs={12} sm={4}>
              <InputLabel>Kelas</InputLabel>
              <FormControl fullWidth>
                {unit ? (
                  <Select value={kelas} onChange={handleClassChange as any}>
                    {filteredClasses.map(kelas => (
                      <MenuItem key={kelas.id} value={kelas.id}>
                        {kelas.class_name}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  <Select disabled>
                    <MenuItem value=''>Pilih Kelas</MenuItem>
                  </Select>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12}>
              <InputLabel id='form-layouts-separator-select-label'>Jumlah Pembayaran Rp.</InputLabel>
              <TextField
                fullWidth
                label=''
                placeholder='Masukkan jumlah pembayaran'
                value={amount}
                onChange={handleAmountChange}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider sx={{ m: '0 !important' }} />
        <CardActions>
          <Button
            size='large'
            type='submit'
            variant='contained'
            disabled={loading} // Disable button when loading
            startIcon={loading ? <CircularProgress size={20} /> : null} // Show CircularProgress when loading
          >
            {loading ? 'Loading...' : 'Simpan'}
          </Button>
          <Box m={1} display='inline' />
          <Button
            variant='outlined'
            color='secondary'
            onClick={() => {
              // Logic untuk tombol Kembali, misalnya kembali ke halaman sebelumnya
              window.history.back() // Kembali ke halaman sebelumnya
            }}
          >
            Kembali
          </Button>
        </CardActions>
      </form>
    </Card>
  )
}

export default AddPaymentDetailByClass
