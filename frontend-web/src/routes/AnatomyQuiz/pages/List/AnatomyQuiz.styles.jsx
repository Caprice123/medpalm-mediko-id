import styled from 'styled-components'

export const Container = styled.div`
  min-height: calc(100vh - 63px);
  background: #f0f9ff;
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
      radial-gradient(circle at 20% 30%, rgba(107, 185, 232, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(107, 185, 232, 0.06) 0%, transparent 50%);
    pointer-events: none;
  }
`

export const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`

export const QuizzesList = styled.div`
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

export const QuizCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(107, 185, 232, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  cursor: pointer;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(90deg, #6BB9E8, #3b82f6);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s ease;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(107, 185, 232, 0.2);
    border-color: rgba(107, 185, 232, 0.2);

    &::before {
      transform: scaleX(1);
    }
  }
`

export const QuizImageContainer = styled.div`
  width: 100%;
  height: 200px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #6BB9E8, #3b82f6);
  }
`

export const QuizImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;

  ${QuizCard}:hover & {
    transform: scale(1.05);
  }
`

export const QuizCardContent = styled.div`
  padding: 1.5rem;
`

export const QuizTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.75rem 0;
  line-height: 1.3;
`

export const QuizDescription = styled.p`
  color: #64748b;
  font-size: 0.9375rem;
  margin: 0 0 1rem 0;
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`

export const Tag = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(107, 185, 232, 0.1);
  color: #6BB9E8;
  border-radius: 12px;
  font-size: 0.75rem;
  fontWeight: 600;
`

export const QuestionCount = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, rgba(107, 185, 232, 0.1), rgba(59, 130, 246, 0.05));
  color: #6BB9E8;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid rgba(107, 185, 232, 0.2);

  &::before {
    content: '🫀';
    font-size: 1rem;
  }
`

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid rgba(107, 185, 232, 0.2);
  border-top: 4px solid #6BB9E8;
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
