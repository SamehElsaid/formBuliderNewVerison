import { MenuItem, TextField } from '@mui/material'
import { useIntl } from 'react-intl'
import { SketchPicker } from 'react-color'

export default function InputControl({ data, onChange }) {
  const { locale } = useIntl()

  return (
    <div>
      <TextField
        fullWidth
        type='text'
        value={data.type}
        onChange={e => onChange({ ...data, type: e.target.value })}
        variant='filled'
        label={locale === 'ar' ? 'نوع الحقل' : 'Type'}
        select
      >
        <MenuItem value='text'>Text</MenuItem>
        <MenuItem value='number'>Number</MenuItem>
        <MenuItem value='email'>Email</MenuItem>
        <MenuItem value='password'>Password</MenuItem>
        <MenuItem value='tel'>Tel</MenuItem>
        <MenuItem value='url'>Url</MenuItem>
      </TextField>
      <TextField
        fullWidth
        type='text'
        value={data.key}
        onChange={e => onChange({ ...data, key: e.target.value })}
        variant='filled'
        label={locale === 'ar' ? 'المفتاح' : 'Key'}
      />
      <TextField
        fullWidth
        type='text'
        value={data.labelAr}
        onChange={e => onChange({ ...data, labelAr: e.target.value })}
        variant='filled'
        label={locale === 'ar' ? 'الحقل بالعربية' : 'Label Ar'}
      />
      <TextField
        fullWidth
        type='text'
        value={data.labelEn}
        onChange={e => onChange({ ...data, labelEn: e.target.value })}
        variant='filled'
        label={locale === 'ar' ? 'الحقل بالانجليزية' : 'Label En'}
      />

      <TextField
        fullWidth
        type='text'
        value={data.placeholderAr}
        onChange={e => onChange({ ...data, placeholderAr: e.target.value })}
        variant='filled'
        label={locale === 'ar' ? 'الحقل بالعربية' : 'Placeholder Ar'}
      />
      <TextField
        fullWidth
        type='text'
        value={data.placeholderEn}
        onChange={e => onChange({ ...data, placeholderEn: e.target.value })}
        variant='filled'
        label={locale === 'ar' ? 'الحقل بالانجليزية' : 'Placeholder En'}
      />
    </div>
  )
}
