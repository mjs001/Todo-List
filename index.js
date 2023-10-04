import express from 'express';
import bodyParser from 'body-parser';
import { LocalStorage } from "node-localstorage";
var app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
var port = 3000;
global.localStorage = new LocalStorage('./scratch');

var todoList = ["Go buy catfood", "Buy some milk"];
var workTodoList = ["Finish ToDo list app"];
var completedList = [];
if (localStorage.getItem("todoList") !== null) {
    todoList = JSON.parse(localStorage.getItem("todoList"));

}
if (localStorage.getItem("completedList") !== null) {
    completedList = JSON.parse(localStorage.getItem("completedList"));
}
if (localStorage.getItem("workTodoList") !== null) {
    workTodoList = JSON.parse(localStorage.getItem("workTodoList"));
}
app.get("/", (req, res) => {
    res.render("index.ejs", { newTodo: todoList, workTodoList: workTodoList, completedList: completedList,  });

})

app.post("/submit", (req, res) => {
    var newTodo = req.body.newTodo;
    todoList.push(newTodo);
    localStorage.setItem("todoList", JSON.stringify(todoList));
    res.redirect("/");
})

app.post("/work_submit", (req, res) => {
    var new_work = req.body.workTodo;
    workTodoList.push(new_work);
    localStorage.setItem("workTodoList", JSON.stringify(workTodoList));
    res.redirect("/");
})

app.post("/delete_todo", (req, res) => {
    var deleting = req.body.todo;
    var index = todoList.indexOf(deleting);
    todoList = todoList.filter((todo, i) => i !== index);
    localStorage.setItem("todoList", JSON.stringify(todoList));
    res.redirect("/");
})

app.post("/delete_work_todo", (req, res) => {
    var deleting = req.body.workTodo[1];
    var index = workTodoList.indexOf(deleting);
    workTodoList = workTodoList.filter((todo, i) => i !== index);
    localStorage.setItem("workTodoList", JSON.stringify(workTodoList));
    res.redirect("/");
})

app.post("/delete_completed_todo", (req, res) => {
    var deleting = req.body.completed;
    var index = completedList.indexOf(deleting);
    completedList = completedList.filter((todo, i) => i !== index);
    localStorage.setItem("completedList", JSON.stringify(completedList));
    res.redirect("/");
})

app.post("/complete", (req, res) => {
    var completed = req.body.todo;
    if (typeof completed === "string") {
        completedList.push(completed);
        todoList.splice(todoList.indexOf(completed), 1);
    } else if (typeof completed === "object") {
        completed.forEach((task) => {
            completedList.push(completed[task]);
            todoList.splice(todoList.indexOf(completedList[task], 1));
        })
    }
    localStorage.setItem("todoList", JSON.stringify(todoList));
    localStorage.setItem("completedList", JSON.stringify(completedList));
    res.redirect("/");
})

app.post("/complete_work_todo", (req, res) => {
        var completed_work = req.body.workTodo[1];
        if (typeof completed_work === "string") {
            completedList.push(completed_work);
            workTodoList.splice(workTodoList.indexOf(completed_work), 1);
        } else if (typeof completed_work === "object") {
            completed_work.forEach((task) => {
                completedList.push(completed_work[task]);
                workTodoList.splice(workTodoList.indexOf(completedList[task], 1));
            })
        }
        localStorage.setItem("workTodoList", JSON.stringify(workTodoList));
        localStorage.setItem("completedList", JSON.stringify(completedList));
        res.redirect("/");

})

app.post("/clear", (req, res) => {
    if (completedList !== []) {
        completedList = [];
        localStorage.removeItem("completedList");
        res.redirect("/");
    }
})

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
