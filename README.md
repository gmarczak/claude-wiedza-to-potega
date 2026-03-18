# Wiedza to Potęga - 1 na 1

Quiz online dla dwóch graczy inspirowany teleturniejem "Wiedza to Potęga".

## Technologie

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + Socket.io
- **Pytania**: Wbudowane pytania PL + Open Trivia DB API

## Uruchomienie

```bash
# Zainstaluj zależności
npm run install:all

# Uruchom (frontend + backend)
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Jak grać

1. Wejdź na stronę i podaj swoje imię
2. **Stwórz Pokój** - otrzymasz 6-znakowy kod
3. Podaj kod drugiej osobie - ta osoba wybiera **Dołącz do Pokoju**
4. Host rozpoczyna grę gdy obaj gracze są w pokoju
5. Odpowiadajcie na pytania - szybciej = więcej punktów!
6. Po zakończeniu zobaczysz wynik końcowy
