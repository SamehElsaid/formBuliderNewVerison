import { useMemo } from 'react'
import { MdOutlineColorLens } from 'react-icons/md'
import Background from '../Background'

export default function useBackground({ locale, buttonRef }) {
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
      title: locale === 'ar' ? 'الخلفية' : 'Background',
      description: locale === 'ar' ? 'يمكن أن تشمل الخلفيات ألوان صلبة أو صور' : 'Backgrounds can include solid colors or images',
      version: 1,
      controls: {
        type: 'custom',
        Component: ({ data, onChange }) => <Background data={data} onChange={onChange} buttonRef={buttonRef} />
      },
      icon: <MdOutlineColorLens className='text-2xl' />
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])

  return { backgroundPlugin }
}
