import { Icon } from '@iconify/react'
import {
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
import { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input'
import DatePicker from 'react-datepicker'
import ar from 'date-fns/locale/ar-EG'
import en from 'date-fns/locale/en-US'
import { axiosGet } from 'src/Components/axiosCall'

export default function DisplayField({ input, dirtyProps, reload, refError, dataRef, errorView, findError }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [dirty, setDirty] = useState(dirtyProps)
  const [showPassword, setShowPassword] = useState(false)
  const [active, setActive] = useState(false)
  const { locale } = useIntl()
  const [linkCollection, setLinkCollection] = useState(false)
  const [data, setData] = useState([])
  const [validations, setValidations] = useState({})

  console.log(validations)

  useEffect(() => {
    if (!input) {
      setValue('')
      setError(false)
      setDirty(false)
      setShowPassword(false)
      setActive(false)
      setValidations({})
    } else {
      const dataValidations = {}
      input.validationData.forEach(item => {
        dataValidations[item.ruleType] = item.parameters
      })
      setValidations(dataValidations)
    }
  }, [input])

  useEffect(() => {
    if (input?.type === 'OneToMany') {
      setValue([])
    }
    if (input?.type === 'date') {
      setValue(new Date())
    }
    if (input?.type === 'file') {
      setValue([])
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

  const onChange = e => {
    setDirty(true)
    let isTypeNew = true
    if (input?.type === 'OneToMany') {
      isTypeNew = false
    }
    if (input?.type === 'date') {
      isTypeNew = false
    }

    let newData = value
    if (input?.type === 'OneToMany') {
      setValue(e.target.checked ? [...value, e.target.value] : value.filter(v => v !== e.target.value))
      newData = e.target.checked ? [...value, e.target.value] : value.filter(v => v !== e.target.value)
    } else {
      if (input?.type === 'Date') {
        setValue(new Date(e))
      } else {
        if (input?.type === 'Phone') {
          setValue(e)
        } else {
          console.log(e.target.value)

          setValue(e.target.value)
        }
      }
    }

    if (dirty) {
      console.log(validations)
      if (validations.Required && e?.target?.value?.length === 0 && isTypeNew) {
        return setError('Required')
      }

      if (input.type === 'Phone' && validations.Required && e?.length === 0 && isTypeNew) {
        return setError('Required')
      }

      if (input.type === 'Phone' && !isPossiblePhoneNumber(e ?? '')) {
        return setError('Invalid_Phone')
      }

      if (validations.Required && newData.length === 0 && !isTypeNew) {
        return setError('Required')
      }

      if (input.type === 'Email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e?.target?.value)) {
        return setError('Invalid_Email')
      }

      if (
        input.type === 'URL' &&
        !/^(https?:\/\/)?(www\.)?[a-zA-Z0-9@:%._\+~#?&//=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%._\+~#?&//=]*)$/i.test(
          e?.target?.value
        )
      ) {
        return setError('Invalid_URL')
      }

      console.log(validations?.MinLength?.minLength)
      if (validations.MinLength && e?.target?.value?.length < +validations?.MinLength?.minLength) {
        return setError('Min Length')
      }

      if (validations.MaxLength && e?.target?.value?.length > +validations?.MaxLength?.maxLength) {
        return setError('Max Length')
      }

      // if (input.validations.onlyText && !/^[\p{L}\s]+$/u.test(e?.target?.value)) {
      //   return setError('Only Text')
      // }
      // if (input.validations.onlyNumbers && !/^[0-9]+$/.test(e?.target?.value)) {
      //   return setError('Only Numbers')
      // }
      // if (input.validations.includeCamelCase && !/.*[A-Z].*/.test(e?.target?.value)) {
      //   return setError('Include Camel Case')
      // }
      // if (input.validations.includeLowerCase && !/.*[a-z].*/.test(e?.target?.value)) {
      //   return setError('Include Lower Case')
      // }

      setError(false)
    }
  }

  useEffect(() => {
    if (!input) return
    let errorWithoutDirty = []
    const errorMessages = []
    if (validations.Required && value?.length === 0) {
      errorWithoutDirty.push(true)
      errorMessages.push('Required')
    }
    if (input.type === 'Email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errorWithoutDirty.push(true)
      errorMessages.push('Invalid_Email')
    }
    if (
      input.type === 'URL' &&
      !/^(https?:\/\/)?(www\.)?[a-zA-Z0-9@:%._\+~#?&//=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%._\+~#?&//=]*)$/i.test(
        value
      )
    ) {
      errorWithoutDirty.push(true)
      errorMessages.push('Invalid_URL')
    }
    if (validations.MinLength && value.length < +validations?.MinLength?.minLength) {
      errorWithoutDirty.push(true)
      errorMessages.push('Min_Length')
    }
    if (validations.MaxLength && value.length > +validations?.MaxLength?.maxLength) {
      errorWithoutDirty.push(true)
      errorMessages.push('Max_Length')
    }

    // if (input.validations.onlyText && !/^[\p{L}\s]+$/u.test(value)) {
    //   errorWithoutDirty.push(true)
    //   errorMessages.push('Only_Text')
    // }
    // if (input.validations.onlyNumbers && !/^[0-9]+$/.test(value)) {
    //   errorWithoutDirty.push(true)
    //   errorMessages.push('Only_Numbers')
    // }
    // if (input.validations.includeCamelCase && !/.*[A-Z].*/.test(value)) {
    //   errorWithoutDirty.push(true)
    //   errorMessages.push('Include_Camel_Case')
    // }
    // if (input.validations.includeLowerCase && !/.*[a-z].*/.test(value)) {
    //   errorWithoutDirty.push(true)
    //   errorMessages.push('Include_Lower_Case')
    // }
    if (input.type === 'Phone' && !isPossiblePhoneNumber(value ?? '')) {
      errorWithoutDirty.push(true)
      errorMessages.push('Invalid_Phone')
    }
    if (dataRef) {
      if (input.type === 'Date') {
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
  }, [refError, input, value, dataRef, validations])
  const [selectedOptions, setSelectedOptions] = useState([])

  useEffect(() => {
    if (input.type === 'OneToOne' || input.type === 'OneToMany') {
      axiosGet(`generic-entities/${input?.options?.source}`).then(res => {
        if (res.status) {
          setSelectedOptions(res.entities)
        }
      })
    }
  }, [input])

  if (input.type === 'SingleText' || input.type === 'Number' || input.type === 'Email' || input.type === 'URL') {
    return (
      <TextField
        type={input.type === 'Number' ? 'number' : 'text'}
        label={locale === 'ar' ? input.nameAr : input.nameEn}
        value={value}
        name={input.nameEn}
        className='capitalize'
        fullWidth
        onChange={e => onChange(e)}
        error={Boolean(findError || error)}
        helperText={errorView || error}
      />
    )
  }
  if (input.type === 'LongText') {
    return (
      <TextField
        label={locale === 'ar' ? input.nameAr : input.nameEn}
        value={value}
        fullWidth
        multiline
        rows={4}
        name={input.nameEn}
        onChange={e => onChange(e)}
        error={Boolean(findError || error)}
        helperText={errorView || error}
      />
    )
  }
  if (input.type === 'Password') {
    return (
      <TextField
        label={locale === 'ar' ? input.nameAr : input.nameEn}
        type={showPassword ? 'text' : 'password'}
        value={value}
        name={input.nameEn}
        fullWidth
        onChange={e => onChange(e)}
        error={Boolean(findError || error)}
        helperText={errorView || error}
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
    )
  }
  if (input.type === 'Date') {
    return (
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
            name={input.nameEn}
            error={Boolean(findError || error)}
            helperText={errorView || error}
            {...(error && { helperText: error })}
            fullWidth
            label={locale === 'ar' ? input.nameAr : input.nameEn}
            registername={input.nameEn}
          />
        }
        onChange={e => onChange(e)}
      />
    )
  }
  if (input.type === 'Phone') {
    return (
      <div className=''>
        <InputLabel id='demo-simple-select-label'>{locale === 'ar' ? input.nameAr : input.nameEn}</InputLabel>
        <PhoneInput
          style={{
            border: value === undefined && '1px solid #00cfe8'
          }}
          defaultCountry={input.options.defaultValue ?? 'EG'}
          className={`phoneNumber ${Boolean(errorView || error) ? 'error' : ''} ${active ? 'main' : ''} ${
            value === undefined ? 'error' : ''
          } `}
          placeholder={locale === 'ar' ? '123-456-7890' : '123-456-7890'}
          name={input.nameEn}
          value={value}
          onChange={onChange}
        />
        <FormHelperText className='!text-[#f44336]'>{errorView || error}</FormHelperText>
      </div>
    )
  }

  console.log(input.type)
  if (input.type === 'OneToOne' && input.descriptionAr !== 'select') {
    const lable = JSON.parse(input?.descriptionEn)

    return (
      <div className=''>
        <FormLabel htmlFor={input.key} className='!text-xl capitalize'>
          {locale === 'ar' ? input.nameAr : input.nameEn}
        </FormLabel>
        <div className=''>
          {selectedOptions.map((option, index) => (
            <FormControlLabel
              key={index}
              control={
                <Radio value={option.Id} name={input.Id} checked={value === option.Id} onChange={e => onChange(e)} />
              }
              label={lable.map(ele => option[ele]).join('-')}
            />
          ))}
          <FormHelperText className='!text-[#f44336]'>{errorView || error}</FormHelperText>
        </div>
      </div>
    )
  }
  if (input.type === 'OneToOne' && input.descriptionAr === 'select') {
    const lable = JSON.parse(input?.descriptionEn)

    return (
      <div className=''>
        <div className=''>
          <div className=''>
            <InputLabel id='demo-simple-select-label' className='!text-xl capitalize'>
              {locale === 'ar' ? input.nameAr : input.nameEn}
            </InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={value}
              fullWidth
              label={locale === 'ar' ? input.nameAr : input.nameEn}
              onChange={e => onChange(e)}
              name={input.nameEn}
              error={Boolean(findError || error)}
            >
              {selectedOptions.map((option, index) => (
                <MenuItem key={index} value={option.Id}>
                  {lable.map(ele => option[ele]).join('-')}
                </MenuItem>
              ))}
            </Select>
          </div>
          <FormHelperText className='!text-[#f44336]'>{errorView || error}</FormHelperText>
        </div>
      </div>
    )
  }
  if (input.type === 'OneToMany') {
    const lable = JSON.parse(input?.descriptionEn)

    return (
      <div className=''>
        <div className=''>
          <div className=''>
            <div className='flex flex-col gap-1'>
              <FormLabel htmlFor={input.nameEn} className='!text-xl capitalize'>
                {locale === 'ar' ? input.nameAr : input.nameEn}
              </FormLabel>
              <div className=''>
                {selectedOptions.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        value={option.Id}
                        name={input.nameEn}
                        checked={typeof value === 'object' ? value?.find(v => v === option.Id) : false}
                        onChange={e => onChange(e)}
                      />
                    }
                    label={lable.map(ele => option[ele]).join('-')}
                  />
                ))}
                <FormHelperText className='!text-[#f44336]'>{errorView || error}</FormHelperText>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
