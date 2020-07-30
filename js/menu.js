var menu = {
    root: null,
    init: function(){
        Element.prototype.appendMenuLink = function(text, disabled = false){
            var menu1 = this.createChildElement('a');
            menu1.href = "javascript:void(0)";
            menu1.classList.add("menu");
            menu1.onclick = function(){
                alert(text);
            };
            menu1.appendChild(document.createTextNode(text));
            if (disabled)
                menu1.classList.add("disabled");
            return menu1;
        };
        menu.root = document.getElementById('header');
        menu.root.innerHTML = "";
        var header = menu.root;
        header.appendMenuLink("Options").onclick = function(){
            ShowOptions();
        };
        header.appendMenuLink("All tasks tree").onclick = function(){
            tasks.filter = "tree";
            tasks.filterValue = "";
            Refresh();
       //     location.assign(".");
        };
        header.appendMenuLink("Year tasks").onclick = function(){
            tasks.filter = "date";
            tasks.filterValue = "year";
            Refresh();
          //  LoadFilteredDate("year");
        };
        header.appendMenuLink("Month tasks").onclick = function(){
            tasks.filter = "date";
            tasks.filterValue = "month";
            Refresh();
        //    LoadFilteredDate("month");
        };
        header.appendMenuLink("Week tasks").onclick = function(){
            tasks.filter = "date";
            tasks.filterValue = "week";
            Refresh();
        //    LoadFilteredDate("week");
        };
        header.appendMenuLink("Today tasks").onclick = function(){
            tasks.filter = "date";
            tasks.filterValue = "today";
            Refresh();
        //    LoadFilteredDate("today");
        };
        header.appendMenuLink("Overdue tasks").onclick = function(){
            tasks.filter = "date";
            tasks.filterValue = "overdue";
            Refresh();
          //  OverdueTasks();
        };
        header.appendMenuLink("Log out").onclick = function(){
            location.assign("pass_session.php");
        };
        header.createChildElement("input", "type=text").oninput = function(e){
          //  if (e.value ="") return;
            var trs = Array.from(document.getElementById("tasks").getElementsByTagName("tr"));
            trs.forEach(function(el){
                if (e.target.value == ""){
                    el.classList.remove("hidden");
                    return;
                }
                if (!el.innerText.toLowerCase().includes(e.target.value.toLowerCase()))
                    el.classList.add("hidden");
            });
        };
        var menuleft = document.getElementById("menuleft");
        menuleft.innerHTML = '';
        menuleft.appendMenuLink("Today").onclick = function(){
            tasks.filter = "date";
            tasks.filterValue = "today";
            Refresh();
        //    LoadFilteredDate("today");
        };
        menuleft.appendMenuLink("Week").onclick = function(){
            tasks.filter = "date";
            tasks.filterValue = "week";
            Refresh();
        //    LoadFilteredDate("week");
        };
        menuleft.appendMenuLink("Продукты");
        menuleft.appendMenuLink("Домашние дела");
        menuleft.appendMenuLink("");
    }
};