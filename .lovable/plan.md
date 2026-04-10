

# RAG Orbit — Renomear + Trail de Cometa

## Resumo

Renomear o projeto para **RAG Orbit**, remover o texto "dashboard_matrix", e adicionar rastros de cometa nos planetas orbitando.

## Mudanças

### 1. Renomear projeto para "RAG Orbit"

- **`src/components/AppSidebar.tsx`** — Trocar "RAG Chunking Lab" por "RAG Orbit" no header da sidebar
- **`src/routes/_layout/index.tsx`** — Remover o `<h1>` com "dashboard_matrix" completamente
- **`src/components/SolarSystem.tsx`** — Manter "RAG" no sol (já está correto)

### 2. Trail/rastro de cometa nos planetas

Usar pseudo-elementos CSS com gradiente radial que segue cada planeta na órbita, criando um efeito de cauda luminosa.

- **`src/components/SolarSystem.tsx`** — Adicionar um elemento `div` atrás de cada planeta com `box-shadow` alongado e opacidade degradê, usando a cor da estratégia. O trail será feito com múltiplos "pontos fantasma" posicionados com `transform` ligeiramente atrasados na rotação, ou via CSS `box-shadow` com spread direcional.

- **`src/styles.css`** — Adicionar classe `.planet-trail` que aplica uma sombra alongada na direção oposta ao movimento:
  ```css
  .planet-trail {
    position: relative;
  }
  .planet-trail::after {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    width: 200%; height: 100%;
    transform: translateX(-100%) translateY(-50%);
    background: linear-gradient(to left, var(--trail-color) 0%, transparent 100%);
    opacity: 0.4;
    filter: blur(4px);
    pointer-events: none;
  }
  ```

### 3. Atualizar memória

- Atualizar `mem://index.md` com o novo nome "RAG Orbit"

## Arquivos afetados

1. `src/components/AppSidebar.tsx` — nome do projeto
2. `src/routes/_layout/index.tsx` — remover h1 dashboard_matrix
3. `src/components/SolarSystem.tsx` — adicionar trail nos planetas
4. `src/styles.css` — CSS do trail de cometa
5. `mem://index.md` — atualizar nome

