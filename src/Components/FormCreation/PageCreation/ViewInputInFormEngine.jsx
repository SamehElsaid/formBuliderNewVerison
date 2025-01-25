import React, { useEffect, useMemo, useRef } from 'react'
import CssEditor from './CssEditor'
import { renderToString } from 'react-dom/server'
import { DefaultStyle } from 'src/Components/_Shared'

const CssEditorView = ({ data, locale, defaultValue, type }) => {
  const shadowContainerRef = useRef(null)

  const inputElement = useMemo(() => {
    return type === 'textarea' ? (
      <textarea
        id={data.key ?? new Date().getTime()}
        rows={data.rows || 5}
        style={{
          transition: '0.3s'
        }}
        placeholder={
          locale === 'ar' ? data.placeholderAr || 'الحقل بالعربية' : data.placeholderEn || 'The field in English'
        }
      />
    ) : type === 'checkbox' ? (
      <div id='view-input-in-form-engine'>
        <input type='checkbox' id='fruit1' name='fruit-1' value='Apple' />
        <label htmlFor='fruit1'>Apple</label>
        <input type='checkbox' id='fruit3' name='fruit-3' value='Cherry' checked />
        <label htmlFor='fruit3'>Cherry</label>
        <input type='checkbox' id='fruit4' name='fruit-4' value='Strawberry' />
        <label htmlFor='fruit4'>Strawberry</label>
      </div>
    ) : type === 'radio' ? (
      <div id='view-input-in-form-engine'>
        <input type='radio' id='fruit1' name='fruit'  value='Apple' />
        <label htmlFor='fruit1'>Apple</label>
        <input type='radio' id='fruit3' name='fruit' checked value='Cherry' />
        <label htmlFor='fruit3'>Cherry</label>
        <input type='radio' id='fruit4' name='fruit' value='Strawberry' />
        <label htmlFor='fruit4'>Strawberry</label>
      </div>
    ) : (
      <input
        id={data.key ?? new Date().getTime()}
        type={data.type ?? 'text'}
        style={{
          transition: '0.3s'
        }}
        placeholder={
          locale === 'ar' ? data.placeholderAr || 'الحقل بالعربية' : data.placeholderEn || 'The field in English'
        }
      />
    )
  }, [data.key, locale, type, data.type, data.rows, data.placeholderAr, data.placeholderEn])

  const label = useMemo(() => {
    return (
      <label htmlFor={data.key ?? new Date().getTime()} id='first-label'>
        {defaultValue(
          data,
          locale === 'ar' ? 'labelAr' : 'labelEn',
          locale === 'ar' ? 'الحقل بالعربية' : 'The field in English'
        )}
      </label>
    )
  }, [data, defaultValue, locale])

  const inputHtml = renderToString(inputElement)
  const labelHtml = renderToString(label)

  useEffect(() => {
    if (shadowContainerRef.current) {
      // إنشاء Shadow DOM إذا لم يكن موجودًا
      if (!shadowContainerRef.current.shadowRoot) {
        shadowContainerRef.current.attachShadow({ mode: 'open' })
      }

      // إضافة المحتوى والتنسيقات إلى Shadow DOM
      shadowContainerRef.current.shadowRoot.innerHTML = `
        <style>
          * {
            font-family: 'Public Sans', 'cairo', sans-serif !important;
            box-sizing: border-box;
          }
          label {
            display: block;
            margin-bottom: 8px;
          }
          input, textarea {
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            transition: 0.3s;
          }
          ${data?.css || DefaultStyle(type)}
        </style>
        <div>${labelHtml}</div>
        <div style="display: flex;">${inputHtml}</div>
      `
    }
  }, [data, locale, type, inputHtml, labelHtml])

  return <div ref={shadowContainerRef}></div>
}

export default function ViewInputInFormEngine({ data, locale, defaultValue, onChange, advancedEdit, type }) {
  return (
    <div className='flex flex-col gap-2 w-full h-full'>
      <CssEditorView data={data} locale={locale} defaultValue={defaultValue} type={type} />
      <div className='text-blue-500'>
        {advancedEdit && (
          <div className='overflow-scroll w-full h-full'>
            <h2 className='text-xl font-bold text-main-color'>
              {locale === 'ar' ? 'محرر CSS للحقل' : 'CSS Editor For Input'}
            </h2>
            <CssEditor data={data} onChange={onChange} type={type} />
          </div>
        )}
      </div>
    </div>
  )
}
