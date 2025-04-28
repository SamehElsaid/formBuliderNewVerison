import React, { useEffect, useState } from 'react'
import { TextField, InputAdornment, MenuItem } from '@mui/material'
import { useSelector } from 'react-redux'
import CloseNav from './CloseNav'

export default function OtpControl({ data, onChange, locale, type, buttonRef }) {
  const [obj, setObj] = useState(false)
  const getApiData = useSelector(rx => rx.api.data)

  const renderTextField = (label, valueKey, inputType = 'text', options = {}) => {
    // Add max validation specifically for the Number of OTP field
    const isOtpNumberField = 
      (locale === 'ar' && label === 'عدد الرمز') || 
      (locale !== 'ar' && label === 'Number of OTP')
    
    const inputProps = isOtpNumberField 
      ? { ...options.inputProps, max: 20 }
      : options.inputProps
    
    const handleChange = (e) => {
      let value = e.target.value
      if (isOtpNumberField && value > 20) {
        value = 20
      }
      
      onChange({ ...data, [valueKey]: value })
    }

    return (
      <TextField
        fullWidth
        type={inputType}
        value={data[valueKey] || ''}
        onChange={handleChange}
        label={locale === 'ar' ? options.labelAr || label : label}
        variant='filled'
        inputProps={inputProps}
        {...options}
      />
    )
  }

  const renderSelect = (label, valueKey, optionsList, additionalProps = {}) => (
    <TextField
      select
      fullWidth
      value={data[valueKey] || optionsList[0].value}
      onChange={e => onChange({ ...data, [valueKey]: e.target.value })}
      label={locale === 'ar' ? additionalProps.labelAr || label : label}
      variant='filled'
    >
      {optionsList.map(({ value, label }) => (
        <MenuItem key={value} value={value}>
          {label}
        </MenuItem>
      ))}
    </TextField>
  )

  useEffect(() => {
    if (data.api_url) {
      const items = getApiData.find(item => item.link === data.api_url)?.data
      onChange({ ...data, items: items })
      if (items) {
        setObj(items)
      }
    } else {
      setObj(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.api_url])

  return (
    <div>
      <CloseNav text={locale === 'ar' ? 'العداد/التوقيت' : 'Counter/Timer'} buttonRef={buttonRef} />
      <div className='p-4 mt-4 rounded border border-dashed border-main-color'>
        {renderTextField(
          obj
            ? locale === 'ar'
              ? 'مفتاح العنوان بالعربية'
              : 'Title ar key'
            : locale === 'ar'
            ? 'العنوان بالعربية'
            : 'Title Ar',
          'content_ar',
          'text'
        )}
        {renderTextField(
          obj
            ? locale === 'ar'
              ? 'مفتاح العنوان بالانجليزية'
              : 'Title en key'
            : locale === 'ar'
            ? 'العنوان بالانجليزية'
            : 'Title En',
          'content_en',
          'text'
        )}
        {renderTextField(locale === 'ar' ? 'عدد الرمز' : 'Number of OTP', 'numberOfOtp', 'number', {
          helperText: locale === 'ar' ? 'الحد الأقصى هو 20' : 'Maximum is 20'
        })}
        {renderTextField(locale === 'ar' ? 'مدة التأكيد' : 'Timer time', 'timerTime', 'number', {
          InputProps: {
            endAdornment: <InputAdornment position='end'>{locale === 'ar' ? 'ثواني' : 'Seconds'}</InputAdornment>
          }
        })}
        {renderTextField(locale === 'ar' ? 'مفتاح الرمز المرسل للِAPI' : 'Required code key for API', 'key', 'text')}
        {renderTextField(locale === 'ar' ? 'رابط التأكيد' : 'Verification link', 'api_url', 'text')}
        {renderTextField(locale === 'ar' ? 'رابط إعادة الإرسال' : 'Resend OTP link', 'resendOtpLink', 'text')}

        {renderTextField('Color', 'titleColor', 'color')}
      </div>
    </div>
  )
}