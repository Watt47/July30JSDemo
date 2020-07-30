var ui = {
    init: function(){
        scrollToTop.init();
        document.getElementById("toggletasks").onclick = function(){
            document.getElementById("tasktable").classList.toggle("hidden");
        };
        document.getElementById("toggletask").onclick = function(){
            document.getElementById("rightdetails").classList.toggle("hidden");
        };
    },
    customCheckbox: function(parent){
        var label = parent.createChildElement("label", "class=container");
        label.innerHTML = "&nbsp;";
        label.createChildElement("input", "type=checkbox");
        label.createChildElement("span", "class=checkmark");
        return label;
    },
    tasks: function(){
        document.getElementById("tasks").createCaption().textContent = "Tasks filtered " + tasks.filter + " by " + tasks.filterValue;
        document.getElementById("addtaskfield").addEventListener("keypress", function(e){
            if (EnterPressed(e)){
                task.addTask(e.target.value);
                e.target.value = "";
                Refresh();
            }
        });
        document.getElementById("showtreetasks").onchange = function(){
        Array.from(document.getElementById("tasks").getElementsByTagName("tr")).forEach(function(el){
                if (el.getAttribute("level") > 0){
                    el.classList.toggle("hidden");
                }
            });
    };
    },
    task: function(id){
        if (!id) return;
        task.arg = id;
        taskEntity = JSON.parse(Post("action=loadtaskjson&taskid=" + id)).tasks[0];
        task.entity = taskEntity;
        document.title = taskEntity.name;
  //  ui.currentScreen = "task";
  //  ui.setTitle("task_title");
    var main = document.getElementById('rightdetails');
    main.innerHTML = "";
    var table = document.createElement("table");
	table.createCaption().textContent = "Task #" + id + " " + taskEntity.name;
	table.style.width = "100%";
	var tags = Post2JSON("action=gettags&taskid=" + id).data;
	var tagsList = tags.reduce(
	    (acc, current) => acc + "<div class=tag><div id=" + current.guid + " onclick=\"filterTag('" + current.guid + "');\">" + current.tag + "</div><svg class=closetag width=10  height=10 onclick=\"removeTag('" + current.guid + "' , " + id + ");\"><line x1=0 y1=0 x2=10 y2=10 class=closetag></line><line x1=10 y1=0 x2=0 y2=10 class=closetag></line></svg></div>"
	    , "");
	table.appendRow(["Tags:", "<input type=text id=taskTags>" + tagsList]);

	main.appendChild(table);
	document.getElementById("taskTags").onkeypress = function(e){
	    if (!EnterPressed(e)) return;
	    Post("action=add&item=tag&taskid=" + id + "&name=" + encodeURIComponent(e.target.value));
	    Refresh();
	};
  //  table.classList.add("center");
    var row0 = table.insertRow(-1);
    var row1 = table.insertRow(-1);
    var row2 = table.insertRow(-1);
    var row3 = table.insertRow(-1);

    var cell00 = row0.insertCell(-1);
    cell00.classList.add("min-width");
    var cell01 = row0.insertCell(-1);
    cell01.classList.add("max-width");
    var cell10 = row1.insertCell(-1);
    var cell11 = row1.insertCell(-1);
    var cell20 = row2.insertCell(-1);
    var cell21 = row2.insertCell(-1);
    var cell30 = row3.insertCell(-1);
    var cell31 = row3.insertCell(-1);
    
    var subs = main.createChildElement("div", "");
    subs.innerHTML = Post("action=load&item=task&id=" + id);

    //var subMainDiv = main.createChildElement("div");
   // subMainDiv.classList.add("center");
  //  var idLabel = cell00.createChildElement("label");
    cell00.appendChild(document.createTextNode("Id:"));
    cell00.setResId("task_field_id");
    cell01.appendChild(document.createTextNode(!taskEntity ? "" : taskEntity.id));
   // idLabel.appendChild(document.createTextNode("id: " + (!taskEntity ? "" : taskEntity.id)));
  //  subMainDiv.createChildElement("br");
    var nameLabel = cell10.createChildElement("label", "for=name");
    nameLabel.appendChild(document.createTextNode("Name: "));
    nameLabel.setResId("task_field_name");
    var nameField = cell11.createChildElement("input","id=name,type=text");
    nameField.value = (!taskEntity ? "" : taskEntity.name);
   // if (taskEntity)
     //   nameField.disabled = true;
    nameField.classList.add("max-width");
    nameField.style.background = "white";
    nameField.style.border = 0;
    nameField.onblur = function(e){
	    Post("action=update&item=task&taskid=" + id + "&field=name&value=" + encodeURIComponent(e.target.value));
	    Refresh();
	};
	nameField.onkeypress = function(e){
	    if (!EnterPressed(e)) return;
	    Post("action=update&item=task&taskid=" + id + "&field=name&value=" + encodeURIComponent(e.target.value));
	    Refresh();
	};
   // subMainDiv.createChildElement("br");
    cell20.textContent = "Done:";
    cell20.setResId("task_field_done");
   // var checkbox = cell21.createChildElement("input", "id=complete,type=checkbox");
    var checkbox = ui.customCheckbox(cell21);
    checkbox.id = "complete";
    if (taskEntity)
        checkbox.children[0].checked = taskEntity.complete == 1;
    checkbox.children[0].onchange = function(e){
	    Post("action=update&item=task&taskid=" + id + "&field=complete&value=" + encodeURIComponent(e.target.checked.toString()));
	    Refresh();
    };
  //  subMainDiv.createChildElement("br");
    var descLabel = cell30.createChildElement("label");
    descLabel.appendChild(document.createTextNode("Description: "));
    descLabel.setResId("task_field_description");
    var descField = cell31.createChildElement("textarea","id=description");
    if (taskEntity.description){
        descField.appendChild(document.createTextNode(taskEntity.description));
      //  descField.disabled = true;
    }
    descField.classList.add("max-width");
    descField.style.border = 0;
    descField.style.background = "white";
    descField.rows = 4;
 //   document.addEventListener("backbutton", ui.screen.backToMain, false);
 	descField.onblur = function(e){
	    Post("action=update&item=task&taskid=" + id + "&field=description&value=" + encodeURIComponent(e.target.value));
	    Refresh();
	};
    document.getElementById("showsubs").onchange = function(){
        document.getElementById("tasksubs").classList.toggle("hidden");
    };
    document.getElementById("showtreetask").onchange = function(){
        Array.from(document.getElementById("tasksubs").getElementsByTagName("tr")).forEach(function(el){
                if (el.getAttribute("level") > 1){
                    el.classList.toggle("hidden");
                }
            });
    };
 
 
    html10n.localize(settings.getLanguage());
    
            document.getElementById("addsubfield").addEventListener("keypress", function(e){
            if (EnterPressed(e)){
                task.addSubTask(e.target.getAttribute("taskid"), e.target.value);
                e.target.value = "";
                Refresh();
            }
        });

   // main.style.height = (window.innerHeight - ui.bottomMenuShift + 22) + "px";
//ui.reloadPage();
},
    dialog: function(title){
        var dlg;
        dlg = document.body.createChildElement("div", "class=white_content");
        dlg.id = "dialog";
        dlg.style.display='block';
	    document.getElementById('fade').style.display='block';
        var top = dlg.createChildElement("div");
        top.createChildElement("span", "id=dlgtitle,text=" + title);
        top.createChildElement("span", "text=X").onclick = function(){
            dlg.style = "display: none;";
	            dlg.remove();
            document.getElementById("fade").style = "display: none;";
        };
        var bottom = dlg.createChildElement("div", "id=dlgbottom");
        var cancel = bottom.createChildElement("button", "text=Cancel");
        cancel.onclick = function(){
            dlg.style = "display: none;";
	            dlg.remove();
            document.getElementById("fade").style = "display: none;";
        };
        return {root: dlg, top: top, main: dlg.createChildElement("div"), ok: bottom.createChildElement("button", "text=OK"), cancel: cancel};
    }
};