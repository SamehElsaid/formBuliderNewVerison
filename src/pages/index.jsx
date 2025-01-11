import React from 'react'
import * as cookie from 'cookie'

export default function index() {
  return (
    <div>

    </div>
  )
}



export async function getServerSideProps(context) {
  const reqCookies = context.req.headers.cookie
  const cookies = reqCookies ? cookie.parse(reqCookies) : {}
  if (!cookies.sub) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  } else {
    return {
      redirect: {
        destination: '/setting/',
        permanent: false
      }
    }
  }
}
