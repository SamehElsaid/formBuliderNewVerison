import { FaWpforms } from 'react-icons/fa6'
import { useMemo } from 'react'
import Select from '../Select'
import ViewCollection from '../ViewCollection'

export default function useCollection({ advancedEdit, locale, readOnly, buttonRef }) {
  const collection = useMemo(() => {
    return {
      Renderer: ({ data, onChange }) => {
        return (
          <ViewCollection
            data={data}
            locale={locale}
            onChange={onChange}
            readOnly={!advancedEdit}
            disabled={!readOnly}
          />
        )
      },
      id: 'collection',
      title: locale === 'ar' ? 'مدخل البيانات' : 'Form Input',
      description: locale === 'ar' ? 'مدخل البيانات' : 'My first cell plugin just displays a title',
      version: 1,
      controls: {
        type: 'custom',
        Component: ({ data, onChange }) => <Select onChange={onChange} data={data} buttonRef={buttonRef} />
      },
      icon: <FaWpforms className='text-2xl' />
    }
  }, [locale, advancedEdit, readOnly])

  return { collection }
}
