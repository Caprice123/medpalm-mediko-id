import styled from 'styled-components'

export const Wrap = styled.div`
  background: var(--color-gray-50);
  border-top: 1px solid var(--color-gray-100);
  padding: 1.25rem 1.5rem 1.5rem;
`

export const SectionTitle = styled.div`
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-brand-blue);
  margin-bottom: 0.2rem;
`

export const Description = styled.p`
  font-size: 0.9rem;
  color: var(--color-gray-500);
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
  color: var(--color-gray-700);
`

export const PresetsRow = styled.div`
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
`

export const PresetBtn = styled.button`
  padding: 0.4rem 0.9rem;
  border-radius: 8px;
  border: 1.5px solid ${p => p.$active ? 'var(--color-brand-blue)' : 'var(--color-gray-200)'};
  background: ${p => p.$active ? 'linear-gradient(135deg, var(--color-brand-blue) 0%, var(--color-brand-blue-light) 100%)' : '#fff'};
  color: ${p => p.$active ? '#fff' : 'var(--color-gray-700)'};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
  box-shadow: ${p => p.$active ? '0 2px 6px rgba(30, 115, 170,0.35)' : 'none'};

  &:hover { border-color: var(--color-brand-blue); ${p => !p.$active && 'color: var(--color-brand-blue);'} }
`

export const CountInput = styled.input`
  width: 72px;
  padding: 0.4rem 0.6rem;
  border: 1.5px solid var(--color-brand-blue);
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--color-gray-700);
  outline: none;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(30, 115, 170,0.1);
`

export const StartButton = styled.button`
  padding: 0.6rem 2rem;
  background: linear-gradient(135deg, var(--color-brand-blue) 0%, var(--color-brand-blue-light) 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.15s, transform 0.15s;
  flex-shrink: 0;
  box-shadow: 0 4px 14px rgba(30, 115, 170,0.4);

  &:hover { opacity: 0.92; transform: translateY(-1px); }
  &:active { transform: translateY(0); }
  &:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
`

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
  border: 1.5px solid ${p => p.$open ? 'var(--color-brand-blue)' : 'var(--color-gray-200)'};
  border-radius: 10px;
  background: #fff;
  font-size: 0.875rem;
  color: var(--color-gray-700);
  cursor: pointer;
  text-align: left;
  box-shadow: ${p => p.$open ? '0 0 0 3px rgba(30, 115, 170,0.15)' : 'none'};
  transition: border-color 0.15s, box-shadow 0.15s;

  &:hover { border-color: var(--color-brand-blue); }
`

export const TriggerChevron = styled.span`
  font-size: 0.75rem;
  color: var(--color-gray-400);
  transition: transform 0.2s;
  transform: ${p => p.$open ? 'rotate(-90deg)' : 'rotate(90deg)'};
  flex-shrink: 0;
`

export const DropdownPanel = styled.div`
  background: #fff;
  border: 1.5px solid var(--color-gray-200);
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
  border-bottom: 1px solid var(--color-gray-100);
  background: var(--color-gray-50);
`

export const DropdownCount = styled.span`
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-gray-500);
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
  color: var(--color-brand-blue);
  cursor: pointer;
  &:hover { text-decoration: underline; }
`

export const DropdownDivider = styled.span`
  font-size: 0.82rem;
  color: var(--color-gray-300);
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
  &:hover { background: var(--color-brand-green-tint); }
`

export const CheckBox = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 5px;
  border: 1.5px solid ${p => p.$checked ? 'var(--color-brand-blue)' : 'var(--color-gray-300)'};
  background: ${p => p.$checked ? 'var(--color-brand-blue)' : '#fff'};
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
  color: var(--color-gray-700);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const ItemCount = styled.span`
  font-size: 0.82rem;
  color: var(--color-gray-400);
  flex-shrink: 0;
`
