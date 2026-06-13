# 🎵 MoodPlay

Aplicativo desenvolvido em **React Native com Expo** que utiliza APIs globais de entretenimento para recomendar músicas e filmes com base no humor do usuário.

---

## 📱 Sobre o aplicativo

O MoodPlay é uma plataforma interativa que conecta o estado emocional do usuário a conteúdos culturais. Ao selecionar um humor, o aplicativo realiza requisições em tempo real para buscar trilhas sonoras e produções cinematográficas, oferecendo uma experiência dinâmica e personalizada.

---

## ⚙️ Funcionalidades

### Recomendações Reais (Integração com APIs)
O app consome dados em tempo real através de:
- **Last.fm API**: Para buscar faixas musicais baseadas em tags de sentimentos.
- **TMDB API**: Para sugerir filmes baseados em gêneros cinematográficos específicos para cada vibe.



### Seleção de Humores Expandida
- 😄 **Feliz** — Músicas alto-astral e comédias.
- 😢 **Triste** — Músicas melancólicas e dramas.
- 🔥 **Animado** — Batidas energéticas e filmes de ação.
- 🌙 **Calmo** — Trilhas relaxantes e fantasia.
- 😰 **Ansioso** — Músicas suaves para descompressão.
- 😡 **Bravo** — Músicas intensas (Rock/Metal) e suspenses.

### Recurso "Mudar Sugestões"
Caso o usuário queira explorar novas opções, o botão **🔄 Mudar sugestões** realiza uma nova chamada às APIs, sorteando resultados diferentes sem a necessidade de reiniciar o fluxo.

