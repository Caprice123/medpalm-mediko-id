import styled from 'styled-components'

export const Container = styled.div`
  min-height: calc(100vh - 63px);
  background: linear-gradient(135deg, #f0fdfa 0%, #cffafe 100%);
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
      radial-gradient(circle at 20% 30%, rgba(6, 182, 212, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(8, 145, 178, 0.06) 0%, transparent 50%);
    pointer-events: none;
  }
`

export const Content = styled.div`
  max-width: 1200px;
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
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
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
  color: #64748b;
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
  box-shadow: 0 4px 20px rgba(6, 182, 212, 0.08);
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
    background: linear-gradient(90deg, #06b6d4, #0891b2);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s ease;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(6, 182, 212, 0.2);
    border-color: rgba(6, 182, 212, 0.2);

    &::before {
      transform: scaleX(1);
    }
  }
`

export const CalculatorTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.75rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '🧮';
    font-size: 1.75rem;
  }
`

export const CalculatorDescription = styled.p`
  color: #64748b;
  font-size: 0.9375rem;
  margin: 0 0 1.5rem 0;
  line-height: 1.7;
  min-height: 60px;
`

export const FieldCount = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(8, 145, 178, 0.05));
  color: #0891b2;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid rgba(6, 182, 212, 0.2);

  &::before {
    content: '📋';
    font-size: 1rem;
  }
`

export const CalculatorForm = styled.div`
  background: white;
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 10px 40px rgba(6, 182, 212, 0.1);
  border: 1px solid rgba(6, 182, 212, 0.1);
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
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f1f5f9;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, #06b6d4, #0891b2);
  }
`

export const BackButton = styled.button`
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  font-size: 20px;
  cursor: pointer;
  color: #64748b;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover {
    background: linear-gradient(135deg, #06b6d4, #0891b2);
    color: white;
    transform: translateX(-4px);
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
  }

  &:active {
    transform: translateX(-2px) scale(0.95);
  }
`

export const FormTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, #06b6d4, #0891b2);
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
  color: #64748b;
  margin: 0.5rem 0 0 0;
  line-height: 1.6;
`

export const InputsSection = styled.div`
  margin-bottom: 1.5rem;
`

export const SectionTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #06b6d4;
  margin: 0 0 1rem 0;
`

export const InputsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
`

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`

export const FormLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 4px;
`

export const LabelWithDescription = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 10px;
`

export const FieldDescription = styled.p`
  font-size: 12px;
  color: #94a3b8;
  margin: 0;
  line-height: 1.4;
`

export const FormInput = styled.input`
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.9375rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  background: #f8fafc;
  color: #1e293b;
  font-weight: 500;

  &:focus {
    outline: none;
    border-color: #06b6d4;
    background: white;
    box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.1);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: #94a3b8;
    font-weight: 400;
  }

  &:hover:not(:focus) {
    border-color: #cbd5e1;
  }
`

export const CalculateButton = styled.button`
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
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
  box-shadow: 0 4px 20px rgba(6, 182, 212, 0.25);
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
    box-shadow: 0 8px 30px rgba(6, 182, 212, 0.35);

    &::before {
      left: 100%;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    background: linear-gradient(135deg, #cbd5e1, #94a3b8);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

export const ResultSection = styled.div`
  background: linear-gradient(135deg, #f0fdfa 0%, #cffafe 50%, #e0f2fe 100%);
  border: 3px solid #06b6d4;
  border-radius: 24px;
  padding: 3rem 2rem;
  text-align: center;
  margin-top: 2.5rem;
  box-shadow: 0 20px 60px rgba(6, 182, 212, 0.15);
  position: relative;
  overflow: hidden;
  animation: resultPop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);

  @keyframes resultPop {
    0% {
      opacity: 0;
      transform: scale(0.8);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%);
    animation: rotate 20s linear infinite;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

export const ResultLabel = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
  position: relative;
  z-index: 1;
`

export const ResultValue = styled.h2`
  font-size: 4.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 2rem 0;
  line-height: 1;
  position: relative;
  z-index: 1;
  text-shadow: 0 4px 20px rgba(6, 182, 212, 0.2);

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`

export const ResultUnit = styled.span`
  font-size: 2rem;
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  margin-left: 0.75rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

export const ResultDetails = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid rgba(6, 182, 212, 0.2);
  text-align: left;
  position: relative;
  z-index: 1;
`

export const ResultDetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: white;
  border-radius: 16px;
  margin-bottom: 0.75rem;
  font-size: 0.9375rem;
  border: 2px solid rgba(6, 182, 212, 0.15);
  transition: all 0.3s ease;

  &:hover {
    border-color: #06b6d4;
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.1);
  }

  &:last-child {
    margin-bottom: 0;
  }
`

export const DetailLabel = styled.span`
  font-weight: 600;
  color: #64748b;
`

export const DetailValue = styled.span`
  font-weight: 700;
  color: #06b6d4;
  font-size: 1rem;
`

export const ErrorMessage = styled.div`
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  border: 2px solid #ef4444;
  border-radius: 12px;
  padding: 16px 20px;
  color: #991b1b;
  font-size: 14px;
  margin: 20px 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;

  &::before {
    content: '⚠️';
    font-size: 20px;
  }
`

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(6, 182, 212, 0.2);
  border-top: 3px solid #06b6d4;
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
  color: #94a3b8;
  background: white;
  border-radius: 20px;
  border: 2px dashed #e2e8f0;
`

export const EmptyIcon = styled.div`
  font-size: 72px;
  margin-bottom: 24px;
  opacity: 0.5;
`

export const EmptyText = styled.p`
  font-size: 18px;
  color: #64748b;
  margin: 0;
  font-weight: 500;
`
