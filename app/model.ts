export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const MONTH_HOURS = [
  744, 672, 744, 720, 744, 720, 744, 744, 720, 744, 720, 744,
] as const;

const LGA_NORMAL_TEMPERATURE_F = [
  34.4, 36.3, 43.1, 53.6, 63.7, 73.4, 79.2, 77.7, 70.8, 59.6, 49.1,
  40.0,
] as const;

const NY_COMMERCIAL_PRICE_CENTS_KWH_2025 = [
  20.4, 20.9, 20.3, 19.4, 19.5, 22.0, 23.1, 22.4, 22.7, 20.8, 19.8,
  20.6,
] as const;

export const GRID_EMISSIONS_LB_PER_MWH_2024 = 537;
export const DEMAND_PROXY_USD_KW_MONTH = 20.83;

export type AssetKind = "cold" | "compute";
export type Horizon = "current" | "2030s" | "2050s";
export type ScenarioKey = "hunts-point" | "queens-dc";
export type CoolingSystem =
  | "ammonia"
  | "co2"
  | "synthetic"
  | "air"
  | "evaporative"
  | "liquid";
export type LocationKey =
  | "hunts-point"
  | "long-island-city"
  | "sunset-park";

export type ScenarioSettings = {
  scenarioKey: ScenarioKey;
  asset: AssetKind;
  location: LocationKey;
  horizon: Horizon;
  size: number;
  utilization: number;
  coldShare: number;
  siteEui: number;
  coolingSystem: CoolingSystem;
  heatingEnabled: boolean;
  batteryEnabled: boolean;
  batteryPowerMw: number;
  batteryHours: number;
  efficiencyGain: number;
  flexibility: number;
  outageHours: number;
};

export type MonthlyResult = {
  month: string;
  climateCostUsd: number;
  mitigatedCostUsd: number;
  climateEnergyMwh: number;
  mitigatedEnergyMwh: number;
};

export type ScenarioResult = {
  title: string;
  subtitle: string;
  annualBaselineEnergyMwh: number;
  annualClimateEnergyMwh: number;
  annualMitigatedEnergyMwh: number;
  annualBaselineCostUsd: number;
  annualClimateCostUsd: number;
  annualMitigatedCostUsd: number;
  climateCostPremiumUsd: number;
  peakClimateMw: number;
  peakMitigatedMw: number;
  batteryPeakValueUsd: number;
  batteryAutonomyCriticalHours: number;
  emissionsBaselineTons: number;
  emissionsMitigatedTons: number;
  resilienceGapHours: number;
  pue: number | null;
  cdd: number;
  cddRange: [number, number];
  seaLevelRangeIn: [number, number];
  heatwaveRange: [number, number];
  monthly: MonthlyResult[];
  decision: string;
  action: string;
};

export type SourceRecord = {
  id: string;
  organization: string;
  title: string;
  url: string;
  usedFor: string;
  provenance: "PUBLIC" | "RESEARCH" | "MODELED" | "HYPOTHETICAL";
};

export const LOCATIONS: Record<
  LocationKey,
  { label: string; coordinates: string; grid: string; note: string }
> = {
  "hunts-point": {
    label: "Hunts Point, Bronx",
    coordinates: "40.812°N · 73.881°W",
    grid: "NYISO Zone J · Con Edison",
    note: "Critical food-distribution district on the Hunts Point peninsula.",
  },
  "long-island-city": {
    label: "Long Island City, Queens",
    coordinates: "40.744°N · 73.948°W",
    grid: "NYISO Zone J · Con Edison",
    note: "Analytical coordinate only; no parcel, permit, or interconnection is implied.",
  },
  "sunset-park": {
    label: "Sunset Park, Brooklyn",
    coordinates: "40.653°N · 74.012°W",
    grid: "NYISO Zone J · Con Edison",
    note: "Industrial waterfront comparison location using the same regional data stack.",
  },
};

export const CLIMATE: Record<
  Horizon,
  {
    label: string;
    cdd: number;
    cddRange: [number, number];
    seaLevelRangeIn: [number, number];
    heatwaveRange: [number, number];
    temperatureDeltaF: number;
  }
> = {
  current: {
    label: "Observed baseline",
    cdd: 1156,
    cddRange: [1156, 1156],
    seaLevelRangeIn: [0, 0],
    heatwaveRange: [2, 2],
    temperatureDeltaF: 0,
  },
  "2030s": {
    label: "NPCC4 2030s",
    cdd: 1614,
    cddRange: [1471, 1757],
    seaLevelRangeIn: [7, 11],
    heatwaveRange: [3, 6],
    temperatureDeltaF: 2.2,
  },
  "2050s": {
    label: "NPCC4 2050s",
    cdd: 1919,
    cddRange: [1713, 2124],
    seaLevelRangeIn: [14, 19],
    heatwaveRange: [5, 8],
    temperatureDeltaF: 3.8,
  },
};

export const HUNTS_POINT_PUBLIC_FACTS = [
  { value: "1.0M ft²", label: "planned facility" },
  { value: "800k+ ft²", label: "refrigerated area" },
  { value: "2.5B lb/yr", label: "produce throughput" },
  { value: "25%", label: "of NYC fresh produce" },
  { value: "1,000", label: "diesel trailers targeted" },
  { value: "$405M", label: "public funding package" },
] as const;

export const DEFAULT_SCENARIOS: Record<ScenarioKey, ScenarioSettings> = {
  "hunts-point": {
    scenarioKey: "hunts-point",
    asset: "cold",
    location: "hunts-point",
    horizon: "2050s",
    size: 1_000_000,
    utilization: 88,
    coldShare: 80,
    siteEui: 100,
    coolingSystem: "co2",
    heatingEnabled: true,
    batteryEnabled: true,
    batteryPowerMw: 8,
    batteryHours: 4,
    efficiencyGain: 9,
    flexibility: 12,
    outageHours: 12,
  },
  "queens-dc": {
    scenarioKey: "queens-dc",
    asset: "compute",
    location: "long-island-city",
    horizon: "2050s",
    size: 24,
    utilization: 85,
    coldShare: 0,
    siteEui: 0,
    coolingSystem: "liquid",
    heatingEnabled: true,
    batteryEnabled: true,
    batteryPowerMw: 12,
    batteryHours: 4,
    efficiencyGain: 4,
    flexibility: 8,
    outageHours: 8,
  },
};

export const SOURCES: SourceRecord[] = [
  {
    id: "hunts-point",
    organization: "NYC Mayor's Office / NYCEDC",
    title: "Hunts Point Produce Market redevelopment",
    url: "https://www.nyc.gov/mayors-office/news/2022/09/mayor-adams-110-million-federal-grant-hunts-point-terminal-produce-market",
    usedFor:
      "Public facility area, refrigerated area, food-system role, and diesel-trailer replacement.",
    provenance: "PUBLIC",
  },
  {
    id: "npcc",
    organization: "NYC Panel on Climate Change",
    title: "NYC Climate Projections: Extreme Events and Sea Level Rise",
    url: "https://data.cityofnewyork.us/Environment/New-York-City-Climate-Projections-Extreme-Events-a/38ps-fnsg/about_data",
    usedFor:
      "Cooling-degree days, heat-wave ranges, and citywide sea-level-rise ranges.",
    provenance: "PUBLIC",
  },
  {
    id: "noaa",
    organization: "NOAA NCEI",
    title: "1991–2020 U.S. Climate Normals",
    url: "https://www.ncei.noaa.gov/products/land-based-station/us-climate-normals",
    usedFor: "LaGuardia monthly normal temperature benchmark.",
    provenance: "PUBLIC",
  },
  {
    id: "nyserda",
    organization: "NYSERDA / U.S. EIA",
    title: "Monthly Average Retail Price of Electricity — Commercial",
    url: "https://www.nyserda.ny.gov/Energy-Prices/Electricity/Monthly-Avg-Electricity-Commercial",
    usedFor: "2025 New York statewide monthly commercial price benchmark.",
    provenance: "PUBLIC",
  },
  {
    id: "coned",
    organization: "Con Edison",
    title: "SC 9 Rate II phase-in delivery charges",
    url: "https://www.coned.com/en/accounts-billing/your-bill/ev-phase-in-rates",
    usedFor:
      "Illustrative large-load delivery-demand value; not a project tariff.",
    provenance: "PUBLIC",
  },
  {
    id: "eia",
    organization: "U.S. Energy Information Administration",
    title: "New York Electricity Profile 2024",
    url: "https://www.eia.gov/electricity/state/NewYork/",
    usedFor: "New York generation emissions benchmark of 537 lb CO₂/MWh.",
    provenance: "PUBLIC",
  },
  {
    id: "lbnl-dc",
    organization: "Lawrence Berkeley National Laboratory",
    title: "2024 United States Data Center Energy Usage Report",
    url: "https://doi.org/10.71468/P1WC7Q",
    usedFor: "Data-center PUE, cooling, water, and demand-growth context.",
    provenance: "PUBLIC",
  },
  {
    id: "lbnl-cold",
    organization: "Lawrence Berkeley National Laboratory",
    title: "Industrial refrigerated warehouse demand-response study",
    url: "https://eta-publications.lbl.gov/sites/default/files/opportunities_for_energy_efficiency_and_automated_demand_response_in_industrial_refrigerated_warehouses_in_ca_lbnl-1991e.pdf",
    usedFor: "Cold-storage controls, pre-cooling, and thermal flexibility.",
    provenance: "RESEARCH",
  },
  {
    id: "geonos-nyiso",
    organization: "GEONOS research workflow",
    title: "NYISO added-load price-response research export",
    url: "https://jangholee.com/publications/",
    usedFor:
      "100 MW minimum research benchmark; not linearly scaled to Project Atlas.",
    provenance: "RESEARCH",
  },
];

const round = (value: number, digits = 0) => {
  const power = 10 ** digits;
  return Math.round(value * power) / power;
};

const sum = (values: number[]) =>
  values.reduce((total, value) => total + value, 0);

const dataCenterPue = (system: CoolingSystem) => {
  if (system === "liquid") return 1.23;
  if (system === "evaporative") return 1.28;
  return 1.35;
};

const coldSystemMultiplier = (system: CoolingSystem) => {
  if (system === "co2") return 0.94;
  if (system === "ammonia") return 0.96;
  return 1;
};

const moneyFromMwh = (energyMwh: number, centsKwh: number) =>
  energyMwh * 1000 * (centsKwh / 100);

const emissionsTons = (energyMwh: number) =>
  (energyMwh * GRID_EMISSIONS_LB_PER_MWH_2024) / 2204.62262;

export function formatEnergy(energyMwh: number) {
  if (energyMwh >= 1_000) return `${round(energyMwh / 1_000, 1)} GWh`;
  return `${round(energyMwh, 0)} MWh`;
}

export function formatMoney(value: number) {
  const absolute = Math.abs(value);
  const sign = value < 0 ? "−" : "";
  if (absolute >= 1_000_000)
    return `${sign}$${round(absolute / 1_000_000, 2)}M`;
  if (absolute >= 1_000)
    return `${sign}$${round(absolute / 1_000, 0)}k`;
  return `${sign}$${round(absolute, 0)}`;
}

export function calculateScenario(
  settings: ScenarioSettings,
): ScenarioResult {
  const climate = CLIMATE[settings.horizon];
  const cddRatio = climate.cdd / CLIMATE.current.cdd;
  const efficiencyFraction = Math.max(
    0,
    Math.min(settings.efficiencyGain / 100, 0.25),
  );
  const flexibilityFraction = Math.max(
    0,
    Math.min(settings.flexibility / 100, 0.3),
  );
  const pue =
    settings.asset === "compute" ? dataCenterPue(settings.coolingSystem) : null;

  const baselineAnnualMwh =
    settings.asset === "compute"
      ? settings.size *
        (settings.utilization / 100) *
        8760 *
        (pue ?? 1.25)
      : (settings.size *
          settings.siteEui *
          coldSystemMultiplier(settings.coolingSystem)) /
        1000;

  const climateMultiplier =
    settings.asset === "compute"
      ? 1 + (((pue ?? 1.25) - 1) / (pue ?? 1.25)) * 0.35 * (cddRatio - 1)
      : 1 + (settings.coldShare / 100) * 0.25 * (cddRatio - 1);

  const climateAnnualMwh = baselineAnnualMwh * climateMultiplier;
  const mitigatedAnnualMwh =
    climateAnnualMwh * (1 - efficiencyFraction - flexibilityFraction * 0.08);

  const baselineWeights = MONTH_HOURS.map((hours, index) => {
    const heat = Math.max(0, LGA_NORMAL_TEMPERATURE_F[index] - 50);
    return settings.asset === "compute"
      ? hours * (1 + heat * 0.0045)
      : hours * (0.78 + heat * 0.012);
  });
  const climateWeights = MONTH_HOURS.map((hours, index) => {
    const heat = Math.max(
      0,
      LGA_NORMAL_TEMPERATURE_F[index] + climate.temperatureDeltaF - 50,
    );
    return settings.asset === "compute"
      ? hours * (1 + heat * 0.0045)
      : hours * (0.78 + heat * 0.012);
  });
  const baselineWeightSum = sum(baselineWeights);
  const climateWeightSum = sum(climateWeights);

  const monthly = MONTHS.map((month, index) => {
    const baselineEnergyMwh =
      baselineAnnualMwh * (baselineWeights[index] / baselineWeightSum);
    const climateEnergyMwh =
      climateAnnualMwh * (climateWeights[index] / climateWeightSum);
    const mitigatedEnergyMwh =
      mitigatedAnnualMwh * (climateWeights[index] / climateWeightSum);
    const price = NY_COMMERCIAL_PRICE_CENTS_KWH_2025[index];
    return {
      month,
      climateCostUsd: moneyFromMwh(climateEnergyMwh, price),
      mitigatedCostUsd: moneyFromMwh(mitigatedEnergyMwh, price),
      climateEnergyMwh,
      mitigatedEnergyMwh,
      baselineCostUsd: moneyFromMwh(baselineEnergyMwh, price),
    };
  });

  const annualBaselineCostUsd = sum(
    monthly.map((row) => row.baselineCostUsd),
  );
  const annualClimateCostUsd = sum(
    monthly.map((row) => row.climateCostUsd),
  );
  const annualMitigatedCostUsd = sum(
    monthly.map((row) => row.mitigatedCostUsd),
  );
  const peakBaselineMw =
    settings.asset === "compute"
      ? settings.size * (pue ?? 1.25)
      : baselineAnnualMwh / (8760 * 0.68);
  const peakClimateMw = peakBaselineMw * (1 + 0.16 * (cddRatio - 1));
  const batteryShaveMw = settings.batteryEnabled
    ? Math.min(settings.batteryPowerMw, peakClimateMw * 0.28)
    : 0;
  const operationalPeakReduction =
    peakClimateMw * (efficiencyFraction * 0.35 + flexibilityFraction * 0.45);
  const peakMitigatedMw = Math.max(
    peakClimateMw - operationalPeakReduction - batteryShaveMw,
    peakClimateMw * 0.55,
  );
  const batteryUsableMwh = settings.batteryEnabled
    ? settings.batteryPowerMw * settings.batteryHours * 0.9
    : 0;
  const criticalFraction = settings.asset === "compute" ? 0.25 : 0.4;
  const batteryAutonomyCriticalHours =
    peakClimateMw > 0
      ? batteryUsableMwh / (peakClimateMw * criticalFraction)
      : 0;
  const resilienceGapHours = Math.max(
    settings.outageHours - batteryAutonomyCriticalHours,
    0,
  );
  const batteryPeakValueUsd =
    batteryShaveMw * 1000 * DEMAND_PROXY_USD_KW_MONTH * 12;
  const isCold = settings.asset === "cold";
  const title = isCold
    ? "Hunts Point Produce Market"
    : `Project Atlas · ${round(settings.size, 0)} MW`;
  const subtitle = isCold
    ? "Real public project benchmark · facility energy is modeled"
    : "Hypothetical Queens data center · real NYC data stack";
  const decision =
    resilienceGapHours > 0.5
      ? `The selected battery bridges ${round(
          batteryAutonomyCriticalHours,
          1,
        )} hours of critical load, leaving a ${round(
          resilienceGapHours,
          1,
        )}-hour gap under the ${settings.outageHours}-hour test.`
      : `The selected battery covers the ${settings.outageHours}-hour critical-load test with ${round(
          batteryAutonomyCriticalHours - settings.outageHours,
          1,
        )} hours of modeled margin.`;
  const action = isCold
    ? "Validate interval load, room temperature, door cycles, product mass, and refrigeration controls before sizing thermal storage or treating savings as bankable."
    : "Validate the IT load profile and interconnection envelope, then compare cooling, workload shifting, and critical-load battery sizing with an engineer and utility.";

  return {
    title,
    subtitle,
    annualBaselineEnergyMwh: baselineAnnualMwh,
    annualClimateEnergyMwh: climateAnnualMwh,
    annualMitigatedEnergyMwh: mitigatedAnnualMwh,
    annualBaselineCostUsd,
    annualClimateCostUsd,
    annualMitigatedCostUsd,
    climateCostPremiumUsd: annualClimateCostUsd - annualBaselineCostUsd,
    peakClimateMw,
    peakMitigatedMw,
    batteryPeakValueUsd,
    batteryAutonomyCriticalHours,
    emissionsBaselineTons: emissionsTons(baselineAnnualMwh),
    emissionsMitigatedTons: emissionsTons(mitigatedAnnualMwh),
    resilienceGapHours,
    pue,
    cdd: climate.cdd,
    cddRange: climate.cddRange,
    seaLevelRangeIn: climate.seaLevelRangeIn,
    heatwaveRange: climate.heatwaveRange,
    monthly,
    decision,
    action,
  };
}
