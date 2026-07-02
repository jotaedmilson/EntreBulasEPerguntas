// Tipos e helpers das webcomics. Os dados em si moram em `comics.data.js`
// (metadados de cada história + um alt curto por quadro). A lista de quadros e
// as dimensões vêm do manifesto gerado por `npm run panels`.

import { webcomics as rawWebcomics, panelImagePath } from './comics.data.js';
// Manifesto gerado por `npm run panels`: a lista de quadros de cada história,
// descoberta a partir dos arquivos em static/comics/<id>/, já com as dimensões.
import rawPanels from './comics.panels.json';

// Reexportamos a função de caminho da imagem para o resto do site usar.
export { panelImagePath };

// Os tipos abaixo (TypeScript) descrevem o "formato" dos nossos dados. Eles
// não viram código no navegador — servem para o editor nos avisar de erros.

export interface ComicPage {
	id: number;
	/**
	 * Caminho da imagem do quadro (ex.: '/comics/farmaceutico/1.png'). Vem do
	 * manifesto (o arquivo que realmente existe na pasta), seja png, webp, svg...
	 */
	src?: string;
	/** Largura/altura reais da arte (do manifesto). Definem o formato do quadro
	 * no layout — já no servidor, sem precisar medir a imagem no navegador. */
	width?: number;
	height?: number;
	/** Texto alternativo curto que descreve a cena da imagem (acessibilidade). */
	alt?: string;
}

/** Um quadro como sai do manifesto gerado por `npm run panels`. */
interface PanelMeta {
	id: number;
	src: string;
	width: number;
	height: number;
}
const panels = rawPanels as Record<string, PanelMeta[]>;

export interface Webcomic {
	id: string;
	title: string;
	tagline: string;
	description: string;
	/** Nome do ícone lucide usado na capa. */
	icon: 'stethoscope' | 'book-text' | 'pill';
	/** Gradiente Tailwind da capa. */
	cover: string;
	/** Imagem de capa opcional. */
	coverImage?: string;
	pages: ComicPage[];
}

// Cada história tem dois lados:
// - o MANIFESTO (automático): quantos quadros, o caminho e as dimensões de cada
//   um — descobertos a partir dos arquivos da pasta;
// - os DADOS AUTORAIS (escritos à mão em comics.data.js): um texto alternativo
//   curto por quadro (acessibilidade).
//
// Aqui juntamos os dois POR POSIÇÃO: o 1º quadro descoberto recebe o 1º texto
// autoral, e assim por diante. Por isso uma história nova "só funciona": basta
// soltar as imagens na pasta (e, se quiser, escrever um alt curto por quadro).
// Se ainda não houver imagens, caímos nos dados autorais.
type RawComic = Omit<Webcomic, 'pages'> & { pages?: Partial<ComicPage>[] };

export const webcomics: Webcomic[] = (rawWebcomics as unknown as RawComic[]).map((comic) => {
	const discovered = panels[comic.id] ?? [];
	const captions = comic.pages ?? [];
	const count = discovered.length || captions.length;

	const pages: ComicPage[] = Array.from({ length: count }, (_, i) => {
		const art = discovered[i];
		const cap = captions[i] ?? {};
		return {
			id: art?.id ?? cap.id ?? i + 1,
			src: art?.src ?? cap.src,
			width: art?.width,
			height: art?.height,
			alt: cap.alt ?? `${comic.title} — quadro ${i + 1}`
		};
	});

	return { ...comic, pages };
});
