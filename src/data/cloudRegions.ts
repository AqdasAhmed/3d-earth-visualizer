import { CloudRegion } from "@/types/index";
import { applySmartSpacing } from "@/utils/smartSpacing";

export const cloudRegions: CloudRegion[] = applySmartSpacing([
  // -------- AWS --------
  {
    name: "AWS Tokyo",
    regionCode: "ap-northeast-1",
    lat: 35.6895,
    lon: 139.6917,
    provider: "AWS",
    serverCount: 4200,
  },
  {
    name: "AWS Singapore",
    regionCode: "ap-southeast-1",
    lat: 1.3521,
    lon: 103.8198,
    provider: "AWS",
    serverCount: 3100,
  },
  {
    name: "AWS London",
    regionCode: "eu-west-2",
    lat: 51.5072,
    lon: -0.1276,
    provider: "AWS",
    serverCount: 2800,
  },

  // -------- GCP --------
  {
    name: "GCP Tokyo",
    regionCode: "asia-northeast1",
    lat: 35.6804,
    lon: 139.769,
    provider: "GCP",
    serverCount: 3900,
  },
  {
    name: "GCP Frankfurt",
    regionCode: "europe-west3",
    lat: 50.1109,
    lon: 8.6821,
    provider: "GCP",
    serverCount: 2600,
  },

  // -------- Azure --------
  {
    name: "Azure Dubai",
    regionCode: "uae-north",
    lat: 25.276987,
    lon: 55.296249,
    provider: "Azure",
    serverCount: 3400,
  },
  {
    name: "Azure Seoul",
    regionCode: "korea-central",
    lat: 37.5665,
    lon: 126.978,
    provider: "Azure",
    serverCount: 3000,
  },
]);
