
import slate from '@react-page/plugins-slate'
import '@react-page/plugins-slate/lib/index.css'
import '@react-page/plugins-spacer/lib/index.css'
import useInput from './useInput'

export default function useCellPlugins({advancedEdit,locale,readOnly}) {
   // Hooks Drag Drop Components
  const {Input} = useInput({locale})

  const cellPlugins = [
    slate(),
    Input
  ]

  return {cellPlugins}
}
