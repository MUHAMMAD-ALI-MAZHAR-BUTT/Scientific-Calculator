
//------------------------------------------------------Import statements
import numeric_Inputs from "../data/numeric-input-data.js";
import operation_Inputs from "../data/operations-input-data.js"
import constant_Inputs from "../data/constant-input-data.js"
import action_Buttons from "../data/action-buttons.js"; 
//------------------------------------------------------Require Variables
let customVariables=[];                  // Array for keeping user-defined new variables
let validVariableNameFlag = false;     // validation  Flag variable for indicating  user correct input variable value format
let validVariableValueFlag = false;    // validation  Flag variable for indicating  user correct input variable name format
let userResultsHistory=[];                      // Array for keeping history of User Results
let primaryKey=0;                        // Primary key for custom Variables
const data = [
  { name:  numeric_Inputs, container: "numeric-inputs-container", class: "numeric-input-buttons" },
  { name: operation_Inputs, container: "operation-inputs-container", class: "operation-input-buttons" },
  { name: constant_Inputs, container: "operation-inputs-container", class: "constant-input-buttons" }
];


const customFunctions = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  sqrt: Math.sqrt,
  pow: Math.pow,
};

const customConstants = {
  pi: Math.PI,
  e: Math.E,
  infinity: Infinity,
};

//------------------------------------------------------DOM Manipulation

function insertElements(data) {
  data.forEach((element) => {
    element.name.forEach((e) => {
      document.getElementById(element.container).innerHTML += `<button class="btn ${element.class} m-1" type="button" value="${e.value}">${e.name}</button>`;
    });
  });
}

// Example usage
insertElements(data);

// Adding action buttons at runtime in a div having id=action-buttons-container
action_Buttons.forEach((element)=>{
    document.getElementById("action-buttons-container").innerHTML+=`<button class="btn m-1 action-buttons" type="button" id="${element.id}">${element.name}</button>`
})

//------------------------------------------------------Event Handling section

document.querySelector("#result-button").addEventListener("click",evaluated_Output);
//  Event Handling for validating user defined variable name
document
  .querySelector("#variable-name-input")
  .addEventListener("input", function () {
    ValidVariableName(this);
  });
//  Event Handling for validating user defined variable value
document
  .querySelector("#variable-value-input")
  .addEventListener("input", function () {
    ValidVariableValue(this);
  });
//  Event Handling for showing modal for taking input for new variable from user
  document
  .getElementById("add-variable-button")
  .setAttribute("data-bs-toggle", "modal");
// Event Handling (setting attributed for modal element to show modal properly)
  document
  .getElementById("add-variable-button")
  .setAttribute("data-bs-target", "#showmodal");
//  Handling Section:  Save User Input 
  document
  .querySelector("#variable-save-button")
  .addEventListener("click", SaveUserVariable);
// Event Handling for deleting complete History
document.getElementById("clear-history-button").addEventListener("click",clearHistory);

// Event Listener for Edit History Item
document.getElementById('history-section').addEventListener('click', function (event) {
  const editButton = event.target.closest('.edit-item');
  if (editButton) {
    editButton.closest('.alert').remove();
    const index = editButton.closest('.alert').dataset.index;
 editItem(index);
  }
});
// Event Listener for deleting particular history item
document.getElementById('history-section').addEventListener('click', function (event) {
  const closeButton = event.target.closest('.btn-close');
  if (closeButton) {
    const index = closeButton.closest('.alert').dataset.index;
    deleteSingleHistoryItem(index);
  }
});
// Event Handling for Numeric input buttons
document.querySelectorAll(".numeric-input-buttons").forEach((element)=>{
  element.addEventListener("click",(clickableitem)=>{
  appendInputExpression(clickableitem);
  })
})
 
// Event Handling for operation buttons (Event Delegation)
document.getElementById("operation-inputs-container").addEventListener("click", function(event) {
  const clickedButton = event.target;
  // Check if the clicked element is a button
  if (clickedButton.tagName === "BUTTON" && clickedButton.classList.contains("operation-input-buttons")) {
    // appending input expression 
   document.getElementById("input-expression").value+=clickedButton.innerText;
  }
  else if (clickedButton.tagName === "BUTTON" && clickedButton.classList.contains("custom-variable-buttons")) {
    // appending input expression 
   document.getElementById("input-expression").value+=clickedButton.innerText;
   //appending string to keep new input value
  }
});
// Event Handling for Constant input buttons
document.querySelectorAll(".constant-input-buttons").forEach((element)=>{
  element.addEventListener("click",(clickableitem)=>{
  appendInputExpression(clickableitem);
  })
})
// Event Handling for custom variable input buttons
 document.querySelectorAll(".custom-variable-buttons").forEach((element) => {
  element.addEventListener("click", (clickableitem) => {
    document.getElementById("input-expression").value+=clickableitem.target.innerText;
  });
});
// Event Handling for clearing Input
document.querySelector("#clear-button").addEventListener("click",()=>{
  document.getElementById("input-expression").value="";
  document.getElementById("output").value="";
})
// // Event delegation for custom user variable button clicks
// document.getElementById("operation-inputs-container").addEventListener("click", function(event) {
//   const clickedButton = event.target;
//   // Check if the clicked element is a button
//   if (clickedButton.tagName === "BUTTON" && clickedButton.classList.contains("custom-variable-buttons")) {
//     // appending input expression 
//    document.getElementById("input-expression").value+=clickedButton.innerText;
//    //appending string to keep new input value
//   }
// });
document.getElementById("cross-button").addEventListener("click",backspace_Button);
//--------------------------------------------User Defined Functions
// Function Get current Time 
function getCurrentTime() {
  // Create a new Date object
  let currentTime = new Date();
  // Get hours and minutes
  let hours = currentTime.getHours();
  let minutes = currentTime.getMinutes();
  // Determine AM/PM
  let ampm = hours >= 12 ? 'PM' : 'AM';
  // Convert hours to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (12 AM)
  // Add leading zero to minutes if needed
  minutes = minutes < 10 ? '0' + minutes : minutes;
  // Format the time
  let formattedTime = hours + ':' + minutes + ' ' + ampm;
  return formattedTime;
}
//   Validate User input variable name
function ValidVariableName(inputElement) {
  const userInput=String(inputElement.value);
  let flag=false;
  for(let i=0;i<customVariables.length;i++)
  { 
      if(customVariables[i].variableName==userInput)
      {
        document.getElementById("variable-save-button").disabled =true;
        validVariableNameFlag=false;
          flag=true;break;
      }
  }
  if(!flag){
  // validates user custom variable name function
  const regex = /^[a-zA-Z]+$/;
  validVariableNameFlag = regex.test(userInput)
    ? true
    : false;
  if (validVariableNameFlag && inputElement.value != "") {
    document.getElementById("variable-name-input").style.border =
      "1px solid blue";
    document.getElementById("variable-save-button").disabled =
      validVariableNameFlag && validVariableValueFlag ? false : true;
      document.getElementById("variable-name-label").innerText="";
  } else {
    document.getElementById("variable-name-input").style.border =
      "1px solid red";
    document.getElementById("variable-save-button").disabled =
      validVariableNameFlag && validVariableValueFlag ? false : true;
  }
 
  }else{
      document.getElementById("variable-name-label").innerText="Variable Name Already Exists";
  }
  
}
//   Validate User input variable value
function ValidVariableValue(inputElement) {
  // Valid user variable value  function
  const pattern = /^[+-]?\d+(\.\d+)?$/;
  validVariableValueFlag = pattern.test(String(inputElement.value))
    ? true
    : false;
  if (validVariableValueFlag && inputElement.value != "") {
    document.getElementById("variable-value-input").style.border =
      "1px solid blue";
    document.getElementById("variable-save-button").disabled =
      validVariableNameFlag && validVariableValueFlag ? false : true;
  } else {
    document.getElementById("variable-value-input").style.border =
      "1px solid red";
    document.getElementById("variable-save-button").disabled =
      validVariableNameFlag && validVariableValueFlag ? false : true;
  }
}
//   Save new custom user variable
function SaveUserVariable() {
  // save user variable
  let variable_Name = document.getElementById("variable-name-input").value;  //local variable for storing user input variable name
  let variable_Value = document.getElementById("variable-value-input").value;   //local variable for storing user input variable value
  if (variable_Name && variable_Value) {
    customVariables = [...customVariables, { variableName:variable_Name,variableValue: variable_Value }];
    document.getElementById("variable-name-input").value="";
    document.getElementById("variable-value-input").value="";
  //   Append New User Variable
      document.getElementById("operation-inputs-container").innerHTML+=`<button class="btn custom-variable-buttons m-1" type="button" value="${variable_Value}">${variable_Name}</button>`
  } else {
    document.getElementById("variable-save-button").disabled = true;
  }}
// Function to evaluate,display,store history of results of input expression
  function evaluated_Output() {
   try{
     const input=document.getElementById("input-expression").value;
    const output= (parseAndEvaluateExpression(input)).toFixed(4);
    console.log(output);
    document.getElementById('output').value = output;
    userResultsHistory = [{ Primary_ID:primaryKey,Input: input, Output: output }, ...userResultsHistory];
    primaryKey+=1;
    appendItemInUserHistory();
  }catch(error)
  {
    document.getElementById('output').value ="Invalid Input Expression"
  }
  }
  // Supporting Function to clear input and output fields
  function clearInputOutputFields(){
    document.getElementById("variable-name-input").value="";
    document.getElementById("variable-value-input").value="";
  }
//  Function to append new item in History display
  function appendItemInUserHistory()
{
document.getElementById("history-section").innerHTML=`<div class="alert alert-warning alert-dismissible fade show" history-items data-index="${userResultsHistory[0].Primary_ID}" role="alert">
${userResultsHistory[0].Input} = ${userResultsHistory[0].Output}
<p>${getCurrentTime()}</p>
<i class="fas fa-edit edit-item alert-dismissible"></i>
 <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>`+document.getElementById("history-section").innerHTML;
}  
 
// Input Expression Append Function
function appendInputExpression(clickableitem){
  document.getElementById("input-expression").value+=clickableitem.target.innerText;
}
// Function to delete Particular History Item
function deleteSingleHistoryItem(primaryKeyToDelete) {
  // Update userResultsHistory
  if (confirm("Are you sure you want to delete this item") == true) {
    // Use the filter method to create a new array excluding the element with the specified primaryKey
    userResultsHistory = userResultsHistory.filter((item) => item.Primary_ID != primaryKeyToDelete);
  }
}
// Function to clear history
function clearHistory()
{
  document.querySelector("#history-section").innerHTML="";
  clearInputOutputFields();
}
// Function to edit History Item
function editItem(primaryKeyToEdited)
{
  if(confirm("Are you sure you want to edit this item"))
  {
    
    userResultsHistory = userResultsHistory.filter((item) =>
     {
     if(item.Primary_ID==primaryKeyToEdited){
      let {Input,Output}=item;
      console.log(Input,Output)
      //specialCase for Edit Input
       document.getElementById("input-expression").value=Input;
      document.getElementById("output").value=Output;
     }
     else{
      return item;
     }
    }); 
  }
}

document.getElementById("input-expression").addEventListener('keydown', function(event) {
  // Check if the pressed key is Enter
  if (event.key === 'Enter') {
    // Evaluate Function called when Enter is pressed
    evaluated_Output();
  }
});
// Backspace button
function backspace_Button()
{
  document.getElementById("input-expression").value=( document.getElementById("input-expression").value).slice(0,-1);
}

function parseAndEvaluateExpression(inputExpression) {
  // Replace variable names, function names, and constants with their values
  const parsedExpression = replaceVariablesFunctionsAndConstants(inputExpression);
  try {
    // Evaluate the parsed expression
    const result = eval(parsedExpression);
    console.log(result);
    return result;
  } catch (error) { 
    return null;
  }
}
// Function to replace variable names, function names, and constants with their values
function replaceVariablesFunctionsAndConstants(expression) {
  // Regular expression to match variable names
  const variableRegex = /\b[a-zA-Z]+\b/g;

  // Replace each variable name with its value
  const parsedExpression = expression.replace(variableRegex, match => {
    const variable = customVariables.find(v => v.variableName === match);
    return variable ? variable.variableValue : match;
  });
  // Replace functions, constants, and additional supported functions with the corresponding JavaScript functions or values
  const functionsAndConstantsToReplace = ['sin', 'cos', 'tan', 'sqrt', 'pow', 'pi', 'e', 'infinity'];
  const functionAndConstantRegex = new RegExp(`\\b(${functionsAndConstantsToReplace.join('|')})\\b`, 'g');
  const finalExpression = parsedExpression.replace(functionAndConstantRegex, match => {
    // Check if the match is a supported function or constant
    if (customFunctions[match]) {
      // Replace the function with the corresponding JavaScript function
      return `customFunctions.${match}`;
    } else if (customConstants[match]) {
      // Replace the constant with its corresponding value
      return customConstants[match];
    } else {
      return match; // Return the original if not supported
    }
  });
  return finalExpression;
}

 