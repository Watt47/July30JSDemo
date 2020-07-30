<?
require_once("lib.php");
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>QUnit Example</title>
  <link rel="stylesheet" href="https://code.jquery.com/qunit/qunit-2.6.2.css">
</head>
<body>
  <div id="qunit"></div>
  <div id="qunit-fixture"></div>
  <script src="https://code.jquery.com/qunit/qunit-2.6.2.js"></script>
  <?
  loadJS("const.js");
  loadJS("colors.js");
  loadJS("objects3d.js");
  loadJS("tests.js");
  ?>
  <script src="external/gl-matrix.js"></script>
</body>
</html>