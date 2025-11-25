export interface Exchange {
  lat: number;
  lon: number;
  name: string;
  provider: "AWS" | "GCP" | "AZURE" | string;
}

export interface CloudRegion {
  lat: number;
  lon: number;
  name: string;
  provider: string;
  regionCode: string;
  serverCount: number;
}
