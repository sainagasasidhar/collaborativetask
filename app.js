const express = require('express');
const app = express();
const PORT = 3000;
const Task = require('./src/models/task.js');
const Validator = require('./src/helpers/validator.js');

app.use(express.json());

app.listen(PORT,(err)=>{
    if(err) {
        console.log("Error occured at port `3000`", err);
    } else {
        console.log("app is listeningg at port", PORT);
    }
});

app.get('/', (req, res) => {
    return res.status(200).send("Welcome to Task Manager App");
})

app.get('/tasks', (req, res) => {
    if (req.query.completed && req.query.sort) {
        return  res.status(200).json(Task.getCompletionStatusAndSort(req.query.completed,req.query.sort));
    }
    if (req.query.completed) {
        return  res.status(200).json(Task.getATasksByCompletionStatus(req.query.completed));
    } 
    if (req.query.sort) {
        return  res.status(200).json(Task.getATasksBySort(req.query.sort));
    }
    else {
        return  res.status(200).json(Task.getAllTasks());
    }
});

app.get('/tasks/:id', (req, res) => {
    let response = Task.getTaskById(req.params.id);
    if (!response.status) {
        return  res.status(404).send("Enter a valid task id");
    } else {
        return  res.status(200).json(response.data);
    }
});

app.post('/tasks', (req, res) => {
    let response = Task.createTask(req.body);;
    return  res.status(response.statusCode).json(response.details);
});

app.put('/tasks/:id', (req, res) => {
    let response = Task.updateTaskById(req.params.id, req.body);
    return  res.status(response.statusCode).json(response.details);
});

app.delete('/tasks/:id', (req, res) => {
    let response = Task.deleteTaskById(req.params.id, req.body);
    return  res.status(response.statusCode).json(response.details);
});

app.get('/tasks/priority/:level', (req, res) => {
    let response = Task.getTaskByPriority(req.params.level);
    return  res.status(200).json(response);
});

module.exports = app;