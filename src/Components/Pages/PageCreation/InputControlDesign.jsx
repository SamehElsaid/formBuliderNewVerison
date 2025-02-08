import { Icon } from '@iconify/react'
import { Box, Drawer, IconButton, InputAdornment, MenuItem, Select, TextField, Typography } from '@mui/material'
import React from 'react'
import { styled } from '@mui/material/styles'
import { cssToObject, extractValueAndUnit, getDataInObject, objectToCss } from 'src/Components/_Shared'
import CssEditor from 'src/Components/FormCreation/PageCreation/CssEditor'

const Header = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  padding: '20px 10px',
  justifyContent: 'space-between'
}))

export default function InputControlDesign({ open, handleClose, design, locale, data, onChange }) {
  console.log(design)
  const Css = cssToObject(design)

  const UpdateData = (key, value) => {
    const additional_fields = data.additional_fields ?? []
    const findMyInput = additional_fields.find(inp => inp.key === open.id)


    const Css = cssToObject(design)

    const keys = key.split('.')

    let current = Css
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i]
      if (!current[k] || typeof current[k] !== 'object') {
        current[k] = {}
      }
      current = current[k]
    }

    current[keys[keys.length - 1]] = value


    if (findMyInput) {
      findMyInput.design = objectToCss(Css).replaceAll('NaN', '')
    } else {
      const myEdit = { key: open.id, design: objectToCss(Css).replaceAll('NaN', ''), roles: {}, event: {} }
      additional_fields.push(myEdit)
    }
    onChange({ ...data, additional_fields: additional_fields })
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: '70%' } } }}
    >
      <Header>
        <Typography className='capitalize text-[#555] !font-bold' variant='h4'>
          {locale === 'ar' ? open?.nameAr : open?.nameEn}
        </Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          color='error'
          variant='contained'
          sx={{
            p: '0.438rem',
            borderRadius: 50,
            backgroundColor: 'action.selected'
          }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box className='h-full'>
        {open &&
          (open.type === 'SingleText' ||
            open.type === 'Number' ||
            open.type === 'Phone' ||
            open.type === 'URL' ||
            open.type === 'Email' ||
            open.type === 'Password' ||
            open.type === 'LongText') && (
            <div className='flex flex-col p-4 h-full'>
              <TextField
                fullWidth
                type='number'
                value={extractValueAndUnit(getDataInObject(Css, '#parent-input.width')).value || ''}
                onChange={e =>
                  UpdateData(
                    '#parent-input.width',
                    e.target.value + extractValueAndUnit(getDataInObject(Css, '#parent-input.width')).unit
                  )
                }
                variant='filled'
                label={locale === 'ar' ? 'العرض' : 'Width'}
                disabled={
                  extractValueAndUnit(getDataInObject(Css, '#parent-input.width')).unit === 'max-content' ||
                  extractValueAndUnit(getDataInObject(Css, '#parent-input.width')).unit === 'min-content' ||
                  extractValueAndUnit(getDataInObject(Css, '#parent-input.width')).unit === 'fit-content' ||
                  extractValueAndUnit(getDataInObject(Css, '#parent-input.width')).unit === 'auto' ||
                  !extractValueAndUnit(getDataInObject(Css, '#parent-input.width')).unit
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <Select
                        value={extractValueAndUnit(getDataInObject(Css, '#parent-input.width')).unit || '%'}
                        onChange={e => {
                          if (
                            e.target.value === 'max-content' ||
                            e.target.value === 'min-content' ||
                            e.target.value === 'fit-content' ||
                            e.target.value === 'auto'
                          ) {
                            UpdateData('#parent-input.width', e.target.value)
                          } else {
                            UpdateData(
                              '#parent-input.width',
                              extractValueAndUnit(getDataInObject(Css, '#parent-input.width')).value + e.target.value
                            )
                          }
                        }}
                        displayEmpty
                        variant='standard'
                      >
                        <MenuItem value='px'>PX</MenuItem>
                        <MenuItem value='%'>%</MenuItem>
                        <MenuItem value='EM'>EM</MenuItem>
                        <MenuItem value='VW'>VW</MenuItem>
                        <MenuItem value='max-content'>Max-Content</MenuItem>
                        <MenuItem value='min-content'>Min-Content</MenuItem>
                        <MenuItem value='fit-content'>Fit-Content</MenuItem>
                        <MenuItem value='auto'>Auto</MenuItem>
                      </Select>
                      {/* <FormControl>
              </FormControl> */}
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                fullWidth
                type='number'
                value={extractValueAndUnit(getDataInObject(Css, '#parent-input.height')).value || ''}
                onChange={e =>
                  UpdateData(
                    '#parent-input.height',
                    e.target.value + extractValueAndUnit(getDataInObject(Css, '#parent-input.height')).unit
                  )
                }
                variant='filled'
                label={locale === 'ar' ? 'الطول' : 'Height'}
                disabled={
                  extractValueAndUnit(getDataInObject(Css, '#parent-input.height')).unit === 'max-content' ||
                  extractValueAndUnit(getDataInObject(Css, '#parent-input.height')).unit === 'min-content' ||
                  extractValueAndUnit(getDataInObject(Css, '#parent-input.height')).unit === 'fit-content' ||
                  extractValueAndUnit(getDataInObject(Css, '#parent-input.height')).unit === 'auto' ||
                  !extractValueAndUnit(getDataInObject(Css, '#parent-input.height')).unit
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <Select
                        value={extractValueAndUnit(getDataInObject(Css, '#parent-input.height')).unit || '%'}
                        onChange={e => {
                          if (
                            e.target.value === 'max-content' ||
                            e.target.value === 'min-content' ||
                            e.target.value === 'fit-content' ||
                            e.target.value === 'auto'
                          ) {
                            UpdateData('#parent-input.height', e.target.value)
                          } else {
                            UpdateData(
                              '#parent-input.height',
                              extractValueAndUnit(getDataInObject(Css, '#parent-input.height')).value + e.target.value
                            )
                          }
                        }}
                        displayEmpty
                        variant='standard'
                      >
                        <MenuItem value='px'>PX</MenuItem>
                        <MenuItem value='%'>%</MenuItem>
                        <MenuItem value='EM'>EM</MenuItem>
                        <MenuItem value='VW'>VW</MenuItem>
                        <MenuItem value='max-content'>Max-Content</MenuItem>
                        <MenuItem value='min-content'>Min-Content</MenuItem>
                        <MenuItem value='fit-content'>Fit-Content</MenuItem>
                        <MenuItem value='auto'>Auto</MenuItem>
                      </Select>
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                fullWidth
                type='number'
                value={extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-top')).value || ''}
                onChange={e =>
                  UpdateData(
                    '#parent-input.margin-top',
                    e.target.value + extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-top')).unit
                  )
                }
                variant='filled'
                label={locale === 'ar' ? 'المسافة العلوية' : 'Margin Top'}
                disabled={
                  extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-top')).unit === 'max-content' ||
                  extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-top')).unit === 'min-content' ||
                  extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-top')).unit === 'fit-content' ||
                  extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-top')).unit === 'auto' ||
                  !extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-top')).unit
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <Select
                        value={extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-top')).unit || '%'}
                        onChange={e => {
                          if (
                            e.target.value === 'max-content' ||
                            e.target.value === 'min-content' ||
                            e.target.value === 'fit-content' ||
                            e.target.value === 'auto'
                          ) {
                            UpdateData('#parent-input.margin-top', e.target.value)
                          } else {
                            UpdateData(
                              '#parent-input.margin-top',
                              extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-top')).value +
                                e.target.value
                            )
                          }
                        }}
                        displayEmpty
                        variant='standard'
                      >
                        <MenuItem value='px'>PX</MenuItem>
                        <MenuItem value='%'>%</MenuItem>
                        <MenuItem value='EM'>EM</MenuItem>
                        <MenuItem value='VW'>VW</MenuItem>
                        <MenuItem value='max-content'>Max-Content</MenuItem>
                        <MenuItem value='min-content'>Min-Content</MenuItem>
                        <MenuItem value='fit-content'>Fit-Content</MenuItem>
                        <MenuItem value='auto'>Auto</MenuItem>
                      </Select>
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                fullWidth
                type='number'
                value={extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-bottom')).value || ''}
                onChange={e =>
                  UpdateData(
                    '#parent-input.margin-bottom',
                    e.target.value + extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-bottom')).unit
                  )
                }
                variant='filled'
                label={locale === 'ar' ? 'المسافة السفلية' : 'Margin Bottom'}
                disabled={
                  extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-bottom')).unit === 'max-content' ||
                  extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-bottom')).unit === 'min-content' ||
                  extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-bottom')).unit === 'fit-content' ||
                  extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-bottom')).unit === 'auto' ||
                  !extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-bottom')).unit
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <Select
                        value={extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-bottom')).unit || '%'}
                        onChange={e => {
                          if (
                            e.target.value === 'max-content' ||
                            e.target.value === 'min-content' ||
                            e.target.value === 'fit-content' ||
                            e.target.value === 'auto'
                          ) {
                            UpdateData('#parent-input.margin-bottom', e.target.value)
                          } else {
                            UpdateData(
                              '#parent-input.margin-bottom',
                              extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-bottom')).value +
                                e.target.value
                            )
                          }
                        }}
                        displayEmpty
                        variant='standard'
                      >
                        <MenuItem value='px'>PX</MenuItem>
                        <MenuItem value='%'>%</MenuItem>
                        <MenuItem value='EM'>EM</MenuItem>
                        <MenuItem value='VW'>VW</MenuItem>
                        <MenuItem value='max-content'>Max-Content</MenuItem>
                        <MenuItem value='min-content'>Min-Content</MenuItem>
                        <MenuItem value='fit-content'>Fit-Content</MenuItem>
                        <MenuItem value='auto'>Auto</MenuItem>
                      </Select>
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                fullWidth
                type='number'
                value={extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-inline-start')).value || ''}
                onChange={e =>
                  UpdateData(
                    '#parent-input.margin-inline-start',
                    e.target.value + extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-inline-start')).unit
                  )
                }
                variant='filled'
                label={locale === 'ar' ? 'المسافة اليسرى' : 'Margin Left'}
                disabled={
                  extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-inline-start')).unit ===
                    'max-content' ||
                  extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-inline-start')).unit ===
                    'min-content' ||
                  extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-inline-start')).unit ===
                    'fit-content' ||
                  extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-inline-start')).unit === 'auto' ||
                  !extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-inline-start')).unit
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <Select
                        value={
                          extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-inline-start')).unit || '%'
                        }
                        onChange={e => {
                          if (
                            e.target.value === 'max-content' ||
                            e.target.value === 'min-content' ||
                            e.target.value === 'fit-content' ||
                            e.target.value === 'auto'
                          ) {
                            UpdateData('#parent-input.margin-inline-start', e.target.value)
                          } else {
                            UpdateData(
                              '#parent-input.margin-inline-start',
                              extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-inline-start')).value +
                                e.target.value
                            )
                          }
                        }}
                        displayEmpty
                        variant='standard'
                      >
                        <MenuItem value='px'>PX</MenuItem>
                        <MenuItem value='%'>%</MenuItem>
                        <MenuItem value='EM'>EM</MenuItem>
                        <MenuItem value='VW'>VW</MenuItem>
                        <MenuItem value='max-content'>Max-Content</MenuItem>
                        <MenuItem value='min-content'>Min-Content</MenuItem>
                        <MenuItem value='fit-content'>Fit-Content</MenuItem>
                        <MenuItem value='auto'>Auto</MenuItem>
                      </Select>
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                fullWidth
                type='number'
                value={extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-inline-end')).value || ''}
                onChange={e =>
                  UpdateData(
                    '#parent-input.margin-inline-end',
                    e.target.value + extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-inline-end')).unit
                  )
                }
                variant='filled'
                label={locale === 'ar' ? 'المسافة اليمنى' : 'Margin Right'}
                disabled={
                  extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-inline-end')).unit === 'max-content' ||
                  extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-inline-end')).unit === 'min-content' ||
                  extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-inline-end')).unit === 'fit-content' ||
                  extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-inline-end')).unit === 'auto' ||
                  !extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-inline-end')).unit
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <Select
                        value={extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-inline-end')).unit || '%'}
                        onChange={e => {
                          if (
                            e.target.value === 'max-content' ||
                            e.target.value === 'min-content' ||
                            e.target.value === 'fit-content' ||
                            e.target.value === 'auto'
                          ) {
                            UpdateData('#parent-input.margin-inline-end', e.target.value)
                          } else {
                            UpdateData(
                              '#parent-input.margin-inline-end',
                              extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-inline-end')).value +
                                e.target.value
                            )
                          }
                        }}
                        displayEmpty
                        variant='standard'
                      >
                        <MenuItem value='px'>PX</MenuItem>
                        <MenuItem value='%'>%</MenuItem>
                        <MenuItem value='EM'>EM</MenuItem>
                        <MenuItem value='VW'>VW</MenuItem>
                        <MenuItem value='max-content'>Max-Content</MenuItem>
                        <MenuItem value='min-content'>Min-Content</MenuItem>
                        <MenuItem value='fit-content'>Fit-Content</MenuItem>
                        <MenuItem value='auto'>Auto</MenuItem>
                      </Select>
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                fullWidth
                type='color'
                defaultChecked={
                  getDataInObject(
                    Css,
                    open.type === 'LongText' ? 'textarea.background-color' : 'input.background-color'
                  ) || '#575757'
                }
                defaultValue={
                  getDataInObject(
                    Css,
                    open.type === 'LongText' ? 'textarea.background-color' : 'input.background-color'
                  ) || '#575757'
                }
                onBlur={e =>
                  UpdateData(
                    open.type === 'LongText' ? 'textarea.background-color' : 'input.background-color',
                    e.target.value
                  )
                }
                label={locale === 'ar' ? 'اللون الخلفي' : 'Background Color'}
                variant='filled'
              />
              <TextField
                fullWidth
                type='color'
                defaultChecked={
                  getDataInObject(Css, open.type === 'LongText' ? 'textarea.color' : 'input.color') || '#575757'
                }
                defaultValue={
                  getDataInObject(Css, open.type === 'LongText' ? 'textarea.color' : 'input.color') || '#575757'
                }
                onBlur={e => UpdateData(open.type === 'LongText' ? 'textarea.color' : 'input.color', e.target.value)}
                label={locale === 'ar' ? 'اللون' : 'Color'}
                variant='filled'
              />
              <TextField
                fullWidth
                type='color'
                defaultChecked={
                  getDataInObject(Css, "label.color") || '#575757'
                }
                defaultValue={
                  getDataInObject(Css, "label.color") || '#575757'
                }
                onBlur={e => UpdateData("label.color", e.target.value)}
                label={locale === 'ar' ? 'لون التسمية' : 'Label Color'}
                variant='filled'
              />
            <div className="w-full ">
            <h2 className='mt-5 text-[#555] mb-3 font-bold'>
              {locale === 'ar' ? 'محرر CSS للحقل' : 'CSS Editor For Input'}
            </h2>
              <CssEditor data={data} onChange={onChange} Css={design} open={open} />
            </div>
            </div>
          )}
      </Box>
    </Drawer>
  )
}
