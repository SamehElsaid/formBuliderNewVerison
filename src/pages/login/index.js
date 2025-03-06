// ** React Imports
import * as cookie from 'cookie'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Spinner from 'src/@core/components/spinner'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import Collapse from '@kunukn/react-collapse'
import { LoadingButton } from '@mui/lab'
import { svg } from 'src/Components/svg'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { useCookies } from 'react-cookie'
import { useDispatch, useSelector } from 'react-redux'
import { SET_ACTIVE_USER } from 'src/store/apps/authSlice/authSlice'
import { encryptData } from 'src/Components/encryption'
import { useIntl } from 'react-intl'
import { axiosPost } from 'src/Components/axiosCall'

const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750
  }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [_, setCookie] = useCookies(['sub'])
  const user = useSelector(rx => rx.auth.loading)
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const { locale, push } = useRouter()
  const { messages } = useIntl()

  const schema = yup.object().shape({
    login: yup.string().email(messages.ie).required(messages.required),
    password: yup.string().min(6, messages.least6).required(messages.required)
  })

  const defaultValues = {
    login: '',
    password: ''
  }

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })
  const dispatch = useDispatch()
  const [stopToMain, setStopToMain] = useState(false)

  const onSubmit = data => {
    // const sendData = { ...data }
    // sendData.email = sendData.login
    // delete sendData.login
    // if (!loading) {
    //   setLoading(true)

    //   axiosPost('user/login/', locale, sendData, false, true)
    //     .then(res => {
    //       if (res.status) {

    //         toast.success(`Welcome ${userData?.first_name}`)
    //       }
    //     })
    //     .finally(_ => {
    //       setLoading(false)
    //     })
    // }
    const expirationDate = new Date()
    expirationDate.setFullYear(expirationDate.getFullYear() + 1)

    const userData = {
      image_url: 'https://via.placeholder.com/150',
      first_name: 'John',
      last_name: 'Doe'
    }
    dispatch(SET_ACTIVE_USER(userData))
    setCookie('sub', encryptData(userData), {
      expires: expirationDate,
      path: '/'
    })
    setTimeout(() => {
      push(`${locale}/setting/setting`)
    }, 1000)
  }

  return (
    <>
      {user !== 'loading' && user !== 'yes' ? (
        <Box
          className='flex || items-center || rounded-md || min-h-[80vh]'
          style={{ background: theme.palette.background.paper, boxShadow: theme.shadows[9] }}
          sx={{ backgroundColor: 'background.paper' }}
        >
          {!hidden ? (
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                position: 'relative',
                alignItems: 'center',
                borderRadius: '20px',
                px: 4,
                py: 4,
                justifyContent: 'center',
                backgroundColor: 'customColors.bodyBg',
                margin: theme => theme.spacing(8, 0, 8, 8)
              }}
            >
              <span className='w-[70%] h-full' dangerouslySetInnerHTML={{ __html: svg.login }} />
              <FooterIllustrationsV2 />
            </Box>
          ) : null}
          <RightWrapper>
            <Box
              sx={{
                p: [6, 12],
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Box sx={{ width: '100%', maxWidth: 400 }}>
                <div className='w-[150px]'></div>

                <Box sx={{ my: 6 }}>
                  <Typography variant='h3' sx={{ mb: 1.5 }}>
                    {messages.hello}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{messages.signIn}</Typography>
                </Box>

                <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                  <Box sx={{ mb: 4 }}>
                    <Controller
                      name='login'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <div className='mb-4'>
                          <CustomTextField
                            fullWidth
                            autoFocus
                            label={messages.email}
                            value={value}
                            onChange={onChange}
                            placeholder={messages.email}
                            error={Boolean(errors.login)}
                          />
                          <Collapse
                            transition={`height 300ms cubic-bezier(.4, 0, .2, 1)`}
                            isOpen={Boolean(errors?.login)}
                          >
                            <h2 className='helperText'>{errors?.login?.message}</h2>
                          </Collapse>
                        </div>
                      )}
                    />
                  </Box>
                  <Box sx={{ mb: 1.5 }}>
                    <Controller
                      name='password'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <div className='mb-4'>
                          <CustomTextField
                            fullWidth
                            value={value}
                            label={messages.pass}
                            onChange={onChange}
                            placeholder='123456'
                            id='auth-login-v2-password'
                            error={Boolean(errors.password)}
                            type={showPassword ? 'text' : 'password'}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position='end'>
                                  <IconButton
                                    edge='end'
                                    onMouseDown={e => e.preventDefault()}
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                                  </IconButton>
                                </InputAdornment>
                              )
                            }}
                          />
                          <Collapse
                            transition={`height 300ms cubic-bezier(.4, 0, .2, 1)`}
                            isOpen={Boolean(errors?.password)}
                          >
                            <h2 className='helperText'>{errors?.password?.message}</h2>
                          </Collapse>
                        </div>
                      )}
                    />
                  </Box>
                  <Box
                    sx={{
                      mb: 1.75,
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'flex-end'
                    }}
                  ></Box>
                  <LoadingButton loading={loading} fullWidth type='submit' variant='contained' sx={{ mb: 4 }}>
                    {messages.login}
                  </LoadingButton>
                </form>
              </Box>
            </Box>
          </RightWrapper>
        </Box>
      ) : (
        <Spinner />
      )}
    </>
  )
}

export default LoginPage

export async function getServerSideProps(context) {
  const reqCookies = context.req.headers.cookie
  const cookies = reqCookies ? cookie.parse(reqCookies) : {}
  if (cookies.sub) {
    return {
      redirect: {
        destination: `/${context.locale}/setting/setting`,
        permanent: false
      }
    }
  } else {
    return {
      props: {
        int: []
      }
    }
  }
}
