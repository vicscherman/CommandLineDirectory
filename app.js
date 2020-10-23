const express = require ('express');
const inquirer = require ('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');
const figlet = require('figlet');
 
console.log(figlet.textSync('Cyberdine Systems E.M.S.', {
    font: 'Cyberlarge',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true
}));




class Database {
    constructor( config ) {
        this.connection = mysql.createConnection( config );
    }
    query( sql, args=[] ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
  }

  const db = new Database({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "Amandaforever69",
      database: "employeeManager"
    
  });

  
  async function main(){
      
    
      promptAnswers = await inquirer.prompt({
          name: 'startPrompt',
          type: 'list' ,
          message: 'Welcome to Cyberdine Systems EMS. What would you like to do?',
          choices: ['Add Department','Add Role','Add Employee','View Departments','View Roles','View Employees','Update Employee','Update Employee Manager','Delete Department','Delete Role','Delete Employee', 'Exit']
      })
      userSelection = promptAnswers.startPrompt

      if (promptAnswers.startPrompt == 'Add Department'){
          promptAddDepartment = await inquirer.prompt([
              {name: 'deptName' , type: 'input' , message : 'What is the name of the department you wish to add? (max 30 characters)'},
              
          ]);

          await db.query("INSERT INTO department (`name`)VALUES(?)",[promptAddDepartment.deptName])
          
          

      }

      if(promptAnswers.startPrompt == 'Add Role'){
          promptAddRole = await inquirer.prompt([
              {name: 'roleName' , type: 'input' , message : 'What is the name of the role you wish to add? (max 30 characters)' },
              {name: 'roleSalary' , type :'input', message: 'What is the salary for this role?' },
              {name: 'deptId' , type: 'input' , message: 'Please input the  DEPARTMENT ID NUMBER of the department this role belongs to.'}

          ]);

          await db.query("INSERT INTO role ( `title`, `salary`, `department_id`)VALUES(?,?,?)",[ promptAddRole.roleName, promptAddRole.roleSalary, promptAddRole.deptId])
      }

      if(promptAnswers.startPrompt == 'Add Employee'){
        promptAddEmployee = await inquirer.prompt([
            {name: 'firstName' , type: 'input' , message : 'What is the employees first name?' },
            {name: 'lastName' , type :'input', message: 'What is the employees last name?' },
            {name: 'roleId' , type: 'input' , message: 'Please input the employees role with their ROLE ID NUMBER'},
            {name: 'managerId' , type: 'input' , message: 'Please enter the MANAGER ID of this employees manager(null if no manager)'}
        ]);


        await db.query("INSERT INTO employee ( `first_name`, `last_name`, `role_id`, `manager_id`)VALUES(?,?,?,?)",[ promptAddEmployee.firstName, promptAddEmployee.lastName, promptAddEmployee.roleId, promptAddEmployee.managerId])

      } 
      

      if(promptAnswers.startPrompt == 'View Departments'){
       const departments = await db.query("Select * FROM employeeManager.department")
       console.table(departments)
        
      }

      if(promptAnswers.startPrompt == 'View Roles'){
        const roles = await db.query("Select * FROM role")
        console.table(roles)
      }

     if(promptAnswers.startPrompt == 'View Employees'){
        const employees = await db.query("Select * FROM employee")
        console.table(employees)
      }
      //not quite working yet

      if(promptAnswers.startPrompt =='Update Employee'){
          promptUpdateEmployee = await inquirer.prompt([
              {name: 'employeeId', type: 'input', message:'What is the EMPLOYEE ID of the employee you wish to edit?'},
              {name: 'firstName' , type: 'input' , message : 'What is the employees first name?' },
              {name: 'lastName' , type :'input', message: 'What is the employees last name?' },
              {name: 'roleId' , type: 'input' , message: 'Please input the employees new role with their ROLE ID NUMBER'},
              {name: 'managerId' , type: 'input' , message: 'Please enter the MANAGER ID of this employees manager.(null if no manager)'}
        ]);
        

        await db.query("UPDATE employee SET `first_name`=?, `last_name`=?,`role_id`=?, `manager_id`=? WHERE `id`=?",[promptUpdateEmployee.firstName,promptUpdateEmployee.lastName,promptUpdateEmployee.roleId,promptUpdateEmployee.managerId,promptUpdateEmployee.employeeId])
        

      }

      if(promptAnswers.startPrompt == "Delete Department"){
          let deptChoices = await db.query("Select name FROM employeeManager.department");
          let choices = deptChoices.map(function(department){
              return department.name
            }) 
         
         
          
          promptDeleteDepartment = await inquirer.prompt([
              {name:'deptName', type:'list', message: 'Please choose the department you wish to delete',
              choices: choices

          }])
          
          await db.query("DELETE from department WHERE name =?",[promptDeleteDepartment.deptName])
      }

      if(promptAnswers.startPrompt == "Delete Role"){
        let roleChoices = await db.query("Select title FROM employeeManager.role");
        let choices = roleChoices.map(function(role){
            return role.title
          }) 
       
       
        
        promptDeleteRole = await inquirer.prompt([
            {name:'roleName', type:'list', message: 'Please choose the role you wish to delete',
            choices: choices

        }])
        
        await db.query("DELETE from role WHERE title =?",[promptDeleteRole.roleName])

    }
//a bit stuck

//      if(promptAnswers.startPrompt == "Delete Employee"){
//         let employeeChoices = await db.query("Select first_name, last_name FROM employeeManager.employee");
//         let choices = employeeChoices.map(function(employee){
//            return employee.first_name.concat(" ", employee.last_name)
            
//             }) 
           
        
        
        
//         promptDeleteEmployee = await inquirer.prompt([
//             {name:'employeeName', type:'list', message: 'Please choose the Employee you wish to delete',
//             choices: choices

//         }])
        
//         await db.query("DELETE from employee WHERE `first_name` =?",[promptDeleteEmployee.employeeName])   
  
      
    


// }

    if(promptAnswers.startPrompt == "Delete Employee"){
        promptDeleteEmployee = await inquirer.prompt ([
            {name: 'employeeId' , type: 'input' , message: 'Please Input the employee ID of the employee you wish to delete'}
        
        ])
        await db.query("DELETE from employee WHERE id =?",[promptDeleteEmployee.employeeId])
    }

//manager function?
  main()

}    

  main()

//This is the most important line of code in the whole application
let shrek =["love", "life"]
