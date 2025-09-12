export const RouteConfig = {
  KALKULATOR: "/kalkulator",
  PRIVAT_AVTALE: {
    INDEX: "/privat-avtale",
    STEG_1_OM_DEG: "/privat-avtale/steg/om-deg",
    STEG_2_OM_DEN_ANDRE_FORELDEREN: "/privat-avtale/steg/foreldre",
    STEG_3_BARN_OG_BIDRAG: "/privat-avtale/steg/barn-og-bidrag",
    STEG_4_AVTALEDETALJER: "/privat-avtale/steg/avtaledetaljer",
    STEG_5_ANDRE_BESTEMMELSER: "/privat-avtale/steg/andre-bestemmelser",
    STEG_6_VEDLEGG: "/privat-avtale/steg/vedlegg",
    STEG_7_OPPSUMMERING_OG_AVTALE: "/privat-avtale/steg/oppsummering-og-avtale",
    STEG_7_LAST_NED: "/privat-avtale/steg/last-ned",
    FERDIG: "/privat-avtale/ferdig",
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
