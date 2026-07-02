<!--
	Página de UMA história ("/historia/[id]").
	Recebe a história escolhida (vinda do +page.ts) e a entrega para o leitor.
-->
<script lang="ts">
	import ComicReader from '$lib/components/ComicReader.svelte';
	import type { PageData } from './$types';

	// `data.comic` é a história carregada pelo +page.ts.
	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.comic.title} — Entre Bulas &amp; Perguntas</title>
	<meta name="description" content={data.comic.description} />
</svelte:head>

<!-- A margem de baixo (pb-28) deixa espaço para a barra de controles do celular. -->
<div class="mx-auto max-w-5xl px-3 pb-28 pt-5 sm:px-5 sm:pb-12">
	<!-- `{#key ...}` recria o leitor quando trocamos de história, zerando o progresso. -->
	{#key data.comic.id}
		<ComicReader webcomic={data.comic} backHref="/" />
	{/key}
</div>
