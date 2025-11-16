import styled from "styled-components"

export const Container = styled.header`
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }
`

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0891b2;
`

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: 1rem;
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
  width: 40px;
  height: 40px;
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

export const CreditsDisplay = styled.div`
  background: linear-gradient(135deg, #0e7490, #14b8a6);
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(14, 116, 144, 0.2);
`

export const Button = styled.button`
  background: ${props => props.variant === 'outline' ? 'transparent' : '#0891b2'};
  color: ${props => props.variant === 'outline' ? '#0891b2' : 'white'};
  border: 2px solid #0891b2;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: ${props => props.variant === 'outline' ? '#0891b2' : '#0e7490'};
    color: white;
    transform: translateY(-2px);
  }

  @media (max-width: 480px) {
    padding: 0.4rem 0.875rem;
    font-size: 0.875rem;
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

