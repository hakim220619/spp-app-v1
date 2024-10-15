import { useState, useEffect } from 'react'
import CircularProgress from '@mui/material/CircularProgress' // Import CircularProgress

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Custom Components Imports
import CardStatisticsCharacter from 'src/@core/components/card-statistics/card-stats-with-image'

// ** Styled Component Import
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import AnalyticsCongratulations from 'src/views/dashboards/analytics/AnalyticsCongratulations'
import SaldoBySchool from 'src/pages/ms/dashboard/admin/saldoByschool'
import ActivityTimeLine from 'src/pages/ms/dashboard/admin/ActivityTimeline'
import axiosConfig from 'src/configs/axiosConfig'
import { useRouter } from 'next/router'
import TotalVisit from 'src/pages/ms/dashboard/admin/TotalVisits'

const AdminDashboard = () => {
  const [totalPembayaranBulanan, setTotalPembayaranBulanan] = useState(null)
  const [totalPembayaranBebas, setTotalPembayaranBebas] = useState(null)
  const [totalTunggakanBulanan, setTotalTunggakanBulanan] = useState(null)
  const [totalTunggakanBebas, setTotalTunggakanBebas] = useState(null)
  const [totalPaymentThisDay, setTotalPaymentThisDay] = useState(null)
  const [totalPaymentThisWeek, setTotalPaymentThisWeek] = useState(null)
  const [totalPaymentThisMonth, setTotalPaymentThisMonth] = useState(null)
  const [totalPaymentThisYears, setTotalPaymentThisYears] = useState(null)
  const [totalLoginMmLogs, setTotalLoginMmLogs] = useState<any>(null)
  const [role, setrole] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const data = localStorage.getItem('userData') as string | null

    if (!data) {
      // Handle the case where there's no userData, e.g., redirect to login
      router.push('/login') // Assuming you want to redirect if no user data is found

      return // Ensure no further execution if redirecting
    }

    const getDataLocal = JSON.parse(data)
    setrole(getDataLocal.role)

    const storedToken = window.localStorage.getItem('token')
    const fetchTotalPembayaranBulanan = async () => {
      try {
        const response = await axiosConfig.get('/get-total-pembayaran-bulanan', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          },
          params: {
            school_id: getDataLocal.school_id // Send the school_id as a query parameter
          }
        })

        setTotalPembayaranBulanan(response.data.amount)
      } catch (error) {
        console.error('Error fetching total pembayaran:', error)

        // toast.error('Failed to fetch data. Please try again later.') // Use toast.error here
      } finally {
        setLoading(false)
      }
    }
    const fetchTotalPembayaranBebas = async () => {
      try {
        const response = await axiosConfig.get('/get-total-pembayaran-bebas', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          },
          params: {
            school_id: getDataLocal.school_id // Send the school_id as a query parameter
          }
        })

        setTotalPembayaranBebas(response.data.amount)
      } catch (error) {
        console.error('Error fetching total pembayaran:', error)

        // toast.error('Failed to fetch data. Please try again later.') // Use toast.error here
      } finally {
        setLoading(false)
      }
    }
    const fetchTotalTunggakanBulanan = async () => {
      try {
        const response = await axiosConfig.get('/get-total-tunggakan-bulanan', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          },
          params: {
            school_id: getDataLocal.school_id // Send the school_id as a query parameter
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
    const fetchTotalTunggakanBebas = async () => {
      try {
        const response = await axiosConfig.get('/get-total-tunggakan-bebas', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          },
          params: {
            school_id: getDataLocal.school_id // Send the school_id as a query parameter
          }
        })
        const total: any = response.data.total_payment - response.data.amount
        setTotalTunggakanBebas(total)
      } catch (error) {
        console.error('Error fetching total pembayaran:', error)

        // toast.error('Failed to fetch data. Please try again later.') // Use toast.error here
      } finally {
        setLoading(false)
      }
    }
    const fetchTotalPaymentThisDay = async () => {
      try {
        const response = await axiosConfig.get('/get-total-payment-this-day', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          },
          params: {
            school_id: getDataLocal.school_id // Send the school_id as a query parameter
          }
        })
        const total: any = response.data.total_payment + response.data.amount
        setTotalPaymentThisDay(total)
      } catch (error) {
        console.error('Error fetching total pembayaran:', error)

        // toast.error('Failed to fetch data. Please try again later.') // Use toast.error here
      } finally {
        setLoading(false)
      }
    }
    const fetchTotalPaymentThisWeek = async () => {
      try {
        const response = await axiosConfig.get('/get-total-payment-this-week', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          },
          params: {
            school_id: getDataLocal.school_id // Send the school_id as a query parameter
          }
        })
        const total: any = response.data.amount + response.data.total_payment

        setTotalPaymentThisWeek(total)
      } catch (error) {
        console.error('Error fetching total pembayaran:', error)

        // toast.error('Failed to fetch data. Please try again later.') // Use toast.error here
      } finally {
        setLoading(false)
      }
    }
    const fetchTotalPaymentThisMonth = async () => {
      try {
        const response = await axiosConfig.get('/get-total-payment-this-month', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          },
          params: {
            school_id: getDataLocal.school_id // Send the school_id as a query parameter
          }
        })
        const total: any = response.data.amount + response.data.total_payment

        setTotalPaymentThisMonth(total)
      } catch (error) {
        console.error('Error fetching total pembayaran:', error)

        // toast.error('Failed to fetch data. Please try again later.') // Use toast.error here
      } finally {
        setLoading(false)
      }
    }
    const fetchTotalPaymentThisYears = async () => {
      try {
        const response = await axiosConfig.get('/get-total-payment-this-years', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          },
          params: {
            school_id: getDataLocal.school_id // Send the school_id as a query parameter
          }
        })
        const total: any = response.data.amount + response.data.total_payment

        setTotalPaymentThisYears(total)
      } catch (error) {
        console.error('Error fetching total pembayaran:', error)

        // toast.error('Failed to fetch data. Please try again later.') // Use toast.error here
      } finally {
        setLoading(false)
      }
    }
    const fetchTotalLoginMmLogs = async () => {
      try {
        const response = await axiosConfig.get('/get-total-login-mmLogs', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          },
          params: {
            school_id: getDataLocal.school_id // Send the school_id as a query parameter
          }
        })

        setTotalLoginMmLogs(response.data)
      } catch (error) {
        console.error('Error fetching total pembayaran:', error)

        // toast.error('Failed to fetch data. Please try again later.') // Use toast.error here
      } finally {
        setLoading(false)
      }
    }

    fetchTotalPembayaranBulanan()
    fetchTotalPembayaranBebas()
    fetchTotalTunggakanBulanan()
    fetchTotalTunggakanBebas()
    fetchTotalPaymentThisDay()
    fetchTotalPaymentThisWeek()
    fetchTotalPaymentThisMonth()
    fetchTotalPaymentThisYears()
    fetchTotalLoginMmLogs()
  }, [router])

  // Function to format number to Rupiah without decimal
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
          {/* <Grid item xs={12} md={6}>
            <EcommerceWeeklySalesBg />
          </Grid> */}
          <Grid item xs={12} sm={6} md={3}>
            <CardStatisticsCharacter
              data={{
                stats: formatRupiah(totalPembayaranBulanan),
                title: 'Total Pembayaran Bulanan',
                chipColor: 'success',
                trendNumber: '',
                chipText: `${new Date().getFullYear()}`,
                src: '/images/all/gambar1.png'
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CardStatisticsCharacter
              data={{
                stats: formatRupiah(totalPembayaranBebas),
                trend: 'positive',
                title: 'Total Pembayaran Bebas',
                chipColor: 'success',
                trendNumber: '',
                chipText: `${new Date().getFullYear()}`,
                src: '/images/all/gambar2.png'
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CardStatisticsCharacter
              data={{
                stats: formatRupiah(totalTunggakanBulanan),
                trend: 'positive',
                title: 'Total Tunggakan Bulanan',
                chipColor: 'success',
                trendNumber: '',
                chipText: `${new Date().getFullYear()}`,
                src: '/images/all/gambar3.png'
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CardStatisticsCharacter
              data={{
                stats: formatRupiah(totalTunggakanBebas),
                trend: 'positive',
                title: 'Total Tunggakan Bebas',
                chipColor: 'success',
                trendNumber: '',
                chipText: `${new Date().getFullYear()}`,
                src: '/images/all/gambar4.png'
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CardStatisticsCharacter
              data={{
                stats: formatRupiah(totalPaymentThisDay),
                trend: 'positive',
                title: 'Total Pembayaran Hari Ini',
                chipColor: 'success',
                trendNumber: '',
                chipText: `${new Date().getFullYear()}`,
                src: '/images/all/gambar4.png'
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CardStatisticsCharacter
              data={{
                stats: formatRupiah(totalPaymentThisWeek),
                trend: 'positive',
                title: 'Total Pembayaran Minggu Ini',
                chipColor: 'success',
                trendNumber: '',
                chipText: `${new Date().getFullYear()}`,
                src: '/images/all/gambar4.png'
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CardStatisticsCharacter
              data={{
                stats: formatRupiah(totalPaymentThisMonth),
                trend: 'positive',
                title: 'Total Pembayaran Bulan Ini',
                chipColor: 'success',
                trendNumber: '',
                chipText: `${new Date().getFullYear()}`,
                src: '/images/all/gambar4.png'
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CardStatisticsCharacter
              data={{
                stats: formatRupiah(totalPaymentThisYears),
                trend: 'positive',
                title: 'Total Pembayaran Tahun Ini',
                chipColor: 'success',
                trendNumber: '',
                chipText: `${new Date().getFullYear()}`,
                src: '/images/all/gambar4.png'
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TotalVisit Data={totalLoginMmLogs} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            {role === 170 && <SaldoBySchool />}
          </Grid>
          <Grid item xs={12} md={6}>
            <ActivityTimeLine />
          </Grid>
        </Grid>
      </KeenSliderWrapper>
    </ApexChartWrapper>
  )
}

export default AdminDashboard
