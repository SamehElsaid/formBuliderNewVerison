import { useMemo } from 'react'
import { IoMdResize } from 'react-icons/io'
import FlexBoxControl from '../FlexBoxControl'

export default function useBox({ locale }) {
  const BoxControl = useMemo(() => {
    return {
      Renderer: ({ data, children }) => (
        <div
          style={{
            height: data.backgroundHeight ? `${data.backgroundHeight}${data.backgroundHeightUnit || 'px'}` : 'auto',
            width: data.backgroundWidth ? `${data.backgroundWidth}${data.backgroundWidthUnit || 'px'}` : '100%'
          }}
        >
          {children}
        </div>
      ),
      id: 'boxControl',
      title: locale === 'ar' ? 'محتوى' : 'Box',
      description: locale === 'ar' ? 'تسطيع التحكم في حكم المحتوى' : 'Box of content',
      version: 1,
      icon: <IoMdResize className='text-2xl' />,
      controls: {
        type: 'custom',
        Component: ({ data, onChange }) => <FlexBoxControl data={data} onChange={onChange} />
      }
    }
  }, [locale])

  return { BoxControl }
}
