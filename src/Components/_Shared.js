export const isArabic = (value, locale) => {
  const arabicRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s.,،؟]+$/

  return locale !== 'ar' ? arabicRegex.test(value) : !arabicRegex.test(value)
}

export const getData = (item, key, defaultValue) => {
  try {
    const keys = key.split('.')
    let result = item

    for (let k of keys) {
      if (result && result.hasOwnProperty(k)) {
        result = result[k]
      } else {
        throw new Error('Key not found')
      }
    }

    if (typeof result === 'object') {
      throw new Error('Key not found')
    }

    return result
  } catch (error) {
    return defaultValue
  }
}

export const getType = type => {
  if (type === 'text') {
    return 'SingleText'
  }
  if (type === 'url') {
    return 'URL'
  }
  if (type === 'tel') {
    return 'Phone'
  }
  if (type === 'textarea') {
    return 'LongText'
  }

  return type.charAt(0).toUpperCase() + type.slice(1);
}
