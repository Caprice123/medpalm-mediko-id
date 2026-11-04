import styled from 'styled-components'
import { colors } from '@config/colors'

export const Container = styled.div`
  min-height: calc(100vh - 44px);
  background: var(--color-brand-blue-tint);
  padding: 3rem 1.5rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      radial-gradient(circle at 20% 30%, rgba(30, 115, 170, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(30, 115, 170, 0.06) 0%, transparent 50%);
    pointer-events: none;
  }

   @media (max-width: 768px) {
    min-height: 100vh;
  }
`

export const Content = styled.div`
  margin: 0 auto;
  position: relative;
  z-index: 1;
`

export const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  animation: fadeInDown 0.6s ease;

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--color-brand-blue) 0%, var(--color-brand-blue-deep) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.75rem 0;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

export const Subtitle = styled.p`
  font-size: 1.125rem;
  color: var(--color-gray-500);
  margin: 0;
  font-weight: 400;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`

export const CalculatorsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  animation: fadeInUp 0.6s ease;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`

export const CalculatorCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(30, 115, 170, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(90deg, var(--color-brand-blue), var(--color-brand-blue-deep));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s ease;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(30, 115, 170, 0.2);
    border-color: rgba(30, 115, 170, 0.2);

    &::before {
      transform: scaleX(1);
    }
  }
`

export const CalculatorTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0 0 0.75rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    font-size: 1.75rem;
  }
`

export const CalculatorDescription = styled.p`
  color: var(--color-gray-500);
  font-size: 0.9375rem;
  margin: 0 0 1.5rem 0;
  line-height: 1.7;
  min-height: 60px;
`

export const FieldCount = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, rgba(30, 115, 170, 0.1), rgba(4, 74, 119, 0.05));
  color: var(--color-brand-blue-deep);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid rgba(30, 115, 170, 0.2);

  &::before {
    content: '📋';
    font-size: 1rem;
  }
`

export const CalculatorForm = styled.div`
  background: white;
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 10px 40px rgba(30, 115, 170, 0.1);
  border: 1px solid rgba(30, 115, 170, 0.1);
  animation: slideIn 0.5s ease;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`

export const FormHeader = styled.div`
  background: ${colors.background.paper};
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  position: relative;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

export const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`

export const BackButton = styled.button`
  background: white;
  color: var(--color-gray-700);
  border: 1px solid var(--color-gray-300);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: var(--color-gray-50);
    border-color: var(--color-gray-400);
  }
`

export const TopicInfo = styled.div`
  flex: 1;

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-gray-900);
    margin: 0 0 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    @media (max-width: 768px) {
      font-size: 1.25rem;
    }
  }

  p {
    font-size: 0.875rem;
    color: var(--color-gray-500);
    margin: 0;
    line-height: 1.5;
  }
`

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
`

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;

  ${props => props.university && `
    background: var(--color-brand-blue-tint);
    color: ${colors.primary.dark};
    border: 1px solid ${colors.primary.main};
  `}

  ${props => props.semester && `
    background: var(--color-brand-green-tint);
    color: ${colors.success.dark};
    border: 1px solid ${colors.success.main};
  `}

  ${props => props.kategori && `
    background: var(--color-warning-tint);
    color: #92400E;
    border: 1px solid var(--color-warning);
  `}
`

export const FormTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--color-brand-blue), var(--color-brand-blue-deep));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  flex: 1;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

export const FormDescription = styled.p`
  font-size: 0.9375rem;
  color: var(--color-gray-500);
  margin: 0.5rem 0 0 0;
  line-height: 1.6;
`

export const InputsSection = styled.div`
  margin-bottom: 1.5rem;
`

export const SectionTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-brand-blue);
  margin: 0 0 1rem 0;
`

export const InputsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
`

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  border: 1.5px solid var(--color-gray-200);
  border-radius: 14px;
  margin: 8px 0;
  background: white;
  gap: 0.75rem;
  transition: border-color 0.2s;

  &:focus-within {
    border-color: var(--color-brand-blue);
  }
`

export const FormLabel = styled.label`
  font-size: 16px;
  font-weight: 700;
  color: var(--color-gray-800);
  display: flex;
  align-items: center;
  gap: 4px;
  line-height: 1.3;
`

export const LabelWithDescription = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const FieldDescription = styled.p`
  font-size: 12px;
  color: var(--color-gray-400);
  margin: 0;
  line-height: 1.4;
`

export const FormInput = styled.input`
  padding: 0.875rem 1rem;
  border: 2px solid var(--color-gray-200);
  border-radius: 12px;
  font-size: 0.9375rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  background: var(--color-surface-page);
  color: var(--color-gray-800);
  font-weight: 500;

  &:focus {
    outline: none;
    border-color: var(--color-brand-blue);
    background: white;
    box-shadow: 0 0 0 4px rgba(30, 115, 170, 0.1);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: var(--color-gray-400);
    font-weight: 400;
  }

  &:hover:not(:focus) {
    border-color: var(--color-gray-300);
  }
`

export const CalculateButton = styled.button`
  background: linear-gradient(135deg, var(--color-brand-blue) 0%, var(--color-brand-blue-deep) 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 16px;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  width: 100%;
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 4px 20px rgba(30, 115, 170, 0.25);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(30, 115, 170, 0.35);

    &::before {
      left: 100%;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    background: linear-gradient(135deg, var(--color-gray-300), var(--color-gray-400));
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

export const ResultSection = styled.div`
  background: ${colors.background.paper};
  border-radius: 16px;
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`

export const ResultHeader = styled.div`
  text-align: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-gray-200);
  margin-bottom: 1.5rem;
`

export const ResultLabel = styled.p`
  font-size: 0.75rem;
  color: var(--color-gray-500);
  margin: 0 0 0.75rem 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
`

export const ResultValue = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  color: ${colors.primary.main};
  margin: 0 0 1.5rem 0;
  line-height: 1.2;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`

export const ResultUnit = styled.span`
  font-size: 1.5rem;
  color: var(--color-gray-500);
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`

export const ResultDetails = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-gray-200);
`

export const ResultDetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  font-size: 0.875rem;
  border-bottom: 1px solid var(--color-gray-100);

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`

export const DetailLabel = styled.span`
  font-weight: 500;
  color: var(--color-gray-500);
`

export const DetailValue = styled.span`
  font-weight: 600;
  color: var(--color-gray-900);
`

export const ErrorMessage = styled.div`
  color: var(--color-danger);
  font-size: 0.75rem;
  margin-top: 0.25rem;
`

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(30, 115, 170, 0.2);
  border-top: 3px solid var(--color-brand-blue);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: var(--color-gray-400);
  background: white;
  border-radius: 20px;
  border: 2px dashed var(--color-gray-200);
`

export const EmptyIcon = styled.div`
  font-size: 72px;
  margin-bottom: 24px;
  opacity: 0.5;
`

export const EmptyText = styled.p`
  font-size: 18px;
  color: var(--color-gray-500);
  margin: 0;
  font-weight: 500;
`

export const ClassificationsSection = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-gray-200);
`

export const ClassificationTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-gray-500);
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`

export const ClassificationItem = styled.div`
  margin-bottom: 0.75rem;
  padding: 1rem;
  background: var(--color-gray-50);
  border-radius: 8px;
  border-left: 3px solid ${colors.primary.main};

  &:last-child {
    margin-bottom: 0;
  }
`

export const ClassificationName = styled.div`
  font-size: 0.75rem;
  color: ${colors.primary.main};
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
`

export const ClassificationValue = styled.div`
  font-size: 0.875rem;
  color: var(--color-gray-900);
  font-weight: 500;
  line-height: 1.5;
`

export const ClassificationEmpty = styled.div`
  font-size: 0.875rem;
  color: var(--color-gray-400);
  font-style: italic;
`

export const ClinicalReferencesSection = styled.div`
  margin-top: 1.5rem;
`

export const ClinicalReferenceBox = styled.div`
  padding: 1rem 1.25rem;
  background: var(--color-warning-tint);
  border-radius: 8px;
  border-left: 3px solid var(--color-warning);
`

export const ClinicalReferenceItem = styled.div`
  font-size: 0.875rem;
  color: #92400e;
  line-height: 1.6;
  margin-bottom: ${props => props.isLast ? '0' : '0.5rem'};

  strong {
    font-weight: 600;
    color: #78350f;
  }
`

// MCQ-style Option Cards
export const OptionCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid ${props => props.selected ? '#8b5cf6' : 'var(--color-gray-200)'};
  border-radius: 12px;
  background: ${props => props.selected ? '#f5f3ff' : 'white'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #8b5cf6;
    background: #faf5ff;
  }
`

export const OptionLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
`

export const OptionContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

export const OptionTextContent = styled.div`
  font-size: 15px;
  color: var(--color-gray-700);
  line-height: 1.5;
  font-weight: 500;
`

export const OptionImageContainer = styled.div`
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid var(--color-gray-200);
  cursor: zoom-in;
  transition: all 0.2s;
  max-width: 300px;

  &:hover {
    border-color: #8b5cf6;
    transform: scale(1.02);
  }
`

export const OptionImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
`

// Result Tabs
export const ResultTabsWrapper = styled.div`
  margin-top: 2rem;
`

export const ResultTabBar = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 2px solid var(--color-gray-200);
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`

export const ResultTab = styled.button`
  padding: 0.75rem 1.25rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.$active ? 'var(--color-brand-blue)' : 'transparent'};
  margin-bottom: -2px;
  font-size: 0.875rem;
  font-weight: ${props => props.$active ? '700' : '500'};
  color: ${props => props.$active ? 'var(--color-brand-blue)' : 'var(--color-gray-500)'};
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    color: var(--color-brand-blue);
  }
`

export const ResultTabContent = styled.div`
  background: ${props => props.theme?.colors?.background?.paper || 'white'};
  border-radius: 0 0 16px 16px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
`

export const ResultValueBox = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(30, 115, 170,0.07), rgba(4, 74, 119,0.04));
  border-radius: 12px;
  border: 1px solid rgba(30, 115, 170,0.15);
  margin-bottom: 1.75rem;
`

export const ClassificationTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
`

export const ClassificationThead = styled.thead`
  background: var(--color-brand-blue-tint);
`

export const ClassificationTh = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-brand-blue-deep);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid var(--color-gray-200);
`

export const ClassificationTr = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid var(--color-gray-100);
  }
  &:hover {
    background: var(--color-gray-50);
  }
`

export const ClassificationTd = styled.td`
  padding: 0.875rem 1rem;
  color: var(--color-gray-700);
  vertical-align: middle;

  &:first-child {
    font-weight: 600;
    color: var(--color-gray-900);
    width: 40%;
  }
`

export const ClassificationBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(30, 115, 170,0.12), rgba(4, 74, 119,0.08));
  color: var(--color-brand-blue-deep);
  font-weight: 600;
  font-size: 0.875rem;
  border: 1px solid rgba(30, 115, 170,0.2);
`

export const ClassificationEmptyBadge = styled.span`
  color: var(--color-gray-400);
  font-style: italic;
  font-size: 0.8rem;
`

export const FieldImageContainer = styled.div`
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid var(--color-gray-200);
  cursor: zoom-in;
  transition: all 0.2s;
  margin-bottom: 0.75rem;

  &:hover {
    border-color: #8b5cf6;
    transform: scale(1.01);
  }
`
