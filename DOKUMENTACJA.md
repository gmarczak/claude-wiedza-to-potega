# Dokumentacja Techniczna — Wiedza to Potęga

Multiplayer quiz online dla 2-6 graczy inspirowany teleturniejem "Wiedza to Potęga" (PS4 PlayLink).

---

## Spis treści

1. [Przegląd projektu](#przegląd-projektu)
2. [Stos technologiczny](#stos-technologiczny)
3. [Struktura plików](#struktura-plików)
4. [Architektura systemu](#architektura-systemu)
5. [Mechaniki gry](#mechaniki-gry)
6. [Fazy gry](#fazy-gry)
7. [Moce (Power-upy)](#moce-power-upy)
8. [Awatary](#awatary)
9. [System punktacji](#system-punktacji)
10. [Socket.io — Eventy](#socketio--eventy)
11. [Uruchomienie lokalne](#uruchomienie-lokalne)
12. [Deployment](#deployment)
13. [Zmienne środowiskowe](#zmienne-środowiskowe)

---

## Przegląd projektu

Gra przeglądarkowa dla 2-6 graczy rozgrywana w czasie rzeczywistym. Gracze łączą się za pomocą 6-znakowego kodu pokoju. Rozgrywka składa się z rund pytań, mini-gier między rundami oraz finałowej Piramidy Wiedzy. Zwycięzca otrzymuje "Legendarny Zwój Wiedzy" z ciekawostką.

**Główne funkcje:**
- Pokoje z kodem (2-6 graczy)
- Głosowanie na kategorię pytań z opcją "przełamania"
- 6 mocy utrudniających grę przeciwnikowi lub wzmacniających siebie
- Bonus za szybkość odpowiedzi (do +10 pkt)
- 2 typy mini-gier: łączenie par i sortowanie
- Finał: Piramida Wiedzy
- 12 awatarów do wyboru
- Komentarze prowadzącego "Maks"
- Pytania z obrazkami
- Wbudowane pytania PL + Open Trivia DB API

---

## Stos technologiczny

| Warstwa    | Technologie                                      |
|------------|--------------------------------------------------|
| Frontend   | React 19, TypeScript, Vite, Tailwind CSS, Three.js (React Three Fiber) |
| Backend    | Node.js, Express, Socket.io 4                    |
| Pytania    | Wbudowana baza PL + Open Trivia DB API (zewnętrzne) |
| Deployment | Frontend → Vercel, Backend → Railway / Render    |

---

## Struktura plików

```
wiedza-to-potega/
├── package.json            # Root — skrypty dev/build/test
├── vercel.json             # Konfiguracja Vercel (frontend)
├── railway.json            # Konfiguracja Railway (backend)
├── render.yaml             # Konfiguracja Render (backend)
├── CLAUDE.md               # Instrukcje implementacji trybu TV
├── DOKUMENTACJA.md         # Dokumentacja techniczna
│
├── .github/
│   └── workflows/
│       └── test.yml        # CI — GitHub Actions (testy na push/PR)
│
├── docs/
│   └── screenshots/        # Screenshoty gry (używane w README)
│
├── client/                 # Aplikacja React (frontend)
│   ├── package.json
│   ├── vite.config.ts
│   ├── vitest.config.ts
│   ├── tailwind.config.js
│   └── src/
│       ├── main.tsx            # Punkt wejścia React
│       ├── App.tsx             # Główny komponent, zarządzanie stanem gry
│       ├── DisplayApp.tsx      # Komponent trybu TV/Display
│       ├── socket.ts           # Konfiguracja klienta Socket.io
│       ├── sounds.ts           # Efekty dźwiękowe
│       ├── types.ts            # Typy TypeScript (współdzielone z backendem)
│       ├── components/         # Ekrany gracza
│       │   ├── HomeScreen.tsx          # Ekran startowy (wybór awatara, imię, pokój)
│       │   ├── LobbyScreen.tsx         # Poczekalnia (oczekiwanie na graczy)
│       │   ├── CountdownScreen.tsx     # Odliczanie przed grą
│       │   ├── CategoryVoteScreen.tsx  # Głosowanie na kategorię
│       │   ├── PowerUpScreen.tsx       # Wybór mocy
│       │   ├── QuestionScreen.tsx      # Ekran pytania (z obsługą power-upów)
│       │   ├── RevealScreen.tsx        # Ujawnienie odpowiedzi i punktów
│       │   ├── MiniGameScreen.tsx      # Mini-gry (łączenie par / sortowanie)
│       │   ├── PyramidScreen.tsx       # Piramida Wiedzy (finał)
│       │   ├── FinishedScreen.tsx      # Ekran końcowy (zwycięzca, zwój)
│       │   └── HostComment.tsx         # Dymek z komentarzem prowadzącego
│       ├── display/            # Ekrany trybu TV (2D)
│       │   ├── DisplayLobbyScreen.tsx
│       │   ├── DisplayCountdownScreen.tsx
│       │   ├── DisplayCategoryScreen.tsx
│       │   ├── DisplayQuestionScreen.tsx
│       │   ├── DisplayRevealScreen.tsx
│       │   └── DisplayFinishedScreen.tsx
│       ├── display3d/          # Ekrany trybu TV (3D — Three.js)
│       │   ├── GameScene.tsx           # Główna scena 3D
│       │   ├── StudioStage.tsx         # Studio TV w 3D
│       │   ├── Character3D.tsx         # Postacie 3D graczy
│       │   ├── QuestionBoard.tsx       # Tablica pytań 3D
│       │   ├── AnswerPanels.tsx        # Panele odpowiedzi 3D
│       │   ├── TimerBar3D.tsx          # Timer 3D
│       │   ├── ScoreBoard3D.tsx        # Tablica wyników 3D
│       │   ├── Pyramid3D.tsx           # Piramida 3D
│       │   ├── CategoryCards3D.tsx     # Karty kategorii 3D
│       │   ├── CameraController.tsx    # Kontroler kamery
│       │   ├── ParticleEffects.tsx     # Efekty cząsteczkowe
│       │   ├── CountdownOverlay.tsx    # Overlay odliczania
│       │   └── transitions.ts          # Animacje przejść
│       └── __tests__/          # Testy frontend (Vitest)
│
└── server/                 # Serwer Node.js (backend)
    ├── package.json
    ├── tsconfig.json
    ├── vitest.config.ts
    └── src/
        ├── index.ts            # Punkt wejścia serwera
        ├── app.ts              # Logika gry (Express + Socket.io)
        ├── types.ts            # Typy TypeScript (modele danych, eventy)
        ├── questions.ts        # Baza pytań, mini-gry, komentarze prowadzącego
        ├── utils.ts            # Funkcje pomocnicze
        └── __tests__/          # Testy backend (Vitest)
```

---

## Architektura systemu

```
Ekran TV (Display)     Gracze 1-6 (telefony/przeglądarki)
  ?mode=display              ?mode=player
     (React + Three.js)      (React)
        │                       │
        └────── Socket.io ──────┘
                     │
              Serwer Node.js
              (Express + Socket.io)
                     │
              Mapa pokoi (RAM)
              rooms: Map<roomId, Room>
```

**Zasady:**
- Cały stan gry przechowywany jest **wyłącznie na serwerze** w obiekcie `Room`.
- Klienci są "głupi" — tylko renderują dane i wysyłają akcje.
- Komunikacja wyłącznie przez Socket.io (WebSocket).
- Brak bazy danych — pokoje giną po zakończeniu gry lub rozłączeniu.

---

## Mechaniki gry

### Przebieg rundy

```
Głosowanie na kategorię
        ↓
Wybór mocy (każdy gracz wybiera moc dla siebie lub przeciwnika)
        ↓
Pytanie (timer, power-upy aktywne)
        ↓
Ujawnienie odpowiedzi + punkty
        ↓
(co 3 pytania) Mini-gra
        ↓
(po 9 pytaniach) Piramida Wiedzy
        ↓
Ekran końcowy
```

### Głosowanie na kategorię

- Każdy gracz głosuje na jedną kategorię spośród 3 losowych.
- Jeśli obaj wybiorą tę samą → ta kategoria wygrywa.
- Jeśli różne → wybór losowy spośród głosowanych.
- **Przełamanie**: każdy gracz ma 1 "przełamanie" na całą grę — wymusza swoją kategorię bez względu na głos przeciwnika.

### Struktura rund

- 9 pytań podzielonych na 3 grupy po 3 pytania (`roundGroup` 0–2, `roundInGroup` 0–2).
- Po każdej grupie 3 pytań odbywa się **mini-gra**.
- Po wszystkich 9 pytaniach i 2 mini-grach → **Piramida Wiedzy**.

### Piramida Wiedzy (finał)

- Gracze startują na różnych pozycjach piramidy (zależnie od wyniku po rundach głównych).
- Każda poprawna odpowiedź = awans o 1 poziom w górę.
- Błędna odpowiedź = cofnięcie o 1 poziom.
- Wygrywa gracz, który pierwszy dotrze na szczyt.

---

## Fazy gry

Stan pokoju (`room.phase`) przechodzi przez następujące etapy:

| Faza               | Opis                                          |
|--------------------|-----------------------------------------------|
| `waiting`          | Poczekalnia, oczekiwanie na graczy            |
| `countdown`        | Odliczanie 3..2..1 przed startem gry          |
| `category_vote`    | Gracze głosują na kategorię pytań             |
| `power_up`         | Gracze wybierają moc na tę rundę              |
| `question`         | Trwa pytanie (timer aktywny)                  |
| `reveal`           | Ujawnienie poprawnej odpowiedzi i punktów     |
| `minigame`         | Mini-gra (po każdej grupie 3 pytań)           |
| `minigame_results` | Wyniki mini-gry                               |
| `pyramid_intro`    | Intro do Piramidy Wiedzy                      |
| `pyramid_question` | Pytanie w Piramidzie                          |
| `pyramid_reveal`   | Ujawnienie odpowiedzi w Piramidzie            |
| `finished`         | Koniec gry — ekran zwycięzcy                  |

---

## Moce (Power-upy)

### Moce atakujące (nakładane na przeciwnika)

| Moc       | Emoji | Opis                                                    |
|-----------|-------|---------------------------------------------------------|
| Szlam     | 🟢    | Zielona maź zakrywa odpowiedzi — przeciwnik musi klikać, by wytrzeć |
| Dziobak   | 🦆    | Usuwa losowe litery z odpowiedzi przeciwnika             |
| Lód       | 🧊    | Zamraża ekran przeciwnika na 3 sekundy                   |
| Bomba     | 💣    | Po 3 sekundach losowo miesza kolejność odpowiedzi        |

### Moce samowzmacniające (działają na siebie)

| Moc              | Emoji | Opis                                           |
|------------------|-------|------------------------------------------------|
| Podwójne Punkty  | ✨    | Zdobywasz podwójne punkty za tę rundę          |
| 50/50            | ✂️    | Usuwa dwie błędne odpowiedzi z pytania         |

---

## Awatary

Gra oferuje 12 awatarów do wyboru:

| ID          | Nazwa       | Emoji | Kolor      |
|-------------|-------------|-------|------------|
| `hotdog`    | Hot Dog     | 🌭    | `#ef4444`  |
| `robot`     | Robot       | 🤖    | `#3b82f6`  |
| `wizard`    | Czarodziej  | 🧙    | `#8b5cf6`  |
| `alien`     | Kosmita     | 👽    | `#22c55e`  |
| `pirate`    | Pirat       | 🏴‍☠️    | `#f59e0b`  |
| `ninja`     | Ninja       | 🥷    | `#6366f1`  |
| `vampire`   | Wampir      | 🧛    | `#dc2626`  |
| `astronaut` | Astronauta  | 👨‍🚀    | `#0ea5e9`  |
| `dragon`    | Smok        | 🐉    | `#16a34a`  |
| `detective` | Detektyw    | 🕵️    | `#78716c`  |
| `unicorn`   | Jednorożec  | 🦄    | `#e879f9`  |
| `ghost`     | Duch        | 👻    | `#94a3b8`  |

---

## System punktacji

### Pytania główne

```
Punkty = Punkty bazowe + Bonus za szybkość
```

**Punkty bazowe** (zależne od poziomu trudności):
- `easy` → 10 pkt
- `medium` → 20 pkt
- `hard` → 30 pkt

**Bonus za szybkość** (maks. +10 pkt):
```
bonus = round((1 - czasOdpowiedzi / limitCzasuMs) * 10)
```
Im szybciej odpowiesz, tym więcej punktów bonus.

**Moc "Podwójne Punkty"**: mnoży sumę punktów × 2 za tę rundę.

### Mini-gry

- Gracz zdobywa punkty zależnie od liczby poprawnie dopasowanych par lub posortowanych elementów.
- Wyniki mini-gry dodawane są do głównego wyniku.

### Piramida Wiedzy

- Poprawna odpowiedź → awans o 1 poziom.
- Błędna odpowiedź → cofnięcie o 1 poziom (min. 0).
- Wygrywa ten, kto pierwszy dotrze na szczyt piramidy.

---

## Socket.io — Eventy

### Eventy wysyłane przez klienta → serwer

| Event                  | Dane                                                  | Opis                           |
|------------------------|-------------------------------------------------------|--------------------------------|
| `room:create`          | `{ playerName, avatarId, settings }`                  | Stwórz nowy pokój              |
| `room:join`            | `{ roomId, playerName, avatarId }`                    | Dołącz do pokoju               |
| `game:start`           | —                                                     | Host rozpoczyna grę            |
| `game:category-vote`   | `category: string`                                    | Oddaj głos na kategorię        |
| `game:use-override`    | `category: string`                                    | Użyj przełamania               |
| `game:power-up-select` | `{ powerUp: PowerUpType, targetId: string }`          | Wybierz moc i cel              |
| `game:power-up-skip`   | —                                                     | Pomiń wybór mocy               |
| `game:answer`          | `answerIndex: number`                                 | Wyślij odpowiedź               |
| `game:minigame-result` | `score: number`                                       | Wynik mini-gry                 |
| `game:pyramid-answer`  | `answerIndex: number`                                 | Odpowiedź w Piramidzie         |
| `display:join`         | `{ roomId: string }`                                  | Display dołącza jako obserwator|

### Eventy wysyłane przez serwer → klienci

| Event                    | Dane                        | Opis                                        |
|--------------------------|-----------------------------|---------------------------------------------|
| `room:created`           | `roomId: string`            | Pokój utworzony, id pokoju                  |
| `room:joined`            | `RoomState`                 | Dołączono do pokoju, stan pokoju            |
| `room:player-joined`     | `PlayerInfo`                | Nowy gracz dołączył                         |
| `room:player-left`       | `playerId: string`          | Gracz opuścił pokój                         |
| `game:countdown`         | `seconds: number`           | Odliczanie przed grą                        |
| `game:category-vote`     | `CategoryVoteData`          | Rozpoczęcie głosowania na kategorię         |
| `game:category-result`   | `CategoryResultData`        | Wynik głosowania                            |
| `game:power-up-phase`    | `PowerUpPhaseData`          | Czas na wybór mocy                          |
| `game:question`          | `QuestionData`              | Nowe pytanie                                |
| `game:tick`              | `timeLeft: number`          | Ticker timera pytania                       |
| `game:power-up-hit`      | `PowerUpHitData`            | Gracz trafiony mocą                         |
| `game:power-up-self`     | `PowerUpSelfData`           | Gracz aktywuje moc na sobie                 |
| `game:reveal`            | `RevealData`                | Ujawnienie odpowiedzi i punktów             |
| `game:minigame-start`    | `MiniGameData`              | Start mini-gry                              |
| `game:minigame-results`  | `MiniGameResultsData`       | Wyniki mini-gry                             |
| `game:pyramid-intro`     | `PyramidIntroData`          | Intro Piramidy Wiedzy                       |
| `game:pyramid-question`  | `PyramidQuestionData`       | Pytanie w Piramidzie                        |
| `game:pyramid-reveal`    | `PyramidRevealData`         | Ujawnienie w Piramidzie                     |
| `game:finished`          | `GameResult`                | Koniec gry, zwycięzca, ciekawostka          |
| `game:host-comment`      | `comment: string`           | Komentarz prowadzącego "Maks"               |
| `error`                  | `message: string`           | Błąd serwera                                |

---

## Uruchomienie lokalne

### Wymagania

- Node.js 18+
- npm 9+

### Instalacja i uruchomienie

```bash
# Sklonuj repozytorium
git clone <url-repozytorium>
cd wiedza-to-potega

# Zainstaluj wszystkie zależności (root + client + server)
npm run install:all

# Uruchom frontend i backend jednocześnie
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

### Skrypty

| Skrypt               | Opis                                    |
|----------------------|-----------------------------------------|
| `npm run dev`        | Uruchom frontend + backend (dev mode)   |
| `npm run dev:client` | Tylko frontend (Vite dev server)        |
| `npm run dev:server` | Tylko backend (tsx watch)               |
| `npm run build`      | Zbuduj frontend do `client/dist/`       |
| `npm run start`      | Uruchom backend produkcyjnie            |
| `npm run install:all`| Zainstaluj zależności we wszystkich katalogach |
| `npm run test`       | Uruchom testy (server + client)                 |

---

## Deployment

Zalecana konfiguracja: **backend na Railway/Render**, **frontend na Vercel**.

### Krok 1 — Backend na Railway

1. Zaloguj się na [railway.app](https://railway.app)
2. **New Project → Deploy from GitHub Repo** → wybierz repozytorium
3. Ustaw **Root Directory**: `server`
4. Railway automatycznie wykryje `railway.json` i uruchomi `npm run build && npm start`
5. Dodaj zmienną środowiskową:
   - `CLIENT_URL` = URL frontendu na Vercel (uzupełnisz po kroku 2)
6. Skopiuj URL backendu (np. `https://twoja-app.up.railway.app`)

### Krok 1 (alternatywa) — Backend na Render

1. Zaloguj się na [render.com](https://render.com)
2. **New → Web Service** → wybierz repozytorium
3. `render.yaml` automatycznie skonfiguruje usługę
4. Dodaj zmienną środowiskową `CLIENT_URL`

### Krok 2 — Frontend na Vercel

1. Zaloguj się na [vercel.com](https://vercel.com)
2. **Add New Project → Import** → wybierz repozytorium
3. Ustaw:
   - **Root Directory**: `client`
   - **Framework Preset**: Vite
4. Dodaj zmienną środowiskową:
   - `VITE_SERVER_URL` = URL backendu z kroku 1
5. Deploy!

### Krok 3 — Uzupełnij `CLIENT_URL` na Railway/Render

Wróć do ustawień backendu i ustaw `CLIENT_URL` = URL frontendu z Vercel.

---

## Zmienne środowiskowe

### Backend (`server/`)

| Zmienna      | Wymagana | Opis                                                   |
|--------------|----------|--------------------------------------------------------|
| `CLIENT_URL` | Tak (prod) | URL frontendu (np. `https://twoja-app.vercel.app`). Wymagana do poprawnej konfiguracji CORS. Domyślnie dozwolony `localhost:5173`. |
| `PORT`       | Nie      | Port serwera (domyślnie `3001`)                        |

### Frontend (`client/`)

| Zmienna          | Wymagana | Opis                                                     |
|------------------|----------|----------------------------------------------------------|
| `VITE_SERVER_URL`| Tak (prod) | URL backendu (np. `https://twoja-app.up.railway.app`). W trybie dev automatycznie używa `localhost:3001`. |
