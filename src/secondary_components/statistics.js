//module imports
import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { getList, addToList, updateItem, get_courses, get_students_by_id, get_quizzes_by_course } from "../api_functions/http_api";
import "../styles/courses.css";
import Sidebar from "./sidebar";


class Statistics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            number_of_students: '',
            course_id: '',
            courses: ['', ''],
            dataShown: 'course_list'
        }
    }


    //Function to authenticate and push the course id to the next page.
    authenticate(course_id) {
        let { history } = this.props;
        history.push({
            pathname: '/quiz_by_course',
            course_id: course_id,
        });
    }


    //React Lifecycle functions.
    componentDidMount() {
        var courseList = get_courses();
        courseList.then(data => { this.setState({ courses: data }) });
        courseList.then(data => { console.log(data) });
    }


    //Main render function.
    render() {
        return (
            <BrowserRouter>
                <Sidebar />
                <div>
                    <div id="courses_container">
                        <div id="title_font">Statistics</div>
                        <div id="courses_container_internal">
                            {this.state.courses.map((item, index) => {
                                return (
                                    <div onClick={() => { this.authenticate(item.id) }} id="course_buttons">
                                        {item.title}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

export default Statistics;
