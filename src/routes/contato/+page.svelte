<!--
	Página "Contato" ("/contato").
	Mostra telefones, e-mails, redes e o endereço (com mapa do OpenStreetMap).
	Todas essas informações ficam em src/lib/site.ts, num lugar só, fácil de
	atualizar.
-->
<script lang="ts">
	import { contato } from '$lib/site';
	import Phone from '@lucide/svelte/icons/phone';
	import Mail from '@lucide/svelte/icons/mail';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Globe from '@lucide/svelte/icons/globe';
</script>

<svelte:head>
	<title>Contato — GPUIM</title>
	<meta name="description" content="Telefones, e-mails, endereço e redes do GPUIM (UFC)." />
</svelte:head>

<section class="mx-auto max-w-6xl px-5 py-12 sm:py-16">
	<h1 class="text-4xl font-black tracking-tight text-brand-indigo sm:text-5xl">Contato</h1>

	<div class="mt-8 grid gap-6 md:grid-cols-3">
		<!-- Telefones -->
		<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
			<h2 class="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-amber-ink">
				<Phone class="size-4" /> Telefones
			</h2>
			<ul class="mt-3 space-y-2">
				{#each contato.telefones as tel (tel)}
					<li>
						<a
							href={`tel:+5585${tel.replace(/\D/g, '').slice(2)}`}
							class="text-lg text-brand-indigo hover:text-brand-amber"
						>
							{tel}
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<!-- E-mails -->
		<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
			<h2 class="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-amber-ink">
				<Mail class="size-4" /> E-mails
			</h2>
			<ul class="mt-3 space-y-2">
				{#each contato.emails as e (e.email)}
					<li class="flex flex-wrap items-baseline gap-x-2">
						<span class="text-sm font-bold text-slate-400">{e.centro}</span>
						<a href={`mailto:${e.email}`} class="text-brand-indigo hover:text-brand-amber">
							{e.email}
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<!-- Redes -->
		<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
			<h2 class="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-amber-ink">
				<Globe class="size-4" /> Redes
			</h2>
			<div class="mt-3 flex flex-col gap-2">
				<a
					href={contato.instagram}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 font-semibold text-brand-indigo hover:text-brand-amber"
				>
					<svg
						class="size-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
						<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
						<line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
					</svg>
					@cim.ufc
				</a>
				<a
					href={contato.site}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 font-semibold text-brand-indigo hover:text-brand-amber"
				>
					<Globe class="size-5" /> gpuim.ufc.br
				</a>
			</div>
		</div>
	</div>

	<!-- Endereço / mapa -->
	<div class="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
		<h2 class="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-amber-ink">
			<MapPin class="size-4" /> Onde estamos
		</h2>
		<p class="mt-3 text-lg font-semibold text-brand-indigo">{contato.endereco}</p>

		<div class="mt-4 overflow-hidden rounded-xl border border-slate-200">
			<iframe
				title="Mapa da localização do GPUIM"
				src={contato.mapaEmbed}
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
				class="h-64 w-full sm:h-80"
			></iframe>
		</div>
		<p class="mt-1 text-xs text-slate-400">
			Mapa: ©
			<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" class="underline">
				colaboradores do OpenStreetMap
			</a>
		</p>

		<div class="mt-4 flex flex-wrap gap-3">
			<a
				href={contato.direcoes}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-full bg-brand-amber px-5 py-2.5 text-base font-bold text-brand-indigo-dark transition hover:bg-brand-amber/90"
			>
				<MapPin class="size-5" /> Como chegar
			</a>
			<a
				href={contato.mapa}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-base font-semibold text-brand-indigo transition hover:bg-slate-50"
			>
				Abrir no mapa
			</a>
		</div>
	</div>
</section>
