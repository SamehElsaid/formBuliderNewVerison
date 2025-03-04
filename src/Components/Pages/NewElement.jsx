import { useIntl } from 'react-intl'
import { axiosGet } from '../axiosCall'
import Link from 'next/link'

function NewElement({ input, onBlur, value, setValue, roles, onChangeEvent, disabledBtn }) {
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

  const handleClick = e => {
    try {
      if (onChangeEvent) {
        const evaluatedFn = eval('(' + onChangeEvent + ')')
        evaluatedFn(e)
      }
    } catch (err) {
      console.log(err)
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
  if (input.key === 'button') {
    console.log(isValidURL(roles?.onMount?.href))
  
    if (isValidURL(roles?.onMount?.href)) {
      return (
        <div>
          <a href={roles?.onMount?.href} className='btn' onClick={handleClick} target='_blank' rel='noopener noreferrer'>
            {locale === 'ar' ? input?.name_ar : input?.name_en}
          </a>
        </div>
      )
    }
    if (roles?.onMount?.href) {
      return (
        <div>
          <Link href={`/${locale}${roles?.onMount?.href}`} className='btn' onClick={handleClick} >
            {locale === 'ar' ? input?.name_ar : input?.name_en}
          </Link>
        </div>
      )
    }


    if (input.kind === 'submit') {
      return (
          <button onClick={handleClick} className='btn' disabled={disabledBtn}>
            {locale === 'ar' ? input.name_ar : input.name_en}
          </button>
      )
    }
    return (
        <button onClick={handleClick} type='button' className='btn'>
          {locale === 'ar' ? input.name_ar : input.name_en}
        </button>
    )
  }
}

export default NewElement
