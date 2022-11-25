import React, { useEffect } from 'react'
import { MantineProvider, ColorSchemeProvider } from '@mantine/core'
import { useHotkeys, useLocalStorage } from '@mantine/hooks'

const ThemeProvider = ({ children }) => {

  // Getting preferred color scheme
  const preferredColorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // On page load getting color scheme from local storage, if not available use system preferred color scheme and upon switching adding to local storage
  const [colorScheme, setColorScheme] = useLocalStorage({ key: 'color-scheme', defaultValue: preferredColorScheme ? 'dark' : 'light' });

  // Color scheme toggle handler
  const toggleColorScheme = () => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');

  // Accroding to the state, dark color scheme class adding or removing to allow tailwind dark classes or custom css for dark
  useEffect(() => {
    colorScheme ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark');
  }, [colorScheme]);

  // Ctrl/⌘ + J keyboard shortcut for color scheme toggle
  useHotkeys([['mod+J', () => toggleColorScheme()]]);

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        {children}
      </MantineProvider>
    </ColorSchemeProvider>
  )
};

export default ThemeProvider;