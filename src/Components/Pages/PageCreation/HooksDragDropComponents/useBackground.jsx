import { useMemo } from 'react'
import { MdOutlineColorLens } from 'react-icons/md'
import Background from '../Background'

export default function useBackground({ locale }) {
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

  return { backgroundPlugin }
}
