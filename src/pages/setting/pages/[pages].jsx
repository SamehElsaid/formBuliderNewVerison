// pages/index.js
import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { CircularProgress } from '@mui/material'
import * as cookie from 'cookie'
import { decryptData } from 'src/Components/encryption'
import axios from 'axios'
import https from 'https'

const Index = ({ pageName, initialData, initialDataApi }) => {
  const [loading, setLoading] = useState(true)
  let ReactPageEditor = dynamic(
    () =>
      import('src/Components/Pages/ReactPageEditor').then(e => {
        setLoading(false)
        
        return e
      }),
      {
        ssr: false
      }
    )
    
    console.log(initialData,initialDataApi)



  return (
    <div className=''>
      <div className='py-10 min-h-screen bg-white'>
        {loading && (
          <div className='h-[calc(100vh-80px)] flex justify-center items-center'>
            <CircularProgress size={50} />
          </div>
        )}
        <ReactPageEditor pageName={pageName} initialData={initialData} initialDataApi={initialDataApi} />
      </div>
    </div>
  )
}

export default Index

Index.getLayout = page => <BlankLayout>{page}</BlankLayout>

export async function getServerSideProps(context) {
  const pageName = context.query.pages
  const authToken = context.req.headers.cookie
  const cookies = authToken ? cookie.parse(authToken) : false

  const headers = {
    Authorization: `Bearer ${cookies.sub ? decryptData(cookies.sub).token : ''}`,
    'Accept-Language': context.locale
  }
  const apiUrl = `${process.env.API_URL}/page/get-latest-version/${pageName}/`
  const httpsAgent = new https.Agent({ rejectUnauthorized: false })
  try {
    const [response] = await Promise.all([axios.get(apiUrl, { headers, httpsAgent })])
    const data = JSON.parse(response?.data?.jsonData) ?? null
    const initialData = data?.editorValue ?? null
    const initialDataApi = data?.apiData ?? null



    return {
      props: {
        pageName,
        initialData,
        initialDataApi
      }
    }
  } catch (error) {

    return {
      notFound: true
    }
  }
}
