import { Row, Head, Icon, Label, Switch, Body } from './FilterRow.styles'

// One filter line: an icon, its name, the switch that turns it on, and whatever
// inputs it needs — which only appear once it is on, so an unused filter costs
// no space.
const FilterRow = ({ id, icon, label, checked, onToggle, children }) => (
  <Row>
    <Head>
      <Icon>{icon}</Icon>
      <Label as="label" htmlFor={id}>{label}</Label>
      <Switch>
        <input id={id} type="checkbox" checked={checked} onChange={onToggle} />
        <span />
      </Switch>
    </Head>

    {checked && children && <Body>{children}</Body>}
  </Row>
)

export default FilterRow
