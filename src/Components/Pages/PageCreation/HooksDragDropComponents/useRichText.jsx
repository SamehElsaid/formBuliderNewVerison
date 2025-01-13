import React, { useMemo } from 'react'
import UpdateRichText from '../UpdateRichText'
import { TbTextCaption } from 'react-icons/tb'

export default function useRichText({ locale }) {
  const RichText = useMemo(() => {
    return {
      Renderer: ({ data, onChange }) => {
        return (
          <div
            className=''
            style={{
              color: data.titleColor,
              fontSize: data.fontSize ? data.fontSize + (data.fontSizeUnit ?? 'px') : '16px',
              fontWeight: data.fontWeight,
              fontFamily: data.fontFamily,
              marginBottom: data.marginBottom ? data.marginBottom + (data.marginBottomUnit ?? 'px') : '0px',
              textAlign: data.titleTextAlign ?? 'start'
            }}
          >
            {data?.api_url
              ? getData(data?.items, data?.[`content_${locale}`], locale === 'ar' ? 'المحتوى' : 'Content') ??
                (locale === 'ar' ? 'المحتوى' : 'Content')
              : data?.[`content_${locale}`]
              ? data?.[`content_${locale}`]
              : locale === 'ar'
              ? 'المحتوى'
              : 'Content'}
            {console.log(data)}
          </div>
        )
      },
      id: 'richText',
      title: locale === 'ar' ? 'نص منسق' : 'Text',
      description: locale === 'ar' ? 'نص منسق' : 'Text',
      version: 1,
      icon: <TbTextCaption className='text-2xl' />,
      controls: {
        type: 'custom',
        Component: ({ data, onChange }) => <UpdateRichText data={data} onChange={onChange} locale={locale} />
      }
    }
  }, [locale])

  return { RichText }
}
