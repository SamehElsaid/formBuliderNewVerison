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

  useEffect(() => {
    if (!loading) {
      if (data?.layout?.length === getFields.length) {
        setLayout(data.layout)
      } else {
        setLayout(
          getFields
            .filter(filed => data?.selected?.includes(filed?.key))
            .map((item, index) => {
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
  }, [getFields.length, loading, data?.selected])

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
    if (errors.find(ele => typeof ele === 'object')) {
      return setErrors(refError.current)
    }

    setLoadingSubmit(true)
    const sendData = { ...dataRef.current }

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

  const design =
    data?.additional_fields?.find(ele => ele.key === open?.id)?.design ??
    open?.options?.uiSchema?.xComponentProps?.cssClass ??
    ``

  const roles = data?.additional_fields?.find(ele => ele.key === open?.id)?.roles ?? {
    onMount: { type: '', value: '' },
    trigger: {
      selectedField: null,
      triggerKey: null,
      typeOfValidation: null,
      isEqual: 'equal',
      currentField: 'id'
    },
    event: {}
  }

  // const design =  open?.options?.uiSchema?.xComponentProps?.cssClass ?? ``
  const getDesign = useCallback(
    (key, field) => {
      const design =
        data?.additional_fields?.find(ele => ele.key === key)?.design ??
        field?.options?.uiSchema?.xComponentProps?.cssClass ??
        ``

      return design
    },
    [data?.additional_fields]
  )

  const refTest = useRef()

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
        <div className='h-[300px]  flex justify-center items-center'>
          <CircularProgress size={50} />
        </div>
      ) : (
        <form
          className={readOnly ? 'w-[calc(100%)]' : 'w-[calc(100%-107px)]'}
          onFocus={() => setErrors(false)}
          onSubmit={handleSubmit}
        >
          <ResponsiveGridLayout
            className='layout'
            layout={layout}
            ref={refTest}
            cols={12}
            rowHeight={71}
            onLayoutChange={newLayout => {
              setLayout(newLayout)
              onChange({ ...data, layout: newLayout })
            }}
            draggableHandle='.drag-handle'
            isResizable={!readOnly}
            isDraggable={!readOnly}
            margin={[10, 10]} // هامش بين العناصر
          >
            {getFields
              .filter(filed => data?.selected?.includes(filed?.key))
              .map(filed => (
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
                        trigger: {
                          selectedField: null,
                          triggerKey: null,
                          typeOfValidation: null,
                          isEqual: 'equal',
                          currentField: 'id'
                        },
                        event: {
                          onChange: '',
                          onBlur: '',
                          onUnmount: ''
                        }
                      }
                    }
                    reload={reload}
                    errorView={errors?.[filed.key]?.[0]}
                    findError={errors && typeof errors?.[filed.key] === 'object'}
                  />
                </div>
              ))}
          </ResponsiveGridLayout>
          {/* {!readOnly ? (
          ) : (
            getFields
              .filter(filed => data?.selected?.includes(filed?.key))
              .map(filed => (
                <div key={filed.id} className='relative'>
                  <DisplayField
                    input={filed}
                    design={getDesign(filed.id, filed)}
                    readOnly={disabled}
                    refError={refError}
                    dataRef={dataRef}
                    reload={reload}
                    errorView={errors?.[filed.key]?.[0]}
                    findError={errors && typeof errors?.[filed.key] === 'object'}
                  />
                </div>
              ))
          )} */}
          <div className='flex justify-center'>
            <LoadingButton
              loading={loadingSubmit}
              variant='contained'
              disabled={!data.type_of_sumbit || (data.type_of_sumbit === 'api' && !data.submitApi)}
              type='submit'
            >
              {locale === 'ar' ? 'ارسال' : 'Submit'}
            </LoadingButton>
          </div>
        </form>
      )}
    </div>
  )
}
