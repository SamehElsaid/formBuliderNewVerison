import Banners from "src/Components/Banners/Banners"
import SocialMedia from "src/Components/Banners/SocialMedia"
import OurFeatures from "src/Components/OurFeatures/OurFeatures"

function Index() {
  return (
    <div>
      <Banners />
      <div className="mt-5"></div>
      <OurFeatures />
      <div className="mt-5"></div>
      <SocialMedia />
    </div>
  )
}

export default Index
