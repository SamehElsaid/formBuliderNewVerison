import { GoListOrdered } from 'react-icons/go'
import { useMemo } from 'react'
import OrderControl from '../OrderControl'
import ApexDonutChart from 'src/Components/analytics/ApexDonutChart'

export default function useChart({ advancedEdit, locale, readOnly, buttonRef }) {
  const chart = useMemo(() => {
    return {
      Renderer: ({ data, onChange }) => {
        return <ApexDonutChart />
      },
      id: 'chart',
      title: locale === 'ar' ? 'الرسم البياني' : 'Chart',
      description: locale === 'ar' ? 'الرسم البياني' : 'Chart',
      version: 1,
      controls: {
        type: 'custom',
        Component: ({ data, onChange }) => (
          <OrderControl data={data} onChange={onChange} locale={locale} readOnly={readOnly} buttonRef={buttonRef} />
        )
      },
      icon: <GoListOrdered className='text-2xl' />
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, advancedEdit, advancedEdit])

  return { chart }
}
