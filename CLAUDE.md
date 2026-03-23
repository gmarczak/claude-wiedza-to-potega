---
name: wiedza-to-potega-restyle
description: Restyling gry quizowej "Wiedza to Potęga" — zmiana wyglądu bez naruszania logiki gry. Triggeruj gdy użytkownik prosi o zmianę stylu, wyglądu, kolorów, animacji lub UI dowolnego ekranu tej aplikacji.
---

# Skill: Restyle "Wiedza to Potęga"

Twoim zadaniem jest **wyłącznie zmiana warstwy wizualnej** — CSS, klasy Tailwind, fonty, kolory, animacje, układ. Logika gry (Socket.io, stany, eventy, props, typy) pozostaje nienaruszona.

---

## Stack techniczny projektu

- **React + TypeScript + Vite**
- **Tailwind CSS** (bez custom konfiguracji theme — używaj tylko utility classes)
- **Animacje**: zdefiniowane w `client/src/index.css` jako `@keyframes` + named klasy `.animate-*`
- Fonty ładowane z Google Fonts przez `@import` w `index.css`
- Brak bibliotek animacyjnych (Framer Motion, GSAP itp.) — czysty CSS

---

## Struktura plików UI (tylko te dotykaj przy restylu)

```
client/src/
├── index.css                    ← GŁÓWNE MIEJSCE NA ZMIANY (kolory, fonty, animacje)
├── components/
│   ├── HomeScreen.tsx           ← Ekran startowy (wybór awatara, imię, pokój)
│   ├── LobbyScreen.tsx          ← Poczekalnia
│   ├── CategoryVoteScreen.tsx   ← Głosowanie na kategorię
│   ├── PowerUpScreen.tsx        ← Wybór zagrywki (Szlam, Dziobak, Lód, Bomba)
│   ├── CountdownScreen.tsx      ← Odliczanie przed pytaniem
│   ├── QuestionScreen.tsx       ← Pytanie + 4 odpowiedzi + timer
│   ├── RevealScreen.tsx         ← Ujawnienie odpowiedzi + punkty
│   ├── MiniGameScreen.tsx       ← Minigry (łączenie par, sortowanie)
│   ├── PyramidScreen.tsx        ← Piramida Wiedzy (finał)
│   ├── FinishedScreen.tsx       ← Ekran końcowy + ranking
│   └── HostComment.tsx          ← Komentarze prowadzącego Maksa
```

---

## Zasady bezpiecznego restylu

### ✅ Możesz zmieniać
- Wszystkie **klasy Tailwind** w `className={...}`
- Plik **`index.css`**: `@import` fontów, `@keyframes`, klasy `.animate-*`, CSS variables
- Kolory gradientów tła (`from-X via-Y to-Z`)
- Zaokrąglenia (`rounded-*`), cienie (`shadow-*`), padding/margin
- Typografię (`font-*`, `text-*`, `tracking-*`, `leading-*`)
- Nowe animacje CSS w `index.css`
- Tło i atmosferę (pseudoelementy via `@layer`, noise texture w CSS)

### ❌ Nigdy nie ruszaj
- Logiki Socket.io (`socket.ts`, eventy `emit`/`on`)
- Propsów i interfejsów TypeScript (`interface Props { ... }`)
- Handlerów zdarzeń (`onAnswer`, `onSelect`, `onSkip`, `onCreateRoom`, itp.)
- Stanu gry (`useState` dla logiki, nie wyglądu)
- Pliku `types.ts`
- Backendu (`server/`)
- `sounds.ts`

---

## Aktualny styl (co zastępujesz)

Obecny wygląd to **generic AI vibe**:
- Font: `Inter` (najbardziej generyczny font na świecie)
- Tło: `bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900` (wszędzie to samo)
- Przyciski: `bg-gradient-to-r from-indigo-500 to-purple-600` (standardowy vibecode)
- Karty: `bg-white/10 border border-white/20 rounded-xl` (szklane karty)
- Animacje: podstawowe slide-up, scale-in, bounce-in

---

## Docelowa estetyka: GAME SHOW / RETRO-FUTURISTIC

Gra jest quizem dla 2-6 graczy, inspirowanym teleturniejem. Docelowy vibe:

**Opcja A — Neon Arcade (rekomendowana)**
- Tło: ciemne, prawie czarne `#0a0a0f` z neonowymi akcentami
- Kolory: elektryczny żółty `#FFE033`, cyan `#00F5FF`, magenta `#FF2D78`
- Font: `Rajdhani` lub `Orbitron` (wyświetlacze cyfrowe) + `Nunito` lub `Exo 2` (body)
- Efekty: glow na tekście (`text-shadow: 0 0 20px`), scanlines overlay, CRT-like borders
- Przyciski: ostre rogi lub pill shape, neonowy border zamiast fill

**Opcja B — Gameshow Gold**
- Tło: głęboki granat `#0D1B2A` z akcentami złota `#FFD700`
- Font: `Bebas Neue` (headers) + `Barlow Condensed` (body)
- Efekty: złote gradienty, confetti particles, spotlight effect
- Przycisk odpowiedzi: duże, kolorowe bloki jak w teleturnieju (czerwony, niebieski, żółty, zielony) — BEZ gradientu, flat + border

**Opcja C — Brutalist Quiz**
- Tło: białe lub krem `#F5F0E8`
- Font: `Anton` lub `Black Han Sans` (headers) + `IBM Plex Mono` (body)
- Kolory: czarny + jeden intensywny kolor akcentowy (np. `#FF3300`)
- Układ: grube bordery `4px solid black`, box-shadow jako pseudo-cień, zero zaokrągleń

---

## Wzorzec zmiany — przykład HomeScreen

**Przed (generic):**
```tsx
<div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
  <h1 className="text-5xl font-black text-white">Wiedza</h1>
  <button className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl">
    Stwórz Pokój
  </button>
```

**Po (Neon Arcade):**
```tsx
<div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">
  {/* scanline overlay */}
  <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-[0.03] z-10" />
  <h1 className="text-5xl font-black text-neon-yellow tracking-widest uppercase glow-text">Wiedza</h1>
  <button className="w-full py-4 border-2 border-neon-yellow text-neon-yellow font-bold uppercase tracking-widest hover:bg-neon-yellow hover:text-black transition-all duration-200">
    Stwórz Pokój
  </button>
```

---

## Przepis na zmianę index.css

Przy każdym restylu **zastąp** górną część `index.css`:

```css
/* 1. Nowe fonty */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Exo+2:wght@400;600;800&display=swap');

/* 2. CSS variables dla całego projektu */
:root {
  --color-bg: #0a0a0f;
  --color-surface: #12121a;
  --color-primary: #FFE033;
  --color-secondary: #00F5FF;
  --color-danger: #FF2D78;
  --color-success: #39FF14;
  --glow-primary: 0 0 20px var(--color-primary), 0 0 40px var(--color-primary);
  --glow-secondary: 0 0 20px var(--color-secondary);
}

/* 3. Base */
body {
  font-family: 'Exo 2', sans-serif;
  background-color: var(--color-bg);
  color: #fff;
}

/* 4. Nowe klasy pomocnicze */
.glow-text { text-shadow: var(--glow-primary); }
.glow-text-cyan { text-shadow: var(--glow-secondary); }
.surface { background: var(--color-surface); }
.border-glow { border: 1px solid var(--color-primary); box-shadow: var(--glow-primary); }

/* 5. Zachowaj stare animacje (są używane w logice!) */
/* ... (zostaw wszystkie @keyframes i .animate-* bez zmian) */
```

---

## Kolory odpowiedzi w QuestionScreen

Odpowiedzi A/B/C/D mają zawsze 4 kolory — zachowaj tę koncepcję, zmień tylko kolory:

```tsx
// PRZED (generic gradienty):
const answerColors = [
  'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
  'from-blue-500 to-blue-600 ...',
  'from-yellow-500 to-yellow-600 ...',
  'from-green-500 to-green-600 ...',
];

// PO (neon flat):
const answerColors = [
  'bg-transparent border-2 border-[#FF2D78] text-[#FF2D78] hover:bg-[#FF2D78] hover:text-black',
  'bg-transparent border-2 border-[#00F5FF] text-[#00F5FF] hover:bg-[#00F5FF] hover:text-black',
  'bg-transparent border-2 border-[#FFE033] text-[#FFE033] hover:bg-[#FFE033] hover:text-black',
  'bg-transparent border-2 border-[#39FF14] text-[#39FF14] hover:bg-[#39FF14] hover:text-black',
];
```

---

## Checklist przed commitem

- [ ] Logika gry działa identycznie (przetestuj pełną grę 2-osobową)
- [ ] Wszystkie animacje `.animate-*` nadal działają (są używane w TSX)  
- [ ] Timer urgency w QuestionScreen nadal zmienia kolor przy ≤5s
- [ ] PowerUp efekty (slime overlay, frozen, bomb shake) nadal widoczne
- [ ] Ekran finałowy — konfetti nadal odpala się po zwycięstwie
- [ ] Responsywność: działa na mobile (telefony graczy!)
- [ ] `npm run build` bez błędów TS

---

## Ważna uwaga o Tailwind

Projekt używa standardowego Tailwind **bez** custom theme. Arbitralne kolory wpisuj jako:
```tsx
className="bg-[#0a0a0f] text-[#FFE033] border-[#00F5FF]"
```

Lub dodaj zmienne CSS w `index.css` i odwołuj się przez `var(--color-primary)` w `style={{}}`.
