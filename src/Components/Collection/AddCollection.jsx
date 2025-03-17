import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CustomTextField from 'src/@core/components/mui/text-field'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import { useIntl } from 'react-intl'
import { InputAdornment } from '@mui/material'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { LoadingButton } from '@mui/lab'
import { UrlTranEn, UrlTranAr, axiosPost, axiosPut } from '../axiosCall'

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const AddCollection = props => {
  // ** Props
  const { open, toggle, setRefresh } = props
  const { messages, locale } = useIntl()

  const schema = yup.object().shape({
    name_ar: yup.string().required(messages['required']),
    name_en: yup.string().required(messages['required']),
    description_ar: yup.string(),
    description_en: yup.string(),
    key: yup.string().required(messages['required'])
  })

  const defaultValues = {
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    key: ''
  }

  const {
    reset,
    control,
    setValue,
    setError,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })
  const [loading, setLoading] = useState(false)

  const onSubmit = data => {
    setLoading(true)

    const sendData = {
      nameAr: data.name_ar,
      nameEn: data.name_en,
      descriptionAr: data.description_ar,
      descriptionEn: data.description_en,
      key: data.key.toLowerCase().trim(),
      options: {
        createdAt: true,
        createdBy: true,
        updatedAt: true,
        updatedBy: true
      }
    }

    if (typeof open !== 'boolean') {
      if (
        open.nameAr === sendData.nameAr &&
        open.nameEn === sendData.nameEn &&
        open.descriptionAr === sendData.descriptionAr &&
        open.descriptionEn === sendData.descriptionEn
      ) {
        toast.info(locale === 'ar' ? 'لا يوجد تغييرات' : 'No changes')
      }
      if (open.nameAr === sendData.nameAr) {
        delete sendData.nameAr
      }
      if (open.nameEn === sendData.nameEn) {
        delete sendData.nameEn
      }
      if (open.descriptionAr === sendData.descriptionAr) {
        delete sendData.descriptionAr
      }
      if (open.descriptionEn === sendData.descriptionEn) {
        delete sendData.descriptionEn
      }

      axiosPut('collections/add', locale, sendData)
        .then(res => {
          if (res.status) {
            toast.success(locale === 'ar' ? 'تم إضافة نموذج البيانات بنجاح' : 'Data Model added successfully')
            handleClose()
            setRefresh(prev => prev + 1)
          }
        })
        .catch(err => {
          toast.error(locale === 'ar' ? 'حدث خطأ' : 'An error occurred')
        })
        .finally(_ => {
          setLoading(false)
        })
    } else {
      axiosPost('collections/add', locale, sendData)
        .then(res => {
          if (res.status) {
            toast.success(locale === 'ar' ? 'تم إضافة نموذج البيانات بنجاح' : 'Data Model added successfully')
            handleClose()
            setRefresh(prev => prev + 1)
          }
        })
        .catch(err => {
          toast.error(locale === 'ar' ? 'حدث خطأ' : 'An error occurred')
        })
        .finally(_ => {
          setLoading(false)
        })
    }
  }

  useEffect(() => {
    if (typeof open !== 'boolean') {
      setValue('name_ar', open.nameAr)
      setValue('name_en', open.nameEn)
      setValue('description_ar', open.descriptionAr ?? '')
      setValue('key', open.key)
      setValue('description_en', open.descriptionEn ?? '')
      trigger('name_ar')
      trigger('name_en')
      trigger('description_ar')
      trigger('description_en')
    }
  }, [open, setValue, trigger])

  const handleClose = () => {
    toggle()
    reset()
  }

  return (
    <>
      <Drawer
        open={open}
        anchor='right'
        variant='temporary'
        onClose={handleClose}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: '70%', sm: '50%' } } }}
      >
        <Header>
          <Typography variant='h5'>
            {typeof open === 'boolean'
              ? locale === 'ar'
                ? 'إضافة نموذج البيانات'
                : 'Add Data Model'
              : locale === 'ar'
              ? open.name_ar
              : open.name_en}
          </Typography>
          <IconButton
            size='small'
            onClick={handleClose}
            sx={{
              p: '0.438rem',
              borderRadius: 1,
              color: 'text.primary',
              backgroundColor: 'action.selected',
              '&:hover': {
                backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
              }
            }}
          >
            <Icon icon='tabler:x' fontSize='1.125rem' />
          </IconButton>
        </Header>
        <Box sx={{ p: theme => theme.spacing(0, 6, 6) }} className='h-full'>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col p-4 h-full'>
            <Controller
              name='key'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  type='text'
                  label={messages['key']}
                  value={value}
                  sx={{ mb: 4 }}
                  onChange={onChange}
                  error={Boolean(errors.key)}
                  placeholder={messages['key']}
                  {...(errors.key && { helperText: errors.key.message })}
                />
              )}
            />
            <Controller
              name='name_ar'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  type='text'
                  label={messages['collectionNameAR']}
                  value={value}
                  sx={{ mb: 4 }}
                  onChange={onChange}
                  error={Boolean(errors.name_ar)}
                  placeholder={messages['collectionNameAR']}
                  {...(errors.name_ar && { helperText: errors.name_ar.message })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position='end'
                        onClick={async () => {
                          const loading = toast.loading(locale === 'ar' ? 'يتم الترجمه' : 'Translating')
                          const res = await UrlTranAr(value)
                          setValue('name_en', res)
                          trigger('name_en')
                          toast.dismiss(loading)
                        }}
                      >
                        <IconButton edge='end' onMouseDown={e => e.preventDefault()}>
                          <Icon fontSize='1.25rem' icon={'material-symbols:g-translate'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
            <Controller
              name='name_en'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  type='text'
                  label={messages['collectionNameEN']}
                  value={value}
                  sx={{ mb: 4 }}
                  onChange={onChange}
                  error={Boolean(errors.name_en)}
                  placeholder={messages['collectionNameEN']}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position='end'
                        onClick={async () => {
                          const loading = toast.loading(locale === 'ar' ? 'يتم الترجمه' : 'Translating')
                          const res = await UrlTranEn(value)
                          setValue('name_ar', res)
                          trigger('name_ar')
                          toast.dismiss(loading)
                        }}
                      >
                        <IconButton edge='end' onMouseDown={e => e.preventDefault()}>
                          <Icon fontSize='1.25rem' icon={'material-symbols:g-translate'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  {...(errors.name_en && { helperText: errors.name_en.message })}
                />
              )}
            />
            <Controller
              name='description_ar'
              control={control}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  type='text'
                  label={locale === 'ar' ? 'وصف التجميعة بالعربية' : 'Description in Arabic'}
                  value={value}
                  sx={{ mb: 4 }}
                  multiline
                  rows={4}
                  onChange={onChange}
                  error={Boolean(errors.description_ar)}
                  placeholder={locale === 'ar' ? 'وصف التجميعة بالعربية' : 'Description in Arabic'}
                  {...(errors.description_ar && { helperText: errors.description_ar.message })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position='end'
                        onClick={async () => {
                          const loading = toast.loading(locale === 'ar' ? 'يتم الترجمه' : 'Translating')
                          const res = await UrlTranAr(value)
                          setValue('description_en', res)
                          trigger('description_en')
                          toast.dismiss(loading)
                        }}
                      >
                        <IconButton edge='end' onMouseDown={e => e.preventDefault()}>
                          <Icon fontSize='1.25rem' icon={'material-symbols:g-translate'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
            <Controller
              name='description_en'
              control={control}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  type='text'
                  label={locale === 'ar' ? 'وصف التجميعة بالانجليزية' : 'Description in English'}
                  value={value}
                  sx={{ mb: 4 }}
                  multiline
                  rows={4}
                  onChange={onChange}
                  error={Boolean(errors.description_en)}
                  placeholder={locale === 'ar' ? 'وصف التجميعة بالانجليزية' : 'Description in English'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position='end'
                        onClick={async () => {
                          const loading = toast.loading(locale === 'ar' ? 'يتم الترجمه' : 'Translating')
                          const res = await UrlTranEn(value)
                          setValue('description_ar', res)
                          trigger('description_ar')
                          toast.dismiss(loading)
                        }}
                      >
                        <IconButton edge='end' onMouseDown={e => e.preventDefault()}>
                          <Icon fontSize='1.25rem' icon={'material-symbols:g-translate'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  {...(errors.description_en && { helperText: errors.description_en.message })}
                />
              )}
            />

            <Box sx={{ display: 'flex', alignItems: 'center' }} className='gap-4 justify-end py-4 mt-auto'>
              <LoadingButton type='submit' variant='contained' loading={loading}>
                {locale === 'ar' ? 'ارسال' : 'Submit'}
              </LoadingButton>
              <Button variant='tonal' color='secondary' onClick={handleClose}>
                {locale === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
            </Box>
          </form>
        </Box>
      </Drawer>
    </>
  )
}

export default AddCollection
