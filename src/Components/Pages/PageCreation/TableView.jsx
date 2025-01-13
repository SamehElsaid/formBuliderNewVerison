import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import { axiosGet } from 'src/Components/axiosCall'
import { Typography } from '@mui/material'
import TableEdit from 'src/Components/TableEdit/TableEdit'
import LoadingBar from 'src/Components/LoadingBar/LoadingBar'
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc'

function TableView({ selectCollection, readOnly, onChange, data }) {
  const { locale, messages } = useIntl()
  const [loading, setLoading] = useState(false)
  const [dataTable, setDataTable] = useState([])
  console.log(selectCollection)

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })
  const [startSearch, setStartSearch] = useState('')
  const [refresh, setRefresh] = useState(0)
  const [columns, setColumns] = useState([])
  const [selectedOptions, setSelectedOptions] = useState(selectCollection?.selectedOptions || [])

  useEffect(() => {
    setColumns([
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
      ...selectedOptions.map(ele => ({
        flex: 0.5,
        minWidth: 200,
        disableColumnMenu: true,
        field: ele,
        headerName: messages[ele],
        renderCell: ({ row }) => (
          <Typography variant='subtitle2' sx={{ fontWeight: 500, color: 'text.secondary' }}>
            {row[ele]}
          </Typography>
        )
      }))
    ])
    setLoading(true)
    const loadingToast = toast.loading(locale === 'ar' ? 'جاري التحميل...' : 'Loading...')
    axiosGet(selectCollection?.collection.name_en, locale)
      .then(res => {
        if (res) {
          setDataTable(res)
        }
      })
      .finally(() => {
        setLoading(false)
        toast.dismiss(loadingToast)
      })
  }, [
    locale,
    paginationModel.page,
    paginationModel.pageSize,
    startSearch,
    refresh,
    selectCollection?.collection.name_en,
    selectedOptions,
    messages
  ])

  // Handle Drag End for sorting the buttons
  const onSortEnd = ({ oldIndex, newIndex }) => {
    console.log(selectedOptions, oldIndex, newIndex)
    const newSelectedOptions = arrayMove(selectedOptions, oldIndex, newIndex)
    setSelectedOptions(newSelectedOptions)
    setColumns([
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
      ...newSelectedOptions.map(ele => ({
        flex: 0.5,
        minWidth: 200,
        disableColumnMenu: true,
        field: ele,
        headerName: messages[ele],
        renderCell: ({ row }) => (
          <Typography variant='subtitle2' sx={{ fontWeight: 500, color: 'text.secondary' }}>
            {row[ele]}
          </Typography>
        )
      }))
    ])

    onChange({
      ...data,
      selectCollection: { selectedOptions: newSelectedOptions, collection: selectCollection.collection }
    })
  }

  // Sortable Item for each draggable button
  const SortableButton = SortableElement(({ value }) => (
    <div className='flex gap-2 items-center p-2 text-white rounded-md cursor-pointer select-none text-nowrap bg-main-color'>
      {messages[value]}
    </div>
  ))

  // Sortable Container to wrap all sortable elements
  const SortableList = SortableContainer(({ items }) => {
    return (
      <div className='flex flex-wrap gap-3 p-5'>
        {items.map((value, index) => (
          <SortableButton key={value} index={index} value={value} />
        ))}
      </div>
    )
  })

  return (
    <div className=''>
      {/* Render the sortable list of buttons */}
      {!readOnly && <SortableList items={selectedOptions} onSortEnd={onSortEnd} axis='xy' />}

      {columns.length > 0 ? (
        <TableEdit
          InvitationsColumns={columns}
          data={dataTable?.map((ele, i) => {
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
      ) : (
        <div className='flex justify-center items-center min-h-[400px]'>
          <LoadingBar />
        </div>
      )}
    </div>
  )
}

export default TableView
