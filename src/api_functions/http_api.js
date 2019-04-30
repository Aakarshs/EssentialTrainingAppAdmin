//module imports
import axios from "axios";

//var that contains the URL to the backend.
var backendUrl = "https://essential-training-app-api.herokuapp.com/api/";


//Calls the end-point to get the data from the backend.
export const getList = () => {
  return axios
    .get("https://essential-training-app-api.herokuapp.com/api/hashes/23/21/", {
      headers: {
        "Content-Type": "application/json"
      } //Let backend know that the data is JSON object.
    })
    .then(response => {
      return (response.data) //Return data if the function call was successful.
    }).catch(error => {
      console.log(error.response) //Log the error on the console if there was an error.
    });
};


//Calls the end-point to get the data from the backend.
export const get_courses = () => {
  return axios
    .get(backendUrl + "courses/?format=json", {
      headers: {
        "Content-Type": "application/json"
      } //Let backend know that the data is JSON object.
    })
    .then(response => {
      return (response.data) //Return data if the function call was successful.
    }).catch(error => {
    });
};


//Calls the end-point to get the data from the backend.
export const get_students_by_id = (course_id) => {
  return axios
    .get(backendUrl + "students/course/" + course_id + "/?format=json", {
      headers: {
        "Content-Type": "application/json"
      } //Let backend know that the data is JSON object.
    })
    .then(response => {
      return (response) //Return data if the function call was successful.
    }).catch(error => {
    });
};


//Calls the end-point to get the data from the backend.
export const get_quizzes_by_course = (course_id) => {
  return axios
    .get(backendUrl + "quizzes/course/" + course_id + "/?format=json", {
      headers: {
        "Content-Type": "application/json"
      } //Let backend know that the data is JSON object.
    })
    .then(response => {
      return (response) //Return data if the function call was successful.
    }).catch(error => {
    });
};


//Calls the end-point to get the data from the backend.
export const get_question_templates = () => {
  return axios
    .get(backendUrl + "question/templates/?format=json", {
      headers: {
        "Content-Type": "application/json"
      } //Let backend know that the data is JSON object.
    })
    .then(response => {
      return (response) //Return data if the function call was successful.
    }).catch(error => {
    });
};


//Calls the end-point to get the data from the backend.
export const get_hashes = (amount, course_id) => {
  return axios
    .get(backendUrl + "hashes/" + amount.toString() + "/" + course_id.toString() + "/?format=json", {
      headers: {
        "Content-Type": "application/json"
      } //Let backend know that the data is JSON object.
    })
    .then(response => {
      return (response) //Return data if the function call was successful.
    }).catch(error => {
    });
};



//Calls the end-point to get the data from the backend.
export const create_question_template = (type, inputs, outputs, input_type, text, output_template, variable_ranges, variable_type) => {
  var template = {
    "type": type,
    "template_json": {
      "inputs": inputs,
      "outputs": outputs,
      "input_type": input_type,
      "text": text,
      "output_template": output_template,
      "variable_ranges": variable_ranges,
      "variable_type": variable_type
    }
  }

  var acc = ""
  var formatted_json = JSON.stringify(template.template_json);

  for (var i = 0; i < formatted_json.length; i++) {
    if (formatted_json[i] == "\"") {
      acc = acc + "\\\""
    }
    else {
      acc = acc + formatted_json[i]
    }
  }

  template.template_json = formatted_json
  return axios.post(backendUrl + "create/question_template/",
    JSON.stringify(template)
    , {
      headers: {
        'Content-Type': "application/json"
      } //Let backend know that the data is JSON object.
    })
    .then(response => {
      console.log(response)
      return (response) //Return data if the function call was successful.
    })
    .catch(error => {
      console.log(error.response) //Log the error on the console if there was an error.
    });
};


//Calls the end-point to get the data from the backend.
export const create_quiz = (title, question_json, course_id) => {
  //Take in name,text,image and date as parameter and send it to the backend.
  var temp_obj = {
    "title": title,
    "question_json": question_json,
    "is_published": 1,
    "course_id": 1
  }

  return axios.post(backendUrl + "create/quiz/",
    JSON.stringify(temp_obj), {
      headers: {
        'Content-Type': "application/json"
      } //Let backend know that the data is JSON object.
    })
    .then(response => {
      return (response) //Return data if the function call was successful.
    })
    .catch(error => {
      return (error)
      alert(error.response);
      console.log(error.response) //Log the error on the console if there was an error.
    });
};