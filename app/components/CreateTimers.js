import React from "react";
import Play from "../icons/play.svg";

import {Timer} from "./Timer";

//convert seconds to HH:MM:SS
function formatTime(timeInSeconds = 0) {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds / 60) % 60);
  const seconds = Math.floor(timeInSeconds % 60);

  const paddedHours = hours.toString().padStart(2, "0");
  const paddedMinutes = minutes.toString().padStart(2, "0");
  const paddedSeconds = seconds.toString().padStart(2, "0");
  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
}

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

class CreateTimers extends React.Component {
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

  componentDidMount() {
    // fetching data from localstorage
    let fetchedLocalState = {};
    try {
      fetchedLocalState = localStorage.getItem("timeTrackerState");
      fetchedLocalState = JSON.parse(fetchedLocalState);
    } catch (err) {
      console.error(err);
    }
    //if have now previos sesion,
    if (fetchedLocalState === null) {
      localStorage.setItem("timeTrackerState", JSON.stringify(this.state));
    }
    // filter to find out time when the browser was closed
    else {
      if (fetchedLocalState.activeTaskId === null) {
      } else {
        const searchTerm = fetchedLocalState.activeTaskId;
        const fetchedLocalStateHiden = fetchedLocalState.tasks.find(
          task => task.id === searchTerm
        ).hiden;
        const fetchedLocalStateSeconds = fetchedLocalState.tasks.find(
          task => task.id === searchTerm
        ).secondsBeforPause;

        const mountDate = lastDate();
        const gapDate = mountDate - fetchedLocalStateHiden;
        const floorGapDate = Math.floor(gapDate / 1000);

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
    }
    //time loop
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
      activeTaskId: idCounter,
      inputValue: ""
    });
  };

  handleChange = e => {
    e.preventDefault();
    this.setState({
      inputValue: e.target.value
    });
  };

  handleKeyPress = e => {
    if (e.charCode == 13) {
      {
        this.addNewTask();
      }
    }
  };

  render() {
    const { tasks, activeTaskId } = this.state;

    return (
      <div>
        <div className="CreateNew">
          <input
            value={this.inputValue}
            type="text"
            onChange={this.handleChange}
            value={this.state.inputValue}
            onKeyPress={this.handleKeyPress}
            placeholder="Enter tracker name"
          />
          <button onClick={this.addNewTask}>
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
                    placeholder="Edit tracker name.."
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

export default CreateTimers;
