# Imagens das webcomics

Os quadros são **descobertos automaticamente** a partir desta pasta. Para
adicionar/atualizar uma história, basta soltar os arquivos numa pasta com o
`id` da webcomic e nomear os quadros em ordem numérica:

```
static/comics/<id-da-webcomic>/1.webp
static/comics/<id-da-webcomic>/2.webp
static/comics/<id-da-webcomic>/3.png        (pode misturar formatos)
static/comics/<id-da-webcomic>/capa.png     (capa — não conta como quadro)
```

Depois rode:

```
npm run panels
```

Isso varre as pastas, lê as **dimensões** de cada arte e atualiza
`src/lib/comics.panels.json` (o manifesto). O site usa esse manifesto para:

- saber **quantos** quadros a história tem (= quantidade de arquivos);
- montar o **layout dinâmico** (cada quadro com seu formato; panorâmicos largos
  ocupam a linha inteira, os demais vão de par em par com a mesma altura);
- já entregar o layout **correto no servidor**, sem "pulo" ao carregar.

> O `npm run build` roda `npm run panels` sozinho, então a produção está sempre
> atualizada. Em desenvolvimento, rode `npm run panels` depois de mexer nas
> imagens.

## Formatos

É **agnóstico de formato** — lê PNG, JPEG, GIF, WebP (inclusive animado) e SVG.

- **WebP** é o preferido para arte rasterizada (pintada/desenhada): bem menor
  que PNG/JPG, com suporte universal. Largura ~1000–1400px.
- **SVG** para arte vetorial: continua SVG (é minúsculo e nítido em qualquer
  tela — não rasterize).
- **GIF** → prefira **WebP animado** se um dia precisar de animação.

## Texto de acessibilidade (opcional, mas recomendado)

As imagens aparecem sozinhas a partir da pasta. Para acessibilidade, escreva um
`alt` **curto** por quadro em `src/lib/comics.data.js`, na ordem dos quadros:

```js
pages: [
  { alt: 'Teo corre pela farmácia chamando pela farmacêutica Milena.' },
  { alt: 'No balcão, Dona Rosa entrega a receita.' }
  // ...
]
```

- O `alt` vira a descrição lida por leitores de tela.
- Se faltar `alt`, o leitor usa um texto genérico (`"<título> — quadro N"`).
- O casamento texto↔imagem é **por posição**: o 1º `alt` vai para o 1º arquivo.
