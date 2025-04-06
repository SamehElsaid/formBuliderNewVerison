/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo, forwardRef, useRef } from 'react'
import { Autocomplete, Button, FormLabel, IconButton, InputAdornment, TextField } from '@mui/material'
import { useIntl } from 'react-intl'
import { isPossiblePhoneNumber } from 'react-phone-number-input'
import DatePicker from 'react-datepicker'
import ar from 'date-fns/locale/ar-EG'
import en from 'date-fns/locale/en-US'
import { axiosGet, axiosPost } from 'src/Components/axiosCall'
import { Icon } from '@iconify/react'
import Collapse from '@kunukn/react-collapse'
import { BsPaperclip, BsTrash } from 'react-icons/bs'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { FaCalendarAlt } from 'react-icons/fa'
import NewElement from '../NewElement'
import { toast } from 'react-toastify'
import addDays from 'date-fns/addDays'
import { VaildId } from 'src/Components/_Shared'
import { IoMdInformationCircleOutline } from 'react-icons/io'

export default function DisplayField({
  from,
  input,
  dirtyProps,
  reload,
  refError,
  dataRef,
  errorView,
  disabledBtn,
  setLayout,
  setTriggerData,
  findError,
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
  const [loading, setLoading] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const { locale } = useIntl()
  const [validations, setValidations] = useState({})
  const [selectedOptions, setSelectedOptions] = useState([])
  const [oldSelectedOptions, setOldSelectedOptions] = useState([])
  const xComponentProps = useMemo(() => input?.options?.uiSchema?.xComponentProps ?? {}, [input])
  const [fileName, setFile] = useState('')
  const [regex, setRegex] = useState(roles?.regex?.regex)

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
      if (input.type !== 'new_element') {
        const dataValidations = {}
        input.validationData.forEach(item => {
          dataValidations[item.ruleType] = item.parameters
        })

        setValidations(dataValidations)
      }
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

    // ! Start disable Control

    if (roles?.trigger?.typeOfValidation === 'disable' && !roles?.trigger?.mainValue && !loading) {
      if (dataRef?.current?.[roles?.trigger?.selectedField]?.length !== 0) {
        setIsDisable('disabled')
      } else {
        setIsDisable(prev => {
          if (roles?.onMount?.type === 'hide') {
            return 'hidden'
          }

          return null
        })
      }
    }

    // End disable Control

    // ! Start enable Control
    if (roles?.trigger?.typeOfValidation === 'enable' && roles?.trigger?.mainValue && !loading) {
      if (input.fieldCategory === 'Basic') {
        if (roles?.trigger?.parentKey) {
          if (dataRef?.current?.[roles?.trigger?.selectedField]) {
            axiosGet(
              `generic-entities/${roles?.trigger?.parentKey}/${dataRef?.current?.[roles?.trigger?.selectedField]}`
            ).then(res => {
              if (res.status) {
                const data = res.entities?.[0] ?? false
                if (data) {
                  if (roles?.trigger.isEqual === 'equal') {
                    if (data?.[roles?.trigger?.triggerKey] !== roles?.trigger?.mainValue) {
                      setIsDisable(prev => {
                        if (roles?.onMount?.type === 'disable') {
                          return 'disabled'
                        }

                        return null
                      })
                    } else {
                      setIsDisable('enable')
                    }
                  } else {
                    if (data?.[roles?.trigger?.triggerKey] === roles?.trigger?.mainValue) {
                      setIsDisable(prev => {
                        if (roles?.onMount?.type === 'disable') {
                          return 'disabled'
                        }

                        return null
                      })
                    } else {
                      setIsDisable('enable')
                    }
                  }
                }
              }
            })
          }
        } else {
          if (roles?.trigger.isEqual === 'equal') {
            if (dataRef?.current?.[roles?.trigger?.selectedField] !== roles?.trigger?.mainValue) {
              setIsDisable(prev => {
                if (roles?.onMount?.type === 'disable') {
                  return 'disabled'
                }

                return null
              })
            } else {
              setIsDisable('enable')
            }
          } else {
            if (dataRef?.current?.[roles?.trigger?.selectedField] === roles?.trigger?.mainValue) {
              setIsDisable(prev => {
                if (roles?.onMount?.type === 'disable') {
                  return 'disabled'
                }

                return null
              })
            } else {
              setIsDisable('enable')
            }
          }
        }
      } else {
        if (roles?.trigger?.parentKey) {
          if (dataRef?.current?.[roles?.trigger?.selectedField]) {
            axiosGet(
              `generic-entities/${roles?.trigger?.parentKey}/${dataRef?.current?.[roles?.trigger?.selectedField]}`
            ).then(res => {
              if (res.status) {
                const data = res.entities?.[0] ?? false
                if (data) {
                  if (roles?.trigger.isEqual === 'equal') {
                    if (data?.[roles?.trigger?.triggerKey] !== roles?.trigger?.mainValue) {
                      setIsDisable(prev => {
                        if (roles?.onMount?.type === 'disable') {
                          return 'disabled'
                        }

                        return null
                      })
                    } else {
                      setIsDisable('enable')
                    }
                  } else {
                    if (data?.[roles?.trigger?.triggerKey] === roles?.trigger?.mainValue) {
                      setIsDisable(prev => {
                        if (roles?.onMount?.type === 'disable') {
                          return 'disabled'
                        }

                        return null
                      })
                    } else {
                      setIsDisable('enable')
                    }
                  }
                }
              }
            })
          }
        } else {
          if (roles?.trigger.isEqual === 'equal') {
            if (dataRef?.current?.[roles?.trigger?.selectedField] !== roles?.trigger?.mainValue) {
              setIsDisable(prev => {
                if (roles?.onMount?.type === 'disable') {
                  return 'disabled'
                }

                return null
              })
            } else {
              setIsDisable('enable')
            }
          } else {
            if (dataRef?.current?.[roles?.trigger?.selectedField] === roles?.trigger?.mainValue) {
              setIsDisable(prev => {
                if (roles?.onMount?.type === 'disable') {
                  return 'disabled'
                }

                return null
              })
            } else {
              setIsDisable('enable')
            }
          }
        }
      }
    }
    if (roles?.trigger?.typeOfValidation === 'enable' && !roles?.trigger?.mainValue && !loading) {
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

    //  End enable Control

    // ! Start Empty Control
    if (roles?.trigger?.typeOfValidation === 'empty' && roles?.trigger?.mainValue && !loading) {
      if (input.fieldCategory === 'Basic') {
        if (roles?.trigger?.parentKey) {
          if (dataRef?.current?.[roles?.trigger?.selectedField]) {
            axiosGet(
              `generic-entities/${roles?.trigger?.parentKey}/${dataRef?.current?.[roles?.trigger?.selectedField]}`
            ).then(res => {
              if (res.status) {
                const data = res.entities?.[0] ?? false
                if (data) {
                  if (roles?.trigger.isEqual === 'equal') {
                    if (data?.[roles?.trigger?.triggerKey] === roles?.trigger?.mainValue) {
                      setLastValue(true)
                      if (!lastValue) {
                        if (typeof value === 'object') {
                          setValue([])
                        } else {
                          setValue('')
                        }
                      }
                    } else {
                      setLastValue(false)
                    }
                  } else {
                    if (data?.[roles?.trigger?.triggerKey] !== roles?.trigger?.mainValue) {
                      if (typeof value === 'object') {
                        setValue([])
                      } else {
                        setValue('')
                      }
                    }
                  }
                }
              } else {
                if (roles?.trigger.isEqual !== 'equal') {
                  if (typeof value === 'object') {
                    setValue([])
                  } else {
                    setValue('')
                  }
                }
              }
            })
          } else {
            if (roles?.trigger.isEqual !== 'equal') {
              if (typeof value === 'object') {
                setValue([])
              } else {
                setValue('')
              }
            }
          }
        } else {
          if (roles?.trigger.isEqual === 'equal') {
            if (dataRef?.current?.[roles?.trigger?.selectedField] === roles?.trigger?.mainValue) {
              setLastValue(true)
              if (!lastValue) {
                if (typeof value === 'object') {
                  setValue([])
                } else {
                  setValue('')
                }
              }
            } else {
              setLastValue(false)
            }
          } else {
            if (dataRef?.current?.[roles?.trigger?.selectedField] !== roles?.trigger?.mainValue) {
              if (typeof value === 'object') {
                setValue([])
              } else {
                setValue('')
              }
            }
          }
        }
      } else {
        if (roles?.trigger?.parentKey) {
          if (dataRef?.current?.[roles?.trigger?.selectedField]) {
            axiosGet(
              `generic-entities/${roles?.trigger?.parentKey}/${dataRef?.current?.[roles?.trigger?.selectedField]}`
            ).then(res => {
              if (res.status) {
                const data = res.entities?.[0] ?? false
                if (data) {
                  if (roles?.trigger.isEqual === 'equal') {
                    if (data?.[roles?.trigger?.triggerKey] === roles?.trigger?.mainValue) {
                      setLastValue(true)
                      if (!lastValue) {
                        if (typeof value === 'object') {
                          setValue([])
                        } else {
                          setValue('')
                        }
                      }
                    } else {
                      setLastValue(false)
                    }
                  } else {
                    if (data?.[roles?.trigger?.triggerKey] !== roles?.trigger?.mainValue) {
                      if (typeof value === 'object') {
                        setValue([])
                      } else {
                        setValue('')
                      }
                    }
                  }
                }
              } else {
                if (roles?.trigger.isEqual !== 'equal') {
                  if (typeof value === 'object') {
                    setValue([])
                  } else {
                    setValue('')
                  }
                }
              }
            })
          } else {
            if (roles?.trigger.isEqual !== 'equal') {
              if (typeof value === 'object') {
                setValue([])
              } else {
                setValue('')
              }
            }
          }
        } else {
          if (roles?.trigger.isEqual === 'equal') {
            if (dataRef?.current?.[roles?.trigger?.selectedField] === roles?.trigger?.mainValue) {
              setLastValue(true)
              if (!lastValue) {
                if (typeof value === 'object') {
                  setValue([])
                } else {
                  setValue('')
                }
              }
            } else {
              setLastValue(false)
            }
          } else {
            if (dataRef?.current?.[roles?.trigger?.selectedField] !== roles?.trigger?.mainValue) {
              if (typeof value === 'object') {
                setValue([])
              } else {
                setValue('')
              }
            }
          }
        }
      }
    }

    if (roles?.trigger?.typeOfValidation === 'empty' && !roles?.trigger?.mainValue && !loading) {
      setLastValue(dataRef?.current?.[roles?.trigger?.selectedField])
      if (dataRef?.current?.[roles?.trigger?.selectedField] !== lastValue) {
        if (typeof value === 'object') {
          setValue([])
        } else {
          setValue('')
        }
      }
    }

    //  End Empty Control

    // ! Start hidden Control
    if (roles?.trigger?.typeOfValidation === 'hidden' && roles?.trigger?.mainValue && !loading) {
      if (input.fieldCategory === 'Basic') {
        if (roles?.trigger?.parentKey) {
          if (dataRef?.current?.[roles?.trigger?.selectedField]) {
            axiosGet(
              `generic-entities/${roles?.trigger?.parentKey}/${dataRef?.current?.[roles?.trigger?.selectedField]}`
            ).then(res => {
              if (res.status) {
                const data = res.entities?.[0] ?? false
                if (data) {
                  if (roles?.trigger.isEqual === 'equal') {
                    if (data?.[roles?.trigger?.triggerKey] !== roles?.trigger?.mainValue) {
                      setIsDisable(null)
                    } else {
                      setIsDisable('hidden')
                    }
                  } else {
                    if (data?.[roles?.trigger?.triggerKey] === roles?.trigger?.mainValue) {
                      setIsDisable(null)
                    } else {
                      setIsDisable('hidden')
                    }
                  }
                }
              }
            })
          } else {
            if (roles?.trigger?.isEqual !== 'equal') {
              setIsDisable('hidden')
            }
          }
        } else {
          if (roles?.trigger.isEqual === 'equal') {
            if (dataRef?.current?.[roles?.trigger?.selectedField] !== roles?.trigger?.mainValue) {
              setIsDisable(null)
            } else {
              setIsDisable('hidden')
            }
          } else {
            if (dataRef?.current?.[roles?.trigger?.selectedField] === roles?.trigger?.mainValue) {
              setIsDisable(null)
            } else {
              setIsDisable('hidden')
            }
          }
        }
      } else {
        if (roles?.trigger?.parentKey) {
          if (dataRef?.current?.[roles?.trigger?.selectedField]) {
            axiosGet(
              `generic-entities/${roles?.trigger?.parentKey}/${dataRef?.current?.[roles?.trigger?.selectedField]}`
            ).then(res => {
              if (res.status) {
                const data = res.entities?.[0] ?? false
                if (data) {
                  if (roles?.trigger.isEqual === 'equal') {
                    if (data?.[roles?.trigger?.triggerKey] !== roles?.trigger?.mainValue) {
                      setIsDisable(null)
                    } else {
                      setIsDisable('hidden')
                    }
                  } else {
                    if (data?.[roles?.trigger?.triggerKey] === roles?.trigger?.mainValue) {
                      setIsDisable(null)
                    } else {
                      setIsDisable('hidden')
                    }
                  }
                }
              }
            })
          }
        } else {
          if (roles?.trigger.isEqual === 'equal') {
            if (dataRef?.current?.[roles?.trigger?.selectedField] !== roles?.trigger?.mainValue) {
              setIsDisable(null)
            } else {
              setIsDisable('hidden')
            }
          } else {
            if (dataRef?.current?.[roles?.trigger?.selectedField] === roles?.trigger?.mainValue) {
              setIsDisable(null)
            } else {
              setIsDisable('hidden')
            }
          }
        }
      }
    }
    if (roles?.trigger?.typeOfValidation === 'hidden' && !roles?.trigger?.mainValue && !loading) {
      if (dataRef?.current?.[roles?.trigger?.selectedField]?.length !== 0) {
        setIsDisable('hidden')
      } else {
        setIsDisable(prev => {
          if (roles?.onMount?.type === 'hide') {
            return 'hidden'
          }

          return null
        })
      }
    }

    //  End hidden Control

    
    // ! Start Visible Control
    if (roles?.trigger?.typeOfValidation === 'visible' && roles?.trigger?.mainValue && !loading) {
      if (input.fieldCategory === 'Basic') {
        if (roles?.trigger?.parentKey) {
          if (dataRef?.current?.[roles?.trigger?.selectedField]) {
            axiosGet(
              `generic-entities/${roles?.trigger?.parentKey}/${dataRef?.current?.[roles?.trigger?.selectedField]}`
            ).then(res => {
              if (res.status) {
                const data = res.entities?.[0] ?? false
                if (data) {
                  if (roles?.trigger.isEqual === 'equal ') {

                    if (data?.[roles?.trigger?.triggerKey].toLowerCase() === roles?.trigger?.mainValue.toLowerCase()) {
                      setIsDisable(null)
                    } else {
                      setIsDisable('hidden')
                    }
                  } else {
                    if (data?.[roles?.trigger?.triggerKey] !== roles?.trigger?.mainValue) {
                      setIsDisable(null)
                    } else {
                      setIsDisable('hidden')
                    }
                  }
                }
              }
            })
          }
        } else {
          if (roles?.trigger.isEqual === 'equal') {
            if (dataRef?.current?.[roles?.trigger?.selectedField] === roles?.trigger?.mainValue) {
              setIsDisable(null)
            } else {
              setIsDisable('hidden')
            }
          } else {
            if (dataRef?.current?.[roles?.trigger?.selectedField] !== roles?.trigger?.mainValue) {
              setIsDisable(null)
            } else {
              setIsDisable('hidden')
            }
          }
        }
      } else {
        if (roles?.trigger?.parentKey) {
          if (dataRef?.current?.[roles?.trigger?.selectedField]) {
            axiosGet(
              `generic-entities/${roles?.trigger?.parentKey}/${dataRef?.current?.[roles?.trigger?.selectedField]}`
            ).then(res => {
              if (res.status) {
                const data = res.entities?.[0] ?? false
                if (data) {
                  if (roles?.trigger.isEqual === 'equal') {
                    if (data?.[roles?.trigger?.triggerKey].toLowerCase() === roles?.trigger?.mainValue.toLowerCase()) {
                      setIsDisable(null)
                    } else {
                      setIsDisable('hidden')
                    }
                  } else {
                    if (data?.[roles?.trigger?.triggerKey] !== roles?.trigger?.mainValue) {
                      setIsDisable(null)
                    } else {
                      setIsDisable('hidden')
                    }
                  }
                }
              }
            })
          }
        } else {
          if (roles?.trigger.isEqual === 'equal') {
            if (dataRef?.current?.[roles?.trigger?.selectedField] === roles?.trigger?.mainValue) {
              setIsDisable(null)
            } else {
              setIsDisable('hidden')
            }
          } else {
            if (dataRef?.current?.[roles?.trigger?.selectedField] !== roles?.trigger?.mainValue) {
              setIsDisable(null)
            } else {
              setIsDisable('hidden')
            }
          }
        }
      }
    }
    if (roles?.trigger?.typeOfValidation === 'visible' && !roles?.trigger?.mainValue && !loading) {
      if (dataRef?.current?.[roles?.trigger?.selectedField]?.length !== 0) {
        setIsDisable('visible')
      } else {
        setIsDisable(prev => {
          if (roles?.onMount?.type === 'hide') {
            return 'hidden'
          }

          return null
        })
      }
    }

    // End Visible Control
  }, [roles, loading, triggerData])

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
    if (findValue || findValue === '') {
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
      setRegex('')
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
        if (roles?.onMount?.type === 'hide') {
          setIsDisable('hidden')
        }

        if (roles?.onMount?.value) {
          if (roles?.api_url) {
            setValue(roles?.apiKeyData)
          } else {
            setValue(roles?.onMount?.value)
          }
        }
      }, 0)
    }
  }, [roles, loading])

  const onChange = (e, newValue) => {
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
      if (input.descriptionAr === 'multiple_select') {
        setValue(newValue)
        newData = newValue
      } else {
        setValue(e.target.checked ? [...value, e.target.value] : value.filter(v => v !== e.target.value))
        newData = e.target.checked ? [...value, e.target.value] : value.filter(v => v !== e.target.value)
      }
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
      if (regex) {
        // Remove surrounding quotes if present
        const cleanedRegex = regex.replace(/^"(.*)"$/, '$1')
        const regexMatch = cleanedRegex.match(/^\/(.*)\/([gimuy]*)$/)
        if (!regexMatch) {
          console.error('Invalid regex format:', cleanedRegex)

          return
        }
        const [, pattern, flags] = regexMatch
        const regExp = new RegExp(pattern, flags)
        if (!regExp.test(e?.target?.value)) {
          return setError(locale === 'ar' ? roles?.regex?.message_ar : roles?.regex?.message_en)
        }
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
        return setError('Min_Length')
      }

      if (validations.MaxLength && e?.target?.value?.length > +validations?.MaxLength?.maxLength) {
        return setError('Max_Length')
      }

      setError(false)
    }
  }
  useEffect(() => {
    if (!input) return
    let errorWithoutDirty = []
    const errorMessages = []
    if (validations.Required && (value?.length === 0 || value === '')) {
      errorWithoutDirty.push(true)
      errorMessages.push('Required')
    }

    if (input.type === 'Email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value !== '') {
      errorWithoutDirty.push(true)
      errorMessages.push('Invalid_Email')
    }

    if (regex) {
      // Remove surrounding quotes if present
      const cleanedRegex = regex.replace(/^"(.*)"$/, '$1')
      const regexMatch = cleanedRegex.match(/^\/(.*)\/([gimuy]*)$/)
      if (!regexMatch) {
        console.error('Invalid regex format:', cleanedRegex)

        return
      }
      const [, pattern, flags] = regexMatch
      const regExp = new RegExp(pattern, flags)
      if (!regExp.test(value)) {
        errorWithoutDirty.push(true)
        errorMessages.push(locale === 'ar' ? roles?.regex?.message_ar : roles?.regex?.message_en)
      }
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

          dataRef.current[input.type === 'new_element' ? input.id : input.key] =
            value ?? formatDate(value, lable.format)
        } catch (error) {
          dataRef.current[input.type === 'new_element' ? input.id : input.key] = ''
        }
      } else {
        dataRef.current[input.type === 'new_element' ? input.id : input.key] = value
      }
      if (setTriggerData) {
        setTriggerData(prev => prev + 1)
      }
    }
    if (refError) {
      refError.current = {
        ...refError.current,
        [input.type === 'new_element' ? input.id : input.key]: errorWithoutDirty.includes(true) ? errorMessages : false
      }
    }
  }, [refError, input, value, dataRef, validations, setTriggerData])

  useEffect(() => {
    if (input.type === 'OneToOne') {
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
    } else {
      setLoading(false)
    }
  }, [input])

  useEffect(() => {
    setTimeout(() => {
      if (layout && !loading) {
        if (mainRef.current) {
          setLayout(prev => {
            return prev.map(ele =>
              `${ele.i}` === `${input.id}`
                ? { ...ele, h: isDisable === 'hidden' && !readOnly ? 0 : mainRef.current.scrollHeight / 71 }
                : ele
            )
          })
        }
      }
    }, 100)
  }, [isDisable, readOnly, layout?.length, loading])

  const mainRef = useRef()

  const onChangeFile = async e => {
    const file = e.target.files[0]
    if (file?.size > roles?.size * 1024) {
      toast.error(locale === 'ar' ? `حجم الملف أكبر من ${roles?.size} كيلوبايت` : `File size exceeds ${roles?.size}KB`)

      return
    }
    if (roles?.event?.onChange) {
      try {
        const evaluatedFn = eval('(' + roles.event.onChange + ')')
        evaluatedFn(e)
      } catch {}
    }
    if (!file) {
      toast.error(locale === 'ar' ? 'لم يتم اختيار الملف' : 'No file selected')

      return
    }

    const isValid = input?.options?.uiSchema?.xComponentProps?.fileTypes?.some(type =>
      file.type.includes(type.replace('.', '/'))
    )

    if (isValid) {
      const file = event.target.files[0]
      const loading = toast.loading(locale === 'ar' ? 'جاري الرفع' : 'Uploading...')
      if (file) {
        axiosPost(
          'file/upload',
          'en',
          {
            file: file
          },
          true
        )
          .then(res => {
            if (res.status) {
              setFile(file.name)
              setValue(res.filePath.data)
            }
          })
          .finally(() => {
            toast.dismiss(loading)
          })
        event.target.value = ''
      }
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

  const hoverText = roles?.hover?.hover_ar || roles?.hover?.hover_en
  const hintText = roles?.hint?.hint_ar || roles?.hint?.hint_en

  return (
    <div
      className={`reset ${isDisable === 'hidden' && !readOnly ? 'hidden' : ''} relative group w-full`}
      id={input.type === 'new_element' ? `s${input.id}` : VaildId(input.key.trim() + input.nameEn.trim())}
    >
      <style>{`#${input.type === 'new_element' ? `s${input.id}` : VaildId(input.key.trim() + input.nameEn.trim())} {
        ${design}
      }`}</style>
      {hoverText && (
        <div className='absolute glass-effect z-10 w-full top-[calc(100%+5px)] invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300'>
          {hoverText}
        </div>
      )}
      <div ref={mainRef} id='parent-input'>
        <div className='flex items-center gap-2 justify-between mb-2'>
          <div className='flex items-center gap-2'>
            {input.type !== 'File' && label} <span className='text-xs text-red-500'>{validations.Required && '*'}</span>
          </div>
          {hintText && (
            <button
              type='button'
              className='text-lg relative bg-main-color hint-btn   rounded-full w-[35px] h-[35px] flex items-center justify-center cursor-pointer'
            >
              <Icon fontSize='1.25rem' icon='tabler:info-circle' className='text-white' />
              <div className='absolute glass-effect z-10 w-fit end-[0] top-[calc(100%+5px)] invisible  hint-text transition-all duration-300'>
                {hintText}
              </div>
            </button>
          )}
        </div>
        <div className='relative' style={{ display: 'flex' }}>
          {isDisable === 'hidden' && readOnly && (
            <div className='absolute inset-0 bg-white/50 z-10 rounded-md text-sm text-gray-500 flex items-center justify-center'>
              {locale === 'ar' ? 'حقل مخفي' : 'Hidden Input'}
            </div>
          )}
          {input.type === 'new_element' ? (
            <NewElement
              isDisable={isDisable}
              readOnly={readOnly}
              disabledBtn={disabledBtn}
              input={input}
              roles={roles}
              onChangeEvent={roles?.event?.onChange}
              onBlur={roles?.event?.onBlur}
              value={value}
              setValue={setValue}
            />
          ) : (
            <ViewInput
              input={input}
              xComponentProps={xComponentProps}
              readOnly={readOnly}
              value={value}
              onBlur={roles?.event?.onBlur}
              onChange={onChange}
              from={from}
              roles={roles}
              onChangeFile={onChangeFile}
              fileName={fileName}
              locale={locale}
              findError={findError}
              selectedOptions={selectedOptions}
              isDisable={isDisable}
              placeholder={locale === 'ar' ? roles?.placeholder?.placeholder_ar : roles?.placeholder?.placeholder_en}
              errorView={errorView}
              handleDelete={handleDelete}
              error={error}
              setShowPassword={setShowPassword}
              showPassword={showPassword}
            />
          )}
        </div>
      </div>
      <div
        class={`${
          errorView || error ? 'opacity-100 visible' : 'opacity-0 invisible'
        } w-fit text-[#fb866e]   text-2xl end-[2px] bg-white z-10 mt-1 px-2 absolute top-[calc(50%+13px)] -translate-y-1/2 rounded-md transition-all duration-300`}
      >
        <IoMdInformationCircleOutline />
      </div>
      <div
        class={`${
          errorView || error ? 'opacity-100 visible' : 'opacity-0 invisible'
        } !text-sm bg-[#fb866e] text-white  z-10 w-fit end-[0] mt-1 px-2 absolute top-[100%] rounded-md transition-all duration-300`}
      >
        {errorView || error}
      </div>
    </div>
  )
}

const ViewInput = ({
  input,
  value,
  onChangeFile,
  from,
  readOnly,
  roles,
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
  placeholder,
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
          placeholder={placeholder}
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
        placeholder={placeholder}
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
    return from !== 'table' ? (
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
    ) : (
      <div className='flex items-center gap-2'>
        <a
          href={process.env.API_URL + '/file/download/' + value.replaceAll('/Uploads/', '')}
          target='_blank'
          rel='noreferrer'
        >
          {value?.split('/Uploads/')?.[1]?.slice(0, 30) ? (
            value.split('/Uploads/')[1].slice(0, 30) + '.' + value.split('/Uploads/')[1].split('.').pop()
          ) : (
            <></>
          )}
        </a>
        <div className=''>
          <Button
            variant='outlined'
            component='label'
            className='!w-[30px] !h-[30px] !rounded-full  !max-w-[30px] !max-h-[30px]  !min-h-0 !p-0 !min-w-0 !flex !items-center !justify-center'
          >
            <Icon
              icon={value?.split('/Uploads/')?.[1]?.slice(0, 30) ? 'tabler:edit' : 'tabler:upload'}
              width={25}
              height={25}
            />
            <input
              type='file'
              disabled={isDisable === 'disabled'}
              id={input.key}
              hidden
              onChange={onChangeFile}
              onBlur={e => {
                if (onBlur) {
                  const evaluatedFn = eval('(' + onBlur + ')')

                  evaluatedFn(e)
                }
              }}
              accept={input?.options?.uiSchema?.xComponentProps?.fileTypes?.join(',')}
            />
          </Button>
        </div>
      </div>
    )
  }
  if (input.type === 'Date') {
    const lable = JSON.parse(input?.descriptionEn) ?? {
      format: 'yyyy-MM-dd',
      showTime: 'false'
    }
    const today = new Date()
    let minDate = null
    let maxDate = null

    // حساب minDate اعتماداً على beforeDateType
    if (roles?.beforeDateType === 'days') {
      // إذا كان النوع days، يتم حساب التاريخ بإضافة beforeDateValue (عدد الأيام) لتاريخ اليوم
      minDate = addDays(today, roles?.beforeDateValue)
    } else if (roles?.beforeDateType === 'date') {
      // إذا كان النوع date، يتم استخدام التاريخ مباشرة
      minDate = new Date(roles?.beforeDateValue)
    }

    // حساب maxDate اعتماداً على afterDateType
    if (roles?.afterDateType === 'days') {
      // إذا كان النوع days، يتم حساب التاريخ بإضافة afterDateValue (عدد الأيام) لتاريخ اليوم
      maxDate = addDays(today, roles?.afterDateValue)
    } else if (roles?.afterDateType === 'date') {
      // إذا كان النوع date، يتم استخدام التاريخ مباشرة
      maxDate = new Date(roles?.afterDateValue)
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
          minDate={minDate}
          maxDate={maxDate}
        />
      </DatePickerWrapper>
    ) : (
      <DatePicker
        selected={value}
        locale={locale === 'ar' ? ar : en}
        popperPlacement='bottom-start'
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
          disabled={isDisable === 'disabled' || selectedOptions.length === 0}
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
  if (input.type === 'ManyToMany' && input.descriptionAr !== 'multiple_select') {
    const lable = JSON.parse(input?.descriptionEn)

    return (
      <div className='w-full'>
        <div className='flex flex-wrap gap-1'>
          {selectedOptions.map((option, index) => (
            <div key={option.Id} className='flex items-center gap-1'>
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
    )
  }

  if (input.type === 'ManyToMany' && input.descriptionAr === 'multiple_select') {
    const lable = JSON.parse(input?.descriptionEn)

    return (
      <Autocomplete
        multiple
        value={value}
        onChange={(event, newValue) => onChange(event, newValue)}
        sx={{ width: 325 }}
        options={selectedOptions}
        filterSelectedOptions
        id='autocomplete-multiple-outlined'
        getOptionLabel={option => option[lable[0]] || ''}
        renderInput={params => <TextField {...params} style={{ width: '100%' }} placeholder={placeholder} />}
      />
    )
  }
}
