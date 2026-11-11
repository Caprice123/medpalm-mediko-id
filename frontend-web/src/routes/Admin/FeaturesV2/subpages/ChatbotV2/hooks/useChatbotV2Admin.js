import { useState } from 'react'

export const TABS = [
  { key: 'conversations', label: 'Percakapan' },
  { key: 'research', label: 'Mode Research' },
  { key: 'domains', label: 'Domain' },
  { key: 'journals', label: 'Jurnal' },
]

// The per-mode feature settings (prompts, models, costs, access type) are not
// duplicated here — they stay in the V1 "Kelola Fitur" panel, which writes the
// same `chatbot_*` constants this panel reads.
export const useChatbotV2Admin = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].key)

  return { activeTab, setActiveTab }
}
