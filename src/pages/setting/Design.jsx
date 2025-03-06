import React, { useState } from 'react'

function Design() {
  const [data, setData] = useState([
    { name_ar: 'التبويب الاول', name_en: 'Tab 1', key: 'tab1', active: true },
    { name_ar: 'التبويب الثاني', name_en: 'Tab 2', key: 'tab2' },
    { name_ar: 'التبويب الثالث', name_en: 'Tab 3', key: 'tab3' },
    { name_ar: 'التبويب الرابع', name_en: 'Tab 4', key: 'tab4' },
    { name_ar: 'التبويب الخامس', name_en: 'Tab 5', key: 'tab5' },
    { name_ar: 'التبويب السادس', name_en: 'Tab 6', key: 'tab6' },
    { name_ar: 'التبويب السابع', name_en: 'Tab 7', key: 'tab7' },
    { name_ar: 'التبويب الثامن', name_en: 'Tab 8', key: 'tab8' },
    { name_ar: 'التبويب التاسع', name_en: 'Tab 9', key: 'tab9' },
    { name_ar: 'التبويب العاشر', name_en: 'Tab 10', key: 'tab10' }
  ])

  return (
    <div className='flex flex-wrap parent-tabs'>
      {data.map((item, index) => (
        <button key={index} className={`btn-tabs ${item.active ? 'active' : ''}`}>
          {item.name_ar}
        </button>
      ))}
    </div>
  )
}

export default Design
