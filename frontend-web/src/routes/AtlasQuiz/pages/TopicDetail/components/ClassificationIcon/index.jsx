import { PiPulse, PiWarning } from 'react-icons/pi'

export default function ClassificationIcon({ type, size = 11 }) {
  return type === 'patologi' ? <PiWarning size={size} /> : <PiPulse size={size} />
}
