"use client";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

const CountdownTimer = ({ createdAt }) => {
  const targetTime = dayjs(createdAt).add(24, "hour");
  const [timeLeft, setTimeLeft] = useState(
    targetTime.diff(dayjs())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs();
      const diff = targetTime.diff(now);
      setTimeLeft(diff > 0 ? diff : 0); // Ensure timeLeft never goes below zero

      if (diff <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  const duration = dayjs.duration(timeLeft);

  const hours = String(duration.hours()).padStart(2, "0");
  const minutes = String(duration.minutes()).padStart(
    2,
    "0"
  );
  const seconds = String(duration.seconds()).padStart(
    2,
    "0"
  );

  return (
    <span id="countdown">
      {hours}:{minutes}:{seconds}
    </span>
  );
};

export default CountdownTimer;
