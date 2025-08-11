import { Avatar, Button, Card, CardContent, IconButton, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useRef, useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useIntl } from 'react-intl'
import { axiosDelete, axiosGet } from 'src/Components/axiosCall'
import { toast } from 'react-toastify'
import TableEdit from 'src/Components/TableEdit/TableEdit'
import IconifyIcon from 'src/Components/icon'
import AddPage from 'src/Components/Pages/AddPage'
import Link from 'next/link'
import DeletePopUp from 'src/Components/DeletePopUp'
import Breadcrumbs from 'src/Components/breadcrumbs'

export default function Index() {
  const { locale, messages } = useIntl()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [startSearch, setStartSearch] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const [refresh, setRefresh] = useState(0)
  const [data, setData] = useState([])

  useEffect(() => {
    setLoading(true)
    const loadingToast = toast.loading(locale === 'ar' ? 'جاري التحميل...' : 'Loading...')
    axiosGet(`page/get-pages`, locale)
      .then(res => {
        if (res.status) {
          setData(res.data)
        }
      })
      .finally(() => {
        setLoading(false)
        toast.dismiss(loadingToast)
      })
  }, [locale, paginationModel.page, paginationModel.pageSize, startSearch, refresh])

  const [deletePage, setDeletePage] = useState(false)

  const handleClose = () => {
    setOpen(false)
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
      field: 'name',
      disableColumnMenu: true,
      headerName: messages.name,
      renderCell: ({ row }) => (
        <Typography
          component={Link}
          href={`/${locale}/setting/pages/${row.name}`}
          variant='subtitle2'
          className='underline capitalize !text-main-color text-overflow'
          sx={{ fontWeight: 500, color: 'text.secondary' }}
        >
          {row.name}
        </Typography>
      )
    },
    {
      flex: 0.5,
      minWidth: 200,
      field: 'description',
      disableColumnMenu: true,
      headerName: messages.description,
      renderCell: ({ row }) => (
        <Typography variant='subtitle2' className='text-overflow' sx={{ fontWeight: 500, color: 'text.secondary' }}>
          {row.description}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 80,
      field: 'action',
      sortable: false,
      headerName: messages.actions,
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title={messages.delete}>
            <IconButton
              size='small'
              onClick={e => {
                setDeletePage(params.row.name)
              }}
            >
              <IconifyIcon icon='tabler:trash' />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleDelete = () => {
    setDeleteLoading(true)
    const loadingToast = toast.loading(locale === 'ar' ? 'جاري حذف الصفحة...' : 'Deleting page...')
    axiosDelete(`page/${deletePage}/`, locale)
      .then(res => {
        if (res.status) {
          toast.success(locale === 'ar' ? 'تم حذف الصفحة بنجاح' : 'Page deleted successfully')
          setData(data.filter(ele => ele.name !== deletePage))
          setRefresh(prev => prev + 1)
        }
      })
      .finally(() => {
        toast.dismiss(loadingToast)
        setDeleteLoading(false)
        setDeletePage(false)
      })
  }

  return (
    <div>
      <Breadcrumbs routers={[{ name: locale === 'ar' ? 'الصفحات' : 'Pages' }]} isDashboard />
      <DeletePopUp
        open={deletePage}
        setOpen={setDeletePage}
        handleDelete={handleDelete}
        loadingButton={deleteLoading}
      />

      <AddPage open={open} toggle={handleClose} setRefresh={setRefresh} />

      <Card className='w-[100%]  mb-5 py-4 '>
        <CardContent
          className='flex-col gap-2 h-full md:flex-row'
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
              {locale === 'ar' ? 'الصفحات' : 'Pages'}
            </Typography>
            <Avatar skin='light' sx={{ width: 30, height: 30 }}>
              {data?.length}
            </Avatar>
          </div>
          <Button variant='contained' color='primary' onClick={() => setOpen(true)}>
            {locale === 'ar' ? 'إضافة صفحة' : 'Add Page'}
          </Button>
        </CardContent>
      </Card>
      <Box sx={{ mb: 4 }}>
        <Card className='flex gap-3 flex-wrap md:px-[36px] px-0' sx={{ mb: 6, width: '100%', py: '3.5rem' }}>
          <div className='w-full'>
            <form
              onSubmit={e => {
                e.preventDefault()
                setStartSearch(e.target.elements.input.value)
                setPaginationModel({ page: 0, pageSize: 10 })
              }}
              className='px-5 ~~ mb-5 || flex ~~ flex-col  items-center md:items-end w-full || md:flex-row || gap-2'
            >
              <CustomTextField
                id='input'
                label={locale === 'ar' ? 'البحث' : 'Search'}
                value={search}
                ref={inputRef}
                onChange={e => {
                  setSearch(e.target.value)
                }}
              />
            </form>

            <TableEdit
              InvitationsColumns={columns}
              data={data
                ?.filter(ele => ele.name.toLowerCase().includes(search.toLowerCase()))
                .map((ele, i) => {
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
