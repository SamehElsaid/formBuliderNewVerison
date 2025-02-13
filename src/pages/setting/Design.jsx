import React, { useState } from 'react'
import JsEditor from 'src/Components/FormCreation/PageCreation/jsEditor'

function Design() {
  const [data, setData] = useState({})
  const [jsCode, setJsCode] = useState('')
  const [open, setOpen] = useState(false)

  const onChange = (value) => {
    setJsCode(value)
  }

  return (
    <div>
      <JsEditor
        data={data}
        onChange={onChange}
        jsCode={jsCode}
        open={open}
      />
    </div>
  )
}

export default Design
