// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Types Imports
import { CardStatsCharacterProps } from 'src/@core/components/card-statistics/types'

interface Props {
  data: CardStatsCharacterProps
}

const CardStatsCharacter = ({ data }: Props) => {
  // ** Vars
  const { title, chipText, src, stats, trendNumber, trend = 'positive', chipColor = 'primary' } = data

  return (
    <Card sx={{ overflow: 'visible', position: 'relative' }}>
      <CardContent sx={{ pb: '0 !important' }}>
        <Grid container spacing={2} overflow={'auto'}>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ mb: 1.5, fontWeight: 500, whiteSpace: 'nowrap' }}>{title}</Typography>
            <CustomChip
              skin='light'
              size='small'
              label={chipText}
              color={chipColor}
              sx={{ mb: 5.5, height: 20, fontWeight: 500, fontSize: '0.75rem' }}
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant='h5' sx={{ mr: 1.5 }}>
                {stats}
              </Typography>
              <Typography variant='caption' sx={{ color: trend === 'negative' ? 'error.main' : 'success.main' }}>
                {trendNumber}
              </Typography>
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: { xs: 'center', sm: 'flex-end' },
              marginTop: { xs: '10px', sm: 0 },
              paddingBottom: '20px' // Adjusting the space below the image
            }}
          >
            <img src={src} alt={title} style={{ maxWidth: '100%', height: 'auto', marginTop: '10px' }} />{' '}
            {/* Adjusted margin */}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default CardStatsCharacter
