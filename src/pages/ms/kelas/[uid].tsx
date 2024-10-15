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

  // State variables
  const [class_status, setStatus] = useState<string>('ON')
  const [class_name, setClassName] = useState<string>('')
  const [class_desc, setClassDesc] = useState<string>('')
  const [school_id, setSchoolId] = useState<string>('')
  const [unit_id, setUnitId] = useState<string>('') // New state for unit_id
  const [units, setUnits] = useState<any[]>([]) // State to hold unit data

  // Fetch class details
  useEffect(() => {
    if (storedToken) {
      axiosConfig
        .post(
          '/detailKelas',
          { uid },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${storedToken}`
            }
          }
        )
        .then(response => {
          const { class_name, class_desc, class_status, school_id, unit_id } = response.data
          setClassName(class_name)
          setClassDesc(class_desc)
          setStatus(class_status)
          setSchoolId(school_id)
          setUnitId(unit_id) // Set unit_id from response
        })
        .catch(error => {
          console.error('Error fetching class details:', error)
        })
    }
  }, [uid, storedToken])

  // Fetch units
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
      class_name,
      class_desc,
      class_status,
      unit_id // Include unit_id in form data
    }

    if (storedToken) {
      axiosConfig
        .post(
          '/update-kelas',
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
          router.push('/ms/kelas')
        })
        .catch(() => {
          toast.error("Failed. This didn't work.")
        })
    }
  }

  return (
    <Card>
      <CardHeader title='Update Kelas' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            {/* Unit Selection Field */}
            <Grid item xs={6}>
              <CustomTextField select fullWidth label='Unit' value={unit_id} onChange={e => setUnitId(e.target.value)}>
                {units.map(unit => (
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
                value={class_name}
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
                value={class_status}
                onChange={e => setStatus(e.target.value)}
              >
                <MenuItem value='ON'>ON</MenuItem>
                <MenuItem value='OFF'>OFF</MenuItem>
              </CustomTextField>
            </Grid>

            {/* Class Description Field */}
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                value={class_desc}
                onChange={e => setClassDesc(e.target.value)}
                label='Deskripsi'
                placeholder='Deskripsi'
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button type='submit' variant='contained'>
                Save
              </Button>
              <Box m={1} display='inline'></Box>
              <Link href='/ms/kelas' passHref>
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
