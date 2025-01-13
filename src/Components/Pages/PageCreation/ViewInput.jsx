import { Icon } from '@iconify/react'
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Radio,
  Select,
  TextField
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input'
import { useIntl } from 'react-intl'
import ar from 'date-fns/locale/ar-EG'
import en from 'date-fns/locale/en-US'
import { axiosGet } from 'src/Components/axiosCall'

export default function ViewInput({ input, dirtyProps, refError, dataRef, reload }) {
  console.log(input)
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [dirty, setDirty] = useState(dirtyProps)
  const [showPassword, setShowPassword] = useState(false)
  const [active, setActive] = useState(false)
  const { locale } = useIntl()
  const [linkCollection, setLinkCollection] = useState(false)
  const [data, setData] = useState([])
  console.log(input)

  useEffect(() => {
    if (!input) {
      setValue('')
      setError(false)
      setDirty(false)
      setShowPassword(false)
      setActive(false)
    }
  }, [input])

  useEffect(() => {
    if (reload !== 0) {
      setValue('')
      setError(false)
      setDirty(false)
      setShowPassword(false)
      setActive(false)
    }
  }, [reload])
  useEffect(() => {
    if (input?.type === 'checkbox') {
      setValue([])
    }
    if (input?.type === 'radio') {
      setValue(input.options[0]?.label_en)
    }
    if (input?.type === 'date') {
      setValue(new Date())
    }
    if (input?.type === 'file') {
      setValue([])
    }
    if (input?.valueCollection) {
      console.log(input.linkCollection.name_en)

      setLinkCollection({ linkWith: input.valueCollection, view: input.selectedValue })
      axiosGet(input.linkCollection.name_en, 'en')
        .then(res => {
          if (res) {
            setData(res)
          }
        })
    }
  }, [input])
  console.log(data, linkCollection)

  const onChange = e => {
    setDirty(true)
    let isTypeNew = true
    if (input?.type === 'checkbox') {
      isTypeNew = false
    }
    if (input?.type === 'date') {
      isTypeNew = false
    }

    let newData = value
    if (input?.type === 'checkbox') {
      setValue(e.target.checked ? [...value, e.target.value] : value.filter(v => v !== e.target.value))
      newData = e.target.checked ? [...value, e.target.value] : value.filter(v => v !== e.target.value)
    } else {
      if (input?.type === 'date') {
        setValue(new Date(e))
      } else {
        if (input?.type === 'tel') {
          setValue(e)
        } else {
          setValue(e.target.value)
        }
      }
    }

    if (dirty) {
      if (input.validations.required && e?.target?.value?.length === 0 && isTypeNew) {
        return setError('Required')
      }
      if (input.type === 'tel' && input.validations.required && e?.length === 0 && isTypeNew) {
        return setError('Required')
      }
      if (input.type === 'tel' && !isPossiblePhoneNumber(e ?? '')) {
        return setError('Invalid_Phone')
      }
      if (input.validations.required && newData.length === 0 && !isTypeNew) {
        return setError('Required')
      }
      if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e?.target?.value)) {
        return setError('Invalid_Email')
      }
      if (
        input.type === 'url' &&
        !/^(https?:\/\/)?(www\.)?[a-zA-Z0-9@:%._\+~#?&//=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%._\+~#?&//=]*)$/i.test(
          e?.target?.value
        )
      ) {
        return setError('Invalid_URL')
      }
      console.log(input.validations.minLength)
      if (input.validations.minLength && e?.target?.value?.length < +input.validations.minLength) {
        return setError('Min Length')
      }
      if (input.validations.maxLength && e?.target?.value?.length > +input.validations.maxLength) {
        return setError('Max Length')
      }
      if (input.validations.onlyText && !/^[\p{L}\s]+$/u.test(e?.target?.value)) {
        return setError('Only Text')
      }
      if (input.validations.onlyNumbers && !/^[0-9]+$/.test(e?.target?.value)) {
        return setError('Only Numbers')
      }
      if (input.validations.includeCamelCase && !/.*[A-Z].*/.test(e?.target?.value)) {
        return setError('Include Camel Case')
      }
      if (input.validations.includeLowerCase && !/.*[a-z].*/.test(e?.target?.value)) {
        return setError('Include Lower Case')
      }

      setError(false)
    }
  }
  console.log(value)

  const onChangeFile = e => {
    const errorType = []
    input.allowedFileTypes.forEach(type => {
      if (e?.target?.files[0]?.type.includes(type.replace('.', '/'))) {
        errorType.push(true)
      }
    })
    console.log(errorType.includes(true))
    if (!errorType.includes(true)) {
      setValue([])
      e.target.value = ''

      return setError('Invalid File Type')
    }
    setError(false)
    setValue(e?.target?.files[0] ? [e.target.files[0]] : [])

    e.target.value = ''
  }

  useEffect(() => {
    if (!input) return
    let errorWithoutDirty = []
    const errorMessages = []
    if (input.validations.required && value?.length === 0) {
      errorWithoutDirty.push(true)
      errorMessages.push('Required')
    }
    if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errorWithoutDirty.push(true)
      errorMessages.push('Invalid_Email')
    }
    if (
      input.type === 'url' &&
      !/^(https?:\/\/)?(www\.)?[a-zA-Z0-9@:%._\+~#?&//=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%._\+~#?&//=]*)$/i.test(
        value
      )
    ) {
      errorWithoutDirty.push(true)
      errorMessages.push('Invalid_URL')
    }
    if (input.validations.minLength && value.length < input.validations.minLength) {
      errorWithoutDirty.push(true)
      errorMessages.push('Min_Length')
    }
    if (input.validations.maxLength && value.length > input.validations.maxLength) {
      errorWithoutDirty.push(true)
      errorMessages.push('Max_Length')
    }
    if (input.validations.onlyText && !/^[\p{L}\s]+$/u.test(value)) {
      errorWithoutDirty.push(true)
      errorMessages.push('Only_Text')
    }
    if (input.validations.onlyNumbers && !/^[0-9]+$/.test(value)) {
      errorWithoutDirty.push(true)
      errorMessages.push('Only_Numbers')
    }
    if (input.validations.includeCamelCase && !/.*[A-Z].*/.test(value)) {
      errorWithoutDirty.push(true)
      errorMessages.push('Include_Camel_Case')
    }
    if (input.validations.includeLowerCase && !/.*[a-z].*/.test(value)) {
      errorWithoutDirty.push(true)
      errorMessages.push('Include_Lower_Case')
    }
    if (input.type === 'tel' && !isPossiblePhoneNumber(value ?? '')) {
      errorWithoutDirty.push(true)
      errorMessages.push('Invalid_Phone')
    }
    if (dataRef) {
      if (input.type === 'date') {
        try {
          dataRef.current[input.key] = new Date(value).toISOString()
        } catch (error) {
          dataRef.current[input.key] = ''
        }
      } else {
        dataRef.current[input.key] = value
      }
    }
    if (refError) {
      refError.current = {
        ...refError.current,
        [input.key]: errorWithoutDirty.includes(true) ? errorMessages : false
      }
    }
  }, [refError, input, value, dataRef])

  console.log(error)

  return (
    input &&
    (input.type === 'text' || input.type === 'number' || input.type === 'email' || input.type === 'url' ? (
      <>
        <TextField
          error={Boolean(error)}
          type={input.type === 'number' ? 'number' : 'text'}
          label={locale === 'ar' ? input.label : input.label_en}
          value={value}
          name={input.label_en}
          fullWidth
          onChange={e => onChange(e)}
          helperText={error}
        />
      </>
    ) : input.type === 'password' ? (
      <TextField
        error={Boolean(error)}
        label={locale === 'ar' ? input.label : input.label_en}
        type={showPassword ? 'text' : 'password'}
        value={value}
        name={input.label_en}
        fullWidth
        onChange={e => onChange(e)}
        helperText={error}
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
    ) : input.type === 'textarea' ? (
      <TextField
        error={Boolean(error)}
        label={locale === 'ar' ? input.label : input.label_en}
        value={value}
        fullWidth
        multiline
        rows={4}
        name={input.label_en}
        onChange={e => onChange(e)}
        helperText={error}
      />
    ) : input.type === 'checkbox' ? (
      <div className='flex flex-col gap-1'>
        <FormLabel htmlFor={input.label}>{locale === 'ar' ? input.label : input.label_en}</FormLabel>
        <div className=''>
          {input.options.map((option, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  value={option.label_en}
                  name={input.label_en}
                  checked={typeof value === 'object' ? value?.find(v => v === option.label_en) : false}
                  onChange={e => onChange(e, option.label_en)}
                />
              }
              label={locale === 'ar' ? option.label : option.label_en}
            />
          ))}
          <FormHelperText>{error}</FormHelperText>
        </div>
      </div>
    ) : input.type === 'radio' ? (
      <div className='flex flex-col gap-1'>
        <FormLabel htmlFor={input.label}>{locale === 'ar' ? input.label : input.label_en}</FormLabel>
        <div className=''>
          {input.options.map((option, index) => (
            <FormControlLabel
              key={index}
              control={
                <Radio
                  value={option.label_en}
                  name={input.label_en}
                  checked={value === option.label_en}
                  onChange={e => onChange(e, option.label_en)}
                />
              }
              label={locale === 'ar' ? option.label : option.label_en}
            />
          ))}
          <FormHelperText>{error}</FormHelperText>
        </div>
      </div>
    ) : input.type === 'select' ? (
      <div className=''>
        <InputLabel id='demo-simple-select-label'>{locale === 'ar' ? input.label : input.label_en}</InputLabel>
        <Select
          labelId='demo-simple-select-label'
          id='demo-simple-select'
          value={value}
          fullWidth
          label={locale === 'ar' ? input.label : input.label_en}
          onChange={e => onChange(e)}
          name={input.label_en}
          error={Boolean(error)}
        >
          {linkCollection ? (
            data.map((item, index) => {
              // const view
              // Object.keys(item).forEach(key => {
              //   console.log(key)
              // })

              return (
                <MenuItem key={index} value={item[linkCollection.linkWith]}>
                  {linkCollection.view.map(ele => item[ele]).join(' ')}
                </MenuItem>
              )
            })
          ) : (
            input.options.map((option, index) => (
              <MenuItem key={index} value={option.label_en}>
                {locale === 'ar' ? option.label : option.label_en}
              </MenuItem>
            ))
          )}
        </Select>
      </div>
    ) : input.type === 'date' ? (

        <DatePicker
          fullWidth
          selectsStart
          id='event-start-date'
          locale={locale === 'ar' ? ar : en}
          selected={value}
          startDate={value}
          dateFormat={'yyyy-MM-dd'}
          customInput={
            <TextField
              name={input.label_en}
              error={Boolean(error)}
              {...(error && { helperText: error })}
              fullWidth
              label={locale === 'ar' ? input.label : input.label_en}
              registername={input.label_en}
            />
          }
          onChange={e => onChange(e)}
        />
    ) : input.type === 'file' ? (
      <div>
        <Button variant='contained' component='label' startIcon={<Icon icon='ph:upload-fill' />} fullWidth>
          <input
            type='file'
            accept={input.allowedFileTypes.map(type => `${type}`).join(',')}
            hidden
            name={input.label_en}
            onChange={e => onChangeFile(e)}
          />
          {value.length > 0 && (
            <div className='flex gap-2'>
              {value.map(file => (
                <div key={file.name}>{file.name}</div>
              ))}
            </div>
          )}
        </Button>
        <FormHelperText>{error}</FormHelperText>
      </div>
    ) : input.type === 'tel' ? (
      <div className=''>
        <InputLabel id='demo-simple-select-label'>{locale === 'ar' ? input.label : input.label_en}</InputLabel>
        <PhoneInput
          style={{
            border: value === undefined && '1px solid #00cfe8'
          }}
          defaultCountry={input.defaultCountry ?? 'EG'}
          className={`phoneNumber ${Boolean(error) ? 'error' : ''} ${active ? 'main' : ''} ${
            value === undefined ? 'error' : ''
          } `}
          placeholder={locale === 'ar' ? '123-456-7890' : '123-456-7890'}
          name={input.label_en}
          value={value}
          onChange={onChange}
        />
        <FormHelperText>{error}</FormHelperText>
      </div>
    ) : null)
  )
}
