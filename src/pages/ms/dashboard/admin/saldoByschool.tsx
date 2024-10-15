// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'
import React, { useEffect, useState } from 'react' // Import useEffect and useState

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import axiosConfig from 'src/configs/axiosConfig'

const series = [{ data: [12, 12, 18, 18, 13, 13, 5, 5, 17, 17, 25, 25] }]

const SaldoBySchool = () => {
  const theme = useTheme()

  // State to hold school name
  const [schoolName, setSchoolName] = useState('Sekolah') // Default fallback value
  const [totalSaldoBySchool, setTotalPembayaranBulanan] = useState(null)
  const [totalTransaksiBySchool, setTotalTransaksiBySchool] = useState<any>(null)

  // useEffect to fetch data from local storage
  useEffect(() => {
    const data = localStorage.getItem('userData') as any
    const getDataLocal = JSON.parse(data)
    const storedToken = window.localStorage.getItem('token')
    const fetchGetSaldoBySchool = async () => {
      try {
        const response = await axiosConfig.get('/get-saldo-bySchool', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          },
          params: {
            school_id: getDataLocal.school_id // Send the school_id as a query parameter
          }
        })

        setTotalPembayaranBulanan(response.data.balance)
      } catch (error) {
        console.error('Error fetching total pembayaran:', error)

        // toast.error('Failed to fetch data. Please try again later.') // Use toast.error here
      }
    }
    const fetchGetTotalTransaski = async () => {
      try {
        const response = await axiosConfig.get('/get-transaski-affiliate-bySchool', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          },
          params: {
            school_id: getDataLocal.school_id // Send the school_id as a query parameter
          }
        })

        setTotalTransaksiBySchool(response.data.total)
      } catch (error) {
        console.error('Error fetching total pembayaran:', error)

        // toast.error('Failed to fetch data. Please try again later.') // Use toast.error here
      }
    }
    if (data) {
      const getDataLocal = JSON.parse(data)
      if (getDataLocal.school_name) {
        setSchoolName(getDataLocal.school_name)
      }
    }
    fetchGetTotalTransaski()
    fetchGetSaldoBySchool()
  }, []) // Empty dependency array to run once on mount
  // Function to format number to Rupiah without decimal
  const formatRupiah = (amount: any) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0, // No decimal places
      maximumFractionDigits: 0 // No decimal places
    }).format(amount)
  }
  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      dropShadow: {
        top: 14,
        blur: 4,
        left: 0,
        enabled: true,
        opacity: 0.12,
        color: theme.palette.primary.main
      }
    },
    tooltip: { enabled: false },
    grid: {
      xaxis: {
        lines: { show: false }
      },
      yaxis: {
        lines: { show: false }
      },
      padding: {
        top: -12,
        left: -2,
        right: 8,
        bottom: -10
      }
    },
    stroke: {
      width: 5,
      lineCap: 'round'
    },
    markers: { size: 0 },
    colors: [hexToRGBA(theme.palette.primary.main, 1)],
    xaxis: {
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: {
      min: 0,
      labels: { show: false }
    }
  }

  return (
    <Card>
      <CardContent sx={{ pb: '0 !important' }}>
        <Typography variant='h6' sx={{ mb: 2.5 }}>
          Saldo {schoolName}
        </Typography>
        <Typography variant='body2'>Total Saldo Aktif</Typography>
        <Typography variant='h6' color='error'>
          {formatRupiah(totalSaldoBySchool)}
        </Typography>

        <ReactApexcharts type='line' height={totalTransaksiBySchool + 15} options={options} series={series} />
      </CardContent>
    </Card>
  )
}

export default SaldoBySchool
