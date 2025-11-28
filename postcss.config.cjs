module.exports = {
  plugins: [
    // use Tailwind's PostCSS adapter
    require('@tailwindcss/postcss')(),
    require('autoprefixer')()
  ]
}
