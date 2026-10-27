import { motion } from "framer-motion";

import {
  ArrowDown,
  ArrowUp,
  CloudRain,
  Gauge,
  MapPin,
  TrendingUp,
  Waves,
} from "lucide-react";


const STATUS_CONFIG = {
  NORMAL: {
    label: "NORMAL",
    badge:
      "border border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
    icon: "text-emerald-300",
  },

  RISING: {
    label: "RISING",
    badge:
      "border border-sky-400/25 bg-sky-400/10 text-sky-300",
    icon: "text-sky-300",
  },

  WARNING: {
    label: "WARNING",
    badge:
      "border border-amber-400/30 bg-amber-400/10 text-amber-300",
    icon: "text-amber-300",
  },

  CRITICAL: {
    label: "CRITICAL",
    badge:
      "border border-red-400/30 bg-red-400/10 text-red-300",
    icon: "text-red-300",
  },
};


const RAIN_LABELS = {
  NO_RAIN: "No Rain",
  LOW: "Low",
  MODERATE: "Moderate",
  HEAVY: "Heavy",
};


function StationCard({
  station,
  selected = false,
  onSelect,
}) {

  if (!station) {
    return null;
  }


  const {
    sensor_id,
    water_level = 0,
    rain_condition = "NO_RAIN",
    rate = 0,
    status = "NORMAL",
    flood_eta = null,
    window_average = water_level,
  } = station;


  const statusConfig =
    STATUS_CONFIG[status] ||
    STATUS_CONFIG.NORMAL;


  const levelPercentage = Math.min(
    Math.max((water_level / 4) * 100, 0),
    100
  );


  const rateIsRising = rate > 0;


  const formattedRate =
    rate >= 0
      ? `+${rate.toFixed(3)}`
      : rate.toFixed(3);


  const formattedEta =
    flood_eta === null ||
    flood_eta === undefined
      ? "N/A"
      : `${Math.max(
          0,
          Number(flood_eta)
        ).toFixed(1)} min`;


  return (
    <motion.button
      type="button"
      onClick={onSelect}

      whileHover={{
        y: -4,
      }}

      whileTap={{
        scale: 0.985,
      }}

      transition={{
        duration: 0.2,
      }}

      className={`
        glass-card
        relative
        w-full
        overflow-hidden
        rounded-2xl
        p-5
        text-left
        transition-all
        duration-300

        ${
          selected
            ? "border-sky-400/50 shadow-[0_0_30px_rgba(14,165,233,0.12)]"
            : "border-white/10 hover:border-sky-400/25"
        }

        ${
          status === "CRITICAL"
            ? "flood-glow"
            : status === "WARNING"
              ? "warning-glow"
              : ""
        }
      `}
    >

      {/* ==================================================
          TOP
      ================================================== */}

      <div className="flex items-start justify-between gap-3">

        <div className="flex items-center gap-3">

          <div
            className={`
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-white/10
              bg-white/[0.07]
              ${statusConfig.icon}
            `}
          >

            <Waves
              size={23}
              strokeWidth={2}
            />

          </div>


          <div>

            <div className="flex items-center gap-2">

              <h3 className="text-base font-bold tracking-wide text-white">

                {sensor_id}

              </h3>


              {selected && (
                <span className="rounded-full border border-sky-300/30 bg-sky-300/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-sky-300">

                  SELECTED

                </span>
              )}

            </div>


            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">

              <MapPin
                size={12}
                className="text-sky-400"
              />

              Monitoring Station

            </div>

          </div>

        </div>


        {/* STATUS */}

        <span
          className={`
            rounded-full
            px-2.5
            py-1
            text-[10px]
            font-bold
            tracking-wider
            ${statusConfig.badge}
          `}
        >

          {statusConfig.label}

        </span>

      </div>


      {/* ==================================================
          WATER LEVEL
      ================================================== */}

      <div className="mt-6">

        <div className="flex items-end justify-between gap-4">

          <div>

            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">

              Water Level

            </p>


            <div className="mt-1 flex items-baseline gap-1.5">

              <span className="text-4xl font-bold tracking-tight text-white">

                {Number(water_level).toFixed(2)}

              </span>

              <span className="text-sm font-medium text-sky-300">

                m

              </span>

            </div>

          </div>


          <div className="text-right">

            <p className="text-[10px] uppercase tracking-wide text-slate-500">

              Flood Threshold

            </p>

            <p className="mt-1 text-sm font-bold text-slate-200">

              4.00 m

            </p>

          </div>

        </div>


        {/* LEVEL BAR */}

        <div className="mt-4">

          <div className="water-level-bar">

            <motion.div
              className={`
                water-level-fill
                ${
                  status === "CRITICAL"
                    ? "!bg-gradient-to-r !from-rose-400 !to-red-500"
                    : status === "WARNING"
                      ? "!bg-gradient-to-r !from-amber-300 !to-orange-500"
                      : ""
                }
              `}
              initial={{
                width: 0,
              }}
              animate={{
                width: `${levelPercentage}%`,
              }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
            />

          </div>


          <div className="mt-1.5 flex justify-between text-[10px] text-slate-500">

            <span>0 m</span>

            <span>4 m</span>

          </div>

        </div>

      </div>


      {/* ==================================================
          METRIC CARDS
      ================================================== */}

      <div className="mt-5 grid grid-cols-2 gap-3">

        {/* RATE */}

        <div className="rounded-xl border border-white/8 bg-white/[0.055] p-3">

          <div className="flex items-center gap-2">

            <TrendingUp
              size={14}
              className={
                rateIsRising
                  ? "text-sky-300"
                  : "text-slate-400"
              }
            />

            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">

              Rate

            </span>

          </div>


          <div className="mt-2 flex items-center gap-1.5">

            {rateIsRising ? (
              <ArrowUp
                size={14}
                className="text-sky-300"
              />
            ) : (
              <ArrowDown
                size={14}
                className="text-slate-400"
              />
            )}


            <span className="text-sm font-bold text-white">

              {formattedRate}

            </span>


            <span className="text-[10px] text-slate-500">

              m/min

            </span>

          </div>

        </div>


        {/* RAIN */}

        <div className="rounded-xl border border-white/8 bg-white/[0.055] p-3">

          <div className="flex items-center gap-2">

            <CloudRain
              size={14}
              className="text-cyan-300"
            />

            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">

              Rainfall

            </span>

          </div>


          <p className="mt-2 text-sm font-bold text-white">

            {RAIN_LABELS[rain_condition] ||
              rain_condition}

          </p>

        </div>

      </div>


      {/* ==================================================
          FOOTER METRICS
      ================================================== */}

      <div className="mt-4 border-t border-white/10 pt-4">

        <div className="flex items-center justify-between gap-3">

          <div className="flex items-center gap-2">

            <Gauge
              size={14}
              className="text-slate-400"
            />

            <span className="text-xs text-slate-400">

              Window Avg

            </span>

            <span className="text-xs font-semibold text-slate-200">

              {Number(
                window_average
              ).toFixed(2)} m

            </span>

          </div>


          <div className="text-right">

            <p className="text-[10px] uppercase tracking-wide text-slate-500">

              Flood ETA

            </p>


            <p
              className={`
                text-xs
                font-bold
                ${
                  status === "CRITICAL"
                    ? "text-red-300"
                    : status === "WARNING"
                      ? "text-amber-300"
                      : "text-slate-200"
                }
              `}
            >

              {formattedEta}

            </p>

          </div>

        </div>

      </div>


      {/* ==================================================
          SELECTED ACCENT
      ================================================== */}

      {selected && (
        <motion.div
          layoutId="station-selected"
          className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500"
        />
      )}

    </motion.button>
  );
}


export default StationCard;