import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { comicsPanels } from './scripts/vite-plugin-comics-panels.mjs';

export default defineConfig({
	plugins: [
		// Descobre os quadros das histórias em static/comics/ e mantém o manifesto
		// atualizado sozinho (no dev observa a pasta; no build regenera). Assim o
		// deploy nunca sai com dados velhos e o trabalho humano é só nomear os
		// arquivos em ordem numérica.
		comicsPanels(),
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Força o modo runes no projeto (exceto bibliotecas). Pode sair no Svelte 6.
				runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
			},

			// Site totalmente estático (prerender): pode ser hospedado em qualquer
			// lugar (Netlify, Vercel, GitHub Pages, etc.). O 404.html cobre rotas
			// desconhecidas em hospedagens estáticas.
			adapter: adapter({ fallback: '404.html' })
		})
	],
	base:"/EntreBulasEPerguntas/",
	 build: {
    outDir: './docs', // relative to index.html
    // emptyOutDir: true, // true if outDir is inside root. if outDir is not inside root, uncomment this.
  }
});
