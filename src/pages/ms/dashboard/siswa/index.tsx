// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Custom Components Imports
import CardStatisticsCharacter from 'src/@core/components/card-statistics/card-stats-with-image'

// ** Styled Component Import
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import AnalyticsCongratulations from 'src/pages/ms/dashboard/siswa/AnalyticsCongratulations'
import TabelPaymentMonth from 'src/pages/ms/dashboard/siswa/TabelPaymentMonth'
import axiosConfig from 'src/configs/axiosConfig'
import { useEffect, useState } from 'react'
import { CircularProgress } from '@mui/material'

const EcommerceDashboard = () => {
  const [totalTunggakanBulanan, setTotalTunggakanBulanan] = useState(null)
  const [totalTunggakanFree, setTotalTunggakanFree] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const data = localStorage.getItem('userData') as any
    const getDataLocal = JSON.parse(data)
    const storedToken = window.localStorage.getItem('token')
    const fetchTotalTunggakanBulananBySiswa = async () => {
      try {
        const response = await axiosConfig.get('/get-total-tunggakan-bulanan-bySiswa', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          },
          params: {
            school_id: getDataLocal.school_id,
            user_id: getDataLocal.id
          }
        })

        setTotalTunggakanBulanan(response.data.amount)
      } catch (error) {
        console.error('Error fetching total pembayaran:', error)

        // toast.error('Failed to fetch data. Please try again later.') // Use toast.error here
      } finally {
        setLoading(false)
      }
    }
    const fetchTotalTunggakanFreeBySiswa = async () => {
      try {
        const response = await axiosConfig.get('/get-total-tunggakan-free-bySiswa', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          },
          params: {
            school_id: getDataLocal.school_id,
            user_id: getDataLocal.id
          }
        })

        setTotalTunggakanFree(response.data.total_amount)
      } catch (error) {
        console.error('Error fetching total pembayaran:', error)

        // toast.error('Failed to fetch data. Please try again later.') // Use toast.error here
      } finally {
        setLoading(false)
      }
    }

    fetchTotalTunggakanBulananBySiswa()
    fetchTotalTunggakanFreeBySiswa()
  }, [])

  const formatRupiah = (amount: any) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0, // No decimal places
      maximumFractionDigits: 0 // No decimal places
    }).format(amount)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress color='secondary' />
      </div>
    ) // Centered loading state with CircularProgress
  }

  return (
    <ApexChartWrapper>
      <KeenSliderWrapper>
        <Grid container spacing={6} className='match-height'>
          <Grid item xs={12} md={6}>
            <AnalyticsCongratulations />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CardStatisticsCharacter
              data={{
                stats: formatRupiah(totalTunggakanBulanan),
                title: 'Total Tunggakan Pembayaran Bulanan',
                chipColor: 'success',
                trendNumber: '+ 10%',
                chipText: 'Year of 2024',
                src: '/images/all/gambar1.png'
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CardStatisticsCharacter
              data={{
                stats: formatRupiah(totalTunggakanFree),
                title: 'Total Tunggakan Pembayaran Bebas',
                chipColor: 'success',
                trendNumber: '+ 10%',
                chipText: 'Year of 2024',
                src: '/images/all/gambar2.png'
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <TabelPaymentMonth />
          </Grid>
        </Grid>
      </KeenSliderWrapper>
    </ApexChartWrapper>
  )
}

export default EcommerceDashboard
