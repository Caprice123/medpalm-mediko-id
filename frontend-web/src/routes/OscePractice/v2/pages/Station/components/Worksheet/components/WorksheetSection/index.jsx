import { PiCheckCircle, PiCircleDashed, PiCaretDown, PiCaretRight } from 'react-icons/pi'
import { Section, Header, Label, Detail, Body } from './WorksheetSection.styles'

// The shell every worksheet section sits in: a header that always shows whether the section is
// filled, and a body that can be folded away without taking that signal with it.
function WorksheetSection({ label, filled, detail, isOpen, onToggle, children }) {
  return (
    <Section>
      <Header type="button" onClick={onToggle} aria-expanded={isOpen} $open={isOpen} $filled={filled}>
        {filled ? <PiCheckCircle size={18} /> : <PiCircleDashed size={18} />}
        <Label>{label}</Label>
        <Detail $filled={filled}>{detail}</Detail>
        {isOpen ? <PiCaretDown size={14} /> : <PiCaretRight size={14} />}
      </Header>

      {isOpen && <Body>{children}</Body>}
    </Section>
  )
}

export default WorksheetSection
