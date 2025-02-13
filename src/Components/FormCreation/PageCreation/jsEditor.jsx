import dynamic from 'next/dynamic';
import { useIntl } from 'react-intl';
import { Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { js as jsBeautify } from 'js-beautify';

// تحميل Monaco Editor بدون SSR
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const JsEditor = ({ data, onChange, jsCode, open }) => {
  const { locale } = useIntl();
  
  // تعريف الدالة الثابتة
  const functionTemplate = `async function Action(e, args) {\n  // write your code here\n}`;

  // حالة لحفظ الكود
  const [code, setCode] = useState(jsCode || functionTemplate);
  const [output, setOutput] = useState('');

  useEffect(() => {
    setCode(jsCode || functionTemplate);
  }, [jsCode]);

  const handleEditorChange = (value) => {
    const match = value.match(/async function Action\(e, args\) \{([\s\S]*)\}/);

    if (match) {
      const newContent = match[1]; 
      const updatedCode = `async function Action(e, args) {${newContent}}`;
      setCode(updatedCode);
      onChange(updatedCode);
    } else {
      setCode(functionTemplate);
    }
  };

  const handleFormat = () => {
    const match = code.match(/async function Action\(e, args\) \{([\s\S]*)\}/);
    if (match) {
      const formattedContent = jsBeautify(match[1], {
        indent_size: 2,
        space_in_empty_paren: true,
      });

      const formattedCode = `async function Action(e, args) {${formattedContent}}`;
      setCode(formattedCode);
      onChange(formattedCode);
    }
  };

  const handleRun = async () => {
    try {
      const functionWrapper = `(async () => { ${code} return await Action({}, {}); })();`;
      const result = await eval(functionWrapper);
      setOutput(result !== undefined ? String(result) : 'No Output');
    } catch (error) {
      setOutput(error.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <Button variant="contained" onClick={handleFormat}>
          {locale === "ar" ? "تنسيق" : "Format"}
        </Button>
        <Button variant="contained" onClick={handleRun}>
          {locale === "ar" ? "تشغيل" : "Run Code"}
        </Button>
      </div>
      <MonacoEditor
        height="600px"
        width="100%"
        language="javascript"
        theme="vs-dark"
        value={code}
        onChange={handleEditorChange}
        options={{
          selectOnLineNumbers: true,
          minimap: { enabled: false },
          readOnly: false,
        }}
      />
    </div>
  );
};

export default JsEditor;
