/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react'
import Editor from '@react-page/editor'
import '@react-page/editor/lib/index.css'
import { useIntl } from 'react-intl'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material'
import { MdOutlineSaveAs } from 'react-icons/md'
import { RiArrowGoBackFill } from 'react-icons/ri'
import { Icon } from '@iconify/react'
import { useTheme } from '@emotion/react'
import { FaEye } from 'react-icons/fa'
import { IoSettingsOutline } from 'react-icons/io5'
import { TbApi } from 'react-icons/tb'
import { useRouter } from 'next/router'
import { LoadingButton } from '@mui/lab'
import useCellPlugins from './PageCreation/HooksDragDropComponents/useCellPlugins'
import { toast } from 'react-toastify'
import { DefaultStyle, getType } from '../_Shared'
import { axiosPost } from '../axiosCall'

const ReactPageEditor = () => {
  const [editorValue, setEditorValue] = useState(null)
  const [readOnly, setReadOnly] = useState(false)
  const [advancedEdit, setAdvancedEdit] = useState(false)
  const { locale } = useIntl()
  const [openApiData, setOpenApiData] = useState(false)
  const [openBack, setOpenBack] = useState(false)
  const [saveData, setSaveData] = useState(false)
  const [loadingSaveData, setLoadingSaveData] = useState(false)
  const theme = useTheme()

  const {
    push,
    query: { addFiles,dataSourceId }
  } = useRouter()

  // CellPlugins Hook Calling
  const { cellPlugins } = useCellPlugins({ advancedEdit, locale, readOnly })

  return (
    <div className='relative'>
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
                const stop = []
                const addData = []
                editorValue?.rows.map((row, index) => {
                  console.log(row)
                  row.cells.map(cell => {
                    const data = { options: { uiSchema: {} } }
                    const dataMain = cell?.dataI18n?.default || {}
                    const validationData = []
                    if (dataMain.required) {
                      validationData.push({ RuleType: 'Required', Parameters: {} })
                    }
                    if (dataMain.unique) {
                      validationData.push({
                        RuleType: 'Unique',
                        Parameters: {
                          // tableName: 'Tests',
                          // columnNames: [dataMain.key]
                        }
                      })
                    }
                    if (dataMain.maxLength) {
                      validationData.push({ RuleType: 'MaxLength', Parameters: { maxLength: dataMain.maxLength } })
                    }
                    if (dataMain.minLength) {
                      validationData.push({ RuleType: 'MinLength', Parameters: { minLength: dataMain.minLength } })
                    }
                    {
                      console.log(dataMain.type)
                    }
                    if (dataMain.maxValue && dataMain.type === 'number') {
                      validationData.push({ RuleType: 'MaxValue', Parameters: { maxValue: dataMain.maxValue } })
                    }
                    if (dataMain.minValue && dataMain.type === 'number') {
                      validationData.push({ RuleType: 'MinValue', Parameters: { minValue: dataMain.minValue } })
                    }

                    if (dataMain.type === 'url') {
                      validationData.push({ RuleType: 'Url', Parameters: {} })
                    }
                    if (dataMain.type === 'email') {
                      validationData.push({ RuleType: 'Email', Parameters: {} })
                    }
                    if (dataMain.type === 'date') {
                      validationData.push({
                        RuleType: 'ColumnDataType',
                        Parameters: { expectedType: 'System.DateTime' }
                      })
                    }
                    if (dataMain.type === 'number') {
                      validationData.push({ RuleType: 'ColumnDataType', Parameters: { expectedType: 'System.number' } })
                    }
                    if (cell.plugin.id === 'input') {
                      console.log(validationData)
                      data.type = getType(dataMain.type || 'text')
                      data.collectionId = addFiles
                      data.key = dataMain.key
                      data.descriptionAr = dataMain.labelAr || ''
                      data.descriptionEn = dataMain.labelEn || ''
                      data.nameAr = dataMain.labelAr || ''
                      data.nameEn = dataMain.labelEn || ''
                      const placeholderAr = dataMain.placeholderAr || ''
                      const placeholderEn = dataMain.placeholderEn || ''
                      data.options.uiSchema.placeholder = JSON.stringify({ ar: placeholderAr, en: placeholderEn })
                      data.FieldCategory = 'Basic'
                      data.options.uiSchema.regex = dataMain.regex || ''
                      const regexMessageAr = dataMain.regexMessageAr || ''
                      const regexMessageEn = dataMain.regexMessageEn || ''
                      data.options.uiSchema.errorMessage =
                        JSON.stringify({ ar: regexMessageAr, en: regexMessageEn }) || ''
                      data.options.uiSchema.cssClass = dataMain.css || DefaultStyle()
                      data.validationData = validationData
                      if (!data.key) {
                        toast.error(
                          locale === 'ar'
                            ? `المفتاح مطلوب في الحقل ${index + 1}`
                            : `Key is required in  Field  ${index + 1}`
                        )
                        stop.push(false)
                      }
                      if (!data.nameAr) {
                        toast.error(
                          locale === 'ar'
                            ? `الحقل بالعربي مطلوب في الحقل ${index + 1}`
                            : `Label in Arabic is required in  Field  ${index + 1}`
                        )
                        stop.push(false)
                      }
                      if (!data.nameEn) {
                        toast.error(
                          locale === 'ar'
                            ? `الحقل بالانجليزي مطلوب في الحقل ${index + 1}`
                            : `Label in English is required in  Field  ${index + 1}`
                        )
                        stop.push(false)
                      }
                      addData.push(data)
                    }
                  })
                })
                if (stop.includes(false)) {
                  return
                }
                if (addData.length === 0) {
                  toast.error(locale === 'ar' ? 'لا يوجد حقول للاضافة' : 'No fields to add')

                  return
                }
                setLoadingSaveData(true)
                Promise.all(
                  addData.map(item =>
                    axiosPost('collection-fields/configure-fields', locale, item).then(res => {
                      if (res.status) {
                        console.log(res)
                      }

                      return res.status
                    })
                  )
                )
                  .then(res => {
                    if (res.includes(false)) {
                      toast.error(locale === 'ar' ? 'حدث خطأ ما' : 'An error occurred')
                    } else {
                      toast.success(locale === 'ar' ? 'تم حفظ التغييرات بنجاح' : 'Changes saved successfully')
                      push(`/${locale}/setting/data-source/collaction?dataSourceId=${dataSourceId}`)
                    }
                  })
                  .finally(() => {
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
          {locale === 'ar' ? ' اضافة الحقول' : 'Add Inputs'}
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
      <div
        style={{
          background: theme.palette.background.default
        }}
        className={`duration-300 ${readOnly ? `overflow-auto fixed inset-0 pb-10` : '!bg-white'}`}
      >
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
