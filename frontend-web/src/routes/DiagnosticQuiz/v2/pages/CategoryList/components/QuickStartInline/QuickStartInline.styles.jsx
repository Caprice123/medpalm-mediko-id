import styled from 'styled-components'

export const Wrap = styled.div`
  background: #f9fafb;
  border-top: 1px solid #f3f4f6;
  padding: 1.25rem 1.5rem 1.5rem;
`

export const SectionTitle = styled.div`
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #0d9488;
  margin-bottom: 0.2rem;
`

export const Description = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0 0 1rem;
  line-height: 1.5;
`

export const Row = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 1.25rem;
  flex-wrap: wrap;
`

export const Col = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`

export const FieldLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  color: #374151;
  letter-spacing: 0.01em;
`

export const PresetsRow = styled.div`
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
`

export const PresetBtn = styled.button`
  padding: 0.4rem 0.9rem;
  border-radius: 8px;
  border: 1.5px solid ${p => p.$active ? '#6BB9E8' : '#e5e7eb'};
  background: ${p => p.$active ? 'linear-gradient(135deg, #6BB9E8 0%, #8DC63F 100%)' : '#fff'};
  color: ${p => p.$active ? '#fff' : '#374151'};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
  box-shadow: ${p => p.$active ? '0 2px 6px rgba(107,185,232,0.35)' : 'none'};

  &:hover {
    border-color: #6BB9E8;
    ${p => !p.$active && 'color: #6BB9E8;'}
  }
`

export const CountInput = styled.input`
  width: 72px;
  padding: 0.4rem 0.6rem;
  border: 1.5px solid #6BB9E8;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #374151;
  outline: none;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(107,185,232,0.1);
`

export const StartButton = styled.button`
  padding: 0.6rem 2rem;
  background: linear-gradient(135deg, #6BB9E8 0%, #8DC63F 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.15s, transform 0.15s;
  flex-shrink: 0;
  box-shadow: 0 4px 14px rgba(107, 185, 232, 0.4);
  letter-spacing: 0.01em;

  &:hover { opacity: 0.92; transform: translateY(-1px); }
  &:active { transform: translateY(0); }
  &:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
`

/* ── Custom subtopic dropdown ── */

export const DropdownWrap = styled.div`
  position: relative;
  min-width: 220px;
  flex: 1;
`

export const DropdownTrigger = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  border: 1.5px solid ${p => p.$open ? '#6BB9E8' : '#e5e7eb'};
  border-radius: 10px;
  background: #fff;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  text-align: left;
  box-shadow: ${p => p.$open ? '0 0 0 3px rgba(107,185,232,0.15)' : 'none'};
  transition: border-color 0.15s, box-shadow 0.15s;

  &:hover { border-color: #6BB9E8; }
`

export const TriggerChevron = styled.span`
  font-size: 0.75rem;
  color: #9ca3af;
  transition: transform 0.2s;
  transform: ${p => p.$open ? 'rotate(-90deg)' : 'rotate(90deg)'};
  flex-shrink: 0;
`

export const DropdownPanel = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 100;
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  overflow: hidden;
`

export const DropdownHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.6rem 0.875rem;
  border-bottom: 1px solid #f3f4f6;
  background: #f9fafb;
`

export const DropdownCount = styled.span`
  font-size: 0.82rem;
  font-weight: 600;
  color: #6b7280;
`

export const DropdownActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`

export const DropdownAction = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: 0.82rem;
  font-weight: 600;
  color: #0d9488;
  cursor: pointer;

  &:hover { text-decoration: underline; }
`

export const DropdownDivider = styled.span`
  font-size: 0.82rem;
  color: #d1d5db;
`

export const DropdownList = styled.div`
  max-height: 220px;
  overflow-y: auto;
`

export const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.55rem 0.875rem;
  cursor: pointer;
  transition: background 0.1s;

  &:hover { background: #f0fdf9; }
`

export const CheckBox = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 5px;
  border: 1.5px solid ${p => p.$checked ? '#0d9488' : '#d1d5db'};
  background: ${p => p.$checked ? '#0d9488' : '#fff'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
  font-size: 0.65rem;
  color: #fff;
`

export const ItemName = styled.span`
  flex: 1;
  font-size: 0.875rem;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const ItemCount = styled.span`
  font-size: 0.82rem;
  color: #9ca3af;
  flex-shrink: 0;
`
