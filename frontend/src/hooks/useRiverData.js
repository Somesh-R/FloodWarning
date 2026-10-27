// frontend/src/hooks/useRiverData.js

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import createWebSocket from "../services/websocket";

const SENSOR_IDS = [
  "S001",
  "S002",
  "S003",
  "S004",
];

const INITIAL_LEVELS = {
  S001: 2.5,
  S002: 2.4,
  S003: 2.3,
  S004: 2.2,
};

const INITIAL_RAINFALL = {
  S001: "NO_RAIN",
  S002: "NO_RAIN",
  S003: "NO_RAIN",
  S004: "NO_RAIN",
};

const STATION_NAMES = {
  S001: "Upstream",
  S002: "Station 2",
  S003: "Station 3",
  S004: "Downstream",
};

function getStatus(waterLevel, rate) {
  if (waterLevel >= 3.7) {
    return "CRITICAL";
  }

  if (waterLevel >= 3.2 || rate >= 0.15) {
    return "WARNING";
  }

  if (rate >= 0.05) {
    return "RISING";
  }

  return "NORMAL";
}

function getFloodEta(waterLevel, rate) {
  const threshold = 4.0;

  if (waterLevel >= threshold) {
    return 0;
  }

  if (rate <= 0) {
    return null;
  }

  return Math.max(
    0,
    (threshold - waterLevel) / rate
  );
}

function createInitialStations() {
  return SENSOR_IDS.reduce((stations, sensorId) => {
    stations[sensorId] = {
      sensor_id: sensorId,
      station:
        STATION_NAMES[sensorId],
      water_level:
        INITIAL_LEVELS[sensorId],
      rain_condition:
        INITIAL_RAINFALL[sensorId],
      rate: 0,
      status: "NORMAL",
      flood_eta: null,
      timestamp: new Date().toISOString(),
    };

    return stations;
  }, {});
}

function createInitialStats() {
  return {
    total_events: 0,
    distinct_stations: 0,
    rapid_rise_count: 0,
    mean_water_level: 0,
    standard_deviation: 0,
    sampled_events: 0,
  };
}

export function useRiverData() {
  const [stations, setStations] = useState(
    createInitialStations()
  );

  const [history, setHistory] = useState([]);

  const [streamingStats, setStreamingStats] =
    useState(createInitialStats());

  const [connected, setConnected] =
    useState(false);

  const websocketRef = useRef(null);

  const applyEvent = useCallback(
    (event) => {
      const sensorId =
        event?.sensor_id;

      if (!sensorId) {
        return;
      }

      const waterLevel = Number(
        event.water_level ?? 0
      );

      const rate = Number(
        event.rate ?? 0
      );

      const status =
        event.status ??
        event.risk ??
        getStatus(
          waterLevel,
          rate
        );

      const floodEta =
        event.flood_eta ??
        getFloodEta(
          waterLevel,
          rate
        );

      const normalizedEvent = {
        ...event,
        sensor_id: sensorId,
        station:
          event.station ??
          STATION_NAMES[sensorId],
        water_level: waterLevel,
        rate,
        rain_condition:
          event.rain_condition ??
          "NO_RAIN",
        status,
        flood_eta:
          floodEta,
        timestamp:
          event.timestamp ??
          new Date().toISOString(),
      };

      setStations((current) => ({
        ...current,
        [sensorId]:
          normalizedEvent,
      }));

      setHistory((current) => {
        const next = [
          ...current,
          normalizedEvent,
        ];

        return next.slice(-300);
      });

      setStreamingStats(
        (current) => ({
          total_events:
            event.total_events ??
            event.total_event_count ??
            current.total_events,

          distinct_stations:
            event.distinct_stations ??
            event.distinct_sensor_count ??
            current.distinct_stations,

          rapid_rise_count:
            event.rapid_rise_count ??
            current.rapid_rise_count,

          mean_water_level:
            event.mean_water_level ??
            event.mean_level ??
            current.mean_water_level,

          standard_deviation:
            event.standard_deviation ??
            event.std_water_level ??
            event.std ??
            current.standard_deviation,

          sampled_events:
            event.sampled_events ??
            event.sample_count ??
            current.sampled_events,
        })
      );
    },
    []
  );

  useEffect(() => {
    const websocket =
      createWebSocket(
        (message) => {
          if (!message) {
            return;
          }

          if (
            message.type ===
            "connection"
          ) {
            setConnected(
              message.status ===
                "connected"
            );

            return;
          }

          if (
            message.type ===
            "rainfall_ack"
          ) {
            return;
          }

          if (
            message.type ===
            "error"
          ) {
            console.error(
              "Backend error:",
              message.message
            );

            return;
          }

          if (
            message.sensor_id
          ) {
            applyEvent(message);
          }
        },
        (isConnected) => {
          setConnected(
            Boolean(isConnected)
          );
        }
      );

    websocketRef.current =
      websocket;

    return () => {
      websocket.close();
      websocketRef.current =
        null;
    };
  }, [applyEvent]);

  const setRainfall = useCallback(
    (sensorId, condition) => {
      if (
        !websocketRef.current
      ) {
        console.warn(
          "Python backend is not connected."
        );

        return false;
      }

      return websocketRef.current.setRainfall(
        sensorId,
        condition
      );
    },
    []
  );

  return {
    stations,
    setRainfall,
    connected,
    history,
    streamingStats,
  };
}

export { createInitialStations };

export default useRiverData;