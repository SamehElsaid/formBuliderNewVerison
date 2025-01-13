// pages/index.js
import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { CircularProgress } from '@mui/material'
import * as cookie from 'cookie'
import { decryptData } from 'src/Components/encryption'
import axios from 'axios'
import https from 'https';

const Index = ({ pageName, initialData }) => {
  const [loading, setLoading] = useState(true)
  console.log(initialData)

  let ReactPageEditor = null
  try {
    ReactPageEditor = dynamic(
      () =>
        import('src/Components/Pages/ReactPageEditor').then(e => {
          setLoading(false)

          return e
        }),
      {
        ssr: false
      }
    )
  } catch (err) {}

  // useEffect(()=>{
  //   axiosGet(`page/get-latest-version/${pageName}`).then(res=>{
  //     if(res.status){

  //     }
  //   })
  // },[pageName])

  return (
    <div className=''>
      <div className='py-10 min-h-screen bg-white'>
        {loading && (
          <div className='h-[calc(100vh-80px)] flex justify-center items-center'>
            <CircularProgress size={50} />
          </div>
        )}
        <ReactPageEditor pageName={pageName} initialData={initialData} />
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
    'Accept-Language': context.locale,

  }
  const apiUrl = `${process.env.API_URL}/page/get-latest-version/${pageName}/`
  console.log(headers, apiUrl)
  const httpsAgent = new https.Agent({ rejectUnauthorized: false })
  try {
    const [response] = await Promise.all([axios.get(apiUrl, { headers, httpsAgent })])

    const initialData = response.data ? JSON.parse(response.data.jsonData) : null

    return {
      props: {
        pageName,
        initialData
      }
    }
  } catch (error) {
    console.log(error.message)

    return {
      notFound: true
    }
  }
}
