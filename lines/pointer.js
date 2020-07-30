function PointerMain(){
    canvas = document.getElementById("glcanvas");
    canvas.onmousedown = function(e){
        startAtom = event2CircleId(e);
        if (startAtom == -1){
            e = e || window.event;
            beginX = e.clientX || e.touches[0].clientX;
            beginY = event.clientY || event.touches[0].clientY;
            beginColumn = atoms[nextId].column;
            this.onmousemove = Yaw;
            return;
        } 
        reaction = [startAtom];
        this.onmousemove = trackAtom;
    };//do not track onmouse up and ontouchup if here id == -1!!!!!
    canvas.ontouchstart = function(e){
        e.preventDefault();
        startAtom = event2CircleId(e);
        if (startAtom == -1){
            event = e || window.event;
            beginX = (event.clientX || event.touches[0].clientX);
            beginY = event.clientY || event.touches[0].clientY;
            beginColumn = atoms[nextId].column;
            this.ontouchmove = Yaw;
            return;
        } 
        reaction = [startAtom];
        this.ontouchmove = trackAtom;
    };
    canvas.onmouseup = function(e){
        this.onmousemove = null;
        finishReaction();
        endAtom = event2CircleId(e);
    };
    canvas.ontouchend = function(e){
        this.ontouchmove = null;
        finishReaction();
        endAtom = event2CircleId(e);
    };
}
function finishReaction(){
    if (startAtom == -1) return;
    var res = reaction.reduce((acc, cur) => acc + atoms[cur].name, "");
    labelLastRct.setText("Touched atoms (отмеченные атомы): " + res);
    labelLastRctAllowed.setText("Reaction valid (реакция существует): " + allowedReactions.includes(res));
    if (allowedReactions.includes(res)){
        playByString(res);
        reaction.forEach(function(id){
            atoms[id].move({column : 10, level : 0});
       //     atoms[id] = new Atom({column : 10, level : 0, color : atoms[id].color});
            atoms[id].ingame = false;
            updateAtomCoords(atoms[id].coords, id, circleDepth * 3);
        });
        totalEnergy += allowedEnergy[allowedReactions.indexOf(res)];
        labelPts.setText("Energy (энергия): " + totalEnergy);
        totalReact++;
        labelReact.setText("Reactions (реакций): " + totalReact);
    }
}
function Yaw(event){
    event = event || window.event;
    var deltaX = beginX - (event.clientX || event.touches[0].clientX);
    if (typeof beginY === 'undefined')
        beginY = event.clientY || event.touches[0].clientY;
    if (beginY - (event.clientY || event.touches[0].clientY) < -100 ){
        if (AtomDown(nextId))
            updateAtomCoords(atoms[nextId].coords, nextId, circleDepth * 3);
        beginY = event.clientY || event.touches[0].clientY;
    }
    var deltaColumn = Math.round(deltaX * .01);
    var newColumn = beginColumn - deltaColumn;
    var leftEdge = -1;
    var rightEdge = 6 + 1;
    atoms.forEach(function(el, id){
        if (el.level != atoms[nextId].level) return;
        if (el.column < atoms[nextId].column)
            leftEdge = leftEdge < el.column ? el.column : leftEdge;
        if (el.column > atoms[nextId].column)
            rightEdge = el.column < rightEdge ? el.column : rightEdge;
    });
    if (newColumn <= leftEdge)
        newColumn = leftEdge + 1;
    if (newColumn >= rightEdge)
        newColumn = rightEdge - 1;
    atoms[nextId].move({column : newColumn, level : atoms[nextId].level});
   // atoms[nextId] = new Atom({column : newColumn, level : atoms[nextId].level, color : atoms[nextId].color});
    atoms[nextId].ingame = true;
    updateAtomCoords(atoms[nextId].coords, nextId, circleDepth * 3);
}