/* eslint-disable react-hooks/exhaustive-deps */
import { CircularProgress } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import { axiosGet, axiosPost } from 'src/Components/axiosCall'
import DisplayField from './DisplayField'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { LoadingButton } from '@mui/lab'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import InputControlDesign from './InputControlDesign'

export default function ViewCollection({ data, locale, onChange, readOnly, disabled }) {
  const [getFields, setGetFields] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [reload, setReload] = useState(0)
  const [errors, setErrors] = useState(false)
  const refError = useRef({})
  const dataRef = useRef({})
  const { push } = useRouter()

  useEffect(() => {
    if (data.collectionId) {
      axiosGet(`collection-fields/get?CollectionId=${data.collectionId}`, locale)
        .then(res => {
          if (res.status) {
            if (data.sortWithId) {
              setGetFields(data.sortWithId.map(ele => res.data.find(e => e.id === ele)))
            } else {
              setGetFields(res.data)
              onChange({ ...data, sortWithId: res.data.map(ele => ele.id) })
            }
          }
        })
        .finally(() => setLoading(false))
    } else {
      setGetFields([])
      setLoading(true)
    }
  }, [locale, data.collectionId])

  const handleSubmit = e => {
    console.log(dataRef.current)

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

  const onDragEnd = result => {
    const { destination, source } = result

    if (!destination) {
      return
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    const newFields = Array.from(getFields)
    const [removed] = newFields.splice(source.index, 1)
    newFields.splice(destination.index, 0, removed)

    setGetFields(newFields)
    onChange({ ...data, sortWithId: newFields.map(ele => ele.id) })
  }
  const [open, setOpen] = useState(false)



  const handleClose = () => {
    setOpen(false)
  }

  const design = data?.additional_fields?.find(ele => ele.key === open?.id)?.design ?? open?.options?.uiSchema?.xComponentProps?.cssClass ?? ``


  // const design =  open?.options?.uiSchema?.xComponentProps?.cssClass ?? ``
  const getDesign = useCallback((key,field) => {
    const design = data?.additional_fields?.find(ele => ele.key === key)?.design ?? field?.options?.uiSchema?.xComponentProps?.cssClass ?? ``

    return design
  }, [data?.additional_fields])

  return (
    <div className={`${disabled ? 'text-main' : ''}`}>
      <InputControlDesign open={open} handleClose={handleClose} design={design} locale={locale} data={data} onChange={onChange}/>
      {loading ? (
        <div className='h-[300px]  flex justify-center items-center'>
          <CircularProgress size={50} />
        </div>
      ) : (
        <form className='flex flex-col gap-4' onFocus={() => setErrors(false)} onSubmit={handleSubmit}>
          {!readOnly ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId='fields'>
                {provided => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {getFields
                      .filter(filed => data?.selected?.includes(filed?.key))
                      .map((filed, index) => (
                        <Draggable key={filed.id} draggableId={filed.id} index={index}>
                          {provided => (
                            <div
                              onClick={() => {
                                setOpen(filed)
                              }}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className='relative'
                            >
                              <div className='absolute inset-0 z-20'></div>
                              <DisplayField
                                design={getDesign(filed.id,filed)}
                                input={filed}
                                readOnly={disabled}
                                refError={refError}
                                dataRef={dataRef}
                                reload={reload}
                                errorView={errors?.[filed.key]?.[0]}
                                findError={errors && typeof errors?.[filed.key] === 'object'}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            getFields
              .filter(filed => data?.selected?.includes(filed?.key))
              .map(filed => (
                <div key={filed.id}>
                  <DisplayField
                    input={filed}
                    design={getDesign(filed.id,filed)}
                    readOnly={disabled}
                    refError={refError}
                    dataRef={dataRef}
                    reload={reload}
                    errorView={errors?.[filed.key]?.[0]}
                    findError={errors && typeof errors?.[filed.key] === 'object'}
                  />
                </div>
              ))
          )}
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
