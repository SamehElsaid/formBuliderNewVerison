// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CustomChip from 'src/@core/components/mui/chip'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { Box, Chip, LinearProgress } from '@mui/material'
import AssignmentIcon from '@mui/icons-material/Assignment'

const CardAppleWatch = () => {
  const progress = 75
  const tasksRemaining = 6

  return (
    <Card>
      <CardContent sx={{ p: 5 }}>
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={1}>
          <Typography variant='h5' className='!font-bold'>Customer Onboarding</Typography>
          <CustomChip  label='Active' skin='light' color='success' size='small' />
        </Box>

        <Box display='flex' justifyContent='space-between' alignItems='center' className='!mt-4'>
          <Typography variant='body2' className='!font-bold'>Progress</Typography>
          <Typography variant='body2' color='primary' className='!font-bold'>
            {progress}%
          </Typography>
        </Box>

        <LinearProgress variant='determinate' value={progress} sx={{ height: 8, borderRadius: 4, my: 1.5 }} />

        <Box display='flex' alignItems='center'  className='!mt-4'>
          <AssignmentIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
          <Typography variant='body2' color='text.secondary' className='!font-bold'>
            {tasksRemaining} tasks remaining
          </Typography>
        </Box>
      </CardContent>
      <Button variant='contained' sx={{ py: 2.5, width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
        View Details
      </Button>
    </Card>
  )
}

export default CardAppleWatch
