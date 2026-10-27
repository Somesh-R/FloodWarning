import { motion } from "framer-motion";

import {
  Activity,
  Radio,
  ShieldCheck,
  Waves,
} from "lucide-react";


function Header({
  connected = false,
}) {

  return (
    <header className="relative overflow-hidden border-b border-white/10 bg-[#06111f]">

      {/* ==================================================
          BACKGROUND LIGHT
      ================================================== */}

      <div className="pointer-events-none absolute inset-0">

        <div className="absolute -left-24 -top-40 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="absolute -right-24 -top-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

      </div>


      {/* ==================================================
          MAIN HEADER
      ================================================== */}

      <div className="relative mx-auto flex max-w-[1680px] items-center justify-between px-4 py-5 sm:px-6 lg:px-8 xl:px-10">

        <div className="flex min-w-0 items-center gap-3 sm:gap-4">

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.85,
            }}

            animate={{
              opacity: 1,
              scale: 1,
            }}

            transition={{
              duration: 0.45,
            }}

            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-400/10 shadow-[0_0_28px_rgba(34,211,238,0.08)] sm:h-12 sm:w-12"
          >

            <Waves
              size={25}
              strokeWidth={2}
              className="text-cyan-300"
            />

          </motion.div>


          <div className="min-w-0">

            <div className="flex items-center gap-2">

              <h1 className="truncate text-base font-bold tracking-tight text-white sm:text-xl lg:text-2xl">

                Real-Time Flood Early Warning System

              </h1>

              <span className="hidden rounded-full border border-cyan-300/15 bg-cyan-300/5 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-cyan-300 lg:inline-flex">

                STREAMING

              </span>

            </div>


            <p className="mt-1 truncate text-[10px] text-slate-500 sm:text-xs">

              Water-level monitoring • Rainfall simulation • Flood-risk analytics

            </p>

          </div>

        </div>


        {/* ==================================================
            RIGHT STATUS
        ================================================== */}

        <div className="ml-4 flex shrink-0 items-center gap-2">

          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 lg:flex">

            <Activity
              size={14}
              className="text-cyan-300"
            />

            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">

              Real-Time Monitoring

            </span>

          </div>


          <div
            className={`
              flex
              items-center
              gap-2
              rounded-full
              border
              px-3
              py-2

              ${
                connected
                  ? "border-emerald-400/20 bg-emerald-400/[0.06]"
                  : "border-amber-400/20 bg-amber-400/[0.06]"
              }
            `}
          >

            <span
              className={`
                h-2
                w-2
                shrink-0
                rounded-full
                ${
                  connected
                    ? "bg-emerald-400"
                    : "bg-amber-400"
                }
                ${
                  connected
                    ? "animate-pulse"
                    : ""
                }
              `}
            />


            <span
              className={`
                text-[9px]
                font-bold
                uppercase
                tracking-wider
                ${
                  connected
                    ? "text-emerald-300"
                    : "text-amber-300"
                }
              `}
            >

              {connected
                ? "LIVE"
                : "DEMO MODE"}

            </span>

          </div>

        </div>

      </div>


      {/* ==================================================
          SYSTEM STATUS BAR
      ================================================== */}

      <div className="relative border-t border-white/10 bg-[#071624]">

        <div className="mx-auto flex max-w-[1680px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2.5 sm:px-6 lg:px-8 xl:px-10">

          <div className="flex items-center gap-2">

            <Radio
              size={13}
              className={
                connected
                  ? "text-emerald-300"
                  : "text-amber-300"
              }
            />

            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">

              Sensor Network

            </span>

            <span className="text-[10px] font-semibold text-slate-300">

              {connected
                ? "Connected"
                : "Simulation"}

            </span>

          </div>


          <div className="hidden h-3.5 w-px bg-white/10 sm:block" />


          <div className="flex items-center gap-2">

            <ShieldCheck
              size={13}
              className="text-cyan-300"
            />

            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">

              Flood Threshold

            </span>

            <span className="text-[10px] font-semibold text-slate-300">

              4.00 m

            </span>

          </div>


          <div className="hidden h-3.5 w-px bg-white/10 md:block" />


          <div className="hidden items-center gap-2 md:flex">

            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />

            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">

              Simulation Speed

            </span>

            <span className="text-[10px] font-semibold text-slate-300">

              1 sec = 1 min

            </span>

          </div>


          <div className="ml-auto hidden items-center gap-2 sm:flex">

            <span className="text-[9px] uppercase tracking-wider text-slate-600">

              System

            </span>

            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-300">

              Active

            </span>

          </div>

        </div>

      </div>

    </header>
  );
}


export default Header;