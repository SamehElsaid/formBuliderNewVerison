import { useMemo } from 'react'
import { CiImageOn } from 'react-icons/ci'
import UpdateImage from '../UpdateImage'

export default function useUploadImage({ locale }) {
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

  return { UploadImage }
}
