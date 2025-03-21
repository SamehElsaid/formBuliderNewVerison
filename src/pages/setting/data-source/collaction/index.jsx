import { Avatar, Button, Card, CardContent, IconButton, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useIntl } from 'react-intl'
import { axiosDelete, axiosGet } from 'src/Components/axiosCall'
import { toast } from 'react-toastify'
import TableEdit from 'src/Components/TableEdit/TableEdit'
import IconifyIcon from 'src/Components/icon'
import AddCollection from 'src/Components/Collection/AddCollection'
import FormBuilder from 'src/Components/Collection/FormBuilder'
import { useRouter } from 'next/router'

export default function Index() {
  const { locale, messages } = useIntl()
  const [open, setOpen] = useState(false)
  const [startSearch, setStartSearch] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState(0)
  const [data, setData] = useState([])

  const dataFilter = data?.filter(
    ele =>
      ele.nameEn.toLowerCase().includes(startSearch.toLowerCase()) ||
      ele.nameAr.toLowerCase().includes(startSearch.toLowerCase())
  )

  const {
    query: { dataSourceId }
  } = useRouter()

  useEffect(() => {
    if (!dataSourceId) return
    setLoading(true)
    const loadingToast = toast.loading(locale === 'ar' ? 'جاري التحميل...' : 'Loading...')
    axiosGet(`collections/get/?dataSourceId=${dataSourceId}`, locale)
      .then(res => {
        if (res.status) {
          setData(res.data)
        }
      })
      .finally(() => {
        setLoading(false)
        toast.dismiss(loadingToast)
      })
  }, [locale, paginationModel.page, paginationModel.pageSize, refresh, dataSourceId])

  const handleClose = () => {
    setOpen(false)
  }
  const [deletePage, setDeletePage] = useState(false)
  const { push } = useRouter()

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
      headerName: messages.collectionNameEN,
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
      headerName: messages.collectionNameAR,
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
      flex: 0.1,
      minWidth: 130,
      field: 'action',
      sortable: false,
      headerName: messages.actions,
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title={locale === 'ar' ? 'عرض جميع الحقول' : 'View All Fields'}>
            <IconButton
              size='small'
              onClick={e => {
                push(`/${locale}/setting/data-source/collaction/${params.row.id}?dataSourceId=${dataSourceId}`)
              }}
            >
              <IconifyIcon icon='tabler:eye' />
            </IconButton>
          </Tooltip>
          <Tooltip title={locale === 'ar' ? 'تعديل النموذج' : 'Edit Model'}>
            <IconButton
              size='small'
              onClick={e => {
                setOpen(params.row)
              }}
            >
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
                      const loadingToast = toast.loading(locale === 'ar' ? 'جاري حذف النموذج...' : 'Deleting model...')
                      axiosDelete(`collections/delete?collectionId=${params.row.id}`, locale)
                        .then(res => {
                          if (res.status) {
                            toast.success(locale === 'ar' ? 'تم حذف النموذج بنجاح' : 'Model deleted successfully')
                            setData(data.filter((item, i) => i !== params.row.index))
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

  return (
    <div>
      <AddCollection open={open} toggle={handleClose} setRefresh={setRefresh} />
      <Card className='w-[100%]  mb-5 py-4 '>
        <CardContent
          className='h-full'
          sx={{
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: '0 !important'
          }}
        >
          <div className='flex gap-2 justify-center items-center'>
            <Typography variant='h5' sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              {locale === 'ar' ? 'نموذج البيانات' : 'Data Model '}
            </Typography>
            <Avatar skin='light' sx={{ width: 30, height: 30 }}>
              {data?.length}
            </Avatar>
          </div>
          <Button variant='contained' color='primary' onClick={() => setOpen(true)}>
            {locale === 'ar' ? 'إضافة نموذج البيانات' : 'Add Data Model'}
          </Button>
        </CardContent>
      </Card>
      <Box sx={{ mb: 4 }}>
        <Card className='flex gap-3 flex-wrap md:px-[36px] px-0' sx={{ mb: 6, width: '100%', py: '3.5rem' }}>
          <div className='w-full'>
            <form
              onSubmit={e => {
                // e.preventDefault()
                // setStartSearch(e.target.elements.input.value)
                // setPaginationModel({ page: 0, pageSize: 10 })
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
