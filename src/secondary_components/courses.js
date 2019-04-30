//module imports
import React, { Component } from "react";
import { BrowserRouter, Route, } from 'react-router-dom';
import { getList, addToList, updateItem, get_courses, get_students_by_id } from "../api_functions/http_api";
import "../styles/courses.css";
import Sidebar from "./sidebar";
import QuizMaker from './quiz_maker';


class Courses extends Component {
    constructor(props) {
        super(props);
        this.state = {
            number_of_students: '',
            course_id: '',
            courses: ['', ''],
            dataShown: 'course_list',
            redirect: false,
            page_title: "COURSES",
        }
    }


    //React Lifecycle function.
    componentDidMount() {
        var courseList = get_courses();
        courseList.then(data => { this.setState({ courses: data }) });
        courseList.then(data => { console.log(data) });
        // window.addEventListener('beforeunload', this.stop_reload());
        if (window.performance) {
            if (performance.navigation.type == 1) {
                this.props.history.push('/QuizMaker');
            }
        }
    }


    //Function that changes the page header.
    change_title() {
        this.setState({ page_title: "HASHES" });
    }


    //Function to get students by course id.
    get_students(course_id) {
        get_students_by_id(course_id).then(response => { this.setState({ courses: response.data, dataShown: 'student_list' }) });
    }


    //Main render function.
    render() {
        return (
            <BrowserRouter>
                <Sidebar />
                <div>
                    <div id="courses_container">
                        <div onClick={() => { this.test() }} id="title_font">{this.state.page_title}</div>
                        <div id="description">To see hashes registered in a course, select  acourse ID</div>
                        <div id="courses_container_internal">
                            {this.state.courses.map((item, index) => {
                                if (this.state.dataShown == "course_list") {
                                    return (
                                        <div onClick={() => { this.change_title(); this.get_students(item.id); }} id="course_buttons">
                                            {item.title}
                                        </div>
                                    )
                                }
                                else {
                                    return (
                                        <div id="course_buttons">
                                            {item}
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    </div>
                </div>
            </BrowserRouter >
        );
    }
}

export default Courses;
