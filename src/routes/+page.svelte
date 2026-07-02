<!--
	Página inicial ("/").
	Mostra a apresentação do projeto e o catálogo de histórias, com uma busca
	que filtra as histórias por título, tema ou descrição.
-->
<script lang="ts">
  import { webcomics } from "$lib/comics";
  import WebcomicMenu from "$lib/components/WebcomicMenu.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import BookText from "@lucide/svelte/icons/book-text";
  import Search from "@lucide/svelte/icons/search";

  // O que a pessoa digitou na busca.
  let query = $state("");

  // "Normaliza" o texto: tira acentos e deixa minúsculo. Assim "bulas",
  // "Bulas" e "bùlas" são tratados do mesmo jeito na busca.
  const norm = (s: string) =>
    s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  // Lista de histórias que combinam com a busca (ou todas, se estiver vazia).
  const filtered = $derived(
    query.trim()
      ? webcomics.filter((c) =>
          norm(`${c.title} ${c.tagline} ${c.description}`).includes(
            norm(query),
          ),
        )
      : webcomics,
  );
</script>

<svelte:head>
  <title>Entre Bulas &amp; Perguntas — GPUIM</title>
  <meta
    name="description"
    content="Histórias em quadrinhos do GPUIM (UFC) sobre o uso correto de medicamentos, para todas as idades."
  />
</svelte:head>

<!-- Apresentação -->
<section class="mx-auto max-w-3xl px-5 pb-4 pt-8 sm:pt-16">
  <p
    class="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-amber/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-indigo"
  >
    <BookText class="size-4 text-brand-amber-ink" /> Quadrinho educativo do GPUIM
  </p>
  <h1
    class="font-coiny text-[clamp(1.2rem,6vw,3rem)] leading-tight tracking-tight"
  >
    <span class="text-brand-indigo">Entre</span>
    <span class="text-brand-amber">Bulas</span>
    <span class="text-brand-amber">&amp;</span>
    <span class="text-brand-indigo">Perguntas</span>
  </h1>
  <p class="mt-5 max-w-prose text-lg text-slate-600 text-justify sm:text-xl">
    é um quadrinho educativo produzido pelo grupo Filhos de Iracema para
    conscientização do uso inadequado de medicamentos. Siga a história da
    farmacêutica Milena enquanto ela responde às dúvidas de Teo, um garoto
    curioso, e sua avó, Dona Rosangela, e, entre uma bula e perguntas, aprenda
    sobre várias informações acerca do uso correto de medicamentos.
  </p>
</section>

<!-- Catálogo de histórias -->
<section id="historias" class="mx-auto max-w-6xl scroll-mt-24 px-5 py-10">
  <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
    <h2 class="text-2xl font-bold text-brand-indigo sm:text-3xl">Escolha uma história</h2>
    <div class="relative w-full sm:w-64">
      <label for="busca" class="sr-only">Procurar uma história</label>
      <Search
        class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
      />
      <Input
        id="busca"
        type="search"
        bind:value={query}
        placeholder="procurar uma história..."
        class="rounded-full border-slate-200 bg-white pl-9 text-base"
      />
    </div>
  </div>

  {#if filtered.length > 0}
    <WebcomicMenu webcomics={filtered} />
  {:else}
    <div
      class="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center"
    >
      <p class="text-lg font-semibold text-brand-indigo">
        Nenhuma história encontrada
      </p>
      <p class="mt-1 text-slate-500">Tente procurar de outro jeito.</p>
      <Button
        onclick={() => (query = "")}
        class="mt-4 bg-brand-amber text-brand-indigo-dark hover:bg-brand-amber/90"
      >
        Mostrar todas
      </Button>
    </div>
  {/if}
</section>
