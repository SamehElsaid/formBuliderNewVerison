import { Button, Dialog, DialogContent, Typography } from '@mui/material'
import { useState, useEffect, useRef } from 'react'
import DisplayField from './DisplayField'
import { useIntl } from 'react-intl'
import { LoadingButton } from '@mui/lab'
import { axiosPatch } from 'src/Components/axiosCall'
import { toast } from 'react-toastify'

export default function OpenEditDialog({ open, onClose, collectionName, sortWithId,  filterWithSelect, disabled,data }) {
  const [getFields, setGetFields] = useState([])
  const [reload, setReload] = useState(0)
  const [errors, setErrors] = useState(false)
  const [loadingButton, setLoadingButton] = useState(false)
  const refError = useRef({})
  const dataRef = useRef({})
  const {messages,locale}  = useIntl()

  useEffect(() => {
    if (sortWithId?.length) {
      setGetFields([...filterWithSelect].sort((a, b) => {
        const indexA = sortWithId.indexOf(a.id);
        const indexB = sortWithId.indexOf(b.id);

        if (indexA === -1 && indexB === -1) return 0; // إذا لم يكن أي منهما في القائمة، لا يتغير الترتيب
        if (indexA === -1) return 1; // إذا كان العنصر A غير موجود، يتم دفعه إلى النهاية
        if (indexB === -1) return -1; // إذا كان العنصر B غير موجود، يتم دفعه إلى النهاية

        return indexA - indexB; // ترتيب العناصر بناءً على `sortWithId`
      }));
    }
  }, [sortWithId, filterWithSelect])

  const handleSubmit = e => {
    e.preventDefault()

    const errors = []
    if (refError.current) {
      for (const key in refError.current) {
        if (refError.current[key]) {
          errors.push(refError.current[key])
        }
      }
    }
    if (errors.find(ele => typeof ele === 'object')) {
      return setErrors(refError.current)
    }

    setLoadingButton(true)
    const sendData = { ...dataRef.current }
    let sendDataForm = {}
    Object.keys(sendData).forEach(key => {
      if (typeof sendData[key] === 'string') {
        if (sendData[key]) {
          sendDataForm[key] = sendData[key]
        }
      } else {
        sendDataForm[key] = sendData[key]
      }

    })

    axiosPatch(`generic-entities/${collectionName}?Id=${open.Id}`,locale,sendDataForm)
      .then(res => {
        if (res.status) {
          toast.success(locale === 'ar' ? 'تم تعديل البيانات بنجاح' : 'Data updated successfully')
          onClose()
          console.log(res.data,open)
          data(prev => prev.map(ele => {
            if(ele.Id === open.Id){
              return {...ele,...res.data}
            }

            return ele
          }))
        }
      })
      .finally(() => {
        setLoadingButton(false)
      })
  }

  return (
    <Dialog
      open={Boolean(open)}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      onClose={(event, reason) => {
        onClose()
      }}
    >
      <DialogContent>
        <div className='flex flex-col gap-5 justify-center items-center px-1 py-5'>
          <Typography variant='body1' className='!text-lg' id='alert-dialog-description'>
            {/* {messages.areYouSure} */}
          </Typography>
          <div className='flex gap-5 justify-between items-end w-full'>
        <form className='flex flex-col gap-4 w-full' onFocus={() => setErrors(false)} onSubmit={handleSubmit}>

            {getFields.map(filed => (
              <div key={filed.id}>
                <DisplayField
                  input={filed}
                  readOnly={disabled}
                  findValue={open?.[filed.key]}
                  refError={refError}
                  dataRef={dataRef}
                  reload={reload}
                  errorView={errors?.[filed.key]?.[0]}
                  findError={errors && typeof errors?.[filed.key] === 'object'}
                />
              </div>
              ))}
              <div className="flex gap-2 justify-end items-center w-full">
            <LoadingButton
            variant='contained'
            type='submit'
            loading={loadingButton}

          >
            {messages.save}
          </LoadingButton>
            <Button color='secondary' type='button' variant='contained'  onClick={onClose}>
            {messages.cancel}
          </Button>
          </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
