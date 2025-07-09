export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        'primary': 'var(--primary)',
        'secondary': 'var(--secondary)',
        'header': 'var(--header)',
        'border': 'var(--border)',
        'background': 'var(--background)',
        'muted-background': 'var(--muted-background)',
        'table-border': 'var(--table-border)',
      },
      fontFamily: {
        sans: ['Raleway', 'Inter', 'sans-serif']
      }
    }
  },
  plugins: []
}
