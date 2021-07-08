// dependencies
const express = require('express');
const { createPromptModule } = require('inquirer');

const router = require('express').Router();

const inquirer = require('inquirer');
const { connect } = require('./db/connections');

const PORT = process.env.PORT || 3001;
const app = express();

const db = require('./db/connections')
const apiRoutes = require('./routes/api')

//middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.use('/api', apiRoutes)

// prompts
const startMenu = () => {
  inquirer.prompt({
    type: 'list',
    name: 'selectAction',
    message: 'What would you like to do?',
    choices: [
              'View Employees',
              'View Departments', 
              'View Roles', 
              'Add An Employee',
              'Add A Role', 
              'Add A Department', 
              'Update An Employee Role', 
              'Delete A Department', 
              'Delete A Role', 
              'Delete An Employee'
            ]
  })

  .then(action => {
        action = action.selectAction

        switch (action) {

        case 'View Employees':
            viewEmployees();
            break;  

        case 'View Departments':
            viewDepartments();
            break;

        case 'View Roles':
            viewRoles();
            break;

        case 'Add Employee':
            addEmployee();
            break;

        case 'Add Role':
            addRole();
            break;

        case 'Add Department':
            addDept();
            break;

        case 'Update Employee Role':
            selectEmployee();
            break;

        case 'Delete Department':
            selectDept();
            break;

        case 'Delete Role':
            chooseRoleDelete();
            break;

        case 'Delete Employee':
            chooseEmployeeDelete();
            break;
        }
    })
}

// user options
// view company departments
const viewDepartments = () => {
  const sql = 'SELECT * FROM departments';
  db.query(sql, (err, res) => {
    if (err) throw err
    console.table(res)
    startMenu();
  })
}

// view employee roles
const viewRoles = () => {
  const sql = 'SELECT roles.title, roles.id, roles.salary, departments.dept_name FROM roles JOIN departments ON roles.dept_id = departments.id';
  
  db.query(sql, (err, res) => {
    if (err) throw err
    console.table(res)
    startMenu();
  })
  }
  
  // view employees
  const viewEmployees= () => {
  
  const sql= `SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id, roles.title, roles.salary, departments.dept_name 
  FROM employees 
  JOIN roles ON employees.role_id = roles.id 
  JOIN departments ON roles.dept_id = departments.id 
  ORDER BY employees.id;`
  
  
    db.query(sql, (err, res) => {
    if (err) throw err
    console.table(res)
    startMenu();
    })
  }