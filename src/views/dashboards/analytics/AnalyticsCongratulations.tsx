// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid, { GridProps } from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import Link from 'next/link'

// Styled Grid component
const StyledGrid = styled(Grid)<GridProps>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    order: -1,
    display: 'flex',
    justifyContent: 'center'
  }
}))

// Styled component for the image
const Img = styled('img')(({ theme }) => ({
  right: 90,
  bottom: -50,
  width: '30%',
  position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    maxWidth: 250,
    position: 'static',
    marginTop: theme.spacing(2) // Add margin for spacing on small screens
  }
}))
const SuccessText = styled('span')(({ theme }) => ({
  color: theme.palette.success.main // Use the success color from the theme
}))

const AnalyticsCongratulations = () => {
  const [fullName, setFullName] = useState<string | null>(null)
  const [roleName, setRoleName] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') as string)
    const full_name = userData.full_name
    const roleName = userData.role_name
    const role = userData.role

    setFullName(full_name)
    setRoleName(roleName)
    setRole(role)
  }, [])

  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent sx={{ p: theme => `${theme.spacing(6.75, 7.5)} !important` }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant='h5' sx={{ mb: 4.5 }}>
              Congratulations{' '}
              <Box component='span' sx={{ fontWeight: 'bold' }}>
                {fullName}
              </Box>
              ! 🎉
            </Typography>
            <Typography variant='body2'>
              Halo, <SuccessText>{roleName}</SuccessText> Senang melihat Anda kembali. Mari kita ciptakan perubahan
              hebat hari ini!
            </Typography>
            <br />
            {role === '170' && ( // Tampilkan link dan button jika role == 170
              <Grid item xs={12}>
                <Link href='/ms/siswa' style={{ textDecoration: 'none' }}>
                  <Button variant='contained'>View Data Siswa</Button>
                </Link>
              </Grid>
            )}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              alignItems: { xs: 'center', sm: 'flex-end' } // Center align on small screens
            }}
          >
            <StyledGrid item xs={12}>
              <Img
                alt='Congratulations John'
                src={`/images/cards/congratulations-john.png`}
                style={{
                  width: '100%',
                  maxWidth: 130 // Batasi ukuran maksimal pada layar kecil
                }}
              />
            </StyledGrid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AnalyticsCongratulations
