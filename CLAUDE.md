---
name: wiedza-to-potega-tv-mode
description: Implementacja trybu TV dla gry "Wiedza to Potęga". Triggeruj gdy użytkownik prosi o tryb TV, ekran display, podział na telefony graczy i ekran główny, lub QR kod do dołączenia.
---

# Skill: Tryb TV — "Wiedza to Potęga"

## Cel funkcji

Gra toczy się na **dużym ekranie TV/projektora** (laptop podłączony do TV).
Każdy gracz odpowiada na swoim **telefonie**.
Host = jeden z graczy — ma laptop przy TV i telefon w ręku.

```
Laptop (TV)          Telefony graczy
/?mode=display  ←→  /?mode=player  (każdy gracz)
pokazuje grę         pokazuje tylko odpowiedzi
```

---

## Zasada nadrzędna

Logika gry w `server/src/app.ts` **nie zmienia się**.
Serwer nadal emituje te same eventy do room (`io.to(room.id).emit(...)`).
Zmiana polega na tym że **klient subskrybuje te same eventy ale renderuje inny widok** — zależnie od `?mode=`.

---

## Plan implementacji — krok po kroku

### KROK 1 — Routing po URL param (frontend)

W `client/src/App.tsx` dodaj wykrywanie trybu:

```typescript
const urlParams = new URLSearchParams(window.location.search);
const appMode = urlParams.get('mode') as 'display' | 'player' | null;
// null = domyślny tryb (obecne zachowanie)
```

Logika:
- `?mode=display` → renderuj `<DisplayApp />` (nowy komponent — tylko TV)
- `?mode=player` lub brak → renderuj obecny `<App />` (bez zmian)

---

### KROK 2 — DisplayApp.tsx (nowy plik)

Lokalizacja: `client/src/DisplayApp.tsx`

Ten komponent:
- Łączy się z tym samym socketem co gracze
- Dołącza do pokoju jako **obserwator** (nie jako gracz — nie emituje `room:join`)
- Słucha tych samych eventów co gracze (`game:question`, `game:tick`, `game:reveal`, itp.)
- Renderuje **duże ekrany dla TV** (różne komponenty niż te używane przez graczy)

```typescript
// DisplayApp.tsx — szkielet
import { useEffect, useState } from 'react';
import { socket } from './socket';

export default function DisplayApp() {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [phase, setPhase] = useState<string>('waiting');
  // ... reszta stanu

  useEffect(() => {
    // Dołącz do pokoju jako display (bez podawania imienia)
    socket.emit('display:join', { roomId });

    socket.on('game:question', (data) => { /* ... */ });
    socket.on('game:reveal', (data) => { /* ... */ });
    // itd.

    return () => { socket.removeAllListeners(); };
  }, [roomId]);

  if (!roomId) return <DisplayWaitingScreen onJoin={setRoomId} />;
  // renderuj odpowiedni ekran TV zależnie od phase
}
```

---

### KROK 3 — Nowy event na serwerze: display:join

W `server/src/app.ts` dodaj obsługę nowego eventu.
Display NIE jest graczem — dołącza do room jako obserwator.

```typescript
// W ClientToServerEvents (types.ts) dodaj:
'display:join': (data: { roomId: string }) => void;

// W app.ts dodaj handler:
socket.on('display:join', ({ roomId }) => {
  const room = rooms.get(roomId.toUpperCase());
  if (!room) {
    socket.emit('room:error', 'Pokój nie istnieje');
    return;
  }
  // Dołącz socket do room bez dodawania do room.players
  socket.join(roomId.toUpperCase());
  // Wyślij aktualny stan gry (żeby display wiedział gdzie jesteśmy)
  socket.emit('room:joined', getRoomState(room));
});
```

Kluczowe: display nie jest w `room.players`, więc nie dostaje power-upów, nie może głosować, nie liczy się do `allAnswered`.

---

### KROK 4 — Ekrany TV (nowe komponenty)

Lokalizacja: `client/src/display/`

Stwórz osobne komponenty dla widoku TV — większa czcionka, pełny ekran, bez przycisków odpowiedzi:

```
client/src/display/
├── DisplayWaitingScreen.tsx   ← kod pokoju + QR kod do dołączenia
├── DisplayLobbyScreen.tsx     ← lista graczy którzy dołączyli
├── DisplayQuestionScreen.tsx  ← pytanie na cały ekran + timer + avatary
├── DisplayRevealScreen.tsx    ← kto odpowiedział co + punkty
├── DisplayScoreScreen.tsx     ← ranking między rundami
└── DisplayFinishedScreen.tsx  ← ekran końcowy
```

**DisplayWaitingScreen** — najważniejszy:
```tsx
// Pokazuje kod pokoju i QR kod
// URL do QR: `${window.location.origin}/?mode=player&room=XXXXXX`
// Użyj biblioteki `qrcode.react` lub generuj QR przez API:
// `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=URL`
```

**DisplayQuestionScreen** — główny widok podczas gry:
```tsx
// - Pytanie dużą czcionką (center screen)
// - 4 odpowiedzi jako kolorowe bloki (nie klikalne — tylko informacyjne)
// - Timer (pasek + liczba)
// - Avatary graczy na dole z indicatorem "odpowiedział/nie odpowiedział"
// - NIE pokazuj która odpowiedź jest zaznaczona przez gracza (suspens!)
```

---

### KROK 5 — Ekran gracza na telefonie (PlayerView)

Ekran gracza na telefonie powinien być **uproszczony**:
- Tylko 4 duże przyciski A/B/C/D (łatwe do kliknięcia na telefonie)
- Własny wynik + pozycja w rankingu
- Timer
- BEZ pełnej treści pytania (jest na TV — oszczędza ekran telefonu)
  - Opcjonalnie: krótki tekst pytania jako reminder

Możesz to zrobić jako osobny komponent `PlayerQuestionScreen.tsx` lub jako wariant obecnego `QuestionScreen.tsx` z propem `compact={true}`.

---

### KROK 6 — QR kod do dołączenia

W `DisplayWaitingScreen` wygeneruj QR automatycznie:

```tsx
const playerUrl = `${window.location.origin}/?mode=player`;
const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(playerUrl)}`;

// Wyświetl:
// 1. Duży kod pokoju (np. "ABC123") — Orbitron, neonowy żółty
// 2. QR kod jako <img src={qrUrl} />
// 3. Instrukcja: "Zeskanuj QR lub wejdź na [URL] i wpisz kod"
```

Gracz po zeskanowaniu wchodzi na stronę w `?mode=player`, wpisuje imię, avatar i kod pokoju — normalny flow `room:join`.

---

## Zmiany w istniejących plikach

### server/src/types.ts
```typescript
// Dodaj do ClientToServerEvents:
'display:join': (data: { roomId: string }) => void;
```

### client/src/App.tsx
```typescript
// Dodaj na początku:
const urlParams = new URLSearchParams(window.location.search);
const isDisplayMode = urlParams.get('mode') === 'display';

// W return:
if (isDisplayMode) return <DisplayApp />;
// reszta bez zmian
```

### client/src/socket.ts
Bez zmian — ten sam socket używany przez display i player.

---

## Czego NIE zmieniać

- `server/src/app.ts` — logika gry, timery, punkty, power-upy
- `server/src/questions.ts` — pytania
- `client/src/components/` — istniejące ekrany (gracze na telefonach nadal je używają)
- `client/src/types.ts` — typy gry
- `client/src/sounds.ts`

---

## Kolejność implementacji (zalecana)

1. `display:join` event na serwerze (5 min)
2. Detekcja `?mode=` w `App.tsx` (5 min)
3. `DisplayApp.tsx` — szkielet z podłączeniem do socketa (20 min)
4. `DisplayWaitingScreen.tsx` — kod pokoju + QR (20 min)
5. `DisplayLobbyScreen.tsx` — lista graczy (15 min)
6. `DisplayQuestionScreen.tsx` — główny ekran gry (45 min)
7. `DisplayRevealScreen.tsx` — ujawnienie odpowiedzi (20 min)
8. `DisplayFinishedScreen.tsx` — ekran końcowy (15 min)
9. Uproszczony `PlayerQuestionScreen` na telefon (opcjonalnie, 30 min)

---

## Estetyka ekranów TV

Ekrany TV to **duże, czytelne widoki** — oglądane z odległości 2-3m.

- Czcionki minimum `text-4xl` dla pytania, `text-6xl` dla kodu pokoju
- Timer jako duży pasek na górze ekranu
- Avatary graczy z indicatorem ✓/? (odpowiedział / czeka)
- Tło: takie samo jak reszta gry (`#0a0a0f` + neon)
- Brak przycisków odpowiedzi — tylko informacja

---

## Testowanie lokalne

```bash
# Terminal 1
npm run dev

# Okno 1 (symulacja TV):
# http://localhost:5173/?mode=display

# Okno 2 (gracz 1 — host na telefonie):
# http://localhost:5173/

# Okno 3 (gracz 2):
# http://localhost:5173/
```

Na produkcji (Vercel) działa identycznie — URL param `?mode=display` jest obsługiwany przez React Router / window.location na frontendzie.
