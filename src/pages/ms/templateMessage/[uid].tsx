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
  const [status, setStatus] = useState<string>('ON')
  const [school_id, setSchoolId] = useState<string>('')
  const [template_name, setTemplateName] = useState<string>('')
  const [deskripsi, setDeskripsi] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [schools, setSchools] = useState([]) // State for school options

  // Fetch class details
  useEffect(() => {
    if (storedToken) {
      axiosConfig
        .post(
          '/detailTemplateMessage',
          { id: uid },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${storedToken}`
            }
          }
        )
        .then(response => {
          const { status, school_id, template_name, deskripsi, message } = response.data
          setStatus(status)
          setSchoolId(school_id)
          setTemplateName(template_name)
          setDeskripsi(deskripsi)
          setMessage(message)
        })
        .catch(error => {
          console.error('Error fetching class details:', error)
        })
    }
  }, [uid, storedToken])

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axiosConfig.get('/getSchool', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${window.localStorage.getItem('token')}`
          }
        })
        setSchools(response.data)
      } catch (error) {
        console.error('Failed to fetch schools:', error)
        toast.error('Failed to load schools')
      }
    }

    fetchSchools()
  }, [])

  const handleSchoolChange = (event: any) => {
    setSchoolId(event.target.value)
  }

  const onSubmit = () => {
    const formData = {
      id: uid,
      school_id: school_id,
      template_name,
      deskripsi,
      message,
      status
    }

    if (storedToken) {
      axiosConfig
        .post(
          '/update-templateMessage',
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
          router.push('/ms/templateMessage')
        })
        .catch(() => {
          toast.error("Failed. This didn't work.")
        })
    }
  }
  const nama_variable = '${nama_variable}'
  
  return (
    <Card>
      <CardHeader title='Update template Pesan' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            {/* Template Name Field */}
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                value={template_name}
                onChange={e => setTemplateName(e.target.value)}
                label='Template Name'
                placeholder='Template Name'
              />
            </Grid>
            {/* Deskripsi Field */}
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                value={deskripsi}
                onChange={e => setDeskripsi(e.target.value)}
                label='Deskripsi'
                placeholder='Deskripsi'
              />
            </Grid>
            {/* School Field */}
            <Grid item xs={6}>
              <CustomTextField select fullWidth label='School' value={school_id} onChange={handleSchoolChange}>
                <MenuItem value='' disabled>
                  Select School
                </MenuItem>
                {schools.map((schoolItem: any) => (
                  <MenuItem key={schoolItem.id} value={schoolItem.id}>
                    {schoolItem.school_name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            {/* Status Field */}
            <Grid item xs={6}>
              <CustomTextField select fullWidth label='Status' value={status} onChange={e => setStatus(e.target.value)}>
                <MenuItem value='ON'>ON</MenuItem>
                <MenuItem value='OFF'>OFF</MenuItem>
              </CustomTextField>
            </Grid>
            {/* Message Field */}

            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                multiline
                rows={10}
                value={message}
                onChange={e => setMessage(e.target.value)}
                label={
                  <>
                    Message:{' '}
                    <span style={{ color: 'red' }}>
                      Harap tidak mengganti {nama_variable} karena sudah menjadi bagian dari default sistem
                    </span>
                  </>
                }
                placeholder='Message'
                id='textarea-outlined-static'
              />
            </Grid>
            {/* Submit Button */}
            <Grid item xs={12}>
              <Button type='submit' variant='contained'>
                Save
              </Button>
              <Box m={1} display='inline'></Box>
              <Link href='/ms/templateMessage' passHref>
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
