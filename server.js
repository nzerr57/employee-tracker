//Requirements
const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');


//Establishes connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'tracker_DB',
});


//Start Function that branches off depending where user selects
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
                updateRole();
            } else {
                connection.end();
            }
        });
};

//---------Start of Add Section -------------------------

//Starting add function that branches off
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

//Function to add a department
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

//Function to add a role
const addRole = () => {
    connection.query('SELECT * FROM department', (err, results) => {
        if (err) throw err;
        const allDepartments = results.map((department) => {
            return { name: department.department_name, value: department.id };
        });
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
                {
                    name: 'department_id',
                    type: 'rawlist',
                    message: 'What is the department for this role?',
                    choices: allDepartments,
                },

            ]).then((answer) => {

                connection.query(
                    `INSERT INTO role SET ?`,
                    {
                        title: answer.roleTitle,
                        salary: answer.roleSalary,
                        department_id: answer.department_id
                    },
                    (err) => {
                        if (err) throw err;
                        console.log('The new role has been added successfully!');
                        connection.query('SELECT * FROM role', (err, res) => {
                            if (err) throw err;
                            console.table(res);
                            start();
                        })
                    });
            });
    });
};

//Function to add an employee
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
                name: 'employeeRole',
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
                `INSERT INTO employee SET ?`,
                {
                    first_name: answer.employeeFirst,
                    last_name: answer.employeeLast,
                    role_id: answer.employeeRole,
                    manager_id: answer.employeeManager,
                },
                (err) => {
                    if (err) throw err;
                    console.log('The new employee has been added successfully!');
                    connection.query('SELECT * FROM employee', (err, res) => {
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
//Starting view function that branches off
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

//Function to view department table
const viewDepartments = () => {
    connection.query('Select * FROM department', (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
};

//Function to view role table
const viewRoles = () => {
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
};

//Function to view all employees
const viewEmployees = () => {
    connection.query(`SELECT first_name, last_name, manager_id, title, salary, name AS department
    FROM employee INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id`,

        (err, res) => {
            if (err) throw err;
            console.table(res);
            start();
        });
};
// END view section --------------

// START Update section

//Function to update an employee's role
const updateRole = () => {
    connection.query(`SELECT * FROM employee`, (err, res) => {
        if (err) throw err;
        const allEmployees = res.map((employee) => {
            return {
                name: employee.first_name + " " + employee.last_name,
                value: employee.id,
            };
        });
        connection.query('SELECT * FROM role', (err, results) => {
            if (err) throw err;

            const allRoles = results.map((role) => {
                return { name: role.title, value: role.id };
            });

            inquirer
                .prompt([
                    {
                        name: 'updateRole',
                        type: 'list',
                        message: "What employee do you want to update?",
                        choices: allEmployees,
                    },
                    {
                        name: 'newRole',
                        type: 'list',
                        message: 'What is this employee\'s new role?',
                        choices: allRoles,
                    },
                ]).then((answer) => {
                    connection.query(`UPDATE employee SET ? WHERE ?`,
                        [
                            {
                                role_id: answer.newRole,
                            },
                            {
                                id: answer.updateRole,
                            },
                        ],
                        (err) => {
                            if (err) throw err;
                            console.log("The role has been updated");
                            start();
                        }
                    );
                });
        });

    });
};

// END Update section

//Establishes connection and begins the start function
connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    start();
});

