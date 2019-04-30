//module imports
import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { getList, addToList, updateItem, get_courses, get_students_by_id, get_quizzes_by_course } from "../api_functions/http_api";
import "../styles/courses.css";
import Sidebar from "./sidebar";
import axios from "axios";


class Quiz_logs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            number_of_students: '',
            course_id: '',
            courses: [],
            dataShown: 'course_list',
            refresh: true,
        }
    }


    //React lifecycle function.
    async componentWillMount() {
        console.log(this.props.location.course_id);
        //http://essential-training-app-api.herokuapp.com/api/logs/quiz/1/?
        await axios.get("https://essential-training-app-api.herokuapp.com/api/logs/quiz/" + this.props.location.quiz_id + "/?format=json")
            .then(response => {
                console.log(response)
                this.setState({ courses: (response.data) }, () => { this.setState({ refresh: !this.state.refresh }); });
            })
            .catch(function (error) {
                console.log(error);
            })

    }

    //Function to get students by course id.
    get_students(course_id) {
        get_quizzes_by_course(course_id).then(response => { this.setState({ courses: response.data, dataShown: 'student_list' }) });
    }


    //main render function.
    render() {
        return (
            <BrowserRouter>
                <Sidebar />
                <div>
                    <div id="courses_container">
                        <div id="title_font">Logs</div>
                        <div id="description">Here you can see information about how
                        the students did on the quiz. </div>
                        <div id="courses_container_internal">  <div id="stat_container">
                            {this.state.courses.map((item, index) => {
                                return (

                                    <div id="stat_internal_container">
                                        <div id="stat_title">Total Questions</div>
                                        <div id="stat_value">{item.num_questions}</div>
                                        <div id="stat_title">Incorrect Answers</div>
                                        <div id="stat_value">{item.num_incorrect}</div>
                                        <div id="stat_title">Start Time</div>
                                        <div id="stat_value">{item.start_time}</div>
                                        <div id="stat_title">End Time</div>
                                        <div id="stat_value">{item.end_time}</div>
                                    </div>

                                )
                            })}
                        </div>
                        </div>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

export default Quiz_logs;
