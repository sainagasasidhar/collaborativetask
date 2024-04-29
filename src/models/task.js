const fs = require('fs');
let tasks = require('../../data/tasks.json');
const Validator = require('../helpers/validator.js');
class Task {
    static createTask (inputTask) {
        let response = {statusCode:422, details:""};
        let validationCheck = Validator.mandatoryFieldCheck(inputTask);
        if (!validationCheck.passed){
            response.statusCode = 400;
            response.details = validationCheck.error;
            return response;
        } else {
            inputTask.id = tasks.length + 1;
            tasks.push(inputTask);
            fs.writeFileSync('data/tasks.json', JSON.stringify(tasks,null,4), {encoding: 'utf8', flag: 'w'});
            response.statusCode = 201;
            response.details = "Task created successfully.";
            return response;
        }
    }

    static getTaskById(id) {
        let response = {status:false,data:{}};
        let data = tasks.filter(function(task) {
            return task.id == id;
        })
        if (data.length>0) {
            response.status = true;
            response.data = data[0];
        } 
        return response;
    }

    static getAllTasks(){
        return tasks;
    }

    static updateTaskById(id, data) {
        let task = this.getTaskById(id);
        let validationCheck = Validator.dataTypecheck(data);
        let response = {statusCode:404,details:""};
        if (!task.status) {
            response.details = "Enter a valid task id";
            return response;
        } else if(!validationCheck.passed) {
            response.statusCode = 400;
            response.details = validationCheck.error;
            return response;
        } else {
            for (let i=0; i<tasks.length; i++) {
                if (tasks[i].id == id) {
                    Object.assign(tasks[i],data);
                }
            }
            fs.writeFileSync('data/tasks.json', JSON.stringify(tasks,null,4), {encoding: 'utf8', flag: 'w'});
            response.details = "Task Updated Sucessfully";
            response.statusCode = 200;
            return response;
        }
    }
    
    static deleteTaskById(id) {
        let task = this.getTaskById(id);
        let response = {statusCode:404,details:""};
        if (!task.status) {
            response.details = "Enter a valid task id";
            return response;
        } else {
            for (let i=0; i<tasks.length; i++) {
                if (tasks[i].id == id) {
                    tasks.splice(i,1);
                    break;
                }
            }
            fs.writeFileSync('data/tasks.json', JSON.stringify(tasks,null,4), {encoding: 'utf8', flag: 'w'});
            response.details = "Task deleted successfully";
            response.statusCode = 200;
            return response;
        }
    }

    static getTaskByPriority(priority) {
        let data = tasks.filter(function(task) {
            return task.priority === priority;
        });
        return data;
    }

    static getATasksByCompletionStatus(completed) {
        let status;
        if (completed === 'true') {
            status = true;
        } 
        if (completed === 'false') {
            status = false;
        }
        let data = tasks.filter(function(task) {
            return task.completed == status;
        })
        return data;
    }

    static getATasksBySort(sort) {
        tasks.sort((a,b) => {
            return a.id - b.id;
        });
        if (sort === 'DESC') {
            return tasks.reverse();
        }
        return tasks;
    }
    
    static getCompletionStatusAndSort(completion, sort) {
        let data = this.getATasksByCompletionStatus(completion);
        data.sort((a,b) => {
            return a.id - b.id;
        });
        if (sort === 'DESC') {
            return tasks.reverse();
        }
        return data;
    }
}

module.exports = Task;