import { Button } from '@mui/material'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import ChangePasswordCard from 'src/Components/ChangePasswordCard'
import Account from 'src/Components/ProfileAc/Account'

function Profile() {
  const { locale } = useIntl()
  const [type, setType] = useState('account')

  return (
    <div>
      <div className="flex || justify-center || gap-2 || items-center || flex-wrap">
        {/* <Avatar /> */}
        <Button variant={type === 'account' ? 'contained' : 'outlined'} color='primary' onClick={() => setType('account')}>
          {locale === 'ar' ? 'الحساب الشخصي' : 'Account'}
        </Button>
        <Button variant={type === 'package' ? 'contained' : 'outlined'} color='primary' onClick={() => setType('package')}>
          {locale === 'ar' ? 'العروض' : 'Package'}
        </Button>
        <Button variant={type === 'password' ? 'contained' : 'outlined'} color='primary' onClick={() => setType('password')}>
          {locale === 'ar' ? 'كلمة المرور' : 'Password'}
        </Button>
      </div>

      {type === 'account' && <Account />}
      {/* {type === 'package' && <Package />}
       */}
       {type === 'password' && <ChangePasswordCard />}

    </div>
  )
}

export default Profile
