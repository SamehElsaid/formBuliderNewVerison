import { LoadingButton } from '@mui/lab'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField
} from '@mui/material'
import { useState } from 'react'
import { UnmountClosed } from 'react-collapse'

function Trigger({
  openTrigger,
  messages,
  locale,
  fields,
  data,
  onChange,
  open,
  setOpenTrigger,
  currentFields,
  parentFields,
  setParentKey,
  Css,
  objectToCss,
  roles,
  parentKey
}) {
  const steps = [messages.Input_Field, messages.Type_Of_Validation]
  const [activeStep, setActiveStep] = useState(0)
  const [selectedField, setSelectedField] = useState(null)
  const [mainValue, setMainValue] = useState('')
  const [triggerKey, setTriggerKey] = useState(null)
  const [typeOfValidation, setTypeOfValidation] = useState(null)
  const [isEqual, setIsEqual] = useState('equal')
  const [currentField, setCurrentField] = useState('Id')
  const [currentFieldTrigger, setCurrentFieldTrigger] = useState('Id')

  const handleBack = () => {
    if (activeStep === 1) {
      setTriggerKey(null)
      setParentKey(null)
      setSelectedField(null)
      setTypeOfValidation(null)
    }
    setActiveStep(prev => prev - 1)
  }

  const handleNext = () => {
    setActiveStep(prev => prev + 1)
  }

  const handleFinish = () => {
    const sendData = {
      selectedField,
      triggerKey: currentFieldTrigger,
      typeOfValidation,
      isEqual,
      currentField,
      mainValue,
      parentKey
    }

    const additional_fields = data.additional_fields ?? []
    const findMyInput = additional_fields.find(inp => inp.key === open.id)
    if (findMyInput) {
      findMyInput.roles.trigger = sendData
    } else {
      const myEdit = {
        key: open.id,
        design: objectToCss(Css).replaceAll('NaN', ''),
        roles: {
          ...roles,
          trigger: sendData
        }
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
    setCurrentField('Id')
    setCurrentFieldTrigger('Id')
    setIsEqual('equal')
    setMainValue('')
  }

  return (
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
                <InputLabel>{messages.Field}</InputLabel>
                <Select
                  variant='filled'
                  value={selectedField}
                  onChange={e => {
                    console.log(e.target.value)

                    const field = fields.find(field => field.key === e.target.value)
                    if (field.fieldCategory !== 'Basic') {
                      setTriggerKey(field.key)
                      if (field.type === 'OneToOne') {
                        setTriggerKey(field.options.source)
                      } else {
                        setTriggerKey(field.options.target)
                      }
                      setParentKey(field.type === 'OneToOne' ? field.options.source : field.options.target)
                    }
                    setSelectedField(e.target.value)
                  }}
                >
                  {console.log(fields, open)}
                  {fields
                    ?.filter(fil => fil.id !== open.id)
                    ?.map(field => (
                      <MenuItem key={field.key} value={field.key}>
                        {field?.[`name${locale === 'ar' ? 'Ar' : 'En'}`]}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </>
          )}
          {activeStep === 1 && (
            <>
              <FormControl fullWidth margin='normal'>
                <InputLabel>{messages.Type_Of_Validation}</InputLabel>
                <Select
                  variant='filled'
                  value={typeOfValidation}
                  onChange={e => {
                    console.log(e.target.value)

                    setTypeOfValidation(e.target.value)
                  }}
                >
                  {open.fieldCategory !== 'Basic' ||
                    (open.key !== 'tabs' && <MenuItem value={'filter'}>{messages.filter}</MenuItem>)}
                  <MenuItem value={'enable'} disabled={open.type === 'new_element'}>
                    {messages.enable}
                  </MenuItem>
                  <MenuItem value={'empty'} disabled={open.type === 'new_element'}>
                    {messages.empty}
                  </MenuItem>
                  <MenuItem value={'hidden'}>{messages.hidden}</MenuItem>
                  <MenuItem value={'visible'}>{messages.visible}</MenuItem>
                </Select>
                <UnmountClosed isOpened={Boolean(typeOfValidation === 'filter')}>
                  <div className='flex border-main-color border mt-2 rounded-md '>
                    <div className='w-full flex flex-col items-center justify-center capitalize text-sm px-2'>
                      {triggerKey ? (
                        <div className='w-full'>
                          {' '}
                          <h2 className='text-sm  capitalize'>
                            {triggerKey} {messages.Fields}
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
                            <MenuItem value={'Id'}>ID</MenuItem>
                          </Select>
                        </div>
                      ) : (
                        selectedField
                      )}
                    </div>
                    <div className='w-full py-2 px-1 border-x border-main-color'>
                      <h2 className='text-sm  capitalize'>
                        {open?.[`name${locale === 'ar' ? 'Ar' : 'En'}`]} {messages.Status}
                      </h2>
                      <Select
                        fullWidth
                        variant='filled'
                        value={isEqual}
                        onChange={e => {
                          setIsEqual(e.target.value)
                        }}
                      >
                        <MenuItem value={'equal'}>{messages.Equal}</MenuItem>
                        <MenuItem value={'notEqual'}>{messages.Not_Equal}</MenuItem>
                      </Select>
                    </div>
                    <div className='w-full flex flex-col items-center justify-center px-2'>
                      <div className='w-full'>
                        <h2 className='text-sm  capitalize'>
                          {open?.[`name${locale === 'ar' ? 'Ar' : 'En'}`]} {messages.Fields}
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
                          <MenuItem value={'Id'}>ID</MenuItem>
                          {currentFields.map(field => (
                            <MenuItem className='capitalize' key={field.key} value={field.key}>
                              {field?.[`name${locale === 'ar' ? 'Ar' : 'En'}`]}
                            </MenuItem>
                          ))}
                        </Select>
                      </div>
                    </div>
                  </div>
                </UnmountClosed>
                <UnmountClosed isOpened={Boolean(typeOfValidation && typeOfValidation !== 'filter')}>
                  <div className='flex border-main-color border mt-2 rounded-md '>
                    <div className='w-full flex flex-col items-center justify-center capitalize text-sm px-2'>
                      {triggerKey ? (
                        <div className='w-full'>
                          {' '}
                          <h2 className='text-sm  capitalize'>
                            {triggerKey} {messages.Fields}
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
                            <MenuItem value={'Id'}>ID</MenuItem>
                            {parentFields.map(field => (
                              <MenuItem className='capitalize' value={field.key} key={field.key}>
                                {field?.[`name${locale === 'ar' ? 'Ar' : 'En'}`]}
                              </MenuItem>
                            ))}
                          </Select>
                        </div>
                      ) : (
                        selectedField
                      )}
                    </div>
                    <div className='w-full py-2 px-1 border-x border-main-color'>
                      <h2 className='text-sm  capitalize'>
                        {open?.[`name${locale === 'ar' ? 'Ar' : 'En'}`]} {messages.Status}
                      </h2>
                      <Select
                        fullWidth
                        variant='filled'
                        value={isEqual}
                        onChange={e => {
                          setIsEqual(e.target.value)
                        }}
                      >
                        <MenuItem value={'equal'}>{messages.Equal}</MenuItem>
                        <MenuItem value={'notEqual'}>{messages.Not_Equal}</MenuItem>
                      </Select>
                    </div>

                    <div className='w-full flex flex-col items-center justify-center px-2'>
                      <div className='w-full'>
                        <h2 className='text-sm  capitalize'>{messages.Value}</h2>
                        <TextField
                          fullWidth
                          variant='filled'
                          value={mainValue}
                          onChange={e => setMainValue(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
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
  )
}

export default Trigger
