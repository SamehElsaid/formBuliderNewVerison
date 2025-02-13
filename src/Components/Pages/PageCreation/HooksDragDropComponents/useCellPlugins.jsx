import React, { useMemo } from 'react';
import useCollection from './useCollection';
import useBackground from './useBackground';
import useTable from './useTable';
import useContainer from './useContainer';
import useBox from './useBox';
import useUploadImage from './useUploadImage';
import useUploadVideo from './useUploadVideo';
import useRichText from './useRichText';
import useFlexControl from './useFlexControl';
import useButton from './useButton';
import useIconView from './useIconView';
import useCart from './useCart';
import slate from '@react-page/plugins-slate';
import spacer from '@react-page/plugins-spacer';
import '@react-page/plugins-slate/lib/index.css';
import '@react-page/plugins-spacer/lib/index.css';

export default function useCellPlugins({ advancedEdit, locale, readOnly }) {
  // Hooks Drag Drop Components
  const { collection } = useCollection({ advancedEdit, locale, readOnly });
  const { backgroundPlugin } = useBackground({ locale });
  const { table } = useTable({ advancedEdit, locale });
  const { ContainerPlugin } = useContainer({ locale });
  const { BoxControl } = useBox({ locale });
  const { UploadImage } = useUploadImage({ locale });
  const { UploadVideo } = useUploadVideo({ locale });
  const { RichText } = useRichText({ locale });
  const { FlexControlCell } = useFlexControl({ locale });
  const { ButtonCell } = useButton({ locale });
  const { cartCell } = useCart({ locale, readOnly });
  const { IconView } = useIconView({ locale });


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
      ButtonCell,
      FlexControlCell,
      cartCell,
      IconView,
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
      ButtonCell,
      FlexControlCell,
      cartCell,
      IconView,
    ]
  );

  return { cellPlugins };
}
