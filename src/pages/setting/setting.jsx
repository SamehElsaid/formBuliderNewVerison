import Breadcrumbs from "src/Components/breadcrumbs"
import { useIntl } from "react-intl"

function Setting() {
  const { messages } = useIntl()

  return (
    <div>
      <Breadcrumbs routers={[{ name: messages.dialogs.settings }]} isDashboard />

    </div>
  )
}

export default Setting
