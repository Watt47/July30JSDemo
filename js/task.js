function Task(name){
    this.name = name;
    this.complete = false;
    this.description = "";
    this.toString = function(){
        return JSON.stringify(this);
    };
}
var task = {
    arg: 0,
    addTask: function(name){
        Post("action=addtask&name=" + encodeURIComponent(name));
    },
    addSubTask: function(parent, name){
        Post("action=subtask&name=" + encodeURIComponent(name) + "&parent=" + parent);
    },
    isOverDue: function(date, time){
        if (date == '0000-00-00') return false;
        let datetime = Date.parse(date + "T" + time);
        return datetime < new Date();
    },
    ImportSubtasks: function(){
        var dlg = ui.dialog("Import subtasks for task #" + task.arg);
	    var tasks = dlg.main.createChildElement("textarea", "placeholder=Enter task rows");
	    dlg.ok.onclick = function(){
	        if (tasks.value)
	        if (Post2JSON("action=subtasks&parent=" + task.arg +"&items=" + encodeURIComponent(tasks.value)).success){
	            dlg.root.remove();
	            document.getElementById("fade").style.display = "none";
	            Refresh();
	        }
	    };
    },
    ChangeParent: function(){
        var dlg = ui.dialog("ChangeParent of task #" + task.arg);
        dlg.main.createChildElement("input", "type=text");
	    dlg.ok.onclick = function(){
	        if (Post2JSON("action=assignparent&parent=" + 0 + "&sub=" + task.arg).success){
	            dlg.remove();
	            document.getElementById("fade").style.display = "none";
	        }
	    };
        var table = dlg.main.createChildElement("table");
        
    },
    addSubtasks: function(){
        var dlg = ui.dialog("addSubtasks subtasksof task#" + task.arg);
	    dlg.ok.onclick = function(){
	        
	        if (Post2JSON("action=adopt&parent=" + task.arg + "&subs=" + 0).success){
	            dlg.remove();
	            document.getElementById("fade").style.display = "none";
	        }
	    };
        var table = dlg.main.createChildElement("table");
    }
};