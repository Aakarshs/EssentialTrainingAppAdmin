//module imports
import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { get_hashes } from "../api_functions/http_api";
import Sidebar from "./sidebar";
import "../styles/hash_generator.css";
import { CSVLink, CSVDownload } from "react-csv";

class HashGenerator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number_of_students: "",
      course_id: "",
      hashes: []
    };
  }

  //Function that gets the hashes from the backend.
  get_hashes_caller() {
    get_hashes(this.state.number_of_students, this.state.course_id).then((data) => {
      var output_hash_list = data.data.hashes.map((item) => {
        return [item]
      }
      )
      this.setState({ hashes: output_hash_list })
    })
  }

  //Function that validates the length of the hashes.
  validate_hash_length() {
    if (this.state.hashes.length > 0) {
      return true
    }
    else {
      return false
    }
  }

  //main render function.
  render() {
    if (this.validate_hash_length()) {
      var download_button =
        <div id="generate_button">
          <CSVLink data={this.state.hashes}>Download me</CSVLink>
        </div>
    }
    else {
      var download_button = null;
    }
    return (
      <BrowserRouter>
        <Sidebar />
        <div id="hash_generator_container">
          <div id="title">HASH <br />GENERATOR</div>
          <div className="HashGenerator">
            <div id="hash_generator_form">

              <div>
                <div id="text"> Course ID  </div>
                <input
                  id="text_input"
                  placeholder={"Enter the course ID"}
                  value={this.state.course_id}
                  onChange={e => {
                    this.setState({ course_id: e.target.value });
                  }}
                />
              </div>

              <div>
                <div id="text">Number of Students </div>
                <input
                  placeholder={"Enter the number of students"}
                  id="text_input"
                  value={this.state.number_of_students}
                  onChange={e => {
                    this.setState({ number_of_students: e.target.value });
                  }}
                />

              </div>
            </div>
            <div id="generate_button" onClick={() => { this.get_hashes_caller(); }}> Generate Hashes </div>
            {download_button}
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default HashGenerator;
