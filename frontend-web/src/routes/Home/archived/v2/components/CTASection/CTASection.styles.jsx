import styled from 'styled-components';

export const CTAWrapper = styled.section`
  padding: 2.5rem 0 6rem;

  @media (max-width: 768px) {
    padding: 2rem 0 4rem;
  }
`;

export const CTAPanel = styled.div`
  position: relative;
  background: linear-gradient(120deg, #12876F 0%, #1B5E7A 100%);
  border-radius: 34px;
  padding: 4.375rem 3.75rem;
  color: #fff;
  display: grid;
  grid-template-columns: 1fr 325px;
  align-items: center;
  gap: 1.875rem;
  overflow: visible;
  box-shadow: 0 40px 70px -40px rgba(23, 100, 110, 0.7);

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 3.5rem 1.75rem 0;
  }

  @media (max-width: 768px) {
    border-radius: 26px;
  }
`;

export const CTABlob = styled.div`
  position: absolute;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  left: -60px;
  top: -60px;
  pointer-events: none;
`;

export const CTAContent = styled.div`
  position: relative;
`;

export const CTATitle = styled.h2`
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.15;
  margin: 0 0 1rem;
`;

export const CTASubtitle = styled.p`
  color: rgba(255, 255, 255, 0.85);
  font-size: 1.0625rem;
  margin: 0 0 1.875rem;
  max-width: 520px;

  @media (max-width: 960px) {
    margin-left: auto;
    margin-right: auto;
  }
`;

export const CTAMascot = styled.img`
  width: 350px;
  margin: -150px 0 -88px;
  pointer-events: none;
  user-select: none;

  @media (max-width: 960px) {
    width: 250px;
    margin: 10px auto -38px;
  }
`;
