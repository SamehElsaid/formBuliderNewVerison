// ** React Imports
import { useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { axiosPatch } from 'src/Components/axiosCall'

const MenuItemWrapper = ({ children, option, reload, setreload, row }) => {
  const { locale } = useRouter()
  const [loading, setLoading] = useState(false)
  if (option.href) {
    return (
      <Box
        component={Link}
        href={option.href}
        {...option.linkProps}
        sx={{
          px: 4,
          py: 1.5,
          width: '100%',
          display: 'flex',
          color: 'inherit',
          alignItems: 'center',
          textDecoration: 'none'
        }}
      >
        {children}
      </Box>
    )
  } else {
    return (
      <div
        onClick={() => {
          setLoading(true)
          if (loading) {
            if (option.text === 'Accept') {
              axiosPatch(`${process.env.API_URL}/forms/permit_super/${row.id}/`, locale, {
                engineer_status: 'accepted'
              })
                .then(res => {
                  if (res.status) {
                    toast.success('Update has been succeed')
                    setreload(reload + 1)
                  }
                })
                .finally(_ => {
                  setLoading(false)
                })
            }

            // if (option.text === 'Accept') {
            //   axiosPatch(`${process.env.API_URL}/forms/permit_super/${row.id}/`, locale, {
            //     engineer_status: 'accepted'
            //   })
            //     .then(res => {
            //       if (res.status) {
            //         toast.success('Update has been succeed')
            //         setreload(reload + 1)
            //       }
            //     })
            //     .finally(_ => {
            //       setLoading(false)
            //     })
            // }
          }
        }}
        className='flex'
      >
        {children}
      </div>
    )
  }
}

const OptionsMenu = props => {
  // ** Props
  const { icon, options, menuProps, iconProps, leftAlignMenu, iconButtonProps, reload, setreload, row } = props

  // ** State
  const [anchorEl, setAnchorEl] = useState(null)

  // ** Hook & Var
  const { settings } = useSettings()
  const { direction } = settings

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <IconButton aria-haspopup='true' onClick={handleClick} {...iconButtonProps}>
        {icon ? icon : <Icon icon='tabler:dots-vertical' {...iconProps} />}
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        onClose={handleClose}
        open={Boolean(anchorEl)}
        {...(!leftAlignMenu && {
          anchorOrigin: { vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' },
          transformOrigin: { vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }
        })}
        {...menuProps}
      >
        {options.map((option, index) => {
          if (typeof option === 'string') {
            return (
              <MenuItem key={index} onClick={handleClose}>
                {option}
              </MenuItem>
            )
          } else if ('divider' in option) {
            return option.divider && <Divider key={index} {...option.dividerProps} />
          } else {
            return (
              <MenuItem
                key={index}
                {...option.menuItemProps}
                {...(option.href && { sx: { p: 0 } })}
                onClick={e => {
                  handleClose()
                  option.menuItemProps && option.menuItemProps.onClick ? option.menuItemProps.onClick(e) : null
                }}
              >
                <MenuItemWrapper reload={reload} setreload={setreload} row={row} option={option}>
                  {option.icon ? option.icon : null}
                  {option.text}
                </MenuItemWrapper>
              </MenuItem>
            )
          }
        })}
      </Menu>
    </>
  )
}

export default OptionsMenu
