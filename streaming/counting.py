# streaming/counting.py

from collections import defaultdict


class StreamCounter:

    def __init__(self):
        self.total = 0
        self.per_station = defaultdict(int)
        self.rapid_rise = defaultdict(int)

    def process(self, event, rapid_rise=False):

        self.total += 1

        sensor_id = event["sensor_id"]

        self.per_station[sensor_id] += 1

        if rapid_rise:
            self.rapid_rise[sensor_id] += 1

    def get_total(self):
        return self.total

    def get_station_count(self, sensor_id):
        return self.per_station[sensor_id]

    def get_rapid_rise_count(self, sensor_id):
        return self.rapid_rise[sensor_id]