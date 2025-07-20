export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        'primary': 'oklch(from var(--color-primary) l c h / <alpha-value>)',
        'secondary': 'oklch(from var(--color-secondary) l c h / <alpha-value>)',
        'header': 'oklch(from var(--color-header) l c h / <alpha-value>)',
        'border': 'oklch(from var(--color-border) l c h / <alpha-value>)',
        'background': 'oklch(from var(--color-background) l c h / <alpha-value>)',
        'muted-background': 'oklch(from var(--color-muted-background) l c h / <alpha-value>)',
        'table-border': 'oklch(from var(--color-table-border) l c h / <alpha-value>)',
        'table-first-color': 'oklch(from var(--color-table-first-color) l c h / <alpha-value>)',
        'table-seccond-color': 'oklch(from var(--color-table-seccond-color) l c h / <alpha-value>)'
      },
      fontFamily: {
        sans: ['Raleway', 'Inter', 'sans-serif']
      }
    }
  },
  plugins: []
}
