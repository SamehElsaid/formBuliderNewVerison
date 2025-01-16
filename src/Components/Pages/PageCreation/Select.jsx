/* eslint-disable react-hooks/exhaustive-deps */
import {
  Autocomplete,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import Collapse from '@kunukn/react-collapse'
import { axiosGet } from 'src/Components/axiosCall'
import { toast } from 'react-toastify'

function Select({ onChange, data, type }) {
  const { locale } = useIntl()
  const [collection, setCollection] = useState('')
  const [optionsCollection, setOptionsCollection] = useState([])
  const [loadingCollection, setLoadingCollection] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState([])
  const { messages } = useIntl()
  const [getFields, setGetFields] = useState([])
  const [dataSources, setDataSources] = useState([])

  useEffect(() => {
    setLoadingCollection(true)
    axiosGet(`data-source/get`, locale)
      .then(res => {
        if (res.status) {
          setDataSources(res.data)
          onChange({
            ...data,
            data_source_id: res.data[0].id
          })
        }
      })
      .finally(() => {
        setLoadingCollection(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, data.data_source_id])

  console.log(getFields, 'type')

  useEffect(() => {
    if (!data.data_source_id) return
    setLoadingCollection(true)
    axiosGet(`collections/get/?dataSourceId=${data.data_source_id}`, locale)
      .then(res => {
        if (res.status) {
          setOptionsCollection(res.data)
        }
      })
      .finally(() => {
        setLoadingCollection(false)
      })
  }, [locale, data.data_source_id])

  useEffect(() => {
    if (data.collectionId) {
      console.log(data.collectionId, 'data.collectionId')
      axiosGet(`collections/get-by-id?id=${data.collectionId}`, locale).then(res => {
        if (res.status) {
          if (res.data?.id) {
            const loadingToast = toast.loading(locale === 'ar' ? 'يتم التحميل' : 'Loading')
            axiosGet(`collection-fields/get?CollectionId=${res.data.id}`, locale)
              .then(res => {
                if (res.status) {
                  setGetFields(res.data)
                }
              })
              .finally(() => {
                toast.dismiss(loadingToast)
              })
          }
          setCollection(res.data)
        }
      })
    }
  }, [locale, data.collectionId])

  useEffect(() => {
    if (data.selected) {
      setSelectedOptions(data.selected)
    }
  }, [data.selected])

  const handleInputChange = async (event, value) => {
    try {
      const res = await axiosGet(`collections/get/?dataSourceId=${data.data_source_id}`, locale)
      if (res.status) {
        setOptionsCollection(res.data)
      } else {
        setCollection('')
      }
    } finally {
      setLoadingCollection(false)
    }
  }

  const handleChange = event => {
    const { value, checked } = event.target
    setSelectedOptions(prevSelected =>
      checked ? [...prevSelected, value] : prevSelected.filter(item => item !== value)
    )
    const selected = checked ? [...selectedOptions, value] : selectedOptions.filter(item => item !== value)
    onChange({ ...data, selected, type_of_sumbit: data.type_of_sumbit === 'collection' ? '' : data.type_of_sumbit })
  }

  const [viewTable, setViewTable] = useState([])
  useEffect(() => {
    if (type) {
      console.log(selectedOptions, 'selected')

      const getSelected = getFields.filter(
        item => selectedOptions.includes(item.key) && (item.type === 'OneToMany' || item.type === 'OneToOne')
      )
      if (getSelected.length === 0) {
        setViewTable([])

        return
      }

      const dataTable = []

      const loadingToast = toast.loading(locale === 'ar' ? 'يتم التحميل' : 'Loading')
      console.log(getSelected, 'getSelected')
      Promise.all(
        getSelected.map(item => {
          axiosGet(`collection-fields/get?CollectionId=${item.collectionId}`, locale).then(res => {
            if (res.status) {
              dataTable.push({ data: res.data, collectionName: item.key })
            }
          })
        })
      ).finally(() => {
        toast.dismiss(loadingToast)
      })
      setViewTable(dataTable)
    }
  }, [type, selectedOptions.length, locale])


  return (
    <div>
      <Typography variant='h5'>{locale === 'ar' ? 'اختيار التجميعة' : 'Select Collection'}</Typography>
      <form
        className='flex flex-col p-4 h-full'
        onSubmit={e => {
          e.preventDefault()
        }}
      >
        <TextField
          select
          fullWidth
          value={data.data_source_id}
          onChange={e => {
            onChange({
              ...data,
              data_source_id: e.target.value,
              collectionId: false,
              collectionName: false,
              selected: [],
              sortWithId: false
            })
          }}
          label={locale === 'ar' ? 'نوع الارسال' : 'Type Of Submit'}
          variant='filled'
        >
          {dataSources.map(item => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </TextField>
        <div className='mb-4'></div>
        <Autocomplete
          options={loadingCollection ? [] : optionsCollection}
          getOptionLabel={option => (locale === 'ar' ? option.nameAr : option.nameEn) || ''}
          loading={loadingCollection}
          onInputChange={handleInputChange}
          value={collection}
          onChange={(e, value) => {
            setCollection(value)
            onChange({ ...data, collectionId: value?.id, collectionName: value?.key, selected: [], sortWithId: false })
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
          <div className='mt-4'>
            <FormControl component='fieldset' fullWidth>
              <FormLabel component='legend'>{messages.View_Value}</FormLabel>
              <div className='!flex !flex-row !flex-wrap gap-2'>
                {getFields?.map(value => (
                  <FormControlLabel
                    key={value.key}
                    className='!w-fit capitalize'
                    control={
                      <Checkbox
                        value={value.key}
                        checked={selectedOptions.includes(value.key)}
                        onChange={handleChange}
                      />
                    }
                    label={value.key}
                  />
                ))}
              </div>
            </FormControl>
          </div>
          {viewTable.map(item => {
            return (
              <div className='mt-4' key={item.key}>
                {console.log(item, 'item')}
                <FormControl component='fieldset' fullWidth>
                  <FormLabel component='legend'>
                    {messages.View_Value} {item.collectionName}{' '}
                  </FormLabel>
                  <div className='!flex !flex-row !flex-wrap gap-2'>
                    {item.data?.map(value => (
                      <FormControlLabel
                        key={value.key}
                        className='!w-fit capitalize'
                        control={
                          <Checkbox
                            value={value.key}
                            checked={selectedOptions.includes(value.key)}
                            onChange={handleChange}
                          />
                        }
                        label={value.key}
                      />
                    ))}
                  </div>
                </FormControl>
              </div>
            )
          })}
          <div className='mt-4'></div>
          {!type&&
          <>
          <TextField
            select
            fullWidth
            value={data.type_of_sumbit || ''}
            onChange={e => {
              if (e.target.value === 'collection') {
                if (selectedOptions.length !== getFields.length) {
                  toast.error(locale === 'ar' ? 'يجب اختيار كل الحقول' : 'You must select the All fields')

                  return
                }
              }

              onChange({ ...data, type_of_sumbit: e.target.value })
            }}
            label={locale === 'ar' ? 'نوع الارسال' : 'Type Of Submit'}
            variant='filled'
          >
            <MenuItem value={'collection'}>{locale === 'ar' ? 'هذه التجميعة' : 'This Collection'}</MenuItem>
            <MenuItem value={'api'}>{locale === 'ar' ? 'الي Api اخر' : 'Other API'}</MenuItem>
          </TextField>
          <Collapse
            transition={`height 300ms cubic-bezier(.4, 0, .2, 1)`}
            isOpen={Boolean(data.type_of_sumbit === 'api')}
          >
            <TextField
              fullWidth
              value={data.submitApi || ''}
              onChange={e => onChange({ ...data, submitApi: e.target.value })}
              label={locale === 'ar' ? 'ارسال البيانات الي الAPI' : 'Submit To API'}
              variant='filled'
            />
          </Collapse></>
          }
        </Collapse>
      </form>
    </div>
  )
}

export default Select
