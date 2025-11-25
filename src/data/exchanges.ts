import { applySmartSpacing } from "@/utils/smartSpacing";
import { Exchange } from "@/types/index";

export const exchanges: Exchange[] = applySmartSpacing([  // Asia
  { 
    name: "Binance Tokyo", 
    lat: 35.6762, 
    lon: 139.6503, 
    provider: "AWS" },
  { 
    name: "OKX Hong Kong", 
    lat: 22.3193, 
    lon: 114.1694, 
    provider: "GCP" 
  },
  // Middle East
  { 
    name: "Bybit Dubai", 
    lat: 25.2048, 
    lon: 55.2708, 
    provider: "Azure" 
  },
  // Europe
  { 
    name: "Deribit Amsterdam", 
    lat: 52.3676, 
    lon: 4.9041, 
    provider: "AWS" 
  },
  { 
    name: "Bitstamp London", 
    lat: 51.5072, 
    lon: -0.1276, 
    provider: "GCP" 
  },
  // North America
  { 
    name: "Coinbase New York", 
    lat: 40.7128, 
    lon: -74.006, 
    provider: "AWS" 
  },
  {
    name: "Kraken San Francisco",
    lat: 37.7749,
    lon: -122.4194,
    provider: "Azure",
  },
  // South America
  {
    name: "Mercado Bitcoin São Paulo",
    lat: -23.5505,
    lon: -46.6333,
    provider: "AWS",
  },
  // Australia
  {
    name: "Independent Reserve Sydney",
    lat: -33.8688,
    lon: 151.2093,
    provider: "GCP",
  },
]);
