Oto zaktualizowana dokumentacja. Wprowadziłem zmiany w sekcjach **Przegląd Technologiczny** oraz **Setup**, aby wyraźnie zaznaczyć, że **Bun** jest preferowanym narzędziem w tym projekcie (ze względu na obecność `bun.lock` oraz konfigurację `lint-staged`).

---

# Dokumentacja Deweloperska Projektu "Tapnosh"

Niniejszy dokument zawiera kluczowe informacje dotyczące uruchomienia, architektury oraz procesów deweloperskich projektu inżynierskiego.

## 1. Przegląd Technologiczny (Tech Stack)

Projekt oparty jest na nowoczesnym stacku Reactowym z naciskiem na wydajność, typowanie i internacjonalizację.

**Główne technologie:**

* **Next.js 15 (App Router):** Framework fullstackowy React.
* **TypeScript:** Statyczne typowanie.
* **Bun:** **Preferowany menedżer pakietów i runtime.** Projekt zawiera plik `bun.lock`, co gwarantuje spójność wersji zależności. Jest również wykorzystywany w hookach git (`lint-staged`).
* **NextIntl:** Internacjonalizacja (i18n) i routing językowy.

**Kluczowe biblioteki i narzędzia:**

* **UI & Stylowanie:**
* `Tailwind CSS` + `tailwindcss-animate`: Stylowanie utility-first z animacjami.
* `@radix-ui/*`: Zestaw dostępnych, niestylowanych prymitywów UI.
* `lucide-react`: Biblioteka ikon.
* `motion`: Zaawansowane animacje interfejsu.
* `sonner`: Obsługa powiadomień (toasts).


* **Zarządzanie Stanem i Danymi:**
* `@tanstack/react-query`: Zarządzanie stanem serwerowym, caching.
* `react-hook-form` + `zod`: Obsługa formularzy i walidacja.


* **Autoryzacja:**
* `@clerk/nextjs`: System zarządzania użytkownikami i sesjami.


* **Funkcjonalności Specjalne:**
* `@react-google-maps/api`: Mapy Google.
* `@dnd-kit/*`: Drag & Drop (np. w kreatorze menu).
* `@yudiel/react-qr-scanner`: Obsługa kodów QR.



---

## 2. Setup (Konfiguracja Środowiska)

### Wymagania wstępne

* **Bun** (Kluczowe narzędzie - upewnij się, że masz je zainstalowane).
* Node.js v22 (zgodnie z CI/CD).

### Instrukcja uruchomienia

1. **Klonowanie repozytorium:**
```bash
git clone https://github.com/tapnosh/tapnosh
cd tapnosh

```


2. **Instalacja zależności:**
Zaleca się używanie Buna, aby respektować plik `bun.lock`.
```bash
bun install

```


3. **Integracja z Vercel (Pobranie zmiennych środowiskowych):**
Aby projekt działał poprawnie, musisz pobrać sekrety z chmury Vercel.
* Zaloguj się w terminalu: `vercel login`
* *Email:* `tapnosh@gmail.com`
* *Hasło:* (dostępne u administratora - ****)


* Zainicjuj projekt: `vercel init`
* Pobierz zmienne środowiskowe:
```bash
vercel link
vercel env pull .env.local

```




4. **Konfiguracja Backend:**
* Upewnij się, że w `.env.local` zmienna `NEXT_PUBLIC_API_BASE_URL` wskazuje na adres backendu.
* **Ważne:** Klucze `CLERK_PUBLISHABLE_KEY` i `CLERK_SECRET_KEY` muszą być zgodne z backendem.


5. **Dostępne skrypty:**
Można je uruchamiać za pomocą `bun run <komenda>` (lub `npm run`).

| Komenda | Opis |
| --- | --- |
| `dev` | `next dev --turbopack` - Serwer developerski. |
| `build` | `next build` - Budowanie wersji produkcyjnej. |
| `start` | `next start` - Start wersji produkcyjnej. |
| `format` | Formatowanie kodu (Prettier). |
| `lint` / `lint:fix` | Sprawdzanie i naprawa błędów lintera. |
| `type-check` | `tsc --noEmit` - Sprawdzanie typów TypeScript. |
| `test` | `vitest run` - Uruchomienie testów. |
| `commit` | Commitowanie zgodnie z konwencją (Commitizen). |

**Git Hooks:** Projekt wykorzystuje `husky`. Przed commitem automatycznie uruchamiane jest `bun type-check`, `eslint` oraz `prettier`.

---

## 3. Architektura

Projekt wykorzystuje **Next.js App Router** oraz architekturę opartą na funkcjonalnościach (**Feature-based Architecture**). Kod podzielony jest biznesowo w katalogu `features`.

### Struktura plików

```text
/
├── app/                  # Routing aplikacji (Next.js App Router)
│   ├── [locale]/         # Obsługa języków (NextIntl)
│   │   ├── (root)/       # Główny layout aplikacji
│   │   ├── api/          # Route Handlers (API wewnętrzne)
│   │   └── docs/         # Dokumentacja
├── features/             # LOGIKA BIZNESOWA (Główny katalog)
│   ├── address/          # Logika adresów
│   ├── builder/          # Kreator stron/menu (drag&drop)
│   ├── map/              # Logika mapy
│   ├── menu/             # Zarządzanie menu i produktami
│   ├── navigation/       # Komponenty nawigacyjne
│   ├── qr-code/          # Generatory i skanery QR
│   ├── restaurant/       # Logika wyświetlania restauracji
│   └── ...
├── components/           # Komponenty współdzielone (UI Kit)
├── lib/                  # Biblioteki narzędziowe
├── i18n/                 # Konfiguracja tłumaczeń
└── public/               # Zasoby statyczne

```

### Kluczowe ścieżki w `app`:

* `/my-restaurants/[id]/builder` – Edytor/kreator strony restauracji.
* `/restaurants/[slug]` – Widok restauracji dla klienta.
* `/api/og/*` – Generowanie Open Graph Images.

---

## 4. Autoryzacja i Komunikacja z API

Autoryzacja oparta jest o serwis **Clerk**.

### Middleware (`middleware.ts`)

Pełni trzy funkcje:

1. **I18n:** Przekierowanie do odpowiedniego prefiksu językowego.
2. **Security:** Ochrona tras (np. edycja restauracji) za pomocą `auth.protect()`.
3. **Routing:** Wykluczenie tras API i statycznych z middleware'u językowego.

### Konsumowanie API (`useFetchClient`)

Do komunikacji z backendem używamy hooka `useFetchClient`, który:

* Pobiera token sesji z Clerk.
* Dodaje nagłówek `Authorization: Bearer <token>`.
* Tłumaczy błędy HTTP na obiekt `TranslatedError`.

```typescript
// Przykład użycia
const { fetchClient } = useFetchClient();
const data = await fetchClient<MyType>("/api/resource");

```

---

## 5. Vercel (Platforma hostingowa)

Projekt jest hostowany na platformie **Vercel**.

**Dlaczego Vercel?**

* **Zero Config:** Automatyzacja deploymentu Next.js.
* **Preview Deployments:** Podgląd zmian dla każdego Pull Requesta.
* **Środowisko:** Idealna integracja z `next/image`, `next/font` i Edge Network.

**Informacje:**

* Korzystamy z planu Hobby (konto osobiste: `tapnosh@gmail.com`).
* Logi i analityka dostępne są w panelu dashboardu Vercel.
* **Deployment:** Następuje automatycznie po pushu do `main` (produkcja) lub innego brancha (preview).

---

## 6. CI/CD (GitHub Actions)

Proces CI jest zdefiniowany w `.github/workflows`.

**Zasada działania:**

1. Uruchamia się przy `push` do `main` oraz `pull_request`.
2. Ustawia środowisko Node.js v22.
3. Instaluje zależności i próbuje zbudować projekt (`npm run build`).
4. Jeśli build się nie powiedzie, zmiany nie mogą zostać zmergowane.

> Uwaga: Mimo że lokalnie preferujemy Buna, obecna konfiguracja CI w GitHub Actions korzysta z `npm` do instalacji i budowania projektu w środowisku runnera.