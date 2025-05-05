import { useIntl } from 'react-intl'
import { axiosGet } from '../axiosCall'
import Link from 'next/link'

function NewElement({ input, onBlur, value, setValue, roles, onChangeEvent, disabledBtn, isDisable, readOnly }) {
  const { locale } = useIntl()

  const handleValidationChanges = e => {
    setValue('checked')
  }
  console.log(onChangeEvent, input.name_en)

  const handleCheckboxChange = e => {
    if (roles?.onMount?.href) {
      window.open(roles?.onMount?.href, '_blank')
    }
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
    // if()
    if (roles?.onMount?.print) {
      window.print()
    }
    if (roles?.onMount?.file) {
      const fileUrl = roles?.onMount?.file.replace('/Uploads/', process.env.API_URL + '/file/download/') // Replace with your file URL

      // Create an anchor element
      const link = document.createElement('a')
      link.href = fileUrl

      // Set the download attribute (optional: specify a custom filename)
      link.download = 'custom-filename.pdf' // Replace with desired filename

      // Append the anchor to the body (required for Firefox)
      document.body.appendChild(link)

      // Programmatically click the anchor to trigger the download
      link.click()

      // Remove the anchor from the document
      document.body.removeChild(link)
    }

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
  if (input.key === 'tabs') {
    return (
      <div className='flex flex-wrap parent-tabs w-full'>
        {input.data.map((item, index) =>
          isValidURL(item.link) ? (
            <a
              onClick={handleValidationChanges}
              key={index}
              href={item.link}
              target='_blank'
              rel='noopener noreferrer'
              className={`btn-tabs ${item.active ? 'active' : ''}`}
            >
              {locale === 'ar' ? item.name_ar : item.name_en}
            </a>
          ) : item.link ? (
            <Link
              onClick={handleValidationChanges}
              href={`/${locale}/${item.link.replace(/^\/+/, '')}`}
              className={`btn-tabs ${item.active ? 'active' : ''}`}
            >
              {locale === 'ar' ? item.name_ar : item.name_en}
            </Link>
          ) : (
            <button
              onClick={handleValidationChanges}
              key={index}
              type='button'
              className={`btn-tabs ${item.active ? 'active' : ''}`}
            >
              {locale === 'ar' ? item.name_ar : item.name_en}
            </button>
          )
        )}
      </div>
    )
  }
  if (input.key === 'text') {
    return <div className='text-element'>{locale === 'ar' ? input.name_ar : input.name_en}</div>
  }
  if (input.key === 'button') {
    if (isValidURL(roles?.onMount?.href)) {
      return (
        <div className='w-full'>
          <a
            href={roles?.onMount?.href}
            className={`btn ${isDisable === 'hide' ? (readOnly ? '' : 'hidden') : ''} block text-center`}
            onClick={handleClick}
            target='_blank'
            rel='noopener noreferrer'
            disabled={isDisable === 'disable'}
          >
            {locale === 'ar' ? input?.name_ar : input?.name_en}
          </a>
        </div>
      )
    }
    if (roles?.onMount?.href) {
      return (
        <div className='w-full'>
          <Link
            href={`/${locale}${roles?.onMount?.href}`}
            className={`btn block text-center  ${isDisable === 'hide' ? (readOnly ? '' : 'hidden') : ''} block`}
            onClick={handleClick}
            disabled={isDisable === 'disable'}
          >
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
      <button
        disabled={isDisable === 'disable'}
        onClick={handleClick}
        type='button'
        className={`btn ${isDisable === 'hide' ? (readOnly ? '' : 'hidden') : ''} block `}
      >
        {locale === 'ar' ? input.name_ar : input.name_en}
      </button>
    )
  }
}

export default NewElement
