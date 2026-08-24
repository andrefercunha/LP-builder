# Estúdio LP

Estúdio interno da REDNA para montar landing pages de parceiros sem cair no visual genérico de gerador.

Não se pede a um modelo para “inventar uma página”. Entrega-se **marca, fotos e copy** para uma **template já desenhada**, com a estrutura de conversão que a agência já usa.

## O que entra

- Brand kit: cores, fontes, logótipo
- Fotos reais (herói e retrato)
- Copy por secções, não um bloco único

## O que sai

Uma de quatro páginas:

| Tipo | Template | Função |
|---|---|---|
| Opt-in / Registo | Densa, ecrã único | Evento, VSL, workshop |
| Página de vendas | Longa editorial | Oferta com mecanismo e prova |
| Marcação / Sessão | Editorial honesta | Um destino comercial |
| Obrigado | Confirmação | Próximo passo imediato |

A estrutura da copy segue o mapa que já tens nos documentos de trabalho: eyebrow, headline, subheadline, reconhecimento (spray de problemas), corpo, mecanismo, oferta, prova, garantia, FAQ e próximo passo. A qualidade é medida com o checklist **C.O.N.V.E.R.S.I.O.N.S**.

## O que isto recusa de propósito

- Layout gerado do zero
- Inter + roxo de template SaaS
- Cartões com ícones genéricos
- Urgência e resultados inventados
- A mesma fonte no título e no corpo

Se a pontuação ficar abaixo de 80, a página ainda não está entregável.

## Como testar (no browser, não no GitHub)

O PR é só o código. O teste é a app aberta.

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

1. **Olhar.** Clica numa página da lista (ex.: Sessão Anti-Tretas). Isso é o resultado — copy, marca, look.
2. **Recomendação.** Na home, clica **Copy de sessão**. O formato enche-se sozinho. À direita tem de aparecer **Carta**. Depois **Abrir esta página**.
3. Repete com **Copy de workshop** (espera Cartaz) e **Copy de obrigado** (espera Recibo).
4. **Copy teu.** “Entregar copy meu”, cola o briefing no formato, vê se a recomendação faz sentido.

As páginas ficam neste browser (`localStorage`). “Repor exemplos” volta aos originais.

## Como correr

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Podes exportar HTML ou JSON.
