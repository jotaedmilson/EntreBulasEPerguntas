// @ts-nocheck — plugin de build de Node; tipos do Vite não são checados aqui.
// Plugin do Vite que mantém o manifesto de quadrinhos sempre em dia, sozinho.
// ===========================================================================
// - No `build` (e em qualquer deploy que rode `vite build`): regenera o
//   manifesto antes de tudo, então a produção nunca sai com dados velhos.
// - No `dev`: observa `static/comics/` e, quando você solta, remove ou troca
//   uma imagem, regenera na hora e recarrega a página.
//
// O trabalho humano fica só em nomear os quadros em ordem numérica (1, 2, 3...);
// o resto é automação. A lógica de varredura mora em scan-panels.mjs.

import { COMICS_DIR, OUT_FILE, isPanelFile, writeManifest } from './scan-panels.mjs';

export function comicsPanels() {
	const regenerate = (reason) => {
		const { manifest, warnings, changed } = writeManifest();
		if (changed) {
			const historias = Object.keys(manifest).length;
			const total = Object.values(manifest).reduce((n, p) => n + p.length, 0);
			console.log(`[comics-panels] ${reason}: ${total} quadro(s) em ${historias} história(s)`);
		}
		for (const w of warnings) console.warn(`[comics-panels] ⚠ ${w}`);
		return changed;
	};

	return {
		name: 'comics-panels',

		// Roda no dev e no build, antes de qualquer módulo ser processado.
		buildStart() {
			regenerate('manifesto gerado');
		},

		// No servidor de desenvolvimento, observa a pasta das imagens.
		configureServer(server) {
			server.watcher.add(COMICS_DIR);

			const onChange = (file) => {
				if (!isPanelFile(file)) return;
				// Ao regravar o manifesto (em src/lib), o próprio Vite recarrega os
				// módulos que o importam; o full-reload abaixo é só um reforço.
				if (regenerate('imagens mudaram')) {
					server.ws.send({ type: 'full-reload' });
				}
			};

			server.watcher.on('add', onChange);
			server.watcher.on('unlink', onChange);
			server.watcher.on('change', onChange);
		}
	};
}

export { OUT_FILE };
