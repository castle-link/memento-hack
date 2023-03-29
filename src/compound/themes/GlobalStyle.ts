import { mediaSelector } from '@/compound/utils/breakpoints'
import { createGlobalStyle, DefaultTheme } from 'styled-components'
import { getPaletteColor } from './utils'

export const GlobalStyles = createGlobalStyle<{ theme: DefaultTheme }>`
body {
    background-color: ${getPaletteColor('background')};
    color: ${getPaletteColor('text-main')};
    overflow-x: hidden;

    // these existing so to make the query listeners in useBreakpoint work
    @media ${mediaSelector.mobile} {
      display: block;
    }
    @media ${mediaSelector.tablet} {
      display: block;
    }
    @media ${mediaSelector.laptop} {
      display: block;
    }
    @media ${mediaSelector.desktop} {
      display: block;
    }
  }

  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
  }

  .Toastify__toast {
    background-color: ${getPaletteColor('background')} !important;
    border: 1px solid ${getPaletteColor('border-color')} !important;
    border-radius: 0px !important;
    color: ${getPaletteColor('text-main')} !important;
    font-size: 14px;
    line-height: 150%;
  
    @media only screen and (max-width: 780px) {
      margin: 16px;
      margin: 16px;
    }
  }
`
