import styled from 'styled-components'

export const Container = styled.div`
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`

export const BackButton = styled.button`
  background: transparent;
  color: #6b7280;
  border: 2px solid #e5e7eb;
  padding: 0.625rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  width: 40px;
  height: 40px;

  &:hover {
    background: #f3f4f6;
    border-color: #8b5cf6;
    color: #8b5cf6;
  }
`

export const HeaderContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

export const IconLarge = styled.div`
  width: 60px;
  height: 60px;
  background: rgba(139, 92, 246, 0.15);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  border: 2px solid rgba(139, 92, 246, 0.3);
`

export const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
`

export const AddTopicButton = styled.button`
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
  }

  span {
    font-size: 1.25rem;
  }
`

export const TopicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const TopicCard = styled.div`
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: #8b5cf6;
    box-shadow: 0 8px 20px rgba(139, 92, 246, 0.15);
    transform: translateY(-2px);
  }
`

export const TopicHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`

export const TopicTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #8b5cf6;
  margin: 0 0 0.5rem 0;
  flex: 1;
`

export const StatusBadge = styled.span`
  background: ${props => props.published
    ? 'rgba(16, 185, 129, 0.1)'
    : 'rgba(139, 92, 246, 0.1)'};
  color: ${props => props.published
    ? '#10b981'
    : '#8b5cf6'};
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
`

export const TopicDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 0.75rem;
`

export const TopicStats = styled.div`
  display: flex;
  gap: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
`

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

export const StatLabel = styled.span`
  font-size: 0.75rem;
  color: #9ca3af;
  text-transform: uppercase;
  font-weight: 600;
`

export const StatValue = styled.span`
  font-size: 0.875rem;
  color: #374151;
  font-weight: 700;
`

export const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
`

export const ActionButton = styled.button`
  flex: 1;
  padding: 0.5rem 1rem;
  border: 2px solid ${props => props.danger ? '#ef4444' : '#8b5cf6'};
  background: ${props => props.danger ? 'transparent' : 'rgba(139, 92, 246, 0.1)'};
  color: ${props => props.danger ? '#ef4444' : '#8b5cf6'};
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.danger ? 'rgba(239, 68, 68, 0.1)' : '#8b5cf6'};
    color: ${props => props.danger ? '#dc2626' : 'white'};
    transform: translateY(-1px);
  }
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;

  div:first-child {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #374151;
  }

  p {
    font-size: 0.875rem;
    color: #6b7280;
  }
`

export const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`

export const EmptyText = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`

// Feature Settings Styles
export const FeatureSettingsCard = styled.div`
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`

export const SettingsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

export const SettingsTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #374151;
  margin: 0;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f3f4f6;
`

export const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`

export const SettingItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const SettingLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;

  input {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + span {
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    }

    &:checked + span:before {
      transform: translateX(24px);
    }
  }
`

export const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: 0.3s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`

export const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }
`

export const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  background: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`

export const SaveButton = styled.button`
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  padding: 0.875rem 1.75rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  align-self: flex-start;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`
