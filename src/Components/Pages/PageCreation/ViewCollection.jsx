/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from 'react'
import { axiosGet, axiosPost } from 'src/Components/axiosCall'
import DisplayField from './DisplayField'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import InputControlDesign from './InputControlDesign'
import GridLayout, { WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { DefaultStyle, getTypeFromCollection, getZIndex, VaildId } from 'src/Components/_Shared'
import { IoMdSettings } from 'react-icons/io'
import { useIntl } from 'react-intl'

const ResponsiveGridLayout = WidthProvider(GridLayout)

export default function ViewCollection({ data, locale, onChange, readOnly, disabled, workflowId }) {
  const [getFields, setGetFields] = useState([])
  const [loading, setLoading] = useState(true)
  const [redirect, setRedirect] = useState(false)
  const [reload, setReload] = useState(0)
  const [errors, setErrors] = useState(false)
  const refError = useRef({})
  const dataRef = useRef({})
  const [triggerData, setTriggerData] = useState(0)
  const [assignTabIndex, setAssignTabIndex] = useState(0)
  const [renameTabIndex, setRenameTabIndex] = useState(0)
  const [renameTabValueAr, setRenameTabValueAr] = useState('')
  const [renameTabValueEn, setRenameTabValueEn] = useState('')

  console.log(data, 'data')

  const {
    query: { entityid },
    push
  } = useRouter()
  const { messages } = useIntl()

  const [layout, setLayout] = useState()
  const addMoreElement = data.addMoreElement ?? []
  const dataLength = getFields.length + addMoreElement.length

  const convertTheTheSameYToGroup = layout
    ? Object?.values(
        layout?.reduce((acc, item) => ((acc[Math.floor(item.y)] = acc[Math.floor(item.y)] || []).push(item), acc), {})
      )
    : []
  const SortWithXInGroup = convertTheTheSameYToGroup.map(group => group.sort((a, b) => a.x - b.x))
  const sortedData = SortWithXInGroup.flat()
  const filterSelect = getFields

  useEffect(() => {
    if (!loading) {
      if (data?.layout?.length === [...filterSelect, ...addMoreElement].length) {
        setLayout([...data.layout])
      } else {
        setLayout(
          [...filterSelect, ...addMoreElement].map((item, index) => {
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
      Promise.all([
        ...(data?.SelectedRelatedCollectionsFields?.map(async item => {
          const res = await axiosGet(`collection-fields/get?CollectionId=${item.collection.id}`, locale)
          if (res.status) {
            const selectedFields = res.data.filter(field => item.selected.includes(field.key))

            return selectedFields.map(field => ({ ...field, key: field.key + '[' + item.collection.key + ']' }))
          }

          return []
        }) || []),

        axiosGet(`collection-fields/get?CollectionId=${data.collectionId}`, locale).then(res => {
          if (res.status) {
            const associationsConfig = data.associationsConfig || []

            console.log(associationsConfig, 'associationsConfig')

            const filterData = res.data
              .filter(field => data?.selected?.includes(field?.key))
              .map(field => {
                const find = associationsConfig.find(item => item?.key === field?.key)
                const filedData = { ...field }
                if (find) {
                  filedData.kind = find.viewType
                  filedData.descriptionEn = JSON.stringify(find.selectedOptions)
                  filedData.getDataForm = find.dataSourceType
                  filedData.externalApi = find.externalApi
                  filedData.staticData = find.staticData
                  filedData.selectedValueSend = JSON.stringify(find.selectedValueSend)
                  filedData.apiHeaders = find.apiHeaders
                }

                return filedData
              })

            return filterData
          }

          return []
        })
      ])
        .then(results => {
          const validResults = results.filter(Boolean)
          const flatResults = validResults.flat()
          setGetFields(flatResults)
        })
        .finally(() => setLoading(false))
    } else {
      setGetFields([])
      setLoading(true)
    }
  }, [locale, data.collectionId, data.SelectedRelatedCollectionsFields, data.selected])

  const handleSubmit = (e, handleSubmitEvent) => {
    e.preventDefault()

    const initialSendData = { ...dataRef.current }
    if (data.submitApi?.includes('/api/Account/Register')) {
      delete initialSendData.pageWorkflows
      initialSendData.createdBy = 'system'
    }
    const sendData = {}
    Object.keys(initialSendData).forEach(key => {
      const keyData = key
      if (initialSendData[keyData] !== null) {
        sendData[keyData] = initialSendData[keyData]
      }
      if (Array.isArray(initialSendData[keyData])) {
        sendData[keyData] = initialSendData[keyData].map(item => item.Id || item)
      }
    })
    if (data.type_of_sumbit === '' || (data.type_of_sumbit === 'api' && !data.submitApi)) {
      return
    }

    const dynamicUrl = data?.redirect?.replace(/\{(\w+)\}/g, (match, key) => {
      const value = sendData[key]

      return value ? encodeURIComponent(value) : ''
    })

    const finalUrl = dynamicUrl?.includes('=') && !dynamicUrl?.endsWith('=') ? dynamicUrl : '/otp'

    const errors = []
    if (refError.current) {
      for (const key in refError.current) {
        if (refError.current[key]) {
          errors.push(refError.current[key])
        }
      }
    }

    addMoreElement.forEach(ele => {
      const additionalFields = data.additional_fields ?? []
      const additionalFieldFind = additionalFields.find(e => e.key === ele.id)

      if (additionalFieldFind?.roles?.onMount?.isRequired && ele?.type === 'new_element') {
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

    const output = {}

    Object.entries(sendData).forEach(([key, value]) => {
      const match = key.match(/^(.+)\[(.+)\]$/)
      if (match) {
        const [, mainKey, subKey] = match
        output[subKey] = output[subKey] || {}
        output[subKey][mainKey] = value
      } else {
        output[key] = value
      }
    })


    const apiCall = data.type_of_sumbit === 'collection' ? `generic-entities/${data.collectionName}` : data.submitApi

    axiosPost(apiCall, locale, output, false, false, data.type_of_sumbit !== 'collection' ? true : false).then(res => {
      if (res.status) {
        setReload(prev => prev + 1)
        toast.success(messages.dialogs.dataSentSuccessfully)
        if (data.onSubmit) {
          const evaluatedFn = eval('(' + data.onSubmit + ')')
          if (handleSubmitEvent) {
            handleSubmitEvent()
          } else {
            evaluatedFn()
          }
        }
        if (data.redirect === '{{redirect}}') {
          if (redirect) {
            push(`/${locale}/${redirect}`)
          }

          return
        }
        if (data?.redirect) {
          push(`/${locale}/${finalUrl}`)
        }
      }
    })
  }

  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const defaultDesign =
    open?.type === 'new_element'
      ? DefaultStyle(open?.key)
      : open?.kind
      ? DefaultStyle(getTypeFromCollection(open?.type ?? 'SingleText', open?.kind))
      : open?.options?.uiSchema?.xComponentProps?.cssClass ??
        DefaultStyle(getTypeFromCollection(open?.type ?? 'SingleText'))
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
      let defaultDesign = null
      if (field?.type === 'new_element') {
        defaultDesign = DefaultStyle(field?.key)
      } else {
        if (field?.kind) {
          defaultDesign = DefaultStyle(getTypeFromCollection(field.type, field.kind || field.descriptionAr))
        } else {
          if (field?.options?.uiSchema?.xComponentProps?.cssClass) {
            defaultDesign = field?.options?.uiSchema?.xComponentProps?.cssClass
          } else {
            defaultDesign = DefaultStyle(getTypeFromCollection(field.type, field.kind || field.descriptionAr))
          }
        }
      }
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
      sortedData.forEach((ele, index) => {
        const element = document.querySelector('.ss' + ele.i)
        if (element) {
          element.style.zIndex = sortedData.length + 50000 - index
        }
      })
    }
  }, [layout])

  const sortedLoop = [...filterSelect, ...addMoreElement].sort(
    (a, b) =>
      (sortedData.findIndex(f => f.i === a.id) === -1 ? Infinity : sortedData.findIndex(f => f.i === a.id)) -
      (sortedData.findIndex(f => f.i === b.id) === -1 ? Infinity : sortedData.findIndex(f => f.i === b.id))
  )

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
        fields={filterSelect}
      />
      {!readOnly && (
        <div className='flex flex-col gap-2 mb-3'>
          <div className='flex justify-between items-center p-2 rounded-md border-2 border-dashed border-main-color bg-white/70'>
          {(() => {
            const tabsElement = (data.addMoreElement || []).find(ele => ele.key === 'tabs')
            if (tabsElement) {
              return (
                <div className='flex gap-2 items-center'>
                  <button
                    type='button'
                    className='px-3 py-1 rounded text-sm bg-main-color text-white hover:bg-main-color/90 shadow'
                    onClick={() => {
                      const addMore = [...(data.addMoreElement || [])]
                      const idx = addMore.findIndex(ele => ele.id === tabsElement.id)
                      if (idx > -1) {
                        const next = { ...addMore[idx] }
                        const count = (next.data || []).length + 1
                        next.data = [
                          { name_ar: `تبويب ${count}`, name_en: `Tab ${count}`, link: '', active: false, fields: [] },
                          ...(next.data || [])
                        ]
                        addMore[idx] = next
                        onChange({ ...data, addMoreElement: addMore })
                      }
                    }}
                  >
                    {messages?.Add_Tab || 'Add Tab'}
                  </button>
                  <span className='text-xs text-gray-500'>|</span>
                  <button
                    type='button'
                    className='px-3 py-1 rounded text-sm border border-main-color text-main-color hover:bg-main-color/5 shadow'
                    onClick={() => {
                      // Auto-arrange all inputs sequentially (x=0, w=12) with Tabs pinned to top if present
                      const tabsEl = (addMoreElement || []).find(ele => ele.key === 'tabs')
                      const fields = [...(getFields || [])]
                      const extras = (addMoreElement || []).filter(ele => ele?.id !== tabsEl?.id)
                      const items = tabsEl ? [tabsEl, ...fields, ...extras] : [...fields, ...extras]
                      const newLayout = items.map((item, index) => ({ i: item.id, x: 0, y: index, w: 12, h: item.type === 'LongText' ? 1.8 : 1 }))
                      setLayout(newLayout)
                      onChange({ ...data, layout: newLayout })
                    }}
                  >
                    {messages?.Arrange_Inputs || 'Arrange Inputs'}
                  </button>
                </div>
              )
            }

            return (
              <button
                type='button'
                  className='px-3 py-1 rounded text-sm bg-main-color text-white hover:bg-main-color/90 shadow'
                onClick={() => {
                  const addMore = [...(data.addMoreElement || [])]
                  addMore.push({
                    name_ar: 'التبويبات',
                    name_en: 'Tabs',
                    key: 'tabs',
                    type: 'new_element',
                    data: [
                      { name_ar: 'التبويب الاول', name_en: 'Tab 1', link: '', active: true, fields: [] }
                    ],
                    id: 's' + new Date().getTime()
                  })
                  onChange({ ...data, addMoreElement: addMore })
                }}
              >
                {messages?.Add_Tabs || 'Add Tabs'}
              </button>
            )
          })()}
          </div>
          {/* Rename tab UI */}
          {(() => {
            const tabsElement = (data.addMoreElement || []).find(ele => ele.key === 'tabs')
            if (!tabsElement) return null
            const tabs = Array.isArray(tabsElement.data) ? tabsElement.data : []
            const safeIndex = Math.min(Math.max(renameTabIndex, 0), Math.max(0, tabs.length - 1))
            return (
              <div className='flex flex-wrap gap-2 items-center p-3 rounded-md border-2 border-dashed border-main-color bg-white/70'>
                <span className='text-sm font-semibold text-main-color'>{messages?.Rename_Tab || 'Rename Tab'}</span>
                <select
                  className='px-2 py-1 border border-main-color rounded text-sm bg-white focus:outline-none'
                  value={safeIndex}
                  onChange={e => {
                    const idx = parseInt(e.target.value, 10) || 0
                    setRenameTabIndex(idx)
                    const t = tabs[idx] || {}
                    setRenameTabValueAr(t?.name_ar || '')
                    setRenameTabValueEn(t?.name_en || '')
                  }}
                >
                  {tabs.map((t, ti) => (
                    <option key={ti} value={ti}>
                      {t?.[`name_${locale}`] || t?.name_en || t?.name_ar || `Tab ${ti + 1}`}
                    </option>
                  ))}
                </select>
                <input
                  className='px-2 py-1 border border-main-color rounded text-sm focus:outline-none'
                  placeholder='Name (AR)'
                  value={renameTabValueAr}
                  onChange={e => setRenameTabValueAr(e.target.value)}
                />
                <input
                  className='px-2 py-1 border border-main-color rounded text-sm focus:outline-none'
                  placeholder='Name (EN)'
                  value={renameTabValueEn}
                  onChange={e => setRenameTabValueEn(e.target.value)}
                />
                <button
                  type='button'
                  className='px-3 py-1 rounded text-sm bg-main-color text-white hover:bg-main-color/90 shadow'
                  onClick={() => {
                    const addMore = [...(data.addMoreElement || [])]
                    const tabsIdx = addMore.findIndex(ele => ele.id === tabsElement.id)
                    if (tabsIdx === -1) return
                    const nextTabsEl = { ...addMore[tabsIdx] }
                    const nextData = [...(nextTabsEl.data || [])]
                    const t = { ...(nextData[safeIndex] || {}) }
                    t.name_ar = (renameTabValueAr || '').trim()
                    t.name_en = (renameTabValueEn || '').trim()
                    nextData[safeIndex] = t
                    nextTabsEl.data = nextData
                    addMore[tabsIdx] = nextTabsEl
                    onChange({ ...data, addMoreElement: addMore })
                  }}
                >
                  {messages?.Save || 'Save'}
                </button>
              </div>
            )
          })()}
          {(() => {
            const tabsElement = (data.addMoreElement || []).find(ele => ele.key === 'tabs')
            if (!tabsElement) return null
            const tabs = Array.isArray(tabsElement.data) ? tabsElement.data : []
            const currentIndex = Math.min(Math.max(assignTabIndex, 0), Math.max(0, tabs.length - 1))
            const fieldsList = filterSelect || []
            return (
              <div className='flex flex-col gap-2 p-2 border rounded'>
                <div className='flex items-center gap-2'>
                  <span className='text-sm'>{messages?.Select_Tab || 'Select Tab'}</span>
                  <select
                    className='px-2 py-1 border rounded text-sm bg-white'
                    value={currentIndex}
                    onChange={e => setAssignTabIndex(parseInt(e.target.value, 10) || 0)}
                  >
                    {tabs.map((t, ti) => (
                      <option key={ti} value={ti}>
                        {t?.[`name_${locale}`] || t?.name_en || t?.name_ar || `Tab ${ti + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {fieldsList.map(f => {
                    const fieldId = f?.key ?? f?.id
                    const assigned = Array.isArray(tabs[currentIndex]?.fields)
                      ? tabs[currentIndex].fields.includes(fieldId)
                      : false
                    return (
                      <label key={fieldId} className='flex items-center gap-1 text-sm border rounded px-2 py-1'>
                        <input
                          type='checkbox'
                          checked={assigned}
                          onChange={() => {
                            const addMore = [...(data.addMoreElement || [])]
                            const tabsIdx = addMore.findIndex(ele => ele.id === tabsElement.id)
                            if (tabsIdx === -1) return
                            const nextTabsEl = { ...addMore[tabsIdx] }
                            const nextData = [...(nextTabsEl.data || [])]
                            const tabObj = { ...(nextData[currentIndex] || {}) }
                            const current = Array.isArray(tabObj.fields) ? tabObj.fields : []
                            tabObj.fields = assigned
                              ? current.filter(id => id !== fieldId)
                              : [...current, fieldId]
                            nextData[currentIndex] = tabObj
                            nextTabsEl.data = nextData
                            addMore[tabsIdx] = nextTabsEl
                            onChange({ ...data, addMoreElement: addMore })
                          }}
                        />
                        <span>{locale === 'ar' ? f.nameAr : f.nameEn}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            )
          })()}
        </div>
      )}
      {loading ? (
        <div className='h-[300px]  flex justify-center items-center text-2xl font-bold border-2 border-dashed border-main rounded-md'>
          {messages.pleaseSelectDataModel}
        </div>
      ) : (
        <form className={'w-[calc(100%)]'} onClick={() => setErrors(false)} onSubmit={handleSubmit}>
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
            {sortedLoop.map((filed, i) => {
              const roles = data?.additional_fields?.find(ele => ele.key === filed.id)?.roles ?? {
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
              const hoverText = roles?.hover?.hover_ar || roles?.hover?.hover_en
              const hintText = roles?.hint?.hint_ar || roles?.hint?.hint_en

              return (
                <div
                  key={filed.id}
                  className={`relative w-full ${
                    filed.type === 'new_element' ? `s${filed.id}` : 'ss' + filed.id
                  } drag-handle  ${!readOnly ? 'px-2' : ''} ${hoverText || hintText ? '!z-[5555555]' : ''}`}
                >
                  {!readOnly && (
                    <div className='absolute inset-0 z-20 flex || justify-end border-main-color border-dashed border rounded-md'>
                      <button
                        type='button'
                        title={locale !== 'ar' ? 'Setting' : 'التحكم'}
                        onMouseDown={e => {
                          e.stopPropagation()
                        }}
                        onClick={e => {
                          e.stopPropagation()
                          setOpen(filed)
                        }}
                        className='w-[30px] || h-[30px] hover:bg-main-color hover:text-white duration-200 || rounded-lg || shadow-2xl text-xl flex || items-center justify-center bg-white border-main-color border'
                      >
                        <IoMdSettings />
                      </button>
                      {/* Quick tab assign */}
                      {(() => {
                        const tabsElement = (data.addMoreElement || []).find(ele => ele.key === 'tabs')
                        if (!tabsElement) return null
                        const tabs = tabsElement.data || []
                        const fieldId = filed.type === 'new_element' ? filed.id : filed.key
                        const currentIndex = Math.max(
                          -1,
                          tabs.findIndex(t => Array.isArray(t.fields) && t.fields.includes(fieldId))
                        )
                        return (
                          <select
                            className='ml-2 p-1 border rounded text-sm bg-white'
                            value={currentIndex}
                            onChange={e => {
                              const idx = parseInt(e.target.value, 10)
                              const addMore = [...(data.addMoreElement || [])]
                              const tabsIdx = addMore.findIndex(ele => ele.id === tabsElement.id)
                              if (tabsIdx === -1) return
                              const nextTabsEl = { ...addMore[tabsIdx] }
                              const nextData = [...(nextTabsEl.data || [])]
                              // remove from all
                              for (let i = 0; i < nextData.length; i++) {
                                const t = { ...(nextData[i] || {}) }
                                const arr = Array.isArray(t.fields) ? t.fields : []
                                if (arr.includes(fieldId)) {
                                  t.fields = arr.filter(id => id !== fieldId)
                                  nextData[i] = t
                                }
                              }
                              // assign if not -1
                              if (!Number.isNaN(idx) && idx > -1 && idx < nextData.length) {
                                const t = { ...(nextData[idx] || {}) }
                                const arr = Array.isArray(t.fields) ? t.fields : []
                                if (!arr.includes(fieldId)) {
                                  t.fields = [...arr, fieldId]
                                  nextData[idx] = t
                                }
                              }
                              nextTabsEl.data = nextData
                              addMore[tabsIdx] = nextTabsEl
                              onChange({ ...data, addMoreElement: addMore })
                            }}
                          >
                            <option value={-1}>{messages?.None || 'None'}</option>
                            {tabs.map((t, ti) => (
                              <option key={ti} value={ti}>
                                {t?.[`name_${locale}`] || t?.name_en || t?.name_ar || `Tab ${ti + 1}`}
                              </option>
                            ))}
                          </select>
                        )
                      })()}
                    </div>
                  )}

                  <DisplayField
                    handleSubmit={handleSubmit}
                    input={filed}
                    setRedirect={setRedirect}
                    isRedirect={data.redirect === '{{redirect}}'}
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
                    roles={roles}
                    reload={reload}
                    errorView={errors?.[filed.type === 'new_element' ? filed.id : filed.key]?.[0]}
                    findError={
                      errors && typeof errors?.[filed.type === 'new_element' ? filed.id : filed.key] === 'object'
                    }
                  />
                </div>
              )
            })}
          </ResponsiveGridLayout>
        </form>
      )}
    </div>
  )
}
