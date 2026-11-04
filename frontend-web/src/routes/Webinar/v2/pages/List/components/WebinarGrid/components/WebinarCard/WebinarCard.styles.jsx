import styled from 'styled-components'
import { brandField } from '../../../../utils/surfaces'

export const CardFrame = styled.article`
  background: var(--color-surface);
  border-radius: 14px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(11, 20, 25, 0.07);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px -12px rgba(11, 20, 25, 0.3);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: box-shadow 0.25s ease;
    &:hover { transform: none; }
  }
`

export const Cover = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  background-color: var(--color-brand-blue-deep);
  background-image: ${brandField};
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`

export const DateTab = styled.p`
  position: absolute;
  left: 0.75rem;
  top: 0.75rem;
  margin: 0;
  display: inline-flex;
  align-items: baseline;
  gap: 0.3125rem;
  padding: 0.3125rem 0.5625rem;
  border-radius: 8px;
  background: var(--color-surface);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-gray-700);
  box-shadow: 0 2px 6px -2px rgba(11, 20, 25, 0.4);

  b {
    font-family: 'Baloo 2', system-ui, sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: var(--color-brand-blue-deep);
    font-variant-numeric: tabular-nums lining-nums;
  }
`

export const CardBody = styled.div`
  padding: 0.875rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  flex: 1;
`

export const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.35;
  color: var(--color-gray-900);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const CardMeta = styled.p`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.4;
  color: ${({ $accent }) => ($accent ? 'var(--color-brand-blue)' : 'var(--color-gray-500)')};
  font-weight: ${({ $accent }) => ($accent ? 600 : 400)};

  svg { flex-shrink: 0; }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

export const CardFooter = styled.div`
  margin-top: auto;
  padding-top: 0.875rem;
  display: flex;
  gap: 0.5rem;

  & > * { flex: 1; }
`
