import { useSelector } from 'react-redux'
import { describeWebinarList } from '../../utils/registrationState'
import { Heading } from './PageHeading.styles'

function PageHeading() {
  const { webinars, filter, pagination, loading } = useSelector(state => state.webinarV2)

  const subtitle = loading.isFetchingWebinars && webinars.length === 0
    ? 'Memuat jadwal…'
    : describeWebinarList({
      loadedCount: webinars.length,
      isLastPage: pagination.isLastPage,
      registrationStatus: filter.registrationStatus,
    })

  return (
    <Heading>
      <h1>Webinar</h1>
      <p>{subtitle}</p>
    </Heading>
  )
}

export default PageHeading
