import CodeMirror from '@uiw/react-codemirror'
import { css } from '@codemirror/lang-css'
import cssbeautify from 'cssbeautify' 

const CssEditor = ({ data, onChange, Css ,open}) => {
  const handleChange = value => {
    const additional_fields = data.additional_fields ?? []
    const findMyInput = additional_fields.find(inp => inp.key === open.id)


    if (findMyInput) {
      findMyInput.design = value
    } else {
      const myEdit = { key: open.id, design: value, roles: {}, event: {} }
      additional_fields.push(myEdit)
    }
    onChange({ ...data, additional_fields: additional_fields })
  }
  const formattedCss = cssbeautify(Css, {
    indent: '  ',
    openbrace: 'end-of-line',
    autosemicolon: true 
  })

  return (
    <div className=''>
      <CodeMirror
        value={formattedCss}
        width='100%'
        className='100%'
        extensions={[css()]} 
        onChange={handleChange}
      />
    </div>
  )
}

export default CssEditor
