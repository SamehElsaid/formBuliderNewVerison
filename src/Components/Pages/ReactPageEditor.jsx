/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react'
import Editor from '@react-page/editor'
import '@react-page/editor/lib/index.css'
import { useIntl } from 'react-intl'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material'
import { MdOutlineSaveAs } from 'react-icons/md'
import { RiArrowGoBackFill } from 'react-icons/ri'
import { Icon } from '@iconify/react'
import ApiData from './PageCreation/ApiData'
import { useTheme } from '@emotion/react'
import { FaEye } from 'react-icons/fa'
import { IoSettingsOutline } from 'react-icons/io5'
import { TbApi } from 'react-icons/tb'
import { axiosPost } from '../axiosCall'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { LoadingButton } from '@mui/lab'
import { useSelector } from 'react-redux'
import useCellPlugins from './PageCreation/HooksDragDropComponents/useCellPlugins'

const ReactPageEditor = ({ pageName, initialData, initialDataApi }) => {
  const [editorValue, setEditorValue] = useState(initialData ?? null)
  const [readOnly, setReadOnly] = useState(false)
  const [advancedEdit, setAdvancedEdit] = useState(false)
  const { locale } = useIntl()
  const [openApiData, setOpenApiData] = useState(false)
  const [openBack, setOpenBack] = useState(false)
  const [saveData, setSaveData] = useState(false)
  const [loadingSaveData, setLoadingSaveData] = useState(false)
  const theme = useTheme()
  const { push } = useRouter()
  const apiData = useSelector(state => state.api.data)
  console.log(theme.palette)

  // CellPlugins Hook Calling
  const { cellPlugins } = useCellPlugins({ advancedEdit,locale,readOnly })

  return (
    <div className='relative'>
      <ApiData open={openApiData} setOpen={setOpenApiData} initialDataApi={initialDataApi} />
      <Dialog open={openBack} onClose={() => setOpenBack(false)} fullWidth>
        <DialogTitle>
          {locale === 'ar'
            ? 'العودة إلى الصفحة السابقة بدون حفظ التغيرات'
            : 'Return to Previous Page Without Save Changes'}
        </DialogTitle>
        <DialogContent>
          <DialogActions>
            <Button variant='contained' color='error' onClick={() => push(`/${locale}/setting/pages`)}>
              {locale === 'ar' ? 'نعم' : 'Yes'}
            </Button>
            <Button variant='contained' color='secondary' onClick={() => setOpenBack(false)}>
              {locale === 'ar' ? 'لا' : 'No'}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <Dialog open={saveData} onClose={() => setSaveData(false)} fullWidth>
        <DialogTitle>
          {locale === 'ar'
            ? 'هل أنت متأكد من أنك تريد حفظ التغييرات؟ يرجى التأكد قبل المتابعة '
            : 'Are you sure you want to save the changes? Please confirm before proceeding'}
        </DialogTitle>
        <DialogContent>
          <DialogActions>
            <LoadingButton
              loading={loadingSaveData}
              variant='contained'
              onClick={() => {
                console.log(apiData)
                const apiUrls = apiData.map(item => item.link)
                setLoadingSaveData(true)
                axiosPost(`page/update/${pageName}`, locale, {
                  VersionReason: new Date().toISOString(),
                  description: '',
                  pageComponents: [],
                  jsonData: JSON.stringify({ editorValue, apiData })
                })
                  .then(res => {
                    if (res.status) {
                      toast.success(locale === 'ar' ? 'تم حفظ التغيرات' : 'Changes saved')
                      setSaveData(false)
                    }
                  })
                  .finally(_ => {
                    setLoadingSaveData(false)
                  })
              }}
            >
              {locale === 'ar' ? 'حفظ' : 'Save'}
            </LoadingButton>
            <Button variant='contained' color='error' onClick={() => setSaveData(false)}>
              {locale === 'ar' ? 'الغاء' : 'Cancal'}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <div className={`container flex gap-2 justify-end mb-2`}>
        <Button
          variant='contained'
          color={'success'}
          onClick={() => {
            setSaveData(true)
          }}
        >
          <MdOutlineSaveAs className='text-xl me-1' />
          {locale === 'ar' ? ' حفظ التغيرات' : 'Save Changes'}
        </Button>
        <Button
          variant='contained'
          color={!advancedEdit ? 'warning' : 'primary'}
          onClick={() => {
            setOpenApiData(!openApiData)
          }}
        >
          <TbApi className='text-2xl' />
        </Button>
        <Button
          variant='contained'
          color={'primary'}
          onClick={() => {
            setReadOnly(!readOnly)
            setAdvancedEdit(false)
            localStorage.setItem('editorValue', JSON.stringify(editorValue))
          }}
        >
          <FaEye className='text-xl' />
        </Button>
        <Button
          variant='contained'
          color={advancedEdit ? 'warning' : 'primary'}
          onClick={() => {
            setAdvancedEdit(!advancedEdit)
            if (document.querySelector('[data-testid="DevicesIcon"]')) {
              if (!advancedEdit) {
                document.querySelector('[data-testid="DevicesIcon"]').parentElement.click()
              } else {
                document.querySelector('[data-testid="CreateIcon"]').parentElement.click()
              }
            }
          }}
        >
          <IoSettingsOutline className='text-xl' />
        </Button>
        <Button
          variant='contained'
          color={'error'}
          onClick={() => {
            setOpenBack(true)
          }}
        >
          <RiArrowGoBackFill className='text-xl' />
        </Button>
      </div>
      <div style={{
        background:theme.palette.background.default
      }} className={`duration-300 ${readOnly ? `overflow-auto fixed inset-0 pb-10` : '!bg-white'}`}>
        {readOnly && (
          <div className='fixed top-[10px] end-[10px] z-[11111111]'>
            <IconButton
              size='large'
              onClick={() => setReadOnly(false)}
              className='!text-white !bg-red-500 hover:!bg-red-600'
            >
              <Icon icon='tabler:x' fontSize='1.125rem' />
            </IconButton>
          </div>
        )}
        <Editor
          cellPlugins={cellPlugins}
          theme={theme}
          value={editorValue}
          onChange={(e, editor) => {
            console.log(editor)
            setEditorValue(e)
          }}
          readOnly={readOnly}
        />
      </div>
    </div>
  )
}

export default ReactPageEditor
