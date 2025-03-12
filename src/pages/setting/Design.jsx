import React, { useEffect, useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import OTPInput from 'react-otp-input'
import { toast } from 'react-toastify'
import { axiosPost } from 'src/Components/axiosCall'

function Design() {
  const locale = 'en'
  const numberOfOtp = 5
  const [otp, setOtp] = useState('')
  const [otpOpen, setOtpOpen] = useState(false)
  const [resendOtp, setResendOtp] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (otpOpen) {
      setResendOtp(60)
    }
  }, [otpOpen])
  useEffect(() => {
    let interval = null
    if (resendOtp !== 0) {
      interval = setInterval(() => {
        setResendOtp(prev => (prev === 0 ? 0 : prev - 1))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendOtp])

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault()
          if (otp.length !== 5) {
            return toast.error(locale === 'ar' ? 'ادخل رمز التأكيد' : 'Enter verification code')
          }

          setLoading(true)
          axiosPost('auth/verify-phone/', locale, {
            code: otp
          })
            .then(res => {
              if (res.status) {
                toast.success(locale === 'ar' ? 'تم تفعيل الحساب' : 'Account has been activated')
                setOtp('')
              }
            })
            .finally(() => {
              setOtp('')
              setLoading(false)
            })
        }}
        className='w-[100%]  bg-white || rounded-md || py-5 || max-h-[100%] || overflow-y-auto || scrollStyle relative'
      >
        <button
          type='button'
          onClick={() => setOtpOpen(false)}
          className='w-[30px] absolute top-2 end-2 || flex || items-center || justify-center || h-[30px] || bg-mainColor || duration-300 || hover:bg-mainColor/80 || rounded-full'
        >
          <IoMdClose className='text-xl text-white' />
        </button>
        <div className='flex  || items-center || justify-center || flex-col'>
          <h2 className='text-[16px] || font-bold || text-mainColor || mb-3'>
            {locale === 'ar' ? 'ادخل رمز التأكيد' : 'Enter verification code'}
          </h2>
          <div style={{ direction: 'ltr' }} className=''>
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={numberOfOtp}
              renderSeparator={<span>-</span>}
              containerStyle={{
                flexWrap: 'wrap',
                gap:"5px"
              }}
              renderInput={props => (
                <input
                  {...props}
                  style={{
                    border: '1px solid #00cfe8',
                    outline: 'none'
                  }}
                  className='inputFix  !mx-2 !w-[100%] max-w-[200px]  min-w-[60px] || !h-[50px] !px-0 md:!px-2'
                />
              )}
            />
          </div>
          <div className='flex || justify-between || items-center || mt-2 || mb-3'></div>

          <button
            type='submit'
            style={{
              backgroundColor: '#00cfe8'
            }}
            className=' || relative  px-4 || overflow-hidden || hover:bg-mainColor/80 || duration-300 || text-white || block || w-fit || py-2 || rounded-xl '
          >
            <span
              className={`${
                loading ? 'visible opacity-100' : 'invisible opacity-0'
              }  duration-75 cursor-not-allowed || transition-all absolute || items-center || justify-center || flex inset-0 bg-gray-300`}
            >
              <span className=' w-[20px] || h-[20px] || border-2 || border-mainColor || rounded-full border-t-transparent || animate-spin'></span>
            </span>

            {locale === 'ar' ? 'إكمال' : 'Compelte'}
          </button>
          <div className='mt-4'>
            <div className='flex gap-1 justify-center items-center'>
              {resendOtp === 0 && (locale === 'ar' ? 'اذا لم تستلم' : 'If you did not receive')}
              <button
                disabled={loading}
                type='button'
                onClick={() => {
                  setLoading(true)
                  setTimeout(() => {
                    toast.success(locale === 'ar' ? 'تم ارسال رمز التأكيد' : 'Otp has been send')
                    setResendOtp(60)
                    setLoading(false)
                  }, 1000)
                  // axiosPost('auth/verify-phone/', locale, {
                  //   phone: userData.phone
                  // })
                  //   .then(res => {
                  //     if (res.status) {
                  //       toast.success(locale === 'ar' ? 'تم ارسال رمز التأكيد' : 'Otp has been send')
                  //       setResendOtp(60)
                  //     }
                  //   })
                  //   .finally(() => {
                  //     setLoading(false)
                  //   })
                }}
                className={`${
                  resendOtp === 0 ? 'text-mainColor || font-bold || hover:text-mainColor/80 || duration-300' : ''
                }`}
              >
                {resendOtp !== 0
                  ? locale === 'ar'
                    ? `لا تستطيع الارسال مجددا الا بعد ${resendOtp} ثواني`
                    : ` You cannot resend again until after ${resendOtp} seconds`
                  : locale === 'ar'
                  ? 'اعادة ارسال'
                  : 'Resend'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Design
