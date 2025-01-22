import React from 'react'
import CssEditor from './CssEditor'
import { renderToString } from 'react-dom/server'
import { DefaultStyle } from 'src/Components/_Shared'

const CssEditorView = ({ data, locale, defaultValue }) => {
  const inputElement = (
    <input
      id={data.key ?? new Date().getTime()}
      type={data.type ?? 'text'}
      style={{
        transition:"0.3s",
      }}
      placeholder={
        locale === 'ar' ? data.placeholderAr || 'الحقل بالعربية' : data.placeholderEn || 'The field in English'
      }
    />
  )

  const label = (
    <label htmlFor={data.key ?? new Date().getTime()}>
      {defaultValue(
        data,
        locale === 'ar' ? 'labelAr' : 'labelEn',
        locale === 'ar' ? 'الحقل بالعربية' : 'The field in English'
      )}
    </label>
  )

  const inputHtml = renderToString(inputElement)
  const labelHtml = renderToString(label)

  return (
    <iframe
      title='CSS Preview'
      className='iFrameControl'
      style={{ width: '100%', boxSizing: 'border-box' }}
      srcDoc={`
        <style>
        * {
  font-family: 'Public Sans', 'cairo', sans-serif !important;
}
        *{box-sizing: border-box}
        ${data?.css || DefaultStyle()}</style>
        <div className="" >${labelHtml}</div>
        <div className="" style="display: flex;">
        ${inputHtml}
        </div>
      `}
    />
  )
}

export default function ViewInputInFormEngine({ data, locale, defaultValue, onChange, advancedEdit }) {
  return (
    <div className='flex flex-col gap-2 w-full h-full'>
      <CssEditorView data={data} locale={locale} defaultValue={defaultValue} />
      <div className='text-blue-500'>
        {advancedEdit && (
          <div className='overflow-scroll w-full h-full'>
            <h2 className='text-xl font-bold text-main-color'>
              {locale === 'ar' ? 'محرر CSS للحقل' : 'CSS Editor For Input'}
            </h2>
            <CssEditor data={data} onChange={onChange} />
          </div>
        )}
      </div>
    </div>
  )
}
