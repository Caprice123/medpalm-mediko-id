import { Fragment } from 'react'
import { Nav, Sep, Crumb, CurrentCrumb } from './Breadcrumb.styles'

/**
 * @param {Object} props
 * @param {Array<{ label: string, onClick?: Function, key?: string|number }>} props.items
 *   The last item always renders as the current (non-clickable) crumb, even if it has an onClick.
 * @param {string} [props.className] - For page-specific spacing (e.g. margin-bottom)
 * @param {Object} [props.style] - For page-specific spacing (e.g. margin-bottom)
 */
function Breadcrumb({ items = [], className, style }) {
  return (
    <Nav className={className} style={style}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        const isClickable = !!item.onClick && !isLast

        return (
          <Fragment key={item.key ?? i}>
            {i > 0 && <Sep>/</Sep>}
            {isClickable
              ? <Crumb type="button" onClick={item.onClick}>{item.label}</Crumb>
              : <CurrentCrumb>{item.label}</CurrentCrumb>}
          </Fragment>
        )
      })}
    </Nav>
  )
}

export default Breadcrumb
