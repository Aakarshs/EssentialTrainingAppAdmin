import React, { Component } from 'react';
import "../styles/quiz_maker.css";
import Modal from 'react-modal';
import { BrowserRouter, Route, } from 'react-router-dom';
import { get_courses, get_question_templates, create_question_template, create_quiz } from "../ApiFunctions/http_api";
import Sidebar from './sidebar';
import { Select, AsyncSelect, MultiSelect } from 'dropdown-select';


const customStyles = {
  content: {
    borderWidth: 0,
    backgroundColor: "#F3F6F8",
  }
};


class QuizMaker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTemplateList: [],
      counter: "",
      test: "",
      inputs: ['Enter text here'],
      text: '',
      newText: "",
      refresh: false,
      variableNumber: 0,
      outputArray: '',
      outputs: [""],
      alloutput: [],
      selectedOutput: 0,
      modalIsOpen: false,
      quizTitle: '',
      quizTypes: [],
      finalQuiz: [],
      quiz_title: '',
      courses: [{ title: 'CS 228' }, { title: 'CS 310' }],
      backendInput: [],
      valueRanges: [],
      variableType: "",
      templates: '',
      minVarRange: '',
      maxVarRange: '',
      selectedCourse: "",
      alpha_index: 0,
      render_template_popup: false,
      template_no_correct: [],
      template_dropdown: false,
      course_dropdown: false,
      function_dropdown: false,
      template_id_list: [],
      question_json: '',
    };

    this.input = [];
    this.append_to_array = this.append_to_array.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handle_template_dropdown = this.handle_template_dropdown.bind(this);
  }

  reset_state() {
    this.setState({
      selectedTemplateList: [],
      counter: "sfs", test: "",
      inputs: ['Enter text here'],
      text: '',
      newText: "",
      refresh: false,
      variableNumber: 0,
      outputArray: '',
      outputs: [""],
      alloutput: [],
      selectedOutput: 0,
      modalIsOpen: false,
      quizTitle: '',
      quizTypes: [],
      finalQuiz: [],
      quiz_title: '',
      backendInput: [],
      valueRanges: [],
      variableType: "",
      minVarRange: '',
      maxVarRange: '',
      selectedCourse: "",
      alpha_index: 0,
      render_template_popup: false,
      template_no_correct: [],
      template_dropdown: false,
      course_dropdown: false,
      function_dropdown: false,
      question_json: '',
    })
  }

  //React Lifecycle Methods-----------------------------------------------------------------------------
  //React lifecycle method helper.
  stop_reload() {
    window.onbeforeunload = function () { return "Leaving the app may cause data loss." }
  }

  //React lifecycle method.
  componentDidMount() {
    window.addEventListener('beforeunload', this.stop_reload());
  }

  //React lifecycle method.
  componentWillUnmount() {
    this.stop_reload();
    window.removeEventListener('beforeunload', this.stop_reload());
  }
  //----------------------------------------------------------------------------------------------------


  //Function to extract templates from the form.
  get_templates() {
    var templateList = get_question_templates();
    var template_types = [];
    var template_ids = []
    return templateList.then(data => {
      return (data.data.map((item, index) => { return item })
      )
    })
  }


  //React lifecycle method.
  componentWillMount() {
    var courseList = get_courses();

    courseList.then(data => { console.log(data); this.setState({ courses: data }) })
    var temp;
    (this.get_templates().then(data => { this.setState({ templates: data.map(item => { return item }), template_ids: data.map(item => { return item[1] }) }) }))
      ;

    this.setState({ alpha_array: this.create_alphabet_array() })
  }


  //Function that handles opening the modal.
  openModal() {
    this.setState({ modalIsOpen: true });
  }


  //Function that handles closing the modal.
  closeModal() {
    this.setState({ modalIsOpen: false });
  }


  //Function to extract the variables.
  get_variables() {
    var temp_arr = this.state.inputs;
    var new_output_variables = [];
    for (var i = 0; i < temp_arr.length; i++) {
      if (this.validate_variables(temp_arr[i])) {
        new_output_variables.push(temp_arr[i][1])
      }
    }

    return (new_output_variables)
  }


  //Function to extract the quiz text.
  get_quiz_text() {
    let temp_arr = this.state.inputs;
    for (var i = 0; i < temp_arr.length; i++) {
      if (this.validate_variables(temp_arr[i])) {
        temp_arr[i] = "$"
      }

    }
    //  console.log(temp_arr.join(" "))
    return temp_arr.join(" ");
  }


  //Function that handles the dropdown event.
  handle_template_dropdown(event, template_id) {
    console.log(this.state.template_id_list);
    console.log(this.state.template_no_correct);
    this.setState({ selectedTemplateList: this.state.selectedTemplateList.concat(event) });
  }


  //Function to create question JSON.
  create_question_json() {
    var question_json = {}
    for (var i = 0; i < this.state.template_id_list.length; i++) {
      question_json[this.state.template_id_list[i].toString()] = parseInt(this.state.template_no_correct[i])
    }
    return (question_json)
  }


  //function to create an array of alphabets which are then used as variables.
  create_alphabet_array() {
    var alphabet = "abcdefghijklmnopqrstuvwxyz";
    var alpha_array = alphabet.split("");
    return alpha_array
  }


  //Function to push alphabet into the alpha array.
  push_alpha() {
    this.setState({ alpha_index: this.state.alpha_index + 1 })
    return (this.state.alpha_array[this.state.alpha_index])
  }

  //Funtion that checks if the variable is valid or not.
  validate_variables(variable) {
    var var_array =
      ['$a', '$b',
        '$c', '$d', '$e', '$f',
        '$g', '$h', '$i', '$j',
        '$k', '$l', '$m', '$n',
        '$o', '$p', '$q', '$r',
        '$s', '$t', '$u', '$v',
        '$w', '$x', '$y', '$z']
    return var_array.includes(variable)
  }

  //Function that appends a textbox or a variable to the canvas.
  async append_to_array(type) {
    this.setState({ newText: this.state.newText + this.state.text })
    console.log(this.state.inputs)

    switch (type) {
      case "text":
        this.setState({ inputs: this.state.inputs.concat(["string"]) });
        break;

      case "var":
        this.setState({ variableNumber: this.state.variableNumber + 1, inputs: this.state.inputs.concat(["$" + this.push_alpha()]) });
        var newbackendInput = []
        newbackendInput = this.state.backendInput.concat("a" + this.state.variableNumber.toString());
        this.setState({ backendInput: newbackendInput });

        break;

      default:
        this.setState({ inputs: this.state.inputs.concat([]) });
        break;
    }
    //console.log(this.state.newText)
    this.setState({ refresh: !this.state.refresh });
  }


  //Function that extracts the ranges from the input boxes.
  get_range() {
    var x = this.state.valueRanges;
    var newArr = []
    for (var i = 0; i < x.length; i = i + 1) {
      if (x[i][0] != "" && x[i][1] != "") {
        x[i][0] = parseInt(x[i][0]);
        x[i][1] = parseInt(x[i][1]);
        newArr.push(x[i])
      }
    }
    return (newArr)
  }

  //Function to refresh the state.
  refresh() {
    this.setState({ refresh: !this.state.refresh })
  }


  //Function to extract the output template and format it to send to the backend.
  get_output_template() {
    var temp_arrx = this.state.alloutput;
    var outputs = [];
    var output_collector = "";

    for (var i = 0; i < temp_arrx.length; i = i + 1) {
      if (temp_arrx[i - 1] == "ƒ:") {
        outputs.push(temp_arrx[i])
      }

      if (temp_arrx[i] == "ƒ:") {
        output_collector = output_collector + ""
      }
      else if (temp_arrx[i - 1] == "ƒ:") {
        output_collector = output_collector + " $ "
      }
      else {
        output_collector = output_collector + temp_arrx[i]
      }
    }

    return ([outputs, output_collector])
  }


  //Function to render the actual Pop up.
  render_popup() {
    var tempArray = []
    for (var i = 0; i < this.state.templates.length; i++) {
      tempArray.push(this.state.templates[i])
    }
    return tempArray
  }


  //Function to render the Pop up container.
  render_popup_container() {
    if (this.state.render_template_popup == true) {
      return (
        <div id="template_popup_container">
          {this.render_popup().map((item, index) => {
            return (<div id="template_popup" onClick={() => {
              this.setState({
                selectedTemplateList: this.state.selectedTemplateList.concat(item)
              })
            }}>
              {item}
            </div>)
          })}
        </div>)
    }
    else {
      return
    }
  }


  //Function that deletes the output element.
  delete_output_element(elem_to_delete) {
    var temp_arr = this.state.alloutput;
    temp_arr.splice(elem_to_delete, 1);
    this.setState({ alloutput: temp_arr })
  }


  //Function that renders teh output bar.
  render_output() {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>
        {this.state.alloutput.map((item, index) => {
          if (this.state.alloutput[index] == "ƒ:") {
            return (
              <div id="function_tag">  {this.state.alloutput[index]} </div>)
          }
          else if (this.state.alloutput[index - 1] == "ƒ:") {
            if (index == this.state.selected_output_index) {
              return (
                <div id="output_function_container_selected">

                  <input id="output_function_item_select" value={this.state.alloutput[index]} onClick={() => {
                    this.setState({ selected_output_index: index });
                  }} onChange={(e) => { var copy_array = this.state.alloutput; copy_array[index] = e.target.value; this.setState({ alloutput: copy_array }) }} />
                  <div id="delete_output_function" onClick={() => { this.delete_output_element(index); this.delete_output_element(index - 1); }}> x </div>
                </div>
              )
            }
            else {
              return (
                <div id="output_function_container">
                  <input id="output_function_item" value={this.state.alloutput[index]} onClick={() => { this.setState({ selected_output_index: index }); }} onChange={(e) => { var copy_array = this.state.alloutput; copy_array[index] = e.target.value; this.setState({ alloutput: copy_array }) }} />
                  <div id="delete_output_function" onClick={() => { this.delete_output_element(index); this.delete_output_element(index - 1); }}> x </div>
                </div>
              )
            }
          }
          else {
            return (
              <div id="output_text_container">
                <input id="output_text_item" value={this.state.alloutput[index]} onChange={(e) => { var copy_array = this.state.alloutput; copy_array[index] = e.target.value; this.setState({ alloutput: copy_array }) }} />
                <div id="delete_output_text" onClick={() => { this.delete_output_element(index) }}> x </div>
              </div>
            )
          }
        })}
      </div>
    )
  }


  //Function to reset the state.
  reset_then_set = (id, key) => {
    let temp = JSON.parse(JSON.stringify(this.state[key]));
    temp.forEach(item => item.selected = false);
    temp[id].selected = true;
    this.setState({
      [key]: temp
    });
    this.setState({ variableType: temp[id].title });
  }


  //Function to reset the state for courses.
  reset_then_set_courses = (id, key) => {
    this.setState({ selectedCourse: this.state.courses[id - 1].title })
  }


  //Function that renders the output variables.
  render_variables() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div id="output_container">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {this.state.inputs.map((item, index) => {
              //console.log("The current iteration is: " + index);
              if (this.validate_variables(item[0] + item[1])) {
                return (

                  <div id="output_variables"
                    onClick={() => {
                      var temp_array = this.state.alloutput;
                      temp_array[this.state.selected_output_index] = temp_array[this.state.selected_output_index] + item
                      this.setState({ alloutput: temp_array, refresh: !this.state.refresh })
                    }}
                    onChange={this.refresh.bind(this)}>
                    {item}
                  </div>

                )
              }
            }
            )}
          </div>

          <div>
            {this.state.valueRanges.map((item, index) => {
              return (
                <div id="range_input">
                  <div>
                    <input placeholder={"Min"} id="output_ranges" onChange={(e) => {
                      let temp = this.state.valueRanges;
                      temp[index][0] = parseInt(e.target.value);
                      this.setState({ valueRanges: temp, refresh: !this.state.refresh })
                    }} />
                  </div>

                  <div>
                    <input placeholder={"Max"} id="output_ranges" onChange={(e) => {
                      let temp = this.state.valueRanges;
                      temp[index][1] = parseInt(e.target.value);
                      this.setState({ valueRanges: temp, refresh: !this.state.refresh })
                    }} />
                  </div>
                </div>)
            })}

          </div></div>
      </div>
    )
  }


  //Function to delete elements from the canvas.
  delete_canvas_elements(elem_to_delete) {
    let temp_input_arr = this.state.inputs;
    temp_input_arr.splice(elem_to_delete, 1);

    let temp_ranges_arr = this.state.valueRanges;
    temp_ranges_arr.splice(0, 1);

    this.setState({ inputs: temp_input_arr, valueRanges: temp_ranges_arr, refresh: !this.state.refresh });
    this.forceUpdate();
  }


  //Function that renders the canvas.
  render_canvas() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div>
          <div id="canvas">

            <div id="canvas_buttons">
              <div id="add_variable" onClick={() => { this.append_to_array("var"); var temp = this.state.valueRanges; temp.push([0, 0]); this.setState({ valueRanges: temp }); console.log(this.state.valueRanges) }}> Add Variable </div>
              <div id="add_variable" onClick={() => { this.append_to_array("text"); }}> Add Textbox </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
              {this.state.inputs.map((item, index) => {
                if (this.validate_variables(item[0] + item[1])) {
                  return (
                    <div id="variable_container">
                      <div id="delete_variable" onClick={() => { this.delete_canvas_elements(index) }}> x </div>
                      <input id="variables" value={item} onChange={this.refresh.bind(this)} />
                    </div>
                  )
                }
                else {
                  return (
                    <div id="canvas_text_container">
                      <div id="delete_canvas_text" onClick={() => { this.delete_canvas_elements(index) }}> x </div>
                      <input
                        onChange={(e) => {
                          this.input = this.state.inputs;
                          this.input[index] = e.target.value;
                          this.setState({ refresh: !this.state.refresh })
                        }}
                        id="canvas_text_item"
                        style={{ width: this.state.inputs[index].length * 9 }}
                        placeholder={this.state.inputs[index]} />
                    </div>
                  )
                }
              }

              )}
            </div>
          </div>
        </div>

      </div>

    )
  }

  //Function that deletes the elements of the template.
  delete_template_elements(elem_to_delete) {
    var temp_arr = this.state.selectedTemplateList;
    temp_arr.splice(elem_to_delete, 1);
    this.setState({ selectedTemplateList: temp_arr })
  }

  handleChange = idx => selected => {
    const { label, value } = selected;
    // rest of your code
  };


  //Renders the template selector dropdown.
  render_template_selector_dropdown() {
    return (
      this.state.selectedTemplateList.map((item, index) => {
        return (
          <div id="selected_template">
            <div id="selected_template_delete" onClick={() => { this.delete_template_elements(index) }}> x </div>
            <div id="selected_template_item"> {item} </div>
            <div>
              <input id="selected_template_range" placeholder={"Enter Range"} value={this.state.template_no_correct[index]} onChange={(e) => {
                var temp = this.state.template_no_correct;
                temp[index] = e.target.value;
                this.setState({ template_no_correct: temp, refresh: !this.state.refresh })
              }} />
            </div>
          </div>
        )
      }))
  }


  //Toggles the template dropdown
  toggle_template_dropdown() {
    this.setState({ template_dropdown: !this.state.template_dropdown, refresh: !this.state.refresh })
  }

  //Toggles the courses dropdown menu.
  toggle_course_dropdown() {
    this.setState({ course_dropdown: !this.state.course_dropdown, refresh: !this.state.refresh })
  }

  //Toggles the function dropdown menu.
  toggle_function_dropdown() {
    this.setState({ function_dropdown: !this.state.function_dropdown, refresh: !this.state.refresh })
  }

  //Renders the template dropdown menu.
  render_template_dropdown() {
    var template_list = this.state.templates;
    var temp = [];
    for (var i = 0; i < template_list.length; i++) {
      temp.push(template_list[i])
    }
    return (
      <div>
        <div id="template_dropdown_list"> {temp.map((item, index) => {
          return (
            <div onClick={() => {
              this.handle_template_dropdown(item.type, item.id);
              let temp = this.state.template_id_list;
              temp.push(item.id);
              this.setState({ template_id_list: temp, template_dropdown: false })
            }} value={index}>
              <div id="template_list_items">{item.type}</div>
            </div>)
        })}
        </div>
      </div>
    )
  }

  //Renders the course dropdown menu.
  render_course_dropdown() {
    return (
      <div id="course_dropdown_list"> {this.state.courses.map((item, index) => {
        return (<div onClick={() => {
          this.setState({ selectedCourse: item.title, course_dropdown: false, selected_course_id: item.id })
        }} value={index}>
          <div id="course_list_items">{item.title}</div>
        </div>)
      })}
      </div>
    )
  }


  //Renders teh function list dropdown menu.
  render_function_dropdown() {
    var function_list = ['cos()', 'sin()', '+', '-', '*', '/'];

    return (
      <div>
        <div id="function_dropdown_list"> {function_list.map((item, index) => {
          return (
            <div>
              <div onClick={() => {
                var temp_array = this.state.alloutput;
                temp_array[this.state.selected_output_index] = temp_array[this.state.selected_output_index] + item
                this.setState({ alloutput: temp_array, refresh: !this.state.refresh })
              }} id="function_list_items">{item}</div>
            </div>)
        })}
        </div>
      </div>
    )
  }


  //Function that checks form validation.
  validate_form() {
    if (this.state.alloutput.length == 0 ||
      this.state.valueRanges.length == 0 ||
      this.state.inputs == 0
    ) {
      return false
    }
    else {
      return true
    }
  }


  //Checking for appropriate authentication message.
  authentication_message(message) {
    if (message == false) {
      return ("Oopsies!")
    }
    else {
      return ("SUCCESS!!!")
    }
  }

  //Function that sends the template to the backend.
  save_template() {
    if (this.validate_form() == false) {
      alert("please fill in all the fields.")
    }
    else {
      this.closeModal();
      create_question_template(this.state.quizTitle,
        this.get_variables(), this.get_output_template()[0], "regular",
        this.get_quiz_text(), this.get_output_template()[1], this.get_range(),
        "real").then((data) => { return (alert(this.authentication_message(data.data.success) + '\n' + data.data.error)) });
    }
  }


  //Function that validates publishing the quiz.
  validate_publish_quiz() {
    if (this.state.template_no_correct == undefined || this.state.template_no_correct.length <= 0) {
      console.log("waht")
      return false
    }

    for (var i = 0; i < this.state.template_no_correct.length; i++) {
      console.log(this.state.template_no_correct[i])
      if (this.state.template_no_correct[i] == [] ||
        isNaN(parseInt(this.state.template_no_correct[i])) == true ||
        this.state.template_no_correct[i] == 0 ||
        this.state.template_no_correct[i] == null ||
        this.state.template_no_correct[i] == undefined ||
        this.state.template_no_correct[i] == "") {

        return false
      }
    }

    if (this.state.selected_course_id == "" || this.state.quiz_title == "" || this.state.selected_course_id == "") {
      return false
    }

  }

  //Function that sends the quiz to the backend.
  publish_quiz() {
    if (this.validate_publish_quiz() == false) {
      alert("Make sure all fields have been filled before trying to publish the quiz.")
    }
    else {
      create_quiz(this.state.quiz_title, JSON.stringify(this.create_question_json()), this.state.selected_course_id).
        then((data) => { return (alert(this.authentication_message(data.data.success))) });
    }
  }


  //Renders the title bar.
  render_title_input() {
    return (
      <div id="quiz_title_input_container">
        <div onClick={() => { console.log("wooo"); console.log(this.get_quiz_text()) }}>  Enter Template Title </div>
        <input id="quiz_title_input" value={this.state.quiz_title} onChange={(e) => { this.setState({ quiz_title: e.target.value }) }} />
      </div>
    )
  }

  //The main render function.
  render() {
    //Conditional dropdown renderings.
    if (this.state.course_dropdown === true) {
      var course_dropdown = this.render_course_dropdown();
    }
    else {
      course_dropdown = null;
    }
    if (this.state.template_dropdown === true) {
      var template_dropdown = this.render_template_dropdown();
    }
    else {
      template_dropdown = null;
    }
    if (this.state.function_dropdown === true) {
      var function_dropdown = this.render_function_dropdown();
    }
    else {
      function_dropdown = null;
    }


    return (
      <BrowserRouter>
        <Sidebar />

        <div style={{ backgroundColor: "#EFF0F2", width: "100%", height: 1000 }}>
          <div id="title_font_quiz_maker">{this.state.page_title}</div>
          <div id="description_quiz_maker">Here you can make a quiz. To create a template,
          select a course, and then Create Template! To create a quiz, Pick template IDs,
          how many questions you want students to answer correctly before moving on,
          and publish!
          </div>
          <div id="quiz_maker_container">

            <div id="template_maker">
              <div id="template_maker_header">
                <div id="template_maker_inner_container">


                  <div onClick={() => { this.create_question_json() }} id="template_maker_title">Quiz</div>
                  {this.render_title_input()}

                  <div>
                    <div id="template_selector_dropdown" onClick={() => { this.toggle_template_dropdown() }}>Select Template</div>
                    {template_dropdown}
                  </div>
                  {this.render_template_selector_dropdown()}

                </div>
              </div>
              <div> {this.state.quizTypes.map((item, index) => { return (<div id="quiz_types"> {this.state.quizTypes[index]}</div>) })} </div>
            </div>
            <div id="right_container">
              <div id="course_selector">
                <div id="course_selector_internal_container">
                  <div id="template_maker_title">Courses</div>

                  {/* COURSE SELECTOR DROPDOWN */}
                  <div id="course_selector_dropdown" onClick={() => { this.toggle_course_dropdown() }}>Select Course</div>
                  {course_dropdown}
                  <div id="selected_course">  {this.state.selectedCourse} </div>
                </div>
              </div>
              <div onClick={this.openModal.bind(this)} id="create_template_button">Create Template</div>
              <div onClick={() => {
                // this.create_question_json();
                this.publish_quiz();
                this.reset_state();
              }} id="publish_button">Publish Quiz</div>
            </div>
          </div>

          {/* TEMPLATE MAKER MODAL */}
          <Modal id="modal" style={customStyles} isOpen={this.state.modalIsOpen} onAfterOpen={this.afterOpenModal}>
            <form>

              <div onClick={() => { console.log("wooo"); console.log(this.get_quiz_text()) }}>  Enter Template Title </div>

              <div onClick={() => { this.closeModal() }}>close</div>
              <div style={{ position: 'absolute' }}>
                <div id='main_container'>
                  <div>
                    <div id="template_maker_title" >Template Maker</div>


                    {/*TITLE*/}
                    <div style={{ display: 'flex', flexDirection: "column" }}>
                      {/*===================================================================*/}
                      {/*===================================================================*/}
                      <div style={{ display: 'flex', flexDirection: "row" }}>
                        {/*===================================================================*/}
                        {/*===================================================================*/}
                        <div>
                          <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <div id="enter_quiz_title_text">Enter Template Title</div>
                              <div><input id="quiz_title_text" onChange={(e) => { this.setState({ quizTitle: e.target.value }) }} /> </div>
                            </div>
                          </div>
                          {this.render_canvas()}
                        </div>
                        {/*===================================================================*/}
                        {/*===================================================================*/}
                        <div >
                          <div style={{ marginLeft: 30 }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <div id="math_title">Variables Used </div>
                              <div style={{ width: 300 }}>These are the variables used in this quiz template. In the
                              boxes to the right, put in the minimum and maximum range that the variables should be generated within.</div>
                              <div style={{ width: 400, flexWrap: 'wrap' }}>
                                <div>{this.render_variables()}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/*===================================================================*/}
                        {/*===================================================================*/}
                      </div>


                      <div style={{ position: 'absolute', marginTop: 400 }}>
                        <div>
                          <div id="output_title">Outputs</div>
                          <div style={{ width: 500 }}>Almost there! Here you need to tell us how the output is going to be calculated.
                            If it is just a calculation, pick add function, and write the solution inside, using the variable names (e.g. a+b),
                            without the $ sign. Click on save template when you are done.</div>
                          <div id="output_functions">
                            <div id="add_variable" onClick={() => { this.setState({ alloutput: this.state.alloutput.concat(""), refresh: !this.state.refresh }) }}>Add Text</div>
                            <div id="add_variable" onClick={() => { this.setState({ alloutput: this.state.alloutput.concat("ƒ:", "") }) }}>Add Function</div>
                            {function_dropdown}
                            <div id="add_variable" onClick={() => { this.toggle_function_dropdown() }} >Input Function</div>
                          </div>
                        </div>
                        <div>
                          <div id="output_container">
                            <div>{this.render_output()}</div>
                          </div>
                        </div>
                      </div>

                    </div>
                    <div id="save_template_button" onClick={() => { this.save_template(); this.reset_state(); }}> Save Template  </div>
                  </div>
                </div>
              </div>
            </form>
          </Modal>
        </div>

      </BrowserRouter>
    );
  }
}

export default QuizMaker;
