import { motion } from "framer-motion";

import {
  ArrowRight,
  MapPin,
  Waves,
} from "lucide-react";


function RiverAnimation({
  stations = {},
}) {

  const stationList =
    Object.values(stations || {});


  const getStatusStyle = (
    status
  ) => {

    switch (status) {

      case "CRITICAL":
        return {
          marker:
            "border-red-400 shadow-[0_0_22px_rgba(248,113,113,0.35)]",
          icon: "text-red-500",
          badge:
            "border-red-500/30 bg-red-500/10 text-red-700",
        };

      case "WARNING":
        return {
          marker:
            "border-amber-400 shadow-[0_0_22px_rgba(251,191,36,0.3)]",
          icon: "text-amber-500",
          badge:
            "border-amber-500/30 bg-amber-500/10 text-amber-700",
        };

      case "RISING":
        return {
          marker:
            "border-sky-400 shadow-[0_0_22px_rgba(56,189,248,0.3)]",
          icon: "text-sky-500",
          badge:
            "border-sky-500/30 bg-sky-500/10 text-sky-700",
        };

      default:
        return {
          marker:
            "border-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.25)]",
          icon: "text-emerald-500",
          badge:
            "border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
        };
    }
  };


  return (
    <section className="glass-card overflow-hidden rounded-3xl border border-white/10">

      {/* ==================================================
          PANEL HEADER
      ================================================== */}

      <div className="border-b border-white/10 bg-[#081a2b] px-6 py-5 sm:px-7">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/10">

              <Waves
                size={21}
                className="text-cyan-300"
              />

            </div>


            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">

                Live River Network

              </p>


              <h2 className="mt-1 text-lg font-bold text-white">

                River Flow

              </h2>


              <p className="mt-1 text-xs text-slate-400">

                Upstream → downstream sensor propagation

              </p>

            </div>

          </div>


          <div className="inline-flex items-center gap-2 self-start rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1.5 sm:self-auto">

            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />

            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-200">

              Live Flow

            </span>

          </div>

        </div>

      </div>


      {/* ==================================================
          RIVER MAP
      ================================================== */}

      <div className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-blue-50 to-slate-100">

        {/* Background glow */}

        <div className="pointer-events-none absolute left-1/4 top-0 h-48 w-48 rounded-full bg-sky-300/30 blur-3xl" />

        <div className="pointer-events-none absolute right-1/4 top-10 h-56 w-56 rounded-full bg-blue-300/20 blur-3xl" />


        {/* Mountains */}

        <div className="pointer-events-none absolute inset-x-0 bottom-[132px] h-44 opacity-80">

          <svg
            viewBox="0 0 1200 180"
            preserveAspectRatio="none"
            className="h-full w-full"
          >

            <path
              d="M0 180 L0 118 L135 42 L260 122 L390 24 L525 122 L670 56 L805 125 L950 34 L1085 120 L1200 48 L1200 180 Z"
              fill="#cbd5e1"
            />

            <path
              d="M0 180 L0 145 L150 82 L285 143 L445 68 L590 143 L760 78 L900 145 L1040 73 L1200 135 L1200 180 Z"
              fill="#e2e8f0"
            />

          </svg>

        </div>


        {/* ==================================================
            FLOW LINE
        ================================================== */}

        <div className="absolute left-[9%] right-[9%] top-[72px] h-1.5 overflow-hidden rounded-full bg-sky-200">

          <motion.div
            className="h-full w-[35%] bg-gradient-to-r from-transparent via-cyan-400 to-blue-500"
            animate={{
              x: [
                "-110%",
                "320%",
              ],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />

        </div>


        {/* ==================================================
            STATIONS
        ================================================== */}

        <div className="relative z-10 grid grid-cols-2 gap-y-8 px-5 pb-10 pt-10 sm:grid-cols-4 sm:px-8 sm:pb-12 sm:pt-12">

          {stationList.map(
            (station, index) => {

              const style =
                getStatusStyle(
                  station.status
                );


              const level =
                Number(
                  station.water_level || 0
                );


              const levelPercent =
                Math.min(
                  Math.max(
                    (level / 4) * 100,
                    0
                  ),
                  100
                );


              return (
                <motion.div
                  key={station.sensor_id}
                  initial={{
                    opacity: 0,
                    y: 14,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      index * 0.12,
                    duration: 0.45,
                  }}
                  className="relative flex flex-col items-center"
                >

                  {/* Connector */}

                  {index <
                    stationList.length - 1 && (
                    <div className="absolute left-1/2 top-[28px] hidden h-[3px] w-full bg-sky-200 sm:block">

                      <motion.div
                        className="h-full w-20 bg-gradient-to-r from-cyan-400 to-blue-500"
                        animate={{
                          x: [
                            "-120%",
                            "450%",
                          ],
                        }}
                        transition={{
                          duration: 2.8,
                          repeat: Infinity,
                          delay:
                            index * 0.25,
                          ease: "linear",
                        }}
                      />

                    </div>
                  )}


                  {/* Station marker */}

                  <motion.div
                    animate={{
                      y: [
                        0,
                        -2,
                        0,
                      ],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay:
                        index * 0.15,
                    }}
                    className={`
                      relative
                      z-20
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-full
                      border-4
                      bg-white
                      ${style.marker}
                    `}
                  >

                    <MapPin
                      size={23}
                      strokeWidth={2.2}
                      className={
                        style.icon
                      }
                    />


                    {station.status ===
                      "CRITICAL" && (
                      <span className="absolute -right-1 -top-1 h-3 w-3 animate-ping rounded-full bg-red-500" />
                    )}

                  </motion.div>


                  {/* Station card */}

                  <div className="mt-4 w-full max-w-[150px] rounded-2xl border border-slate-200 bg-white/95 p-3 text-center shadow-xl shadow-slate-300/30 backdrop-blur">

                    <p className="text-xs font-bold tracking-wide text-slate-800">

                      {station.sensor_id}

                    </p>


                    <p className="mt-1 text-2xl font-bold tracking-tight text-blue-700">

                      {level.toFixed(2)}

                      <span className="ml-1 text-xs font-semibold text-slate-400">

                        m

                      </span>

                    </p>


                    <div className="mt-2 flex justify-center">

                      <span
                        className={`
                          rounded-full
                          border
                          px-2
                          py-0.5
                          text-[9px]
                          font-bold
                          uppercase
                          tracking-wider
                          ${style.badge}
                        `}
                      >

                        {station.status ||
                          "NORMAL"}

                      </span>

                    </div>


                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">

                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-600"
                        animate={{
                          width: `${levelPercent}%`,
                        }}
                        transition={{
                          duration: 0.8,
                        }}
                      />

                    </div>

                  </div>

                </motion.div>
              );
            }
          )}

        </div>


        {/* ==================================================
            FLOW DIRECTION
        ================================================== */}

        <div className="relative z-20 mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-white/95 px-4 py-2 shadow-lg shadow-slate-300/30 backdrop-blur">

          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">

            Upstream

          </span>


          <ArrowRight
            size={15}
            className="text-blue-600"
          />


          <motion.div
            className="flex gap-1"
            animate={{
              x: [0, 4, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >

            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />

          </motion.div>


          <ArrowRight
            size={15}
            className="text-blue-600"
          />


          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700">

            Downstream

          </span>

        </div>


        {/* ==================================================
            WATER
        ================================================== */}

        <div className="relative h-36 overflow-hidden bg-gradient-to-b from-sky-500 via-blue-600 to-indigo-700">

          <div className="water-surface absolute inset-0" />


          <motion.div
            className="absolute inset-0 opacity-40"
            animate={{
              backgroundPositionX: [
                "0px",
                "-120px",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundImage:
                "repeating-linear-gradient(170deg, transparent 0px, transparent 18px, rgba(255,255,255,0.15) 19px, transparent 21px)",
              backgroundSize:
                "240px 100%",
            }}
          />


          <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center">

            <div className="rounded-full border border-white/15 bg-white/10 px-5 py-2 backdrop-blur">

              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">

                <Waves
                  size={14}
                  className="text-cyan-200"
                />

                Continuous River Flow

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}


export default RiverAnimation;