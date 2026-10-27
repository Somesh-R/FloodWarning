# streaming/windows.py

from collections import deque


class SlidingWindow:

    def __init__(self, size=10):
        self.window = deque(maxlen=size)

    def add(self, event):
        self.window.append(event)

    def get_events(self):
        return list(self.window)

    def average_water_level(self):

        if not self.window:
            return 0.0

        return (
            sum(
                event["water_level"]
                for event in self.window
            )
            / len(self.window)
        )


class DecayingWindow:

    def __init__(
        self,
        size=10,
        decay_factor=0.80
    ):
        self.window = deque(maxlen=size)
        self.decay_factor = decay_factor

    def add(self, event):
        self.window.append(event)

    def weighted_average(self):

        if not self.window:
            return 0.0

        weighted_sum = 0.0
        total_weight = 0.0

        for age, event in enumerate(
            reversed(self.window)
        ):

            weight = (
                self.decay_factor ** age
            )

            weighted_sum += (
                event["water_level"] * weight
            )

            total_weight += weight

        return weighted_sum / total_weight