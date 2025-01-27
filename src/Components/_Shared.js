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

  // if (type === 'radio' || type === 'select' || type === 'checkbox') {
  //   return 'OneToOne'
  // }
  if (type === 'radio' || type === 'select') {
    return 'OneToOne'
  }

  if (type === 'checkbox') {
    return 'ManyToMany'
  }

  return type.charAt(0).toUpperCase() + type.slice(1)
}

export const DefaultStyle = type => {
  if (type === 'textarea') {
    return `
     label{
margin-bottom:5px;
display:block;
color:#555;
}
textarea:focus,
textarea:hover {
  border-color: #3498ff;
}
textarea:focus {
  outline: 3px solid #3498ff40 ;
}
textarea {
  width:100%;
  padding:10px 20px;
  border-radius:5px;
  border:1px solid #e5e5ea;
  height:0Auto;
  margin-top:0px;
  margin-bottom:0px;
  margin-inline-start:0px;
  margin-inline-end:0px;
  background-color:transparent;
  color:#575757;
}
textarea::placeholder {
  height:0Auto;
  color: #dfdfdf;
}
      `
  } else if (type === 'checkbox') {
    return `
#first-label{
margin-top:0px;
margin-bottom:5px;
display:block;
color:#555;
}

  input[type=checkbox] + label {
   margin-top: 0.3em;
    margin-bottom: 0.3em;
    margin-inline-start: 0.3em;
    margin-inline-end: 0.3em;
    display: flex;
    align-items: center;
    color: #555;
    cursor: pointer;
    padding: 0.2em;
}

input[type=checkbox] {
  display: none;
}

input[type=checkbox] + label:before {
  content: "\\2714";
  border: 0.1em solid #999;
  border-radius: 0.2em;
  width: 1em;
  height: 1em;
   display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-inline-end: 0.2em;
  vertical-align: bottom;
  color: transparent;
  transition: .2s;
}

input[type=checkbox] + label:active:before {
  transform: scale(0);
}

input[type=checkbox]:checked + label:before {
  background-color: #3498ff;
  border-color: #3498ff;
  color: #fff;
}

input[type=checkbox]:disabled + label:before {
  transform: scale(1);
  border-color: #aaa;
}

input[type=checkbox]:checked:disabled + label:before {
  transform: scale(1);
  background-color: #3498ffab;
  border-color: #3498ffab;
}
#view-input-in-form-engine{
  display:flex;
  flex-direction:column;
  flex-wrap:wrap;
}
      `
  } else if (type === 'radio') {
    return `
#first-label{
margin-top:0px;
margin-bottom:5px;
display:block;
color:#555;
}

  input[type=radio] + label {
   margin-top: 0.3em;
    margin-bottom: 0.3em;
    margin-inline-start: 0.3em;
    margin-inline-end: 0.3em;
    display: flex;
    align-items: center;
    color: #555;
    cursor: pointer;
    padding: 0.2em;
}

input[type=radio] {
  display: none;
}

input[type=radio] + label:before {
  content: "\\25CF";
  border: 0.1em solid #999;
  border-radius: 0.2em;
  width: 1em;
  height: 1em;
   display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-inline-end: 0.2em;
  vertical-align: bottom;
  color: transparent;
  transition: .2s;
  border-radius:50%;
}

input[type=radio] + label:active:before {
  transform: scale(0);
}

input[type=radio]:checked + label:before {
  background-color: #3498ff;
  border-color: #3498ff;
  color: #fff;
}

input[type=radio]:disabled + label:before {
  transform: scale(1);
  border-color: #aaa;
}

input[type=radio]:checked:disabled + label:before {
  transform: scale(1);
  background-color: #3498ffab;
  border-color: #3498ffab;
}
#view-input-in-form-engine{
  display:flex;
  flex-direction:column;
  flex-wrap:wrap;
}
      `
  } else if (type === 'select') {
    return `
#first-label{
margin-top:0px;
margin-bottom:5px;
display:block;
color:#555;
}
    #custom-select {
      position: relative;
      width: 100%; /* عرض الـ select */
    }

    #custom-select select {
      width: 100%;
      padding: 10px;
      border: 2px solid ;
      border-color: #3498ff;
      border-radius: 8px;
      background-color: #f9f9f9;
      color: #333;
      font-size: 16px;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      cursor: pointer;
    }

    #custom-select::after {
      content: '\\25BC';
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      pointer-events: none;
      color: #3498ff;
      font-size: 14px;
    }

    #custom-select select:focus {
      outline: none;
    }

      `
  } else if (type === 'file') {
    return `

#file-upload-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom:0px;
  width: 100%;
}
#label-color{
    color: #3498ff;
    font-weight:bold;
    font-size:20px;
    text-transform:capitalize;
}
label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  border: 2px dashed ;
  border-color:#d1d5db;
  border-radius: 0.5rem;
  cursor: pointer;
  background-color: #f9fafb;
  transition: background-color 0.2s;
  min-height: 16rem;
  transition: all 0.3s ease-in-out;
}

label:hover {
 border-radius: 1rem;
}

#file-upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
  color: #6b7280;
}

#file-upload-icon {
  width: 2rem;
  height: 2rem;
  margin-bottom: 5px;
}

#file-upload-text {
  margin-bottom: 5px;
  font-size: 0.875rem;
  margin-top:0px;
}

#file-upload-text .font-semibold {
  font-weight: 600;
}

#file-upload-subtext {
  font-size: 0.75rem;
  margin-top:0px;
}

input {
  display: none;
}

    `
  }
  if (type === 'date') {
    return `
label{
margin-bottom:5px;
display:block;
color:#555;
}
input:focus,
input:hover {
  border-color: #3498ff;
}
input:focus {
  outline: 3px solid #3498ff40 ;
}
input {
  width:100%;
  padding:10px 20px;
  border-radius:5px;
  border:1px solid #e5e5ea;
  height:0Auto;
  margin-top:0px;
  margin-bottom:0px;
  margin-inline-start:0px;
  margin-inline-end:0px;
  background-color:transparent;
  color:#575757;
}
  input::placeholder {
  height:0Auto;
  color: #dfdfdf;
}
  #calendar-icon{
  color:#555;
  }

`
  }

  return `
label{
margin-bottom:5px;
display:block;
color:#555;
}
input:focus,
input:hover {
  border-color: #3498ff;
}
input:focus {
  outline: 3px solid #3498ff40 ;
}
input {
  width:100%;
  padding:10px 20px;
  border-radius:5px;
  border:1px solid #e5e5ea;
  height:0Auto;
  margin-top:0px;
  margin-bottom:0px;
  margin-inline-start:0px;
  margin-inline-end:0px;
  background-color:transparent;
  color:#575757;
}
  input::placeholder {
  height:0Auto;
  color: #dfdfdf;
}

`
}

export const cssToObject = cssString => {
  const result = {}
  const rules = cssString.split('}')

  rules.forEach(rule => {
    if (rule.trim() === '') return

    const [selector, styles] = rule.split('{')
    const cleanedSelector = selector.trim()

    if (!cleanedSelector || !styles) return

    const styleObject = {}
    styles.split(';').forEach(style => {
      if (style.trim() === '') return

      const [property, value] = style.split(':').map(s => s.trim())
      if (property && value) {
        // تقسيم القيمة إلى value و unit
        const numericValue = parseFloat(value)
        const unit = value.replace(numericValue, '').trim()

        styleObject[property] = {
          value: numericValue,
          unit: unit || 'px'
        }
      }
    })

    result[cleanedSelector] = styleObject
  })

  return result
}

export const objectToCss = cssObject => {
  let cssString = ''

  for (const selector in cssObject) {
    if (cssObject.hasOwnProperty(selector)) {
      const styles = cssObject[selector]
      let styleString = ''

      for (const property in styles) {
        if (styles.hasOwnProperty(property)) {
          const styleValue = styles[property]

          // إذا كانت القيمة تحتوي على value و unit
          if (typeof styleValue === 'object' && styleValue.value !== undefined) {
            styleString += `${property}:${styleValue.value}${styleValue.unit};`
          } else {
            // إذا كانت القيمة سلسلة عادية
            styleString += `${property}:${styleValue};`
          }
        }
      }

      cssString += `${selector} { ${styleString} }\n`
    }
  }

  return cssString.trim() // إزالة المسافات الزائدة في النهاية
}
