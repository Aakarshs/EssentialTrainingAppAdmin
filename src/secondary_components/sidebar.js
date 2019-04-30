//module imports
import React, { Component } from "react";
import "../styles/sidebar.css";
 
class Sidebar extends Component {
    
    render() {
        return (
            <div id="main_container_sidebar">
                <div id="container">
                    <a id="menu_buttons" href="HashGenerator">HashGenerator</a>
                     <a id="menu_buttons" href="Courses">Courses</a>
                     <a id="menu_buttons" href="QuizMaker">QuizMaker</a>
                     <a id="menu_buttons" href="statistics">Stats</a>
                     </div>
            </div>
        );
    }
}

export default Sidebar;