import styled, { keyframes } from 'styled-components'

const shimmer = keyframes`
  0% { background-position: -600px 0; }
  100% { background-position: 600px 0; }
`

const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
`

export const EmptyWrap = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: var(--color-gray-400);
  background: #fff;
  border-radius: 16px;
  border: 1.5px dashed var(--color-gray-200);
`

export const TopikSection = styled.div`
  animation: ${fadeSlideUp} 0.45s ease 0.15s both;
`

export const TopikSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.875rem;
`

export const TopikSectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 800;
  color: var(--color-gray-700);
  margin: 0;
`

export const TopikSearchWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #fff;
  border: 1.5px solid var(--color-gray-200);
  border-radius: 10px;
  padding: 0.45rem 0.875rem;
  max-width: 300px;
  flex: 1;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  transition: border-color 0.15s, box-shadow 0.15s;

  &:focus-within {
    border-color: var(--color-brand-blue);
    box-shadow: 0 0 0 3px rgba(30, 115, 170,0.15);
  }
`

export const TopikSearchIcon = styled.span`
  color: var(--color-gray-400);
  font-size: 0.9rem;
  flex-shrink: 0;
`

export const TopikSearchInput = styled.input`
  border: none;
  outline: none;
  font-size: 0.875rem;
  color: var(--color-gray-700);
  background: transparent;
  flex: 1;
  min-width: 0;
  &::placeholder { color: var(--color-gray-400); }
`

export const TopikList = styled.div`
  background: #fff;
  border-radius: 18px;
  overflow: visible;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
`

export const SkeletonBlock = styled.div`
  height: ${p => p.$h || '1rem'};
  width: ${p => p.$w || '100%'};
  border-radius: ${p => p.$radius || '6px'};
  flex-shrink: 0;
  background: linear-gradient(90deg, var(--color-gray-100) 0%, var(--color-gray-200) 40%, var(--color-gray-100) 80%);
  background-size: 600px 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
`

export const SkeletonCircle = styled.div`
  width: ${p => p.$size || '32px'};
  height: ${p => p.$size || '32px'};
  border-radius: 50%;
  flex-shrink: 0;
  background: linear-gradient(90deg, var(--color-gray-100) 0%, var(--color-gray-200) 40%, var(--color-gray-100) 80%);
  background-size: 600px 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
`

export const SkeletonTopikRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--color-gray-100);
  &:last-child { border-bottom: none; }
`

export const TopikRowWrap = styled.div`
  border-bottom: 1px solid var(--color-gray-100);
  &:last-child { border-bottom: none; }
  opacity: 0;
  animation: ${fadeSlideUp} 0.3s ease forwards;
  animation-delay: ${p => p.$delay || '0s'};
`

export const TopikRowHeader = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  row-gap: 0.625rem;
  gap: 1rem;
  padding: 1rem 1.25rem 0.875rem;
  cursor: pointer;
  user-select: none;
  transition: background 0.12s;

  &:hover { background: var(--color-gray-50); }
  ${p => p.$open && 'background: var(--color-gray-50);'}
`

export const TopikName = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-gray-900);
  flex: 1;
  min-width: 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    flex-basis: 100%;
    white-space: normal;
  }
`

export const TopikStats = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
    flex-wrap: wrap;
    row-gap: 0.5rem;
    justify-content: space-between;
  }
`

export const TopikStatsGroup = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.875rem;
  row-gap: 0.375rem;
`

export const TopikActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex-shrink: 0;
`

export const TopikStatChip = styled.span`
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: var(--color-gray-500);
  white-space: nowrap;
`

export const TopikStatNum = styled.strong`
  color: var(--color-gray-900);
  font-weight: 700;
  font-size: 0.9375rem;
`

export const TopikStartBtn = styled.button`
  padding: 0.35rem 1rem;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--color-brand-blue) 0%, var(--color-brand-blue-light) 100%);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.15s, transform 0.1s;
  box-shadow: 0 2px 8px rgba(30, 115, 170,0.35);

  &:hover { opacity: 0.9; transform: translateY(-1px); }
  &:active { transform: translateY(0); }
`

export const TopikChevron = styled.span`
  font-size: 1.1rem;
  color: var(--color-gray-400);
  transition: transform 0.22s ease, color 0.15s;
  transform: ${p => p.$open ? 'rotate(-90deg)' : 'rotate(90deg)'};
  line-height: 1;
  ${p => p.$open && 'color: var(--color-brand-blue);'}
`
