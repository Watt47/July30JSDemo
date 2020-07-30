//import * as Objects from "objects3d";
Array.prototype.equals = function(array){
    var epsilon = .001;
    if (!array) return false;
    if (this.length != array.length) return false;
    return this.every(function(value, index, arr){
        if (Math.abs(value - array[index]) >= epsilon)
            return false;
        return true;
    });
  //  return true;
}
function isInt(n){
    return n % 1 === 0;
}
Float32Array.prototype.equals = function(array){
    var thisArray = Array.from(this);
    var paramArray = Array.from(array);
    return thisArray.equals(paramArray);
}
QUnit.test( "hello test", function( assert ) {
  assert.ok(isInt(0), "0 is integer");
  assert.ok(isInt(1), "1 is integer");
  assert.ok(isInt(-1), "-1 is integer");
  assert.ok(!isInt(0.1), "0.1 is not integer");
  assert.ok(!isInt(-0.1), "-0.1 is not integer");
  assert.deepEqual(new Float32Array([0, 1, 0]), new Float32Array([0, 1, 0]), "[0, 1, 0] == [0, 1, 0]");
  assert.notDeepEqual(new Float32Array([1, 0, 0]), new Float32Array([1, 1, 0]), "[1, 0, 0] != [1, 1, 0]");
  var vector = vec3.create();
  assert.ok(vector.equals(new Float32Array([0, 0, 0])), "vec3.create() makes zero vector test equals");
  assert.deepEqual(vector, new Float32Array([0, 0, 0]), "vec3.create() makes full zero vector");
  assert.notDeepEqual(vector, new Float32Array([1, 0, 1]), "vec3.create() not makes non-zero vector");
  assert.ok((new Float32Array([0, 0])).equals(new Float32Array([0.0001, -0.0001])), "array [0, 0] equals [0.0001, -0.0001]");
  var square = new Square();
  assert.equal(square.coords.length, 18, "square has 18 (3 * 6) coords");
  assert.deepEqual(square.coords, [
        0, 0, 0,
        0, 1, 0,
        1, 1, 0,
        0, 0, 0,
        1, 1, 0,
        1, 0, 0
        ], "Default Square() coords are [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1]");
    assert.deepEqual(repeatArray([0, 1], 3), [0, 1, 0, 1, 0, 1], "repeatArray test");
    var cube = new Cube();
    assert.equal(cube.coords.length, 108, "cube has 3 * 6 * 6 = 108 coords");
    assert.equal(square.color.length, 4, "square color length is 4");
    assert.equal(cube.color.length, 4, "cube color length is 4");
    assert.deepEqual(midPoint([0, -1, 0], [1, 1, 2.2]), [0.5, 0, 1.1], "midPoint()");
    assert.ok(normalizeVector([3, 3, 3]).equals([0.577, 0.577, 0.577]), "normalizeVector()");
    assert.ok(normalizeVector([3, 3, 3], 1).equals([0.577, 0.577, 0.577]), "normalizeVector()");
    assert.ok(normalizeVector([3, 3, 3], 2).equals([1.154, 1.154, 1.154]), "normalizeVector()");
    var tri = new Triangle([0, 0, 0, 0, 0, 2, 2, 0, 0]);
    var obj = new Object3D();
    obj.setCoords([0, 1, 2, 3, 4, 5]);
    obj.translate([1, 2, 3]);
    assert.deepEqual(obj, new Object3D([1, 3, 5, 4, 6, 8]), "object translate");
    assert.deepEqual(vectorLength([3, 12, 4]), 13, "vectorLength")
    assert.deepEqual(vectorLength(normalizeVector([3, 12, 4], 1)), 1, "normalizeVector")
//assert.deepEqual(tri.subDivideTriangle(), [new Triangle([])], "subDivideTriangle")
});