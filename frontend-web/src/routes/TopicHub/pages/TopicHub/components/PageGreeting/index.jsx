import { PageHeader, Greeting, GreetingName, GreetingSubtitle } from './PageGreeting.styles'

export default function PageGreeting({ name }) {
  return (
    <PageHeader>
      <Greeting>Hi, <GreetingName>{name}</GreetingName>.</Greeting>
      <GreetingSubtitle>Pilih topik untuk mulai belajar.</GreetingSubtitle>
    </PageHeader>
  )
}
