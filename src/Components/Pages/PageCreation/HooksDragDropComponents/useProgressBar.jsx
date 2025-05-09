import React, { useMemo } from 'react'
import UpdateRichText from '../UpdateRichText'
import { getData } from 'src/Components/_Shared'
import { FaBarsProgress } from 'react-icons/fa6'

export default function useProgressBar({ locale, buttonRef }) {
  const ProgressBar = useMemo(() => {
    return {
      Renderer: ({ data, onChange }) => {
        return (
          <div
            style={{
              width: data.backgroundWidth ? `${data.backgroundWidth}${data.backgroundWidthUnit || 'px'}` : '100%',
              color: data.titleColor ?? '#fff',
              borderRadius: '10px',
              padding: '1px 20px',
              fontSize: data.fontSize ? data.fontSize + (data.fontSizeUnit ?? 'px') : '14px',
              fontWeight: data.fontWeight,
              fontFamily: data.fontFamily,
              marginBottom: data.marginBottom ? data.marginBottom + (data.marginBottomUnit ?? 'px') : '0px',
              textAlign: data.titleTextAlign ?? 'center',
              minWidth: '200px',
              position: 'relative',
              overflow: 'hidden',
              margin: '0 auto'
            }}
          >
            <div
              style={{
                backgroundColor: data.backgroundColor ?? '#00cfe8',
                width:
                  (data?.api_url ? getData(data?.items, data?.progressWidth, '50') : data.progressWidth ?? 50) + '%'
              }}
              className='absolute start-0 h-full '
            ></div>
            <div
              style={{
                backgroundColor: data.backgroundColor ?? '#00cfe8'
              }}
              className='absolute start-0 h-full w-[100%]  opacity-30'
            ></div>
            <div className='relative z-10'>
              {data?.api_url
                ? getData(data?.items, data?.[`content_${locale}`], locale === 'ar' ? 'المحتوى' : 'Content') ??
                  (locale === 'ar' ? 'المحتوى' : 'Content')
                : data?.[`content_${locale}`]
                ? data?.[`content_${locale}`]
                : locale === 'ar'
                ? 'المحتوى'
                : 'Content'}{' '}
              ({data?.api_url ? getData(data?.items, data?.progressWidth, '50%') : data.progressWidth ?? 50 + '%'})
            </div>
          </div>
        )
      },
      id: 'progressBar',
      title: locale === 'ar' ? 'شريط تقدم' : 'Progress Bar',
      description: locale === 'ar' ? 'يمكن عرض التقدم نحو هدف أو نسبة الانتهاء' : 'Visually represents progress towards a goal or completion percentage.',
      version: 1,
      icon: <FaBarsProgress className='text-2xl' />,
      controls: {
        type: 'custom',
        Component: ({ data, onChange }) => (
          <UpdateRichText data={data} onChange={onChange} locale={locale} type='progressBar' buttonRef={buttonRef} />
        )
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])

  return { ProgressBar }
}
