import styled from '@emotion/styled'
import {
  Autocomplete,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  FormControl,
  FormControlLabel,
  FormLabel,
  TextField,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import Collapse from '@kunukn/react-collapse'
import { LoadingButton } from '@mui/lab'
import { axiosGet } from 'src/Components/axiosCall'

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

function Select({ onChange, data }) {
  console.log('data', data)
  const { locale } = useIntl()
  const [open, setOpen] = useState(true)
  const [collection, setCollection] = useState('')
  const [optionsCollection, setOptionsCollection] = useState([])
  const [loadingCollection, setLoadingCollection] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState([])
  const { messages } = useIntl()

  const handleChange = event => {
    const { value, checked } = event.target
    setSelectedOptions(prevSelected =>
      checked ? [...prevSelected, value] : prevSelected.filter(item => item !== value)
    )
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleInputChange = async (event, value) => {
    console.log(value)

    // setLoadingCollection(true)

    try {
      const res = await axiosGet(`collections`, locale)
      if (res) {
        setOptionsCollection(res)
      }
    } finally {
      setLoadingCollection(false)
    }
  }

  console.log(selectedOptions, collection)

  return (
    <div>
      <Dialog open={open} fullWidth>
        <Header>
          <Typography variant='h5'>{locale === 'ar' ? 'اختيار التجميعة' : 'Select Collection'}</Typography>
        </Header>
        <Box sx={{ p: theme => theme.spacing(0, 6, 6) }} className='h-full'>
          <form
            className='flex flex-col p-4 h-full'
            onSubmit={e => {
              e.preventDefault()

              // setSelectCollection({selectedOptions,collection})

              onChange({ ...data, selectCollection: { selectedOptions, collection } }) // Update the title using onChange
            }}
          >
            <Autocomplete
              options={loadingCollection ? [] : optionsCollection}
              getOptionLabel={option => (locale === 'ar' ? option.name_ar : option.name_en) || ''}
              loading={loadingCollection}
              onInputChange={handleInputChange}
              value={collection}
              onChange={(e, value) => {
                setCollection(value)
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
                option.name_en !== collection?.name_en ? (
                  <Box sx={{ direction: locale === 'ar' ? 'rtl' : '' }} component='li' {...props}>
                    {locale === 'ar' ? option.name_ar : option.name_en}
                  </Box>
                ) : null
              }
            />

            <Collapse transition={`height 300ms cubic-bezier(.4, 0, .2, 1)`} isOpen={Boolean(collection?.name_en)}>
              <div className='px-4 mt-4'>
                <FormControl component='fieldset' fullWidth>
                  <FormLabel component='legend'>{messages.View_Value}</FormLabel>
                  <div className='!flex !flex-row !flex-wrap gap-2'>
                    {collection?.fields?.map(
                      value =>
                        value.type !== 'validations' && (
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
                            label={locale === 'ar' ? value.label : value.label_en}
                          />
                        )
                    )}
                  </div>
                </FormControl>
              </div>
            </Collapse>

            <Box sx={{ display: 'flex', alignItems: 'center' }} className='gap-4 justify-end py-4 mt-auto'>
              <LoadingButton type='submit' variant='contained'>
                {locale === 'ar' ? 'ارسال' : 'Submit'}
              </LoadingButton>
              <Button variant='tonal' color='secondary' onClick={handleClose}>
                {locale === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
            </Box>
          </form>
        </Box>
      </Dialog>
    </div>
  )
}

export default Select
