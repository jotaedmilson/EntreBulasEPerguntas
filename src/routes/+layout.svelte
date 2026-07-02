<!--
	Layout do site (a "moldura" de todas as páginas).
	O cabeçalho (logo + menu) e o rodapé ficam aqui, então aparecem em todas as
	páginas. No meio, `{@render children()}` mostra a página atual.
-->
<script lang="ts">
  import { afterNavigate } from "$app/navigation";
  import { page } from "$app/state";
  import { contato, nav } from "$lib/site";
  import { prefersReducedMotion } from "$lib/utils";
  import { slide } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import Globe from "@lucide/svelte/icons/globe";
  import MapPin from "@lucide/svelte/icons/map-pin";
  import Menu from "@lucide/svelte/icons/menu";
  import X from "@lucide/svelte/icons/x";
  import "./layout.css";

  let { children } = $props();

  let menuOpen = $state(false);
  afterNavigate(() => (menuOpen = false));

  const isActive = (href: string) =>
    href === "/"
      ? page.url.pathname === "/"
      : page.url.pathname.startsWith(href);
</script>

<svelte:head>
  <link rel="icon" type="image/png" href="/brand/icone-192.png" />
  <link rel="apple-touch-icon" href="/brand/icone-180.png" />
  <meta name="theme-color" content="#16294d" />
  <meta property="og:site_name" content="Entre Bulas & Perguntas" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="/brand/gpuim-logo.png" />
  <meta name="twitter:card" content="summary" />
</svelte:head>

<div class="flex min-h-screen flex-col bg-white text-slate-800">
  <a
    href="#conteudo"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-indigo focus:px-4 focus:py-2 focus:font-semibold focus:text-white"
  >
    Pular para o conteúdo
  </a>

  <!-- Cabeçalho -->
  <header class="sticky top-0 z-40 border-b border-slate-200 bg-white">
    <div class="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-5">
      <a href="/" class="flex items-center gap-3" aria-label="Início">
        <span
          class="block w-max font-coiny text-lg leading-tight sm:text-xl"
        >
          <span class="block">
            <span class="text-brand-indigo">Entre</span>
            <span class="text-brand-amber">Bulas</span>
          </span>
          <span class="block">
            <span class="text-brand-amber">&amp;</span>
            <span class="text-brand-indigo">Perguntas</span>
          </span>
        </span>
      </a>

      <nav class="ml-auto hidden items-center gap-5 md:flex">
        {#each nav as item (item.href)}
          <a
            href={item.href}
            aria-current={isActive(item.href) ? "page" : undefined}
            class="rounded px-2 py-2 text-sm font-semibold uppercase tracking-wide transition {isActive(
              item.href,
            )
              ? 'text-brand-indigo underline decoration-brand-amber decoration-2 underline-offset-8'
              : 'text-slate-700 hover:text-brand-indigo'}"
          >
            {item.label}
          </a>
        {/each}
      </nav>

      <button
        onclick={() => (menuOpen = !menuOpen)}
        aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={menuOpen}
        aria-controls="menu-mobile"
        class="ml-auto grid size-11 place-items-center rounded-xl bg-slate-100 text-brand-indigo transition hover:bg-slate-200 active:scale-95 active:bg-slate-200 md:hidden"
      >
        {#if menuOpen}<X class="size-6" />{:else}<Menu class="size-6" />{/if}
      </button>
    </div>

    {#if menuOpen}
      <nav
        id="menu-mobile"
        transition:slide={{ duration: prefersReducedMotion() ? 0 : 240, easing: cubicOut }}
        class="flex flex-col gap-1 overflow-hidden border-t border-slate-200 p-2 md:hidden"
        aria-label="Menu"
      >
        {#each nav as item (item.href)}
          {@const active = isActive(item.href)}
          <a
            href={item.href}
            aria-current={active ? "page" : undefined}
            class="flex items-center justify-between gap-3 rounded-xl px-3.5 py-3 text-lg font-semibold transition active:scale-[0.99] {active
              ? 'bg-brand-amber/15 text-brand-indigo'
              : 'text-slate-700 hover:bg-slate-50 active:bg-slate-100'}"
          >
            {item.label}
            <ChevronRight
              class="size-5 shrink-0 {active ? 'text-brand-amber' : 'text-slate-400'}"
              aria-hidden="true"
            />
          </a>
        {/each}
      </nav>
    {/if}
  </header>

  <main id="conteudo" tabindex="-1" class="flex-1 focus:outline-none">
    {@render children()}
  </main>

  <!-- Rodapé -->
  <footer class="mt-auto bg-brand-indigo text-white">
    <div
      class="mx-auto grid max-w-6xl grid-cols-1 gap-x-8 gap-y-10 px-5 py-12 min-[420px]:grid-cols-2 sm:grid-cols-[1.5fr_1fr_1fr]"
    >
      <div class="min-[420px]:col-span-2 sm:col-span-1">
        <p class="w-max font-coiny text-xl leading-tight">
          <span class="block">
            <span class="text-white">Entre</span>
            <span class="text-brand-amber">Bulas</span>
          </span>
          <span class="block">
            <span class="text-brand-amber">&amp;</span>
            <span class="text-white">Perguntas</span>
          </span>
        </p>
        <p class="mt-2 text-sm text-white/70">
          Quadrinho educativo do GPUIM / UFC sobre o uso consciente de
          medicamentos.
        </p>
        <p class="mt-3 flex items-start gap-2 text-sm text-white/70">
          <MapPin class="mt-0.5 size-4 shrink-0 text-brand-amber" />
          {contato.endereco}
        </p>
      </div>

      <nav class="flex flex-col gap-2.5" aria-label="Rodapé">
        <h2 class="text-xs font-bold uppercase tracking-wider text-white/50">
          Navegar
        </h2>
        {#each nav as item (item.href)}
          <a
            href={item.href}
            class="text-white/80 transition hover:text-brand-amber"
          >
            {item.label}
          </a>
        {/each}
      </nav>

      <div class="flex flex-col gap-2.5">
        <h2 class="text-xs font-bold uppercase tracking-wider text-white/50">
          Acompanhe
        </h2>
        <a
          href={contato.instagram}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 text-white/80 transition hover:text-brand-amber"
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
          class="inline-flex items-center gap-2 text-white/80 transition hover:text-brand-amber"
        >
          <Globe class="size-5" /> gpuim.ufc.br
        </a>
      </div>
    </div>
    <div class="border-t border-white/10 px-5 py-6 text-center">
      <p class="text-sm text-white/60">
        Copyright © 2026 GPUIM. Todos os direitos reservados.
      </p>
      <p class="mt-1 text-sm text-white/40">
        Feito com carinho para incentivar o uso consciente de medicamentos 💊
      </p>
    </div>
  </footer>
</div>
