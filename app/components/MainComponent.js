import React, { Component } from "react";

export default class MainComponent extends React.Component {
  render() {
    return (
      <div className="CreateNew">
        <input
          type="text"
          //value={this.state.title}
          // onChange={this.handleChange}
          placeholder="Enter tracker name"
        />
        <button //  onClick={this.addNew}
        >
          Add
        </button>
      </div>
    );
  }
}
