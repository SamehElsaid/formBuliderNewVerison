/* eslint-disable react-hooks/exhaustive-deps */
import { CircularProgress } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import { axiosGet, axiosPost } from 'src/Components/axiosCall'
import DisplayField from './DisplayField'
import { LoadingButton } from '@mui/lab'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import InputControlDesign from './InputControlDesign'
import GridLayout, { WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { DefaultStyle } from 'src/Components/_Shared'

const ResponsiveGridLayout = WidthProvider(GridLayout)

export default function ViewCollection({ data, locale, onChange, readOnly, disabled }) {
  const [getFields, setGetFields] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [reload, setReload] = useState(0)
  const [errors, setErrors] = useState(false)
  const refError = useRef({})
  const dataRef = useRef({})
  const [triggerData, setTriggerData] = useState(0)
  const { push } = useRouter()

  const [layout, setLayout] = useState()
  const addMoreElement = data.addMoreElement ?? []
  const dataLength = getFields.length + addMoreElement.length

  useEffect(() => {
    if (!loading) {
      if (
        data?.layout?.length ===
        [...getFields.filter(filed => data?.selected?.includes(filed?.key)), ...addMoreElement].length
      ) {
        console.log('sa')
        setLayout([...data.layout])
      } else {
        console.log('السيد')

        setLayout(
          [...getFields.filter(filed => data?.selected?.includes(filed?.key)), ...addMoreElement].map((item, index) => {
            return {
              i: item.id,
              x: 0,
              y: index,
              w: 12,
              h: item.type === 'LongText' ? 1.8 : 1
            }
          })
        )
      }
    }
  }, [loading, data?.selected, dataLength])

  useEffect(() => {
    if (data.collectionId) {
      axiosGet(`collection-fields/get?CollectionId=${data.collectionId}`, locale)
        .then(res => {
          if (res.status) {
            setGetFields(res.data)
          }
        })
        .finally(() => setLoading(false))
    } else {
      setGetFields([])
      setLoading(true)
    }
  }, [locale, data.collectionId])

  const handleSubmit = e => {
    e.preventDefault()
    const sendData = { ...dataRef.current }

    if (data.type_of_sumbit === '' || (data.type_of_sumbit === 'api' && !data.submitApi)) {
      return
    }

    const errors = []
    if (refError.current) {
      for (const key in refError.current) {
        if (refError.current[key]) {
          errors.push(refError.current[key])
        }
      }
    }

    addMoreElement.forEach(ele => {
      console.log(ele)
      const additionalFields = data.additional_fields ?? []
      const additionalFieldFind = additionalFields.find(e => e.key === ele.id)
      console.log(additionalFieldFind, additionalFields)

      if (additionalFieldFind?.roles?.onMount?.isRequired && ele.key === 'check_box') {
        if (!dataRef?.current?.[ele.id]) {
          refError.current[ele.id] = ['Required']
          errors.push(refError.current[ele.id])
        }
      }

      delete sendData[`${ele.id}`]
    })

    if (errors.find(ele => typeof ele === 'object')) {
      return setErrors(refError.current)
    }

    setLoadingSubmit(true)

    axiosPost(
      data.type_of_sumbit === 'collection' ? `generic-entities/${data.collectionName}` : data.submitApi,
      locale,
      sendData
    )
      .then(res => {
        if (res.status) {
          setReload(prev => prev + 1)
          toast.success(locale === 'ar' ? 'تم إرسال البيانات بنجاح' : 'Data sent successfully')
          if (data.redirect) {
            push(`/${locale}/setting/pages/${data.redirect}`)
          }
        }
      })
      .finally(() => {
        setLoadingSubmit(false)
      })
  }

  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const defaultDesign =
    open?.type === 'new_element' ? DefaultStyle(open?.key) : open?.options?.uiSchema?.xComponentProps?.cssClass
  let additionalField = null
  const additionalFieldDesign = data?.additional_fields?.find(ele => ele.key === open?.id)?.design
  if (additionalFieldDesign) {
    if (additionalFieldDesign.length === 0) {
      additionalField = null
    } else {
      additionalField = additionalFieldDesign
    }
  }
  const design = additionalField ?? defaultDesign ?? ``

  const roles = data?.additional_fields?.find(ele => ele.key === open?.id)?.roles ?? {
    onMount: { type: '', value: '' },
    trigger: {
      selectedField: null,
      triggerKey: null,
      typeOfValidation: null,
      isEqual: 'equal',
      currentField: 'id'
    },
    placeholder: {
      placeholder_ar: '',
      placeholder_en: ''
    },
    hover: {
      hover_ar: '',
      hover_en: ''
    },
    hint: {
      hint_ar: '',
      hint_en: ''
    },
    event: {},
    afterDateType: '',
    afterDateValue: '',
    beforeDateType: '',
    beforeDateValue: '',
    regex: {
      regex: '',
      message_ar: '',
      message_en: ''
    },
    size: '',
    api_url: '',
    apiKeyData: ''
  }

  const getDesign = useCallback(
    (key, field) => {
      const defaultDesign =
        field?.type === 'new_element' ? DefaultStyle(field?.key) : field?.options?.uiSchema?.xComponentProps?.cssClass

      let additionalField = null
      const additionalFieldDesign = data?.additional_fields?.find(ele => ele.key === key)?.design
      if (additionalFieldDesign) {
        if (additionalFieldDesign.length === 0) {
          additionalField = null
        } else {
          additionalField = additionalFieldDesign
        }
      }

      const design = additionalField ?? defaultDesign ?? ``

      return design
    },
    [data?.additional_fields]
  )

  const refTest = useRef()

  useEffect(() => {
    if (layout) {
      document.querySelectorAll('.drag-handle').forEach((ele, index) => {
        console.log(ele)
        if (ele.querySelector('.react-datepicker-wrapper')) {
          ele.style.zIndex = document.querySelectorAll('.drag-handle').length + 500 - index
        } else {
          ele.style.zIndex = document.querySelectorAll('.drag-handle').length + 50 - index
        }
      })
    }
  }, [layout])

  // console.log(layout);

  return (
    <div className={`${disabled ? 'text-main' : ''}`}>
      <InputControlDesign
        open={open}
        handleClose={handleClose}
        design={design}
        locale={locale}
        roles={roles}
        data={data}
        onChange={onChange}
        fields={getFields.filter(filed => data?.selected?.includes(filed?.key))}
      />
      {loading ? (
        <div className='h-[300px]  flex justify-center items-center text-2xl font-bold border-2 border-dashed border-main rounded-md'>
          {locale === 'ar' ? 'يرجى تحديد نموذج البيانات' : 'Please Select Data Model'}
        </div>
      ) : (
        <form
          className={readOnly ? 'w-[calc(100%)]' : 'w-[calc(100%-107px)]'}
          onClick={() => setErrors(false)}
          onSubmit={handleSubmit}
        >
          <ResponsiveGridLayout
            className='layout'
            layout={layout}
            ref={refTest}
            cols={12}
            rowHeight={71}
            onLayoutChange={newLayout => {
              console.log(newLayout)

              setLayout(newLayout)
              onChange({ ...data, layout: newLayout })
            }}
            draggableHandle='.drag-handle'
            isResizable={!readOnly}
            isDraggable={!readOnly}
            margin={[10, 10]} // هامش بين العناصر
          >
            {[...getFields.filter(filed => data?.selected?.includes(filed?.key)), ...addMoreElement].map(filed => (
              <div key={filed.id} className='relative w-full drag-handle'>
                {!readOnly && (
                  <div
                    onContextMenu={e => {
                      e.preventDefault()
                      setOpen(filed)
                    }}
                    className='absolute inset-0 z-20'
                  ></div>
                )}
                <DisplayField
                  input={filed}
                  design={getDesign(filed.id, filed)}
                  readOnly={disabled}
                  disabledBtn={!data.type_of_sumbit || (data.type_of_sumbit === 'api' && !data.submitApi)}
                  refError={refError}
                  setLayout={setLayout}
                  triggerData={triggerData}
                  data={data}
                  layout={layout}
                  onChangeData={onChange}
                  dataRef={dataRef}
                  setTriggerData={setTriggerData}
                  roles={
                    data?.additional_fields?.find(ele => ele.key === filed.id)?.roles ?? {
                      onMount: { type: '', value: '' },
                      placeholder: {
                        placeholder_ar: '',
                        placeholder_en: ''
                      },
                      hover: {
                        hover_ar: '',
                        hover_en: ''
                      },
                      hint: {
                        hint_ar: '',
                        hint_en: ''
                      },
                      trigger: {
                        selectedField: null,
                        triggerKey: null,
                        typeOfValidation: null,
                        isEqual: 'equal',
                        currentField: 'Id',
                        mainValue: '',
                        parentKey: ''
                      },
                      event: {
                        onChange: '',
                        onBlur: '',
                        onUnmount: ''
                      },
                      afterDateType: '',
                      afterDateValue: '',
                      beforeDateType: '',
                      beforeDateValue: '',
                      regex: {
                        regex: '',
                        message_ar: '',
                        message_en: ''
                      },
                      size: ''
                    }
                  }
                  reload={reload}
                  errorView={errors?.[filed.type === 'new_element' ? filed.id : filed.key]?.[0]}
                  findError={
                    errors && typeof errors?.[filed.type === 'new_element' ? filed.id : filed.key] === 'object'
                  }
                />
              </div>
            ))}
          </ResponsiveGridLayout>
        </form>
      )}
    </div>
  )
}
