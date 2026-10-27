# streaming/streaming_engine.py

from collections import defaultdict

from streaming.filtering import is_rapid_rise
from streaming.counting import StreamCounter
from streaming.sampling import sample_event
from streaming.moments import OnlineStatistics
from streaming.windows import SlidingWindow, DecayingWindow


class StreamingEngine:

    def __init__(self):

        self.total_events = 0

        # Distinct stations
        self.active_stations = set()

        # Counting
        self.counter = StreamCounter()

        # Statistics for each station
        self.statistics = defaultdict(
            OnlineStatistics
        )

        # Sliding windows
        self.sliding_windows = defaultdict(
            lambda: SlidingWindow(10)
        )

        # Decaying windows
        self.decaying_windows = defaultdict(
            lambda: DecayingWindow(
                10,
                0.80
            )
        )

        # Sampled events
        self.sampled_events = []

    def process_event(self, event):

        sensor_id = event["sensor_id"]

        self.total_events += 1

        # Distinct station counting
        self.active_stations.add(sensor_id)

        # Filtering
        rapid_rise = is_rapid_rise(event)

        # Counting
        self.counter.process(
            event,
            rapid_rise
        )

        # Moments / statistics
        self.statistics[
            sensor_id
        ].update(
            event["water_level"]
        )

        # Sliding window
        self.sliding_windows[
            sensor_id
        ].add(event)

        # Decaying window
        self.decaying_windows[
            sensor_id
        ].add(event)

        # Sampling
        if sample_event(
            event,
            0.10
        ):
            self.sampled_events.append(
                event
            )

        # Current station statistics
        stats = self.statistics[
            sensor_id
        ]

        # Total rapid-rise events
        total_rapid_rise = sum(
            self.counter.rapid_rise.values()
        )

        return {

            "rapid_rise":
                rapid_rise,

            "total_events":
                self.total_events,

            "station_event_count":
                self.counter.get_station_count(
                    sensor_id
                ),

            "rapid_rise_count":
                total_rapid_rise,

            "station_rapid_rise_count":
                self.counter.get_rapid_rise_count(
                    sensor_id
                ),

            "distinct_stations":
                len(self.active_stations),

            "window_average":
                self.sliding_windows[
                    sensor_id
                ].average_water_level(),

            "decaying_average":
                self.decaying_windows[
                    sensor_id
                ].weighted_average(),

            "mean":
                stats.get_mean(),

            "variance":
                stats.get_variance(),

            "std_dev":
                stats.get_std_dev()
        }

    def get_status(self):

        return {

            "total_events":
                self.total_events,

            "distinct_stations":
                len(self.active_stations),

            "rapid_rise_events":
                dict(
                    self.counter.rapid_rise
                ),

            "events_per_station":
                dict(
                    self.counter.per_station
                )
        }