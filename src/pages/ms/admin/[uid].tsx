// ** React Imports
import { useState, useCallback, useEffect, ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'

// ** Custom Component Imports
import CustomTextField from 'src/@core/components/mui/text-field'
import 'react-datepicker/dist/react-datepicker.css'
import toast from 'react-hot-toast'

// ** Axios Import
import axiosConfig from '../../../configs/axiosConfig'
import { useRouter } from 'next/router'
import Link from 'next/link'

// ** Types
interface Role {
  id: any
  role_name: string
}

interface School {
  id: string
  school_name: string
}

const FormValidationSchema = () => {
  const { handleSubmit } = useForm()
  const userData = JSON.parse(localStorage.getItem('userData') as string)
  const [fullName, setFullName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [school, setSchool] = useState<string>('')
  const [status, setStatus] = useState<string>('ON')
  const [role, setRole] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [image, setImage] = useState<File | null>(null)
  const [roles, setRoles] = useState<Role[]>([])
  const [schools, setSchools] = useState<School[]>([])
  const [updated_by] = useState<string>(userData.id)
  const [schoolId] = useState<any>(userData.school_id)
  const [dateOfBirth, setDateOfBirth] = useState<string>('')
  const router = useRouter()
  const { uid } = router.query

  useEffect(() => {
    const storedToken = window.localStorage.getItem('token')
    if (storedToken) {
      axiosConfig
        .post(
          '/detailAdmin',
          { uid },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${storedToken}`
            }
          }
        )
        .then(response => {
          const { email, full_name, phone, address, role, school_id, status, date_of_birth } = response.data
          const localDate = new Date(date_of_birth).toLocaleDateString('en-CA') //

          setEmail(email)
          setFullName(full_name)
          setPhone(phone)
          setAddress(address)
          setRole(role)
          setSchool(school_id)
          setStatus(status)
          setDateOfBirth(localDate.slice(0, 10))
        })
    }
    const fetchSchools = async () => {
      const storedToken = window.localStorage.getItem('token')
      try {
        const response = await axiosConfig.get('/getSchool', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          }
        })
        const schools = response.data
        const userSchoolId = schoolId
        if (userSchoolId === 1) {
          // User dengan school_id 1 bisa melihat semua sekolah
          setSchools(schools)
        } else {
          // Filter berdasarkan school_id user
          const filteredSchools = schools.filter((school: { id: number }) => school.id === userSchoolId)

          setSchools(filteredSchools)
        }
      } catch (error) {
        console.error('Error fetching schools:', error)
      }
    }

    const fetchRoles = async () => {
      const storedToken = window.localStorage.getItem('token')
      try {
        const response = await axiosConfig.get('/getRole', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          }
        })
        const filteredRoles = response.data.filter(
          (role: Role) => role.id === 170 || role.id === 190 || role.id === 200
        )
        setRoles(filteredRoles)
      } catch (error) {
        console.error('Error fetching roles:', error)
      }
    }

    // Fetch schools and roles when component loads
    fetchSchools()
    fetchRoles()
  }, [schoolId, uid])

  const handleRoleChange = useCallback((e: React.ChangeEvent<{ value: unknown }>) => {
    setRole(e.target.value as string)
  }, [])

  const handleSchoolChange = useCallback((e: React.ChangeEvent<{ value: unknown }>) => {
    setSchool(e.target.value as string)
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
    if (!role) {
      toast.error('Role is required')

      return false
    }
    if (!school) {
      toast.error('School is required')

      return false
    }

    return true
  }

  const onSubmit = () => {
    if (!validateForm()) {
      return
    }

    const storedToken = window.localStorage.getItem('token')

    // Membuat objek formData menggunakan FormData
    const formData = new FormData()
    formData.append('uid', uid as string)
    formData.append('full_name', fullName)
    formData.append('email', email)
    formData.append('phone', phone)
    formData.append('school_id', school)
    formData.append('status', status)
    formData.append('role', role)
    formData.append('address', address)
    formData.append('updated_by', updated_by)
    formData.append('date_of_birth', dateOfBirth)
    if (image) {
      formData.append('image', image) // Append the image file
    }

    if (storedToken) {
      axiosConfig
        .post(
          '/update-admin',
          formData, // Mengirim formData
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${storedToken}`,
              'Content-Type': 'multipart/form-data' // Mengatur konten tipe untuk FormData
            }
          }
        )
        .then(() => {
          toast.success('Successfully Updated!')
          router.push('/ms/admin')
        })
        .catch(() => {
          toast.error("Failed. This didn't work.")
        })
    }
  }

  return (
    <Card>
      <CardHeader title='Update Admin' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6} md={6}>
              <CustomTextField
                fullWidth
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                label='Full Name'
                placeholder='Leonard'
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <CustomTextField
                fullWidth
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                label='Email'
                placeholder='carterleonard@gmail.com'
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <CustomTextField
                fullWidth
                value={phone.startsWith('62') ? phone : `62${phone}`} // Pastikan value selalu diawali dengan '62'
                onChange={e => {
                  const newValue = e.target.value

                  // Izinkan hanya karakter numerik dan cegah penghapusan prefiks '62'
                  if (/^\d*$/.test(newValue)) {
                    if (newValue.startsWith('62')) {
                      setPhone(newValue)
                    } else if (newValue === '') {
                      // Jika input dikosongkan, reset kembali ke '62'
                      setPhone('62')
                    }
                  }
                }}
                label='Phone Number'
                placeholder='628123456789'
                inputProps={{ maxLength: 15 }} // Batasi panjang maksimal
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <CustomTextField select fullWidth label='Role' value={role} onChange={handleRoleChange}>
                <MenuItem value='' disabled>
                  Select Role
                </MenuItem>
                {roles
                  .filter(role => role.id !== 160) // Filter untuk mengecualikan ID 160
                  .map(role => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.role_name}
                    </MenuItem>
                  ))}
              </CustomTextField>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <CustomTextField select fullWidth label='School' value={school} onChange={handleSchoolChange}>
                <MenuItem value='' disabled>
                  Select School
                </MenuItem>
                {schools.map(schoolItem => (
                  <MenuItem key={schoolItem.id} value={schoolItem.id}>
                    {schoolItem.school_name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <CustomTextField
                fullWidth
                type='date'
                value={dateOfBirth}
                onChange={e => setDateOfBirth(e.target.value)}
                label='Date of Birth'
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <CustomTextField
                fullWidth
                name='image'
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
                    setImage(file) // Assuming setImage is defined in your state
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <CustomTextField
                fullWidth
                value={status}
                onChange={e => setStatus(e.target.value)}
                label='Status'
                placeholder='ON'
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              <CustomTextField
                fullWidth
                multiline
                rows={2}
                value={address}
                onChange={e => setAddress(e.target.value)}
                label='Address'
                placeholder='Jl Hr Agung'
              />
            </Grid>
            <Grid item xs={12}>
              <Button type='submit' variant='contained'>
                Save
              </Button>
              <Box m={1} display='inline'></Box>
              <Link href='/ms/admin' passHref>
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
