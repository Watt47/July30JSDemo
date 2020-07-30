var gl;
var shaderProgram;
var programInfo;
var buffers;
// Load texture
var texture; 
var camera = new Camera([-0.0, 0.0, -6.0], [0, 0, 1]);
var points = [];
camera.height = 0;
const step = 1.0;
const cameraViewMatrix = mat4.create();
inclination = 0;
rotation = 0;

function unproject(vector){
    const projectionMatrix = mat4.create();
      const halfWidth = gl.canvas.clientWidth / 2;
      const halfHeight = gl.canvas.clientHeight / 2;
      const zNear = -1;
      const zFar = 1;
    mat4.ortho(projectionMatrix, -halfWidth, halfWidth, -halfHeight, halfHeight, zNear, zFar);
    mat4.invert(projectionMatrix, projectionMatrix);
    vec4.transformMat4(vector, vector, projectionMatrix);
    vector[0] /= vector[3];
    vector[1] /= vector[3];
    vector[2] /= vector[3];
    vector[3] = 1;
    return vector;
}
function status(text){
    document.getElementById("status").innerHTML = text;
}
function start(){
  //  createUI();
    camera.forward(-10);
   // AssignBtnClicks();
  var canvas = document.getElementById("glcanvas");
  canvas.width = window.innerWidth - 0;
  canvas.height = window.innerHeight - 60;
  gl = initWebGL(canvas);      // инициализация контекста GL
  // продолжать только если WebGL доступен и работает
  texture = loadTexture(gl, 'pic/atoms.png');
  if (gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // установить в качестве цвета очистки буфера цвета черный, полная непрозрачность
    gl.enable(gl.DEPTH_TEST);                               // включает использование буфера глубины
    gl.depthFunc(gl.LEQUAL);                                // определяет работу буфера глубины: более ближние объекты перекрывают дальние
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);      // очистить буфер цвета и буфер глубины.
    gl.cullFace(gl.BACK);
  //  gl.enable(gl.CULL_FACE);
  
  // Enable blending
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

   shaderProgram = initShaderProgram(gl, vsSource2Dtexture, fsSource);//set shaders!!!
    programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: glgetAttribLocation(shaderProgram, 'aVertexPosition'),
  //    color: glgetAttribLocation(shaderProgram, 'aVertexColor'),
      textureCoord: glgetAttribLocation(shaderProgram, 'aTextureCoord')
      },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
    },
  };

     // Here's where we call the routine that builds all the
  // objects we'll be drawing.
   buffers = initBuffers(gl);

  // Draw the scene
drawScene(gl, programInfo, buffers);
requestAnimationFrame(render);
}
function glgetAttribLocation(shaderProgram, param){
    var res = gl.getAttribLocation(shaderProgram, param);
    if (res == -1)
        alert("Variable " + param + " location not found in a shader!");
    return res;
}
function initWebGL(canvas) {
  gl = null;
  try {
    // Попытаться получить стандартный контекст. Если не получится, попробовать получить экспериментальный.
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  }
  catch(e) {}
  // Если мы не получили контекст GL, завершить работу
  if (!gl) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
    gl = null;
  }
  return gl;
}
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}
var positionBuffer;
var textureCoordBuffer;
function updateBuffer(data){//data is array of points
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 6 * 3 * 4, new Float32Array(data));
}
function updateAtomCoords(data, id, coord_num){
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 6 * dimensions * 4 + 4 * dimensions * id * coord_num, new Float32Array(data));
}
function updateAtomColor(data, id){
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 6 * 4 * 4 + 4 * 4 * id * circleDepth * 3, new Float32Array(data));
}
function updateAtomTexture(data, id){
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 6 * 2 * 4 + 4 * 2 * id * circleDepth * 3, new Float32Array(data));
}
function updateTextureBuffer(data, tileId){
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 12 * 2 * 4 + tileId * 6 * 4, new Float32Array(data));
}
var colorBuffer;
function initBuffers(gl) {
  // Create a buffer for the square's positions.
  positionBuffer = gl.createBuffer();
  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // Now create an array of positions for the square.
  var data = loadData();
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.coords), gl.DYNAMIC_DRAW);

   colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.colors), gl.STATIC_DRAW);
  
  textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
 // const textureCoords = repeatArray([0, 0.5, .5, 0.5, 0.25, 1], data.coords.length / 9);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.texture), gl.STATIC_DRAW);
  
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.indices), gl.STATIC_DRAW);
  timerId = setInterval(function(){
        var moved = false;
      atoms.forEach(function(el, id){
          if (el.level == 10){
            totalAtoms++;
            labelAtomsCount.setText("Atoms (атомов): " + totalAtoms);
          }
          if (AtomDown(id)){
            updateAtomCoords(atoms[id].coords, id, circleDepth * 3);
            moved = true;
          }
      });
      if (!moved) DropNextAtom();
  }, timer);
  return {
    vertexCount: data.coords.length / dimensions,
    position: positionBuffer,
    color: colorBuffer,
    textureCoord: textureCoordBuffer
  };
}
timer = 1000;
dimensions = 2;
first = true;
startAtom = -1;
endAtom = -1;
reaction = [];
allowedReactions = ["HH", "OO", "HOH", "OCO", "CO", "OC"];
allowedEnergy = [104, 494, 930, 1, 2, 3];
totalEnergy = 0;
totalReact = 0;
totalAtoms = 0;
function startTouch(){
    canvas = document.getElementById("glcanvas");
    PointerMain();
    labelReact = new Label({title : "title", x : 100, y : 200, color : "#00FF00"});
    labelPts = new Label({title : "title", x : 100, y : 100, color : "#00FF00"});
    labelLastRct = new Label({title : "title", x : 100, y : 300, color : "#00FF00"});
    labelLastRctAllowed = new Label({title : "title", x : 100, y : 400, color : "#00FF00"});
    labelAtomsCount = new Label({title : "title", x : 100, y : 50, color : "#00FF00"});
    labelCanvasRes = new Label({title : "title", x : 100, y : 150, color : "#00FF00"});
    labelCanvasRes.setText("Canvas size (разрешение поля): " + canvas.width + " x " + canvas.height);
    labelFieldSize = new Label({title : "title", x : 100, y : 250, color : "#00FF00"});
    labelFieldSize.setText("Field size (размер поля): " + field.x + " x " + field.y);
    labelGameOver = new Label({title : "", x : 400, y : 250, color : "#FF0000"});
    UI();
}
function trackAtom(e){
    e.preventDefault();
    tempAtomId = event2CircleId(e);
    if (tempAtomId == -1) return;
    if (tempAtomId != reaction[reaction.length - 1]){
        if (reaction.some((el, i) => el == tempAtomId)){
            reaction = [];
            return;
        }
        if (Math.abs(atoms[tempAtomId].column - atoms[reaction[reaction.length - 1]].column) > 1 || Math.abs(atoms[tempAtomId].level - atoms[reaction[reaction.length - 1]].level) > 1){
            reaction = [];
            return;
        }
        reaction.push(tempAtomId);
    }
 //  return false;
}
function event2coord(event){
    event = event || window.event;
    var touch;
    if (event.touches)
        touch = event.touches[0] || event.changedTouches[0];
    return {
        x : event.clientX || touch.clientX,
        y : event.clientY || touch.clientY 
    }
}
function event2CircleId(e){
    var coord = event2coord(e);
    var cord = XY2GL(coord.x, coord.y);
    var vec = [cord.x, cord.y, 0, 1];
    vec = unproject(vec);
    return clickCoord2CircleId(vec[0], vec[1]);
}
function clickCoord2CircleId(x, y){
    //cycle objects, return 1st with distance < radius
   // alert(x + ":" + y);
    var me = atoms.findIndex(atom => (atom.center[0] - x) * (atom.center[0] - x) + (atom.center[1] - y) * (atom.center[1] - y) < atomRadius * atomRadius);
    return me;
}
function XY2GL(x, y){
   /*     if (e.pageX || e.pageY) { 
            x = e.pageX;
            y = e.pageY;
        }
        else { 
            x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
            y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
        } */
    var canvas = document.getElementById("glcanvas");

        x -= canvas.offsetLeft + (canvas.width / 2);
        y -= canvas.offsetTop + (canvas.height / 2);
        y = -y;
        x /= (canvas.width / 2);
        y /= (canvas.height / 2);
    return {x : x, y : y};
}
function drawScene(gl, programInfo, buffers, deltaTime, texture) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const halfWidth = gl.canvas.clientWidth / 2;
  const halfHeight = gl.canvas.clientHeight / 2;
  const zNear = -1;
  const zFar = 1;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);//remove???
mat4.ortho(projectionMatrix, -halfWidth, halfWidth, -halfHeight, halfHeight, zNear, zFar);
modelViewMatrix = mat4.create();//remove???
//remove next line??
mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 [-0.0, -1.0, -6.0]);  // amount to translate
modelViewMatrix = mat4.lookAt(modelViewMatrix, camera.getEye(), camera.getCenter(), [0, 1, 0]);
var viewMatrix = mat4.create();
mat4.rotateX(viewMatrix, viewMatrix, inclination);
mat4.rotateY(viewMatrix, viewMatrix, rotation);
//alert(first);
/*if (first)
console.log(modelViewMatrix);*/
mat4.mul(modelViewMatrix, modelViewMatrix, viewMatrix);
/*if (first)
console.log(projectionMatrix);
if (first)
console.log(viewMatrix);
first = false;*/
//alert(first);

if (first){
    const m = mat4.create();
    mat4.mul(m, projectionMatrix, modelViewMatrix);
  //  console.log("draw", m);
    first = false;
}
  {
    const numComponents = 2;  // pull out 2 values per iteration
    const type = gl.FLOAT;    // the data in the buffer is 32bit floats
    const normalize = false;  // don't normalize
    const stride = 0;         // how many bytes to get from one set of values to the next
                              // 0 = use type and numComponents above
    const offset = 0;         // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    var e1rr = gl.getError();
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
    var err = gl.getError();
  }
// tell webgl how to pull out the texture coordinates from buffer
 /* {
    const numComponents = 4; // every coordinate composed of 2 values
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
        programInfo.attribLocations.color,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.color);
  //  var err = gl.getVertexAttrib(programInfo.attribLocations.color, gl.VERTEX_ATTRIB_ARRAY_ENABLED);
 //   var errr = gl.getVertexAttribOffset(programInfo.attribLocations.color, gl.VERTEX_ATTRIB_ARRAY_POINTER);
        
  }*/
  
// tell webgl how to pull out the texture coordinates from buffer
  {
    const numComponents = 2; // every coordinate composed of 2 values
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
    ///////// SHOULD VERIFY HERE THAT index of the vertex attribute IS NOT UNDEFINED!!! THERE 's no ' other means to check error here!! looks lika a bug ibin webgl!!
    gl.vertexAttribPointer(
        programInfo.attribLocations.textureCoord,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
  //  var err1 = gl.getVertexAttrib(programInfo.attribLocations.textureCoord, gl.VERTEX_ATTRIB_ARRAY_ENABLED);
 //   var errr2 = gl.getVertexAttribOffset(programInfo.attribLocations.textureCoord, gl.VERTEX_ATTRIB_ARRAY_POINTER);
            
  }

  
  {//indices go here
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
      
  }

  // Tell WebGL to use our program when drawing
  gl.useProgram(programInfo.program);
  // Set the shader uniforms
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);

  {
      
        // Tell WebGL we want to affect texture unit 0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture to texture unit 0
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // Tell the shader we bound the texture to texture unit 0
  gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
  
    const offset = 6;// vertices num of box
    const vertexCount = buffers.vertexCount;
    gl.drawArrays(gl.TRIANGLES, offset, vertexCount - offset);
    gl.clear(gl.DEPTH_BUFFER_BIT);
    
    gl.drawArrays(gl.LINES, 0, offset);
  }
}
var then = 0;
var frames = 0;
//  var activeTriangle = 0;
function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;
    frames++;
    status("time: " + Number.parseFloat(now).toFixed(1) + " frames: " + frames + " fps: " + Math.round(1 / deltaTime ));
 //   squareRotate(deltaTime);
    drawScene(gl, programInfo, buffers, deltaTime, texture);
    requestAnimationFrame(render);
  }