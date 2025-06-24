import fs from 'fs'

function extractCSSVariables() {
  const cssContent = fs.readFileSync('./src/ui/globals.css', 'utf8')
  const variables = {}
  
  // Ищем переменные вида: --primary: var(--color-primary);
  const matches = cssContent.match(/--([a-zA-Z-]+):\s*var\(--color-[a-zA-Z-]+\);/g)
  if (matches) {
    matches.forEach(match => {
      const name = match.match(/--([a-zA-Z-]+):/)[1]
      variables[name] = `var(--${name})`
    })
  }
  
  return variables
}



export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  theme: {
    extend: {
      colors: extractCSSVariables(),
      fontFamily: {
        sans: ['Raleway', 'Inter', 'sans-serif', ]
      }
    }
  },
  plugins: []
}