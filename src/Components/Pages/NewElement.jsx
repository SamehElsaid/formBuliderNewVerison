import { useState } from 'react'
import { useIntl } from 'react-intl'
import { axiosGet } from '../axiosCall'

function NewElement({ input, onBlur, value, setValue, roles, onChangeEvent }) {
  const { locale } = useIntl()
  const handleCheckboxChange = e => {
    try {
      if (onChangeEvent) {
        const evaluatedFn = eval('(' + onChangeEvent + ')')

        evaluatedFn(e)
      }
    } catch {}
    if (e.target.checked) {
      if (roles?.onMount?.file) {
        const file = roles?.onMount?.file.replaceAll('/Uploads/', '')
        axiosGet(`file/download/${file}`).then(res => {
          const url = window.URL.createObjectURL(new Blob([res.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', file)
          document.body.appendChild(link)
          link.click()
          link.remove()
          window.URL.revokeObjectURL(url)
        })
      }
    }
    setValue(prev => !prev)
  }

  console.log('input', onBlur)

  if (input.key === 'check_box') {
    return (
      <div>
        <input
          name={input.name_en}
          type='checkbox'
          checked={value}
          onChange={handleCheckboxChange}
          id={input.id}
          onBlur={e => {
            console.log('onBlur', onBlur)
            if (onBlur) {
              const evaluatedFn = eval('(' + onBlur + ')')

              evaluatedFn(e)
            }
          }}
        />
        <label htmlFor={input.id}>{locale === 'ar' ? input.name_ar : input.name_en}</label>
      </div>
    )
  }
}

export default NewElement
