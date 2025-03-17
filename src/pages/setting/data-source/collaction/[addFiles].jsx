// // pages/index.js

import { Avatar, Button, Card, CardContent, Chip, IconButton, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import CustomTextField from 'src/@core/components/mui/text-field'
import { getTypeFromCollection } from 'src/Components/_Shared'
import { axiosDelete, axiosGet } from 'src/Components/axiosCall'
import FormBuilder from 'src/Components/Collection/FormBuilder'
import GetCollectionName from 'src/Components/GetCollectionName'
import IconifyIcon from 'src/Components/icon'
import TableEdit from 'src/Components/TableEdit/TableEdit'

function AddField() {
  const { locale, messages } = useIntl()
  const [data, setData] = useState({ collection: null, fields: [] })
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [refresh, setRefresh] = useState(0)
  const [startSearch, setStartSearch] = useState('')

  const {
    query: { addFiles }
  } = useRouter()

  useEffect(() => {
    if (addFiles) {
      Promise.all([
        axiosGet(`collections/get-by-id?id=${addFiles}`),
        axiosGet(`collection-fields/get?CollectionId=${addFiles}`)
      ])
        .then(([res1, res2]) => {
          if (res1.status) {
            setData(prev => ({ ...prev, collection: res1.data }))
          }
          if (res2.status) {
            setData(prev => ({ ...prev, fields: res2.data }))
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [addFiles])

  const [deletePage, setDeletePage] = useState(false)

  const columns = [
    {
      flex: 0.05,
      minWidth: 60,
      field: 'index',
      disableColumnMenu: true,

      headerName: '#',
      renderCell: ({ row }) => (
        <Typography variant='subtitle2' sx={{ fontWeight: 500, color: 'text.secondary' }}>
          {`${row.index + 1}`}
        </Typography>
      )
    },

    {
      flex: 0.5,
      minWidth: 200,
      field: 'name_en',
      disableColumnMenu: true,
      headerName: locale === 'ar' ? 'الحقل بالانجليزية' : 'Field in English',
      renderCell: ({ row }) => (
        <Typography
          variant='subtitle2'
          className='capitalize text-overflow'
          sx={{ fontWeight: 500, color: 'text.secondary' }}
        >
          {row.nameEn}
        </Typography>
      )
    },

    {
      flex: 0.5,
      minWidth: 200,
      field: 'name_ar',
      disableColumnMenu: true,
      headerName: locale === 'ar' ? 'الحقل بالعربية' : 'Field in Arabic',
      renderCell: ({ row }) => (
        <Typography
          variant='subtitle2'
          className='capitalize text-overflow'
          sx={{ fontWeight: 500, color: 'text.secondary' }}
        >
          {row.nameAr}
        </Typography>
      )
    },
    {
      flex: 0.5,
      minWidth: 200,
      field: 'type',
      disableColumnMenu: true,
      headerName: locale === 'ar' ? 'النوع' : 'Type',
      renderCell: ({ row }) => (
        <Typography
          variant='subtitle2'
          className='capitalize text-overflow'
          sx={{ fontWeight: 500, color: 'text.secondary' }}
        >
          {messages[getTypeFromCollection(row.type, row.descriptionAr)]}
        </Typography>
      )
    },
    {
      flex: 0.5,
      minWidth: 200,
      field: 'relation',
      disableColumnMenu: true,
      headerName: locale === 'ar' ? 'العلاقة' : 'Relation',
      renderCell: ({ row }) => (
        <Typography
          variant='subtitle2'
          className='capitalize text-overflow'
          sx={{ fontWeight: 500, color: 'text.secondary' }}
        >
          {true && (row.type === 'OneToOne' || row.type === 'ManyToMany') ? (
            row.type === 'OneToOne' ? (
              <GetCollectionName name={row.options.source} />
            ) : (
              <GetCollectionName name={row.options.target} />
            )
          ) : (
            <Chip label={locale === 'ar' ? 'لا يوجد' : 'Not Found'} />
          )}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'action',
      sortable: false,
      headerName: messages.actions,
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title={locale === 'ar' ? 'تعديل الحقل' : 'Edit Field'}>
            <IconButton size='small' onClick={e => {}}>
              <IconifyIcon icon='tabler:edit' />
            </IconButton>
          </Tooltip>
          <Tooltip title={messages.delete}>
            <IconButton
              size='small'
              onClick={e => {
                setDeletePage(params.row.id)
                if (deletePage !== params.row.id) {
                  toast.info(locale === 'ar' ? 'هل أنت متأكد ؟' : 'Are you sure you want to delete this item?', {
                    position: 'bottom-right',
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored',
                    icon: <IconifyIcon icon='tabler:trash' />,
                    iconColor: 'red',
                    iconSize: 20,
                    iconPosition: 'left',
                    onClick: () => {
                      const loadingToast = toast.loading(locale === 'ar' ? 'جاري حذف الحقل...' : 'Deleting field...')
                      axiosDelete(`collection-fields/delete?collectionFieldId=${params.row.id}`, locale)
                        .then(res => {
                          if (res.status) {
                            toast.success(locale === 'ar' ? 'تم حذف الحقل بنجاح' : 'Field deleted successfully')
                            setData(prev => ({ ...prev, fields: prev.fields.filter(ele => ele.id !== params.row.id) }))
                            setRefresh(prev => prev + 1)
                          }
                        })
                        .finally(() => {
                          toast.dismiss(loadingToast)
                          setDeletePage(false)
                        })
                    },
                    onClose: () => {
                      setDeletePage(false)
                    }
                  })
                }
              }}
            >
              <IconifyIcon icon='tabler:trash' />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  const dataFilter = data?.fields.filter(
    ele =>
      ele.nameEn.toLowerCase().includes(startSearch.toLowerCase()) ||
      ele.nameAr.toLowerCase().includes(startSearch.toLowerCase())
  )

  useEffect(() => {
    if (refresh) {
      axiosGet(`collection-fields/get?CollectionId=${addFiles}`)
        .then(res => {
          if (res.status) {
            setData(prev => ({ ...prev, fields: res.data }))
          }
        })
        .finally(() => {
          setLoading(false)
          setRefresh(0)
        })
    }
  }, [refresh, addFiles])

  return (
    <div>
      <FormBuilder open={open} setOpen={setOpen} setRefresh={setRefresh} />

      <Card className='w-[100%]  mb-5 py-4 '>
        <CardContent
          className='h-full flex-col  md:flex-row gap-2'
          sx={{
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: '0 !important'
          }}
        >
          <div className='flex gap-2 justify-center items-center  '>
            <Typography
              variant='h5'
              sx={{ color: 'primary.main', fontWeight: 'bold' }}
              className='capitalize text-overflow-2 max-w-[250px]'
            >
              {locale === 'ar' ? data?.collection?.nameAr : data?.collection?.nameEn}
            </Typography>
            <Avatar skin='light' sx={{ width: 30, height: 30 }}>
              {data?.fields?.length}
            </Avatar>
          </div>
          <Button variant='contained' color='primary' onClick={() => setOpen(data.collection)}>
            {locale === 'ar' ? 'إضافة حقل' : 'Add Field'}
          </Button>
        </CardContent>
      </Card>
      <Box sx={{ mb: 4 }}>
        <Card className='flex gap-3 flex-wrap md:px-[36px] px-0' sx={{ mb: 6, width: '100%', py: '3.5rem' }}>
          <div className='w-full'>
            <form
              onSubmit={e => {
                e.preventDefault()
              }}
              className='px-5 ~~ mb-5 || flex ~~ flex-col  items-center md:items-end w-full || md:flex-row || gap-2'
            >
              <CustomTextField
                id='input'
                label={locale === 'ar' ? 'البحث' : 'Search'}
                value={startSearch}
                onChange={e => {
                  setStartSearch(e.target.value)
                }}
              />
              {startSearch && (
                <Button
                  variant='contained'
                  color='error'
                  onClick={() => {
                    setStartSearch('')
                  }}
                >
                  {locale === 'ar' ? 'اعادة التعيين' : 'Reset'}
                </Button>
              )}
            </form>

            <TableEdit
              InvitationsColumns={columns}
              data={dataFilter?.map((ele, i) => {
                const fData = { ...ele }
                fData.index = i + paginationModel.page * paginationModel.pageSize

                return fData
              })}
              getRowId={row => row.index}
              loading={loading}
              locale={locale}
              noRow={locale === 'ar' ? 'لا يوجد' : 'Not Found'}
              paginationModel={paginationModel}
              setPaginationModel={setPaginationModel}
            />
          </div>
        </Card>
      </Box>
    </div>
  )
}

export default AddField
