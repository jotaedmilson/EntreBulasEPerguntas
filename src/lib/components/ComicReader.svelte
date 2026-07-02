<!--
	ComicReader.svelte
	==================
	Este é o "leitor" de uma história. Ele recebe uma webcomic (com vários
	quadros) e mostra esses quadros como uma PÁGINA DE QUADRINHOS: os quadros
	vão preenchendo os lugares da folha, um de cada vez, conforme a pessoa
	toca em "Continuar". A ideia é lembrar uma revistinha — e não uma rolagem
	infinita (webtoon).

	Resumindo a lógica:
	- `revealed` guarda quantos quadros já apareceram.
	- Os quadros que ainda não apareceram ficam como "lugares vazios" na folha.
	- Dá para avançar, voltar um quadro e reler do começo.
-->
<script lang="ts">
	// Tipos e funções auxiliares das histórias.
	import type { Webcomic } from '$lib/comics';
	import { panelImagePath } from '$lib/comics';
	// `cubicOut` deixa a animação mais suave no final; `tick` espera o HTML
	// terminar de atualizar antes de rolarmos a tela.
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import { tick } from 'svelte';
	// Ícones (biblioteca Lucide).
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import ChevronUp from '@lucide/svelte/icons/chevron-up';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import Check from '@lucide/svelte/icons/check';

	// "props" = informações que a página manda para este componente.
	// `webcomic` é a história escolhida; `backHref` é para onde o botão
	// "Voltar ao menu" leva (por padrão, a página inicial).
	let { webcomic, backHref = '/' }: { webcomic: Webcomic; backHref?: string } = $props();

	// `$derived` cria um valor que se atualiza sozinho quando `webcomic` muda.
	const pages = $derived(webcomic.pages); // lista de quadros
	const total = $derived(pages.length); // quantos quadros tem a história

	// Passo a passo mostrado só no primeiro quadro, para ensinar a ler.
	const comoLer = [
		'Leia os balões de fala.',
		'Toque em Continuar para revelar o próximo quadro.',
		'A história aparece aos poucos.'
	];

	// `$state` é uma variável "reativa": quando ela muda, a tela se atualiza.
	let revealed = $state(1); // quantos quadros já apareceram (começa com 1)
	const isComplete = $derived(revealed >= total); // já mostrou tudo?

	// Guardamos os elementos dos quadros para conseguir rolar até o mais novo.
	let panelEls = $state<HTMLElement[]>([]);

	// Caminho da imagem do quadro: usa o que o manifesto descobriu na pasta (png,
	// webp, svg...) ou, se faltar, o caminho padrão por convenção.
	const imageSrc = (page: Webcomic['pages'][number]) =>
		page.src ?? panelImagePath(webcomic.id, page.id);

	// Proporção (largura ÷ altura) do quadro. As dimensões já vêm do manifesto
	// (lidas no build), então o formato de cada arte é conhecido desde o servidor
	// — o layout nasce certo, sem "pulo" e sem medir nada no navegador. Quadrado
	// (1) é o palpite seguro quando, por algum motivo, não há dimensão.
	const ratioOf = (page: Webcomic['pages'][number]) =>
		page.width && page.height ? page.width / page.height : 1;

	// Um quadro é "panorâmico" quando é bem mais largo do que alto. Esses ficam
	// sozinhos numa linha (ocupando a folha inteira); os demais são agrupados de
	// dois em dois.
	const isWide = (page: Webcomic['pages'][number]) => ratioOf(page) >= 2.2;

	// Montamos a folha por LINHAS. Cada linha tem um ou dois quadros: panorâmicos
	// ficam sozinhos, o resto vai de par em par. Dentro de uma linha, os quadros
	// dividem o espaço com larguras proporcionais à arte e terminam com a MESMA
	// altura (layout "justificado", como uma galeria de fotos) — é assim que o 1
	// fica da altura do 2 e o 3 divide o espaço com o 4. Guardamos também o
	// índice global de cada quadro para a revelação e a rolagem continuarem
	// funcionando na ordem certa.
	const rows = $derived.by(() => {
		const out: { page: Webcomic['pages'][number]; index: number }[][] = [];
		let i = 0;
		while (i < pages.length) {
			const page = pages[i];
			const next = pages[i + 1];
			if (!isWide(page) && next && !isWide(next)) {
				out.push([
					{ page, index: i },
					{ page: next, index: i + 1 }
				]);
				i += 2;
			} else {
				out.push([{ page, index: i }]);
				i += 1;
			}
		}
		return out;
	});

	// Descobre se a pessoa prefere menos animação (acessibilidade).
	function prefersReducedMotion() {
		return (
			typeof window !== 'undefined' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		);
	}

	// Revelação do quadro: ele apenas "assenta" na folha — surge com um leve
	// fade, uma pequena subida e um discreto crescer. Movimento curto, suave e
	// com propósito (Apple HIG). Quem prefere menos movimento recebe a troca
	// instantânea (WCAG 2.3.3), sem depender só do reset global de CSS.
	function stamp(_node: Element, { duration = 360 }: { duration?: number } = {}) {
		if (prefersReducedMotion()) return { duration: 0 };
		return {
			duration,
			easing: cubicOut,
			css: (t: number) => `opacity:${t}; transform: translateY(${(1 - t) * 10}px) scale(${0.985 + 0.015 * t});`
		};
	}

	// Rola a tela suavemente até o quadro de índice `i`.
	async function scrollToPanel(i: number) {
		await tick(); // espera o quadro novo existir no HTML
		panelEls[i]?.scrollIntoView({
			behavior: prefersReducedMotion() ? 'auto' : 'smooth',
			block: 'center'
		});
	}

	// Mostra o próximo quadro.
	function revealNext() {
		if (revealed >= total) return;
		revealed += 1;
		scrollToPanel(revealed - 1);
	}

	// Esconde o último quadro (volta um).
	function hideLast() {
		if (revealed <= 1) return;
		revealed -= 1;
		scrollToPanel(revealed - 1);
	}

	// Volta ao começo da história.
	function restart() {
		revealed = 1;
		scrollToPanel(0);
	}

	// Atalhos de teclado: setas/espaço avançam ou voltam um quadro.
	function onKeydown(event: KeyboardEvent) {
		// Se a pessoa estiver digitando num campo (ex.: a busca), não fazemos nada.
		const el = event.target as HTMLElement | null;
		if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) {
			return;
		}
		if (['ArrowRight', 'ArrowDown', ' '].includes(event.key)) {
			event.preventDefault();
			revealNext();
		} else if (['ArrowLeft', 'ArrowUp'].includes(event.key)) {
			event.preventDefault();
			hideLast();
		}
	}
</script>

<!-- Ouve o teclado na janela inteira. -->
<svelte:window onkeydown={onKeydown} />

<section aria-label={`História: ${webcomic.title}`} class="rounded-3xl bg-brand-lavender p-3 shadow-xl sm:p-6">
	<!-- Cabeçalho do leitor: voltar + nome da história -->
	<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
		<a
			href={backHref}
			class="inline-flex items-center gap-2 rounded-full bg-brand-red/10 px-4 py-2 text-sm font-semibold text-brand-red transition hover:bg-brand-red/20"
		>
			<ArrowLeft class="size-4" /> Voltar ao menu
		</a>
		<div class="min-w-0 text-right leading-tight">
			<p class="text-[0.7rem] font-bold uppercase tracking-widest text-brand-red/80 sm:text-xs">
				{webcomic.tagline}
			</p>
			<h1 class="truncate text-base font-black text-brand-red sm:text-xl">{webcomic.title}</h1>
		</div>
	</div>

	<!--
		Progresso da leitura. Além da barra que enche, mostramos "Quadro X de Y":
		um número concreto deixa claro onde a pessoa está e quanto falta.
	-->
	<div class="mb-4">
		<div class="mb-1.5 flex items-center justify-between text-xs font-bold tracking-wide text-brand-red/70">
			{#if isComplete}
				<span class="inline-flex items-center gap-1 text-emerald-600">
					<Check class="size-3.5" /> História completa!
				</span>
			{:else}
				<span>Quadro {revealed} de {total}</span>
			{/if}
		</div>
		<div
			class="h-3 overflow-hidden rounded-full bg-brand-red/15"
			role="progressbar"
			aria-label="Quanto da história já foi lido"
			aria-valuemin="0"
			aria-valuemax={total}
			aria-valuenow={revealed}
		>
			<div
				class="h-full rounded-full bg-brand-red transition-[width] duration-500 ease-out"
				style="width: {(revealed / total) * 100}%"
			></div>
		</div>
	</div>

	{#if revealed === 1}
		<!-- Mini guia "como ler", aparece só no primeiro quadro. -->
		<div class="mb-5 rounded-2xl border border-brand-red/15 bg-white/70 p-4 sm:p-5">
			<p class="text-center text-sm font-bold uppercase tracking-widest text-brand-red/70">
				Como ler é bem fácil
			</p>
			<ol class="mt-3 grid gap-3 sm:grid-cols-3">
				{#each comoLer as passo, i (passo)}
					<li class="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm sm:flex-col sm:text-center">
						<span
							class="grid size-9 shrink-0 place-items-center rounded-full bg-brand-amber text-base font-black text-brand-indigo-dark"
						>
							{i + 1}
						</span>
						<p class="text-sm text-slate-700 sm:text-base">{passo}</p>
					</li>
				{/each}
			</ol>
		</div>
	{/if}

	<!--
		A FOLHA DE QUADRINHOS.
		Em vez de uma rolagem infinita, montamos uma grade (como os quadros de
		uma revistinha). Percorremos TODOS os quadros: os que já foram revelados
		viram imagem; os que ainda não, viram um "lugar vazio". Assim a pessoa vê
		a página se montando aos poucos.

		`pb-28` no celular reserva espaço para a barra fixa de controles não tapar
		o último quadro; no computador (md) os controles ficam no fluxo, sem barra.
	-->
	<div class="mx-auto max-w-3xl pb-28 md:pb-0">
		<!--
			A folha em si. O fundo cinza-lavanda (#a4a6c4) aparece entre os quadros,
			como a "página" de uma revistinha. As imagens já têm a borda desenhada,
			então aqui não colocamos nenhuma moldura.
		-->
		<div class="rounded-xl bg-[#a4a6c4] p-2 shadow-lg sm:p-3">
			<div class="flex flex-col gap-2 sm:gap-3">
				{#each rows as row (row[0].page.id)}
					<!--
						Uma LINHA da folha. No celular os quadros empilham; no computador
						ficam lado a lado e, graças ao `--r` (a proporção da arte) usado como
						`flex-grow`, dividem a largura e terminam com a MESMA altura.
					-->
					<div class="comic-row flex flex-col gap-2 sm:flex-row sm:gap-3">
						{#each row as { page, index } (page.id)}
							<div class="comic-cell" style="--r: {ratioOf(page)}">
								{#if index < revealed}
									<!-- Quadro já revelado -->
									<figure
										bind:this={panelEls[index]}
										in:stamp
										class="relative m-0 overflow-hidden rounded-md"
									>
										<img
											src={imageSrc(page)}
											alt={page.alt}
											width={page.width}
											height={page.height}
											loading="lazy"
											class="block h-auto w-full"
										/>
									</figure>
								{:else if index === revealed}
									<!--
										O PRÓXIMO quadro. Em vez de um número parado, ele vira o botão
										"Continuar": fica bem na frente dos olhos (não some ao rolar a
										tela) e convida a tocar para revelar a próxima parte. Usa a
										proporção da arte para já ter o formato do que vai aparecer.
									-->
									<button
										type="button"
										onclick={revealNext}
										aria-label="Mostrar o próximo quadro"
										style="aspect-ratio: {ratioOf(page)}"
										class="cta-appear group grid w-full place-items-center rounded-md border-2 border-dashed border-brand-red/40 bg-brand-red/5 text-brand-red transition hover:border-brand-red/60 hover:bg-brand-red/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
									>
										<span class="flex flex-col items-center gap-1.5">
											<span
												class="grid size-11 place-items-center rounded-full bg-brand-red text-white shadow-md transition group-hover:scale-105"
											>
												<ChevronDown class="size-6" />
											</span>
											<span class="text-sm font-bold">Continuar</span>
										</span>
									</button>
								{:else}
									<!--
										Lugares ainda distantes: só um número discreto, para a pessoa
										perceber que a folha vai se preencher aos poucos.
									-->
									<div
										aria-hidden="true"
										style="aspect-ratio: {ratioOf(page)}"
										class="grid place-items-center rounded-md bg-black/5 text-3xl font-black text-black/15"
									>
										{index + 1}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{/each}
			</div>
		</div>

		<!-- Controles no COMPUTADOR: ficam abaixo da folha. -->
		<div class="mt-6 hidden flex-col items-center gap-3 md:flex">
			{#if !isComplete}
				<button
					onclick={revealNext}
					class="inline-flex items-center gap-2 rounded-full bg-brand-red px-7 py-3.5 text-lg font-bold text-white shadow-lg transition hover:scale-105 hover:bg-brand-red/90"
				>
					Continuar
					<ChevronDown class="size-5" />
				</button>
			{:else}
				<div class="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-bold text-white">
					<Check class="size-5" /> Você chegou ao fim!
				</div>
				<button
					onclick={restart}
					class="inline-flex items-center gap-2 rounded-full bg-brand-red px-6 py-2.5 text-sm font-bold text-white shadow transition hover:scale-105 hover:bg-brand-red/90"
				>
					<RotateCcw class="size-5" /> Ler de novo
				</button>
			{/if}

			{#if revealed > 1}
				<button
					onclick={hideLast}
					class="inline-flex items-center gap-1 text-sm font-semibold text-brand-red/70 transition hover:text-brand-red"
				>
					<ChevronUp class="size-4" /> Voltar
				</button>
			{/if}
		</div>

		<!-- Controles no CELULAR: barra fixa no rodapé, fácil de alcançar com o polegar. -->
		<div
			in:fly={{ y: 28, duration: prefersReducedMotion() ? 0 : 280, easing: cubicOut }}
			class="fixed inset-x-0 bottom-0 z-30 border-t border-black/10 bg-brand-lavender/95 px-3 pt-3 shadow-[0_-4px_12px_rgba(0,0,0,0.12)] backdrop-blur md:hidden"
			style="padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));"
		>
			<div class="mx-auto flex max-w-md items-center gap-2">
				{#if revealed > 1}
					<button
						onclick={hideLast}
						aria-label="Voltar um quadro"
						class="grid size-12 shrink-0 place-items-center rounded-full bg-brand-red/10 text-brand-red transition active:scale-90"
					>
						<ChevronUp class="size-6" />
					</button>
				{/if}
				{#if !isComplete}
					<button
						onclick={revealNext}
						class="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-brand-red text-lg font-bold text-white shadow transition active:scale-[0.98]"
					>
						Continuar <ChevronDown class="size-5" />
					</button>
				{:else}
					<button
						onclick={restart}
						class="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-brand-red text-base font-bold text-white shadow transition active:scale-[0.98]"
					>
						<RotateCcw class="size-5" /> Ler de novo
					</button>
					<a
						href={backHref}
						aria-label="Voltar ao menu"
						class="grid size-12 shrink-0 place-items-center rounded-full border-2 border-brand-red/30 text-brand-red transition active:scale-90"
					>
						<ArrowLeft class="size-6" />
					</a>
				{/if}
			</div>
		</div>
	</div>
</section>

<style>
	/*
		Layout "justificado" das linhas da folha (só no computador — no celular os
		quadros empilham um embaixo do outro).

		O segredo: cada quadro recebe `flex-grow` igual à sua proporção (`--r`,
		largura ÷ altura) com `flex-basis: 0`. Assim as larguras ficam proporcionais
		à arte e, como consequência matemática, TODOS os quadros da linha terminam
		com a mesma altura. É isso que faz o quadro 1 ficar da altura do 2 e o 3
		dividir o espaço com o 4. `align-items: flex-start` evita que um quadro mais
		curto seja esticado à toa.
	*/
	@media (min-width: 640px) {
		.comic-row {
			align-items: flex-start;
		}

		.comic-cell {
			flex: var(--r, 1) 1 0;
			min-width: 0;
		}
	}

	/*
		Botão "Continuar": uma entrada ÚNICA e discreta quando ele aparece (a cada
		passo da leitura) — em vez de um pulso infinito. Comunica "é aqui" e para,
		sem movimento perpétuo a distrair (Apple HIG; evita conteúdo em movimento
		indefinido do WCAG 2.2.2). A afordância contínua fica na cor/ícone/rótulo.
	*/
	@keyframes cta-in {
		from {
			opacity: 0;
			transform: scale(0.96);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	.cta-appear {
		animation: cta-in 0.32s ease-out backwards;
	}

	/* Acessibilidade: sem movimento para quem prefere menos (WCAG 2.3.3). O reset
	   global em layout.css já cobre, mas reforçamos aqui no próprio componente. */
	@media (prefers-reduced-motion: reduce) {
		.cta-appear {
			animation: none;
		}
	}
</style>
