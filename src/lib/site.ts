// Informações institucionais do GPUIM em um lugar só.
// Centralizar aqui evita repetir telefone/e-mail/links pelas páginas: se algo
// mudar, basta editar este arquivo. O layout e as páginas importam daqui.

/** Itens do menu de navegação (rótulo + endereço). */
export const nav = [
	{ label: 'Histórias', href: '/' },
	{ label: 'O Programa', href: '/programa' },
	{ label: 'Contato', href: '/contato' }
];

export const contato = {
	endereco: 'R. Pastor Samuel Munguba, 1210 — Rodolfo Teófilo, Fortaleza - CE, CEP 60430-372',
	// Mapa incorporado via OpenStreetMap (incorporação oficial, sem chave de API).
	mapaEmbed:
		'https://www.openstreetmap.org/export/embed.html?bbox=-38.5605%2C-3.7546%2C-38.5445%2C-3.7426&layer=mapnik&marker=-3.748568%2C-38.552477',
	// Links para o Google Maps (visualizar e traçar rota).
	mapa: 'https://www.google.com/maps/search/?api=1&query=-3.748568,-38.552477',
	direcoes: 'https://www.google.com/maps/dir/?api=1&destination=-3.748568,-38.552477',
	telefones: ['(85) 3366-8293', '(85) 3366-8276'],
	emails: [
		{ centro: 'CIM', email: 'cimufc@ufc.br' },
		{ centro: 'CEFACE', email: 'ceface@ufc.br' },
		{ centro: 'CEATENF', email: 'ceatenfufc@gmail.com' },
		{ centro: 'CETOX', email: 'cetox@ufc.br' }
	],
	instagram: 'https://www.instagram.com/cim.ufc/',
	site: 'http://www.gpuim.ufc.br/'
};

export const projetos = [
	'CIM — Centro de Informação sobre Medicamentos',
	'CEFACE — Centro de Farmacovigilância do Ceará',
	'CETOX — Centro de Estudos em Toxicologia',
	'CEATENF — Centro de Estudos em Atenção Farmacêutica',
	'LISFARME — Saúde Coletiva, Farmácia Social e Saúde Mental Infantojuvenil'
];

export const objetivos = [
	'Produzir conhecimento sobre o uso racional de medicamentos.',
	'Levar informação clara sobre medicamentos para toda a população.',
	'Apoiar os profissionais de saúde em suas decisões sobre medicamentos.',
	'Ajudar a garantir o direito ao acesso e ao uso adequado dos remédios.'
];
