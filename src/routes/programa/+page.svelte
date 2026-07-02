<!--
	Página "O Programa" ("/programa").
	Conta um pouco sobre o GPUIM: o que é, os objetivos e os projetos de
	extensão. Os textos e listas vêm do arquivo src/lib/site.ts.
-->
<script lang="ts">
	import { projetos, objetivos, contato } from '$lib/site';
	import Globe from '@lucide/svelte/icons/globe';
</script>

<svelte:head>
	<title>O Programa — GPUIM</title>
	<meta
		name="description"
		content="Conheça o GPUIM (UFC): origem, missão, objetivos e os projetos de extensão."
	/>
</svelte:head>

<section class="mx-auto max-w-6xl px-5 py-12 sm:py-16">
	<h1 class="text-4xl font-black tracking-tight text-brand-indigo sm:text-5xl">O Programa</h1>

	<div class="mt-8 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
		<div class="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
			<p class="text-lg text-slate-700">
				O <strong class="font-semibold text-brand-indigo">GPUIM</strong> (Grupo de Prevenção ao Uso
				Indevido de Medicamentos) nasceu em 1990 na Faculdade de Farmácia da UFC, criado por
				estudantes preocupados com o uso inadequado de medicamentos no Brasil. Desde 1995 é um
				programa oficial da universidade.
			</p>
			<p class="mt-3 text-lg text-slate-700">
				Sua missão é levar informação confiável sobre medicamentos a todos — da pesquisa científica
				à orientação de profissionais de saúde e da comunidade. É nesse trabalho que nascem
				histórias como <em>Entre Bulas &amp; Perguntas</em>.
			</p>

			<h2 class="mt-8 text-sm font-bold uppercase tracking-widest text-brand-amber-ink">
				Nosso objetivo
			</h2>
			<p class="mt-1 text-lg font-semibold text-brand-indigo">
				Contribuir para o uso seguro, eficaz e econômico dos medicamentos.
			</p>
			<ul class="mt-3 space-y-2">
				{#each objetivos as obj (obj)}
					<li class="flex gap-2 text-slate-700">
						<span class="mt-2 size-2 shrink-0 rounded-full bg-brand-amber"></span>
						{obj}
					</li>
				{/each}
			</ul>

			<a
				href={contato.site}
				target="_blank"
				rel="noopener noreferrer"
				class="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-amber px-5 py-2.5 text-base font-bold text-brand-indigo-dark transition hover:bg-brand-amber/90"
			>
				<Globe class="size-5" /> Site do GPUIM
			</a>
		</div>

		<div class="rounded-3xl border border-slate-200 bg-slate-50 p-8 sm:p-10">
			<h2 class="text-xl font-bold text-brand-indigo">Projetos de extensão</h2>
			<p class="mt-1 text-sm text-slate-500">O GPUIM reúne cinco frentes de trabalho:</p>
			<ul class="mt-4 space-y-3">
				{#each projetos as projeto (projeto)}
					<li class="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700">
						{projeto}
					</li>
				{/each}
			</ul>
		</div>
	</div>
</section>
