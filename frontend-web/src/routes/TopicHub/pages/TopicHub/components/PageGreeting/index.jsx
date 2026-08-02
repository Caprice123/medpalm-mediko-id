import { PageHeader, Greeting, GreetingSubtitle } from './PageGreeting.styles'

export default function PageGreeting({ name }) {
  return (
    <PageHeader>
      <Greeting>Hi, {name}.</Greeting>
      <GreetingSubtitle>
        Pilih topik dari Sistem Blok atau Ilmu Lintas Sistem untuk mulai belajar.
      </GreetingSubtitle>
    </PageHeader>
  )
}
