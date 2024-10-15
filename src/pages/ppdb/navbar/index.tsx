// ** React Imports
import { FC } from 'react'

// ** MUI Components
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import { useRouter } from 'next/router'
import { Typography, Grid, Box } from '@mui/material'

const Img = styled('img')(({ theme }) => ({
  width: '3%',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    maxWidth: 250,
    marginTop: theme.spacing(2) // Add margin for spacing on small screens
  }
}))

const Navbar: FC = () => {
  const router = useRouter()

  const handleLogout = () => {
    // Handle logout logic here
    router.push('/ppdb/login') // Redirect to login page or any other page
  }

  return (
    <AppBar position='fixed'>
      <Box sx={{ marginLeft: '20px', marginRight: '20px' }}>
        {' '}
        {/* Apply margin left and right */}
        <Toolbar>
          <Grid container alignItems='center' justifyContent='space-between'>
            <Grid item xs={6} sm={4}>
              <Typography variant='h6'>
                <Img
                  alt='Your Application Logo'
                  src={`/images/logo.png`}
                  style={{ backgroundColor: 'white', width: '50px' }}
                />
              </Typography>
            </Grid>

            <Grid item xs={6} sm={8}>
              <Grid container justifyContent='flex-end' spacing={2}>
                <Grid item>
                  <Button color='inherit' onClick={() => router.push('#')}>
                    Home
                  </Button>
                </Grid>
                <Grid item>
                  <Button color='inherit' onClick={() => router.push('/about')}>
                    Tentang Sekolah
                  </Button>
                </Grid>
                <Grid item>
                  <Button color='inherit' onClick={handleLogout}>
                    Logout
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </Box>
    </AppBar>
  )
}

export default Navbar
