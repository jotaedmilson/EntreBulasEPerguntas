// "load" da rota /historia/[id].
// Antes da página aparecer, o SvelteKit roda esta função. Ela pega o "id" que
// está no endereço (ex.: /historia/descarte → id = "descarte"), procura a
// história correspondente e a entrega para a página. Se o id não existir,
// mostramos a página de erro 404.
import { error } from '@sveltejs/kit';
import { webcomics } from '$lib/comics';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const comic = webcomics.find((c) => c.id === params.id);
	if (!comic) error(404, 'História não encontrada.');
	return { comic }; // vira `data.comic` lá no +page.svelte
};
