/* eslint-disable react-hooks/exhaustive-deps */
import { useTheme } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useSettings } from './useSettings'
import { useDispatch } from 'react-redux'
import { useIntl } from 'react-intl'
import { SET_ACTIVE_LOADING } from 'src/store/apps/LoadingMainSlice/LoadingMainSlice'
import { REMOVE_USER, SET_ACTIVE_USER } from 'src/store/apps/authSlice/authSlice'

function useInitialization() {
  const theme = useTheme()
  const { settings, saveSettings } = useSettings()
  const [cookies, _, removeCookie] = useCookies(['sub'])
  const dispatch = useDispatch()
  const [login, setLogin] = useState(true)
  const { locale } = useIntl()

  useEffect(() => {
    if (cookies.sub) {
      const userData = {
        image_url: 'https://via.placeholder.com/150',
        first_name: 'John',
        last_name: 'Doe'
      }
      dispatch(SET_ACTIVE_USER(userData))
      setTimeout(() => {
        setLogin(false)
        dispatch(SET_ACTIVE_LOADING())
      }, 2000)
    } else {
      dispatch(REMOVE_USER())

      const time = setTimeout(() => {
        setLogin(false)
        dispatch(SET_ACTIVE_LOADING())
      }, 2000)

      return () => clearTimeout(time)
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('rtl', locale === 'ar')
  }, [])

  useEffect(() => {
    const handleThemeChange = () => {
      document.body.classList.toggle('dark-mode', theme.palette.mode === 'dark')
    }

    handleThemeChange()

    return () => {
      handleThemeChange()
    }
  }, [theme.palette.mode])
  useEffect(() => {
    if (cookies.mode) {
      const time = setTimeout(() => {
        saveSettings({ ...settings, mode: cookies.mode })
      }, 500)

      return () => clearTimeout(time)
    }
  }, [cookies.mode])

  useEffect(() => {
    // localStorage.removeItem('settings')
    // removeCookie('sub', { path: '/' })
    // dispatch(REMOVE_USER())
    // setLogin(false)
  }, [])

  return { login }
}

export default useInitialization
