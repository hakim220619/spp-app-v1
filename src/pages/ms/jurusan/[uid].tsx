import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

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

const FormValidationSchema = () => {
  const { handleSubmit } = useForm()
  const router = useRouter()
  const { uid } = router.query
  const storedToken = window.localStorage.getItem('token')

  const [major_status, setStatus] = useState<string>('ON')
  const [major_name, setClassName] = useState<string>('')
  const [school_id, setSchoolId] = useState<string>('')
  const [units, setUnits] = useState<{ id: string; name: string }[]>([])
  const [unit_id, setUnitId] = useState<string>('')
  const [major_desc, setMajorDesc] = useState<string>('')

  useEffect(() => {
    if (storedToken) {
      // Fetch class details
      axiosConfig
        .post(
          '/detailJurusan',
          { uid },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${storedToken}`
            }
          }
        )
        .then(response => {
          const { major_name, major_status, school_id, unit_id, major_desc } = response.data
          setClassName(major_name)
          setStatus(major_status)
          setSchoolId(school_id)
          setUnitId(unit_id) // Set the unit ID from response
          setMajorDesc(major_desc) // Set the major description from response
        })
        .catch(error => {
          console.error('Error fetching class details:', error)
        })
    }
  }, [uid, storedToken])

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axiosConfig.get('/getUnit', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${window.localStorage.getItem('token')}`
          }
        })

        const userData = JSON.parse(localStorage.getItem('userData') as any)
        const schoolId = userData ? userData.school_id : null // Retrieve school_id from userData

        if (schoolId) {
          const filteredUnits = response.data.filter((unit: any) => unit.school_id === schoolId)
          setUnits(filteredUnits) // Set the filtered units
        } else {
          console.warn('No school_id found in userData')
          setUnits([]) // Or handle accordingly if no school_id is found
        }
      } catch (error) {
        console.error('Failed to fetch units:', error)
        toast.error('Failed to load units')
      }
    }

    fetchUnits()
  }, [])

  const onSubmit = () => {
    const formData = {
      uid: uid,
      school_id: school_id,
      major_name: major_name.toUpperCase(),
      major_status,
      unit_id,
      major_desc: major_desc.toUpperCase()
    }

    if (storedToken) {
      axiosConfig
        .post(
          '/update-jurusan',
          { data: formData },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${storedToken}`
            }
          }
        )
        .then(() => {
          toast.success('Successfully Updated!')
          router.push('/ms/jurusan')
        })
        .catch(() => {
          toast.error("Failed. This didn't work.")
        })
    }
  }

  return (
    <Card>
      <CardHeader title='Update Jurusan' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            {/* Unit ID Field */}
            <Grid item xs={6}>
              <CustomTextField select fullWidth label='Unit' value={unit_id} onChange={e => setUnitId(e.target.value)}>
                {units.map((unit: any) => (
                  <MenuItem key={unit.id} value={unit.id}>
                    {unit.unit_name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>

            {/* Class Name Field */}
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                value={major_name}
                onChange={e => setClassName(e.target.value)}
                label='Nama Kelas'
                placeholder='Nama Kelas'
              />
            </Grid>

            {/* Class Status Field */}
            <Grid item xs={6}>
              <CustomTextField
                select
                fullWidth
                label='Status'
                value={major_status}
                onChange={e => setStatus(e.target.value)}
              >
                <MenuItem value='ON'>ON</MenuItem>
                <MenuItem value='OFF'>OFF</MenuItem>
              </CustomTextField>
            </Grid>

            {/* Major Description Field */}
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                value={major_desc}
                onChange={e => setMajorDesc(e.target.value)}
                label='Deskripsi Kelas'
                placeholder='e.g. Description of Class A'
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button type='submit' variant='contained'>
                Save
              </Button>
              <Box m={1} display='inline' />
              <Link href='/ms/jurusan' passHref>
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
