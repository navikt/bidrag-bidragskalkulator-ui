export const RouteConfig = {
  KALKULATOR: "/kalkulator",
  PRIVAT_AVTALE: {
    INDEX: "/privat-avtale",
    STEG_1_FORELDRE: "/privat-avtale/steg/foreldre",
    STEG_2_BARN_OG_BIDRAG: "/privat-avtale/steg/barn-og-bidrag",
    STEG_3_AVTALEDETALJER: "/privat-avtale/steg/avtaledetaljer",
    STEG_4_ANDRE_BESTEMMELSER: "/privat-avtale/steg/andre-bestemmelser",
    STEG_5_VEDLEGG: "/privat-avtale/steg/vedlegg",
    STEG_6_OPPSUMMERING_OG_AVTALE: "/privat-avtale/steg/oppsummering-og-avtale",
    STEG_6_LAST_NED: "/privat-avtale/steg/last-ned",
    FERDIG: "/privat-avtale/steg/ferdig",
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
