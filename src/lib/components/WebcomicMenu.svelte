<!--
  WebcomicMenu.svelte
  ===================
  O catálogo de histórias. Recebe a lista de histórias e desenha um cartão
  (que é um link para /historia/[id]) para cada uma. Cada cartão mostra a capa,
  o tema, o título e a descrição.
-->
<script lang="ts">
  import type { Webcomic } from "$lib/comics";
  import ArrowRight from "@lucide/svelte/icons/arrow-right";
  import BookText from "@lucide/svelte/icons/book-text";
  import Pill from "@lucide/svelte/icons/pill";
  import Stethoscope from "@lucide/svelte/icons/stethoscope";

  // `webcomics` é a lista de histórias a exibir (já filtrada pela busca).
  let { webcomics }: { webcomics: Webcomic[] } = $props();

  // Liga o nome do ícone (texto nos dados) ao componente de ícone de verdade.
  // Só é usado quando a história não tem imagem de capa.
  const icons = {
    stethoscope: Stethoscope,
    "book-text": BookText,
    pill: Pill,
  } as const;
</script>

<!--
  Mesmo conteúdo, dois formatos:
  - celular: lista vertical com cartões "deitados" (capa pequena + texto), fáceis de tocar;
  - computador: grade de três cartões "em pé" com capa grande.
-->
<ul class="grid list-none gap-4 p-0 md:grid-cols-3 md:gap-6">
  {#each webcomics as comic (comic.id)}
    {@const Icon = icons[comic.icon]}
    <li class="contents">
      <a
        href={`/historia/${comic.id}`}
        aria-label={`Ler a história: ${comic.title}`}
        class="group flex h-full w-full flex-row overflow-hidden rounded-2xl border border-slate-200 bg-white text-left text-slate-800 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl active:scale-[0.985] active:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-amber md:flex-col md:rounded-3xl"
      >
        <!-- Capa (Otimizada para preencher a altura no celular) -->
        <div
          class="relative flex w-28 shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br min-h-[8.5rem] sm:w-32 {comic.cover} md:h-44 md:w-full"
        >
          {#if comic.coverImage}
            <img
              src={comic.coverImage}
              alt={`Capa da história ${comic.title}`}
              loading="lazy"
              class="absolute inset-0 size-full object-cover"
            />
          {:else}
            <Icon
              class="size-12 text-white/90 drop-shadow transition group-hover:scale-110 md:size-20"
            />
          {/if}
        </div>

        <!-- Conteúdo -->
        <div class="flex flex-1 flex-col p-4 md:p-5">
          <h3
            class="mt-0.5 text-lg font-extrabold leading-tight text-brand-indigo md:mt-0 md:text-xl"
          >
            {comic.title}
          </h3>
          <p
            class="mt-1.5 flex-1 text-[15px] text-slate-600 max-md:line-clamp-2 md:mt-2 md:text-base"
          >
            {comic.description}
          </p>
          <span
            class="mt-3 inline-flex items-center gap-2 text-base font-bold text-brand-red transition-all group-hover:gap-3 group-active:gap-3 md:mt-4"
          >
            Ler a história <ArrowRight class="size-5" />
          </span>
        </div>
      </a>
    </li>
  {/each}
</ul>
