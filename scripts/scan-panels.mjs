// @ts-nocheck — script de build de Node (leitura de bytes/IO); não vale a pena
// type-checar manipulação de buffers aqui.
// Descoberta de quadros por pasta.
// =================================
// Varre `static/comics/<historia>/` atrás dos quadros (arquivos numéricos como
// 1.png, 2.webp, 3.svg... ignorando a capa) e gera o manifesto
// `src/lib/comics.panels.json` com o caminho e as DIMENSÕES de cada um.
//
// Por que isso existe: assim, adicionar uma história nova é só soltar as
// imagens na pasta — o site descobre a quantidade de quadros e o formato de
// cada arte sozinho, sem ninguém escrever isso à mão. E, como as dimensões já
// vêm do build, o layout nasce certo no primeiro carregamento (sem "pulo").
//
// É agnóstico de formato: lê PNG, JPEG, GIF, WEBP (inclusive o animado/VP8X) e
// SVG. Misture à vontade — vetor fica em SVG, arte pintada pode ser WEBP.
//
// A automação roda sozinha pelo plugin do Vite (no `dev` e no `build`). Este
// arquivo também funciona como CLI manual/CI: `npm run panels`.

import { readFileSync, readdirSync, writeFileSync, statSync } from 'node:fs';
import { dirname, join, extname, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

export const COMICS_DIR = join(ROOT, 'static', 'comics');
export const OUT_FILE = join(ROOT, 'src', 'lib', 'comics.panels.json');

// Só arquivos com nome numérico contam como quadro (1.png, 2.webp...). A capa e
// quaisquer outros arquivos auxiliares ficam de fora.
export const PANEL_RE = /^(\d+)\.(png|jpe?g|gif|webp|svg)$/i;

/** Diz se um caminho é um arquivo de quadro dentro de static/comics/. Usado
 *  pelo plugin do Vite para filtrar os eventos de watch. */
export function isPanelFile(file) {
	return file.startsWith(COMICS_DIR) && PANEL_RE.test(basename(file));
}

// ---- Leitores de dimensão (sem dependências) ----

function pngSize(buf) {
	// Assinatura PNG + bloco IHDR: largura/altura são uint32 big-endian.
	if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) return null;
	return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function gifSize(buf) {
	if (buf.length < 10 || buf.toString('ascii', 0, 3) !== 'GIF') return null;
	return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
}

function jpegSize(buf) {
	if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
	let off = 2;
	while (off + 9 < buf.length) {
		if (buf[off] !== 0xff) {
			off++;
			continue;
		}
		let marker = buf[off + 1];
		while (marker === 0xff) marker = buf[++off + 1];
		// Marcadores sem corpo (SOI, EOI, RSTn, TEM): andam 2 bytes.
		if (marker === 0xd8 || marker === 0xd9 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
			off += 2;
			continue;
		}
		// SOF0..SOF15 (menos DHT/JPG/DAC) trazem altura e largura.
		if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
			return { width: buf.readUInt16BE(off + 7), height: buf.readUInt16BE(off + 5) };
		}
		off += 2 + buf.readUInt16BE(off + 2); // pula este segmento
	}
	return null;
}

function webpSize(buf) {
	if (buf.length < 30 || buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WEBP')
		return null;
	const fmt = buf.toString('ascii', 12, 16);
	if (fmt === 'VP8 ') {
		// Lossy: 14 bits de largura/altura no cabeçalho do frame.
		return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
	}
	if (fmt === 'VP8L') {
		// Lossless: largura-1 e altura-1 em 14 bits cada.
		const b0 = buf[21], b1 = buf[22], b2 = buf[23], b3 = buf[24];
		return {
			width: 1 + (((b1 & 0x3f) << 8) | b0),
			height: 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6))
		};
	}
	if (fmt === 'VP8X') {
		// Estendido/animado: tamanho do "canvas" em 24 bits little-endian.
		return {
			width: 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16)),
			height: 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16))
		};
	}
	return null;
}

function svgSize(text) {
	const head = text.slice(0, 2000);
	const w = head.match(/\bwidth\s*=\s*["']\s*([\d.]+)\s*(?:px)?\s*["']/i);
	const h = head.match(/\bheight\s*=\s*["']\s*([\d.]+)\s*(?:px)?\s*["']/i);
	if (w && h) return { width: Math.round(+w[1]), height: Math.round(+h[1]) };
	// Sem width/height absolutos: usa as duas últimas medidas do viewBox.
	const vb = head.match(/viewBox\s*=\s*["']\s*[\d.+-]+[\s,]+[\d.+-]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
	if (vb) return { width: Math.round(+vb[1]), height: Math.round(+vb[2]) };
	return null;
}

function dimensions(file, ext) {
	if (ext === '.svg') return svgSize(readFileSync(file, 'utf8'));
	const buf = readFileSync(file);
	switch (ext) {
		case '.png':
			return pngSize(buf);
		case '.gif':
			return gifSize(buf);
		case '.jpg':
		case '.jpeg':
			return jpegSize(buf);
		case '.webp':
			return webpSize(buf);
		default:
			// Tenta adivinhar pela assinatura, por garantia.
			return pngSize(buf) ?? jpegSize(buf) ?? webpSize(buf) ?? gifSize(buf);
	}
}

// ---- Varredura ----

function listComicDirs(comicsDir) {
	try {
		return readdirSync(comicsDir).filter((name) => {
			try {
				return statSync(join(comicsDir, name)).isDirectory();
			} catch {
				return false;
			}
		});
	} catch {
		return [];
	}
}

/** Lê as pastas e devolve o manifesto + avisos (sem escrever nada em disco). */
export function scanPanels(comicsDir = COMICS_DIR) {
	const manifest = {};
	const warnings = [];

	for (const comicId of listComicDirs(comicsDir).sort()) {
		const dir = join(comicsDir, comicId);
		const panels = readdirSync(dir)
			.map((file) => ({ file, m: file.match(PANEL_RE) }))
			.filter((x) => x.m)
			.sort((a, b) => Number(a.m[1]) - Number(b.m[1]))
			.map(({ file, m }) => {
				const dim = dimensions(join(dir, file), extname(file).toLowerCase());
				if (!dim || !dim.width || !dim.height) {
					warnings.push(`${comicId}/${file}: não consegui ler as dimensões`);
					return null;
				}
				return { id: Number(m[1]), src: `/comics/${comicId}/${file}`, width: dim.width, height: dim.height };
			})
			.filter(Boolean);

		if (panels.length) manifest[comicId] = panels;
	}

	return { manifest, warnings };
}

/**
 * Gera o manifesto e grava em disco SÓ se algo mudou (evita reescritas e loops
 * de watch). Devolve { manifest, warnings, changed }.
 */
export function writeManifest({ comicsDir = COMICS_DIR, outFile = OUT_FILE } = {}) {
	const { manifest, warnings } = scanPanels(comicsDir);
	const json = JSON.stringify(manifest, null, '\t') + '\n';

	let changed = true;
	try {
		changed = readFileSync(outFile, 'utf8') !== json;
	} catch {
		/* arquivo ainda não existe → grava */
	}
	if (changed) writeFileSync(outFile, json);

	return { manifest, warnings, changed };
}

// ---- CLI (`npm run panels`) ----

const isCli = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isCli) {
	const { manifest, warnings } = writeManifest();
	const total = Object.values(manifest).reduce((n, p) => n + p.length, 0);
	console.log(`Quadros descobertos (${total} no total):`);
	for (const [comicId, panels] of Object.entries(manifest)) {
		const formatos = [...new Set(panels.map((p) => extname(p.src).slice(1)))].join(', ');
		console.log(`  • ${comicId}: ${panels.length} quadro(s) [${formatos}]`);
	}
	for (const w of warnings) console.warn(`  ⚠ ${w}`);
	console.log(`Manifesto salvo em ${OUT_FILE.replace(ROOT + '/', '')}`);
}
