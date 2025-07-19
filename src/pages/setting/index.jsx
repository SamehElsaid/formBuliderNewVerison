import Breadcrumbs from "src/Components/breadcrumbs"
import { useIntl } from "react-intl"

function Setting() {
  const { locale } = useIntl()

  return (
    <div>
      <Breadcrumbs routers={[{ name: locale === 'ar' ? 'الإعدادات' : 'Settings' }]} isDashboard />

    </div>
  )
}

export default Setting
