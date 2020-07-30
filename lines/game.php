<?
require_once("../3d/lib.php");
?>
<!DOCTYPE html>
<HTML>
    <head>
    <meta http-equiv="expires" content="Sun, 01 Jan 2014 00:00:00 GMT"/>
    <meta http-equiv="pragma" content="no-cache" />
    <meta charset="utf-8">
    <script>mode = "map";</script>
        <?
        loadJS("http://3d.wattsapp.su/external/gl-matrix.js");
        loadJS("http://3d.wattsapp.su/shaders.js");
        loadJS("http://3d.wattsapp.su/camera.js");
        loadJS("http://3d.wattsapp.su/const.js");
        loadJS("http://3d.wattsapp.su/objects3d.js", "cache");
      //  loadJS("http://3d.wattsapp.su/sphere.js");
        loadJS("http://3d.wattsapp.su/colors.js", "cache");
      //  loadJS("lib.js");
        loadJS("data.js", "cache");
        loadJS("vec2.js", "cache");
    //    loadJS("uievents.js", "cache");
        loadJS("http://3d.wattsapp.su/texture.js");
        loadJS("main.js", "cache");
        loadJS("ui.js");
        loadJS("sounds.js");
        loadJS("pointer.js");
        loadJS("atom.js");
        ?>
    <title>WebGL Chemical Lines demo</title>
      <link rel="stylesheet" type="text/css" href="styles.css">
    </head>
<body onload=" start(); startTouch(); // attachUI();">
         <ul>
      <li onclick="buttonClick(event)" id=start>Start game</li>
      <li onclick="buttonClick(event)" id=statsBtn>Stats</li>
      <li onclick="buttonClick(event)" id=optionsBtn>Opts</li>
  </ul>

  <canvas id="glcanvas" width="100%" height="480">
    Your browser doesn't appear to support the HTML5 <code>&lt;canvas&gt;</code> element.
  </canvas>

  <div id=status style="display:none;"></div>
   <div id="menu" class=popup>MENU</div> 
   <div id="stats" class=popup style="overflow:scroll;">STATS<div onclick="buttonClick(event)" id=statsclose>Close X</div></div> 
   <div id="options" class=popup><ul>
       <div onclick="buttonClick(event)" id=optsclose>Close X</div>
       <li onclick="buttonClick(event)" id=reset>Reset stats</li>
       <li onclick="buttonClick(event)" id=soundL><input type=checkbox name="sound" id=soundCheck><label for=soundCheck>Sound</label></li>
   </ul></div>

</body>
</HTML>