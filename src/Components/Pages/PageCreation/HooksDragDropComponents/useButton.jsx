import { useMemo, useState } from 'react'
import { GiClick } from 'react-icons/gi'
import ButtonControl from '../ButtonControl'

export default function useButton({ locale }) {
  const ButtonCell = useMemo(() => {
    return {
      Renderer: ({ data }) => {
        const [hover, setHover] = useState(false)

        return (
          <button
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
              width: data.width || 'fit-content',
              backgroundColor: hover
                ? data.hoverBackgroundColor || 'transparent'
                : data.backgroundColor || 'transparent',
              color: hover ? data.hoverColor || 'white' : data.color || 'black',
              paddingBlock: data.paddingBlock + 'px' || '10px',
              paddingInline: data.paddingInline + 'px' || '20px',
              borderRadius: data.borderRadius + 'px' || '5px',
              fontSize: data.fontSize + 'px' || '16px',
              fontWeight: data.fontWeight || 'bold',
              border: data.border || 'none',
              borderWidth: data.borderWidth + 'px' || '1px',
              borderColor: hover ? data.hoverBorderColor || 'white' : data.borderColor || 'white',
              borderStyle: data.borderStyle || 'solid',
              transition: 'all 0.1s ease-in-out'
            }}
          >
            {data.buttonText}
          </button>
        )
      },
      id: 'button',
      title: locale === 'ar' ? 'زر' : 'Button',
      description: locale === 'ar' ? 'زر' : 'Button',
      version: 1,
      icon: <GiClick className='text-2xl' />,
      controls: {
        type: 'custom',
        Component: ({ data, onChange }) => <ButtonControl data={data} onChange={onChange} locale={locale} />
      }
    }
  }, [locale])

  return { ButtonCell }
}
