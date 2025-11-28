import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
plugins: [react()],
// If you deploy to GitHub Pages on a repo (e.g. username.github.io/repo)
// uncomment and set base: '/my-portfolio/'
base: './'
})