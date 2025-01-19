// pages/index.js
import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { CircularProgress } from '@mui/material'


const Index = () => {
  const [loading, setLoading] = useState(true)

  let ReactPageEditor = null
  try {
    ReactPageEditor = dynamic(
      () =>
        import('src/Components/FormCreation/ReactPageEditor').then(e => {
          setLoading(false)

          return e
        }),
      {
        ssr: false
      }
    )
  } catch (err) {}


  return (
    <div className=''>
      <div className='py-10 min-h-screen bg-white'>
        {loading && (
          <div className='h-[calc(100vh-80px)] flex justify-center items-center'>
            <CircularProgress size={50} />
          </div>
        )}
        <ReactPageEditor/>
      </div>
    </div>
  )
}

export default Index

Index.getLayout = page => <BlankLayout>{page}</BlankLayout>
