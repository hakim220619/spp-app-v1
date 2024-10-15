import { useState, useCallback, useEffect, ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import CustomTextField from 'src/@core/components/mui/text-field'
import toast from 'react-hot-toast'
import axiosConfig from '../../../configs/axiosConfig'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { CircularProgress } from '@mui/material'

interface Major {
  id: string
  major_name: string
  unit_id: string // Assuming each major has an associated unit_id
}

interface Class {
  id: any
  class_name: string
  unit_id: string // Assuming each class has an associated unit_id
}

interface Unit {
  id: string
  unit_name: string
}

const FormValidationSchema = () => {
  const { handleSubmit, setValue } = useForm()
  const userData = JSON.parse(localStorage.getItem('userData') as string)
  const [nisn, setNisn] = useState<string>('')
  const [fullName, setFullName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [school, setSchool] = useState<string>('')
  const [status, setStatus] = useState<string>('ON')
  const [address, setAddress] = useState<string>('')
  const [majors, setMajorses] = useState<Major[]>([])
  const [filteredMajors, setFilteredMajors] = useState<Major[]>([]) // New state for filtered majors
  const [major, setMajor] = useState<number | string>('')
  const [clases, setClases] = useState<Class[]>([])
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]) // New state for filtered classes
  const [clas, setClas] = useState<number | string>('')
  const [dateOfBirth, setDateOfBirth] = useState<string>('')
  const [units, setUnits] = useState<Unit[]>([])
  const [unit, setUnit] = useState<number | string>('')
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const schoolId = userData.school_id
  const admin_id = userData.id
  const router = useRouter()
  const { uid } = router.query

  const storedToken = window.localStorage.getItem('token')

  // Fetch majors and classes when the component mounts
  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const response = await axiosConfig.get(`/getMajors/?schoolId=${schoolId}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          }
        })
        setMajorses(response.data)
      } catch (error) {
        console.error('Error fetching majors:', error)
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
        setClases(response.data)
      } catch (error) {
        console.error('Error fetching classes:', error)
      }
    }

    const fetchUnits = async () => {
      try {
        const response = await axiosConfig.get('/getUnit', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          }
        })
        const filteredUnits = response.data.filter((unit: any) => unit.school_id === schoolId)
        setUnits(filteredUnits)
      } catch (error) {
        console.error('Failed to fetch units:', error)
        toast.error('Failed to load units')
      }
    }

    fetchMajors()
    fetchClases()
    fetchUnits()

    if (storedToken) {
      axiosConfig
        .post(
          '/detailSiswa',
          { uid },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${storedToken}`
            }
          }
        )
        .then(response => {
          const {
            nisn,
            email,
            full_name,
            phone,
            address,
            class_id,
            major_id,
            school_id,
            status,
            unit_id,
            date_of_birth
          } = response.data
          const localDate = new Date(date_of_birth).toLocaleDateString('en-CA')
          setNisn(nisn)
          setEmail(email)
          setFullName(full_name)
          setPhone(phone)
          setAddress(address)
          setClas(class_id)
          setMajor(major_id)
          setSchool(school_id)
          setStatus(status)
          setUnit(unit_id)
          setDateOfBirth(localDate.slice(0, 10))
        })
    }
  }, [uid, storedToken, schoolId])

  // Filtering logic for majors and classes based on selected unit
  useEffect(() => {
    const selectedUnitId = unit
    const newFilteredMajors = selectedUnitId
      ? majors.filter((major: Major) => major.unit_id === selectedUnitId)
      : majors
    const newFilteredClasses = selectedUnitId ? clases.filter((cls: Class) => cls.unit_id === selectedUnitId) : clases

    setFilteredMajors(newFilteredMajors)
    setFilteredClasses(newFilteredClasses)

    // Reset major and class fields when unit_id changes
    if (!selectedUnitId) {
      setValue('major', '')
      setValue('class', '')
    }
  }, [unit, majors, clases, setValue])

  const handleUnitChange = useCallback((e: ChangeEvent<{ value: unknown }>) => {
    setUnit(e.target.value as number)
  }, [])
  const handleMajorChange = useCallback((e: ChangeEvent<{ value: unknown }>) => {
    setMajor(e.target.value as number)
  }, [])

  const handleClassChange = useCallback((e: ChangeEvent<{ value: unknown }>) => {
    setClas(e.target.value as number)
  }, [])

  const validateForm = () => {
    if (!fullName) {
      toast.error('Full Name is required')

      return false
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Valid email is required')

      return false
    }
    if (!phone || !/^\d+$/.test(phone)) {
      toast.error('Valid phone number is required')

      return false
    }
    if (!address) {
      toast.error('Address is required')

      return false
    }
    if (!major) {
      toast.error('Major is required')

      return false
    }
    if (!clas) {
      toast.error('Class is required')

      return false
    }

    return true
  }

  const onSubmit = async () => {
    if (!validateForm()) {
      return
    }

    const formData = new FormData()
    formData.append('uid', uid as string)
    formData.append('nisn', nisn)
    formData.append('full_name', fullName)
    formData.append('email', email)
    formData.append('phone', phone)
    formData.append('school_id', school)
    formData.append('status', status)
    formData.append('unit_id', unit as any)
    formData.append('class_id', clas as string)
    formData.append('major_id', major as string)
    formData.append('address', address)
    formData.append('date_of_birth', dateOfBirth)
    formData.append('updated_by', admin_id)
    if (image) {
      formData.append('image', image) // Append the image file
    }
    console.log(formData)

    if (storedToken) {
      setLoading(true)
      try {
        await axiosConfig.post('/update-siswa', formData, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`,
            'Content-Type': 'multipart/form-data' // Set content type to multipart
          }
        })
        toast.success('Successfully Updated!')
        router.push('/ms/siswa')
      } catch (error) {
        console.error('Failed to update:', error)
        toast.error("Failed. This didn't work.")
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <Card>
      <CardHeader title='Edit Siswa' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <CustomTextField
                fullWidth
                label='Nama Lengkap'
                value={fullName}
                onChange={e => setFullName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField fullWidth label='NISN' value={nisn} onChange={e => setNisn(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField fullWidth label='Email' value={email} onChange={e => setEmail(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField fullWidth label='No. Wa' value={phone} onChange={e => setPhone(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField fullWidth label='Alamat' value={address} onChange={e => setAddress(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                fullWidth
                label='Tanggal Lahir'
                type='date'
                value={dateOfBirth}
                onChange={e => setDateOfBirth(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField select label='Unit' value={unit} onChange={handleUnitChange} fullWidth>
                {units.map((unit: Unit) => (
                  <MenuItem key={unit.id} value={unit.id}>
                    {unit.unit_name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField select label='Kelas' value={clas} onChange={handleClassChange} fullWidth>
                {filteredClasses.map((cls: Class) => (
                  <MenuItem key={cls.id} value={cls.id}>
                    {cls.class_name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField select label='Jurusan' value={major} onChange={handleMajorChange} fullWidth>
                {filteredMajors.map((major: Major) => (
                  <MenuItem key={major.id} value={major.id}>
                    {major.major_name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                fullWidth
                type='file'
                label='Gambar'
                InputLabelProps={{
                  shrink: true
                }}
                inputProps={{
                  accept: 'image/png, image/jpeg'
                }}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  const file = event.target.files?.[0]
                  if (file) {
                    // You can set the image state here if needed
                    setImage(file) // Assuming setGambarValue is defined in your state
                  }
                }}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 4 }}>
            <Button variant='contained' type='submit' disabled={loading} sx={{ mr: 2 }}>
              {loading ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
            <Link href='/ms/siswa'>
              <Button variant='outlined'>Cancel</Button>
            </Link>
          </Box>
        </form>
      </CardContent>
    </Card>
  )
}

export default FormValidationSchema
