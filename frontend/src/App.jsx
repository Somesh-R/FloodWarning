import { useState } from "react";

import {
  Activity,
  CloudRain,
  Droplets,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";

import Header from "./components/Header";
import StationCard from "./components/StationCard";
import RainfallControl from "./components/RainfallControl";
import RiverAnimation from "./components/RiverAnimation";
import RainAnimation from "./components/RainAnimation";
import FloodWarning from "./components/FloodWarning";
import WaterLevelChart from "./components/WaterLevelChart";
import StreamingStats from "./components/StreamingStats";

import { useRiverData } from "./hooks/useRiverData";


function App() {

  const {
    stations,
    setRainfall,
    connected,
    history,
    streamingStats,
  } = useRiverData();


  const [selectedStation, setSelectedStation] =
    useState("S001");


  const selectedData =
    stations[selectedStation] ||
    stations.S001;


  const selectedRain =
    selectedData?.rain_condition ||
    "NO_RAIN";


  const stationList =
    Object.values(stations || {});


  const criticalCount =
    stationList.filter(
      (station) =>
        station.status === "CRITICAL"
    ).length;


  const warningCount =
    stationList.filter(
      (station) =>
        station.status === "WARNING"
    ).length;


  const averageLevel =
    stationList.length > 0
      ? stationList.reduce(
          (sum, station) =>
            sum +
            Number(
              station.water_level || 0
            ),
          0
        ) / stationList.length
      : 0;


  const highestLevel =
    stationList.length > 0
      ? Math.max(
          ...stationList.map(
            (station) =>
              Number(
                station.water_level || 0
              )
          )
        )
      : 0;


  const handleRainfallChange = (
    condition
  ) => {

    setRainfall(
      selectedStation,
      condition
    );
  };


  return (
    <div className="dashboard-background min-h-screen">

      <Header
        connected={connected}
      />


      <main className="mx-auto w-full max-w-[1680px] px-4 py-6 sm:px-6 lg:px-8 xl:px-10">


        {/* ==================================================
            PAGE INTRO / SYSTEM OVERVIEW
        ================================================== */}

        <section className="mb-6">

          <div className="glass-card overflow-hidden rounded-3xl">

            <div className="relative px-6 py-7 sm:px-8">

              {/* Decorative glow */}

              <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

              <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />


              <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

                <div className="max-w-3xl">

                  <div className="mb-3 flex items-center gap-2">

                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10">

                      <Activity
                        size={16}
                        className="text-cyan-300"
                      />

                    </span>

                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">

                      Flood Intelligence Console

                    </span>

                  </div>


                  <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">

                    River Monitoring &{" "}

                    <span className="text-cyan-300">

                      Early Flood Detection

                    </span>

                  </h2>


                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">

                    Live sensor conditions, rainfall simulation,
                    streaming analytics and flood-risk estimation
                    across the complete upstream-to-downstream
                    river network.

                  </p>

                </div>


                {/* ==================================================
                    QUICK METRICS
                ================================================== */}

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:min-w-[520px]">

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">

                    <div className="flex items-center gap-2">

                      <Droplets
                        size={15}
                        className="text-cyan-300"
                      />

                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">

                        Avg Level

                      </span>

                    </div>

                    <p className="mt-2 text-xl font-bold text-white">

                      {averageLevel.toFixed(2)}

                      <span className="ml-1 text-xs text-cyan-300">

                        m

                      </span>

                    </p>

                  </div>


                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">

                    <div className="flex items-center gap-2">

                      <TrendingUp
                        size={15}
                        className="text-sky-300"
                      />

                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">

                        Peak Level

                      </span>

                    </div>

                    <p className="mt-2 text-xl font-bold text-white">

                      {highestLevel.toFixed(2)}

                      <span className="ml-1 text-xs text-sky-300">

                        m

                      </span>

                    </p>

                  </div>


                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">

                    <div className="flex items-center gap-2">

                      <ShieldAlert
                        size={15}
                        className="text-amber-300"
                      />

                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">

                        Warnings

                      </span>

                    </div>

                    <p className="mt-2 text-xl font-bold text-amber-300">

                      {warningCount}

                    </p>

                  </div>


                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">

                    <div className="flex items-center gap-2">

                      <CloudRain
                        size={15}
                        className="text-red-300"
                      />

                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">

                        Critical

                      </span>

                    </div>

                    <p className="mt-2 text-xl font-bold text-red-300">

                      {criticalCount}

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ==================================================
            STATION SECTION
        ================================================== */}

        <section className="mb-6">

          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">

                  Live Sensor Network

                </span>

              </div>


              <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">

                Monitoring Stations

              </h2>


              <p className="mt-1 text-sm text-slate-400">

                Real-time water-level and flood-risk status

              </p>

            </div>


            <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">

              {stationList.length} active stations

            </div>

          </div>


          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {stationList.map(
              (station) => (
                <StationCard
                  key={
                    station.sensor_id
                  }
                  station={station}
                  selected={
                    station.sensor_id ===
                    selectedStation
                  }
                  onSelect={() =>
                    setSelectedStation(
                      station.sensor_id
                    )
                  }
                />
              )
            )}

          </div>

        </section>


        {/* ==================================================
            RIVER FLOW
        ================================================== */}

        <section className="mb-6">

          <RiverAnimation
            stations={stations}
          />

        </section>


        {/* ==================================================
            CONTROL + ALERT AREA
        ================================================== */}

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(340px,0.75fr)]">

          <RainfallControl
            selectedStation={
              selectedStation
            }
            selectedRain={
              selectedRain
            }
            onStationChange={
              setSelectedStation
            }
            onRainfallChange={
              handleRainfallChange
            }
          />


          <FloodWarning
            station={selectedData}
          />

        </section>


        {/* ==================================================
            WEATHER ANIMATION
        ================================================== */}

        <section className="mt-6">

          <RainAnimation
            condition={selectedRain}
          />

        </section>


        {/* ==================================================
            ANALYTICS
        ================================================== */}

        <section className="mt-6 grid grid-cols-1 gap-6">

          <WaterLevelChart
            history={history}
            selectedStation={
              selectedStation
            }
          />


          <StreamingStats
            stats={streamingStats}
          />

        </section>


        {/* ==================================================
            FOOTER
        ================================================== */}

        <footer className="mt-10 border-t border-white/10 py-7">

          <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">

            <div>

              <p className="text-xs font-semibold text-slate-300">

                Real-Time Water Level Monitoring & Flood Early Warning System

              </p>

              <p className="mt-1 text-[10px] text-slate-500">

                Streaming analytics • Sensor simulation • Flood risk estimation

              </p>

            </div>


            <div className="flex items-center justify-center gap-2">

              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">

                System Active

              </span>

            </div>

          </div>

        </footer>

      </main>

    </div>
  );
}


export default App;