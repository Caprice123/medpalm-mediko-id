import React from 'react'
import { Handle } from './ResizeHandle.styles'

const ResizeHandle = ({ onMouseDown }) => {
  return <Handle onMouseDown={onMouseDown} />
}

export default ResizeHandle
