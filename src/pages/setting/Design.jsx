import { useState } from 'react'
import GridLayout from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const initialProducts = [
  { id: '1', name: 'منتج 1', width: 100, height: 400 },
  { id: '2', name: 'منتج 2', width: 50, height: 100 },
  { id: '3', name: 'منتج 3', width: 33.33, height: 200 },
  { id: '4', name: 'منتج 4', width: 33.33, height: 300 },
  { id: '5', name: 'منتج 5', width: 33.33, height: 400 },
  { id: '6', name: 'منتج 6', width: 50, height: 500 }
]

export default function DragDropGrid() {
  const [cols] = useState(12) // عدد الأعمدة الثابت
  const rowHeight = 50 // ارتفاع الصف الافتراضي

  const [layout, setLayout] = useState(
    initialProducts.map((item, index) => {
      const gridWidth = Math.round((item.width / 100) * cols)
      const gridHeight = Math.ceil(item.height / rowHeight) // تحويل الارتفاع إلى وحدات شبكة

      return {
        i: item.id,
        x: 0, // البدء من العمود الأول
        y: index, // كل عنصر في صف منفصل مبدئيًا
        w: gridWidth, // استخدام العرض المحسوب
        h: gridHeight // استخدام الارتفاع المحسوب
      }
    })
  )

  const [isDragging, setIsDragging] = useState(true)

  return (
    <>
      <button
        onClick={() => setIsDragging(!isDragging)}
        className="p-2 mb-4 text-white bg-blue-500 rounded"
      >
        {isDragging ? 'Stop Drag' : 'Enable Drag'}
      </button>

      <GridLayout
        className="layout"
        layout={layout}
        cols={cols}
        rowHeight={rowHeight}
        width={1000}
        onLayoutChange={newLayout => setLayout(newLayout)}
        draggableHandle=".drag-handle"
        isResizable={isDragging}
        isDraggable={isDragging}
        margin={[10, 10]} // هامش بين العناصر
      >
        {initialProducts.map(product => (
          <div
            key={product.id}
            className="p-4 bg-white rounded shadow drag-handle"
            style={{
              textAlign: 'center',
              cursor: isDragging ? 'grab' : 'auto'
            }}
          >
            {product.name}
          </div>
        ))}
      </GridLayout>
    </>
  )
}
