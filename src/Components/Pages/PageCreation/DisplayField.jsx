import { useState, useEffect, useMemo, forwardRef, useRef } from 'react'
import { FormLabel, IconButton, InputAdornment } from '@mui/material'
import { useIntl } from 'react-intl'
import { isPossiblePhoneNumber } from 'react-phone-number-input'
import DatePicker from 'react-datepicker'
import ar from 'date-fns/locale/ar-EG'
import en from 'date-fns/locale/en-US'
import { axiosGet } from 'src/Components/axiosCall'
import { Icon } from '@iconify/react'
import Collapse from '@kunukn/react-collapse'
import { BsPaperclip, BsTrash } from 'react-icons/bs'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { FaCalendarAlt } from 'react-icons/fa'
import { data } from 'autoprefixer'

export default function DisplayField({
  input,
  dirtyProps,
  reload,
  refError,
  dataRef,
  errorView,
  onChangeData,
  setLayout,
  setTriggerData,
  findError,
  data,
  readOnly,
  findValue,
  roles,
  layout,
  design,
  triggerData
}) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [dirty, setDirty] = useState(dirtyProps)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { locale } = useIntl()
  const [validations, setValidations] = useState({})
  const [selectedOptions, setSelectedOptions] = useState([])
  const [oldSelectedOptions, setOldSelectedOptions] = useState([])
  const xComponentProps = useMemo(() => input?.options?.uiSchema?.xComponentProps ?? {}, [input])
  const [fileName, setFile] = useState('')

  const formatDate = (value, format) => {
    const date = new Date(value)

    const year = date.getFullYear()

    const month = String(date.getMonth() + 1).padStart(2, '0')

    const day = String(date.getDate()).padStart(2, '0')

    let time = ''
    if (format.includes('HH:mm')) {
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      time = `T${hours}:${minutes}`
    }

    return `${year}-${month}-${day}${time}`
  }

  useEffect(() => {
    if (!input) {
      setValue('')
      setFile('')
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
  const [isDisable, setIsDisable] = useState(null)
  const [lastValue, setLastValue] = useState(null)

  useEffect(() => {
    if (roles?.trigger?.typeOfValidation === 'filter' && !loading) {
      if (dataRef?.current?.[roles?.trigger?.selectedField] !== undefined) {
        const FilterWithKey = roles?.trigger?.currentField === 'id' ? 'Id' : roles?.trigger?.currentField
        if (input?.type === 'ManyToMany') {
          setValue([])
        }
        setSelectedOptions(
          oldSelectedOptions.filter(ele => {
            if (roles?.trigger?.isEqual === 'equal') {
              return ele?.[FilterWithKey] === dataRef.current?.[roles?.trigger?.selectedField]
            } else {
              return ele?.[FilterWithKey] !== dataRef.current?.[roles?.trigger?.selectedField]
            }
          })
        )
      }
    }

    if (roles?.trigger?.typeOfValidation === 'disable' && !loading) {
      if (dataRef?.current?.[roles?.trigger?.selectedField]?.length !== 0) {
        setIsDisable('disabled')
      } else {
        setIsDisable(null)
      }
    }
    if (roles?.trigger?.typeOfValidation === 'enable' && !loading) {
      if (dataRef?.current?.[roles?.trigger?.selectedField]?.length !== 0) {
        setIsDisable('enable')
      } else {
        setIsDisable(prev => {
          if (roles?.onMount?.type === 'disable') {
            return 'disabled'
          }
          return null
        })
      }
    }
    if (roles?.trigger?.typeOfValidation === 'empty' && !loading) {
      setLastValue(dataRef?.current?.[roles?.trigger?.selectedField])
      if (dataRef?.current?.[roles?.trigger?.selectedField] !== lastValue) {
        if (typeof value === 'object') {
          setValue([])
        } else {
          setValue('')
        }
      }
    }
  }, [roles, loading, triggerData])

  useEffect(() => {
    if (typeof value === 'object') {
      setValue([])
    } else {
      setValue('')
    }
  }, [isDisable])

  useEffect(() => {
    if (!roles?.event?.onUnmount) {
      return
    }

    if (roles?.event?.onUnmount === 'async function Action(e, args) {\n  // write your code here\n}') {
      return
    }

    const handleBeforeUnload = e => {
      e.preventDefault()

      const evaluatedFn = eval('(' + roles?.event?.onUnmount + ')')
      evaluatedFn(e)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [roles])

  useEffect(() => {
    if (findValue) {
      setValue(findValue)
      if (input?.type === 'date') {
        setValue(new Date(findValue))
      }
    } else {
      if (input?.type === 'ManyToMany') {
        setValue([])
      }
      if (input?.type === 'date') {
        setValue(new Date())
      }
    }
  }, [input, findValue])

  useEffect(() => {
    if (reload !== 0) {
      setValue('')
      if (input?.type === 'ManyToMany') {
        setValue([])
      }
      setFile('')
      setError(false)
      setDirty(false)
      setShowPassword(false)
    }
  }, [reload, input])

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        if (roles?.onMount?.type === 'disable') {
          setIsDisable('disabled')
        }
        if (roles?.onMount?.type === 'enable') {
          setIsDisable('enable')
        }
        if (roles?.onMount?.type === 'write Data') {
          setValue(roles?.onMount?.value)
        }
      }, 0)
    }
  }, [roles, loading])

  const onChange = e => {
    try {
      if (roles?.event?.onChange) {
        const evaluatedFn = eval('(' + roles.event.onChange + ')')

        evaluatedFn(e)
      }
    } catch {}

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
        input.type === 'Number' ? setValue(+e.target.value) : setValue(e.target.value)
      }
    }

    if (dirty) {
      if (validations.Required && e?.target?.value?.length === 0 && isTypeNew) {
        return setError('Required')
      }

      if (input.type === 'Phone' && validations.Required && e?.length === 0 && isTypeNew) {
        return setError('Required')
      }
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

    if (input.type === 'Email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value !== '') {
      errorWithoutDirty.push(true)
      errorMessages.push('Invalid_Email')
    }
    if (
      input.type === 'URL' &&
      !/^(https?:\/\/)?(www\.)?[a-zA-Z0-9@:%._\+~#?&//=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%._\+~#?&//=]*)$/i.test(
        value
      ) &&
      value !== ''
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
    if (input.type === 'Phone' && !isPossiblePhoneNumber('+' + value ?? '') && value !== '') {
      errorWithoutDirty.push(true)
      errorMessages.push('Invalid_Phone')
    }
    if (dataRef) {
      if (input.type === 'Date') {
        try {
          const lable = JSON.parse(input?.descriptionEn) ?? {
            format: 'yyyy-MM-dd',
            showTime: 'false'
          }

          dataRef.current[input.key] = value ?? formatDate(value, lable.format)
        } catch (error) {
          dataRef.current[input.key] = ''
        }
      } else {
        dataRef.current[input.key] = value
      }

      setTriggerData(prev => prev + 1)
    }
    if (refError) {
      refError.current = {
        ...refError.current,
        [input.key]: errorWithoutDirty.includes(true) ? errorMessages : false
      }
    }
  }, [refError, input, value, dataRef, validations, setTriggerData])

  useEffect(() => {
    if (input.type === 'OneToOne') {
      setLoading(true)
      axiosGet(`generic-entities/${input?.options?.source}`)
        .then(res => {
          if (res.status) {
            setSelectedOptions(res.entities)
            setOldSelectedOptions(res.entities)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    } else if (input.type === 'ManyToMany') {
      setLoading(true)
      axiosGet(`generic-entities/${input?.options?.target}`)
        .then(res => {
          if (res.status) {
            setSelectedOptions(res.entities)
            setOldSelectedOptions(res.entities)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [input])

  const errorRefHeight = useRef(null)
  useEffect(() => {
    if (layout) {
      if (errorView || error) {
        if (errorRefHeight.current) {
          setLayout(prev =>
            prev.map(ele =>
              ele.i === input.id
                ? { ...ele, h: (mainRef.current.scrollHeight + errorRefHeight.current.scrollHeight) / 71 }
                : ele
            )
          )
        }
      } else {
        setLayout(prev =>
          prev.map(ele => (ele.i === input.id ? { ...ele, h: mainRef.current.scrollHeight / 71 } : ele))
        )
      }
    }
  }, [errorView, error])

  const mainRef = useRef()

  const onChangeFile = async e => {
    const file = e.target.files[0]
    const evaluatedFn = eval('(' + roles.event.onChange + ')')

    evaluatedFn(e)
    if (!file) {
      toast.error(locale === 'ar' ? 'لم يتم اختيار الملف' : 'No file selected')

      return
    }

    const isValid = input?.options?.uiSchema?.xComponentProps?.fileTypes?.some(type =>
      file.type.includes(type.replace('.', '/'))
    )

    if (isValid) {
      setFile(file.name)
      const base64File = await fileToBase64(file)
      setValue(base64File)
    } else {
      setError('Invalid File Type')
      setValue('')
      setFile('')
    }

    e.target.value = ''
  }

  const handleDelete = e => {
    e.stopPropagation()
    setTimeout(() => {
      setValue('')
      setFile('')
    }, 0)
    if (validations.Required) {
      setError('Required')
    }
  }

  const label = (
    <label htmlFor={input.key} style={{ textTransform: 'capitalize' }}>
      {locale === 'ar' ? input.nameAr : input.nameEn}
    </label>
  )

  const fileToBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }
  if (input.nameEn === 'previous job') {
    console.log(roles)
  }

  return (
    <div className='reset' id={input.key.trim() + input.nameEn.trim().replaceAll(' ', '')}>
      <style>{`#${input.key.trim() + input.nameEn.trim().replaceAll(' ', '')} {
        ${design}
      }`}</style>
      <div ref={mainRef} id='parent-input'>
        <div className=''>
          <div>{input.type !== 'File' && label}</div>
        </div>
        <div className='relative' style={{ display: 'flex' }}>
          <ViewInput
            input={input}
            xComponentProps={xComponentProps}
            readOnly={readOnly}
            value={value}
            onBlur={roles?.event?.onBlur}
            onChange={onChange}
            onChangeFile={onChangeFile}
            fileName={fileName}
            locale={locale}
            findError={findError}
            selectedOptions={selectedOptions}
            isDisable={isDisable}
            errorView={errorView}
            handleDelete={handleDelete}
            error={error}
            setShowPassword={setShowPassword}
            showPassword={showPassword}
          />
        </div>
      </div>
      <Collapse transition={`height 300ms cubic-bezier(.4, 0, .2, 1)`} isOpen={Boolean(errorView || error)}>
        <div ref={errorRefHeight} class='!text-sm text-red-500 mt-1 px-2'>
          {errorView || error}
        </div>
      </Collapse>
    </div>
  )
}

const ViewInput = ({
  input,
  value,
  onChangeFile,
  readOnly,
  onChange,
  locale,
  handleDelete,
  errorView,
  fileName,
  error,
  showPassword,
  setShowPassword,
  selectedOptions,
  isDisable,
  onBlur
}) => {
  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => {
    const lable = JSON.parse(input?.descriptionEn) ?? {
      format: 'yyyy-MM-dd',
      showTime: 'false'
    }

    return (
      <div className='relative w-full'>
        <input placeholder={lable.format} className='!ps-[35px] relative ' onClick={onClick} ref={ref} value={value} />
        <div className='absolute top-[0] start-[10px]  w-[20px] h-[100%] flex items-center justify-center z-10'>
          <span className='' id='calendar-icon'>
            <FaCalendarAlt className='text-xl' />
          </span>
        </div>
      </div>
    )
  })

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
          onChange={e => {
            onChange(e)
          }}
          onBlur={e => {
            if (onBlur) {
              const evaluatedFn = eval('(' + onBlur + ')')

              evaluatedFn(e)
            }
          }}
          disabled={isDisable === 'disabled'}
          onKeyDown={handleKeyDown}
          onWheel={handleWheel}
          className={`${errorView || error ? 'error' : ''} `}
          style={{ transition: '0.3s' }}
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
      <textarea
        id={input.key}
        value={value}
        name={input.nameEn}
        onChange={e => {
          onChange(e)
        }}
        rows={4}
        disabled={isDisable === 'disabled'}
        className={`${errorView || error ? 'error' : ''} `}
        style={{ transition: '0.3s' }}
        onBlur={e => {
          if (onBlur) {
            const evaluatedFn = eval('(' + onBlur + ')')

            evaluatedFn(e)
          }
        }}
      />
    )
  }

  if (input.type === 'File') {
    return (
      <div className='px-4 w-full'>
        <div id='file-upload-container'>
          <label htmlFor={input.key} id='file-upload-label'>
            <div id='label-color'>{locale === 'ar' ? input.nameAr : input.nameEn}</div>
            <div id='file-upload-content'>
              <svg
                id='file-upload-icon'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 20 16'
              >
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
                />
              </svg>

              <p id='file-upload-text'>
                <span className='font-semibold'>{locale === 'ar' ? 'اضف الصورة' : 'Add Image'} </span>
                {locale === 'ar' ? 'أو اسحب وأفلت' : 'or drag and drop'}
              </p>
              <p id='file-upload-subtext'>
                {locale === 'ar' ? 'SVG, PNG, JPG or GIF (MAX. 800x400px)' : 'SVG, PNG, JPG or GIF (MAX. 800x400px)'}
              </p>

              {value && (
                <div className='flex flex-col gap-1 p-2 mt-5 rounded-md shadow-inner shadow-gray-300 file-names-container'>
                  <div className='flex gap-3 items-center file-name-item'>
                    <span className='flex gap-1 items-center file-name w-[calc(100%-25px)]'>
                      <BsPaperclip className='text-xl text-main-color' />
                      <span className='flex-1'>{fileName}</span>
                    </span>
                    <button
                      type='button'
                      className='delete-button w-[25px] h-[25px] bg-red-500/70 rounded-full text-white hover:bg-red-500/90 transition-all duration-300 flex items-center justify-center'
                      onClick={e => handleDelete(e)}
                    >
                      <BsTrash />
                    </button>
                  </div>
                </div>
              )}
            </div>
            <input
              type='file'
              disabled={isDisable === 'disabled'}
              id={input.key}
              onChange={onChangeFile}
              onBlur={e => {
                if (onBlur) {
                  const evaluatedFn = eval('(' + onBlur + ')')

                  evaluatedFn(e)
                }
              }}
              accept={input?.options?.uiSchema?.xComponentProps?.fileTypes?.join(',')}
            />
          </label>
        </div>
      </div>
    )
  }
  if (input.type === 'Date') {
    const lable = JSON.parse(input?.descriptionEn) ?? {
      format: 'yyyy-MM-dd',
      showTime: 'false'
    }

    return !readOnly ? (
      <DatePickerWrapper className='w-full'>
        <DatePicker
          selected={value}
          onChange={date => onChange(date)}
          timeInputLabel='Time:'
          dateFormat={`${lable.format ? lable.format : 'MM/dd/yyyy'}`}
          showMonthDropdown
          locale={locale === 'ar' ? ar : en}
          showYearDropdown
          onBlur={e => {
            if (onBlur) {
              const evaluatedFn = eval('(' + onBlur + ')')

              evaluatedFn(e)
            }
          }}
          showTimeInput={lable.showTime === 'true'}
          customInput={<ExampleCustomInput className='example-custom-input' />}
          disabled={isDisable === 'disabled'}
        />
      </DatePickerWrapper>
    ) : (
      <DatePicker
        selected={value}
        locale={locale === 'ar' ? ar : en}
        onChange={date => onChange(date)}
        timeInputLabel='Time:'
        dateFormat={`${lable.format ? lable.format : 'MM/dd/yyyy'}`}
        showMonthDropdown
        onBlur={e => {
          if (onBlur) {
            const evaluatedFn = eval('(' + onBlur + ')')

            evaluatedFn(e)
          }
        }}
        showYearDropdown
        showTimeInput={lable.showTime === 'true'}
        customInput={<ExampleCustomInput className='example-custom-input' />}
        disabled={isDisable === 'disabled'}
      />
    )
  }

  if (input.type === 'OneToOne' && input.descriptionAr !== 'select') {
    const lable = JSON.parse(input?.descriptionEn)

    return (
      <div className=''>
        <div className=''>
          <div className=''>
            <div>
              <div className='flex gap-1 flex-wrap'>
                {selectedOptions.map((option, index) => (
                  <div key={option.Id} className=''>
                    <input
                      value={option.Id}
                      name={input.nameEn}
                      checked={value === option.Id}
                      onChange={e => onChange(e)}
                      type='radio'
                      id={option.Id}
                      disabled={isDisable === 'disabled'}
                      onBlur={e => {
                        if (onBlur) {
                          const evaluatedFn = eval('(' + onBlur + ')')

                          evaluatedFn(e)
                        }
                      }}
                    />
                    <label htmlFor={option.Id}>{lable.map(ele => option[ele]).join('-')}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  if (input.type === 'OneToOne' && input.descriptionAr === 'select') {
    const lable = JSON.parse(input?.descriptionEn)

    return (
      <div id='custom-select'>
        <select
          value={value}
          onChange={e => onChange(e)}
          disabled={isDisable === 'disabled'}
          onBlur={e => {
            if (onBlur) {
              const evaluatedFn = eval('(' + onBlur + ')')

              evaluatedFn(e)
            }
          }}
        >
          <option disabled selected value={''}>
            {locale === 'ar' ? 'اختر ' : 'Select'}
          </option>
          {selectedOptions.map((option, index) => (
            <option key={option.Id} value={option.Id}>
              {lable.map(ele => option[ele]).join('-')}
            </option>
          ))}
        </select>
      </div>
    )
  }
  if (input.type === 'ManyToMany') {
    const lable = JSON.parse(input?.descriptionEn)

    return (
      <div className=''>
        <div className=''>
          <div className=''>
            <div className=''>
              <div className='flex flex-wrap gap-1'>
                {selectedOptions.map((option, index) => (
                  <div key={option.Id} className=''>
                    <input
                      value={option.Id}
                      name={input.nameEn}
                      checked={value?.find(v => v === option.Id)}
                      onChange={e => onChange(e)}
                      type='checkbox'
                      id={option.Id}
                      disabled={isDisable === 'disabled'}
                      onBlur={e => {
                        if (onBlur) {
                          const evaluatedFn = eval('(' + onBlur + ')')

                          evaluatedFn(e)
                        }
                      }}
                    />
                    <label htmlFor={option.Id}>{lable.map(ele => option[ele]).join('-')}</label>
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
