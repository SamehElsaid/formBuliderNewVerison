import { useState, useEffect, useRef, useMemo } from 'react'
import {
  Button,
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
import { useIntl } from 'react-intl'
import { isPossiblePhoneNumber } from 'react-phone-number-input'
import DatePicker from 'react-datepicker'
import ar from 'date-fns/locale/ar-EG'
import en from 'date-fns/locale/en-US'
import { axiosGet } from 'src/Components/axiosCall'
import { Icon } from '@iconify/react'
import Collapse from '@kunukn/react-collapse'

export default function DisplayField({ input, dirtyProps, reload, refError, dataRef, errorView, findError }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [dirty, setDirty] = useState(dirtyProps)
  const [showPassword, setShowPassword] = useState(false)
  const { locale } = useIntl()
  const [validations, setValidations] = useState({})
  const [selectedOptions, setSelectedOptions] = useState([])
  const xComponentProps = useMemo(() => input?.options?.uiSchema?.xComponentProps ?? {}, [input])

  useEffect(() => {
    if (!input) {
      setValue('')
      setError(false)
      setDirty(false)
      setShowPassword(false)
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
    if (input?.type === 'ManyToMany') {
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
    }
  }, [reload])

  const onChange = e => {
    setDirty(true)
    let isTypeNew = true
    if (input?.type === 'ManyToMany') {
      isTypeNew = false
    }
    if (input?.type === 'date') {
      isTypeNew = false
    }

    let newData = value
    if (input?.type === 'ManyToMany') {
      setValue(e.target.checked ? [...value, e.target.value] : value.filter(v => v !== e.target.value))
      newData = e.target.checked ? [...value, e.target.value] : value.filter(v => v !== e.target.value)
    } else {
      if (input?.type === 'Date') {
        setValue(new Date(e))
      } else {
        setValue(e.target.value)
      }
    }

    if (dirty) {
      if (validations.Required && e?.target?.value?.length === 0 && isTypeNew) {
        return setError('Required')
      }

      if (input.type === 'Phone' && validations.Required && e?.length === 0 && isTypeNew) {
        return setError('Required')
      }
      console.log(e.target.value, 'value', isPossiblePhoneNumber(e.target.value))
      if (input.type === 'Phone' && !isPossiblePhoneNumber('+' + e?.target?.value ?? '')) {
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

      if (validations.MinLength && e?.target?.value?.length < +validations?.MinLength?.minLength) {
        return setError('Min Length')
      }

      if (validations.MaxLength && e?.target?.value?.length > +validations?.MaxLength?.maxLength) {
        return setError('Max Length')
      }

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

  useEffect(() => {
    if (input.type === 'OneToOne' || input.type === 'ManyToMany') {
      axiosGet(`generic-entities/${input?.options?.source}`).then(res => {
        if (res.status) {
          setSelectedOptions(res.entities)
        }
      })
    }
  }, [input])

  const onChangeFile = e => {
    const errorType = []
    input.allowedFileTypes.forEach(type => {
      if (e?.target?.files[0]?.type.includes(type.replace('.', '/'))) {
        errorType.push(true)
      }
    })
    if (!errorType.includes(true)) {
      setValue([])
      e.target.value = ''

      return setError('Invalid File Type')
    }
    setError(false)
    setValue(e?.target?.files[0] ? [e.target.files[0]] : [])
    e.target.value = ''
  }

  const label = (
    <label htmlFor={input.key} style={{ textTransform: 'capitalize' }}>
      {locale === 'ar' ? input.nameAr : input.nameEn}
    </label>
  )



  return (
    <div className='reset' id={input.key + input.nameEn}>
      <div>{label}</div>
      <style>{`#${input.key + input.nameEn} {
        ${xComponentProps?.cssClass}
      }`}</style>
      <div className='relative' style={{ display: 'flex' }}>
        <ViewInput
          input={input}
          xComponentProps={xComponentProps}
          value={value}
          onChange={onChange}
          locale={locale}
          findError={findError}
          selectedOptions={selectedOptions}
          errorView={errorView}
          error={error}
          setShowPassword={setShowPassword}
          showPassword={showPassword}
        />
      </div>
      <Collapse transition={`height 300ms cubic-bezier(.4, 0, .2, 1)`} isOpen={Boolean(errorView || error)}>
        <div class='!text-sm text-red-500 mt-1 px-2'>{errorView || error}</div>
      </Collapse>
    </div>
  )
}

const ViewInput = ({
  input,
  value,
  onChange,
  locale,
  findError,
  errorView,
  error,
  xComponentProps,
  showPassword,
  setShowPassword,
  selectedOptions
}) => {
  const handleKeyDown = event => {
    if (input.type !== 'Phone') return
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
    }
  }

  const handleWheel = event => {
    if (input.type !== 'Phone') return
    event.preventDefault()
  }
  if (
    input.type === 'SingleText' ||
    input.type === 'Number' ||
    input.type === 'Email' ||
    input.type === 'URL' ||
    input.type === 'Password' ||
    input.type === 'Phone'
  ) {
    const placeholderInText = xComponentProps?.placeholder
    const placeholder = JSON.parse(placeholderInText) ?? { ar: '', en: '' }
    console.log(placeholder)

    return (
      <>
        <input
          id={input.key}
          type={
            showPassword
              ? 'text'
              : input.type === 'URL'
              ? 'text'
              : input.type === 'SingleText'
              ? 'text'
              : input.type === 'Phone'
              ? 'number'
              : input.type
          }
          value={value}
          name={input.nameEn}
          onClick={() => {
            console.log('click')
          }}
          onChange={e => {
            console.log(e)
            onChange(e)
          }}
          onKeyDown={handleKeyDown}
          onWheel={handleWheel}
          className={`${errorView || error ? 'error' : ''} `}
          style={{ transition: '0.3s' }}
          placeholder={locale === 'ar' ? placeholder.ar : placeholder.en}
        />
        {input.type === 'Password' && (
          <div className='absolute top-1/2 || -translate-y-1/2 || end-[15px]'>
            <InputAdornment position='end'>
              <IconButton
                edge='end'
                onMouseDown={e => e.preventDefault()}
                onClick={() => setShowPassword(!showPassword)}
              >
                <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
              </IconButton>
            </InputAdornment>
          </div>
        )}
      </>
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

  if (input.type === 'File') {
    return (
      <div>
        <Button variant='contained' component='label' startIcon={<Icon icon='ph:upload-fill' />} fullWidth>
          <input
            type='file'
            hidden
            name={locale === 'ar' ? input.nameAr : input.nameEn}
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
        <FormHelperText>{error || errorView}</FormHelperText>
      </div>
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
  if (input.type === 'ManyToMany') {
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
                  <div key={option.Id} className=''>
                    <input
                      value={option.Id}
                      name={input.nameEn}
                      checked={typeof value === 'object' ? value?.find(v => v === option.Id) : false}
                      onChange={e => onChange(e)}
                      type='checkbox'
                      id={option.Id}
                    />
                    <label htmlFor={option.Id} >{lable.map(ele => option[ele]).join('-')}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
