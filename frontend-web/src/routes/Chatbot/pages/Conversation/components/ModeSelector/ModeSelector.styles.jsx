import styled from 'styled-components'

export const Container = styled.div`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 0.75rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  flex-shrink: 0;

  .desktop-only {
    display: flex;
  }

  .mobile-only {
    display: none;
  }

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    gap: 0.5rem;

    .desktop-only {
      display: none;
    }

    .mobile-only {
      display: flex;
      flex: 1;
    }
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`

export const ModesWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  flex: 1;

  @media (max-width: 768px) {
    gap: 0.375rem;
  }
`

export const ModeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.active ? '#3b82f6' : '#e5e7eb'};
  background: ${props => props.active ? '#eff6ff' : 'white'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.active ? '#3b82f6' : '#374151'};

  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  .cost {
    font-size: 0.75rem;
    opacity: 0.7;
  }

  .mode-description {
    margin: 0;
    font-size: 0.8125rem;
    line-height: 1.5;
    color: #6b7280;
    text-align: left;
    font-weight: 400;
  }

  &.mode-card {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    padding: 1rem;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.8125rem;
    gap: 0.375rem;
    flex: 1;

    .cost {
      font-size: 0.6875rem;
    }

    &.mode-card {
      padding: 0.875rem;

      .mode-description {
        font-size: 0.75rem;
      }
    }
  }
`

export const InfoButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #6b7280;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
    background: #eff6ff;
  }

  &.desktop-only {
    display: flex;
  }

  @media (max-width: 768px) {
    &.desktop-only {
      display: none;
    }
  }
`

export const InfoModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const InfoModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
`

export const InfoModalContent = styled.div`
  position: relative;
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

  @media (max-width: 768px) {
    width: 95%;
    max-height: 90vh;
  }
`

export const InfoModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;

  h3 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
  }

  @media (max-width: 768px) {
    padding: 1rem 1.25rem;

    h3 {
      font-size: 1rem;
    }
  }
`

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #111827;
  }
`

export const InfoModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    padding: 1.25rem;
    gap: 1rem;
  }
`

export const ModeInfo = styled.div`
  padding: 0.75rem;
  border-radius: 8px;
  background: #f9fafb;

  .mode-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;

    .mode-icon {
      font-size: 1.25rem;
    }

    .mode-label {
      font-size: 1rem;
      font-weight: 600;
      color: #111827;
    }
  }

  .mode-description {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.6;
    color: #6b7280;
    padding-left: 2rem;
  }

  &.mode-selector-item {
    padding: 0;
    background: transparent;

    .mode-description {
      padding-left: 0;
      font-size: 0.8125rem;
      color: #6b7280;
      margin-top: 0.25rem;
    }
  }

  @media (max-width: 768px) {
    padding: 0.625rem;

    .mode-header {
      .mode-icon {
        font-size: 1.125rem;
      }

      .mode-label {
        font-size: 0.9375rem;
      }
    }

    .mode-description {
      font-size: 0.8125rem;
      padding-left: 1.75rem;
    }

    &.mode-selector-item {
      padding: 0;
      background: transparent;

      .mode-description {
        padding-left: 0;
        margin-top: 0.25rem;
      }
    }
  }
`
