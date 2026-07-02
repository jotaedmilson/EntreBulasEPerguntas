<!--
	Página de erro. O SvelteKit mostra esta tela quando algo dá errado —
	por exemplo, quando alguém acessa um endereço que não existe (erro 404).
-->
<script lang="ts">
	// `page` traz informações da navegação atual, como o código do erro.
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
</script>

<svelte:head><title>Ops! — Entre Bulas &amp; Perguntas</title></svelte:head>

<section class="mx-auto flex max-w-xl flex-col items-center px-5 py-24 text-center">
	<p class="text-6xl font-black text-brand-amber">{page.status}</p>
	<h1 class="mt-2 text-2xl font-bold text-brand-indigo">
		{page.status === 404 ? 'Página não encontrada' : 'Algo deu errado'}
	</h1>
	<p class="mt-2 text-slate-600">
		{page.error?.message ?? 'Não conseguimos encontrar o que você procurava.'}
	</p>
	<Button href="/" class="mt-6 bg-brand-amber text-brand-indigo-dark hover:bg-brand-amber/90">
		Voltar ao início
	</Button>
</section>
