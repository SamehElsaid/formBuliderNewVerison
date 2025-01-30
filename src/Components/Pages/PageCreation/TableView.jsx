/* eslint-disable react-hooks/exhaustive-deps */


import { CircularProgress, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { axiosGet } from 'src/Components/axiosCall'
import PagnationTable from 'src/Components/TableEdit/PagnationTable'
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc'
import ViewValueInTable from './ViewValueInTable'

function TableView({ data, locale, onChange, readOnly }) {
  const [getFields, setGetFields] = useState([])
  const [loading, setLoading] = useState(true)
  const [dataTable, setDataTable] = useState([])
  const [loadingTable, setLoadingTable] = useState(false)
  const [columns, setColumns] = useState([])
  const [collectionFields, setCollectionFields] = useState([])
  const [loadingCollectionFields, setLoadingCollectionFields] = useState(false)

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    setLoading(true)
    if (data.collectionId) {
      axiosGet(
        `generic-entities/${data.collectionName}?pageNumber=${paginationModel.page + 1}&pageSize=${
          paginationModel.pageSize
        }`,
        locale
      )
        .then(res => {
          if (res.status) {
            setGetFields(res.entities)
            setTotalCount(res.totalCount)
          }
        })
        .finally(() => setLoading(false))
    } else {
      setGetFields([])
      setLoading(true)
    }
  }, [locale, data.collectionId, paginationModel])

  useEffect(() => {
    if (data.collectionId) {
      axiosGet(`collection-fields/get?CollectionId=${data.collectionId}`, locale)
        .then(res => {
          if (res.status) {
            setCollectionFields(res.data)
          }
        })
        .finally(() => setLoadingCollectionFields(false))
    } else {
      setCollectionFields([])
      setLoadingCollectionFields(true)
    }
  }, [locale, data.collectionId])

  const [filterWithSelect, setFilterWithSelect] = useState([])

  useEffect(() => {
    if (collectionFields.length === 0) return
    let filteredFields = collectionFields.filter(ele => data.selected.includes(ele.key))
    if (filteredFields.length !== data.sortWithId?.length) {
      onChange({ ...data, sortWithId: filteredFields.map(ele => ele.id) })
    } else {
      filteredFields = data.sortWithId.map(ele => filteredFields.find(e => e?.id === ele))
    }
    setFilterWithSelect(filteredFields)

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
      ...filteredFields.map(ele => ({
        flex: 0.5,
        minWidth: 200,
        disableColumnMenu: true,
        field: ele.key,
        headerName: locale === 'ar' ? ele.nameAr.toUpperCase() : ele.nameEn.toUpperCase(),
        renderCell: ({ row }) => (
          <Typography variant='subtitle2' sx={{ fontWeight: 500, color: 'text.secondary' }}>
            {ele?.fieldCategory === 'Associations' ? (
              <ViewValueInTable data={ele} value={row[ele.key]} />
            ) : (
              row[ele.key]
            )}
          </Typography>
        )
      }))
    ])
  }, [collectionFields.length, data?.selected?.length, data.sortWithId])
  useEffect(() => {
    // // if(filterWithSelect.length === 0) return
    // console.log(filterWithSelect.length === data.sortWithId?.length)
    // if(filterWithSelect.length === data.sortWithId?.length){
    //   console.log('sd')
    // }
    // const SortTable = data.sortWithId.map(ele => filterWithSelect.find(e => e?.id === ele))
    // setFilterWithSelect(SortTable)
    // setColumns([
    //   {
    //     flex: 0.05,
    //     minWidth: 60,
    //     field: 'index',
    //     disableColumnMenu: true,
    //     headerName: '#',
    //     renderCell: ({ row }) => (
    //       <Typography variant='subtitle2' sx={{ fontWeight: 500, color: 'text.secondary' }}>
    //         {`${row.index + 1}`}
    //       </Typography>
    //     )
    //   },
    //   ...SortTable.map(ele => ({
    //     flex: 0.5,
    //     minWidth: 200,
    //     disableColumnMenu: true,
    //     field: ele.key,
    //     headerName: locale === 'ar' ? ele.nameAr.toUpperCase() : ele.nameEn.toUpperCase(),
    //     renderCell: ({ row }) => (
    //       <Typography variant='subtitle2' sx={{ fontWeight: 500, color: 'text.secondary' }}>
    //         {row[ele.key]}
    //       </Typography>
    //     )
    //   }))
    // ])
  }, [filterWithSelect.length, data.sortWithId, data?.selected?.length])

  const SortableButton = SortableElement(({ value }) => (
    <div className='flex gap-2 items-center p-2 text-white rounded-md cursor-pointer select-none text-nowrap bg-main-color'>
      {locale === 'ar' ? value.nameAr.toUpperCase() : value.nameEn.toUpperCase()}
    </div>
  ))

  const SortableList = SortableContainer(({ items }) => {
    return (
      <div className='flex flex-wrap gap-3 p-5'>
        {items.map((value, index) => (
          <SortableButton key={value} index={index} value={value} />
        ))}
      </div>
    )
  })

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const newSelectedOptions = arrayMove(filterWithSelect, oldIndex, newIndex)
    setFilterWithSelect(newSelectedOptions)

    onChange({
      ...data,
      sortWithId: newSelectedOptions.map(ele => ele.id)
    })
  }

  return (
    <div>
      {loading ? (
        <div className='h-[300px]  flex justify-center items-center'>
          <CircularProgress size={50} />
        </div>
      ) : (
        <>
          {!readOnly && <SortableList items={filterWithSelect} onSortEnd={onSortEnd} axis='xy' />}
          <PagnationTable
            Invitationscolumns={columns}
            data={getFields?.map((ele, i) => {
              const fData = { ...ele }
              fData.index = i + paginationModel.page * paginationModel.pageSize

              return fData
            })}
            totalRows={totalCount}
            getRowId={row => row.index}
            loading={loading || loadingTable}
            locale={locale}
            noRow={locale === 'ar' ? 'لا يوجد' : 'Not Found'}
            paginationModel={paginationModel}
            setPaginationModel={setPaginationModel}
          />
        </>
      )}
    </div>
  )
}

export default TableView
