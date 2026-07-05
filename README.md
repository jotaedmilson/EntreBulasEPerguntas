# Entre Bulas & Perguntas

> Quadrinho educativo do **GPUIM** (Grupo de Prevenção ao Uso Indevido de
> Medicamentos — UFC) sobre o uso correto de medicamentos.

Acompanhe a farmacêutica **Milena** respondendo às dúvidas do **Teo**, um garoto
curioso, e de sua avó, **Dona Rosangela**. Cada história é uma página de
quadrinhos que se completa aos poucos, com linguagem simples para todas as
idades — das crianças aos avós.

## Índice

- [Demonstração](#demonstração)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Scripts disponíveis](#scripts-disponíveis)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Como adicionar uma nova história](#como-adicionar-uma-nova-história)
- [Como trocar a arte dos quadros](#como-trocar-a-arte-dos-quadros)
- [Acessibilidade](#acessibilidade)
- [Licença e créditos](#licença-e-créditos)

## Demonstração

As capturas de tela do site (computador e celular) estão na pasta
[`docs/previews/`](docs/previews/).

O site tem várias páginas:

| Página | Endereço | O que mostra |
| --- | --- | --- |
| Início | `/` | Apresentação e o catálogo de histórias (com busca) |
| História | `/historia/[id]` | O leitor de uma história |
| O Programa | `/programa` | Sobre o GPUIM (origem, objetivos e projetos) |
| Contato | `/contato` | Telefones, e-mails, endereço, mapa e redes |

## Funcionalidades

- **Catálogo com 3 histórias:**
  1. _O que é um farmacêutico?_ — a diferença entre médico e farmacêutico;
  2. _Aarmazenamento de medicamentos_ — como guardar medicamentos de maneira correta;
  3. _Descarte de remédios_ — o descarte correto de medicamentos.
- **Leitor "página viva":** a página de quadrinhos vai se montando aos poucos —
  cada quadro aparece com uma animação conforme a leitura avança.
- **Leitura guiada:** ao abrir uma história, um passo a passo explica como ler.
- **Controles simples:** _Continuar_  ,_Voltar (um quadro)_ e _Ler de novo_ ao
  finalizar a história.
- **Busca** de histórias por título ou tema.
- **Versões pensadas para cada aparelho:** no computador, navegação no topo e
  grade de cartões; no celular, menu em gaveta, lista de cartões e barra de
  leitura fixa no rodapé.

## Tecnologias

- [Svelte 5](https://svelte.dev) + [SvelteKit](https://svelte.dev/docs/kit)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn-svelte](https://shadcn-svelte.com) (componentes de interface)
- [Lucide](https://lucide.dev) (ícones)

## Como rodar o projeto

Pré-requisito: ter o [Node.js](https://nodejs.org/) (versão 22 ou mais nova).

```bash
# 1. Instalar as dependências
npm install

# 2. Rodar em modo de desenvolvimento
npm run dev

# 3. Abrir no navegador o endereço que aparecer (ex.: http://localhost:5173)
```

Para gerar a versão final (de produção):

```bash
npm run build     # cria a versão otimizada
npm run preview   # testa a versão de produção localmente
```

## Scripts disponíveis

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a versão de produção |
| `npm run preview` | Pré-visualiza a versão de produção |
| `npm run check` | Verifica os tipos (TypeScript/Svelte) |
| `npm run panels` | Atualiza o manifesto de quadros (lê `static/comics/`) |

## Estrutura de pastas

```
.
├── docs/previews/                 # capturas de tela (computador e celular)
├── scripts/
│   ├── scan-panels.mjs            # descobre os quadros e gera o manifesto
│   └── vite-plugin-comics-panels.mjs  # roda o scan no dev e no build
├── static/
│   ├── brand/gpuim-logo.png       # logo do GPUIM
│   └── comics/<historia>/<n>.png  # imagens dos quadros (png/webp/svg…)
└── src/
    ├── lib/
    │   ├── comics.data.js          # metadados + alt de cada quadro
    │   ├── comics.panels.json      # manifesto gerado (quadros + dimensões)
    │   ├── comics.ts               # tipos e funções auxiliares
    │   ├── site.ts                 # dados do GPUIM (contato, projetos…)
    │   └── components/
    │       ├── ComicReader.svelte  # o leitor da história
    │       ├── WebcomicMenu.svelte # o catálogo de histórias
    │       └── ui/                 # componentes do shadcn-svelte
    └── routes/
        ├── +layout.svelte          # cabeçalho e rodapé (em todas as páginas)
        ├── +page.svelte            # página inicial
        ├── +error.svelte           # página de erro (404)
        ├── historia/[id]/          # uma página por história
        ├── programa/               # página "O Programa"
        └── contato/                # página "Contato"
```

## Como adicionar uma nova história

1. Crie a pasta `static/comics/<id>/` e solte os quadros nela, numerados em
   ordem (`1.png`, `2.png`…). Veja `static/comics/README.md`.
2. Abra `src/lib/comics.data.js` e copie um dos blocos da lista `webcomics`;
   troque o `id`, o `title`, a `tagline` e a `description`.
2. Rode `npm run panels` (o `npm run dev`/`build` também atualiza sozinho).
4. Pronto! A história aparece sozinha no catálogo e ganha o endereço
   `/historia/<id>`.

## Como trocar a arte dos quadros

As imagens ficam em `static/comics/<historia>/<numero>.<ext>` (png, webp, svg…).
Para usar uma arte própria, basta substituir/soltar o arquivo e rodar
`npm run panels`.

## Acessibilidade

Feito com atenção a quem mais precisa — em especial os idosos:

- Segue as recomendações da **WCAG 2.2 (nível AA)** e da **Apple HIG**.
- Cores com bom **contraste** e textos grandes e legíveis.
- **Foco visível** em todos os botões e links (para uso pelo teclado).
- Atalho **"Pular para o conteúdo"** e marcos de página (`header`, `main`,
  `footer`, `nav`).
- Respeita a preferência de **menos movimento** (`prefers-reduced-motion`).
- Funciona em celular, tablet e computador, com zoom liberado.

## Licença e créditos

- O conteúdo (história, personagens, textos e arte) é **© 2026 GPUIM** —
  todos os direitos reservados. Veja [`LICENSE`](LICENSE).
- As bibliotecas de código aberto usadas e suas licenças estão em
  [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).
