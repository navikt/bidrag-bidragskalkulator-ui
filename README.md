# Bidragskalkulator

Bidragskalkulatoren er et verktøy som hjelper deg å beregne barnebidrag.

## Teknologi

- [React](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Navikt DS](https://aksel.nav.no)
- [Tailwind CSS](https://tailwindcss.com/)

## Lokal utvikling

Installer avhengigheter:
```bash
npm install
```

Kjør lokalt:
```bash
npm run dev
# Kjører på http://localhost:5173
```

Bygg et docker-image (husk å ha NODE_AUTH_TOKEN satt som miljøvariabel):
```bash
docker build --secret id=NODE_AUTH_TOKEN . -t bidragskalkulator
```

Kjør docker-containeren:
```bash
docker run -p 3000:3000 bidragskalkulator
```
