import { Icon } from '@iconify/react'
import {
  Box,
  Drawer,
  IconButton,
  InputAdornment,
  MenuItem,
  Button,
  ButtonGroup,
  Select,
  TextField,
  Typography,
  FormControl,
  DialogTitle,
  DialogActions,
  Dialog,
  DialogContent,
  Step,
  Stepper,
  StepLabel,
  InputLabel
} from '@mui/material'
import { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import { cssToObject, extractValueAndUnit, getDataInObject, objectToCss } from 'src/Components/_Shared'
import CssEditor from 'src/Components/FormCreation/PageCreation/CssEditor'
import { UnmountClosed } from 'react-collapse'
import { useIntl } from 'react-intl'
import { axiosGet } from 'src/Components/axiosCall'
import { LoadingButton } from '@mui/lab'
import IconifyIcon from 'src/Components/icon'
import JsEditor from 'src/Components/FormCreation/PageCreation/jsEditor'

const Header = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  padding: '20px 10px',
  justifyContent: 'space-between'
}))

export default function InputControlDesign({ open, handleClose, design, locale, data, onChange, roles, fields }) {
  const Css = cssToObject(design)
  const [activeStep, setActiveStep] = useState(0)
  const [steps, setSteps] = useState([
    locale === 'ar' ? 'حقل الإدخال' : 'Input Field',
    locale === 'ar' ? 'نوع التحقق' : 'Type Of Validation'
  ])
  const { messages } = useIntl()
  const [selected, setSelect] = useState('style')
  const [writeValue, setWriteValue] = useState(roles?.onMount?.value ?? '')
  const [openTrigger, setOpenTrigger] = useState(false)

  useEffect(() => {
    setWriteValue(roles?.onMount?.value ?? '')
  }, [roles])
  console.log(roles)

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

  const [selectedField, setSelectedField] = useState(null)
  const [triggerKey, setTriggerKey] = useState(null)
  const [typeOfValidation, setTypeOfValidation] = useState(null)
  const [isEqual, setIsEqual] = useState('equal')
  const [currentField, setCurrentField] = useState('id')
  const [currentFieldTrigger, setCurrentFieldTrigger] = useState('id')
  const [currentFields, setCurrentFields] = useState([])

  const handleBack = () => {
    setActiveStep(prev => prev - 1)
  }

  const handleNext = () => {
    setActiveStep(prev => prev + 1)
  }

  const handleFinish = () => {
    console.log({ selectedField, triggerKey, typeOfValidation, isEqual, currentField, currentFieldTrigger })
    const sendData = {
      selectedField,
      triggerKey,
      typeOfValidation,
      isEqual,
      currentField
    }
    const additional_fields = data.additional_fields ?? []
    const findMyInput = additional_fields.find(inp => inp.key === open.id)
    if (findMyInput) {
      findMyInput.roles.trigger = sendData
    } else {
      const myEdit = {
        key: open.id,
        design: objectToCss(Css).replaceAll('NaN', ''),
        roles: { trigger: data, onMount: { type: '', value: '' } }
      }
      additional_fields.push(myEdit)
    }
    onChange({ ...data, additional_fields: additional_fields })
    setOpenTrigger(false)
    resetForm()
  }

  const resetForm = () => {
    setActiveStep(0)
    setOpenTrigger(false)
    setSelectedField(null)
    setTriggerKey(null)
    setTypeOfValidation(null)
    setCurrentField('id')
    setCurrentFieldTrigger('id')
    setIsEqual('equal')
  }

  useEffect(() => {
    if (open && (open.type === 'OneToOne' || open.type === 'ManyToMany')) {
      try {
        axiosGet(
          `collections/get-by-key?key=${open.type === 'OneToOne' ? open.options.source : open.options.target}`,
          locale
        ).then(res => {
          if (res.status) {
            axiosGet(`collection-fields/get?CollectionId=${res.data.id}`, locale).then(res => {
              if (res.status) {
                setCurrentFields(res.data)
              }
            })
          }
        })
      } catch (error) {
        console.log(error)
      }
    }
  }, [open])

  const [showEvent, setShowEvent] = useState(false)
  const [showTrigger, setShowTrigger] = useState(false)

  return (
    <>
      <Dialog open={openTrigger} onClose={resetForm} fullWidth>
        <DialogTitle>{messages.createInput}</DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <div className='p-4 mt-5 rounded-md border border-dashed border-main-color'>
            {activeStep === 0 && (
              <>
                <FormControl fullWidth margin='normal'>
                  <InputLabel>{locale === 'ar' ? 'الحقل' : 'Field'}</InputLabel>
                  <Select
                    variant='filled'
                    value={selectedField}
                    onChange={e => {
                      const field = fields.find(field => field.key === e.target.value)
                      if (field.fieldCategory !== 'Basic') {
                        setTriggerKey(field.key)
                        if (field.type === 'OneToOne') {
                          setTriggerKey(field.options.source)
                        } else {
                          setTriggerKey(field.options.target)
                        }
                      }
                      setSelectedField(e.target.value)
                    }}
                  >
                    {fields
                      .filter(fil => fil.id !== open.id)
                      .map(field => (
                        <MenuItem key={field.key} value={field.key}>
                          {locale === 'ar' ? field.nameAr : field.nameEn}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </>
            )}
            {activeStep === 1 && (
              <>
                <FormControl fullWidth margin='normal'>
                  <InputLabel>{locale === 'ar' ? 'نوع التحقق' : 'Type Of Validation'}</InputLabel>
                  <Select
                    variant='filled'
                    value={typeOfValidation}
                    onChange={e => {
                      setTypeOfValidation(e.target.value)
                    }}
                  >
                    {open.fieldCategory !== 'Basic' && (
                      <MenuItem value={'filter'}>{locale === 'ar' ? 'تصفية' : 'Filter'}</MenuItem>
                    )}
                    <MenuItem value={'disable'}>{locale === 'ar' ? 'إيقاف' : 'Disable'}</MenuItem>
                    <MenuItem value={'enable'}>{locale === 'ar' ? 'تفعيل' : 'Enable'}</MenuItem>
                    <MenuItem value={'empty'}>{locale === 'ar' ? 'فارغ' : 'Empty'}</MenuItem>
                  </Select>
                  <UnmountClosed isOpened={Boolean(typeOfValidation === 'filter')}>
                    <div className='flex border-main-color border mt-2 rounded-md '>
                      <div className='w-full flex flex-col items-center justify-center capitalize text-sm px-2'>
                        {triggerKey ? (
                          <div className='w-full'>
                            {' '}
                            <h2 className='text-sm  capitalize'>
                              {triggerKey} {locale === 'ar' ? 'حقول ' : 'Fields '}
                            </h2>
                            <Select
                              fullWidth
                              variant='filled'
                              value={currentFieldTrigger}
                              className='capitalize'
                              onChange={e => {
                                setCurrentFieldTrigger(e.target.value)
                              }}
                            >
                              <MenuItem value={'id'}>{locale === 'ar' ? 'ID' : 'ID'}</MenuItem>
                            </Select>
                          </div>
                        ) : (
                          selectedField
                        )}
                      </div>
                      <div className='w-full py-2 px-1 border-x border-main-color'>
                        <h2 className='text-sm  capitalize'>
                          {locale === 'ar' ? open.nameAr : open.nameEn} {locale === 'ar' ? 'الحالة' : 'Status '}
                        </h2>
                        <Select
                          fullWidth
                          variant='filled'
                          value={isEqual}
                          onChange={e => {
                            setIsEqual(e.target.value)
                          }}
                        >
                          <MenuItem value={'equal'}>{locale === 'ar' ? 'مساوي' : 'Equal'}</MenuItem>
                          <MenuItem value={'notEqual'}>{locale === 'ar' ? 'غير مساوي' : 'Not Equal'}</MenuItem>
                        </Select>
                      </div>
                      <div className='w-full flex flex-col items-center justify-center px-2'>
                        <div className='w-full'>
                          <h2 className='text-sm  capitalize'>
                            {locale === 'ar' ? open.nameAr : open.nameEn} {locale === 'ar' ? 'حقول ' : 'Fields '}
                          </h2>
                          <Select
                            className='capitalize'
                            fullWidth
                            variant='filled'
                            value={currentField}
                            onChange={e => {
                              setCurrentField(e.target.value)
                            }}
                          >
                            <MenuItem value={'id'}>{locale === 'ar' ? 'ID' : 'ID'}</MenuItem>
                            {currentFields.map(field => (
                              <MenuItem className='capitalize' value={field.key}>
                                {locale === 'ar' ? field.nameAr : field.nameEn}
                              </MenuItem>
                            ))}
                          </Select>
                        </div>
                      </div>
                    </div>
                    {/* {selectedField && !triggerKey && (
                      <TextField
                        fullWidth
                        type='text'
                        value={writeValue}
                      />
                    )} */}
                  </UnmountClosed>
                </FormControl>
              </>
            )}
          </div>
        </DialogContent>

        <DialogActions>
          {activeStep > 0 && (
            <Button onClick={handleBack} variant='contained' color='warning'>
              {messages.back}
            </Button>
          )}
          {activeStep < steps.length - 1 && (
            <Button onClick={handleNext} variant='contained' color='primary'>
              {messages.next}
            </Button>
          )}
          {activeStep === steps.length - 1 && (
            <LoadingButton onClick={handleFinish} variant='contained' color='primary'>
              {messages.finish}
            </LoadingButton>
          )}
        </DialogActions>
      </Dialog>
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
          <div className='flex flex-col p-4 h-full'>
            <div className='flex || items-center || justify-center mb-5'>
              <ButtonGroup variant='outlined' color='primary'>
                <Button
                  variant={selected === 'style' ? 'contained' : 'outlined'}
                  onClick={() => {
                    setSelect('style')
                  }}
                >
                  {locale === 'ar' ? 'التنسيق' : 'Style'}
                </Button>
                <Button
                  onClick={() => {
                    setSelect('roles')
                  }}
                  variant={selected === 'roles' ? 'contained' : 'outlined'}
                >
                  {locale === 'ar' ? 'الصلاحيات' : 'Roles'}
                </Button>
              </ButtonGroup>
            </div>
            {open && (
              <div className='flex flex-col gap-2 py-5'>
                <UnmountClosed isOpened={Boolean(selected === 'style')}>
                  <>
                    {(open.type === 'SingleText' ||
                      open.type === 'Number' ||
                      open.type === 'Phone' ||
                      open.type === 'URL' ||
                      open.type === 'Email' ||
                      open.type === 'Password' ||
                      open.type === 'LongText') && (
                      <>
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
                                        extractValueAndUnit(getDataInObject(Css, '#parent-input.width')).value +
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
                          value={
                            extractValueAndUnit(
                              getDataInObject(Css, open.type === 'LongText' ? 'textarea.height' : 'input.height')
                            ).value || ''
                          }
                          onChange={e =>
                            UpdateData(
                              open.type === 'LongText' ? 'textarea.height' : 'input.height',
                              e.target.value +
                                extractValueAndUnit(
                                  getDataInObject(Css, open.type === 'LongText' ? 'textarea.height' : 'input.height')
                                ).unit
                            )
                          }
                          variant='filled'
                          label={locale === 'ar' ? 'الطول' : 'Height'}
                          disabled={
                            extractValueAndUnit(
                              getDataInObject(Css, open.type === 'LongText' ? 'textarea.height' : 'input.height')
                            ).unit === 'max-content' ||
                            extractValueAndUnit(
                              getDataInObject(Css, open.type === 'LongText' ? 'textarea.height' : 'input.height')
                            ).unit === 'min-content' ||
                            extractValueAndUnit(
                              getDataInObject(Css, open.type === 'LongText' ? 'textarea.height' : 'input.height')
                            ).unit === 'fit-content' ||
                            extractValueAndUnit(
                              getDataInObject(Css, open.type === 'LongText' ? 'textarea.height' : 'input.height')
                            ).unit === 'auto' ||
                            !extractValueAndUnit(
                              getDataInObject(Css, open.type === 'LongText' ? 'textarea.height' : 'input.height')
                            ).unit
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                <Select
                                  value={
                                    extractValueAndUnit(
                                      getDataInObject(
                                        Css,
                                        open.type === 'LongText' ? 'textarea.height' : 'input.height'
                                      )
                                    ).unit || '%'
                                  }
                                  onChange={e => {
                                    if (
                                      e.target.value === 'max-content' ||
                                      e.target.value === 'min-content' ||
                                      e.target.value === 'fit-content' ||
                                      e.target.value === 'auto'
                                    ) {
                                      UpdateData(
                                        open.type === 'LongText' ? 'textarea.height' : 'input.height',
                                        e.target.value
                                      )
                                    } else {
                                      UpdateData(
                                        open.type === 'LongText' ? 'textarea.height' : 'input.height',
                                        extractValueAndUnit(
                                          getDataInObject(
                                            Css,
                                            open.type === 'LongText' ? 'textarea.height' : 'input.height'
                                          )
                                        ).value + e.target.value
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
                              e.target.value +
                                extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-top')).unit
                            )
                          }
                          variant='filled'
                          label={locale === 'ar' ? 'المسافة العلوية' : 'Margin Top'}
                          disabled={
                            extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-top')).unit ===
                              'max-content' ||
                            extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-top')).unit ===
                              'min-content' ||
                            extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-top')).unit ===
                              'fit-content' ||
                            extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-top')).unit === 'auto' ||
                            !extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-top')).unit
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                <Select
                                  value={
                                    extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-top')).unit || '%'
                                  }
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
                              e.target.value +
                                extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-bottom')).unit
                            )
                          }
                          variant='filled'
                          label={locale === 'ar' ? 'المسافة السفلية' : 'Margin Bottom'}
                          disabled={
                            extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-bottom')).unit ===
                              'max-content' ||
                            extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-bottom')).unit ===
                              'min-content' ||
                            extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-bottom')).unit ===
                              'fit-content' ||
                            extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-bottom')).unit === 'auto' ||
                            !extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-bottom')).unit
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                <Select
                                  value={
                                    extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-bottom')).unit || '%'
                                  }
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
                          value={
                            extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-inline-start')).value || ''
                          }
                          onChange={e =>
                            UpdateData(
                              '#parent-input.margin-inline-start',
                              e.target.value +
                                extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-inline-start')).unit
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
                            extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-inline-start')).unit ===
                              'auto' ||
                            !extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-inline-start')).unit
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                <Select
                                  value={
                                    extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-inline-start'))
                                      .unit || '%'
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
                                        extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-inline-start'))
                                          .value + e.target.value
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
                          value={
                            extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-inline-end')).value || ''
                          }
                          onChange={e =>
                            UpdateData(
                              '#parent-input.margin-inline-end',
                              e.target.value +
                                extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-inline-end')).unit
                            )
                          }
                          variant='filled'
                          label={locale === 'ar' ? 'المسافة اليمنى' : 'Margin Right'}
                          disabled={
                            extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-inline-end')).unit ===
                              'max-content' ||
                            extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-inline-end')).unit ===
                              'min-content' ||
                            extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-inline-end')).unit ===
                              'fit-content' ||
                            extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-inline-end')).unit ===
                              'auto' ||
                            !extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-inline-end')).unit
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                <Select
                                  value={
                                    extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-inline-end')).unit ||
                                    '%'
                                  }
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
                                        extractValueAndUnit(getDataInObject(Css, '#parent-input.margin-inline-end'))
                                          .value + e.target.value
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
                            getDataInObject(Css, open.type === 'LongText' ? 'textarea.color' : 'input.color') ||
                            '#575757'
                          }
                          defaultValue={
                            getDataInObject(Css, open.type === 'LongText' ? 'textarea.color' : 'input.color') ||
                            '#575757'
                          }
                          onBlur={e =>
                            UpdateData(open.type === 'LongText' ? 'textarea.color' : 'input.color', e.target.value)
                          }
                          label={locale === 'ar' ? 'اللون' : 'Color'}
                          variant='filled'
                        />
                        <TextField
                          fullWidth
                          type='color'
                          defaultChecked={getDataInObject(Css, 'label.color') || '#575757'}
                          defaultValue={getDataInObject(Css, 'label.color') || '#575757'}
                          onBlur={e => UpdateData('label.color', e.target.value)}
                          label={locale === 'ar' ? 'لون التسمية' : 'Label Color'}
                          variant='filled'
                        />
                      </>
                    )}
                    <div className='w-full'>
                      <h2 className='mt-5 text-[#555] mb-3 font-bold'>
                        {locale === 'ar' ? 'محرر CSS للحقل' : 'CSS Editor For Input'}
                      </h2>
                      <CssEditor data={data} onChange={onChange} Css={design} open={open} />
                    </div>
                  </>
                </UnmountClosed>
                <UnmountClosed isOpened={Boolean(selected === 'roles')}>
                  <div>
                    <div className='border-2 border-main-color  rounded-md '>
                      <h2
                        onClick={() => setShowEvent(!showEvent)}
                        className='text-lg font-bold bg-main-color cursor-pointer select-none text-white py-1 text-center px-2 flex items-center justify-between'
                      >
                        <IconButton>
                          <IconifyIcon
                            className='text-white opacity-0'
                            icon={showEvent ? 'mdi:chevron-up' : 'mdi:chevron-down'}
                          />
                        </IconButton>
                        {locale === 'ar' ? 'الأحداث' : 'Events'}
                        <IconButton>
                          <IconifyIcon
                            className='text-white'
                            icon={showEvent ? 'mdi:chevron-up' : 'mdi:chevron-down'}
                          />
                        </IconButton>
                      </h2>
                      <UnmountClosed isOpened={Boolean(showEvent)}>
                        <div className='px-2 pb-2'>
                          <h2 className='text-lg font-bold text-main-color mt-2'>
                            {locale === 'ar' ? 'في البداية' : 'OnMount'}
                          </h2>
                          <FormControl fullWidth margin='normal'>
                            <InputLabel>{locale === 'ar' ? 'الحالة' : 'State'}</InputLabel>
                            <Select
                              variant='filled'
                              value={roles.onMount.type}
                              onChange={e => {
                                const additional_fields = data.additional_fields ?? []
                                const findMyInput = additional_fields.find(inp => inp.key === open.id)
                                if (findMyInput) {
                                  findMyInput.roles.onMount.type = e.target.value
                                } else {
                                  const myEdit = {
                                    key: open.id,
                                    design: objectToCss(Css).replaceAll('NaN', ''),
                                    roles: {
                                      onMount: { type: e.target.value, value: '' },
                                      trigger: {
                                        selectedField: null,
                                        triggerKey: null,
                                        typeOfValidation: null,
                                        isEqual: 'equal',
                                        currentField: 'id',
                                        currentFieldTrigger: null
                                      }
                                    },
                                    event: {}
                                  }
                                  additional_fields.push(myEdit)
                                }
                                onChange({ ...data, additional_fields: additional_fields })
                              }}
                            >
                              <MenuItem selected disabled value={'empty Data'}>
                                {locale === 'ar' ? 'فارغ' : 'Empty Data'}
                              </MenuItem>
                              <MenuItem value={'disable'}>{locale === 'ar' ? 'معطل' : 'Disable'}</MenuItem>
                              {open.type !== 'OneToOne' && open.type !== 'ManyToMany' && (
                                <MenuItem value={'write Data'}>
                                  {locale === 'ar' ? 'اضافة قيمة' : 'Write Value'}
                                </MenuItem>
                              )}
                            </Select>
                            <UnmountClosed isOpened={Boolean(roles.onMount.type === 'write Data')}>
                              {console.log(currentField)}
                              <TextField
                                fullWidth
                                type='text'
                                value={writeValue}
                                variant='filled'
                                label={locale === 'ar' ? 'القيمة' : 'Value'}
                                onChange={e => {
                                  setWriteValue(e.target.value)
                                }}
                                onBlur={e => {
                                  const additional_fields = data.additional_fields ?? []
                                  const findMyInput = additional_fields.find(inp => inp.key === open.id)
                                  if (findMyInput) {
                                    findMyInput.roles.onMount.value = e.target.value
                                  }
                                }}
                              />
                            </UnmountClosed>
                          </FormControl>
                          <div className='border-t-2 border-dashed border-main-color pt-2'>
                            <h2 className='text-lg font-bold text-main-color mt-2'>
                              {locale === 'ar' ? 'في التغيير' : 'OnChange'}
                            </h2>
                            <JsEditor
                              jsCode={roles?.event?.onChange ?? ''}
                              onChange={onChange}
                              data={data}
                              open={open}
                              Css={Css}
                            />
                          </div>{' '}
                          <div className='border-t-2 border-dashed border-main-color pt-2'>
                            <h2 className='text-lg font-bold text-main-color mt-2'>
                              {locale === 'ar' ? 'في الخروج' : 'OnBlur'}
                            </h2>
                            <JsEditor
                              type='onBlur'
                              jsCode={roles?.event?.onBlur ?? ''}
                              onChange={onChange}
                              data={data}
                              open={open}
                              Css={Css}
                            />
                          </div>
                          <div className='border-t-2 border-dashed border-main-color pt-2'>
                            <h2 className='text-lg font-bold text-main-color mt-2'>
                              {locale === 'ar' ? 'في الخروج من الصفحة' : 'OnUnmount'}
                            </h2>
                            <JsEditor
                              type='onUnmount'
                              jsCode={roles?.event?.onUnmount ?? ''}
                              onChange={onChange}
                              data={data}
                              open={open}
                              Css={Css}
                            />
                          </div>
                        </div>
                      </UnmountClosed>
                    </div>
                    <div className='border-2 mt-2 border-main-color  rounded-md '>
                      <h2
                        onClick={() => setShowTrigger(!showTrigger)}
                        className='text-lg font-bold bg-main-color cursor-pointer select-none text-white py-1 text-center px-2 flex items-center justify-between'
                      >
                        <IconButton>
                          <IconifyIcon
                            className='text-white opacity-0'
                            icon={showTrigger ? 'mdi:chevron-up' : 'mdi:chevron-down'}
                          />
                        </IconButton>
                        {locale === 'ar' ? 'متابعات' : 'Triggers'}
                        <IconButton>
                          <IconifyIcon
                            className='text-white'
                            icon={showTrigger ? 'mdi:chevron-up' : 'mdi:chevron-down'}
                          />
                        </IconButton>
                      </h2>
                      <UnmountClosed isOpened={Boolean(showTrigger)}>
                        <div className=''>
                          <div className='flex flex-col gap-2 justify-center items-center py-2 '>
                            <Button
                              onClick={() => {
                                setOpenTrigger(true)
                              }}
                              variant='contained'
                              color='primary'
                            >
                              {locale === 'ar' ? 'اضافة متابعة' : 'Add Trigger'}
                            </Button>
                          </div>
                        </div>
                      </UnmountClosed>
                    </div>
                  </div>
                </UnmountClosed>
              </div>
            )}
          </div>
        </Box>
      </Drawer>
    </>
  )
}
