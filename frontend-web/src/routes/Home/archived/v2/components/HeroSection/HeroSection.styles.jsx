import styled from 'styled-components';

export const HeroWrapper = styled.section`
  padding: 4rem 0 5.5rem;
  position: relative;
  overflow: hidden;
`;

export const HeroGrid = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 clamp(20px, 5vw, 56px);
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: clamp(2rem, 5vw, 4.5rem);
  align-items: center;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;
