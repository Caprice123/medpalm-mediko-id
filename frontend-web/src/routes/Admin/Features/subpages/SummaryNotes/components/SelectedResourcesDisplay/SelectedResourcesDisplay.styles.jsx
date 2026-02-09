import styled from 'styled-components'
import { colors } from '@config/colors'

export const Container = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  background: #f9fafb;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${colors.primary.main};
    background: white;
  }
`

export const SelectButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  color: ${colors.text.secondary};
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    border-color: ${colors.primary.main};
    color: ${colors.primary.main};
    background: ${colors.primary.light};
  }
`

export const SelectedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const SelectedItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  gap: 0.75rem;
`

export const ItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`

export const ItemTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const ItemMeta = styled.div`
  font-size: 0.75rem;
  color: ${colors.text.secondary};
  margin-top: 0.25rem;
`

export const RemoveButton = styled.button`
  padding: 0.25rem 0.5rem;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  color: #ef4444;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background: #fef2f2;
    border-color: #ef4444;
  }
`

export const Footer = styled.div`
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const Count = styled.div`
  font-size: 0.875rem;
  color: ${colors.text.secondary};
`

export const ChangeButton = styled.button`
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  color: ${colors.text.primary};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${colors.primary.main};
    color: ${colors.primary.main};
  }
`
