var tasks = {
    filter: "tree",
    filterValue: "",
    filterShowDone: true,
    tasks: []
};
function LoadAllTasks(){
	var Response = Post("action=loadtasks");
	document.getElementById('tasktable').innerHTML = Response;
}
function OverdueTasks(){
	var Response = Post("action=loadoverduetasks");
	var obj = JSON.parse(Response);
	if (obj.result != "success")
		alert("Server: " + obj.message);
	else
		JSON2Table(obj.data, "tasks");
	overdue = true;
}
function LoadFiltered(tag){
	var Response = Post("action=filtertag&guid=" + tag);
	var obj = JSON.parse(Response);
	if (obj.result != "success")
		alert("Server: " + obj.message);
	else{
	//    document.getElementById('tasktable').innerHTML = "<table border=1 align=center id=tasks>";
		JSON2Table(obj.data, "tasks");
	}
}
function LoadFilteredDate(type){
    var obj = Post2JSON("action=getTasksFiltered&type=" + type);
    if (obj.result != "success")
		alert("Server: " + obj.message);
	else{
	  //  document.getElementById('tasktable').innerHTML = "<table border=1 align=center id=tasks>";
		JSON2Table(obj.data, "tasks");
	}
}
function Toolbar(id, name){
    let png_size = 20;
    let td = document.createElement("td");
    td.createChildElement("img", "width=20,src=delete.png,title=Delete task").onclick = function(){
        DeleteTask(id, name);
    };
    return td;
}
function JSON2Table(json, table){
	var table = document.getElementById(table);
	if (json.length == 0){
	    table.innerHTML = "<tr><td>NO DATA</td></tr>";
	    return;
	}
	table.innerHTML = "";
	var obj = json;
	var row0 = obj[0];
	var row = table.insertRow(0);
	row.createChildElement("th", "text=tools");
	for (let property in row0) {
		if (row0.hasOwnProperty(property) && property != "description" && property != "user_id") {
		    var x = row.createChildElement("th", "text=" + (property == "complete" ? "done" : property));
		 /*   if (property == "complete")
		        row.createChildElement("th", "text=done");
		    else 
	    	    row.createChildElement("th", "text=" + property);
	    	*/
	    	x.onclick = function(){
	    	    alert("There will be sorting by " + property);
	    	};
		//	var x = row.insertCell(-1);
	//		x.innerHTML = property.bold();//making title bold style
		}
	}
	obj.forEach(function(item, index){
		var row = table.insertRow(-1);
		row.appendChild(Toolbar(item.id, item.name));
		let bgcolor = task.isOverDue(item["due_date"], item["due_time"]) ? ' bgcolor="#FF0000" ' : ' ';
		for (var key in item) {
			if (item.hasOwnProperty(key) && key != "description" && key != "user_id") {
				var x = row.insertCell(-1);
				switch(key){
					case "Status":
						x.innerHTML = Statuses[item[key]] + " (" + item[key] + ")";
						break;
					case "Assigned to":
						x.innerHTML = Users[item[key]] + " (" + item[key] + ")";
						break;
					case "Issue type":
						x.innerHTML = Issues[item[key]] + " (" + item[key] + ")";
						break;
					case "complete":
						var y = x.createChildElement("input", "type=checkbox");
						y.id = key + item["id"];
					/*	y.addEventListener("click", function(){
							ClickItem(item["id"], key, "-1")
							});*/
						let keyin1 = key;
						y.checked = (item[key] == 1) ? true : false;
						x.onclick = function(){
						    ClickItem(item.id, keyin1, this);
						};
						break;
					case "due_date":
					case "due_time":
					case "id":
						x.id = key + item["id"];
						let keyin = key;
						x.addEventListener("click", function(){
							ClickItem(item["id"], keyin, this);
							});
						x.innerHTML = item[key];
						break;
					case "description":
					    break;
					default:
						x.innerHTML = item[key];
					
				}
                if (key == "due_date" || key == "due_time"){
					if (task.isOverDue(item["due_date"], item["due_time"]))
					    x.bgColor = "#FF0000";
				}
			}
		}
	});
	//populate_with_new_rows(new_tbody);
	//old_tbody.parentNode.replaceChild(new_tbody, old_tbody)
	//var myNode = document.getElementById("pagetxt");
	/*while (myNode.firstChild) {
		myNode.removeChild(myNode.firstChild);
	}*/
	var txtstr = "page ";
	//var pages = Math.ceil(response.num / parseInt(document.getElementById("limit").value));
	//Debug(pages);
	//Debug();
	//var txt = document.createTextNode("Page ");
	//myNode.appendChild(txt);
/*	for (var i = 0; i < pages ; i++){
		var newnode = myNode.createChildElement("a");
		if (document.getElementById("page").value == i + 1)
			newnode.className = "selected";
		var txt = document.createTextNode(i + 1 + " ");
		newnode.appendChild(txt);
		newnode.onclick=function(){CleanupSiblingsClass(this); document.getElementById("page").value = this.innerHTML.trim();ExecuteQuery(); };
	}*/
}
function LoadAllTasksOrdered(field,order){
	var Response = Post("action=loadtasks&field="+field+"&order="+order);
	document.getElementById('tasktable').innerHTML = Response;
}
function drag(ev,id){
    ev.dataTransfer.setData("id",id);
}
function allowDrop(ev){
ev.preventDefault();
}
function drop(ev,id){
	ev.preventDefault();
	var data=ev.dataTransfer.getData("id");
//ev.target.appendChild(document.getElementById(data));
//alert(data + " -> " + id);
	if (id==data) return;//cannot drag to itself
	Post("action=assignparent&parent=" + id + "&sub=" + data);
	Refresh();
}
function EditTask(id,name,complete,due_date,due_time){
	//name = encodeURIComponent(name);
	Post("action=edittask&id=" + id + (name ? '&name=' + encodeURIComponent(name) : '') + (complete ? '&complete=' + complete : '') + (due_date ? '&due_date=' + due_date : '') + (due_time ? '&due_time=' + due_time : ''));
	Refresh();
}
function SaveSubTask(id,name,complete,due_date,due_time){
	Post("action=subtask&parent=" + id + (name ? '&name='+encodeURIComponent(name) : '') + (complete ? '&complete='+complete : '') + (due_date ? '&due_date='+due_date : '') + (due_time ? '&due_time='+due_time : ''));
	Refresh();
}
function DeleteTask(id,name){
	if(!confirm('Are you sure to delete task #'+id+' "' + name + '"?'))
		return;
	Post("action=delete&id="+id);
	Refresh();
}
function InsertSubTask(afterrow,parentid){
	var table=afterrow.parentNode;
	var row=table.insertRow(afterrow.rowIndex+1);
	var cell1=row.insertCell(0);
	var cell2=row.insertCell(1);
	var cell3=row.insertCell(2);
	var cell4=row.insertCell(3);
	//var cell5=row.insertCell(4);
	cell1.innerHTML="NEW sub";
	cell2.innerHTML="NEW ID<input type=hidden id=parent value=\"" + parentid + "\">";
	cell3.innerHTML="<img src=subtask.png width=15><input type=text id=subname>";
	cell4.innerHTML="<input id=subdone type=checkbox>";
	//cell5.innerHTML="<input id=subdue type=date>";
	//$('#currentedit').datepicker({dateFormat: 'yy-mm-dd', onSelect: function(date){SaveSubTask(parentid,document.getElementById('subname').value,document.getElementById('subdone').checked.toString(),date);}});
	document.getElementById('subname').onblur=function(){SaveSubTask(parentid,document.getElementById('subname').value,document.getElementById('subdone').checked.toString());}
	document.getElementById('subname').focus();
	document.getElementById('subname').onkeypress = keyPress;
}
function ClickName(id, element){
//	el_id = name + id;
	value = element.innerHTML;
	var input = document.createElement("input");
	input.type = "text";
	input.id = "currentedit";
	input.value = value;
	element.appendChild(input);
	element.onclick=function(){};
	input.onblur=function(){
		EditTask(id, document.getElementById('currentedit').value);
	}
	input.onkeypress = function(e){
		if (EnterPressed(e)) 
			EditTask(id, document.getElementById('currentedit').value);
	}
	input.focus();
}
function ClickComplete(id, element){
	EditTask(id,'',element.children[0].checked.toString());
}
function Sort(field,order){
	LoadAllTasksOrdered(field,order);
}
function ClickDueT(id, element){
//	el_id = 'due_time' + id;
	value = element.innerHTML;
	element.innerHTML = '<input id=currentedit type=text value="'+value+'">';
	element.onclick=function(){};
	document.getElementById('currentedit').onblur = function(){
	    EditTask(id,'','','',document.getElementById('currentedit').value);
	};
	document.getElementById('currentedit').onkeypress = function(e){
		if (EnterPressed(e)) 
			EditTask(id,'','','',document.getElementById('currentedit').value);
	};
	document.getElementById('currentedit').focus();	
}
function ClickDueD(id, element){
//	el_id = 'due_date' + id;
	value = element.innerHTML;
	element.innerHTML = '<input id=currentedit type="date" value="'+ value + '">';
	element.onclick = function(){};
	var datefield = document.createElement("input");
    datefield.setAttribute("type", "date");
	if (datefield.type != "date")
		$('#currentedit').datepicker({dateFormat: 'yy-mm-dd ', onClose: function(date){
		    EditTask(id,'','', date);
		} });
	else{
		document.getElementById('currentedit').onchange = function(){
			EditTask(id,'','',document.getElementById('currentedit').value);
			};
		}
	document.getElementById('currentedit').focus();	
}
function ClickItem(id,field, element){
	//alert(id);
	//alert(field);
	if (field == 'id')
	    ui.task(id);
	if (field == 'name')
		ClickName(id, element);
	if (field == 'complete')
		ClickComplete(id, element);
	if (field == 'due_date')
		ClickDueD(id, element);
	if (field == 'due_time')
		ClickDueT(id, element);
}
function SetEvents(){
	document.getElementById('taskname').onkeypress = keyPress;
	document.getElementById('due_date').onkeypress = keyPress;
	document.getElementById('due_time').onkeypress = keyPress;
	//document.getElementById('subname').onkeypress = keyPress;
}
function ViewTask(id){
	var Response = Post("action=load&item=task&id=" + id);
	var responseTitle = Post("action=loadtaskjson&taskid=" + id);
	document.getElementById('tasktable').innerHTML = Response;
	var task = JSON.parse(responseTitle).tasks[0];
	document.title = "Task #" + id + " " + task.name;
	var taskUI = document.createElement("table");
	taskUI.id = "taskUI";
	taskUI.createCaption().textContent = document.title;
	taskUI.appendRow(["Id:", task.id]);
	taskUI.appendRow(["Name:", task.name]);
	var tags = Post2JSON("action=gettags&taskid=" + task.id).data;
	var tagsList = tags.reduce(
	    (acc, current) => acc + "<div class=tag><div id=" + current.guid + " onclick=\"filterTag('" + current.guid + "');\">" + current.tag + "</div><svg class=closetag width=10  height=10 onclick=\"removeTag('" + current.guid + "' , " + task.id + ");\"><line x1=0 y1=0 x2=10 y2=10 class=closetag></line><line x1=10 y1=0 x2=0 y2=10 class=closetag></line></svg></div>"
	    , "");
	taskUI.appendRow(["Tags:", "<input type=text id=taskTags>" + tagsList]);
	taskUI.appendRow(["Description:", "<textarea id=taskDesc></textarea>"]);
	taskUI.appendRow(["File:", task.file]);
	taskUI.appendRow(["Complete:", task.complete]);
	taskUI.appendRow(["Due date:", task.due_date]);
	taskUI.appendRow(["Due time:", task.due_time]);
	document.getElementById('tasktable').insertBefore(taskUI, document.getElementById('tasks'));
	document.getElementById("taskTags").onkeypress = function(e){
	    if (!EnterPressed(e)) return;
	    Post("action=add&item=tag&taskid=" + task.id + "&name=" + encodeURIComponent(e.target.value));
	    Refresh();
	};
	document.getElementById('taskDesc').value = task.description;
	document.getElementById('taskDesc').onblur = function(e){
	    Post("action=update&item=task&taskid=" + task.id + "&field=desc&value=" + encodeURIComponent(e.target.value));
	    Refresh();
	};
}
function fillTags(){
	var tags = Post2JSON("action=gettags").data;
		var tagsList = tags.reduce(
	    (acc, current) => acc + "<div class=tag><div id=" + current.guid + " onclick=\"filterTag('" + current.guid + "');\">" + current.tag + "</div></div>"
	    , "");
	document.getElementById("header").createChildElement("div", "id=tags").innerHTML = tagsList;
}
function filterTag(tag){
    tasks.filter = "tag";
    tasks.filterValue = tag;
    Refresh();
  //  location.assign("./?filtertag=" + tag);
}
function removeTag(guid, taskid){
    Post("action=removetag&guid=" + guid + "&taskid=" + taskid);
    Refresh();
}
document.body.onload=function(){
	overdue = false;
	common.init();
	menu.init();
	ui.init();
	ui.task();
	fillTags();
	Refresh();
	SetEvents();
}
function Refresh(){
    switch (tasks.filter){
        case "tree":
            LoadAllTasks();
            break;
        case "date":
            if (tasks.filterValue == "overdue")
                OverdueTasks();
            else
                LoadFilteredDate(tasks.filterValue);
            break;
        case "tag":
            LoadFiltered(tasks.filterValue);
            break;
        default:
            console.error("error filter");
    }
    ui.tasks();
    ui.task(task.arg);
    /*
	if (overdue)
		OverdueTasks();
	else
	if ('undefined' !== typeof taskid)
		ViewTask(taskid);
	else
	if ('undefined' !== typeof filtertag)
	    LoadFiltered(filtertag);
	else
		LoadAllTasks();*/
}
function EnterPressed(e){
  var x = e || window.event;
  var key = (x.keyCode || x.which);
	return (key == 13);
}
function keyPress(e){
  var x = e || window.event;
  var key = (x.keyCode || x.which);
    if (key == 13){
		switch ((x.target || x.srcElement).id){
			case 'subname':
				//SaveSubTask(document.getElementById('parent').value,document.getElementById('subname').value,document.getElementById('subdone').checked.toString());
				document.getElementById('subname').blur();
				break;
			case 'taskname':
			case 'due_date':
			case 'due_time':
				var Response = Post("action=addtask&name=" + encodeURIComponent(document.getElementById('taskname').value) + 
			"&complete=" + document.getElementById('complete').checked + "&due_date=" + document.getElementById('due_date').value + "&due_time=" + document.getElementById('due_time').value);
				document.getElementById('tasktable').innerHTML = Response;
				SetEvents();
				document.getElementById('complete').checked = false;
				document.getElementById('taskname').value = '';
				document.getElementById('due_date').value = '';
				document.getElementById('due_time').value = '00:00:00';
				document.getElementById('taskname').scrollIntoView({
                 behavior: 'smooth',
                 block: 'center'
             });
				break;
			default:
				alert(x.target.id);
				break;
		}
    }
}