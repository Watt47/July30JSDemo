var Colors = {
    WHITE : [1.0,  1.0,  1.0,  1.0],
    RED : [1.0,  0.0,  0.0,  1.0],
    YELLOW : [1.0, 1.0, 0, 1],
    GREEN : [0.0,  1.0,  0.0,  1.0],
    BLUE : [0.0,  0.0,  1.0,  1.0],
    random : function(){
        return [Math.random(), Math.random(), Math.random(), 1.0];
    }
};
function colorEq(a, b){//color
    return (a[0] == b[0] && a[1] == b[1] && a[2] == b[2] && a[3] == b[3]);
}
function randomColor(){
    var out = [];
    do {
        out = [randomInt(0, 2), randomInt(0, 2), randomInt(0, 2), 1];
    } while (colorEq(out, [0, 0, 0, 1]));
    return out;
}