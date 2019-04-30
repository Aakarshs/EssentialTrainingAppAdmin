import React, { Component } from 'react';
import QuizMaker from './secondary_components/quiz_maker';
import { BrowserRouter, Route, } from 'react-router-dom';
import HashGenerator from './secondary_components/hash_generator';
import Courses from './secondary_components/courses';
import Quiz_by_course from './secondary_components/quiz_by_course';
import Statistics from './secondary_components/statistics';
import Quiz_logs from './secondary_components/quiz_logs';


class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route component={(props) => <QuizMaker {...props} />} exact={true} path='/QuizMaker' />
          <Route exact={true} path='/HashGenerator' render={() => (
            <div className="App">
              <HashGenerator />
            </div>
          )} />
          <Route component={(props) => <Courses {...props} />} exact={true} path='/Courses' ></Route>
          <Route component={(props) => <Quiz_by_course {...props} />} exact={true} path='/quiz_by_course' />
          <Route component={(props) => <Statistics {...props} />} exact={true} path='/statistics' />
          <Route component={(props) => <Quiz_logs {...props} />} exact={true} path='/quiz_logs' />
        </div>
      </BrowserRouter>
    );
  }
}
export default App;