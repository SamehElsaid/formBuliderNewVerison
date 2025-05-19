import React, { useMemo } from 'react'
import useCollection from './useCollection'
import useBackground from './useBackground'
import useTable from './useTable'
import useContainer from './useContainer'
import useBox from './useBox'
import useUploadImage from './useUploadImage'
import useUploadVideo from './useUploadVideo'
import useRichText from './useRichText'
import useFlexControl from './useFlexControl'
import useButton from './useButton'
import useIconView from './useIconView'
import useCart from './useCart'
import slate from '@react-page/plugins-slate'
import spacer from '@react-page/plugins-spacer'
import '@react-page/plugins-slate/lib/index.css'
import '@react-page/plugins-spacer/lib/index.css'
import useProgressBar from './useProgressBar'
import useOtp from './useOtp'
import useHeader from './useHeader'
import useSection from './UseSection'
import useDynamicTable from './useDynamicTable'
import useGoogleMap from './useMap'

export default function useCellPlugins({ advancedEdit, locale, readOnly, buttonRef, workflowId }) {
  // Hooks Drag Drop Components
  const { collection } = useCollection({ advancedEdit, locale, readOnly, buttonRef, workflowId })
  const { backgroundPlugin } = useBackground({ locale, buttonRef })
  const { table } = useTable({ advancedEdit, locale, buttonRef })
  const { ContainerPlugin } = useContainer({ locale, buttonRef })
  const { BoxControl } = useBox({ locale, buttonRef })
  const { UploadImage } = useUploadImage({ locale, buttonRef })
  const { UploadVideo } = useUploadVideo({ locale, buttonRef })
  const { RichText } = useRichText({ locale, buttonRef })
  const { ProgressBar } = useProgressBar({ locale, buttonRef })
  const { Otp } = useOtp({ locale, buttonRef })
  const { Header } = useHeader({ locale, buttonRef })
  const { FlexControlCell } = useFlexControl({ locale, buttonRef })
  const { ButtonCell } = useButton({ locale, buttonRef })
  const { cartCell } = useCart({ locale, readOnly, buttonRef })
  const { IconView } = useIconView({ locale, buttonRef })
  const { SectionControl } = useSection({ locale, buttonRef });
const { dynamicTable } = useDynamicTable({ locale, buttonRef, advancedEdit });
const { GoogleMap } = useGoogleMap({ locale, buttonRef });
  const cellPlugins = useMemo(
    () => [
      slate(),
      backgroundPlugin,
      ContainerPlugin,
      BoxControl,
      UploadImage,
      UploadVideo,
      spacer,
      collection,
      table,
      RichText,
      ProgressBar,
      Otp,
      ButtonCell,
      FlexControlCell,
      cartCell,
      IconView,
      Header,
      SectionControl,
      dynamicTable,
      GoogleMap
    ],
    [
      backgroundPlugin,
      ContainerPlugin,
      BoxControl,
      UploadImage,
      UploadVideo,
      collection,
      table,
      RichText,
      ProgressBar,
      Otp,
      ButtonCell,
      FlexControlCell,
      cartCell,
      IconView,
      Header,
      SectionControl,
      dynamicTable,
      GoogleMap
    ]
  )

  return { cellPlugins }
}
