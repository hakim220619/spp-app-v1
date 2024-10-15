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
  const [unit_status, setStatus] = useState<string>('ON')
  const [unit_name, setUnitName] = useState<string>('')
  const [unit_desc, setUnitDesc] = useState<string>('')
  const [school_id, setSchoolId] = useState<string>('')
  useEffect(() => {
    if (storedToken) {
      axiosConfig
        .post(
          '/detailUnit',
          { uid },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${storedToken}`
            }
          }
        )
        .then(response => {
          const { unit_name, unit_desc, unit_status, school_id } = response.data
          setUnitName(unit_name)
          setUnitDesc(unit_desc)
          setStatus(unit_status)
          setSchoolId(school_id)
        })
        .catch(error => {
          console.error('Error fetching class details:', error)
        })
    }
  }, [uid, storedToken])

  const onSubmit = () => {
    const formData = {
      id: uid,
      school_id: school_id,
      unit_name: unit_name.toUpperCase(), // Convert to uppercase
      unit_desc: unit_desc.toUpperCase(), // Convert to uppercase
      unit_status
    }

    if (storedToken) {
      axiosConfig
        .post(
          '/update-unit',
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
          router.push('/ms/unit')
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
            {/* Class Name Field */}
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                value={unit_name}
                onChange={e => setUnitName(e.target.value)}
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
                value={unit_status}
                onChange={e => setStatus(e.target.value)}
              >
                <MenuItem value='ON'>ON</MenuItem>
                <MenuItem value='OFF'>OFF</MenuItem>
              </CustomTextField>
            </Grid>

            {/* Class Description Field */}
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                value={unit_desc}
                onChange={e => setUnitDesc(e.target.value)}
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
