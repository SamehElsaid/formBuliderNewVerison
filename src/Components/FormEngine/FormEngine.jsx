  import {
    formEngineRsuiteCssLoader,
    ltrCssLoader,
    RsLocalizationWrapper,
    rSuiteComponents,
    rsErrorMessage,
    rtlCssLoader,
    rsTooltip
  } from '@react-form-builder/components-rsuite';
  import { BiDi, BuilderView } from '@react-form-builder/core';
  import dynamic from 'next/dynamic';
  import {  useRef } from 'react';
  import { actions } from './actions';

  const FormBuilder = dynamic(() => import('@react-form-builder/designer').then((mod) => mod.FormBuilder), {
    ssr: false
  });

  const components = [...rSuiteComponents, rsErrorMessage].map(definer => definer.build());

  const formName = 'nextForm';



  const view = new BuilderView(components)
    .withErrorMeta(rsErrorMessage.build())
    .withTooltipMeta(rsTooltip.build())
    .withViewerWrapper(RsLocalizationWrapper)
    .withCssLoader(BiDi.LTR, ltrCssLoader)
    .withCssLoader(BiDi.RTL, rtlCssLoader)
    .withCssLoader('common', formEngineRsuiteCssLoader)
    .withErrorMeta(rsErrorMessage.build())
    .withTooltipMeta(rsTooltip.build());

  // We're hiding the form panel because it's not fully functional in this example
  const customization = {
    Forms_Tab: {
      hidden: true
    }
  };

  export default function FormEngine() {
    const builderRef = useRef();

    const handleFormChange = (formData) => {
      console.log(JSON.parse(builderRef.current?.formAsString))
    };

    const setRef = (builder) => {
      if (builder) {
        builderRef.current = builder;
      }
    };

    return (
      <FormBuilder
        view={view}
        actions={actions}
        formName={formName}
        customization={customization}
        onFormDataChange={handleFormChange}
        builderRef={setRef}
      />
    );
  }
