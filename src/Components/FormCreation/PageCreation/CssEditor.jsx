import CodeMirror from '@uiw/react-codemirror'
import { css } from '@codemirror/lang-css' // لتمكين تمييز صيغة CSS
import { DefaultStyle } from 'src/Components/_Shared'

const CssEditor = ({ data, onChange, type }) => {
  const handleChange = value => {
    console.log(value)
    onChange({ ...data, css: value })
  }

  return (
    <div className='' style={{ display: 'flex' ,width:'100%'}}>
      <CodeMirror
        value={data?.css || DefaultStyle(type)}
        height='500px'
        width='100%'
        className='flex-1'
        extensions={[css()]} // تمكين تمييز صيغة CSS
        onChange={handleChange}
      />
    </div>
  )
}

export default CssEditor
