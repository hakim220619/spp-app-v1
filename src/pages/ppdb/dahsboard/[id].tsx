// ** React Imports
import { ReactNode, useEffect, useState } from 'react'

// ** MUI Components
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

import Navbar from 'src/pages/ppdb/navbar/index' // Import the Navbar
import axiosConfig from 'src/configs/axiosConfig'
import { useRouter } from 'next/router'
import StepperCustomHorizontal from './steep'

// ** Styled Components
const SuccessText = styled('span')(({ theme }) => ({
  color: theme.palette.success.main // Use the success color from the theme
}))

const DashboardByTokenSiswa = () => {
  const [fullName, setFullName] = useState<string | null>(null)
  const [roleName, setRoleName] = useState<string | null>(null)
  const [dataAll, setDataALll] = useState<any | null>(null)
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    axiosConfig
      .post(
        '/detailSiswaBaru',
        { uid: id },
        {
          headers: {
            Accept: 'application/json'
          }
        }
      )
      .then(response => {
        const { full_name, role_name } = response.data // Make sure to fetch the role name if needed
        setFullName(full_name)
        setRoleName(role_name)
        setDataALll(response.data)
      })
      .catch(error => {
        console.error('Error fetching details:', error)
      })
  }, [id])

  return (
    <>
      <Box className='content-right' margin={10} sx={{ backgroundColor: 'customColors.bodyBg' }}>
        <Box sx={{ maxWidth: 'auto', mx: 'auto', mt: 4 }}>
          <Grid container spacing={2}>
            {/* Existing Card */}

            <Grid item xs={12}>
              {' '}
              <Navbar />
              <Box m={1} display='inline'></Box>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ position: 'relative', mb: 4 }}>
                {' '}
                {/* Added margin below the card */}
                <CardContent sx={{ p: theme => `${theme.spacing(6.75, 7.5)} !important` }}>
                  <Typography variant='h5' sx={{ mb: 4.5 }}>
                    Selamat Datang{' '}
                    <Box component='span' sx={{ fontWeight: 'bold' }}>
                      {fullName}
                    </Box>
                    ! 🎉
                  </Typography>
                  <Typography variant='body2'>
                    Halo, <SuccessText>{roleName}</SuccessText> Senang melihat Anda kembali. Mari kita ciptakan
                    perubahan hebat hari ini!
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Box m={1} display='inline'></Box>
          <StepperCustomHorizontal token={id} dataAll={dataAll}></StepperCustomHorizontal>
          {/* <FormLayoutsSeparator token={id} /> */}
        </Box>
      </Box>
    </>
  )
}

DashboardByTokenSiswa.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

DashboardByTokenSiswa.guestGuard = true

export default DashboardByTokenSiswa
