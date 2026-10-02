import styled from 'styled-components';

export const PricingWrapper = styled.section`
  padding: 6rem 0;

  @media (max-width: 768px) {
    padding: 4rem 0;
  }
`;

export const PricingHead = styled.div`
  position: relative;
`;

export const HeadMascot = styled.img`
  position: absolute;
  left: calc(50% - 575px);
  top: 10px;
  width: 175px;
  pointer-events: none;
  user-select: none;

  @media (max-width: 1240px) {
    position: static;
    display: block;
    width: 138px;
    margin: 0 auto 10px;
  }
`;

export const EmptyMascot = styled.img`
  width: 225px;
  margin: 0 auto 0.75rem;
`;
