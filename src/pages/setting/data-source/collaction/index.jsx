import {
  Avatar,
  Button,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useIntl } from 'react-intl'
import { axiosDelete, axiosGet } from 'src/Components/axiosCall'
import { toast } from 'react-toastify'
import TableEdit from 'src/Components/TableEdit/TableEdit'
import IconifyIcon from 'src/Components/icon'
import AddCollection from 'src/Components/Collection/AddCollection'
import { useRouter } from 'next/router'

export default function Index() {
  const { locale, messages } = useIntl()
  const [open, setOpen] = useState(false)
  const [startSearch, setStartSearch] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState(0)
  const [data, setData] = useState([])
  const [dataSources, setDataSources] = useState([])
  const [selectedDataSource, setSelectedDataSource] = useState('')

  const router = useRouter()

  // Filter data based on search term and selected data source
  const dataFilter = data?.filter(
    ele =>
      (ele.nameEn.toLowerCase().includes(startSearch.toLowerCase()) ||
        ele.nameAr.toLowerCase().includes(startSearch.toLowerCase())) &&
      (selectedDataSource ? ele.dataSourceId === selectedDataSource : true)
  )

  // Fetch data sources
  useEffect(() => {
    setLoading(true)
    const loadingToast = toast.loading(locale === 'ar' ? 'جاري التحميل...' : 'Loading...')
    axiosGet(`data-source/get`, locale)
      .then(res => {
        if (res.status) {
          setDataSources(res.data)
          if (!selectedDataSource && res.data.length > 0) {
            setSelectedDataSource(res.data[0].id)
          }
        }
      })
      .finally(() => {
        setLoading(false)
        toast.dismiss(loadingToast)
      })
  }, [locale, refresh])

  // Fetch collections based on selected data source
  useEffect(() => {
    if (!selectedDataSource) return
    setLoading(true)
    const loadingToast = toast.loading(locale === 'ar' ? 'جاري التحميل...' : 'Loading...')
    axiosGet(`collections/get/?dataSourceId=${selectedDataSource}`, locale)
      .then(res => {
        if (res.status) {
          if (res.data) {
            setData(res.data)
          }
        }
      })
      .finally(() => {
        setLoading(false)
        toast.dismiss(loadingToast)
      })
  }, [locale, paginationModel.page, paginationModel.pageSize, refresh, selectedDataSource])

  const handleClose = () => {
    setOpen(false)
  }

  const [deletePage, setDeletePage] = useState(false)
  const { push } = useRouter()

  const handleDataSourceChange = event => {
    const dataSourceId = event.target.value
    setSelectedDataSource(dataSourceId)
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, dataSourceId }
      },
      undefined,
      { shallow: true }
    )
  }

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
      field: 'nameEn',
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
      field: 'nameAr',
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
              onClick={() => {
                push(`/${locale}/setting/data-source/collaction/${params.row.id}?dataSourceId=${selectedDataSource}`)
              }}
            >
              <IconifyIcon icon='tabler:eye' />
            </IconButton>
          </Tooltip>
          <Tooltip title={locale === 'ar' ? 'تعديل النموذج' : 'Edit Model'}>
            <IconButton
              size='small'
              onClick={() => {
                setOpen(params.row)
              }}
            >
              <IconifyIcon icon='tabler:edit' />
            </IconButton>
          </Tooltip>
          <Tooltip title={messages.delete}>
            <IconButton
              size='small'
              onClick={() => {
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
      <AddCollection open={open} toggle={handleClose} setRefresh={setRefresh} selectedDataSource={selectedDataSource} />
      <Card className='w-[100%] mb-5 py-4'>
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
              {locale === 'ar' ? 'نموذج البيانات' : 'Data Model'}
            </Typography>
            <Avatar skin='light' sx={{ width: 30, height: 30 }}>
              {dataFilter?.length}
            </Avatar>
          </div>
          <Button variant='contained' color='primary' onClick={() => setOpen(true)} disabled={!selectedDataSource}>
            {locale === 'ar' ? 'إضافة نموذج البيانات' : 'Add Data Model'}
          </Button>
        </CardContent>
      </Card>
      <Box sx={{ mb: 4 }}>
        <Card className='flex gap-3 flex-wrap md:px-[36px] px-0' sx={{ mb: 6, width: '100%', py: '3.5rem' }}>
          <div className='w-full'>
            <div className='flex flex-col gap-4 justify-between items-center px-5 mb-5 w-full md:flex-row'>
              {/* Data Source Dropdown */}
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id='data-source-select-label'>
                  {locale === 'ar' ? 'مصدر البيانات' : 'Data Source'}
                </InputLabel>
                <Select
                  labelId='data-source-select-label'
                  id='data-source-select'
                  value={selectedDataSource}
                  label={locale === 'ar' ? 'مصدر البيانات' : 'Data Source'}
                  onChange={handleDataSourceChange}
                >
                  {dataSources.map(source => (
                    <MenuItem key={source.id} value={source.id}>
                      {source.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Search and Reset */}
              <div className='flex gap-2 items-center'>
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
              </div>
            </div>

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
