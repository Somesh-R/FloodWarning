import { motion } from "framer-motion";

import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Gauge,
  ShieldAlert,
  TrendingUp,
  Waves,
} from "lucide-react";


const STATUS_CONFIG = {
  NORMAL: {
    title: "Flood Risk Normal",
    description:
      "Water level is within the normal operating range.",
    icon: CheckCircle2,
    badge:
      "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
    iconBox:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    accent: "bg-emerald-400",
    level:
      "from-emerald-400 to-cyan-400",
  },

  RISING: {
    title: "Water Level Rising",
    description:
      "The water level is increasing. Continue monitoring.",
    icon: TrendingUp,
    badge:
      "border-sky-400/25 bg-sky-400/10 text-sky-300",
    iconBox:
      "border-sky-400/20 bg-sky-400/10 text-sky-300",
    accent: "bg-sky-400",
    level:
      "from-sky-400 to-cyan-400",
  },

  WARNING: {
    title: "Flood Warning",
    description:
      "Water level or rise rate indicates elevated flood risk.",
    icon: AlertTriangle,
    badge:
      "border-amber-400/30 bg-amber-400/10 text-amber-300",
    iconBox:
      "border-amber-400/20 bg-amber-400/10 text-amber-300",
    accent: "bg-amber-400",
    level:
      "from-amber-300 to-orange-500",
  },

  CRITICAL: {
    title: "Critical Flood Alert",
    description:
      "The flood threshold has been reached or exceeded.",
    icon: AlertOctagon,
    badge:
      "border-red-400/30 bg-red-400/10 text-red-300",
    iconBox:
      "border-red-400/20 bg-red-400/10 text-red-300",
    accent: "bg-red-400",
    level:
      "from-orange-400 to-red-500",
  },
};


function FloodWarning({
  station,
}) {

  if (!station) {
    return (
      <section className="glass-card flex min-h-full items-center justify-center rounded-3xl p-6">

        <p className="text-sm text-slate-400">
          Waiting for station data...
        </p>

      </section>
    );
  }


  const {
    sensor_id = "S001",
    water_level = 0,
    rate = 0,
    status = "NORMAL",
    flood_eta = null,
  } = station;


  const config =
    STATUS_CONFIG[status] ||
    STATUS_CONFIG.NORMAL;


  const Icon = config.icon;


  const levelPercent = Math.min(
    Math.max(
      (Number(water_level) / 4) * 100,
      0
    ),
    100
  );


  const etaText =
    flood_eta === null ||
    flood_eta === undefined
      ? "N/A"
      : `${Math.max(
          0,
          Number(flood_eta)
        ).toFixed(1)} min`;


  const rateValue =
    Number(rate);


  const isCritical =
    status === "CRITICAL";


  return (
    <motion.section
      layout
      className={`
        glass-card
        relative
        h-full
        overflow-hidden
        rounded-3xl
        border
        ${
          isCritical
            ? "border-red-400/30 flood-glow"
            : "border-white/10"
        }
      `}
    >

      {/* ==================================================
          TOP ACCENT
      ================================================== */}

      <div
        className={`
          absolute
          left-0
          right-0
          top-0
          h-[3px]
          ${config.accent}
        `}
      />


      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="border-b border-white/10 px-6 py-5">

        <div className="flex items-start justify-between gap-3">

          <div className="flex items-center gap-3">

            <motion.div
              animate={
                isCritical
                  ? {
                      scale: [
                        1,
                        1.08,
                        1,
                      ],
                    }
                  : undefined
              }
              transition={{
                duration: 1.2,
                repeat: isCritical
                  ? Infinity
                  : 0,
              }}
              className={`
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                ${config.iconBox}
              `}
            >

              <Icon
                size={22}
                strokeWidth={2}
              />

            </motion.div>


            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">

                Flood Risk Assessment

              </p>


              <h2
                className={`
                  mt-1
                  text-lg
                  font-bold
                  ${
                    isCritical
                      ? "text-red-300"
                      : status === "WARNING"
                        ? "text-amber-300"
                        : "text-white"
                  }
                `}
              >

                {config.title}

              </h2>

            </div>

          </div>


          <span
            className={`
              rounded-full
              border
              px-3
              py-1.5
              text-[10px]
              font-bold
              tracking-wider
              ${config.badge}
            `}
          >

            {sensor_id}

          </span>

        </div>


        <p className="mt-4 text-xs leading-5 text-slate-400">

          {config.description}

        </p>

      </div>


      {/* ==================================================
          CURRENT LEVEL
      ================================================== */}

      <div className="p-6">

        <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">

          <div className="flex items-end justify-between gap-3">

            <div>

              <div className="flex items-center gap-2">

                <Waves
                  size={15}
                  className="text-cyan-300"
                />

                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">

                  Current Water Level

                </span>

              </div>


              <div className="mt-2 flex items-baseline gap-2">

                <span className="text-4xl font-bold tracking-tight text-white">

                  {Number(
                    water_level
                  ).toFixed(2)}

                </span>

                <span className="text-sm font-semibold text-cyan-300">

                  m

                </span>

              </div>

            </div>


            <div className="text-right">

              <p className="text-[10px] uppercase tracking-wide text-slate-500">

                Threshold

              </p>

              <p className="mt-1 text-sm font-bold text-slate-200">

                4.00 m

              </p>

            </div>

          </div>


          {/* LEVEL BAR */}

          <div className="mt-5">

            <div className="relative h-2.5 overflow-hidden rounded-full bg-white/10">

              <motion.div
                className={`
                  absolute
                  inset-y-0
                  left-0
                  rounded-full
                  bg-gradient-to-r
                  ${config.level}
                `}
                animate={{
                  width: `${levelPercent}%`,
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                }}
              />

            </div>


            <div className="mt-1.5 flex justify-between text-[9px] text-slate-500">

              <span>0 m</span>

              <span>
                Flood threshold: 4.00 m
              </span>

            </div>

          </div>

        </div>


        {/* ==================================================
            METRICS
        ================================================== */}

        <div className="mt-3 grid grid-cols-2 gap-3">

          <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">

            <div className="flex items-center gap-2">

              <Gauge
                size={15}
                className="text-sky-300"
              />

              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">

                Rise Rate

              </span>

            </div>


            <p
              className={`
                mt-2
                text-lg
                font-bold
                ${
                  rateValue > 0
                    ? "text-sky-300"
                    : rateValue < 0
                      ? "text-slate-300"
                      : "text-white"
                }
              `}
            >

              {rateValue >= 0
                ? "+"
                : ""}
              {rateValue.toFixed(3)}

              <span className="ml-1 text-[10px] font-medium text-slate-500">

                m/min

              </span>

            </p>

          </div>


          <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">

            <div className="flex items-center gap-2">

              <Clock3
                size={15}
                className="text-cyan-300"
              />

              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">

                Flood ETA

              </span>

            </div>


            <p
              className={`
                mt-2
                text-lg
                font-bold
                ${
                  isCritical
                    ? "text-red-300"
                    : status === "WARNING"
                      ? "text-amber-300"
                      : "text-white"
                }
              `}
            >

              {etaText}

            </p>

          </div>

        </div>


        {/* ==================================================
            RESPONSE MESSAGE
        ================================================== */}

        <div
          className={`
            mt-4
            rounded-2xl
            border
            p-4
            ${
              isCritical
                ? "border-red-400/20 bg-red-400/[0.07]"
                : status === "WARNING"
                  ? "border-amber-400/20 bg-amber-400/[0.06]"
                  : "border-white/10 bg-white/[0.03]"
            }
          `}
        >

          <div className="flex items-start gap-3">

            <div
              className={`
                mt-0.5
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                ${
                  isCritical
                    ? "bg-red-400/10 text-red-300"
                    : status === "WARNING"
                      ? "bg-amber-400/10 text-amber-300"
                      : "bg-cyan-400/10 text-cyan-300"
                }
              `}
            >

              {isCritical ? (
                <AlertOctagon size={16} />
              ) : status === "WARNING" ? (
                <AlertTriangle size={16} />
              ) : (
                <ShieldAlert size={16} />
              )}

            </div>


            <div>

              <p className="text-xs font-semibold text-white">

                {isCritical
                  ? "Immediate attention required"
                  : status === "WARNING"
                    ? "Elevated flood risk detected"
                    : "Continuous monitoring active"}

              </p>


              <p className="mt-1 text-[11px] leading-5 text-slate-500">

                {isCritical
                  ? "The simulated flood threshold has been reached or exceeded at this station."
                  : status === "WARNING"
                    ? "Water-level behaviour requires closer observation and continued monitoring."
                    : "The station remains under real-time streaming observation."}

              </p>

            </div>

          </div>

        </div>

      </div>

    </motion.section>
  );
}


export default FloodWarning;