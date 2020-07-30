function mat3fromVec3(vec1, vec2, vec3){
    return mat3.fromValues(
        vec1[0], vec1[1], vec1[2], 
        vec2[0], vec2[1], vec2[2], 
        vec3[0], vec3[1], vec3[2]
        //0, 0, 0, 1
        );
}
function Object3D(vector=[]){
    this.coords = vector;
    this.color = [1, 1, 1, 1];
    this.texture = 0;
    this.getVertex = function(i){
        return [
            this.coords[i * 3],
            this.coords[i * 3 + 1],
            this.coords[i * 3 + 2]
            ];
    };
    this.getVertex2D = function(i){
        return [
            this.coords[i * 2],
            this.coords[i * 2 + 1],
            ];
    };
    this.setColor = function(newColor){
        this.color = newColor;
    };
    this.setCoords = function(cords){
        this.coords = cords;
    };
    this.translate = function(vector){
        this.coords.forEach(function(currentValue, index, array){
            array[index] = currentValue + vector[index % 3];
        });
    };
    this.setTexture = function(id){
        this.texture = id;
    };
    this.scale = function(mult){
        this.coords.forEach(function(currentValue, index, array){
            array[index] = currentValue * mult;
        });
    };
}
function Triangle(points){
    Object3D.call(this);
    var position = [];
    var side1 = [];
    var side2 = [];
    this.coords = points;
    this.getTexture = function(){
        if (this.texture === 0)
            return textureBlue;
        if (this.texture == 1)
            return textureGreen;
    };
    this.getCenter = function(){
        return [(coords[0] + coords[3] + coords[6]) / 3, (coords[1] + coords[4] + coords[7]) / 3, (coords[2] + coords[5] + coords[8]) / 3];
    };
    this.getColor = function(){
        var out = [];
        var thisColor = this.color;
        out = out.concat(thisColor);
        out = out.concat(thisColor);
        out = out.concat(thisColor);
        return out;
    };
    this.subDivideTriangle = function(length){
        var vertices = [this.coords.slice(0, 3), this.coords.slice(3, 6), this.coords.slice(6, 9)];
        var mp01 = normalizeVector(midPoint(vertices[0], vertices[1]), length);
        var mp02 = normalizeVector(midPoint(vertices[0], vertices[2]), length);
        var mp21 = normalizeVector(midPoint(vertices[2], vertices[1]), length);
        return [new Triangle(mp02.concat(mp01).concat(mp21)), new Triangle(vertices[0].concat(mp01).concat(mp02)), new Triangle(vertices[1].concat(mp21).concat(mp01)), new Triangle(vertices[2].concat(mp02).concat(mp21))];
    };
}
function Circle(prop){//don't care if num < 3!!!
    Object3D.call(this);
    var radius = prop.radius;
    var coeffTextureRadius = 32 / radius;
    var num = prop.num;
    var color = prop.color;
    var deltaAngle = Math.PI * 2 / num;
    var center = prop.center;
    this.color = [];
    this.textureCrds = [];
    var textureShift = [0, 32];
    switch (prop.name){
        case "H":
            textureShift[0] = 32;
            break;
        case "He":
            textureShift[0] = 96;
            break;
        case "C":
            textureShift[0] = 160;
            break;
        case "O":
            textureShift[0] = 224;
            break;
    }
    for (var i = 0, radVec = [0, radius]; i < num; i++, vec2rotate(radVec, radVec, [0, 0], deltaAngle)){
        var point = [];
        vec2.add(point, center, radVec);
        if (i !== 0){
            this.coords = this.coords.concat(point);
            this.color = this.color.concat(color);
            this.textureCrds = this.textureCrds.concat(circleCoord2Texture([radVec[0] * coeffTextureRadius + textureShift[0], -radVec[1] * coeffTextureRadius + textureShift[1]]));
        }
        this.coords = this.coords.concat(point);
        this.color = this.color.concat(color);
        this.textureCrds = this.textureCrds.concat(circleCoord2Texture([radVec[0] * coeffTextureRadius + textureShift[0], -radVec[1] * coeffTextureRadius + textureShift[1]]));
        this.coords = this.coords.concat(center);
        this.color = this.color.concat(color);
        this.textureCrds = this.textureCrds.concat(circleCoord2Texture([0 + textureShift[0], 0 + textureShift[1]]));
        if (i == num - 1){
            var pointLast = [];
            vec2.add(pointLast, center, [0, radius]);
            this.coords = this.coords.concat(pointLast);
            this.color = this.color.concat(color);
            this.textureCrds = this.textureCrds.concat(circleCoord2Texture([0 + textureShift[0], -radius * coeffTextureRadius + textureShift[1]]));
        }
    }
}
function circleCoord2Texture(vec2){
    var picSize = 256;
    return [(vec2[0]) / picSize, (vec2[1]) / picSize];
}
function randomInt(min, max){//returns [min, max) // [0, 1) => 0
    return Math.floor(Math.random() * (max - min)) + min;
}
function vectorLength(vector){
    var len = vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2];
    return Math.sqrt(len);
}
function normalizeVector(vector, value = 1){
    var len = vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2];
    len = Math.sqrt(len) / value;
    return [vector[0] / len, vector[1] / len, vector[2] / len];
}
function midPoint(a, b){
    return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
}
function Square(pos = zeroPoint, _side1 = [0, 1, 0], _side2 = [1, 0, 0]){
    Object3D.call(this);
    fourthVertex = vec3.create();
    vec3.add(fourthVertex, _side1, _side2);
    fourthVertex = Array.from(fourthVertex);
    this.coords = zeroPoint;
    this.coords = this.coords.concat(_side1);
    this.coords = this.coords.concat(fourthVertex);
    this.coords = this.coords.concat(zeroPoint);
    this.coords = this.coords.concat(fourthVertex);
    this.coords = this.coords.concat(_side2);
    this.position = zeroPoint;
    this.side1 = _side1;
    this.side2 = _side2;
    this.setPosition = function(newPos){
        var oldPos = this.position;
        var shift = vec3.create();
        vec3.subtract(shift, newPos, oldPos);
        this.position = newPos;
        this.coords.forEach(function(value, index, array){
            this.coords[index] = value + shift[index % 3];
        }, this);
    };
    this.setPosition(pos);
    this.getColor = function(){
        var out = [];
        var thisColor = this.color;
        return repeatArray(thisColor, 6);
    };
}
function Cube(pos = zeroPoint){
    Square.call(this);
    this.squares = [];
    this.squares.push(new Square([0, 0, 0], [0, 1, 0], [1, 0, 0]));
    this.squares.push(new Square([0, 0, 1], [1, 0, 0], [0, 1, 0]));
    this.squares.push(new Square([0, 0, 0], [1, 0, 0], [0, 0, 1]));
    this.squares.push(new Square([0, 1, 0], [0, 0, 1], [1, 0, 0]));
    this.squares.push(new Square([0, 0, 0], [0, 0, 1], [0, 1, 0]));
    this.squares.push(new Square([1, 0, 0], [0, 1, 0], [0, 0, 1]));
    this.coords = [];
    this.squares[0].setColor(Colors.random());
    this.squares[1].setColor(Colors.random());
    this.squares[2].setColor(Colors.random());
    this.squares[3].setColor(Colors.random());
    this.squares[4].setColor(Colors.random());
    this.squares[5].setColor(Colors.random());
    this.coords = this.coords.concat(this.squares[0].coords);
    this.coords = this.coords.concat(this.squares[1].coords);
    this.coords = this.coords.concat(this.squares[2].coords);
    this.coords = this.coords.concat(this.squares[3].coords);
    this.coords = this.coords.concat(this.squares[4].coords);
    this.coords = this.coords.concat(this.squares[5].coords);
    this.setPosition(pos);
    this.getColor = function(){
        var out = [];
        var thisColor = this.color;//FIX!!!
        return repeatArray(this.color, 36);//BUG!
    };
}
function repeatArray(arrin, times){
    var out = [];
    for (var i = 0; i < times; i++)
        out = out.concat(arrin);
    return out;
}
function Wall(){
    
}