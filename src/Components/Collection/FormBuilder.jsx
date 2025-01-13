import React, { useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  InputAdornment,
  FormLabel,
  RadioGroup,
  Radio,
  CircularProgress,
  Autocomplete,
  Box
} from '@mui/material'
import { Add, Delete } from '@mui/icons-material'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import { LoadingButton } from '@mui/lab'
import PhoneInput from 'react-phone-number-input'
import { Icon } from '@iconify/react'
import { axiosGet, axiosPost, UrlTranAr, UrlTranEn } from '../axiosCall'
import Collapse from '@kunukn/react-collapse'
import { getType } from '../_Shared'

const FormBuilder = ({ open, setOpen }) => {
  const [activeStep, setActiveStep] = useState(0)
  const [fieldType, setFieldType] = useState('')
  const [fieldLabel, setFieldLabel] = useState('')
  const [fieldLabelEn, setFieldLabelEn] = useState('')
  const [key, setKey] = useState('')
  const [defaultCountry, setDefaultCountry] = useState('EG')
  const [optionType, setOptionType] = useState('option')

  const [validations, setValidations] = useState({
    required: false,
    includeCamelCase: false,
    includeLowerCase: false,
    onlyText: false,
    onlyNumbers: false,
    minLength: '',
    maxLength: ''
  })
  const [options, setOptions] = useState([])
  const [newOption, setNewOption] = useState('')
  const [newOptionEn, setNewOptionEn] = useState('')
  const [fileExtensions, setFileExtensions] = useState([])

  const steps = ['Select_Field_Type', 'Enter_Label', 'Validation', 'Setup']

  const fieldTypes = [
    'text',
    'password',
    'textarea',
    'checkbox',
    'radio',
    'select',
    'date',
    'number',
    'file',
    'email',
    'url',
    'tel'
  ]

  const fileTypes = [
    // Images
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.bmp',
    '.svg',
    '.tiff',
    '.webp',

    // Documents
    '.pdf',
    '.doc',
    '.docx',
    '.txt',
    '.rtf',
    '.odt',
    '.tex',

    // Spreadsheets
    '.xls',
    '.xlsx',
    '.csv',
    '.ods',

    // Presentations
    '.ppt',
    '.pptx',
    '.odp',

    // Audio
    '.mp3',
    '.wav',
    '.ogg',
    '.m4a',
    '.aac',
    '.flac',

    // Video
    '.mp4',
    '.mov',
    '.wmv',
    '.avi',
    '.mkv',
    '.flv',
    '.webm',
    '.3gp',

    // Archives
    '.zip',
    '.rar',
    '.7z',
    '.tar',
    '.gz',
    '.bz2',

    // Code
    '.html',
    '.css',
    '.js',
    '.jsx',
    '.ts',
    '.tsx',
    '.json',
    '.xml',
    '.yaml',
    '.yml',
    '.py',
    '.java',
    '.c',
    '.cpp',
    '.cs',
    '.php',
    '.rb',
    '.go',
    '.sh',
    '.bat',

    // Fonts
    '.ttf',
    '.otf',
    '.woff',
    '.woff2',

    // Other
    '.iso',
    '.dmg',
    '.exe',
    '.apk',
    '.bin',
    '.dll',
    '.icns',
    '.ico'
  ]

  const isOptionsStep = ['checkbox', 'radio', 'select'].includes(fieldType)
  const isFileStep = fieldType === 'file'
  const { messages, locale } = useIntl()

  const handleNext = () => {
    if (activeStep === 0 && !fieldType) return toast.error(messages.please_select_field_type)
    if (activeStep === 1 && (!fieldLabel || !fieldLabelEn || !key)) return toast.error(messages.please_enter_label)
    if (activeStep === 2 && !isOptionsStep && !isFileStep) {
      setActiveStep(steps.length - 1) // Skip the setup step if not required
    } else {
      setActiveStep(prevActiveStep => prevActiveStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }
  const [loading, setLoading] = useState(false)

  const handleAddOption = () => {
    if (newOption.trim() && newOptionEn.trim()) {
      setOptions([...options, { label: newOption, label_en: newOptionEn }])
      setNewOption('')
      setNewOptionEn('')
    }
  }

  const handleDeleteOption = index => {
    setOptions(options.filter((_, i) => i !== index))
  }

  const handleToggleFileExtension = extension => {
    if (fileExtensions.includes(extension)) {
      setFileExtensions(fileExtensions.filter(ext => ext !== extension))
    } else {
      setFileExtensions([...fileExtensions, extension])
    }
  }

  const [optionsCollection, setOptionsCollection] = useState([])
  const [loadingCollection, setLoadingCollection] = useState(false)
  const [collection, setCollection] = useState('')
  const [valueCollection, setValueCollection] = useState('')
  const [selectedOptions, setSelectedOptions] = useState([])

  useEffect(() => {
    setLoadingCollection(true)
    axiosGet(`collections/get/?dataSourceId=ba3b7965-7d38-4d91-a147-feff4e23c69c`, locale)
      .then(res => {
        if (res.status) {
          setOptionsCollection(res.data)
        }
      })
      .finally(() => {
        setLoadingCollection(false)
      })
  }, [locale])

  const handleChange = event => {
    const { value, checked } = event.target
    setSelectedOptions(prevSelected =>
      checked ? [...prevSelected, value] : prevSelected.filter(item => item !== value)
    )
  }

  const handleInputChange = async (event, value) => {
    console.log(value)
    if (!value) {
      setValueCollection('')
    }
    setValueCollection(value)

    try {
      const res = await axiosGet(`collections/get/?dataSourceId=ba3b7965-7d38-4d91-a147-feff4e23c69c`, locale)
      if (res.status) {
        setOptionsCollection(res.data)
      }
    } finally {
      setLoadingCollection(false)
    }
  }

  const resetForm = () => {
    setOpen(false)
    setActiveStep(0)
    setFieldType('')
    setFieldLabel('')
    setFieldLabelEn('')
    setDefaultCountry('EG')
    setKey('')
    setValidations({
      required: false,
      includeCamelCase: false,
      includeLowerCase: false,
      onlyText: false,
      onlyNumbers: false,
      minLength: '',
      maxLength: ''
    })
    setOptions([])
    setNewOption('')
    setNewOptionEn('')
    setFileExtensions([])
    setDefaultCountry('EG')
    setValueCollection('')
    setSelectedOptions([])
    setOptionsCollection([])
    setCollection('')
    setOptionType('option')
    setLoadingCollection(false)
  }

  const FindFieldCategory = fieldType => {
    if (fieldType === 'select' || fieldType === 'radio' || fieldType === 'checkbox') {
      return 'Associations'
    }

    return 'Basic'
  }

  const handleFinish = () => {
    if (optionType === 'link') {
      if (!valueCollection || !selectedOptions.length) return toast.error(messages.please_enter_label)
    }

    // setLoading(true)

    const Data = {
      options: isOptionsStep ? options : [],
      allowedFileTypes: isFileStep ? fileExtensions : []
    }

    const validationData = []
    if (validations.required) {
      validationData.push({ RuleType: 'Required', Parameters: {} })
    }

    // if (validations.includeCamelCase) {
    //   validationData.push({ RuleType: 'IncludeCamelCase', Parameters: {} })
    // }
    // if (validations.includeLowerCase) {
    //   validationData.push({ RuleType: 'IncludeLowerCase', Parameters: {} })
    // }
    // if (validations.onlyNumbers) {
    //   validationData.push({ "RuleType": "onlyNumbers", "Parameters": {} })
    // }
    // if (validations.onlyText) {
    //   validationData.push({ "RuleType": "onlyText", "Parameters": {} })
    // }
    if (validations.maxLength) {
      validationData.push({ RuleType: 'MaxLength', Parameters: { maxLength: validations.maxLength } })
    }
    if (validations.minLength) {
      validationData.push({ RuleType: 'MinLength', Parameters: { minLength: validations.minLength } })
    }

    if (fieldType === 'url') {
      validationData.push({ RuleType: 'Url', Parameters: {} })
    }
    if (fieldType === 'email') {
      validationData.push({ RuleType: 'Email', Parameters: {} })
    }
    if (fieldType === 'date') {
      validationData.push({ RuleType: 'ColumnDataType', Parameters: { expectedType: 'System.DateTime' } })
    }
    if (fieldType === 'number') {
      validationData.push({ RuleType: 'ColumnDataType', Parameters: { expectedType: 'System.number' } })
    }

    const sendData = {
      collectionId: open,
      key: key,
      nameAr: fieldLabel,
      nameEn: fieldLabelEn,
      descriptionAr: fieldLabel,
      descriptionEn: fieldLabelEn,
      type: getType(fieldType),
      uiSchema: {
        fileType: isFileStep ? fileExtensions : []
      },
      FieldCategory: FindFieldCategory(fieldType),
      options: {
        defaultValue: fieldType === 'tel' ? defaultCountry : ''
      },
      validationData
    }

    if (fieldType === 'select' || fieldType === 'radio' || fieldType === 'checkbox') {
      sendData.options.foreignKey = key + 'id'
      sendData.options.source = collection.key
      sendData.options.sourceKey = valueCollection
    }

    console.log(sendData, selectedOptions)
    axiosPost('collection-fields/configure-fields', locale, sendData)
      .then(res => {
        if (res.status) {
          toast.success(locale === 'ar' ? 'تم إضافة الحقل بنجاح' : 'Field added successfully')

          resetForm()
        }
      })
      .finally(_ => {
        setLoading(false)
      })

    // if (optionType === 'link') {
    //   console.log('link')
    //   Data.linkCollection = collection
    //   Data.valueCollection = valueCollection
    //   Data.selectedValue = selectedOptions
    // }
    // setDataFormBuilder(prev => [...prev, Data])
    // setTimeout(() => {
    //   setLoading(false)
    //   resetForm()
    // }, 100)
  }

  return (
    <div>
      <Dialog open={open} onClose={resetForm} fullWidth>
        <DialogTitle>{messages.createInput}</DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{messages[label]}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <div className='p-4 mt-5 rounded-md border border-dashed border-main-color'>
            {/* Step 1: Select Field Type */}
            {activeStep === 0 && (
              <FormControl fullWidth margin='normal'>
                <InputLabel>{messages.Field_Type}</InputLabel>
                <Select variant='filled' value={fieldType} onChange={e => setFieldType(e.target.value)}>
                  {fieldTypes.map(type => (
                    <MenuItem key={type} value={type}>
                      {messages[type]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {/* Step 2: Enter Label */}
            {activeStep === 1 && (
              <>
                <TextField
                  label={messages.filed_name_ar}
                  fullWidth
                  margin='normal'
                  value={fieldLabel}
                  onChange={e => setFieldLabel(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position='end'
                        onClick={async () => {
                          const loading = toast.loading(locale === 'ar' ? 'يتم الترجمه' : 'Translating')
                          const res = await UrlTranAr(fieldLabel)
                          setFieldLabelEn(res)
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
                <TextField
                  label={messages.filed_name_en}
                  fullWidth
                  margin='normal'
                  value={fieldLabelEn}
                  onChange={e => setFieldLabelEn(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position='end'
                        onClick={async () => {
                          const loading = toast.loading(locale === 'ar' ? 'يتم الترجمه' : 'Translating')
                          const res = await UrlTranEn(fieldLabelEn)
                          setFieldLabel(res)
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
                <TextField
                  label={messages.keyName}
                  fullWidth
                  margin='normal'
                  value={key}
                  onChange={e => setKey(e.target.value)}
                />
              </>
            )}

            {/* Step 3: Validation */}

            {activeStep === 2 && (
              <div>
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled={fieldType === 'radio'}
                      checked={validations.required}
                      onChange={e =>
                        setValidations({
                          ...validations,
                          required: e.target.checked
                        })
                      }
                    />
                  }
                  label={messages.Required}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled={
                        fieldType === 'checkbox' ||
                        fieldType === 'radio' ||
                        fieldType === 'select' ||
                        fieldType === 'date' ||
                        fieldType === 'number' ||
                        fieldType === 'file' ||
                        fieldType === 'email' ||
                        fieldType === 'url' ||
                        fieldType === 'tel'
                      }
                      checked={validations.includeCamelCase}
                      onChange={e =>
                        setValidations({
                          ...validations,
                          includeCamelCase: e.target.checked
                        })
                      }
                    />
                  }
                  label={messages.Include_Camel_Case}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={validations.includeLowerCase}
                      disabled={
                        fieldType === 'checkbox' ||
                        fieldType === 'radio' ||
                        fieldType === 'select' ||
                        fieldType === 'date' ||
                        fieldType === 'number' ||
                        fieldType === 'file' ||
                        fieldType === 'email' ||
                        fieldType === 'url' ||
                        fieldType === 'tel'
                      }
                      onChange={e =>
                        setValidations({
                          ...validations,
                          includeLowerCase: e.target.checked
                        })
                      }
                    />
                  }
                  label={messages.Include_Lower_Case}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled={
                        fieldType === 'checkbox' ||
                        fieldType === 'radio' ||
                        fieldType === 'select' ||
                        fieldType === 'date' ||
                        fieldType === 'number' ||
                        fieldType === 'file' ||
                        fieldType === 'email' ||
                        fieldType === 'url' ||
                        fieldType === 'tel'
                      }
                      checked={validations.onlyText}
                      onChange={e =>
                        setValidations({
                          ...validations,
                          onlyText: e.target.checked
                        })
                      }
                    />
                  }
                  label={messages.Only_Text}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled={
                        fieldType === 'checkbox' ||
                        fieldType === 'radio' ||
                        fieldType === 'select' ||
                        fieldType === 'date' ||
                        fieldType === 'file' ||
                        fieldType === 'email' ||
                        fieldType === 'url' ||
                        fieldType === 'tel'
                      }
                      checked={validations.onlyNumbers || fieldType === 'number'}
                      onChange={e =>
                        setValidations({
                          ...validations,
                          onlyNumbers: e.target.checked
                        })
                      }
                    />
                  }
                  label={messages.Only_Numbers}
                />
                <TextField
                  label={messages.Min_Length}
                  disabled={
                    fieldType === 'checkbox' ||
                    fieldType === 'radio' ||
                    fieldType === 'select' ||
                    fieldType === 'date' ||
                    fieldType === 'file' ||
                    fieldType === 'email' ||
                    fieldType === 'tel'
                  }
                  type='number'
                  fullWidth
                  margin='normal'
                  value={validations.minLength}
                  onChange={e =>
                    setValidations({
                      ...validations,
                      minLength: e.target.value
                    })
                  }
                />
                <TextField
                  label={messages.Max_Length}
                  disabled={
                    fieldType === 'checkbox' ||
                    fieldType === 'radio' ||
                    fieldType === 'select' ||
                    fieldType === 'date' ||
                    fieldType === 'file' ||
                    fieldType === 'tel'
                  }
                  type='number'
                  fullWidth
                  margin='normal'
                  value={validations.maxLength}
                  onChange={e =>
                    setValidations({
                      ...validations,
                      maxLength: e.target.value
                    })
                  }
                />
              </div>
            )}

            {/* Step 4: Setup Options (Checkbox, Radio, Select) */}
            {activeStep === 3 && isOptionsStep && (
              <>
                <div className='mt-4'></div>
                <Autocomplete
                  options={loadingCollection ? [] : optionsCollection}
                  getOptionLabel={option => (locale === 'ar' ? option.nameAr : option.nameEn) || ''}
                  loading={loadingCollection}
                  onInputChange={handleInputChange}
                  value={collection}
                  onChange={(e, value) => {
                    setCollection(value)
                    setValueCollection('')
                    setSelectedOptions([])
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label={messages.Select_Collection}
                      variant='outlined'
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingCollection ? <CircularProgress size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        )
                      }}
                    />
                  )}
                  renderOption={(props, option) =>
                    option.nameEn !== collection?.nameEn ? (
                      <Box sx={{ direction: locale === 'ar' ? 'rtl' : '' }} component='li' {...props}>
                        {locale === 'ar' ? option.nameAr : option.nameEn}
                      </Box>
                    ) : null
                  }
                />
                <Collapse transition={`height 300ms cubic-bezier(.4, 0, .2, 1)`} isOpen={Boolean(collection?.nameEn)}>
                  <div className='px-4 mt-4'>
                    <FormControl component='fieldset' fullWidth>
                      <FormLabel component='legend'>{messages.collection_Relying_on}</FormLabel>
                      <RadioGroup
                        fullWidth
                        className='!flex !flex-row !flex-wrap gap-2'
                        value={valueCollection}
                        onChange={e => setValueCollection(e.target.value)}
                      >
                        {collection &&
                          Object?.keys(collection)?.map(
                            key =>
                              typeof collection[key] !== 'object' && (
                                <FormControlLabel
                                  key={key}
                                  className='!w-fit capitalize'
                                  value={key}
                                  control={<Radio />}
                                  label={key.replace('_', ' ')}
                                />
                              )
                          )}
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <div className='px-4 mt-4'>
                    <FormControl component='fieldset' fullWidth>
                      <FormLabel component='legend'>{messages.View_Value}</FormLabel>
                      <div className='!flex !flex-row !flex-wrap gap-2'>
                        {collection &&
                          Object?.keys(collection)?.map(
                            key =>
                              typeof collection[key] !== 'object' && (
                                <FormControlLabel
                                  key={key}
                                  className='!w-fit capitalize'
                                  control={
                                    <Checkbox
                                      value={key}
                                      checked={selectedOptions.includes(key)}
                                      onChange={handleChange}
                                    />
                                  }
                                  label={key.replace('_', ' ')}
                                />
                              )
                          )}
                      </div>
                    </FormControl>
                  </div>

                  {/* <FormControl fullWidth margin='normal'>
                    <InputLabel>{messages.Select_Collection}</InputLabel>
                    <Select
                      fullWidth
                      variant='filled'
                      value={linkCollection}
                      onChange={e => setLinkCollection(e.target.value)}
                    >
                      <MenuItem value=''>{messages.Select_Collection}</MenuItem>
                    </Select>
                  </FormControl> */}
                </Collapse>
              </>
            )}

            {/* Step 4: File Extensions Setup */}
            {activeStep === 3 && isFileStep && (
              <div>
                <h4>{messages.Select_Allowed_File_Types}:</h4>
                <Grid container spacing={2}>
                  {fileTypes.map(type => (
                    <Grid item xs={4} key={type}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={fileExtensions.includes(type)}
                            onChange={() => handleToggleFileExtension(type)}
                          />
                        }
                        label={type}
                      />
                    </Grid>
                  ))}
                </Grid>
              </div>
            )}
            {activeStep === 3 && fieldType === 'tel' && (
              <div className='min-h-[100px] flex items-center justify-center text-main-color'>
                <h4>{messages.Select_Default_Country}</h4>
                <PhoneInput
                  defaultCountry={defaultCountry ?? 'EG'}
                  className={`phoneNumber`}
                  placeholder='123-456-7890'
                  value={''}
                  onCountryChange={e => setDefaultCountry(e)}
                  onChange={e => {}}
                />
              </div>
            )}
            {activeStep === 3 && !isOptionsStep && !isFileStep && fieldType !== 'tel' && (
              <div className='min-h-[100px] flex items-center justify-center text-main-color'>
                <h4>{messages.setup_Done}</h4>
              </div>
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
            <LoadingButton loading={loading} onClick={handleFinish} variant='contained' color='primary'>
              {messages.finish}
            </LoadingButton>
          )}
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default FormBuilder
