/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { usePathname } from 'next/navigation'
import { useTheme } from '@mui/material/styles'
import axios from 'axios'
import { toast } from 'react-toastify'
import { REMOVE_USER, SET_ACTIVE_USER } from 'src/store/apps/authSlice/authSlice'
import { axiosGet, axiosPost } from './axiosCall'
import { useSettings } from 'src/@core/hooks/useSettings'
import { SET_ACTIVE_LOADING } from 'src/store/apps/LoadingMainSlice/LoadingMainSlice'
import LoadingMain from './LoadingMain'
import Cookies from 'js-cookie'
import { decryptData } from './encryption'

function HomeApp({ children }) {
  const [login, setLogin] = useState(true)
  const dispatch = useDispatch()
  const router = useRouter()
  const { locale } = useRouter()
  const patch = usePathname()
  const theme = useTheme()
  const { settings, saveSettings } = useSettings()
  const [cookies, _, removeCookie] = useCookies(['sub'])

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
    // axios.interceptors.response.use(
    //   function (response) {
    //     console.log(response.data)
    //     handleErrorResponse(response.data, response.status)

    //     return response
    //   },
    //   function (error) {
    //     console.log(response.data)

    //     handleErrorResponse(error.response?.data, error.response.status)

    //     return Promise.reject(error)
    //   }
    // )
  }, [])

  useEffect(() => {
    if (cookies.sub) {
      // Promise.all([axiosGet('auth/profile/', locale)])
      //   .then(([resInfo]) => {
      //     if (resInfo.status) {
      //       dispatch(SET_ACTIVE_USER({ ...resInfo.results }))
      //     } else {
      //       throw new Error('')
      //     }
      //   })
      //   .catch(err => {
      //     removeCookie('sub', { path: '/' })
      //     dispatch(REMOVE_USER())
      //   })
      //   .finally(_ => {
      //     setTimeout(() => {
      //       setLogin(false)
      //       dispatch(SET_ACTIVE_LOADING())
      //     }, 2000)
      //   })

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
  }, [locale])

  const handleErrorResponse = (data, status) => {
    if (!data?.status) {
      if (typeof data.message === 'string') {
        if (status === 401) {
          removeCookie('sub', { path: '/' })
          dispatch(REMOVE_USER())
        } else {
          toast.error(data.message)
        }

        return
      }
      console.log(data.message)

      for (const key in data.message) {
        const messages = data.message[key]
        if (Array.isArray(messages)) {
          messages.forEach(message => toast.error(message))
        } else {
          toast.error(messages)
        }
      }
    }
  }

  useEffect(() => {
    localStorage.clear()
  }, [])

  const [loading, setLoading] = useState(false)

  const handleLogout = () => {
    setLoading(true)
    const authToken = Cookies.get('sub')
    axiosPost('auth/logout/', locale, { token: decryptData(authToken).token })
      .then(res => {
        if (res.status) {
          removeCookie('sub', { path: '/' })
          dispatch(REMOVE_USER())
        }
      })
      .finally(_ => {
        setLoading(false)
      })
  }
  const user = useSelector(rx => rx.auth.loading)

  useEffect(() => {
    if (patch && '/' + patch.split('/')[1] === '/setting' && user !== 'loading' && user === 'no') {
      router.push(`/${locale}/login`)
    }
  }, [locale, router, user, patch])
  if (patch && '/' + patch.split('/')[1] === '/setting' && user !== 'loading' && user === 'no') {
    return <LoadingMain login={true} />
  }

  return (
    <>
      <LoadingMain login={login} />

      {patch ? <>{'/' + patch.split('/')[1] === '/setting' && login ? null : children}</> : null}
    </>
  )
}

export default HomeApp
