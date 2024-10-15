import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Badge from '@mui/material/Badge'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import clsx from 'clsx'
import { useKeenSlider } from 'keen-slider/react'
import Icon from 'src/@core/components/icon'
import CustomAvatar from 'src/@core/components/mui/avatar'
import axiosConfig from 'src/configs/axiosConfig'

interface SwiperData {
  header: string
  onetitle: string
  img: string
  title: string
  details: any
}

const Slides = ({ data }: { data: SwiperData[] }) => {
  return (
    <>
      {data.map((slide: SwiperData, index: number) => {
        const parsedDetails = (() => {
          try {
            return JSON.parse(slide.details)
          } catch {
            return {} // Fallback if JSON.parse fails
          }
        })()

        return (
          <Box key={slide.header + index} className='keen-slider__slide'>
            <Typography variant='h6' sx={{ color: 'common.white' }}>
              {slide.header}
            </Typography>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', '& svg': { color: 'success.main' } }}>
              <Typography variant='caption' sx={{ mr: 1.5, color: 'common.white' }}>
                {slide.onetitle}
              </Typography>
              <Typography variant='subtitle2' sx={{ color: 'success.main' }}>
                +62%
              </Typography>
              <Icon icon='mdi:chevron-up' fontSize={20} />
            </Box>

            <Grid container>
              <Grid item xs={12} sm={6} lg={12} sx={{ order: [2, 1] }}>
                <Typography sx={{ mb: 4.5, color: 'common.white' }}>{slide.title}</Typography>

                <Grid container spacing={3} sx={{ flexWrap: 'wrap', overflow: 'hidden' }}>
                  {Object.entries(parsedDetails).map(([key, value], index: number) => (
                    <Grid item key={index} xs={12} sm={6} md={4} lg={5} sx={{ maxWidth: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                        <CustomAvatar
                          color='primary'
                          variant='rounded'
                          sx={{
                            mr: 2,
                            width: 40,
                            height: 30,
                            fontSize: '0.875rem',
                            color: 'common.white',
                            backgroundColor: 'primary.dark'
                          }}
                        >
                          {value as any}
                        </CustomAvatar>
                        <Typography
                          variant='caption'
                          sx={{ color: 'common.white', wordWrap: 'break-word', flexShrink: 2 }}
                        >
                          {key}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                lg={4}
                sx={{
                  order: [1, 2],
                  textAlign: 'center',
                  '& img': {
                    top: 0,
                    right: 0,
                    height: '200px !important',
                    maxWidth: '100% !important',
                    position: ['static', 'absolute'],
                    objectFit: 'contain'
                  }
                }}
              >
                <img src={slide.img} alt={slide.title} />
              </Grid>
            </Grid>
          </Box>
        )
      })}
    </>
  )
}

const EcommerceWeeklySalesBg = () => {
  const [loaded, setLoaded] = useState<boolean>(false)
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const [data, setData] = useState<SwiperData[]>([])
  const [sliderInitialized, setSliderInitialized] = useState<boolean>(false)

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        const userDataStr = localStorage.getItem('userData')

        if (token && userDataStr) {
          const userData = JSON.parse(userDataStr)
          const school_id = userData?.school_id

          if (school_id) {
            const response = await axiosConfig.get('/getDetailClassMajorUsers', {
              headers: {
                Authorization: `Bearer ${token}`
              },
              params: {
                school_id
              }
            })

            if (response.data) {
              setData(response.data)
            }
          } else {
            console.error('school_id is missing in userData')
          }
        } else {
          console.error('Missing token or userData in localStorage')
        }
      } catch (error) {
        console.error('Error fetching the data', error)
      }
    }

    fetchData()
  }, [])

  const theme = useTheme()

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      initial: 0,
      rtl: theme.direction === 'rtl',
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel)
      },
      created() {
        setLoaded(true)
        setSliderInitialized(true) // Ensure slider is initialized
      }
    },
    [
      slider => {
        let mouseOver = false
        let timeout: number | ReturnType<typeof setTimeout>

        const clearNextTimeout = () => {
          if (timeout) clearTimeout(timeout)
        }

        const nextTimeout = () => {
          if (timeout) clearTimeout(timeout)

          if (mouseOver) return

          if (slider && slider.track && slider.track.details) {
            timeout = setTimeout(() => {
              slider.next()
            }, 4000)
          }
        }

        slider.on('created', () => {
          slider.container.addEventListener('mouseover', () => {
            mouseOver = true
            clearNextTimeout()
          })
          slider.container.addEventListener('mouseout', () => {
            mouseOver = false
            nextTimeout()
          })
          nextTimeout()
        })

        slider.on('dragStarted', clearNextTimeout)
        slider.on('animationEnded', nextTimeout)
        slider.on('updated', nextTimeout)
      }
    ]
  )

  return (
    <Card sx={{ position: 'relative', backgroundColor: 'primary.main' }}>
      <CardContent>
        {sliderInitialized && (
          <Box className='swiper-dots' sx={{ top: 7, right: 13, position: 'absolute' }}>
            {[...Array(data.length).keys()].map((_, idx) => (
              <Badge
                key={idx}
                variant='dot'
                component='div'
                className={clsx({ active: currentSlide === idx })}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                sx={{
                  mr: theme.spacing(2.5),
                  '&.active': {
                    '& .MuiBadge-dot': {
                      backgroundColor: theme.palette.common.white
                    }
                  },
                  '& .MuiBadge-dot': {
                    height: '6px',
                    width: '6px',
                    minWidth: '6px'
                  }
                }}
              />
            ))}
          </Box>
        )}
        <Box ref={sliderRef} className='keen-slider'>
          {loaded && sliderInitialized && <Slides data={data} />}
        </Box>
      </CardContent>
    </Card>
  )
}

export default EcommerceWeeklySalesBg
