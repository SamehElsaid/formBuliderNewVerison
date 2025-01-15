// import GetCollection from '../GetCollection'
// import { FaWpforms } from 'react-icons/fa6'
// import { useMemo } from 'react'

// export default function useCollection({ advancedEdit, locale }) {
//   const collection = useMemo(() => {
//     return {
//       Renderer: ({ data, onChange }) => {
//         return data.selectCollection?.collection ? (
//           <GetCollection
//             readOnly={!advancedEdit}
//             selectCollection={data.selectCollection}
//             onChange={onChange}
//             data={data}
//           />
//         ) : (
//           <Select onChange={onChange} data={data} />
//         )
//       },
//       id: 'collection',
//       title: locale === 'ar' ? 'مدخل البيانات' : 'Form Input',
//       description: locale === 'ar' ? 'مدخل البيانات' : 'My first cell plugin just displays a title',
//       version: 1,
//       controls: {
//         type: 'autoform',
//         schema: {
//           properties: {
//             selectCollection: {
//               type: 'object',
//               default: {}
//             }
//           },
//           required: ['selectCollection']
//         }
//       },
//       icon: <FaWpforms className='text-2xl' />
//     }
//   }, [advancedEdit, locale])

//   return { collection }
// }

import GetCollection from '../GetCollection'
import { FaWpforms } from 'react-icons/fa6'
import { useMemo } from 'react'
import Select from '../Select'
import ViewCollection from '../ViewCollection'

export default function useCollection({ advancedEdit, locale }) {
  const collection = useMemo(() => {
    return {
      Renderer: ({ data, onChange }) => {
        // return data.selectCollection?.collection ? (
        //   <GetCollection
        //     readOnly={!advancedEdit}
        //     selectCollection={data.selectCollection}
        //     onChange={onChange}
        //     data={data}
        //   />
        // ) : (
        //   <Select onChange={onChange} data={data} />
        // )
        return <ViewCollection data={data} locale={locale} onChange={onChange} readOnly={!advancedEdit} />
      },
      id: 'collection',
      title: locale === 'ar' ? 'مدخل البيانات' : 'Form Input',
      description: locale === 'ar' ? 'مدخل البيانات' : 'My first cell plugin just displays a title',
      version: 1,
      controls: {
        type: 'custom',
        Component: ({ data, onChange }) => <Select onChange={onChange} data={data} />
      },
      icon: <FaWpforms className='text-2xl' />
    }
  }, [locale, advancedEdit])

  return { collection }
}
