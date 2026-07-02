// Dados das webcomics — metadados de cada história + um texto alternativo curto
// (`alt`) por quadro, para acessibilidade. Deixei em JS puro pra conseguir
// importar tanto no SvelteKit quanto em scripts Node simples. :)
//
// A LISTA de quadros e as DIMENSÕES não moram aqui: são descobertas a partir
// dos arquivos em static/comics/<id>/ pelo manifesto (npm run panels). Por isso
// adicionar/atualizar uma história é só soltar as imagens na pasta — o `alt`
// abaixo casa com os quadros por posição (1º alt → 1º arquivo).

/**
 * Convenção do caminho da arte de um quadro — usada como fallback quando, por
 * algum motivo, o manifesto não trouxe o caminho do arquivo.
 *
 * @param {string} comicId
 * @param {number | string} pageId
 * @returns {string}
 */
export function panelImagePath(comicId, pageId) {
	return `/comics/${comicId}/${pageId}.png`;
}

export const webcomics = [
	{
		id: 'farmaceutico',
		title: 'O que é um farmacêutico?',
		tagline: 'Médico ou farmacêutico?',
		description:
			'Teo vai à farmácia buscar os remédios da avó e descobre a diferença entre o trabalho do médico e do farmacêutico.',
		icon: 'stethoscope',
		cover: 'from-rose-400 via-fuchsia-500 to-indigo-500',
		coverImage: '/comics/farmaceutico/capa.png',
		pages: [
			{
				alt: 'Teo corre animado pela farmácia chamando pela doutora Milena, enquanto Dona Rosangela pede calma.'
			},
			{
				alt: 'No balcão, Dona Rosangela entrega a receita e Milena, a farmacêutica, se oferece para ajudar.'
			},
			{ alt: 'Teo aparece pensativo, confuso por a doutora não ser doutora.' },
			{ alt: 'Milena explica a Teo a diferença entre o médico e o farmacêutico.' },
			{ alt: 'Milena explica a Teo a diferença entre o médico e o farmacêutico.' },
			{ alt: 'Milena explica a Teo a diferença entre o médico e o farmacêutico.' },
			{ alt: 'Milena explica a Teo a diferença entre o médico e o farmacêutico.' }
		]
	},
	{
		id: 'armazenamento',
		title: 'Armazenamento de Medicamentos',
		tagline: 'Como guardar os remédios',
		description: 'Milena ensina a Teo as maneiras corretas de se guardar remédios.',
		icon: 'pill',
		cover: 'from-amber-300 via-orange-400 to-rose-500',
		coverImage: '/comics/armazenamento/capa.png',
		pages: [
			{ alt: 'Teo pergunta a Milena onde é melhor guardar os remédios da avó.' },
			{ alt: 'Milena explica que remédios devem ficar em lugar fresco, seco e longe do sol.' },
			{ alt: 'Milena mostra que o remédio deve ficar na embalagem original com a bula.' },
			{ alt: 'Milena lembra de manter os remédios longe do alcance das crianças.' }
		]
	},
	{
		id: 'descarte',
		title: 'Descarte de Remédios',
		tagline: 'O que fazer com os vencidos',
		description:
			'Dona Rosa e Teo vão tirar dúvidas com Milena sobre o que fazer com remédios vencidos.',
		icon: 'book-text',
		cover: 'from-emerald-400 via-teal-500 to-cyan-600',
		coverImage: '/comics/descarte/capa.png',
		pages: [
			{ alt: 'Dona Rosa mostra a Milena alguns remédios vencidos e pergunta se pode jogar no lixo.' },
			{ alt: 'Milena explica que remédios não devem ir para o lixo comum nem para a pia.' },
			{ alt: 'Milena indica os pontos de coleta para descartar remédios.' },
			{ alt: 'Dona Rosa agradece a Milena pela orientação sobre o descarte.' }
		]
	}
];
