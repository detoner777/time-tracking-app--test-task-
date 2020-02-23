import React from "react";
import Play from "../icons/play.svg";
import Pause from "../icons/pause.svg";
import Remove from "../icons/remove.svg";

function formatTime(timeInSeconds = 0) {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds / 60) % 60);
  const seconds = Math.floor(timeInSeconds % 60);

  const paddedHours = hours.toString().padStart(2, "0");
  const paddedMinutes = minutes.toString().padStart(2, "0");
  const paddedSeconds = seconds.toString().padStart(2, "0");
  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
}

const Timer = ({
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

function carentDate() {
  const ld = new Date();
  return `${ld.toLocaleDateString()}  || ${ld
    .toLocaleTimeString()
    .slice(0, -3)} `;
}
function lastDate() {
  const bd = new Date();
  return `${bd.getTime()}`;
}

const defaultState = {
  idCounter: 1,
  activeTaskId: null,
  tasks: []
};

class MainComponent extends React.Component {
  constructor(props) {
    super(props);

    let preservedState = {};

    try {
      preservedState = localStorage.getItem("timeTrackerState");
      preservedState = JSON.parse(preservedState);
    } catch (err) {
      console.error(err);
    }

    this.state = {
      ...defaultState,
      ...preservedState
    };
  }

  // componentDidUpdate() {
  //   localStorage.setItem("timeTrackerState", JSON.stringify(this.state));
  // }

  componentDidMount() {
    let fetchedLocalState;
    try {
      fetchedLocalState = localStorage.getItem("timeTrackerState");
      fetchedLocalState = JSON.parse(fetchedLocalState);
    } catch (err) {
      console.error(err);
    }
    if (fetchedLocalState.activeTaskId === null) {
      console.log(42);
    } else {
      const searchTerm = fetchedLocalState.activeTaskId;
      const fetchedLocalStateHiden = fetchedLocalState.tasks.find(
        task => task.id === searchTerm
      ).hiden;
      const fetchedLocalStateSeconds = fetchedLocalState.tasks.find(
        task => task.id === searchTerm
      ).secondsBeforPause;
      // console.log(fetchedLocalStateSeconds);

      const mountDate = lastDate();
      const gapDate = mountDate - fetchedLocalStateHiden;
      const floorGapDate = Math.floor(gapDate / 1000);
      // console.log(floorGapDate);
      this.setState(({ activeTaskId, tasks }) => {
        if (activeTaskId === null) {
          return;
        }
        return {
          tasks: tasks.map(task =>
            task.id !== activeTaskId
              ? task
              : {
                  ...task,
                  seconds: floorGapDate + fetchedLocalStateSeconds
                }
          )
        };
      });
    }

    setInterval(() => {
      this.setState(
        ({ activeTaskId, tasks }) => {
          if (activeTaskId === null) {
            return;
          }
          return {
            tasks: tasks.map(task =>
              task.id !== activeTaskId
                ? task
                : {
                    ...task,
                    seconds: task.seconds + 1,
                    hiden: task.hiden
                  }
            )
          };
        },
        () => {
          localStorage.setItem("timeTrackerState", JSON.stringify(this.state));
        }
      );
    }, 1000);
  }

  addNewTask = () => {
    const { idCounter, tasks, inputValue } = this.state;
    let titleValue =
      inputValue === "" ? (titleValue = carentDate()) : inputValue;
    this.setState({
      tasks: tasks.concat({
        id: idCounter,
        title: titleValue,
        seconds: 0,
        hiden: +lastDate(),
        secondsBeforPause: 0
      }),
      idCounter: idCounter + 1,
      activeTaskId: idCounter
    });
  };

  setLocalStorage = () => {
    localStorage.setItem("timeTrackerState", JSON.stringify(this.state));
  };

  render() {
    const { tasks, activeTaskId } = this.state;

    return (
      <div>
        <div className="CreateNew">
          <input
            type="text"
            onChange={e => {
              const title = e.target.value;
              this.setState({
                inputValue: title
              });
            }}
            placeholder="Enter tracker name"
          />
          <button
            onClick={this.addNewTask}
            onKeyDown={e => {
              if (e.keyCode === 13) {
                this.setState({
                  inputValue: title
                });
              }
            }}
          >
            {" "}
            <Play
              className="icon-play"
              width="40px"
              height="35px"
              viewBox="2 6 20 10"
            />
          </button>
        </div>
        <div className="tasks page">
          <div className="tasks__list">
            {tasks
              .sort((a, b) => (b.id > a.id ? 1 : -1))
              .map(({ id, title, seconds }, index) => (
                <div
                  key={id}
                  className={`task${id === activeTaskId ? " task_active" : ""}`}
                >
                  <input
                    className="task__input"
                    placeholder="Enter the name of task..."
                    value={title}
                    onChange={e => {
                      const title = e.target.value;
                      this.setState({
                        tasks: tasks.map((task, taskIndex) =>
                          index !== taskIndex ? task : { ...task, title }
                        )
                      });
                    }}
                  />
                  <Timer
                    className="task__timer"
                    timeString={formatTime(seconds)}
                    active={activeTaskId === id}
                    onPlay={() => {
                      this.setState({
                        activeTaskId: id,
                        tasks: tasks.map((task, taskIndex) =>
                          index !== taskIndex
                            ? task
                            : {
                                ...task,
                                hiden: +lastDate()
                              }
                        )
                      });
                    }}
                    onPause={() => {
                      this.setState({
                        activeTaskId: null,
                        tasks: tasks.map((task, taskIndex) =>
                          index !== taskIndex
                            ? task
                            : { ...task, secondsBeforPause: seconds }
                        )
                      });
                    }}
                    onRemove={() => {
                      this.setState({
                        activeTaskId: activeTaskId === id ? null : activeTaskId,
                        tasks: tasks.filter(
                          (_, taskIndex) => index !== taskIndex
                        )
                      });
                    }}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }
}

export default MainComponent;
