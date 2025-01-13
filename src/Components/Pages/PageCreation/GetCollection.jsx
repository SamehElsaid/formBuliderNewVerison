import React, { useState, useRef } from 'react'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { LoadingButton } from '@mui/lab'
import ViewInput from '../PageCreation/ViewInput'
import { FormHelperText } from '@mui/material'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import axios from 'axios'

const SortableItem = ({ id, data, locale }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '10px',
    margin: '5px 0',
    backgroundColor: '#f0f0f0',
    border: '1px solid #ddd',
    cursor: 'grab'
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {locale === 'ar' ? data.label : data.label_en}
    </div>
  )
}

function GetCollection({ selectCollection, readOnly, onChange, data }) {
  const refError = useRef({})
  const dataRef = useRef({})
  const { locale } = useRouter()
  const [loading, setLoading] = useState(false)
  const [reload, setReload] = useState(0)
  const [errors, setErrors] = useState(false)
  const [inputsOrder, setInputsOrder] = useState(selectCollection?.selectedOptions || [])

  const handleDragEnd = event => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = inputsOrder.indexOf(active.id)
      const newIndex = inputsOrder.indexOf(over.id)

      const updatedOrder = arrayMove(inputsOrder, oldIndex, newIndex)
      setInputsOrder(updatedOrder)

      onChange({
        ...data,
        selectCollection: { selectedOptions: updatedOrder, collection: selectCollection.collection }
      })
    }
  }

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

    setLoading(true)
    axios
      .post(`${process.env.API_URL}/${selectCollection.collection.name_en}`, {
        ...dataRef.current
      })
      .then(() => {
        toast.success(locale === 'ar' ? 'تم إضافة التجميعة بنجاح' : 'Collection added successfully')
        dataRef.current = {}
        setReload(reload + 1)
      })
      .catch(() => {
        toast.error(locale === 'ar' ? 'حدث خطأ' : 'An error occurred')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  console.log(readOnly)

  return (
    <form className='px-5 py-5 w-full' onFocus={() => setErrors(false)} onSubmit={handleSubmit}>
      {readOnly ? (
        <>
          {inputsOrder.map(ele => {
            const data = selectCollection?.collection?.fields.find(e => e.key === ele)
            console.log(data)

            return (
              <div className='mb-4' key={ele}>
                <ViewInput input={data} refError={refError} dataRef={dataRef} reload={reload} />
                {errors &&
                  typeof errors?.[input.label_en] === 'object' &&
                  errors?.[input.label_en]?.map(error => (
                    <FormHelperText className='!text-main-color' key={error}>
                      {error}
                    </FormHelperText>
                  ))}
              </div>
            )
          })}
        </>
      ) : (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={inputsOrder} strategy={verticalListSortingStrategy}>
            {inputsOrder.map(ele => {
              const data = selectCollection?.collection?.fields.find(e => e.key === ele)

              return <SortableItem key={ele} id={ele} data={data} locale={locale} />
            })}
          </SortableContext>
        </DndContext>
      )}

      <LoadingButton loading={loading} type='submit' variant='contained' color='warning' disabled={!readOnly}>
        Submit
      </LoadingButton>
    </form>
  )
}

export default GetCollection
