import React from "react";
import Play from "../icons/play.svg";
import Pause from "../icons/pause.svg";
import Remove from "../icons/remove.svg";

export const Timer = ({
  className = "",
  timeString,
  active,
  onPlay,
  onPause,
  onRemove
}) => (
  <div className={`timer ${className} ${active ? "timer_active" : ""}`.trim()}>
    <div className="timer__time">{timeString}</div>
    <button
      className="timer__control-button"
      title="Remove task"
      onClick={onRemove}
    >
      <Remove className="icon-cancel" />
    </button>

    <button
      className="timer__control-button"
      title={active ? "Pause" : "Play"}
      onClick={active ? onPause : onPlay}
    >
      {active ? (
        <Pause className="icon-pause" />
      ) : (
        <Play
          className="icon-play"
          width="35px"
          height="30px"
          viewBox="3 6 20 10"
        />
      )}{" "}
    </button>
  </div>
);
