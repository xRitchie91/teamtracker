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
app.use(express.urlencoded({ extended: false }));
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
const viewEmployees = () => {
  const sql = `SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id, roles.title, roles.salary, departments.dept_name 
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

// add options (add roles, employee, dept, etc)
// add department to database
const addDept = () => {
  inquirer.prompt({
    type: 'input',
    name: 'dept_name',
    message: 'New department name?'
  })
    .then(newDept => {
      newDept = newDept.dept_name
      const sql = `INSERT INTO departments (dept_name) VALUES (?)`;
      const params = newDept
      db.query(sql, params, (err, _result) => {
        if (err) throw err
        console.log(`The ${newDept} department was added successfully.`)
        startMenu();
      })
    })
}

// add role to database here
const addRole = () => {
  deptArr = []
  newRoleData = {}
  const sql = `SELECT dept_name FROM departments`;

  db.query(sql, (_err, res) => {
    for (let i = 0; i < res.length; i + 1) {
      dept = res[i].dept_name
      deptArr.push(dept)
    }

    // new role information here
    inquirer.prompt([{
      type: 'input',
      name: 'addRole',
      message: 'Job title of the new role?'
    }, {
      type: 'input',
      name: 'addRoleSalary',
      message: 'New role salary?'
    }, {
      type: 'list',
      name: 'deptOfRole',
      message: 'New role department?',
      choices: deptArr.map(dept => `${dept}`)
    }]).then(dept => {
      newRoleData.newRole = dept.addRole
      newRoleData.newSalary = dept.addRoleSalary
      newRoleData.dept = dept.deptOfRole

      const sql = `SELECT id FROM departments WHERE dept_name = ?`;
      const params = [newRoleData.dept]
      db.query(sql, params, (_err, res) => {
        newRoleData.id = res[0].id
        completeAddRole(newRoleData);
      })
    })
  })
}

// adds new role to database w/ mySQL
const completeAddRole = (newRoleData) => {
  const sql = `INSERT INTO roles (title, salary, dept_id) VALUES (?,?,?)`;
  const params = [newRoleData.newRole, newRoleData.newSalary, newRoleData.id]
  db.query(sql, params, (err, _res) => {
    if (err) throw err;
    console.log(`${newRoleData.newRole} added successfully!`)
    startMenu();
  })
}

// new employee object
newEmployeeData = {};

// add an employee
const addEmployee = () => {
  roleArr = []

  const sql = `SELECT roles.title FROM roles`;
  db.query(sql, (err, res) => {
    if (err) throw err
    for (let i = 0; i < res.length; i + 1) {
      role = `${res[i].title}`
      roleArr.push(role)
    }

    // new employee prompts
    inquirer.prompt([{
      type: 'input',
      name: 'first_name',
      message: `Employee's first name:`
    }, {
      type: 'input',
      name: 'last_name',
      message: `Employee's last name:`
    }, {
      type: 'list',
      name: 'title',
      message: 'Select employee role',
      choices: roleArr.map(role => `${role}`)
    }])
      .then(employee => {
        managerArr = [];
        newEmployeeData.first_name = employee.first_name
        newEmployeeData.last_name = employee.last_name
        newEmployeeData.title = employee.title

        const sql = `SELECT id FROM roles WHERE roles.title = ?`
        const params = [newEmployeeData.title]
        db.query(sql, params, (_err, res) => {
          newEmployeeData.role_id = res[0].id
          selectManager(newEmployeeData);
        })
      })
  })
}

// inserts data on new employee into database
const completeAddEmployee = (newEmployeeData) => {
  const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) 
     VALUES (?,?,?,?)`;
  const params = [newEmployeeData.first_name, newEmployeeData.last_name, newEmployeeData.role_id, newEmployeeData.manager_id]

  db.query(sql, params, (err, _result) => {
    if (err) {
      console.log(err)
    }
    console.log(`New ${newEmployeeData.title}, ${newEmployeeData.first_name} ${newEmployeeData.last_name}, added successfully.`)
    return startMenu();
  })
}

