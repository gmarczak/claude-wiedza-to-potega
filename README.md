# Wiedza to Potęga

Quiz online dla 2-6 graczy inspirowany teleturniejem "Wiedza to Potęga" (PS4 PlayLink). Graj ze znajomymi w czasie rzeczywistym — twórz pokój, udostępnij kod i rywalizujcie o miano mistrza wiedzy!

## Screenshoty

### Ekran główny
![Ekran główny](docs/screenshots/01-home.png)
Wybierz jednego z 12 awatarów, wpisz imię i stwórz pokój lub dołącz do istniejącego.

### Poczekalnia
![Poczekalnia](docs/screenshots/02-lobby.png)
Poczekaj na graczy (2-6 osób) i rozpocznij grę jako host.

### Głosowanie na kategorię
![Głosowanie na kategorię](docs/screenshots/03-category-vote.png)
Wszyscy gracze głosują na kategorię pytań — lub użyj przełamania, by wymusić swoją kategorię!

### Wybór mocy
![Wybór mocy](docs/screenshots/04-power-up.png)
Przed każdą rundą wybierz moc (zagrywkę), która utrudni grę przeciwnikom.

### Pytanie
![Pytanie](docs/screenshots/05-question.png)
Odpowiadaj szybko — im szybciej, tym więcej punktów bonus!

### Ujawnienie odpowiedzi
![Ujawnienie odpowiedzi](docs/screenshots/06-reveal.png)
Po każdym pytaniu zobaczysz, kto odpowiedział poprawnie i ile punktów zdobył.

### Mini-gra
![Mini-gra](docs/screenshots/07-minigame.png)
Między rundami zmierz się w mini-grze — łączenie par lub sortowanie elementów.

### Piramida Wiedzy
![Piramida Wiedzy](docs/screenshots/08-pyramid.png)
Wielki finał! Wspinaj się na szczyt piramidy, odpowiadając na pytania.

### Ekran końcowy
![Ekran końcowy](docs/screenshots/09-finished.png)
Zwycięzca otrzymuje Legendarny Zwój Wiedzy z ciekawostką!

## Funkcje

- **2-6 graczy** w czasie rzeczywistym przez Socket.io
- Głosowanie na kategorię pytań (z opcją przełamania)
- 6 zagrywek (power-upów): Szlam, Dziobak, Lód, Bomba + Podwójne Punkty, 50/50
- Punkty za szybkość odpowiedzi (do +10 bonus)
- Mini-gry między rundami (łączenie par, sortowanie)
- Piramida Wiedzy — wielki finał
- 12 unikalnych awatarów
- Komentarze prowadzącego "Maks"
- Pytania z obrazkami
- Wbudowane pytania PL + Open Trivia DB API
- Tryb TV/Display (`?mode=display`) — 3D studio z postaciami na dużym ekranie (Three.js)
- Format gry: 3x pytania + minigra + 3x pytania + minigra + 3x pytania + Piramida Wiedzy

## Technologie

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS + Three.js (React Three Fiber)
- **Backend**: Node.js + Express + Socket.io
- **Pytania**: Wbudowane pytania PL + Open Trivia DB API
- **Testy**: Vitest + React Testing Library + GitHub Actions CI

## Uruchomienie lokalne

```bash
# Zainstaluj zależności
npm run install:all

# Uruchom (frontend + backend)
npm run dev

# Uruchom testy
npm run test
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Deployment (Vercel + Railway)

### Backend — Railway

1. Zaloguj się na [railway.app](https://railway.app)
2. **New Project → Deploy from GitHub Repo** — wybierz to repo
3. W ustawieniach serwisu:
   - **Root Directory**: `server`
   - Railway automatycznie wykryje `railway.json` i zbuduje serwer
4. Dodaj zmienną środowiskową:
   - `CLIENT_URL` = URL twojej aplikacji na Vercel (np. `https://twoja-app.vercel.app`)
5. Skopiuj URL serwisu Railway (np. `https://twoja-app-production.up.railway.app`)

### Frontend — Vercel

1. Zaloguj się na [vercel.com](https://vercel.com)
2. **Add New Project → Import** — wybierz to repo
3. W ustawieniach:
   - **Root Directory**: `client`
   - **Framework Preset**: Vite
4. Dodaj zmienną środowiskową:
   - `VITE_SERVER_URL` = URL twojego serwisu Railway (np. `https://twoja-app-production.up.railway.app`)
5. Deploy!

### Kolejność
1. Najpierw deploy **Railway** (backend) — żeby mieć URL serwera
2. Potem deploy **Vercel** (frontend) — z ustawionym `VITE_SERVER_URL`
3. Wróć do Railway i ustaw `CLIENT_URL` na URL z Vercel

## Jak grać

1. Wejdź na stronę, wybierz awatara i podaj swoje imię
2. **Stwórz Pokój** — otrzymasz 6-znakowy kod
3. Podaj kod znajomym — wybierają **Dołącz do Pokoju** i wpisują kod
4. Host rozpoczyna grę gdy co najmniej 2 graczy jest w pokoju (max 6)
5. Głosujecie na kategorię → wybieracie zagrywki → odpowiadacie na pytania
6. Co 3 pytania — mini-gra!
7. Na koniec — Piramida Wiedzy: wielki finał o zwycięstwo
8. Zwycięzca otrzymuje Legendarny Zwój Wiedzy!
