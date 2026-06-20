export interface MinecraftVersion {
  id: string;
  type: "release" | "snapshot" | "old_beta" | "old_alpha";
  releaseTime: string;
  url: string;
}

export interface VersionManifest {
  latest: { release: string; snapshot: string };
  versions: MinecraftVersion[];
}

export const FALLBACK_MANIFEST: VersionManifest = {
  latest: { release: "1.21.5", snapshot: "25w14a" },
  versions: [
    { id: "1.21.5", type: "release", releaseTime: "2025-03-25T00:00:00+00:00", url: "" },
    { id: "1.21.4", type: "release", releaseTime: "2024-12-03T00:00:00+00:00", url: "" },
    { id: "1.21.1", type: "release", releaseTime: "2024-08-08T00:00:00+00:00", url: "" },
    { id: "1.20.6", type: "release", releaseTime: "2024-04-29T00:00:00+00:00", url: "" },
    { id: "1.20.1", type: "release", releaseTime: "2023-06-12T00:00:00+00:00", url: "" },
    { id: "1.19.4", type: "release", releaseTime: "2023-03-14T00:00:00+00:00", url: "" },
    { id: "1.18.2", type: "release", releaseTime: "2022-02-28T00:00:00+00:00", url: "" },
    { id: "1.16.5", type: "release", releaseTime: "2021-01-15T00:00:00+00:00", url: "" },
    { id: "1.12.2", type: "release", releaseTime: "2017-09-18T00:00:00+00:00", url: "" },
    { id: "1.8.9", type: "release", releaseTime: "2015-12-09T00:00:00+00:00", url: "" },
    { id: "1.7.10", type: "release", releaseTime: "2014-06-26T00:00:00+00:00", url: "" },
    { id: "b1.7.3", type: "old_beta", releaseTime: "2011-07-08T00:00:00+00:00", url: "" },
    { id: "a1.2.6", type: "old_alpha", releaseTime: "2010-12-02T00:00:00+00:00", url: "" },
  ],
};
