import { Avatar, Button, Card, CardContent, Drawer, IconButton, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useRef, useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useIntl } from 'react-intl'
import { axiosGet } from 'src/Components/axiosCall'
import { toast } from 'react-toastify'
import TableEdit from 'src/Components/TableEdit/TableEdit'
import IconifyIcon from 'src/Components/icon'
import AddCollection from 'src/Components/Collection/AddCollection'
import FormBuilder from 'src/Components/Collection/FormBuilder'
import { useRouter } from 'next/router'

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
  const [openFormBuilder, setOpenFormBuilder] = useState(false)

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
  }, [locale, paginationModel.page, paginationModel.pageSize, startSearch, refresh, dataSourceId])

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
      field: 'name_ar',
      disableColumnMenu: true,
      headerName: messages.collectionNameAR,
      renderCell: ({ row }) => (
        <Typography variant='subtitle2' className='capitalize' sx={{ fontWeight: 500, color: 'text.secondary' }}>
          {row.nameAr}
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
        <Typography variant='subtitle2' className='capitalize' sx={{ fontWeight: 500, color: 'text.secondary' }}>
          {row.nameEn}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 200,
      field: 'action',
      sortable: false,
      headerName: messages.actions,
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant='text'
            className='!text-nowrap'
            size='small'
            color='success'
            onClick={() => {
              setOpenFormBuilder(params.row)
            }}
          >
            {locale === 'ar' ? 'إضافة حقل' : 'Add Field'}
          </Button>
          <Tooltip title={messages.edit}>
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
                setDeleteOpen(params.row.id)
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
      <FormBuilder open={openFormBuilder} setOpen={setOpenFormBuilder} />
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
              {locale === 'ar' ? 'التجميعات' : 'Collection'}
            </Typography>
            <Avatar skin='light' sx={{ width: 30, height: 30 }}>
              {data?.length}
            </Avatar>
          </div>
          <Button variant='contained' color='primary' onClick={() => setOpen(true)}>
            {locale === 'ar' ? 'إضافة تجميعة' : 'Add Collection'}
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
                defaultValue={search}
                ref={inputRef}
                onBlur={e => {
                  setSearch(e.target.value)
                }}
              />
            </form>

            <TableEdit
              InvitationsColumns={columns}
              data={data?.map((ele, i) => {
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
