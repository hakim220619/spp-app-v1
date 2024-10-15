import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'
import axiosConfig from 'src/configs/axiosConfig'
import { Pagination } from '@mui/material'

// Styled Timeline component
const Timeline = styled(MuiTimeline)<TimelineProps>({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    }
  }
})

const ITEMS_PER_PAGE = 4 // Constant for pagination limit

const EcommerceActivityTimeline = () => {
  const [activities, setActivities] = useState([])
  const [page, setPage] = useState(1) // State for pagination
  const data = localStorage.getItem('userData') as string
  const getDataLocal = JSON.parse(data)
  const schoolId = getDataLocal.school_id

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token') // Get token from localStorage
        const response = await axiosConfig.get(`/getActivityBySchoolId?school_id=${schoolId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setActivities(response.data) // Assuming the data is an array of activities
      } catch (error) {
        console.error('Error fetching activities:', error)
      }
    }

    fetchData()
  }, [schoolId])

  // Function to format the date
  const formatDate = (dateString: string) => {
    const createdAt = new Date(dateString)
    const formattedDate = createdAt.toLocaleString('sv-SE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false // Use 24-hour format
    })

    return formattedDate
  }

  // Function to handle page changes
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  // Calculate the paginated activities
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const paginatedActivities = activities.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <Card>
      <CardHeader
        title='Activity Timeline'
        action={
          <OptionsMenu
            options={['Last 28 Days', 'Last Month', 'Last Year']}
            iconButtonProps={{ size: 'small', className: 'card-more-options' }}
          />
        }
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(2.5)} !important` }}>
        <Timeline sx={{ my: 0, py: 0 }}>
          {paginatedActivities.map((activity: any, index) => (
            <TimelineItem key={startIndex + index}>
              <TimelineSeparator>
                <TimelineDot
                  color={
                    activity.action === 'Insert' || activity.action === 'Create'
                      ? 'success'
                      : activity.action === 'Update'
                      ? 'info'
                      : activity.action === 'Delete'
                      ? 'error'
                      : 'primary'
                  }
                />
                {index !== paginatedActivities.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent sx={{ mt: 0, mb: theme => `${theme.spacing(3)} !important` }}>
                <Box
                  sx={{
                    mb: 3,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography sx={{ mr: 2, fontWeight: 600 }}>{activity.action}</Typography>
                  <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                    {formatDate(activity.created_at)}
                  </Typography>
                </Box>
                <Typography variant='body2' sx={{ mb: 2 }}>
                  {activity.detail}
                </Typography>
                {activity.file && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img width={24} height={24} alt={activity.fileName} src='/images/icons/file-icons/pdf.png' />
                    <Typography variant='subtitle2' sx={{ ml: 2, fontWeight: 600 }}>
                      {activity.fileName}
                    </Typography>
                  </Box>
                )}
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>

        {/* Pagination Component */}
        <Pagination
          count={Math.ceil(activities.length / ITEMS_PER_PAGE)}
          page={page}
          onChange={handlePageChange}
          sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
        />
      </CardContent>
    </Card>
  )
}

export default EcommerceActivityTimeline
