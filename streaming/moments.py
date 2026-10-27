# streaming/moments.py

import math


class OnlineStatistics:

    def __init__(self):
        self.count = 0
        self.mean = 0.0
        self.m2 = 0.0

    def update(self, value):

        self.count += 1

        delta = value - self.mean

        self.mean += delta / self.count

        delta2 = value - self.mean

        self.m2 += delta * delta2

    def get_mean(self):

        return self.mean

    def get_variance(self):

        if self.count == 0:
            return 0.0

        return self.m2 / self.count

    def get_std_dev(self):

        return math.sqrt(
            self.get_variance()
        )