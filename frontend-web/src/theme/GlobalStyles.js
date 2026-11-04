import { createGlobalStyle } from 'styled-components'
import { colors } from '@config/colors'
import { cssVariables } from './palette'
import { fonts } from '@routes/Home/theme'

export const GlobalStyles = createGlobalStyle`
  /* The product's colour theme, from theme/palette.js. Stylesheets read these
     as var(--color-…) instead of carrying their own hex values. */
  :root {
    ${cssVariables}
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    /* Same type system as the landing page: Plus Jakarta Sans for body copy,
       Baloo 2 for headings. Both are already loaded in index.html. */
    font-family: ${fonts.body};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${colors.background.default};
    color: ${colors.text.primary};
    line-height: 1.5;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${fonts.heading};
    color: ${colors.text.primary};
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  button {
    cursor: pointer;
    font-family: inherit;
  }

  a {
    color: ${colors.primary.main};
    text-decoration: none;
  }
`
