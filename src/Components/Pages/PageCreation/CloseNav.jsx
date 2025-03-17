import React from 'react'
import { styled } from '@mui/material/styles'
import { Box } from '@mui/system'
import {  IconButton, Typography } from '@mui/material'
import { Icon } from '@iconify/react'

const Header = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  padding: '20px 10px',
  justifyContent: 'space-between'
}))

function CloseNav({ text, buttonRef }) {
  return (
    <Header>
      <Typography className='capitalize text-[#555] !font-bold' variant='h4'>
        {text}
      </Typography>
      <IconButton
        size='small'
        onClick={() => {
          buttonRef.current.click()
        }}
        color='error'
        variant='contained'
        sx={{
          p: '0.438rem',
          borderRadius: 50,
          backgroundColor: 'action.selected'
        }}
      >
        <Icon icon='tabler:x' fontSize='1.125rem' />
      </IconButton>
    </Header>
  )
}

export default CloseNav
