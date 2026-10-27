import {
  Check,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSun,
  ChevronDown,
  MapPin,
} from "lucide-react";


const RAIN_OPTIONS = [
  {
    value: "NO_RAIN",
    label: "No Rain",
    description: "Clear conditions",
    icon: CloudSun,
    accent: "text-slate-300",
    active:
      "border-slate-400/40 bg-slate-400/10 shadow-[0_0_24px_rgba(148,163,184,0.08)]",
  },

  {
    value: "LOW",
    label: "Low",
    description: "Light rainfall",
    icon: CloudDrizzle,
    accent: "text-sky-300",
    active:
      "border-sky-400/40 bg-sky-400/10 shadow-[0_0_24px_rgba(56,189,248,0.12)]",
  },

  {
    value: "MODERATE",
    label: "Moderate",
    description: "Steady rainfall",
    icon: CloudRain,
    accent: "text-cyan-300",
    active:
      "border-cyan-400/40 bg-cyan-400/10 shadow-[0_0_24px_rgba(34,211,238,0.12)]",
  },

  {
    value: "HEAVY",
    label: "Heavy",
    description: "Intense rainfall",
    icon: CloudRainWind,
    accent: "text-blue-300",
    active:
      "border-blue-400/40 bg-blue-400/10 shadow-[0_0_28px_rgba(59,130,246,0.16)]",
  },
];


function RainfallControl({
  selectedStation,
  selectedRain = "NO_RAIN",
  onStationChange,
  onRainfallChange,
}) {

  return (
    <section className="glass-card overflow-hidden rounded-3xl">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="border-b border-white/10 px-6 py-5 sm:px-7">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-300/15 bg-blue-400/10">

              <CloudRain
                size={21}
                className="text-blue-300"
              />

            </div>


            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-300">

                Rainfall Simulation

              </p>


              <h2 className="mt-1 text-lg font-bold text-white">

                Environmental Control

              </h2>


              <p className="mt-1 text-xs text-slate-400">

                Apply rainfall conditions to any monitoring station

              </p>

            </div>

          </div>


          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5">

            <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />

            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">

              Selected

            </span>


            <span className="text-xs font-bold text-white">

              {selectedStation}

            </span>

          </div>

        </div>

      </div>


      {/* ==================================================
          CONTROLS
      ================================================== */}

      <div className="p-6 sm:p-7">

        {/* STATION */}

        <div>

          <label
            htmlFor="station-select"
            className="mb-2.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400"
          >
            Monitoring Station
          </label>


          <div className="relative">

            <MapPin
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-cyan-300"
            />


            <select
              id="station-select"
              value={selectedStation}
              onChange={(event) =>
                onStationChange(
                  event.target.value
                )
              }
              className="
                w-full
                appearance-none
                rounded-xl
                border
                border-white/10
                bg-white/[0.045]
                py-3.5
                pl-11
                pr-11
                text-sm
                font-semibold
                text-white
                outline-none
                transition-all
                duration-200
                hover:border-cyan-400/25
                hover:bg-white/[0.06]
                focus:border-cyan-400/40
                focus:ring-4
                focus:ring-cyan-400/10
              "
            >

              {["S001", "S002", "S003", "S004"].map(
                (station) => (
                  <option
                    key={station}
                    value={station}
                  >
                    {station} — Monitoring Station
                  </option>
                )
              )}

            </select>


            <ChevronDown
              size={17}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

          </div>

        </div>


        {/* RAINFALL */}

        <div className="mt-7">

          <div className="mb-3 flex items-center justify-between">

            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">

              Rainfall Intensity

            </p>


            <span className="text-[10px] text-slate-500">

              Live simulation input

            </span>

          </div>


          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

            {RAIN_OPTIONS.map(
              (option) => {

                const Icon =
                  option.icon;

                const active =
                  selectedRain ===
                  option.value;


                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      onRainfallChange(
                        option.value
                      )
                    }
                    className={`
                      control-button
                      relative
                      overflow-hidden
                      rounded-2xl
                      border
                      p-4
                      text-left

                      ${
                        active
                          ? option.active
                          : "border-white/10 bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.055]"
                      }
                    `}
                  >

                    {/* Active accent */}

                    {active && (
                      <div className="absolute left-0 top-0 h-full w-[3px] bg-cyan-400" />
                    )}


                    <div className="flex items-start justify-between">

                      <div
                        className={`
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-white/10
                          bg-white/[0.055]
                          ${
                            active
                              ? option.accent
                              : "text-slate-400"
                          }
                        `}
                      >

                        <Icon
                          size={19}
                          strokeWidth={2}
                        />

                      </div>


                      {active && (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400/15 text-cyan-300">

                          <Check
                            size={13}
                            strokeWidth={3}
                          />

                        </span>
                      )}

                    </div>


                    <div className="mt-4">

                      <p
                        className={`
                          text-sm
                          font-bold
                          ${
                            active
                              ? "text-white"
                              : "text-slate-200"
                          }
                        `}
                      >

                        {option.label}

                      </p>


                      <p className="mt-1 text-[11px] text-slate-500">

                        {option.description}

                      </p>

                    </div>

                  </button>
                );

              }
            )}

          </div>

        </div>


        {/* INFO STRIP */}

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.04] p-4">

          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10">

            <CloudRain
              size={15}
              className="text-cyan-300"
            />

          </div>


          <div>

            <p className="text-xs font-semibold text-cyan-200">

              Simulation behaviour

            </p>


            <p className="mt-1 text-[11px] leading-5 text-slate-400">

              Rainfall at the selected station changes the
              simulated water-level rise rate. Water movement
              is propagated downstream through the river network.

            </p>

          </div>

        </div>

      </div>

    </section>
  );
}


export default RainfallControl;