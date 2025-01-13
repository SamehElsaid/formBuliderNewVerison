import { useMemo } from 'react'
import { FaTableCells } from 'react-icons/fa6'
import TableView from '../TableView'
import Select from '../Select'

export default function useTable({ advancedEdit, locale }) {
  const table = useMemo(() => {
    return {
      Renderer: ({ data, onChange }) => {
        return data.selectCollection?.collection ? (
          <TableView
            readOnly={!advancedEdit}
            selectCollection={data.selectCollection}
            onChange={onChange}
            data={data}
          />
        ) : (
          <Select onChange={onChange} data={data} />
        )
      },
      id: locale === 'ar' ? 'جدول' : 'Table',
      title: locale === 'ar' ? 'جدول' : 'Table',
      description: locale === 'ar' ? 'جدول' : 'Table',
      version: 1,
      controls: {
        type: 'autoform',
        schema: {
          properties: {
            selectCollection: {
              type: 'object',

              default: {}
            }
          },
          required: ['selectCollection']
        }
      },
      icon: <FaTableCells className='text-2xl' />
    }
  }, [advancedEdit, locale])

  return { table }
}
