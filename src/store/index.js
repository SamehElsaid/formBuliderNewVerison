// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

import auth from './apps/authSlice/authSlice'
import LoadingHome from './apps/LoadingMainSlice/LoadingMainSlice'
import calendar from './apps/calendar/index'

export const store = configureStore({
  reducer: {
    auth,
    LoadingHome,
    calendar
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
