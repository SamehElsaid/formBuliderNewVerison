/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from 'react'
import Editor from '@react-page/editor'
import slate from '@react-page/plugins-slate'
import spacer from '@react-page/plugins-spacer'
import '@react-page/editor/lib/index.css'
import '@react-page/plugins-slate/lib/index.css'
import '@react-page/plugins-spacer/lib/index.css'
import GetCollection from './PageCreation/GetCollection'
import { useIntl } from 'react-intl'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField
} from '@mui/material'
import Background from './PageCreation/Background'
import { MdOutlineColorLens, MdOutlineSaveAs } from 'react-icons/md'
import {  TbContainer, TbTextCaption, TbViewportWide } from 'react-icons/tb'
import { RiArrowGoBackFill } from "react-icons/ri";
import { FaTableCells, FaWpforms } from 'react-icons/fa6'
import FlexBoxControl from './PageCreation/FlexBoxControl'
import UpdateImage from './PageCreation/UpdateImage'
import { CiGrid42, CiImageOn, CiVideoOn } from 'react-icons/ci'
import { IoMdResize } from 'react-icons/io'
import UpdateRichText from './PageCreation/UpdateRichText'
import { Icon } from '@iconify/react'
import ButtonControl from './PageCreation/ButtonControl'
import FlexControl from './PageCreation/FlexControl'
import CartControl from './PageCreation/CartControl'
import ViewCart from './PageCreation/ViewCart'
import ApiData from './PageCreation/ApiData'
import { getData } from 'src/Components/_Shared'
import { GiClick } from 'react-icons/gi'
import { useDispatch } from 'react-redux'
import { useTheme } from '@emotion/react'
import Select from './PageCreation/Select'
import TableView from './PageCreation/TableView'
import { FaEye } from 'react-icons/fa'
import { IoSettingsOutline } from 'react-icons/io5'
import { TbApi } from 'react-icons/tb'
import { axiosPost } from '../axiosCall'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

const ReactPageEditor = ({ pageName, initialData }) => {
  const [editorValue, setEditorValue] = useState(initialData ?? null)
  const [readOnly, setReadOnly] = useState(false)
  const [advancedEdit, setAdvancedEdit] = useState(false)

  const { locale } = useIntl()

  const myFirstcellPlugin = useMemo(() => {
    return {
      Renderer: ({ data, onChange }) => {
        return data.selectCollection?.collection ? (
          <GetCollection
            readOnly={!advancedEdit}
            selectCollection={data.selectCollection}
            onChange={onChange}
            data={data}
          />
        ) : (
          <Select onChange={onChange} data={data} />
        )
      },
      id: 'myFirstCellPlugin',
      title: locale === 'ar' ? 'مدخل البيانات' : 'Form Input',
      description: locale === 'ar' ? 'مدخل البيانات' : 'My first cell plugin just displays a title',
      version: 1,
      controls: {
        type: 'autoform',
        schema: {
          properties: {
            selectCollection: {
              type: 'object',
              default: {}
            }
          },
          required: ['selectCollection']
        }
      },
      icon: <FaWpforms className='text-2xl' />
    }
  }, [advancedEdit, locale])

  const table = useMemo(() => {
    return {
      Renderer: ({ data, onChange }) => {
        return data.selectCollection?.collection ? (
          <TableView
            readOnly={!advancedEdit}
            selectCollection={data.selectCollection}
            onChange={onChange}
            data={data}
          />
        ) : (
          <Select onChange={onChange} data={data} />
        )
      },
      id: locale === 'ar' ? 'جدول' : 'Table',
      title: locale === 'ar' ? 'جدول' : 'Table',
      description: locale === 'ar' ? 'جدول' : 'Table',
      version: 1,
      controls: {
        type: 'autoform',
        schema: {
          properties: {
            selectCollection: {
              type: 'object',

              default: {}
            }
          },
          required: ['selectCollection']
        }
      },
      icon: <FaTableCells className='text-2xl' />
    }
  }, [advancedEdit, locale])

  const backgroundPlugin = useMemo(() => {
    return {
      Renderer: ({ data, children }) => (
        <div
          style={{
            backgroundColor: data.backgroundColor || 'transparent',
            backgroundImage: data.backgroundImage ? `url(${data.backgroundImage})` : 'none',
            backgroundSize: data.backgroundSize || 'cover',
            backgroundPosition: data.backgroundPosition || 'center',
            backgroundAttachment: data.backgroundAttachment || 'scroll',
            backgroundRepeat: data.backgroundRepeat || 'no-repeat',
            padding: '20px',
            height: data.backgroundHeight ? `${data.backgroundHeight}${data.backgroundHeightUnit || 'px'}` : 'auto',
            width: data.backgroundWidth ? `${data.backgroundWidth}${data.backgroundWidthUnit || 'px'}` : '100%',
            margin:
              data.backgroundAlignment === 'start'
                ? '0 auto 0 0'
                : data.backgroundAlignment === 'end'
                ? '0 0 0 auto'
                : 'auto'
          }}
        >
          {children}
        </div>
      ),
      id: 'backgroundPlugin',
      title: locale === 'ar' ? 'خلفية' : 'Background',
      description: locale === 'ar' ? 'خلفية مع محتوى' : 'Background with content',
      version: 1,
      controls: {
        type: 'custom',
        Component: ({ data, onChange }) => <Background data={data} onChange={onChange} />
      },
      icon: <MdOutlineColorLens className='text-2xl' />
    }
  }, [locale])

  const ContainerPlugin = useMemo(() => {
    return {
      Renderer: ({ data, children }) => (
        <div
          style={{
            padding: `${data.paddingStart ?? 0}px ${data.paddingEnd ?? 0}px ${data.paddingTop ?? 0}px ${
              data.paddingBottom ?? 0
            }px`
          }}
          className='container'
        >
          {children}
        </div>
      ),
      id: 'containerPlugin',
      title: locale === 'ar' ? 'حاوية' : 'Container',
      description: locale === 'ar' ? 'حاوية المحتوى' : 'Container of content',
      version: 1,
      icon: <TbContainer className='text-2xl' />,
      controls: {
        type: 'custom',
        Component: ({ data, onChange }) => (
          <>
            <TextField
              fullWidth
              type='text'
              value={data.paddingStart}
              onChange={e => onChange({ ...data, paddingStart: e.target.value })}
              variant='filled'
              label={locale === 'ar' ? 'الاذاحة الداخلية من اليمين' : 'Padding Start'}
            />

            <TextField
              fullWidth
              type='text'
              value={data.paddingEnd}
              onChange={e => onChange({ ...data, paddingEnd: e.target.value })}
              variant='filled'
              label={locale === 'ar' ? 'الاذاحة الداخلية من اليسار' : 'Padding End'}
            />
            <TextField
              fullWidth
              type='text'
              value={data.paddingTop}
              onChange={e => onChange({ ...data, paddingTop: e.target.value })}
              variant='filled'
              label={locale === 'ar' ? 'الاذاحة الداخلية من الاعلى' : 'Padding Top'}
            />
            <TextField
              fullWidth
              type='text'
              value={data.paddingBottom}
              onChange={e => onChange({ ...data, paddingBottom: e.target.value })}
              variant='filled'
              label={locale === 'ar' ? 'الاذاحة الداخلية من الاسفل' : 'Padding Bottom'}
            />
          </>
        )
      }
    }
  }, [locale])

  const BoxControl = useMemo(() => {
    return {
      Renderer: ({ data, children }) => (
        <div
          style={{
            height: data.backgroundHeight ? `${data.backgroundHeight}${data.backgroundHeightUnit || 'px'}` : 'auto',
            width: data.backgroundWidth ? `${data.backgroundWidth}${data.backgroundWidthUnit || 'px'}` : '100%'
          }}
        >
          {children}
        </div>
      ),
      id: 'boxControl',
      title: locale === 'ar' ? 'محتوى' : 'Box',
      description: locale === 'ar' ? 'تسطيع التحكم في حكم المحتوى' : 'Box of content',
      version: 1,
      icon: <IoMdResize className='text-2xl' />,
      controls: {
        type: 'custom',
        Component: ({ data, onChange }) => <FlexBoxControl data={data} onChange={onChange} />
      }
    }
  }, [locale])

  const UploadImage = useMemo(() => {
    return {
      Renderer: ({ data, children }) => (
        <>
          {data.image && (
            <img
              src={data.image}
              alt='image'
              style={{
                width: data.imageWidth ? `${data.imageWidth}${data.imageWidthUnit || 'px'}` : '100%',
                height: data.imageHeight ? `${data.imageHeight}${data.imageHeightUnit || 'px'}` : 'auto',
                objectFit: data.objectFit || 'cover'
              }}
            />
          )}
        </>
      ),
      id: 'uploadImage',
      title: locale === 'ar' ? ' صورة' : ' Image',
      description: locale === 'ar' ? ' صورة' : ' Image',
      version: 1,
      icon: <CiImageOn className='text-2xl' />,
      controls: {
        type: 'custom',
        Component: ({ data, onChange }) => {
          return <UpdateImage data={data} onChange={onChange} locale={locale} />
        }
      }
    }
  }, [locale])

  const UploadVideo = useMemo(() => {
    return {
      Renderer: ({ data, children }) => (
        <>
          {data.video && (
            <video
              src={data.video}
              alt='video'
              controls
              style={{
                width: data.imageWidth ? `${data.imageWidth}${data.imageWidthUnit || 'px'}` : '100%',
                height: data.imageHeight ? `${data.imageHeight}${data.imageHeightUnit || 'px'}` : 'auto',
                objectFit: data.objectFit || 'cover'
              }}
            />
          )}
        </>
      ),
      id: 'uploadVideo',
      title: locale === 'ar' ? 'فيديو' : ' Video',
      description: locale === 'ar' ? 'فيديو' : ' Video',
      version: 1,
      icon: <CiVideoOn className='text-2xl' />,
      controls: {
        type: 'custom',
        Component: ({ data, onChange }) => {
          return <UpdateImage data={data} onChange={onChange} locale={locale} type='video' />
        }
      }
    }
  }, [locale])

  const RichText = useMemo(() => {
    return {
      Renderer: ({ data, onChange }) => {
        return (
          <div
            className=''
            style={{
              color: data.titleColor,
              fontSize: data.fontSize ? data.fontSize + (data.fontSizeUnit ?? 'px') : '16px',
              fontWeight: data.fontWeight,
              fontFamily: data.fontFamily,
              marginBottom: data.marginBottom ? data.marginBottom + (data.marginBottomUnit ?? 'px') : '0px',
              textAlign: data.titleTextAlign ?? 'start'
            }}
          >
            {data?.api_url
              ? getData(data?.items, data?.[`content_${locale}`], locale === 'ar' ? 'المحتوى' : 'Content') ??
                (locale === 'ar' ? 'المحتوى' : 'Content')
              : data?.[`content_${locale}`]
              ? data?.[`content_${locale}`]
              : locale === 'ar'
              ? 'المحتوى'
              : 'Content'}
            {console.log(data)}
          </div>
        )
      },
      id: 'richText',
      title: locale === 'ar' ? 'نص منسق' : 'Text',
      description: locale === 'ar' ? 'نص منسق' : 'Text',
      version: 1,
      icon: <TbTextCaption className='text-2xl' />,
      controls: {
        type: 'custom',
        Component: ({ data, onChange }) => <UpdateRichText data={data} onChange={onChange} locale={locale} />
      }
    }
  }, [locale, advancedEdit])

  const FlexControlCell = useMemo(() => {
    return {
      Renderer: ({ data, children }) => {
        const ref = useRef(null)
        useEffect(() => {
          const childrenView = data.childrenView ?? 'auto'
          console.log(children[0])
          if (!Array.isArray(children[0])) {
            const divContainer = ref.current.querySelector('div:nth-child(1)')
            console.log(divContainer)
            if (divContainer) {
              divContainer.querySelectorAll('.react-page-cell').forEach(div => {
                div.style.width = 'fit-content'
                div.style.flexBasis = 'auto'
              })
              divContainer.querySelectorAll('.react-page-row').forEach(div => {
                div.style.flex = 'inherit'
              })
              console.log(childrenView)

              divContainer.style.cssText = `
              display: ${childrenView === 'auto' ? 'flex' : 'grid'};
              grid-template-columns: ${
                childrenView === 'auto' ? 'auto' : `repeat(${data.childrenView || 1}, minmax(0, 1fr))`
              };
              flex-direction: ${data.flexDirection || 'row'};
              height: ${data.height + data.heightUnit || 'auto'};
              gap: ${data.gap + 'px' || '10px'};
              flex-wrap: ${data.flexWrap || 'nowrap'};
              justify-content: ${data.justifyContent || 'center'};
              align-items: ${data.alignItems || 'center'};
              `
            }
          }
          console.log(ref.current)
        }, [children])

        return <div ref={ref}>{children}</div>
      },
      id: 'flexControl',
      title: locale === 'ar' ? 'Flex' : 'Flex Control',
      description: locale === 'ar' ? 'تسطيع التحكم في المحتوى' : 'Flex Control',
      version: 1,
      icon: <CiGrid42 className='text-2xl' />,
      controls: {
        type: 'custom',
        Component: ({ data, onChange }) => <FlexControl data={data} onChange={onChange} locale={locale} />
      }
    }
  }, [locale, advancedEdit])

  const ButtonCell = useMemo(() => {
    return {
      Renderer: ({ data, onChange }) => {
        const [hover, setHover] = useState(false)

        return (
          <button
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
              width: data.width || 'fit-content',
              backgroundColor: hover
                ? data.hoverBackgroundColor || 'transparent'
                : data.backgroundColor || 'transparent',
              color: hover ? data.hoverColor || 'white' : data.color || 'black',
              paddingBlock: data.paddingBlock + 'px' || '10px',
              paddingInline: data.paddingInline + 'px' || '20px',
              borderRadius: data.borderRadius + 'px' || '5px',
              fontSize: data.fontSize + 'px' || '16px',
              fontWeight: data.fontWeight || 'bold',
              border: data.border || 'none',
              borderWidth: data.borderWidth + 'px' || '1px',
              borderColor: hover ? data.hoverBorderColor || 'white' : data.borderColor || 'white',
              borderStyle: data.borderStyle || 'solid',
              transition: 'all 0.1s ease-in-out'
            }}
          >
            {data.buttonText}
          </button>
        )
      },
      id: 'button',
      title: locale === 'ar' ? 'زر' : 'Button',
      description: locale === 'ar' ? 'زر' : 'Button',
      version: 1,
      icon: <GiClick className='text-2xl' />,
      controls: {
        type: 'custom',
        Component: ({ data, onChange }) => <ButtonControl data={data} onChange={onChange} locale={locale} />
      }
    }
  }, [locale, advancedEdit])

  const cartCell = useMemo(() => {
    return {
      Renderer: ({ data, onChange, children }) => {
        return (
          <ViewCart data={data} onChange={onChange} locale={locale} readOnly={readOnly}>
            {children}
          </ViewCart>
        )
      },
      id: 'cart',
      title: locale === 'ar' ? 'عرض' : 'Card',
      description: locale === 'ar' ? 'عرض' : 'Card',
      version: 1,
      icon: <TbViewportWide className='text-2xl' />,
      controls: {
        type: 'custom',
        Component: ({ data, onChange }) => <CartControl data={data} onChange={onChange} locale={locale} />
      }
    }
  }, [locale, advancedEdit, readOnly])

  const IconView = useMemo(() => {
    return {
      Renderer: ({ data, onChange }) => {
        return (
          <div
            style={{
              width: data?.width ? data?.width + (data?.widthUnit ?? 'px') : '30px',
              height: data?.height ? data?.height + (data?.heightUnit ?? 'px') : '30px',
              borderRadius: data?.borderRadius ? data?.borderRadius + (data?.borderRadiusUnit ?? 'px') : '0px',
              backgroundColor: data?.backgroundColor,
              marginBottom: data?.marginBottom ? data?.marginBottom + (data?.marginBottomUnit ?? 'px') : '0px'
            }}
            className='flex justify-center items-center'
          >
            <Icon
              style={{
                color: data?.color,
                fontSize: data?.fontSize ? data?.fontSize + (data?.fontSizeUnit ?? 'px') : '30px',
                fontWeight: data?.fontWeight,
                fontFamily: data?.fontFamily
              }}
              icon={data?.text_en ? data?.text_en : 'ph:binary-duotone'}
            />
          </div>
        )
      },
      id: 'Icon',
      title: locale === 'ar' ? 'ايقون' : 'Icon',
      description: locale === 'ar' ? 'ايقون' : 'Icon',
      version: 1,
      icon: <GiClick className='text-2xl' />,
      controls: {
        type: 'custom',
        Component: ({ data, onChange }) => (
          <div>
            <TextField
              fullWidth
              type='text'
              value={data.text_en}
              onChange={e => onChange({ ...data, text_en: e.target.value })}
              variant='filled'
              label={locale === 'ar' ? 'القيمة' : 'Value'}
            />
            <a
              href='https://iconify.design/icon-sets/ph/'
              target='_blank'
              className='my-1 text-sm underline text-main-color'
            >
              {locale === 'ar' ? 'من هنا' : 'From Here'}{' '}
            </a>
            <TextField
              fullWidth
              type='text'
              value={data.width}
              onChange={e => onChange({ ...data, width: e.target.value })}
              variant='filled'
              label={locale === 'ar' ? 'العرض' : 'Width'}
            />
            <TextField
              fullWidth
              type='text'
              value={data.height}
              onChange={e => onChange({ ...data, height: e.target.value })}
              variant='filled'
              label={locale === 'ar' ? 'الطول' : 'Height'}
            />
            <TextField
              fullWidth
              type='text'
              value={data.borderRadius}
              onChange={e => onChange({ ...data, borderRadius: e.target.value })}
              variant='filled'
              label={locale === 'ar' ? 'الدوران' : 'Border Radius'}
            />
            <TextField
              fullWidth
              type='color'
              value={data.color}
              onChange={e => onChange({ ...data, color: e.target.value })}
              variant='filled'
              label={locale === 'ar' ? 'اللون' : 'Color'}
            />
            <TextField
              fullWidth
              type='color'
              value={data.backgroundColor}
              onChange={e => onChange({ ...data, backgroundColor: e.target.value })}
              variant='filled'
              label={locale === 'ar' ? 'اللون الخلفي' : 'Background Color'}
            />
            <TextField
              fullWidth
              type='text'
              value={data.fontSize}
              onChange={e => onChange({ ...data, fontSize: e.target.value })}
              variant='filled'
              label={locale === 'ar' ? 'الحجم' : 'Font Size'}
            />
            <TextField
              fullWidth
              type='text'
              value={data.fontWeight}
              onChange={e => onChange({ ...data, fontWeight: e.target.value })}
              variant='filled'
              label={locale === 'ar' ? 'الوزن' : 'Font Weight'}
              select
            >
              <MenuItem value='100'>100</MenuItem>
              <MenuItem value='200'>200</MenuItem>
              <MenuItem value='300'>300</MenuItem>
              <MenuItem value='400'>400</MenuItem>
              <MenuItem value='500'>500</MenuItem>
              <MenuItem value='600'>600</MenuItem>
              <MenuItem value='700'>700</MenuItem>
              <MenuItem value='800'>800</MenuItem>
              <MenuItem value='900'>900</MenuItem>
            </TextField>
            <TextField
              fullWidth
              type='text'
              value={data.fontFamily}
              onChange={e => onChange({ ...data, fontFamily: e.target.value })}
              variant='filled'
              label={locale === 'ar' ? 'الخط' : 'Font Family'}
              select
            >
              <MenuItem value='Arial'>Arial</MenuItem>
              <MenuItem value='Helvetica'>Helvetica</MenuItem>
              <MenuItem value='Times New Roman'>Times New Roman</MenuItem>
              <MenuItem value='Georgia'>Georgia</MenuItem>
            </TextField>
            <TextField
              fullWidth
              type='text'
              value={data.backgroundColor}
              onChange={e => onChange({ ...data, backgroundColor: e.target.value })}
              variant='filled'
              label={locale === 'ar' ? 'اللون' : 'Background Color'}
            />
            <TextField
              fullWidth
              type='text'
              value={data.marginBottom}
              onChange={e => onChange({ ...data, marginBottom: e.target.value })}
              variant='filled'
              label={locale === 'ar' ? 'الهامش السفلي' : 'Margin Bottom'}
            />
          </div>
        )
      }
    }
  }, [locale, advancedEdit, readOnly])

  const cellPlugins = [
    slate(),
    backgroundPlugin,
    ContainerPlugin,
    BoxControl,
    UploadImage,
    UploadVideo,
    spacer,
    myFirstcellPlugin,
    table,
    RichText,
    ButtonCell,
    FlexControlCell,
    cartCell,
    IconView
  ]

  const [openApiData, setOpenApiData] = useState(false)
  const [openBack, setOpenBack] = useState(false)
  const dispatch = useDispatch()
  const theme = useTheme()
  const { push } = useRouter()

  return (
    <div className='relative'>
      <Dialog open={openBack} onClose={() => setOpenBack(false)} fullWidth>
        <DialogTitle>{locale === 'ar' ? 'العودة إلى الصفحة السابقة بدون حفظ التغيرات' : 'Return to Previous Page Without Save Changes'}</DialogTitle>
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
      <div className={`container flex gap-2 justify-end mb-2`}>
        <Button
          variant='contained'
          color={'success'}
          onClick={() => {
            console.log(JSON.stringify(editorValue), editorValue)
            axiosPost(`page/update/${pageName}`, locale, {
              VersionReason: new Date().toISOString(),
              description: '',
              pageComponents: [],
              jsonData: JSON.stringify(editorValue)
            }).then(res => {
              if (res.status) {
                toast.success(locale === 'ar' ? 'تم حفظ التغيرات' : 'Changes saved')
              }
            })
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
          <RiArrowGoBackFill  className='text-xl' />
        </Button>
      </div>
      <ApiData open={openApiData} setOpen={setOpenApiData} />
      <div className={`duration-300 ${readOnly ? 'overflow-auto fixed inset-0 pb-10 bg-white z-[1111111]' : ''}`}>
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
