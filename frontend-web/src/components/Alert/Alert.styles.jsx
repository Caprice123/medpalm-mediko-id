import styled from "styled-components";

export const Wrapper = styled.div`
    .alert{
        width: 400px;
    }

    .Toastify__toast-body{
        align-items: start;
    }
`

export const Content = styled.div`
    
`

export const HeadContent = styled.div`
    
`

export const Title = styled.h2`
    font-style: normal;
    font-weight: 800;
    font-size: 1rem;
    /* GlobalStyles paints every h1-h6 with the dark body text colour, which beat the
       white text react-toastify sets on its coloured (red) error toast — inherit the
       toast's own colour instead so the title stays readable. */
    color: inherit;
`

export const BodyContent = styled.div`
    
`

export const Message = styled.p`
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
`