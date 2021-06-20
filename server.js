const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'tracker_DB',
});

const start = () => {
    inquirer
        .prompt({
            name: 'startQuestion',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'Add Department, Role, or Employee',
                'View departments, roles, and employees',
                'Update employee role',
                'EXIT'
            ],
        })
        .then((answer) => {
            if (answer.startQuestion === 'Add Department, Role, or Employee') {
                addFunction();
            } else if (answer.startQuestion === 'View departments, roles, and employees') {
                viewFunction();
            } else if (answer.startQuestion === 'Update employee role') {
                updateEmployee();
            } else {
                connection.end();
            }
        });
};

//---------Start of Add Section -------------------------

const addFunction = () => {
    inquirer
        .prompt({
            name: 'addChoice',
            type: 'list',
            message: 'What would you like to add?',
            choices: ['Department', 'Role', 'Employee'],
        }).then((answer) => {
            if (answer.addChoice === 'Department') {
                addDepartment();
            } else if (answer.addChoice === 'Role') {
                addRole();
            } else {
                addEmployee();
            }
        });
};

const addDepartment = () => {
    inquirer
        .prompt({
            name: 'newDepartment',
            type: 'input',
            message: 'What is the name of the new department?'
        }).then((answer) => {
            connection.query(
                `INSERT INTO department SET ?`,
                {
                    name: answer.newDepartment,
                },
                (err) => {
                    if (err) throw err;
                    console.log('The new department has been added successfully!');
                    connection.query('SELECT * FROM department', (err, res) => {
                        if (err) throw err;
                        console.table(res);
                        start();
                    }) 
                }
            );
        });
};

const addRole = () => {
    inquirer
    .prompt([
        {
        name: 'roleTitle',
        type: 'input',
        message: 'What is the title of the new role?',
        },
        {
            name: 'roleSalary',
            type: 'input',
            message: 'What is the salary of this role?',
        },
        
        ]).then((answer) => {
        connection.query(
            `INSERT INTO role SET ?`,
            {
                title: answer.roleTitle,
                salary: answer.roleSalary,
            },
            (err) => {
                if (err) throw err;
                console.log('The new role has been added successfully!');
                connection.query('SELECT * FROM role', (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    start();
                })
            }
        );
    });
};

const addEmployee = () => {
    inquirer
    .prompt([
        {
        name: 'employeeFirst',
        type: 'input',
        message: 'What is the first name of the employee?',
        },
        {
            name: 'employeeLast',
            type: 'input',
            message: 'What is the last name of the employee?',
        },
        {
            name: 'employeeRole'
            type: 'input',
            message: 'What is the employee\'s role id?',
        },
        {
            name: 'employeeManager',
            type: 'input',
            message: 'What is the employee\'s manager id?'
        }
        
        ]).then((answer) => {
        connection.query(
            `INSERT INTO role SET ?`,
            {
                first_name: answer.employeeFirst,
                last_name: answer.employeeLast,
                role_id:
                manager_id:
            },
            (err) => {
                if (err) throw err;
                console.log('The new role has been added successfully!');
                connection.query('SELECT * FROM role', (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    start();
                })
            }
        );
    });
};


// END Adding Section --------------------------------------------

// Start View section -------------------------------------
const viewFunction = () => {
    inquirer
        .prompt({
            name: 'viewSelection',
            type: 'list',
            message: 'Which would you like to view?',
            choices: ['Departments', 'Roles', 'Employees'],
        }).then((answer) => {
            if (answer.viewSelection === 'Departments') {
                viewDepartments();
            } else if (answer.viewSelection === 'Roles') {
                viewRoles();
            } else {
                viewEmployees();
            }
        });
};

const viewDepartments = () => {
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
};

const viewRoles = () => {
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
};

const viewEmployees = () => {
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
};
// END view section --------------

    connection.connect((err) => {
        if (err) throw err;
        console.log(`connected as id ${connection.threadId}`);
        start();
    });

