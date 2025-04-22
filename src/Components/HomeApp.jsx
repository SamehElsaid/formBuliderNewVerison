/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { usePathname } from 'next/navigation'
import LoadingMain from './LoadingMain'
import useInitialization from 'src/@core/hooks/useInitialization'
import useTriggerError from 'src/@core/hooks/useTriggerError'

function HomeApp({ children }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const { locale } = useRouter()
  const patch = usePathname()
  const user = useSelector(rx => rx.auth.loading)

  // Hooks
  const { login } = useInitialization()
  useTriggerError()

  useEffect(() => {
    if (patch && '/' + patch.split('/')[1] === '/setting' && user !== 'loading' && user === 'no') {
      router.push(`/${locale}/login`)
    }
  }, [locale, router, user, patch])
  if (patch && '/' + patch.split('/')[1] === '/setting' && user !== 'loading' && user === 'no') {
    return <LoadingMain login={true} />
  }

  return (
    <>
      <LoadingMain login={login} />

      {patch ? <>{'/' + patch.split('/')[1] === '/setting' && login ? null : children}</> : null}
    </>
  )
}

export default HomeApp
