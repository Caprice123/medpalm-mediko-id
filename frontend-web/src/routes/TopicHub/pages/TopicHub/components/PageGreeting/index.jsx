import { getGreeting } from '@utils/greeting'
import { PageHeader, Greeting, GreetingName, GreetingSubtitle } from './PageGreeting.styles'

export default function PageGreeting({ name }) {
  return (
    <PageHeader>
      <Greeting>{getGreeting()}, <GreetingName>{name}</GreetingName>.</Greeting>
      <GreetingSubtitle>Pilih topik untuk mulai belajar.</GreetingSubtitle>
    </PageHeader>
  )
}
