# dev-day-7
A11y playground – **WCAG 2.2 w praktyce**

Statyczna strona (HTML + CSS + odrobina JS, bez buildu) prezentująca standard WCAG 2.2:
teoria posortowana wg istotności, żywe przykłady „źle / dobrze”, checklista i narzędzia.

## Uruchomienie

```sh
npx serve .        # lub: python3 -m http.server 8000
```

Następnie otwórz `http://localhost:3000` (lub `:8000`).

## Struktura

- `index.html` – wstęp, POUR, poziomy zgodności
- `teoria.html` – 14 konceptów od najważniejszych
- `przyklady/` – formularze, klawiatura, komponenty, media, kolory, nowości 2.2
- `checklista.html` – lista kontrolna (localStorage)
- `narzedzia.html` – narzędzia i źródła
- `assets/` – CSS, JS, obrazy, napisy

## Testy

```sh
python3 -m http.server 8765 &
npx pa11y --runner axe --hide-elements ".demo--bad" http://localhost:8765/przyklady/komponenty.html
```

`--hide-elements ".demo--bad"` pomija **celowo** niedostępne przykłady. Zgłoszenia kontrastu dla znaków `←`, `↑` i `▾` axe oznacza jako „needs review” (nie potrafi ocenić symboli) – kontrast tych elementów jest poprawny.
