import { useIntl } from 'react-intl'
import { axiosGet } from '../axiosCall'
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import { Button, Dialog, DialogContent, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'

function NewElement({
  input,
  onBlur,
  value,
  setValue,
  roles,
  onChangeEvent,
  disabledBtn,
  isDisable,
  readOnly,
  handleSubmit,
  dataRef,
  data,
  refError,
  setTriggerData
}) {
  const [open, setOpen] = useState(false)
  const { locale, messages } = useIntl()
  const [loadingButton, setLoadingButton] = useState(false)
  const buttonRef = useRef(null)

  const handleValidationChanges = e => {
    setValue('checked')
  }

  const handleCheckboxChange = e => {
    if (roles?.onMount?.href) {
      window.open(roles?.onMount?.href, '_blank')
    }
    try {
      if (onChangeEvent) {
        const evaluatedFn = eval('(' + onChangeEvent + ')')

        evaluatedFn(e)
      }
    } catch {}
    if (e.target.checked) {
      if (roles?.onMount?.file) {
        const file = roles?.onMount?.file.replaceAll('/Uploads/', '')
        axiosGet(`file/download/${file}`).then(res => {
          const url = window.URL.createObjectURL(new Blob([res.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', file)
          document.body.appendChild(link)
          link.click()
          link.remove()
          window.URL.revokeObjectURL(url)
        })
      }
    }
    setValue(prev => !prev)
  }

  const guardTermsChecked = e => {
    try {
      // find a terms checkbox new element if present
      const checkboxElement = data?.addMoreElement?.find(ele => ele.key === 'check_box')
      if (checkboxElement) {
        const isChecked = Boolean(dataRef?.current?.[checkboxElement.id])
        if (!isChecked) {
          e?.preventDefault?.()
          e?.stopPropagation?.()
          const msg =
            input?.[locale === 'ar' ? 'warningMessageAr' : 'warningMessageEn'] ||
            (locale === 'ar' ? 'يجب الموافقة على الشروط والأحكام' : 'You should check terms & conditions')
          // using react-toastify here because rest of app uses it for field errors
          try {
            // lazy import local toast if available in this module scope
            const { toast } = require('react-toastify')
            toast.error(msg)
          } catch (_) {
            alert(msg)
          }

          return false
        }
      }
    } catch (_) {}

    return true
  }

  const isConditionSatisfied = () => {
    const trig = roles?.trigger
    if (!trig || !trig?.typeOfValidation || !trig?.selectedField) return true

    const selectedValue = dataRef?.current?.[trig.selectedField]
    const compare = v => (trig?.isEqual === 'equal' ? v == trig?.mainValue : v != trig?.mainValue)

    // For button gating, treat 'optional' and 'enable' as conditions to allow click
    if (trig.typeOfValidation === 'optional' || trig.typeOfValidation === 'enable') {
      return compare(selectedValue)
    }

    // Other trigger types default to allow
    return true
  }

  const guardConditionalRequirement = e => {
    if (!isConditionSatisfied()) {
      e?.preventDefault?.()
      e?.stopPropagation?.()
      const msg =
        input?.[locale === 'ar' ? 'warningMessageAr' : 'warningMessageEn'] ||
        (locale === 'ar' ? 'الرجاء استيفاء الشرط قبل المتابعة' : 'Please satisfy the required condition before proceeding')
      try {
        const { toast } = require('react-toastify')
        toast.error(msg)
      } catch (_) {
        alert(msg)
      }

      return false
    }

    return true
  }

  const handleClick = e => {
    if (!guardTermsChecked(e)) return
    setValue('checked')
    if (roles?.onMount?.print) {
      window.print()
    }
    if (roles?.onMount?.file) {
      const fileUrl = roles?.onMount?.file.replace('/Uploads/', process.env.API_URL + '/file/download/') // Replace with your file URL

      // Create an anchor element
      const link = document.createElement('a')
      link.href = fileUrl

      // Set the download attribute (optional: specify a custom filename)
      link.download = 'custom-filename.pdf' // Replace with desired filename

      // Append the anchor to the body (required for Firefox)
      document.body.appendChild(link)

      // Programmatically click the anchor to trigger the download
      link.click()

      // Remove the anchor from the document
      document.body.removeChild(link)
    }

    const handleSubmitEvent = () => {
      try {
        if (onChangeEvent) {
          const evaluatedFn = eval('(' + onChangeEvent + ')')
          evaluatedFn(e)
        }
      } catch (err) {
        console.log(err)
      }
    }
    if (roles?.type === 'submit') {
      handleSubmit(e, handleSubmitEvent)
    } else {
      handleSubmitEvent()
    }
  }

  function isValidURL(str) {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$',
      'i'
    )

    return !!pattern.test(str)
  }

  if (input.key === 'check_box') {
    return (
      <div>
        <input
          name={input.name_en}
          type='checkbox'
          checked={value}
          onChange={handleCheckboxChange}
          id={input.id}
          onBlur={e => {
            if (onBlur) {
              const evaluatedFn = eval('(' + onBlur + ')')

              evaluatedFn(e)
            }
          }}
        />
        <label htmlFor={input.id}>{input[`name_${locale}`]}</label>
      </div>
    )
  }
  if (input.key === 'tabs') {
    const [activeIndex, setActiveIndex] = useState(
      Math.max(0, input.data.findIndex(t => t.active) || 0)
    )

    // Ensure runtime visibility works before any click by publishing the initial active index
    useEffect(() => {
      try {
        setValue(activeIndex)
        if (setTriggerData) {
          setTriggerData(prev => prev + 1)
        }
      } catch (_) {}
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onTabClick = (index) => {
      setActiveIndex(index)
      // Store active tab index in dataRef via setValue so other fields can read it
      const selectedValue = index
      setValue(selectedValue)
      try {
        if (setTriggerData) {
          setTriggerData(prev => prev + 1)
        }
      } catch (_) {}
      try {
        if (onChangeEvent) {
          const evaluatedFn = eval('(' + onChangeEvent + ')')
          evaluatedFn({ type: 'tabChange', index })
        }
      } catch {}
    }

    // Determine if Next should be disabled based on assigned fields' errors or an optional per-tab condition
    const isNextDisabled = (() => {
      try {
        const tabsElement = (data?.addMoreElement || []).find(ele => ele.id === input.id)
        const currentTab = tabsElement?.data?.[activeIndex] || {}
        // Optional custom condition (string function) evaluated with access to dataRef
        if (currentTab.nextCondition && typeof currentTab.nextCondition === 'string') {
          try {
            const fn = eval('(' + currentTab.nextCondition + ')')
            if (typeof fn === 'function') {
              return !fn({ data: dataRef?.current })
            }
          } catch (_) {}
        }
        const assigned = Array.isArray(currentTab.fields) ? currentTab.fields : []
        if (!assigned.length) return false
        return assigned.some(fid => Array.isArray(refError?.current?.[fid]) && refError.current[fid].length > 0)
      } catch (_) {
        return false
      }
    })()

    return (
      <div className='flex flex-col w-full gap-2'>
        <div className='flex flex-wrap w-full parent-tabs'>
          {input.data.map((item, index) => (
            <button
              key={index}
              type='button'
              className={`btn-tabs ${index === activeIndex ? 'active' : ''}`}
              onClick={() => onTabClick(index)}
            >
              {item[`name_${locale}`]}
            </button>
          ))}
        </div>
        <div className='flex items-center gap-2'>
          <button
            type='button'
            className='px-3 py-1 border rounded text-sm disabled:opacity-50'
            onClick={() => activeIndex > 0 && onTabClick(activeIndex - 1)}
            disabled={activeIndex <= 0}
          >
            {messages?.dialogs?.previous || 'Previous'}
          </button>
          <button
            type='button'
            className='px-3 py-1 border rounded text-sm disabled:opacity-50'
            onClick={() => activeIndex < input.data.length - 1 && onTabClick(activeIndex + 1)}
            disabled={activeIndex >= input.data.length - 1 || isNextDisabled}
          >
            {messages?.dialogs?.next || 'Next'}
          </button>
        </div>
      </div>
    )
  }
  if (input.key === 'text_content') {
    return <div className='text-element'>{input[`name_${locale}`]}</div>
  }
  if (input.key === 'button') {
    if (isValidURL(roles?.onMount?.href)) {
      return (
        <div className='w-full'>
          <a
            href={roles?.onMount?.href}
            className={`btn ${isDisable === 'hide' ? (readOnly ? '' : 'hidden') : ''} block text-center`}
            onClick={e => {
              if (!guardConditionalRequirement(e)) return
              if (!guardTermsChecked(e)) return
              handleClick(e)
            }}
            target='_blank'
            rel='noopener noreferrer'
            disabled={isDisable === 'disable'}
          >
            {input[`name_${locale}`]}
          </a>
        </div>
      )
    }
    if (roles?.onMount?.href) {
      return (
        <div className='w-full'>
          <Link
            href={`/${locale}${roles?.onMount?.href}`}
            className={`btn block text-center  ${isDisable === 'hide' ? (readOnly ? '' : 'hidden') : ''} block`}
            onClick={e => {
              if (!guardConditionalRequirement(e)) return
              if (!guardTermsChecked(e)) return
              handleClick(e)
            }}
            disabled={isDisable === 'disable'}
          >
            {input[`name_${locale}`]}
          </Link>
        </div>
      )
    }

    if (input.kind === 'submit') {
      return (
        <>
          {input?.[locale === 'ar' ? 'warningMessageAr' : 'warningMessageEn'] && (
            <Dialog
              open={Boolean(open)}
              aria-labelledby='alert-dialog-title'
              aria-describedby='alert-dialog-description'
              onClose={() => {
                setOpen(false)
              }}
            >
              <DialogContent>
                <div className='flex flex-col gap-5 justify-center items-center px-1 py-5'>
                  <Typography variant='body1' className='!text-lg' id='alert-dialog-description'>
                    {input?.[locale === 'ar' ? 'warningMessageAr' : 'warningMessageEn']}
                  </Typography>
                  <div className='flex gap-5 justify-between items-end'>
                    <LoadingButton
                      variant='contained'
                      color='primary'
                      type='submit'
                      loading={loadingButton}
                      onClick={e => {
                        handleClick(e)
                        buttonRef.current.type = 'submit'
                        setTimeout(() => {
                          buttonRef.current.click()
                          buttonRef.current.type = 'button'
                          setOpen(false)
                        }, 0)
                      }}
                    >
                      {messages.dialogs.submit}
                    </LoadingButton>
                    <Button color='secondary' variant='contained' onClick={() => setOpen(false)}>
                      {messages.dialogs.cancel}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
          <button
            ref={buttonRef}
            onClick={e => {
              if (!guardConditionalRequirement(e)) return
              if (!guardTermsChecked(e)) return
              if (input?.[locale === 'ar' ? 'warningMessageAr' : 'warningMessageEn']) {
                if (!open) {
                  setOpen(true)
                }
              } else {
                handleClick(e)
              }
            }}
            type={input?.[locale === 'ar' ? 'warningMessageAr' : 'warningMessageEn'] ? 'button' : 'submit'}
            className='btn'
            disabled={disabledBtn}
          >
            {input[`name_${locale}`]}
          </button>
        </>
      )
    }

    console.log(roles, 'roles')

    return (
      <button
        disabled={isDisable === 'disable'}
        onClick={e => {
          if (!guardConditionalRequirement(e)) return
          if (!guardTermsChecked(e)) return
          handleClick(e)
        }}
        type='button'
        className={`btn ${isDisable === 'hide' ? (readOnly ? '' : 'hidden') : ''} block `}
      >
        {input[`name_${locale}`]}
      </button>
    )
  }
}

export default NewElement
