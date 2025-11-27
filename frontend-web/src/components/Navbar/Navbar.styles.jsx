import styled from "styled-components"

export const Container = styled.header`
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 0.75rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
`

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0891b2;

  a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: inherit;
  }

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.75rem;
    width: 100%;
    justify-content: space-between;
  }
`

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

export const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #0891b2;
`

export const UserName = styled.span`
  font-weight: 500;
  color: #374151;

  @media (max-width: 480px) {
    display: none;
  }
`

export const StatusSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  padding: 0.375rem 0.75rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    gap: 0.375rem;
    padding: 0.25rem 0.5rem;
  }
`

export const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }

  span:first-child {
    font-size: 1rem;
    @media (max-width: 768px) {
      font-size: 0.875rem;
    }
  }
`

export const StatusDivider = styled.div`
  width: 1px;
  height: 20px;
  background: #e5e7eb;
  margin: 0 0.25rem;

  @media (max-width: 768px) {
    height: 16px;
  }
`

export const Button = styled.button`
  background: ${props => props.variant === 'outline' ? 'transparent' : '#0891b2'};
  color: ${props => props.variant === 'outline' ? '#0891b2' : 'white'};
  border: 1.5px solid #0891b2;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: ${props => props.variant === 'outline' ? '#0891b2' : '#0e7490'};
    color: white;
    transform: translateY(-1px);
  }

  @media (max-width: 480px) {
    padding: 0.375rem 0.75rem;
    font-size: 0.8125rem;
  }
`

export const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid rgba(239, 68, 68, 0.2);
  font-size: 0.875rem;
`

