export const RouteConfig = {
  KALKULATOR: "/kalkulator",
  PRIVAT_AVTALE: {
    INDEX: "/privat-avtale",
    STEG_1_FORELDRE: "/privat-avtale/steg/foreldre",
    STEG_2_BARN_OG_BIDRAG: "/privat-avtale/steg/barn-og-bidrag",
    STEG_3_AVTALEDETALJER: "/privat-avtale/steg/avtaledetaljer",
    STEG_4_OPPSUMMERING_OG_AVTALE: "/privat-avtale/steg/oppsummering-og-avtale",
    API: "/api/privat-avtale",
  },
  OVERSIKT: {
    INDEX: "/oversikt",
    DOKUMENTER: {
      DETALJER: {
        route: "/oversikt/dokumenter/:journalpostId",
        link: ({ journalpostId }: { journalpostId: string }) =>
          `/oversikt/dokumenter/${journalpostId}`,
      },
      HENT_DOKUMENT: {
        route: "/api/hent-dokument/:journalpostId/:dokumentId",
        link: ({
          journalpostId,
          dokumentId,
        }: {
          journalpostId: string;
          dokumentId: string;
        }) =>
          `/barnebidrag/tjenester/api/hent-dokument/${journalpostId}/${dokumentId}`,
      },
    },
  },
  INTERNAL: {
    IS_ALIVE: "/api/internal/isalive",
    IS_READY: "/api/internal/isready",
  },
  WELL_KNOWN: {
    SECURITY_TXT: "/.well-known/security.txt",
  },
} as const;
