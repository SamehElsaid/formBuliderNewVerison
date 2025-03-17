import { useMemo, useState } from 'react'
import { GiClick } from 'react-icons/gi'
import ButtonControl from '../ButtonControl'
import Link from 'next/link'

export default function useButton({ locale, buttonRef }) {
  const ButtonCell = useMemo(() => {
    return {
      Renderer: ({ data }) => {
        const [hover, setHover] = useState(false)

        const options = {
          onMouseEnter: () => setHover(true),
          onMouseLeave: () => setHover(false),
          style: {
            width: data.width || 'fit-content',
            backgroundColor: hover ? data.hoverBackgroundColor || 'transparent' : data.backgroundColor || 'transparent',
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
          }
        }

        function isValidURL(str) {
          const pattern = new RegExp(
            '^(https?:\\/\\/)?' +
              '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
              '((\\d{1,3}\\.){3}\\d{1,3}))' +
              '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
              '(\\?[;&a-z\\d%_.~+=-]*)?' +
              '(\\#[-a-z\\d_]*)?$',
            'i'
          )

          return !!pattern.test(str)
        }
        return isValidURL(data.href) ? (
          <a href={data.href} target='_blank' rel='noopener noreferrer' {...options}>
            {data.buttonText}
          </a>
        ) : data.href ? (
          <Link href={data.href} target='_blank' rel='noopener noreferrer' {...options}>
            {data.buttonText}
          </Link>
        ) : (
          <button {...options}>{data.buttonText}</button>
        )
      },
      id: 'button',
      title: locale === 'ar' ? 'زر' : 'Button',
      description: locale === 'ar' ? 'زر' : 'Button',
      version: 1,
      icon: <GiClick className='text-2xl' />,
      controls: {
        type: 'custom',
        Component: ({ data, onChange }) => (
          <ButtonControl data={data} onChange={onChange} locale={locale} buttonRef={buttonRef} />
        )
      }
    }
  }, [locale])

  return { ButtonCell }
}
