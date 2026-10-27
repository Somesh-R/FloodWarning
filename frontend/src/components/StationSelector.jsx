import {
  ChevronDown,
  MapPin,
} from "lucide-react";


function StationSelector({
  selectedStation,
  stations = [],
  onStationChange,
}) {

  const stationList = Array.isArray(stations)
    ? stations
    : Object.values(stations || {});


  return (
    <div className="w-full">

      <label
        htmlFor="station-select"
        className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
      >
        Select Monitoring Station
      </label>


      <div className="relative">

        <MapPin
          size={17}
          className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-sky-600"
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
            border-slate-200
            bg-white
            py-3
            pl-10
            pr-10
            text-sm
            font-semibold
            text-slate-800
            outline-none
            transition
            focus:border-sky-400
            focus:ring-4
            focus:ring-sky-100
          "
        >

          {stationList.map((station) => {

            const sensorId =
              typeof station === "string"
                ? station
                : station.sensor_id;

            if (!sensorId) {
              return null;
            }

            return (
              <option
                key={sensorId}
                value={sensorId}
              >
                {sensorId} — Monitoring Station
              </option>
            );

          })}

        </select>


        <ChevronDown
          size={17}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

      </div>

    </div>
  );
}


export default StationSelector;