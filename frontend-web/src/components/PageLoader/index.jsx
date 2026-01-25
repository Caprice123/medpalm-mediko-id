import React from 'react';
import { LoaderWrapper, LogoContainer, LogoImage, SpinnerRing, LoaderText } from './PageLoader.styles';

const PageLoader = ({ fullScreen = true, text = 'Loading...', size = 80 }) => {
  return (
    <LoaderWrapper fullScreen={fullScreen}>
      <LogoContainer>
        <LogoImage>
            <img src="/icon.jpg" alt="MedPalm Logo" style={{ height: '80px' }} />
        </LogoImage>
      </LogoContainer>
      {text && <LoaderText fullScreen={fullScreen}>{text}</LoaderText>}
    </LoaderWrapper>
  );
};

export default PageLoader;