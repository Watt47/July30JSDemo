/**

 * Rotate a 2D vector

 * @param {vec2} out The receiving vec2

 * @param {vec2} a The vec2 point to rotate

 * @param {vec2} b The origin of the rotation

 * @param {Number} c The angle of rotation

 * @returns {vec2} out

 */

function vec2rotate(out, a, b, c) {

  //Translate point to the origin

  let p0 = a[0] - b[0],

  p1 = a[1] - b[1],

  sinC = Math.sin(c),

  cosC = Math.cos(c);

  

  //perform rotation and translate to correct position

  out[0] = p0*cosC - p1*sinC + b[0];

  out[1] = p0*sinC + p1*cosC + b[1];

  return out;

}