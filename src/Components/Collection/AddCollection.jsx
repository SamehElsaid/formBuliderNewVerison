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
    name_ar: yup.string().required(messages['required']).trim(),
    name_en: yup.string().required(messages['required']).trim(),
    description_ar: yup.string().trim(),
    description_en: yup.string().trim(),
    key: yup
      .string()
      .required(messages['required'])
      .matches(
        /^[A-Za-z]+$/,
        locale === 'ar'
          ? 'يجب ان يحتوي المفتاح على حروف فقط ولا يحتوي على ارقام او مسافات'
          : 'Key must be a string without Special characters or spaces'
      )
      .trim()
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
        return toast.info(locale === 'ar' ? 'لا يوجد تغييرات' : 'No changes')
      }
      setLoading(true)

      delete sendData.key
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
      sendData.id = open.id

      axiosPut('collections/update', locale, sendData)
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
      setLoading(true)
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
      setValue('key', open.key.trim())
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
              ? open.nameAr
              : open.nameEn}
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
                  label={
                    <span>
                      {messages['key']}
                      <span style={{ color: 'red' }}> *</span>
                    </span>
                  }
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
                  label={
                    <span>
                      {messages['collectionNameAR']}
                      <span style={{ color: 'red' }}> *</span>
                    </span>
                  }
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
                  label={
                    <span>
                      {messages['collectionNameEN']}
                      <span style={{ color: 'red' }}> *</span>
                    </span>
                  }
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
                {typeof open === 'boolean' ? messages.submit : messages.Update}
              </LoadingButton>
              <Button variant='contained' color='secondary' onClick={handleClose}>
                {typeof open === 'boolean' ? messages.cancel : messages.cancel}
              </Button>
            </Box>
          </form>
        </Box>
      </Drawer>
    </>
  )
}

export default AddCollection
