import slate from '@react-page/plugins-slate'
import '@react-page/plugins-slate/lib/index.css'
import '@react-page/plugins-spacer/lib/index.css'
import useInput from './useInput'
import useTextArea from './useTextArea'

export default function useCellPlugins({ advancedEdit, locale, readOnly }) {
  // Hooks Drag Drop Components
  const { Input } = useInput({ locale, advancedEdit })
  const { TextArea } = useTextArea({ locale, advancedEdit })
  const cellPlugins = [slate(), Input, TextArea]

  return { cellPlugins }
}
