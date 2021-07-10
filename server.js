// dependencies
const express = require('express');
const { createPromptModule } = require('inquirer');
const router = require('express').Router();
const inquirer = require('inquirer');
const { connect } = require('./db/connection');
const PORT = 3001;
const app = express();
const db = require('./db/connection')
const apiRoutes = require('./routes/apiRoutes')

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api', apiRoutes)

// prompts
const options = () => {
  inquirer.prompt({
    type: 'list',
    name: 'selectAction',
    message: 'What would you like to do?',
    choices: [
      'View Employees',
      'View Departments',
      'View Roles',
      'Add Employee',
      'Add Role',
      'Add Department',
      'Update Employee Role',
      'Delete Department',
      'Delete Role',
      'Delete Employee'
    ]
  })

    .then(action => {
      action = action.selectAction

      switch (action) {

        case 'View Employees':
          viewEmployees();
          break;

        case 'View Departments':
          viewDepts();
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
          selectEmp();
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

// start user options
// view departments
const viewDepts = () => {
  const sql = 'SELECT * FROM departments';
  db.query(sql, (err, res) => {
    if (err) throw err
    console.table(res)
    options();
  })
}

// view roles
const viewRoles = () => {
  const sql = 'SELECT roles.title, roles.id, roles.salary, departments.dept_name FROM roles JOIN departments ON roles.dept_id = departments.id';

  db.query(sql, (err, res) => {
    if (err) throw err
    console.table(res)
    options();
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
    options();
  })
}

// add options
// add department 
const addDept= () => {
  inquirer.prompt({
    type: 'input',
    name: 'dept_name',
    message: 'New department name?'
  })
    .then(newDept => {
      newDept = newDept.dept_name
      const sql = `INSERT INTO departments (dept_name) VALUES (?)`;
      const params = newDept
      db.query(sql, params, (err, result) => {
        if (err) throw err
        //console.table(result)
        console.log(`The ${newDept} department was added successfully.`)
        options();
      })
    })
}

// add a role to database
const addRole = () => {
  deptArr = []
  newRoleData = {}
  const sql = `SELECT dept_name FROM departments`;

  db.query(sql, (err, res) => {
    for (let i = 0; i < res.length; i++) {
      dept = res[i].dept_name
      deptArr.push(dept)
    }

    // new role info
    inquirer.prompt([{
      type: 'input',
      name: 'addRole',
      message: 'Job title of new role?'
    }, {
      type: 'input',
      name: 'addRoleSalary',
      message: 'Salary of new role?'
    }, {
      type: 'list',
      name: 'deptOfRole',
      message: 'Where does the new role belong?',
      choices: deptArr.map(dept => `${dept}`)
    }]).then(dept => {
      newRoleData.newRole = dept.addRole
      newRoleData.newSalary = dept.addRoleSalary
      newRoleData.dept = dept.deptOfRole

      const sql = `SELECT id FROM departments WHERE dept_name = ?`;
      const params = [newRoleData.dept]
      db.query(sql, params, (err, res) => {
        newRoleData.id = res[0].id
        completeAddRole(newRoleData);
      })
    })
  })
}

// inserts new role to database w/ mySQL
const completeAddRole = (newRoleData) => {
  const sql = `INSERT INTO roles (title, salary, dept_id) VALUES (?,?,?)`;
  const params = [newRoleData.newRole, newRoleData.newSalary, newRoleData.id]
  db.query(sql, params, (err, res) => {
    if (err) throw err;
    console.log(`${newRoleData.newRole} added successfully!`)
    options();
  })
}

// new employee object
newEmpData = {};

// add employee
const addEmployee = () => {
  roleArr = []

  const sql = `SELECT roles.title FROM roles`;
  db.query(sql, (err, res) => {
    if (err) throw err
    for (let i = 0; i < res.length; i++) {
      role = `${res[i].title}`
      roleArr.push(role)
    }

    // ask user information on new employee
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
        newEmpData.first_name = employee.first_name
        newEmpData.last_name = employee.last_name
        newEmpData.title = employee.title

        const sql = `SELECT id FROM roles WHERE roles.title = ?`
        const params = [newEmpData.title]
        db.query(sql, params, (err, res) => {
          newEmpData.role_id = res[0].id
          selectMgr(newEmpData);
        })
      })
  })
}

// inserts new employee data
const completeAddEmp = (newEmpData) => {
  const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) 
    VALUES (?,?,?,?)`;
  const params = [newEmpData.first_name, newEmpData.last_name, newEmpData.role_id, newEmpData.manager_id]

  db.query(sql, params, (err, result) => {
    if (err) {
      console.log(err)
    }
    console.log(`New ${newEmpData.title}, ${newEmpData.first_name} ${newEmpData.last_name}, added successfully.`)
    return options();
  })
}

// select manager 
const selectMgr = (newEmpData) => {

  const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title FROM employees JOIN roles ON employees.role_id = roles.id WHERE roles.title LIKE '%Manager%' OR roles.title LIKE '%Director%'`;

  db.query(sql, (err, res) => {
    for (let i = 0; i < res.length; i++) {
      manager = `${res[i].first_name} ${res[i].last_name}`, `${res[i].title}`
      managerArr.push(manager)
    }
    inquirer.prompt({
      type: 'list',
      name: 'manager',
      message: 'Select manager',
      choices: managerArr.map(manager => `${manager}`)
    }).then(manager => {
      newEmpData.manager = manager.manager

      let index = manager.manager.indexOf(" ")
      newEmpData.manager_first_name = manager.manager.substr(0, index)
      newEmpData.manager_last_name = manager.manager.substr(index + 1)
      const sql = `SELECT id FROM employees WHERE first_name = ? AND last_name = ?`;
      const params = [newEmpData.manager_first_name, newEmpData.manager_last_name]
      db.query(sql, params, (req, res) => {
        newEmpData.manager_id = res[0].id
        completeAddEmp(newEmpData)
      })
    })
  })
}

// update options
// empty employee 
let currentEmp = {}

// select the employee to update
const selectEmp = () => {
  EmployeeArray = []

  const sql = `SELECT * FROM employees`;
  db.query(sql, (err, res) => {
    if (err) throw err
    for (let i = 0; i < res.length; i++) {
      let employee = `${res[i].first_name} ${res[i].last_name}`
      EmployeeArray.push(employee)
    }
    inquirer.prompt({
      type: 'list',
      name: 'updateEmployee',
      message: 'Which employee would you like to update?',
      choices: EmployeeArray.map(employee => `${employee}`)

    }).then(employee => {
      let index = employee.updateEmployee.indexOf(" ")
      currentEmp.first_name = employee.updateEmployee.substr(0, index)
      currentEmp.last_name = employee.updateEmployee.substr(index + 1)

      const sql = `SELECT id FROM employees WHERE first_name = ? AND last_name = ?`;
      const params = [currentEmp.first_name, currentEmp.last_name]

      db.query(sql, params, (err, res) => {
        if (err) throw err;
        currentEmp.id = res[0].id
        chooseRole(currentEmp)
      })
    })
  })
}

