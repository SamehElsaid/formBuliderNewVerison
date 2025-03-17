import { useMemo } from 'react'
import { FaTableCells } from 'react-icons/fa6'
import TableView from '../TableView'
import Select from '../Select'

export default function useTable({ advancedEdit, locale, readOnly, buttonRef }) {
  const table = useMemo(() => {
    return {
      Renderer: ({ data, onChange }) => {
        return (

          <TableView
            readOnly={!advancedEdit}
            selectCollection={data.selectCollection}
            onChange={onChange}
            disabled={!readOnly}
            data={data}
          />
        )
      },
      id: locale === 'ar' ? 'جدول' : 'Table',
      title: locale === 'ar' ? 'جدول' : 'Table',
      description: locale === 'ar' ? 'جدول' : 'Table',
      version: 1,
      controls: {
        type: 'custom',
        Component: ({ data, onChange }) => <Select type='table' onChange={onChange} data={data} buttonRef={buttonRef} />
      },
      icon: <FaTableCells className='text-2xl' />
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advancedEdit, locale, readOnly])

  return { table }
}
