// ** React Imports
import * as cookie from 'cookie'
import { useEffect, useRef, useState } from 'react'
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
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { useCookies } from 'react-cookie'
import { useDispatch, useSelector } from 'react-redux'
import { useIntl } from 'react-intl'
import { axiosGet, axiosPost } from 'src/Components/axiosCall'
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input'
import country from 'src/_share/country.json'
import state from 'src/_share/state.json'
import city from 'src/_share/city.json'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import { Autocomplete, Chip, Grid } from '@mui/material'
import LoadingBtn from 'src/LoadingBtn/LoadingBtn'

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

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [_, setCookie] = useCookies(['sub'])
  const user = useSelector(rx => rx.auth.loading)
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const { locale, push } = useRouter()
  const { messages } = useIntl()
  const phoneRef = useRef(null)
  const [active, setActive] = useState(false)
  const [showpassword_confirmation, setShowpassword_confirmation] = useState(false)

  const isSlugValid = (value) => {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

    return slugRegex.test(value);
  };

  const getCountry = () => {
    return country
  }

  const getState = countryId => {
    return state.filter(el => el.country_id === countryId)
  }

  const getCity = stateId => {
    return city.filter(el => el.state_id === stateId)
  }

  const schema = yup.object().shape({
    first_name: yup.string().required(messages.required),
    last_name: yup.string().required(messages.required),
    email: yup.string().email(messages.ie).required(messages.required),
    phone: yup
      .string()
      .required(messages.required)
      .test('is-possible-phone-number', 'Please enter a valid phone number', value => {
        if (value) {
          return isPossiblePhoneNumber(value)
        }

        return true
      }),
    kind: yup.array().min(1, messages.required),
    state: yup.object().required(messages.required),
    country: yup.object().required(messages.required),
    merchant_name: yup.string().required(messages.required).test(
      'is-slug',
      locale==="ar" ?  "يجب أن يكون اسم المتجر سليمًا (يحتوي فقط على أحرف صغيرة، أرقام، وشرطات":'Merchant name must be a valid slug (only lowercase letters, numbers, and hyphens).',
      (value) => isSlugValid(value)
    ),
    password: yup
      .string()
      .required(messages.required)
      .min(6, messages.passwordNumberErro)
      .matches(/[a-z]/, messages.passwordNumbertypeErro)
      .matches(/[A-Z]/, messages.passwordNumbertype2Erro)
      .matches(/\d/, messages.passwordNumbertype3Erro)
      .matches(/[@$!%*?&]/, messages.passwordNumbertype4Erro),
    confirm_password: yup
      .string()
      .required(messages.required)
      .min(6, messages.passwordNumberErro)
      .oneOf([yup.ref('password'), null], messages.passwordNotMatch)
  })

  const defaultValues = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    kind: [],
    city: null,
    state: null,
    country: null,
    merchant_name: '',
    password: '',
    confirm_password: ''
  }

  const {
    control,
    setError,
    handleSubmit,
    getValues,
    setValue,
    trigger,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })
  const dispatch = useDispatch()

  const onSubmit = data => {
    const sendData = { ...data }
    sendData.username = sendData.merchant_name
    sendData.kind = sendData.kind.map(el => el.id)
    sendData.country = JSON.stringify(sendData.country)
    sendData.state = JSON.stringify(sendData.state)
    sendData.city = JSON.stringify(sendData.city)
    delete sendData.merchant_name
    delete sendData.confirm_password
    if (!loading) {
      setLoading(true)
      axiosPost('auth/register/', locale, sendData, false, true)
        .then(res => {
          if (res.status) {
            toast.success(locale === 'ar' ? 'تم التسجيل بنجاح' : 'Registration successful')
            push(`${locale}/login`)
          }else{
            console.log(res)
          }
        })
        .finally(_ => {
          setLoading(false)
        })
    }
  }
  const [kinds, setKinds] = useState([])

  useEffect(() => {
    axiosGet('auth/user-kind/', locale, false, {}, true).then(res => {
      if (res.status) {
        setKinds(res.results.results)
      }
    })
  }, [locale])

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
              {/* {svg.login} */}
              <video
                src={'./images/motion graphic of productivity_preview.mp4'}
                autoPlay
                loop
                muted
                className='w-[100%]'
              ></video>
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
                  <Typography variant='h3' className='flex gap-2 items-center' sx={{ mb: 1.5 }}>
                    {/* {messages.hello}. */}
                    <img src={'./images/solo-traveller-unscreen.gif'} alt='login' className='w-[70px] h-[70px]' />
                    {locale === 'ar' ? 'مرحبا بك في سولو ترافلر' : 'Welcome to Solo Traveller'}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{messages.signIn}</Typography>
                </Box>

                <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <Box>
                      <Controller
                        name='first_name'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <div className='mb-4'>
                            <CustomTextField
                              fullWidth
                              id='first_name'
                              autoFocus
                              label={locale === 'ar' ? 'الاسم الاول' : 'First Name'}
                              value={value}
                              onChange={onChange}
                              placeholder={locale === 'ar' ? 'الاسم الاول' : 'First Name'}
                              error={Boolean(errors.first_name)}
                            />
                            <Collapse
                              transition={`height 300ms cubic-bezier(.4, 0, .2, 1)`}
                              isOpen={Boolean(errors?.first_name)}
                            >
                              <h2 className='helperText'>{errors?.first_name?.message}</h2>
                            </Collapse>
                          </div>
                        )}
                      />
                    </Box>
                    <Box>
                      <Controller
                        name='last_name'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <div className='mb-4'>
                            <CustomTextField
                              fullWidth
                              id='last_name'
                              label={locale === 'ar' ? 'الاسم الاخير' : 'Last Name'}
                              value={value}
                              onChange={onChange}
                              placeholder={locale === 'ar' ? 'الاسم الاخير' : 'Last Name'}
                              error={Boolean(errors.last_name)}
                            />
                            <Collapse
                              transition={`height 300ms cubic-bezier(.4, 0, .2, 1)`}
                              isOpen={Boolean(errors?.last_name)}
                            >
                              <h2 className='helperText'>{errors?.last_name?.message}</h2>
                            </Collapse>
                          </div>
                        )}
                      />
                    </Box>
                  </div>
                  <div className='grid grid-cols-1 gap-4 mb-4 md:grid-cols-2'>
                    <Controller
                      name='kind'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <div>
                          <Controller
                            name='kind'
                            control={control}
                            render={({ field: { value } }) => (
                              <Autocomplete
                                multiple
                                filterSelectedOptions
                                options={kinds.map((ele, i) => {
                                  const data = { ...ele }
                                  data.index = i

                                  return data
                                })}
                                limitTags={2}
                                id='autocomplete-multiple-standard'
                                onChange={(_, valueBtn) => {
                                  setValue('kind', valueBtn)
                                  setTimeout(() => {
                                    trigger('kind')
                                  }, 0)
                                }}
                                getOptionLabel={option => {
                                  return option[`name_${locale}`]
                                    ? `${option.index}${
                                        locale === 'ar' ? option[`name_${locale}`] : option[`name_en`]
                                      } `
                                    : value
                                }}
                                value={[...value]}
                                renderOption={(props, option) => (
                                  <Box
                                    sx={{
                                      display: value.map(ele => ele.id).includes(option.id)
                                        ? 'none !important'
                                        : 'block'
                                    }}
                                    component='li'
                                    {...props}
                                  >
                                    <div className='w-full'>
                                      <div className='flex ~~ items-center ~~ justify-between ~~ gap-3 ~~ w-full'>
                                        <p className='relative text-xs capitalize text-end'>
                                          {locale === 'ar' ? option[`name_${locale}`] : option[`name_en`]}
                                        </p>
                                      </div>
                                    </div>
                                  </Box>
                                )}
                                renderInput={params => (
                                  <CustomTextField
                                    {...params}
                                    label={locale === 'ar' ? 'النوع' : 'Kind'}
                                    placeholder={locale === 'ar' ? 'النوع' : 'Kind' + ' ..'}
                                  />
                                )}
                                renderTags={(tagValue, getTagProps) =>
                                  tagValue.map((option, index) => (
                                    <Chip
                                      label={locale === 'ar' ? option[`name_${locale}`] : option[`name_en`]}
                                      {...getTagProps({ index })}
                                      key={index}
                                      style={{ marginInlineEnd: '5px', textTransform: 'capitalize' }}
                                      color='success'
                                    />
                                  ))
                                }
                              />
                            )}
                          />
                          <Collapse
                            transition={`height 300ms cubic-bezier(.4, 0, .2, 1)`}
                            isOpen={Boolean(errors?.kind)}
                          >
                            <h2 className='helperText'>{errors?.kind?.message}</h2>
                          </Collapse>
                        </div>
                      )}
                    />
                    <Box>
                      <Controller
                        name='merchant_name'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <div className=''>
                            <CustomTextField
                              fullWidth
                              id='merchant_name'
                              label={locale === 'ar' ? 'اسم المتجر' : 'Merchant Name'}
                              value={value}
                              onChange={onChange}
                              placeholder={locale === 'ar' ? 'اسم المتجر' : 'Merchant Name'}
                              error={Boolean(errors.merchant_name)}
                            />
                            <Collapse
                              transition={`height 300ms cubic-bezier(.4, 0, .2, 1)`}
                              isOpen={Boolean(errors?.merchant_name)}
                            >
                              <h2 className='helperText'>{errors?.merchant_name?.message}</h2>
                            </Collapse>
                          </div>
                        )}
                      />
                    </Box>
                  </div>

                  <Box sx={{ mb: 4 }}>
                    <Controller
                      name='email'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <div className='mb-4'>
                          <CustomTextField
                            fullWidth
                            id='email'
                            label={messages.email}
                            value={value}
                            onChange={onChange}
                            placeholder={messages.email}
                            error={Boolean(errors.email)}
                          />
                          <Collapse
                            transition={`height 300ms cubic-bezier(.4, 0, .2, 1)`}
                            isOpen={Boolean(errors?.email)}
                          >
                            <h2 className='helperText'>{errors?.email?.message}</h2>
                          </Collapse>
                        </div>
                      )}
                    />
                  </Box>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='country'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <div className='mb-4'>
                          <CustomAutocomplete
                            value={value}
                            options={getCountry()}
                            onChange={(e, Data) => {
                              const selectedCountry = getCountry().find(country => country.id === Data?.id)
                              if (selectedCountry) {
                                setValue('country', {
                                  ...selectedCountry
                                })
                              } else {
                                setValue('country', null)
                              }
                              setValue('state', null)
                              setValue('city', null)
                              trigger('country')
                              trigger('state')
                              trigger('city')
                            }}
                            id='autocomplete-controlled'
                            getOptionLabel={option => (locale === 'ar' ? option.name_ar : option.name || '')}
                            renderOption={(props, option) => (
                              <Box component='li' {...props}>
                                {locale === 'ar' ? option.name_ar : option.name}
                              </Box>
                            )}
                            renderInput={(params, option) => {
                              return (
                                <CustomTextField
                                  error={Boolean(errors.country)}
                                  {...params}
                                  label={locale === 'ar' ? 'الدولة' : 'Country'}
                                  placeholder={locale === 'ar' ? 'اختر الدولة' : 'Select a country'}
                                />
                              )
                            }}
                          />
                          <Collapse
                            transition={`height 300ms cubic-bezier(.4, 0, .2, 1)`}
                            isOpen={Boolean(errors?.country)}
                          >
                            <h2 className='helperText'>{errors?.country?.message}</h2>
                          </Collapse>
                        </div>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='state'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <div className='mb-4'>
                          <CustomAutocomplete
                            value={value}
                            options={getState(getValues()?.country?.id)}
                            onChange={(e, Data) => {
                              const selectedState = getState(getValues()?.country?.id).find(
                                state => state.id === Data?.id
                              )
                              if (selectedState) {
                                setValue('state', { ...selectedState })
                              } else {
                                setValue('state', null)
                              }
                              setValue('city', null)
                              trigger('city')
                              trigger('state')
                            }}
                            id='autocomplete-controlled'
                            getOptionLabel={option => (locale === 'ar' ? option.name_ar : option.name || '')}
                            renderOption={(props, option) => (
                              <Box component='li' {...props}>
                                {locale === 'ar' ? option.name_ar : option.name}
                              </Box>
                            )}
                            renderInput={(params, option) => {
                              return (
                                <CustomTextField
                                  error={Boolean(errors.state)}
                                  {...params}
                                  label={locale === 'ar' ? 'المنطقة' : 'State'}
                                  placeholder={locale === 'ar' ? 'اختر المنطقة' : 'Select a state'}
                                />
                              )
                            }}
                          />
                          <Collapse
                            transition={`height 300ms cubic-bezier(.4, 0, .2, 1)`}
                            isOpen={Boolean(errors?.state)}
                          >
                            <h2 className='helperText'>{errors?.state?.message}</h2>
                          </Collapse>
                        </div>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='city'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <div className='mb-4'>
                          <CustomAutocomplete
                            value={value}
                            options={getCity(getValues()?.state?.id)}
                            onChange={(e, Data) => {
                              const selectedCity = getCity(getValues()?.state?.id).find(City => City.id === Data?.id)
                              if (selectedCity) {
                                setValue('city', { ...selectedCity })
                              } else {
                                setValue('city', null)
                              }
                              trigger('city')
                            }}
                            id='autocomplete-controlled'
                            getOptionLabel={option => (locale === 'ar' ? option.name_ar : option.name || '')}
                            renderOption={(props, option) => (
                              <Box component='li' {...props}>
                                {locale === 'ar' ? option.name_ar : option.name}
                              </Box>
                            )}
                            renderInput={(params, option) => {
                              return (
                                <CustomTextField
                                  error={Boolean(errors.city)}
                                  {...params}
                                  label={locale === 'ar' ? 'المدينة' : 'City'}
                                  placeholder={locale === 'ar' ? 'اختر المدينة' : 'Select a city'}
                                />
                              )
                            }}
                          />
                          <Collapse
                            transition={`height 300ms cubic-bezier(.4, 0, .2, 1)`}
                            isOpen={Boolean(errors?.city)}
                          >
                            <h2 className='helperText'>{errors?.city?.message}</h2>
                          </Collapse>
                        </div>
                      )}
                    />
                    <Box>
                      <Controller
                        name='phone'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <div
                            onFocus={e => {
                              phoneRef.current.focus()
                              setActive(true)
                            }}
                            onBlur={() => {
                              setActive(false)
                            }}
                            className=''
                          >
                            <label className='w-full PhoneLabel'>{messages.phoneNumber}</label>
                            <div style={{ display: 'flex' }} className='mb-4'>
                              <PhoneInput
                                style={{
                                  border: value === undefined && '1px solid #00cfe8'
                                }}
                                ref={phoneRef}
                                defaultCountry={getValues()?.country?.sortname ?? 'EG'}
                                className={`phoneNumber ${Boolean(errors?.phone) ? 'error' : ''} ${
                                  active ? 'main' : ''
                                } ${value === undefined ? 'error' : ''} `}
                                placeholder='123-456-7890'
                                value={value}
                                onChange={onChange}
                              />
                            </div>
                            <Collapse
                              transition={`height 300ms cubic-bezier(.4, 0, .2, 1)`}
                              isOpen={Boolean(errors?.phone)}
                            >
                              <h2 className='helperText homeHelper'>{errors?.phone?.message}</h2>
                            </Collapse>
                          </div>
                        )}
                      />
                    </Box>
                  </Grid>
                  <div className='grid grid-cols-1 gap-4 mb-5'>
                    <Box>
                      <Controller
                        name='password'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <div>
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
                    <Controller
                      name='confirm_password'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <div className=''>
                          <CustomTextField
                            className='homeInput'
                            fullWidth
                            value={value}
                            label={messages.passConf}
                            onChange={onChange}
                            placeholder='123456'
                            id='auth-login-v2-password_confirmation'
                            error={Boolean(errors.password_confirmation)}
                            type={showpassword_confirmation ? 'text' : 'password'}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position='end'>
                                  <IconButton
                                    edge='end'
                                    onMouseDown={e => e.preventDefault()}
                                    onClick={() => setShowpassword_confirmation(!showpassword_confirmation)}
                                  >
                                    <Icon
                                      fontSize='1.25rem'
                                      icon={showpassword_confirmation ? 'tabler:eye' : 'tabler:eye-off'}
                                    />
                                  </IconButton>
                                </InputAdornment>
                              )
                            }}
                          />
                          <Collapse
                            transition={`height 300ms cubic-bezier(.4, 0, .2, 1)`}
                            isOpen={Boolean(errors?.confirm_password)}
                          >
                            <h2 className='helperText homeHelper'>{errors?.confirm_password?.message}</h2>
                          </Collapse>
                        </div>
                      )}
                    />
                  </div>
                  <Box
                    sx={{
                      mb: 1.75,
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'flex-end'
                    }}
                  ></Box>
                  <LoadingBtn
                    loading={loading}
                    fullWidth
                    type='submit'
                    variant='contained'
                    className='flex gap-1 group'
                    sx={{ mb: 4 }}
                  >
                    {!loading && (
                      <div className='w-[25px] h-[25px] '>
                        <img
                          src={'./images/photo-unscreen.gif'}
                          alt='login'
                          className='w-[25px] h-[25px] scale-150 hidden group-hover:block'
                        />
                        <img
                          src={'./images/photo (1).png'}
                          alt='login'
                          className='block w-full h-full group-hover:hidden'
                        />
                      </div>
                    )}
                    {messages.register}
                  </LoadingBtn>
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
