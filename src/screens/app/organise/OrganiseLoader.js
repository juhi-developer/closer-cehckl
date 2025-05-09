import React from "react"
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native"
import { SCREEN_WIDTH } from "../../../styles/globalStyles"
import { scale } from "../../../utils/metrics"

const OrganiseLoader = (props) => (
  <ContentLoader 
    width={SCREEN_WIDTH - 30}
    height={460}
    backgroundColor="#fff"
    foregroundColor="#ecebeb"
  >
    <Rect x="0" y="0" rx="12" ry="12" width={SCREEN_WIDTH - 30} height="20" /> 
    <Rect x="0" y="40" rx="12" ry="12" width={SCREEN_WIDTH / 2 - scale(34)} height="200" r="12" /> 
    <Rect  r="12" x={SCREEN_WIDTH / 2 - scale(34) + 17} y="40" rx="12" ry="12" width={SCREEN_WIDTH / 2 - scale(34)} height="200" /> 
  </ContentLoader>
)

export default OrganiseLoader

