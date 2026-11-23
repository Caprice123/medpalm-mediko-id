import { FaCheck } from 'react-icons/fa'
import { STEPS } from '../../hooks/useCreateReport'
import { Nav, Step, Marker, StepTitle, Connector } from './StepNav.styles'

// Where the student is, and how much is left. Two steps is few enough that
// naming both beats a "Langkah 1 dari 2" counter: the second label is what
// tells them nothing long is hiding behind the button.
//
// A finished step is clickable, so going back is one press on the thing that
// already says where back is; a step not reached yet is not.
const StepNav = ({ stepIndex, onStepClick }) => (
  <Nav aria-label="Langkah pembuatan laporan">
    {STEPS.map((step, index) => {
      const isDone = index < stepIndex
      const isCurrent = index === stepIndex

      return (
        <Step key={step.key}>
          {index > 0 && <Connector $done={isDone || isCurrent} />}

          <Marker
            type="button"
            $done={isDone}
            $current={isCurrent}
            disabled={!isDone}
            onClick={() => isDone && onStepClick(index)}
            aria-current={isCurrent ? 'step' : undefined}
          >
            {isDone ? <FaCheck /> : index + 1}
          </Marker>

          <StepTitle $active={isDone || isCurrent}>{step.label}</StepTitle>
        </Step>
      )
    })}
  </Nav>
)

export default StepNav
