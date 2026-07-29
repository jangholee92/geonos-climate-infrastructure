"use client";

import { useMemo, useState } from "react";
import {
  CLIMATE,
  DEFAULT_SCENARIOS,
  LOCATIONS,
  calculateScenario,
  formatEnergy,
  formatMoney,
  type CoolingSystem,
  type Horizon,
  type LocationKey,
  type ScenarioKey,
  type ScenarioSettings,
} from "./model";

const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });
const integer = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

function RangeControl({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (value: number) => void;
}) {
  const progress = ((value - min) / (max - min)) * 100;
  return (
    <label className="app-range">
      <span>
        <b>{label}</b>
        <strong>{display}</strong>
      </span>
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ "--progress": `${progress}%` } as React.CSSProperties}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="app-toggle">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <i aria-hidden="true"><b /></i>
    </label>
  );
}

function Brand() {
  return (
    <div className="app-brand">
      <img
        className="app-brand-logo"
        src="./LOGO.png"
        alt="GEONOS"
        width="499"
        height="198"
      />
    </div>
  );
}

function FacilityPlan({ settings }: { settings: ScenarioSettings }) {
  const isCold = settings.asset === "cold";
  const hallCount = settings.size <= 20 ? 2 : settings.size <= 40 ? 4 : 6;
  const hallColumns = hallCount === 6 ? 3 : 2;
  const chilledShare = Math.max(35, Math.min(72, settings.coldShare - 18));
  const frozenShare = 100 - chilledShare;

  return (
    <section className={`app-blueprint app-blueprint--${settings.asset}`}>
      <div className="app-blueprint-grid" aria-hidden="true" />
      <div className="app-plan-meta">
        <span>2D OPERATING PLAN</span>
        <small>{isCold ? `${integer.format(settings.size)} FT²` : `${settings.size} MW IT`}</small>
      </div>
      <div className="app-plan-north" aria-hidden="true">N</div>

      <div className="app-site-boundary">
        {isCold ? (
          <div
            className="app-cold-layout"
            style={{
              "--chilled": `${chilledShare}fr`,
              "--frozen": `${frozenShare}fr`,
            } as React.CSSProperties}
          >
            <div className="app-zone app-zone--dock">
              <small>01 / INBOUND</small>
              <strong>Loading docks</strong>
              <span>door-cycle sensing</span>
            </div>
            <div className="app-cold-core">
              <div className="app-zone app-zone--chilled">
                <small>02 / 34–40°F</small>
                <strong>Chilled storage</strong>
                <span>{settings.coldShare}% refrigerated program</span>
              </div>
              <div className="app-zone app-zone--frozen">
                <small>03 / −10–0°F</small>
                <strong>Frozen storage</strong>
                <span>thermal buffer zone</span>
              </div>
            </div>
            <div className="app-zone app-zone--staging">
              <small>04 / FLEX</small>
              <strong>Staging</strong>
              <span>{settings.flexibility}% flexible load</span>
            </div>
            <div className="app-utility-stack">
              <div className="app-zone app-zone--plant">
                <small>R / PLANT</small>
                <strong>{settings.coolingSystem.toUpperCase()}</strong>
                <span>refrigeration</span>
              </div>
              <div className={`app-heat-node ${settings.heatingEnabled ? "is-on" : ""}`}>
                <small>HEAT RECLAIM</small>
                <strong>{settings.heatingEnabled ? "ACTIVE" : "OFF"}</strong>
              </div>
            </div>
          </div>
        ) : (
          <div className="app-compute-layout">
            <div
              className="app-data-halls"
              style={{ gridTemplateColumns: `repeat(${hallColumns}, 1fr)` }}
            >
              {Array.from({ length: hallCount }, (_, index) => (
                <div className="app-zone app-zone--hall" key={index}>
                  <small>DH{String(index + 1).padStart(2, "0")}</small>
                  <strong>{number.format(settings.size / hallCount)} MW</strong>
                  <span>IT design block</span>
                  <i aria-hidden="true" />
                </div>
              ))}
            </div>
            <div className="app-compute-utilities">
              <div className="app-zone app-zone--cooling">
                <small>C / THERMAL</small>
                <strong>{settings.coolingSystem}</strong>
                <span>{settings.utilization}% utilization</span>
              </div>
              <div className="app-zone app-zone--ups">
                <small>U / POWER</small>
                <strong>UPS + switchgear</strong>
                <span>critical-load sequence</span>
              </div>
              <div className={`app-heat-node ${settings.heatingEnabled ? "is-on" : ""}`}>
                <small>HEAT REUSE</small>
                <strong>{settings.heatingEnabled ? "ACTIVE" : "OFF"}</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={`app-battery-node ${settings.batteryEnabled ? "is-on" : ""}`}>
        <span aria-hidden="true"><i /><i /><i /></span>
        <div>
          <small>BESS</small>
          <strong>
            {settings.batteryEnabled
              ? `${settings.batteryPowerMw} MW · ${settings.batteryHours} h`
              : "NOT SELECTED"}
          </strong>
        </div>
      </div>
      <div className="app-grid-node">
        <span aria-hidden="true">⌁</span>
        <small>GRID</small>
      </div>
      <div className="app-power-line" aria-hidden="true" />
      <div className="app-plan-scale">0&nbsp;&nbsp;&nbsp;50&nbsp;&nbsp;&nbsp;100 m</div>
    </section>
  );
}

function MonthlyStrip({
  monthly,
}: {
  monthly: ReturnType<typeof calculateScenario>["monthly"];
}) {
  const max = Math.max(...monthly.map((row) => row.climateCostUsd));
  return (
    <section className="app-monthly">
      <div className="app-monthly-title">
        <span>MONTHLY OPERATING COST</span>
        <small>climate case / selected package</small>
      </div>
      <div className="app-month-bars" aria-label="Monthly cost comparison">
        {monthly.map((row) => (
          <div className="app-month" key={row.month}>
            <div>
              <i
                className="is-climate"
                style={{ height: `${(row.climateCostUsd / max) * 100}%` }}
                title={`${row.month}: ${formatMoney(row.climateCostUsd)}`}
              />
              <i
                className="is-selected"
                style={{ height: `${(row.mitigatedCostUsd / max) * 100}%` }}
                title={`${row.month}: ${formatMoney(row.mitigatedCostUsd)}`}
              />
            </div>
            <small>{row.month.slice(0, 1)}</small>
          </div>
        ))}
      </div>
    </section>
  );
}

function ScenarioControls({
  settings,
  update,
  reset,
}: {
  settings: ScenarioSettings;
  update: <K extends keyof ScenarioSettings>(
    key: K,
    value: ScenarioSettings[K],
  ) => void;
  reset: () => void;
}) {
  const isCold = settings.asset === "cold";
  return (
    <aside className="app-controls">
      <div className="app-controls-head">
        <div>
          <small>SCENARIO CONTROLS</small>
          <strong>{isCold ? "Case sensitivity" : "Configure new build"}</strong>
        </div>
        <button onClick={reset}>RESET</button>
      </div>

      <div className="app-control-section">
        <span className="app-control-title">01 · SITE + CLIMATE</span>
        {!isCold && (
          <label className="app-select">
            <span>Location</span>
            <select
              value={settings.location}
              onChange={(event) => update("location", event.target.value as LocationKey)}
            >
              {Object.entries(LOCATIONS).map(([key, item]) => (
                <option value={key} key={key}>{item.label}</option>
              ))}
            </select>
          </label>
        )}
        <div className="app-segments" aria-label="Climate horizon">
          {(["current", "2030s", "2050s"] as Horizon[]).map((horizon) => (
            <button
              key={horizon}
              className={settings.horizon === horizon ? "active" : ""}
              onClick={() => update("horizon", horizon)}
            >
              {horizon === "current" ? "Today" : horizon}
            </button>
          ))}
        </div>
        <div className="app-climate-inline">
          <span><small>CDD</small><strong>{integer.format(CLIMATE[settings.horizon].cdd)}</strong></span>
          <span><small>HEAT WAVES</small><strong>{CLIMATE[settings.horizon].heatwaveRange.join("–")}</strong></span>
          <span><small>SEA LEVEL</small><strong>{CLIMATE[settings.horizon].seaLevelRangeIn.join("–")} in</strong></span>
        </div>
      </div>

      <div className="app-control-section">
        <span className="app-control-title">02 · FACILITY</span>
        {isCold ? (
          <>
            <RangeControl
              label="Gross floor area"
              value={settings.size}
              min={250_000}
              max={1_500_000}
              step={50_000}
              display={`${integer.format(settings.size)} ft²`}
              onChange={(value) => update("size", value)}
            />
            <RangeControl
              label="Refrigerated share"
              value={settings.coldShare}
              min={40}
              max={95}
              step={5}
              display={`${settings.coldShare}%`}
              onChange={(value) => update("coldShare", value)}
            />
            <RangeControl
              label="Energy intensity"
              value={settings.siteEui}
              min={60}
              max={160}
              step={5}
              display={`${settings.siteEui} kWh/ft²`}
              onChange={(value) => update("siteEui", value)}
            />
          </>
        ) : (
          <>
            <RangeControl
              label="IT design capacity"
              value={settings.size}
              min={6}
              max={80}
              step={2}
              display={`${settings.size} MW`}
              onChange={(value) => update("size", value)}
            />
            <RangeControl
              label="IT utilization"
              value={settings.utilization}
              min={50}
              max={100}
              step={5}
              display={`${settings.utilization}%`}
              onChange={(value) => update("utilization", value)}
            />
          </>
        )}
        <label className="app-select">
          <span>{isCold ? "Refrigeration" : "Cooling system"}</span>
          <select
            value={settings.coolingSystem}
            onChange={(event) =>
              update("coolingSystem", event.target.value as CoolingSystem)
            }
          >
            {isCold ? (
              <>
                <option value="co2">Transcritical CO₂</option>
                <option value="ammonia">Ammonia</option>
                <option value="synthetic">Synthetic refrigerant</option>
              </>
            ) : (
              <>
                <option value="liquid">Direct liquid</option>
                <option value="evaporative">Evaporative</option>
                <option value="air">Air cooled</option>
              </>
            )}
          </select>
        </label>
        <Toggle
          label={isCold ? "Heat reclaim" : "Heat reuse"}
          checked={settings.heatingEnabled}
          onChange={(value) => update("heatingEnabled", value)}
        />
      </div>

      <div className="app-control-section app-control-section--last">
        <span className="app-control-title">03 · RESPONSE PACKAGE</span>
        <RangeControl
          label="Efficiency package"
          value={settings.efficiencyGain}
          min={0}
          max={20}
          step={1}
          display={`${settings.efficiencyGain}%`}
          onChange={(value) => update("efficiencyGain", value)}
        />
        <RangeControl
          label="Flexible load"
          value={settings.flexibility}
          min={0}
          max={25}
          step={1}
          display={`${settings.flexibility}%`}
          onChange={(value) => update("flexibility", value)}
        />
        <Toggle
          label="Battery energy storage"
          checked={settings.batteryEnabled}
          onChange={(value) => update("batteryEnabled", value)}
        />
        {settings.batteryEnabled && (
          <div className="app-dual-range">
            <RangeControl
              label="Power"
              value={settings.batteryPowerMw}
              min={2}
              max={30}
              step={2}
              display={`${settings.batteryPowerMw} MW`}
              onChange={(value) => update("batteryPowerMw", value)}
            />
            <RangeControl
              label="Duration"
              value={settings.batteryHours}
              min={1}
              max={12}
              step={1}
              display={`${settings.batteryHours} h`}
              onChange={(value) => update("batteryHours", value)}
            />
          </div>
        )}
        <RangeControl
          label="Outage stress test"
          value={settings.outageHours}
          min={2}
          max={24}
          step={2}
          display={`${settings.outageHours} h`}
          onChange={(value) => update("outageHours", value)}
        />
      </div>
    </aside>
  );
}

function DecisionSupport({
  settings,
  result,
}: {
  settings: ScenarioSettings;
  result: ReturnType<typeof calculateScenario>;
}) {
  const pass = result.resilienceGapHours <= 0.5;
  const annualAvoided =
    result.annualClimateCostUsd - result.annualMitigatedCostUsd;
  const peakReduction = result.peakClimateMw - result.peakMitigatedMw;
  const emissionsReduction =
    result.emissionsBaselineTons - result.emissionsMitigatedTons;
  const emissionsImproves = emissionsReduction >= 0;

  return (
    <aside className="app-decision">
      <div className="app-decision-head">
        <span>DECISION SUPPORT</span>
        <small>LIVE OUTPUT</small>
      </div>
      <div className={`app-decision-status ${pass ? "is-pass" : "is-gap"}`}>
        <span>{pass ? "PASS" : "GAP"}</span>
        <div>
          <small>CONTINUITY TEST</small>
          <strong>{pass ? "Selected package covers the test." : "Additional backup is required."}</strong>
        </div>
      </div>
      <p className="app-decision-copy">{result.decision}</p>

      <div className="app-scoreboard">
        <div>
          <small>ANNUAL COST</small>
          <strong>{formatMoney(result.annualMitigatedCostUsd)}</strong>
          <span>{formatMoney(annualAvoided)} below climate case</span>
        </div>
        <div>
          <small>PEAK GRID DRAW</small>
          <strong>{number.format(result.peakMitigatedMw)} MW</strong>
          <span>{number.format(peakReduction)} MW reduction</span>
        </div>
        <div>
          <small>CRITICAL BRIDGE</small>
          <strong>{number.format(result.batteryAutonomyCriticalHours)} h</strong>
          <span>{number.format(result.resilienceGapHours)} h remaining gap</span>
        </div>
        <div>
          <small>EMISSIONS VS BASELINE</small>
          <strong>{emissionsImproves ? "−" : "+"}{integer.format(Math.abs(emissionsReduction))} t</strong>
          <span>{emissionsImproves ? "modeled annual reduction" : "modeled annual increase"}</span>
        </div>
      </div>

      <div className="app-recommendation">
        <small>RECOMMENDED NEXT ACTION</small>
        <p>{result.action}</p>
      </div>

      <div className="app-decision-basis">
        <span>{settings.horizon === "current" ? "TODAY" : settings.horizon}</span>
        <i>·</i>
        <span>{settings.batteryEnabled ? `${settings.batteryPowerMw} MW BESS` : "NO BESS"}</span>
        <i>·</i>
        <span>{settings.outageHours} H TEST</span>
      </div>
    </aside>
  );
}

export default function Home() {
  const [settings, setSettings] = useState<ScenarioSettings>({
    ...DEFAULT_SCENARIOS["hunts-point"],
  });

  const result = useMemo(() => calculateScenario(settings), [settings]);
  const isCold = settings.asset === "cold";
  const location = LOCATIONS[settings.location];

  const update = <K extends keyof ScenarioSettings>(
    key: K,
    value: ScenarioSettings[K],
  ) => setSettings((current) => ({ ...current, [key]: value }));

  const chooseScenario = (key: ScenarioKey) => {
    setSettings({ ...DEFAULT_SCENARIOS[key] });
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <Brand />
        <nav className="app-mode-switch" aria-label="Analysis mode">
          <button
            className={settings.scenarioKey === "hunts-point" ? "active" : ""}
            onClick={() => chooseScenario("hunts-point")}
          >
            <small>REAL-WORLD EXAMPLE</small>
            <strong>Hunts Point</strong>
          </button>
          <button
            className={settings.scenarioKey === "queens-dc" ? "active" : ""}
            onClick={() => chooseScenario("queens-dc")}
          >
            <small>HYPOTHETICAL TEST</small>
            <strong>New Data Center</strong>
          </button>
        </nav>
        <div className="app-header-actions">
          <a
            href="./reports/GEONOS_Infrastructure_Full_Report_EN.pdf"
            target="_blank"
            rel="noreferrer"
          >
            METHOD
          </a>
          <button onClick={() => window.print()}>
            PRINT DECISION <span>↗</span>
          </button>
        </div>
      </header>

      <section className="app-casebar">
        <div>
          <span className={isCold ? "is-real" : "is-hypothetical"}>
            {isCold ? "PUBLIC CASE + MODELED OPERATIONS" : "HYPOTHETICAL + MODELED"}
          </span>
          <h1>{result.title}</h1>
          <p>{location.label} · {location.coordinates}</p>
        </div>
        {isCold ? (
          <div className="app-evidence-anchor">
            <span><strong>1.0M ft²</strong><small>planned facility</small></span>
            <span><strong>800k+ ft²</strong><small>refrigerated</small></span>
            <span><strong>2.5B lb/yr</strong><small>produce throughput</small></span>
            <span><strong>$405M</strong><small>public funding</small></span>
          </div>
        ) : (
          <div className="app-evidence-anchor">
            <span><strong>{settings.size} MW</strong><small>IT design</small></span>
            <span><strong>{settings.utilization}%</strong><small>utilization</small></span>
            <span><strong>{result.pue?.toFixed(2)}</strong><small>modeled PUE</small></span>
            <span><strong>{settings.location === "long-island-city" ? "Queens" : location.label.split(",")[0]}</strong><small>test location</small></span>
          </div>
        )}
      </section>

      <section className="app-workspace">
        <ScenarioControls
          settings={settings}
          update={update}
          reset={() => chooseScenario(settings.scenarioKey)}
        />

        <div className="app-center">
          <FacilityPlan settings={settings} />
          <div className="app-kpis">
            <div>
              <small>CLIMATE ENERGY</small>
              <strong>{formatEnergy(result.annualClimateEnergyMwh)}</strong>
              <span>{formatEnergy(result.annualMitigatedEnergyMwh)} selected</span>
            </div>
            <div>
              <small>CLIMATE PREMIUM</small>
              <strong>{formatMoney(result.climateCostPremiumUsd)}</strong>
              <span>annual modeled exposure</span>
            </div>
            <div>
              <small>DESIGN PEAK</small>
              <strong>{number.format(result.peakClimateMw)} MW</strong>
              <span>{number.format(result.peakMitigatedMw)} MW selected</span>
            </div>
          </div>
        </div>

        <DecisionSupport settings={settings} result={result} />
      </section>

      <section className="app-lower">
        <MonthlyStrip monthly={result.monthly} />
        <div className="app-boundary">
          <span>MODEL BOUNDARY</span>
          <p>
            Planning estimates—not measured performance or a savings guarantee.
            Bankability requires interval load, equipment curves, project tariff,
            capex, and engineering validation.
          </p>
        </div>
      </section>

      <footer className="app-footer">
        <span>Climate: NPCC4 · Energy: NYSERDA / EIA · Public case: NYCEDC</span>
        <span>Measure the planet. Manage the risk.</span>
      </footer>

      <section className="app-print-only">
        <Brand />
        <div>
          <span>GEONOS INFRASTRUCTURE DECISION REPORT</span>
          <small>Generated from the active interactive scenario</small>
        </div>
      </section>
    </main>
  );
}
