import { useMemo, useState } from 'react'
import { GiClick } from 'react-icons/gi'
import InputControl from '../ButtonControl'

export default function useInput({ locale }) {
  const Input = useMemo(() => {
    return {
      Renderer: ({ data }) => {
        const [hover, setHover] = useState(false)

        const defaultValue = (data, key, defaultValue) => {
          if (data[key]) {
            return data[key]
          }

          return defaultValue
        }

        return (
          <>
            <label htmlFor={data.key ?? new Date().getTime()}>
              {defaultValue(
                data,
                locale === 'ar' ? 'labelAr' : 'labelEn',
                locale === 'ar' ? 'الحقل بالعربية' : 'The field in English'
              )}
            </label>
            <input
              id={data.key ?? new Date().getTime()}
              type={data.type ?? 'text'}
              placeholder={defaultValue(
                data,
                locale === 'ar' ? 'placeholderAr' : 'placeholderEn',
                locale === 'ar' ? 'الحقل بالعربية' : 'The field in English'
              )}
            />
          </>
        )
      },
      id: 'input',
      title: locale === 'ar' ? 'حقل' : 'Input',
      description: locale === 'ar' ? 'حقل' : 'Input',
      version: 1,
      icon: <GiClick className='text-2xl' />,
      controls: {
        type: 'custom',
        Component: ({ data, onChange }) => <InputControl data={data} onChange={onChange} locale={locale} />
      }
    }
  }, [locale])

  return { Input }
}
