import React, { useMemo } from 'react'
import UpdateImage from '../UpdateImage'
import { CiVideoOn } from 'react-icons/ci'

export default function useUploadVideo({ locale }) {
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

  return { UploadVideo }
}
