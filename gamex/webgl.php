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
        loadJS("const.js");
        loadJS("http://3d.wattsapp.su/objects3d.js");
        loadJS("http://3d.wattsapp.su/sphere.js");
        loadJS("http://3d.wattsapp.su/colors.js");
        loadJS("lib.js");
        loadJS("data.js", "cache");
        loadJS("uievents.js", "cache");
        loadJS("http://3d.wattsapp.su/texture.js");
        loadJS("main.js", "cache");
       // loadJS("game.js");
        ?>
    <title>WebGL GameX demo</title>
    </head>
<body onload="start(); attachUI();">
  <canvas id="glcanvas" width="640" height="480">
    Your browser doesn't appear to support the HTML5 <code>&lt;canvas&gt;</code> element.
  </canvas>
  <div id=status></div>
</body>
</HTML>