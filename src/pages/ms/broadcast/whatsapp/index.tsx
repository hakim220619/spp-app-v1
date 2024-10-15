import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { Button, CircularProgress, Grid, TextField } from '@mui/material'
import axiosConfig from 'src/configs/axiosConfig'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import CustomTextField from 'src/@core/components/mui/text-field'

const PaymentInAdmin = () => {
  const userData = JSON.parse(localStorage.getItem('userData') as string)
  const storedToken = window.localStorage.getItem('token')
  const schoolId = userData.school_id
  const [selectedUser, setSelectedUser] = useState<string>('')
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [unit, setUnit] = useState<string>('')
  const [units, setUnits] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  console.log(selectedUser)

  const [selectedUsers, setSelectedUsers] = useState([])
  const [userDetail, setUserDetails] = useState([])
  const [loading, setLoading] = useState(false) // New state for loading
  const [message, setMessage] = useState<any>('')

  // Fetch units and users
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axiosConfig.get(`/getUnit`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          }
        })
        const filteredUnits = response.data.filter((unit: any) => unit.school_id === schoolId)
        setUnits(filteredUnits)
      } catch (error) {
        console.error('Error fetching units:', error)
      }
    }

    const fetchUsers = async () => {
      try {
        const response = await axiosConfig.get(`/list-siswa/?schoolId=${schoolId}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          }
        })
        setUsers(response.data)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUnits()
    fetchUsers()
  }, [schoolId, storedToken])

  // Filter users based on the selected unit
  useEffect(() => {
    if (unit) {
      const filtered = users.filter(user => user.unit_id === unit && user.school_id === schoolId)
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers([])
    }
  }, [unit, users, schoolId])

  // Handle Search
  const sendMessage = async () => {
    setLoading(true)
    const token = localStorage.getItem('token') // Ambil token dari localStorage

    if (!token) {
      console.error('Token tidak ditemukan')
      toast.error('Token tidak ditemukan!') // Notifikasi error

      return
    }

    try {
      const response = await axiosConfig.post(
        '/sendMessageBroadcast',
        {
          dataUsers: userDetail, // Data pengguna yang akan dikirim pesan
          message: message, // Pesan yang ingin dikirim
          school_id: schoolId
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` // Tambahkan token di header Authorization
          }
        }
      )
      if (response.status === 200) {
        toast.success('Pesan berhasil dikirim!') // Notifikasi sukses
        setLoading(false)
        setMessage('') // Atur ulang message menjadi string kosong
        setUnit('') // Atur ulang unit menjadi string kosong
        setSelectedUser('')
      } else {
        setLoading(false)

        toast.error('Pengiriman tidak sepenuhnya berhasil.') // Notifikasi jika tidak sepenuhnya sukses
      }
    } catch (error: any) {
      // Menangani error
      if (error.response) {
        setLoading(false)
        console.error('Kesalahan dari server:', error.response.data)
        toast.error(`Kesalahan dari server: ${error.response.data.message}`) // Notifikasi error
      } else {
        setLoading(false)
        console.error('Terjadi kesalahan saat mengirim pesan:', error.message)
        toast.error(`Terjadi kesalahan: ${error.message}`) // Notifikasi error
      }
    }
  }

  return (
    <Card>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          Broadcast Whatsapp
        </Typography>

        <Grid container spacing={3} alignItems='center'>
          {/* Unit Selection */}
          <Grid item xs={12} sm={6}>
            <CustomAutocomplete
              fullWidth
              value={units.find(unitObj => unitObj.id === unit) || null} // Correctly set the value
              options={units}
              onChange={(event, newValue) => {
                setUnit(newValue ? newValue.id : '') // Set unit ID based on selection
              }}
              id='autocomplete-unit'
              getOptionLabel={option => option.unit_name || ''}
              renderInput={params => <CustomTextField {...params} label='Unit' variant='outlined' />}
            />
          </Grid>
          {/* Siswa Selection */}
          <Grid item xs={12} sm={6}>
            <CustomAutocomplete
              multiple // Enable multiple selection
              fullWidth
              disableCloseOnSelect // Prevent closing the dropdown on item select
              value={filteredUsers.filter(user => (selectedUsers as any).includes(user.id))} // Filter to get selected users
              options={[{ id: 'selectAll', full_name: 'Select All' }, ...filteredUsers]} // Tambahkan opsi 'Select All'
              onChange={(event, newValue) => {
                // Periksa apakah 'Select All' dipilih
                const isSelectAll = newValue.some(user => user.id === 'selectAll')

                if (isSelectAll) {
                  // Jika 'Select All' dipilih, tambahkan semua pengguna ke selectedUsers
                  const allUserIds = filteredUsers.map(user => user.id)
                  setSelectedUsers(allUserIds as any)

                  // Dapatkan detail semua user
                  const allUserDetails = filteredUsers.map(user => ({
                    id: user.id,
                    phone: user.phone
                  }))
                  setUserDetails(allUserDetails as any)
                } else {
                  // Jika tidak, lakukan update berdasarkan pilihan yang ada
                  const selectedIds = newValue.map(user => user.id)
                  setSelectedUsers(selectedIds as any)

                  // Mendapatkan detail user termasuk ID dan nomor telepon
                  const userDetails = newValue.map(user => {
                    const foundUser = users.find(u => u.id === user.id)

                    return {
                      id: foundUser?.id, // ID user
                      phone: foundUser?.phone // Phone number user
                    }
                  })

                  // Update userDetails dengan ID dan nomor telepon
                  setUserDetails(userDetails as any)
                }
              }}
              id='autocomplete-siswa'
              getOptionLabel={option => option.full_name || ''} // Menampilkan nama lengkap user sebagai label
              renderInput={params => (
                <CustomTextField {...params} label='Siswa' variant='outlined' /> // Render input dengan label
              )}
            />
          </Grid>

          <Grid item xs={12} md={12}>
            <TextField
              fullWidth
              rows={4}
              multiline
              label='Tulis Pesan'
              value={message} // Menggunakan state sebagai nilai TextField
              onChange={e => setMessage(e.target.value)} // Update state saat input berubah
              id='textarea-outlined-static'
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type='submit'
              variant='contained'
              sx={{ marginRight: 2 }}
              disabled={loading || !message || !unit || userDetail.length === 0} // Disable button if loading or if any of the fields are empty
              onClick={sendMessage}
            >
              {loading ? (
                <>
                  <CircularProgress size={24} />
                  &nbsp;Loading...
                </>
              ) : (
                'Kirim'
              )}
            </Button>

            <Button
              type='submit'
              color='error'
              variant='contained'
              sx={{ marginRight: 2 }}
              onClick={() => {
                setMessage('') // Atur ulang message menjadi string kosong
                setUnit('') // Atur ulang unit menjadi string kosong
                setSelectedUser('')
              }}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default PaymentInAdmin
