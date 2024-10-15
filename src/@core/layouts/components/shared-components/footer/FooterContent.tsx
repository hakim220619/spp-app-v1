// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

const StyledCompanyName = styled(Link)(({ theme }) => ({
  fontWeight: 500,
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const data = localStorage.getItem('userData') as string
  const getDataLocal = JSON.parse(data)
  const school_name = getDataLocal?.school_name

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        padding: '16px'
      }}
    >
      {/* Other content can be placed here if needed */}
      {!hidden && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', '& :not(:last-child)': { mr: 4 } }}>
          {/* Optional links could be uncommented here */}
        </Box>
      )}
      <Box sx={{ position: 'absolute', bottom: 0, right: 0, color: 'text.secondary' }}>
        <Typography sx={{ display: 'flex' }}>
          {`© ${new Date().getFullYear()}, `}
          {`by`}
          <Typography sx={{ ml: 1 }} target='_blank' href='https://pixinvent.com' component={StyledCompanyName}>
            {school_name}
          </Typography>
        </Typography>
      </Box>
    </Box>
  )
}

export default FooterContent
