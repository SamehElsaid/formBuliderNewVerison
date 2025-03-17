import { TbViewportWide } from 'react-icons/tb'
import CartControl from '../CartControl'
import ViewCart from '../ViewCart'
import { useMemo } from 'react'

export default function useCart({ locale, readOnly, buttonRef }) {
  const cartCell = useMemo(() => {
    return {
      Renderer: ({ data, onChange, children }) => {
        return (
          <ViewCart data={data} onChange={onChange} locale={locale} readOnly={readOnly}>
            {children}
          </ViewCart>
        )
      },
      id: 'cart',
      title: locale === 'ar' ? 'عرض' : 'Card',
      description: locale === 'ar' ? 'عرض' : 'Card',
      version: 1,
      icon: <TbViewportWide className='text-2xl' />,
      controls: {
        type: 'custom',
        Component: ({ data, onChange }) => <CartControl data={data} onChange={onChange} locale={locale} buttonRef={buttonRef} />
      }
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, readOnly])

  return { cartCell }
}
