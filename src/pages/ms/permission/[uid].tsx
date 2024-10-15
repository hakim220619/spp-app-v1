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
  const [title, setTitle] = useState<string>('')
  const [icon, setIcon] = useState<string>('')
  const [path, setPath] = useState<string>('')
  const [role, setRole] = useState<string>('')
  const [schools, setSchools] = useState([]) // State for school options
  const [roles, setRoles] = useState([]) // State for role options

  // Fetch class details
  useEffect(() => {
    if (storedToken) {
      axiosConfig
        .post(
          '/detailPermission',
          { id: uid },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${storedToken}`
            }
          }
        )
        .then(response => {
          const { status, school_id, title, icon, path, role } = response.data
          setStatus(status)
          setSchoolId(school_id)
          setTitle(title)
          setIcon(icon)
          setPath(path)
          setRole(role)
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

    const fetchRoles = async () => {
      try {
        const response = await axiosConfig.get('/getRole', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${window.localStorage.getItem('token')}`
          }
        })
        setRoles(response.data)
      } catch (error) {
        console.error('Failed to fetch roles:', error)
        toast.error('Failed to load roles')
      }
    }

    fetchSchools()
    fetchRoles()
  }, [])

  const handleRoleChange = (event: any) => {
    setRole(event.target.value)
  }

  const handleSchoolChange = (event: any) => {
    setSchoolId(event.target.value)
  }

  const onSubmit = () => {
    const formData = {
      id: uid,
      school_id: school_id,
      title,
      icon,
      path,
      role
    }

    if (storedToken) {
      axiosConfig
        .post(
          '/update-permission',
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
          router.push('/ms/permission')
        })
        .catch(() => {
          toast.error("Failed. This didn't work.")
        })
    }
  }

  return (
    <Card>
      <CardHeader title='Update Permission' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            {/* Title Field */}
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                value={title}
                onChange={e => setTitle(e.target.value)}
                label='Title'
                placeholder='Title'
              />
            </Grid>

            {/* Icon Field */}
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                value={icon}
                onChange={e => setIcon(e.target.value)}
                label='Icon'
                placeholder='Icon'
              />
            </Grid>

            {/* Path Field */}
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                value={path}
                onChange={e => setPath(e.target.value)}
                label='Path'
                placeholder='Path'
              />
            </Grid>

            {/* Role Field */}
            <Grid item xs={6}>
              <CustomTextField select fullWidth label='Role' value={role} onChange={handleRoleChange}>
                <MenuItem value='' disabled>
                  Select Role
                </MenuItem>
                {roles // Filter to exclude ID 160
                  .map((role: any) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.role_name}
                    </MenuItem>
                  ))}
              </CustomTextField>
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

            {/* Class Status Field */}
            <Grid item xs={6}>
              <CustomTextField select fullWidth label='Status' value={status} onChange={e => setStatus(e.target.value)}>
                <MenuItem value='ON'>ON</MenuItem>
                <MenuItem value='OFF'>OFF</MenuItem>
              </CustomTextField>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button type='submit' variant='contained'>
                Save
              </Button>
              <Box m={1} display='inline'></Box>
              <Link href='/ms/permission' passHref>
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
