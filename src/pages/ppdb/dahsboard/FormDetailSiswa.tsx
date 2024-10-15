import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import Swal from 'sweetalert2'
import axiosConfig from 'src/configs/axiosConfig'
import { GridExpandMoreIcon } from '@mui/x-data-grid'
import urlImage from 'src/configs/url_image'

interface Props {
  token: any // Adjust type according to your needs
  dataAll: any
}

const LengkapiDataSiswaBaru: React.FC<Props> = ({ token, dataAll }) => {
  const [loading, setLoading] = useState(false)
  const [fullName] = useState<string | null>(dataAll.full_name)
  const [id] = useState<string | null>(dataAll.id)
  const [kpsReceiver, setKpsReceiver] = useState('')
  const [nick_name, setNickName] = useState('')
  const [gender, setGender] = useState('')
  const [nik, setNik] = useState('')
  const [birth_place_date, setBirthPlaceDate] = useState('')
  const [school, setSchool] = useState('')
  const [nisn, setNisn] = useState('')
  const [birth_cert_no, setBirthCertNo] = useState('')
  const [religion, setReligion] = useState('')
  const [address, setAddress] = useState('')
  const [rt, setRt] = useState('')
  const [rw, setRw] = useState('')
  const [dusun, setDusun] = useState('')
  const [kecamatan, setKecamatan] = useState('')
  const [transportation, setTransportation] = useState('')
  const [phone, setPhone] = useState(dataAll.phone)
  const [birth_date] = useState(dataAll.date_of_birth)
  const [kpsNumber, setKpsNumber] = useState('')

  const [fatherName, setFatherName] = useState('')
  const [fatherNik, setFatherNik] = useState('')
  const [fatherBirthYear, setFatherBirthYear] = useState('')
  const [fatherEducation, setFatherEducation] = useState('')
  const [fatherIncome, setFatherIncome] = useState('')
  const [fatherJob, setFatherJob] = useState('')

  const [motherName, setMotherName] = useState('')
  const [motherNik, setMotherNik] = useState('')
  const [motherBirthYear, setMotherBirthYear] = useState('')
  const [motherEducation, setMotherEducation] = useState('')
  const [motherJob, setMotherJob] = useState('')
  const [motherIncome, setMotherIncome] = useState('')

  const [guardianName, setGuardianName] = useState('')
  const [guardianNik, setGuardianNik] = useState('')
  const [guardianBirthYear, setGuardianBirthYear] = useState('')
  const [guardianEducation, setGuardianEducation] = useState('')
  const [guardianJob, setGuardianJob] = useState('')
  const [guardianIncome, setGuardianIncome] = useState('')

  const [homePhone, setHomePhone] = useState('')
  const [mobilePhone, setMobilePhone] = useState('')
  const [email, setEmail] = useState(dataAll.email)

  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [distanceToSchool, setDistanceToSchool] = useState('')
  const [distanceInKm, setDistanceInKm] = useState('')
  const [siblings, setSiblings] = useState('')
  const [travelHours, setTravelHours] = useState('')
  const [travelMinutes, setTravelMinutes] = useState('')

  const [kartuKeluarga, setKartuKeluarga] = useState<File>()
  const [akteLahir, setAkteLahir] = useState<File>()
  const [ktpOrangtua, setKtpOrangtua] = useState<File>()
  const [ijasah, setIjasah] = useState<File>()

  const [isUpdate, setIsUpdate] = useState(false) // State to toggle between Save and Update

  const [openDialog, setOpenDialog] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  function formatDate(dateString: any) {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0') // Bulan mulai dari 0 di JavaScript
    const year = date.getFullYear()

    return `${day}-${month}-${year}`
  }

  const handleChange = (event: any) => {
    setKpsReceiver(event.target.value)
  }

  useEffect(() => {
    axiosConfig
      .post(
        '/detailCalonSiswaBaru',
        { uid: token },
        { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } }
      )
      .then(response => {
        console.log(response.data)

        const {
          nick_name,
          gender,
          nik,
          birth_place_date,
          school,
          nisn,
          birth_cert_no,
          religion,
          address,
          rt,
          rw,
          dusun,
          kecamatan,
          transportation,
          phone,
          kps_receiver,
          kps_number,
          father_name,
          father_nik,
          father_birth_year,
          father_education,
          father_income,
          father_job,
          mother_name,
          mother_nik,
          mother_birth_year,
          mother_education,
          mother_job,
          mother_income,
          guardian_name,
          guardian_nik,
          guardian_birth_year,
          guardian_education,
          guardian_job,
          guardian_income,
          home_phone,
          mobile_phone,
          height,
          weight,
          distance_to_school,
          distance_in_km,
          siblings,
          travel_hours,
          travel_minutes,
          kartu_keluarga,
          akte_lahir,
          ktp_orangtua,
          ijasah
        } = response.data
        setNickName(nick_name)
        setGender(gender)
        setNik(nik)
        setBirthPlaceDate(birth_place_date)
        setSchool(school)
        setNisn(nisn)
        setBirthCertNo(birth_cert_no)
        setReligion(religion)
        setAddress(address)
        setRt(rt)
        setRw(rw)
        setDusun(dusun)
        setKecamatan(kecamatan)
        setTransportation(transportation)
        setPhone(phone)
        setKpsReceiver(kps_receiver)
        setKpsNumber(kps_number)

        // Set father's details
        setFatherName(father_name)
        setFatherNik(father_nik)
        setFatherBirthYear(father_birth_year)
        setFatherEducation(father_education)
        setFatherIncome(father_income)
        setFatherJob(father_job)

        // Set mother's details
        setMotherName(mother_name)
        setMotherNik(mother_nik)
        setMotherBirthYear(mother_birth_year)
        setMotherEducation(mother_education)
        setMotherJob(mother_job)
        setMotherIncome(mother_income)

        // Set guardian's details
        setGuardianName(guardian_name)
        setGuardianNik(guardian_nik)
        setGuardianBirthYear(guardian_birth_year)
        setGuardianEducation(guardian_education)
        setGuardianJob(guardian_job)
        setGuardianIncome(guardian_income)

        // Set additional fields
        setHomePhone(home_phone)
        setMobilePhone(mobile_phone)
        setHeight(height)
        setWeight(weight)
        setDistanceToSchool(distance_to_school)
        setDistanceInKm(distance_in_km)
        setSiblings(siblings)
        setTravelHours(travel_hours)
        setTravelMinutes(travel_minutes)
        setKartuKeluarga(kartu_keluarga)
        setAkteLahir(akte_lahir)
        setKtpOrangtua(ktp_orangtua)
        setIjasah(ijasah)
      })
      .catch(error => {
        console.error('Error fetching details:', error)
      })
  }, [token])

  // JSON Variables
  const genderOptions = [
    { value: 'laki-laki', label: 'Laki-Laki' },
    { value: 'perempuan', label: 'Perempuan' }
  ]

  const religionOptions = [
    { value: 'islam', label: 'Islam' },
    { value: 'kristen', label: 'Kristen' },
    { value: 'hindu', label: 'Hindu' },
    { value: 'buddha', label: 'Buddha' },
    { value: 'lainnya', label: 'Lainnya' }
  ]

  const motherJobOptions = [
    { value: 'wiraswasta', label: 'Wiraswasta' },
    { value: 'pegawai_negeri', label: 'Pegawai Negeri' },
    { value: 'karyawan_swasta', label: 'Karyawan Swasta' },
    { value: 'petani', label: 'Petani' },
    { value: 'lainnya', label: 'Lainnya' }
  ]

  const motherEducationOptions = [
    { value: 'sd', label: 'SD' },
    { value: 'smp', label: 'SMP' },
    { value: 'sma', label: 'SMA / Sederajat' },
    { value: 'diploma', label: 'Diploma' },
    { value: 'sarjana', label: 'Sarjana' },
    { value: 'pasca_sarjana', label: 'Pasca Sarjana' },
    { value: 'lainnya', label: 'Lainnya' }
  ]

  const guardianJobOptions = [
    { value: 'wiraswasta', label: 'Wiraswasta' },
    { value: 'pegawai_negeri', label: 'Pegawai Negeri' },
    { value: 'karyawan_swasta', label: 'Karyawan Swasta' },
    { value: 'petani', label: 'Petani' },
    { value: 'lainnya', label: 'Lainnya' }
  ]

  const guardianEducationOptions = [
    { value: 'sd', label: 'SD' },
    { value: 'smp', label: 'SMP' },
    { value: 'sma', label: 'SMA / Sederajat' },
    { value: 'diploma', label: 'Diploma' },
    { value: 'sarjana', label: 'Sarjana' },
    { value: 'pasca_sarjana', label: 'Pasca Sarjana' },
    { value: 'lainnya', label: 'Lainnya' }
  ]
  const transportasi = [
    { value: 'Sepeda Motor', label: 'Sepeda Motor' },
    { value: 'Mobil', label: 'Mobil' },
    { value: 'Sepeda', label: 'Sepeda' },
    { value: 'Bus', label: 'Bus' },
    { value: 'Kereta', label: 'Kereta' },
    { value: 'Pesawat', label: 'Pesawat' },
    { value: 'Kapal', label: 'Kapal' },
    { value: 'Lainnya', label: 'Lainnya' }
  ]
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log(motherBirthYear)

    e.preventDefault()
    setLoading(true)

    // Submit form logic here...
    setLoading(false)

    setIsUpdate(true) // Show Update button
    const formData = new FormData()

    // Append basic student data
    formData.append('fullName', fullName || '')
    formData.append('id', id || '')
    formData.append('kpsReceiver', kpsReceiver)
    formData.append('nick_name', nick_name)
    formData.append('gender', gender)
    formData.append('nik', nik)
    formData.append('birth_place_date', birth_place_date)
    formData.append('school', school)
    formData.append('nisn', nisn)
    formData.append('birth_cert_no', birth_cert_no)
    formData.append('religion', religion)
    formData.append('address', address)
    formData.append('rt', rt)
    formData.append('rw', rw)
    formData.append('dusun', dusun)
    formData.append('kecamatan', kecamatan)
    formData.append('transportation', transportation)
    formData.append('phone', dataAll.phone)
    formData.append('birth_date', birth_date)
    formData.append('kpsNumber', kpsNumber || '')

    // Append father's data
    formData.append('fatherName', fatherName)
    formData.append('fatherNik', fatherNik)
    formData.append('fatherBirthYear', fatherBirthYear)
    formData.append('fatherEducation', fatherEducation)
    formData.append('fatherIncome', fatherIncome)
    formData.append('fatherJob', fatherJob)

    // Append mother's data
    formData.append('motherName', motherName)
    formData.append('motherNik', motherNik)
    formData.append('motherBirthYear', motherBirthYear)
    formData.append('motherEducation', motherEducation)
    formData.append('motherJob', motherJob)
    formData.append('motherIncome', motherIncome)

    // Append guardian's data
    formData.append('guardianName', guardianName)
    formData.append('guardianNik', guardianNik)
    formData.append('guardianBirthYear', guardianBirthYear)
    formData.append('guardianEducation', guardianEducation)
    formData.append('guardianJob', guardianJob)
    formData.append('guardianIncome', guardianIncome)

    // Append contact details
    formData.append('homePhone', homePhone)
    formData.append('mobilePhone', mobilePhone)
    formData.append('email', dataAll.email)

    // Append physical information
    formData.append('height', height)
    formData.append('weight', weight)
    formData.append('distanceToSchool', distanceToSchool)
    formData.append('distanceInKm', distanceInKm)
    formData.append('siblings', siblings)
    formData.append('travelHours', travelHours)
    formData.append('travelMinutes', travelMinutes)

    formData.append('school_id', dataAll.school_id)
    console.log(kartuKeluarga)
    console.log(akteLahir)

    // Append file uploads
    if (kartuKeluarga) formData.append('kartuKeluarga', kartuKeluarga)
    if (akteLahir) formData.append('akteLahir', akteLahir)
    if (ktpOrangtua) formData.append('ktpOrangtua', ktpOrangtua)
    if (ijasah) formData.append('ijasah', ijasah)
    console.log(Object.fromEntries(formData.entries()))

    axiosConfig
      .post('/sendDataSiswaBaruAll', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` // Assuming token is available
        }
      })
      .then(response => {
        console.log('Form submitted successfully:', response.data)
        Swal.fire({
          title: 'Registrasi Siswa Baru Berhasil',
          text: 'Segera cek nomor wa anda untuk melakukan proses pembayaran.',
          icon: 'success',
          confirmButtonText: 'OK'
        })
      })
      .catch(error => {
        console.error('Error submitting form:', error)
        Swal.fire({
          title: 'Error',
          text: 'Terjadi kesalahan saat registrasi, silakan coba lagi.',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      })
      .finally(() => {
        setLoading(false) // Set loading to false after submission completes
      })
  }
  const handleUpdateClick = () => {
    setIsUpdate(false) // Hide the Update button
  }

  const formatRupiah = (value: string) => {
    const numberString = value.replace(/[^,\d]/g, '').toString()
    const split = numberString.split(',')
    const sisa = split[0].length % 3
    let rupiah = split[0].substr(0, sisa)
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi)

    if (ribuan) {
      const separator = sisa ? '.' : ''
      rupiah += separator + ribuan.join('.')
    }

    rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah

    return 'Rp ' + rupiah
  }

  const renderUploadedFile = (file: File | null) => {
    const existingFilePath = ''

    return (
      <div>
        {file ? (
          <>
            <p>{file.name}</p>
            {file.type && file.type.startsWith('image/') && (
              <img src={URL.createObjectURL(file)} alt={file.name} style={{ width: '100px', marginTop: '10px' }} />
            )}
          </>
        ) : (
          existingFilePath && (
            <img
              src={`${urlImage}/${existingFilePath}`} // Ensure proper slash between URL and file path
              alt='Existing file'
              style={{ width: '100px', marginTop: '10px' }}
            />
          )
        )}
      </div>
    )
  }

  const handleClickOpen = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
    setSelectedImage(null)
  }

  return (
    <Card>
      <CardHeader title='IDENTITAS PESERTA DIDIK' />
      <Divider sx={{ m: '0 !important' }} />
      <form onSubmit={handleFormSubmit}>
        <CardContent>
          <Grid spacing={1}>
            {/* Personal Data Section */}
            <Accordion>
              <AccordionSummary expandIcon={<GridExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
                <Typography variant='body1' sx={{ fontWeight: 600 }}>
                  A. Data Pribadi
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      name='id'
                      value={id}
                      placeholder='ABDU KHOR'
                      style={{ display: id ? 'none' : 'block' }}
                    />
                    <CustomTextField
                      fullWidth
                      label={<span>Nama Lengkap</span>}
                      name='fullName'
                      value={fullName}
                      placeholder='ABDU KHOR'
                      required
                      InputProps={{
                        readOnly: true
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      label={<span>Nama Panggilan</span>}
                      name='nickName'
                      placeholder='Panggilan'
                      value={nick_name}
                      onChange={e => setNickName(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      label={<span>Jenis Kelamin</span>}
                      name='gender'
                      placeholder='Pilih Jenis Kelamin'
                      select
                      value={gender}
                      onChange={e => setGender(e.target.value)}
                      required
                    >
                      {genderOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      label={<span>NIK</span>}
                      name='nik'
                      value={nik}
                      placeholder='6301080809160001'
                      onChange={e => {
                        const value = e.target.value.replace(/[^0-9]/g, '')
                        if (value.length <= 16) {
                          setNik(value)
                        }
                      }}
                      required
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      label={<span>Tempat dan Tanggal Lahir</span>}
                      name='birthPlaceDate'
                      placeholder='TANAH LAUT'
                      value={birth_place_date}
                      onChange={e => setBirthPlaceDate(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      label={<span>Asal Sekolah</span>}
                      name='school'
                      placeholder='Nama Sekolah'
                      value={school}
                      onChange={e => setSchool(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      label={<span>NISN</span>}
                      name='nisn'
                      placeholder='0166235335'
                      value={nisn}
                      onChange={e => setNisn(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      label={<span>No. Registrasi Akta Lahir</span>}
                      name='birthCertNo'
                      placeholder='123456789'
                      value={birth_cert_no}
                      onChange={e => setBirthCertNo(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      label={<span>Agama</span>}
                      name='religion'
                      placeholder='Pilih Agama'
                      value={religion}
                      select
                      onChange={e => setReligion(e.target.value)}
                      required
                    >
                      {religionOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      label={<span>Alamat Tempat Tinggal</span>}
                      name='address'
                      placeholder='JL ABADI MAKMUR / GUNTUNG KEMINTING'
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <CustomTextField
                      fullWidth
                      label={<span>RT</span>}
                      name='rt'
                      placeholder='RT'
                      value={rt}
                      onInput={(e: any) => {
                        const value = e.target.value.replace(/[^0-9]/g, '')
                        if (!e.target.value.startsWith('RT')) {
                          e.target.value = 'RT '
                        } else {
                          e.target.value = `RT ${value}`
                        }
                        setRt(e.target.value) // Set the RT value
                      }}
                      required
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <CustomTextField
                      fullWidth
                      label={<span>RW</span>}
                      name='rw'
                      placeholder='RW'
                      value={rw}
                      onInput={(e: any) => {
                        const value = e.target.value.replace(/[^0-9]/g, '')
                        if (!e.target.value.startsWith('RW')) {
                          e.target.value = 'RW '
                        } else {
                          e.target.value = `RW ${value}`
                        }
                        setRw(e.target.value) // Set the RW value
                      }}
                      required
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      label={<span>Nama Dusun</span>}
                      name='dusun'
                      placeholder='Dusun XYZ'
                      value={dusun}
                      onChange={e => setDusun(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      label={<span>Kecamatan</span>}
                      name='kecamatan'
                      placeholder='Kec. Banjarbaru Selatan'
                      value={kecamatan}
                      onChange={e => setKecamatan(e.target.value)}
                      required
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      label={<span>Transportasi</span>}
                      name='transportation'
                      placeholder='Pilih Transportasi'
                      value={transportation}
                      select
                      onChange={e => setTransportation(e.target.value)}
                      required
                    >
                      {transportasi.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  </Grid>

                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      label={<span>No. Telepon</span>}
                      name='phone'
                      placeholder='62-123-456-7890'
                      onInput={(e: any) => {
                        const value = e.target.value.replace(/[^0-9]/g, '')
                        if (!value.startsWith('62')) {
                          e.target.value = '62'
                        } else {
                          e.target.value = value
                        }
                        setPhone(e.target.value) // Set the RW value
                      }}
                      value={phone}
                      required
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      label='Date of Birth'
                      value={formatDate(birth_date)}
                      placeholder='YYYY-MM-DD'
                      InputProps={{
                        readOnly: true
                      }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Grid container spacing={2}>
                      <Grid item xs={3}>
                        <FormControl component='fieldset'>
                          <FormLabel component='legend'>Apakah Penerima KPS</FormLabel>
                          <FormGroup row>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name='kpsReceiver'
                                  checked={kpsReceiver === 'ya'}
                                  onChange={handleChange}
                                  value='ya'
                                />
                              }
                              label='Ya'
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name='kpsReceiver'
                                  checked={kpsReceiver === 'tidak'}
                                  onChange={handleChange}
                                  value='tidak'
                                />
                              }
                              label='Tidak'
                            />
                          </FormGroup>
                        </FormControl>
                      </Grid>
                      {kpsReceiver === 'ya' && (
                        <Grid item xs={9}>
                          <CustomTextField
                            fullWidth
                            label={<span>No. KPS</span>}
                            name='kpsNumber'
                            placeholder='123-456-7890'
                            value={kpsNumber}
                            onChange={e => setKpsNumber(e.target.value)}
                          />
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Father Data Section */}
            <Accordion>
              <AccordionSummary expandIcon={<GridExpandMoreIcon />} aria-controls='panel2a-content' id='panel2a-header'>
                <Typography variant='body1' sx={{ fontWeight: 600 }}>
                  B. Data Ayah Kandung
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      label='Nama'
                      name='fatherName'
                      placeholder=''
                      required
                      value={fatherName}
                      onChange={e => setFatherName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      label='NIK Ayah'
                      name='fatherNik'
                      placeholder=''
                      required
                      value={fatherNik}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value.replace(/[^0-9]/g, '')
                        if (value.length <= 16) {
                          setFatherNik(value) // Update the state value
                        }
                      }}
                      inputProps={{ maxLength: 16 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      label='Tahun Lahir'
                      name='fatherBirthYear'
                      placeholder=''
                      required
                      value={fatherBirthYear}
                      onChange={e => {
                        const value = e.target.value
                        if (/^\d{0,4}$/.test(value)) {
                          setFatherBirthYear(value)
                        }
                      }}
                      inputProps={{ maxLength: 4 }} // Batas panjang maksimal 4 karakter
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      label='Pendidikan'
                      name='fatherEducation'
                      placeholder='Pilih Pendidikan'
                      select
                      required
                      value={fatherEducation}
                      onChange={e => setFatherEducation(e.target.value)}
                    >
                      {motherEducationOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      label='Penghasilan'
                      name='fatherIncome'
                      placeholder=''
                      required
                      value={fatherIncome}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const rawValue = e.target.value.replace(/[^0-9]/g, '')
                        setFatherIncome(formatRupiah(rawValue))
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      label='Pekerjaan'
                      name='fatherJob'
                      placeholder='Pilih Pekerjaan'
                      select
                      required
                      value={fatherJob}
                      onChange={e => setFatherJob(e.target.value)}
                    >
                      {motherJobOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Mother Data Section */}
            <Accordion>
              <AccordionSummary expandIcon={<GridExpandMoreIcon />} aria-controls='panel3a-content' id='panel3a-header'>
                <Typography variant='body1' sx={{ fontWeight: 600 }}>
                  C. Data Ibu Kandung
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      label='Nama'
                      name='motherName'
                      placeholder='SHELA WATI'
                      value={motherName}
                      onChange={e => setMotherName(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      label='NIK Ibu'
                      name='motherNik'
                      placeholder=''
                      value={motherNik}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value.replace(/[^0-9]/g, '')
                        if (value.length <= 16) {
                          setMotherNik(value)
                        }
                      }}
                      inputProps={{ maxLength: 16 }}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      label='Tahun Lahir'
                      name='motherBirthYear'
                      placeholder='1994'
                      value={motherBirthYear}
                      onChange={e => {
                        const value = e.target.value
                        if (/^\d{0,4}$/.test(value)) {
                          setMotherBirthYear(value)
                        }
                      }}
                      inputProps={{ maxLength: 4 }} // Batas panjang maksimal 4 karakter
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      label='Pendidikan terakhir'
                      name='motherEducation'
                      placeholder='Pilih Pendidikan'
                      select
                      value={motherEducation}
                      onChange={e => setMotherEducation(e.target.value)}
                      required
                    >
                      {motherEducationOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      label='Pekerjaan'
                      name='motherJob'
                      placeholder='Pilih Pekerjaan'
                      select
                      value={motherJob}
                      onChange={e => setMotherJob(e.target.value)}
                      required
                    >
                      {motherJobOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      label='Penghasilan Bulanan'
                      name='motherIncome'
                      placeholder='Tidak Berpenghasilan'
                      value={motherIncome}
                      onInput={(e: any) => {
                        const rawValue = e.target.value.replace(/[^0-9]/g, '')
                        setMotherIncome(formatRupiah(rawValue))
                      }}
                      required
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Guardian Data Section */}
            <Accordion>
              <AccordionSummary expandIcon={<GridExpandMoreIcon />} aria-controls='panel4a-content' id='panel4a-header'>
                <Typography variant='body1' sx={{ fontWeight: 600 }}>
                  D. Data Wali
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  {/* Nama Wali */}
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      label='Nama'
                      name='guardianName'
                      placeholder='Masukkan Nama Wali'
                      value={guardianName}
                      onChange={e => setGuardianName(e.target.value)}
                    />
                  </Grid>

                  {/* NIK Wali */}
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      label='NIK Wali'
                      name='guardianNik'
                      placeholder='Masukkan NIK Wali'
                      value={guardianNik}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value.replace(/[^0-9]/g, '')
                        if (value.length <= 16) {
                          setGuardianNik(value)
                        }
                      }}
                      inputProps={{ maxLength: 16 }}
                    />
                  </Grid>

                  {/* Tahun Lahir */}
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      label='Tahun Lahir'
                      name='guardianBirthYear'
                      placeholder='Masukkan Tahun Lahir'
                      value={guardianBirthYear}
                      onChange={e => {
                        const value = e.target.value
                        if (/^\d{0,4}$/.test(value)) {
                          setGuardianBirthYear(value)
                        }
                      }}
                      inputProps={{ maxLength: 4 }} // Batas panjang maksimal 4 karakter
                    />
                  </Grid>

                  {/* Pendidikan Terakhir */}
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      label='Pendidikan Terakhir'
                      name='guardianEducation'
                      placeholder='Pilih Pendidikan Terakhir'
                      select
                      value={guardianEducation}
                      onChange={e => setGuardianEducation(e.target.value)}
                    >
                      {guardianEducationOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  </Grid>

                  {/* Pekerjaan */}
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      label='Pekerjaan'
                      name='guardianJob'
                      placeholder='Pilih Pekerjaan'
                      select
                      value={guardianJob}
                      onChange={e => setGuardianJob(e.target.value)}
                    >
                      {guardianJobOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  </Grid>

                  {/* Penghasilan */}
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      label='Penghasilan'
                      name='guardianIncome'
                      placeholder='Masukkan Penghasilan'
                      value={guardianIncome}
                      onInput={(e: any) => {
                        const rawValue = e.target.value.replace(/[^0-9]/g, '')
                        setGuardianIncome(formatRupiah(rawValue))
                      }}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Periodic Data Section */}
            <Accordion>
              <AccordionSummary expandIcon={<GridExpandMoreIcon />} aria-controls='panel5a-content' id='panel5a-header'>
                <Typography variant='body1' sx={{ fontWeight: 600 }}>
                  E. Kontak
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={4}>
                    <CustomTextField
                      fullWidth
                      label='Nomor Telepon Rumah'
                      name='homePhone'
                      placeholder=''
                      value={homePhone}
                      onInput={(e: any) => {
                        const value = e.target.value.replace(/[^0-9]/g, '') // Remove non-numeric characters
                        setHomePhone(value) // Update the state with the cleaned value
                      }}
                      required
                    />
                  </Grid>

                  {/* Nomor HP */}
                  <Grid item xs={4}>
                    <CustomTextField
                      fullWidth
                      label='Nomor HP'
                      name='mobilePhone'
                      placeholder=''
                      value={mobilePhone}
                      onInput={(e: any) => {
                        let value = e.target.value.replace(/[^0-9]/g, '') // Remove non-numeric characters
                        if (!value.startsWith('62')) {
                          value = '62' + value // Set default to '62' if not starting with it
                        }
                        setMobilePhone(value) // Update the state with the cleaned and formatted value
                      }}
                      required
                    />
                  </Grid>

                  {/* E-mail */}
                  <Grid item xs={4}>
                    <CustomTextField
                      fullWidth
                      label='E-mail'
                      name='email'
                      placeholder=''
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Achievement Data Section */}
            <Accordion>
              <AccordionSummary expandIcon={<GridExpandMoreIcon />} aria-controls='panel6a-content' id='panel6a-header'>
                <Typography variant='body1' sx={{ fontWeight: 600 }}>
                  F. Data Pribadi
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={4}>
                    <CustomTextField
                      fullWidth
                      label='Tinggi Badan (cm)'
                      name='height'
                      placeholder='Masukkan tinggi badan dalam cm'
                      type='number'
                      value={height}
                      onChange={e => setHeight(e.target.value)}
                      required
                    />
                  </Grid>

                  {/* Berat Badan */}
                  <Grid item xs={4}>
                    <CustomTextField
                      fullWidth
                      label='Berat Badan (kg)'
                      name='weight'
                      placeholder='Masukkan berat badan dalam kg'
                      type='number'
                      value={weight}
                      onChange={e => setWeight(e.target.value)}
                      required
                    />
                  </Grid>

                  {/* Jarak rumah ke sekolah */}
                  <Grid item xs={4}>
                    <Typography variant='body1'>Jarak rumah ke sekolah:</Typography>
                    <RadioGroup
                      row
                      name='distanceToSchool'
                      value={distanceToSchool}
                      onChange={e => setDistanceToSchool(e.target.value)}
                    >
                      <FormControlLabel value='kurang1km' control={<Radio />} label='Kurang dari 1 KM' />
                      <FormControlLabel value='lebih1km' control={<Radio />} label='Lebih dari 1 KM' />
                    </RadioGroup>
                  </Grid>

                  {/* Sebutkan dalam kilometer */}
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      label='Sebutkan dalam kilometer'
                      name='distanceInKm'
                      placeholder='Masukkan jarak dalam km'
                      type='number'
                      value={distanceInKm}
                      onChange={e => setDistanceInKm(e.target.value)}
                      required
                    />
                  </Grid>

                  {/* Jumlah Saudara Kandung */}
                  <Grid item xs={6}>
                    <CustomTextField
                      fullWidth
                      label='Jumlah Saudara Kandung'
                      name='siblings'
                      placeholder='Masukkan jumlah saudara kandung'
                      type='number'
                      value={siblings}
                      onChange={e => setSiblings(e.target.value)}
                      required
                    />
                  </Grid>

                  {/* Waktu Tempuh */}
                  <Grid container spacing={2} item xs={12}>
                    <Typography variant='body1'>Waktu Tempuh:</Typography>
                    <Grid container item xs={12} spacing={2}>
                      <Grid item xs={6}>
                        <CustomTextField
                          fullWidth
                          label='Jam'
                          name='travelHours'
                          placeholder=''
                          type='number'
                          inputProps={{ min: 0, max: 23 }}
                          value={travelHours}
                          onInput={(e: any) => {
                            let value = parseInt(e.target.value, 10)
                            if (value < 0) value = 0
                            if (value > 23) value = 23
                            setTravelHours(value.toString())
                          }}
                          required
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <CustomTextField
                          fullWidth
                          label='Menit'
                          name='travelMinutes'
                          placeholder=''
                          type='number'
                          inputProps={{ min: 0, max: 59 }}
                          value={travelMinutes}
                          onInput={(e: any) => {
                            let value = parseInt(e.target.value, 10)
                            if (value < 0) value = 0
                            if (value > 59) value = 59
                            setTravelMinutes(value.toString())
                          }}
                          required
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<GridExpandMoreIcon />} aria-controls='panel7a-content' id='panel7a-header'>
                <Typography variant='body1' sx={{ fontWeight: 600 }}>
                  G. Upload Data
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={3}>
                    <CustomTextField
                      fullWidth
                      label='Upload Kartu Keluarga'
                      name='kartuKeluarga'
                      type='file'
                      onChange={e => setKartuKeluarga((e.target as HTMLInputElement).files?.[0])}
                    />
                    {kartuKeluarga && (
                      <>
                        {renderUploadedFile(kartuKeluarga as any)}
                        <img
                          src={`${urlImage}${kartuKeluarga}`}
                          style={{ width: '100px', marginTop: '10px', cursor: 'pointer' }}
                          onClick={() => handleClickOpen(`${urlImage}${kartuKeluarga}`)}
                          alt='Kartu Keluarga'
                        />
                      </>
                    )}
                  </Grid>

                  <Grid item xs={3}>
                    <CustomTextField
                      fullWidth
                      label='Upload Akte Lahir'
                      name='akteLahir'
                      type='file'
                      onChange={e => setAkteLahir((e.target as HTMLInputElement).files?.[0])}
                    />
                    {akteLahir && (
                      <>
                        {renderUploadedFile(akteLahir as any)}
                        <img
                          src={`${urlImage}${akteLahir}`}
                          style={{ width: '100px', marginTop: '10px', cursor: 'pointer' }}
                          onClick={() => handleClickOpen(`${urlImage}${akteLahir}`)}
                          alt='Akte Lahir'
                        />
                      </>
                    )}
                  </Grid>

                  <Grid item xs={3}>
                    <CustomTextField
                      fullWidth
                      label='Upload KTP Orangtua'
                      name='ktpOrangtua'
                      type='file'
                      onChange={e => setKtpOrangtua((e.target as HTMLInputElement).files?.[0])}
                    />
                    {ktpOrangtua && (
                      <>
                        {renderUploadedFile(ktpOrangtua as any)}
                        <img
                          src={`${urlImage}${ktpOrangtua}`}
                          style={{ width: '100px', marginTop: '10px', cursor: 'pointer' }}
                          onClick={() => handleClickOpen(`${urlImage}${ktpOrangtua}`)}
                          alt='KTP Orangtua'
                        />
                      </>
                    )}
                  </Grid>

                  <Grid item xs={3}>
                    <CustomTextField
                      fullWidth
                      label='Upload Ijazah'
                      name='ijasah'
                      type='file'
                      onChange={e => setIjasah((e.target as HTMLInputElement).files?.[0])}
                    />
                    {ijasah && (
                      <>
                        {renderUploadedFile(ijasah as any)}
                        <img
                          src={`${urlImage}${ijasah}`}
                          style={{ width: '100px', marginTop: '10px', cursor: 'pointer' }}
                          onClick={() => handleClickOpen(`${urlImage}${ijasah}`)}
                          alt='Ijazah'
                        />
                      </>
                    )}
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </CardContent>

        <CardActions>
          {!isUpdate ? (
            <Button onClick={(e: any) => handleFormSubmit(e)} sx={{ mr: 2 }} variant='contained' color='error'>
              Simpan
            </Button>
          ) : (
            <Button
              onClick={(e: any) => {
                handleFormSubmit(e), handleUpdateClick
              }}
              sx={{ mr: 2 }}
              variant='contained'
              color='primary'
            >
              Update
            </Button>
          )}
        </CardActions>
      </form>
      {/* CircularProgress */}
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999
          }}
        >
          <CircularProgress color='primary' />
        </Box>
      )}
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Image Preview</DialogTitle>
        <DialogContent>
          {selectedImage && <img src={selectedImage} style={{ width: '100%' }} alt='Preview' />}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default LengkapiDataSiswaBaru
