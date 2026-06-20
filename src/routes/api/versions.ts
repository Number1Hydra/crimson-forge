import { createFileRoute } from "@tanstack/react-router";
import { FALLBACK_MANIFEST, type VersionManifest } from "@/lib/mc-types";

export const Route = createFileRoute("/api/versions")({
  server: {
    handlers: {
      GET: async () => {
        let body: VersionManifest = FALLBACK_MANIFEST;
        try {
          const res = await fetch(
            "https://launchermeta.mojang.com/mc/game/version_manifest_v2.json",
            { headers: { Accept: "application/json" } },
          );
          if (res.ok) {
            const data = (await res.json()) as VersionManifest;
            if (data?.versions?.length) body = data;
          }
        } catch {
          body = FALLBACK_MANIFEST;
        }
        return new Response(JSON.stringify(body), {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=1800",
          },
        });
      },
    },
  },
});
