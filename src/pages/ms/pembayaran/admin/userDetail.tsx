import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import urlImage from '../../../../configs/url_image'

const UserImage = ({ schoolId, imageName }: { schoolId: string; imageName: string }) => {
  // Construct the full image URL
  const imageUrl = `${urlImage}uploads/school/siswa/${schoolId}/${imageName}`

  return (
    <Box
      component='img'
      src={imageUrl}
      alt='User Image'
      sx={{
        width: '100%',
        height: '230px',
        borderRadius: '15%',
        margin: '10px',
        objectFit: 'cover'
      }}
    />
  )
}

const UserBasicDetails = ({ userDetails }: { userDetails: any }) => (
  <TableContainer>
    <Table sx={{ border: 'none' }}>
      <TableBody>
        <TableRow>
          <TableCell sx={{ borderBottom: 'none' }}>Nama Lengkap</TableCell>
          <TableCell sx={{ borderBottom: 'none' }}>: {userDetails.full_name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ borderBottom: 'none' }}>Kelas</TableCell>
          <TableCell sx={{ borderBottom: 'none' }}>: {userDetails.class_name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ borderBottom: 'none' }}>Jurusan</TableCell>
          <TableCell sx={{ borderBottom: 'none' }}>: {userDetails.major_name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ borderBottom: 'none' }}>Yayasan</TableCell>
          <TableCell sx={{ borderBottom: 'none' }}>: {userDetails.school_name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ borderBottom: 'none' }}>Sekolah</TableCell>
          <TableCell sx={{ borderBottom: 'none' }}>: {userDetails.unit_name}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
)
const UserContactDetails = ({ userDetails }: { userDetails: any }) => (
  <TableContainer>
    <Table sx={{ border: 'none' }}>
      <TableBody>
        <TableRow>
          <TableCell sx={{ borderBottom: 'none', textAlign: 'center' }}>Email</TableCell>
          <TableCell sx={{ borderBottom: 'none' }}>: {userDetails.email}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ borderBottom: 'none', textAlign: 'center' }}>No. Wa</TableCell>
          <TableCell sx={{ borderBottom: 'none' }}>: {userDetails.phone}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ borderBottom: 'none', textAlign: 'center' }}>Status</TableCell>
          <TableCell sx={{ borderBottom: 'none' }}>
            :{' '}
            <Button variant='contained' color={userDetails.status === 'ON' ? 'primary' : 'error'} size='small'>
              {userDetails.status}
            </Button>
          </TableCell>
        </TableRow>
        {/* Separate Address Row */}
        <TableRow>
          <TableCell sx={{ borderBottom: 'none', textAlign: 'center' }}>Alamat</TableCell>
          <TableCell sx={{ borderBottom: 'none' }}>: {userDetails.address}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
)

const UserDetailsCard = ({ userDetails }: { userDetails: any }) => (
  <Card variant='elevation' sx={{ mt: 3 }}>
    <Grid container spacing={3}>
      {/* User Image */}
      <Grid item xs={12} md={2}>
        <UserImage imageName={userDetails.image} schoolId={userDetails.school_id} />
      </Grid>

      {/* User Basic Details */}
      <Grid item xs={12} md={5}>
        <UserBasicDetails userDetails={userDetails} />
      </Grid>

      {/* User Contact Details */}
      <Grid item xs={12} md={5}>
        <UserContactDetails userDetails={userDetails} />
      </Grid>
    </Grid>
  </Card>
)

export default UserDetailsCard
