import { Framebuffer } from './framebuffer.js';
import { Rasterizer } from './rasterizer.js';
// DO NOT CHANGE ANYTHING ABOVE HERE

////////////////////////////////////////////////////////////////////////////////
// TODO: Implement functions drawLine(v1, v2) and drawTriangle(v1, v2, v3) below.
////////////////////////////////////////////////////////////////////////////////

// Linear interpolation function
function interpolate(c1, c2, distance) {
  return c1 + (c2 - c1) * distance;
}
// take two vertices defining line and rasterize to framebuffer
Rasterizer.prototype.drawLine = function(v1, v2) {
  const [x1, y1, [r1, g1, b1]] = v1;
  const [x2, y2, [r2, g2, b2]] = v2;
 
  // Calculate differences between the coordinates and the steps needed to take
  const dx = x2 - x1;
  const dy = y2 - y1;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));

  // Calculate increments for x and y
  const xIncrement = dx / steps;
  const yIncrement = dy / steps;

  // Draw the line for each pixel
  for (let i = 0; i <= steps; i++) {
    const x = x1 + i * xIncrement;
    const y = y1 + i * yIncrement;
    // Interpolate color values
    const distance = i / steps;
    const interpolatedColor = [
      interpolate(r1, r2, distance),
      interpolate(g1, g2, distance),
      interpolate(b1, b2, distance)
    ];

    this.setPixel(Math.floor(x), Math.floor(y), interpolatedColor);
  }
}

// Helper function to determine if a point is inside a triangle
function pointIsInsideTriangle(v1, v2, v3, p) {
  const [x1, y1, [r1, g1, b1]] = v1;
  const [x2, y2, [r2, g2, b2]] = v2;
  const [x3, y3, [r3, g3, b3]] = v3;
  const [x, y] = p;

  // Calculate area of the three 3 half-planes
  const plane1 = ((x2 - x1)*(y - y1)) - ((y2 - y1)*(x - x1));
  const plane2 = ((x3 - x2)*(y - y2)) - ((y3 - y2)*(x - x2));
  const plane3 = ((x1 - x3)*(y - y3)) - ((y1 - y3)*(x - x3));

  if ((plane1 >= 0 && plane2 >= 0 && plane3 >= 0) || (plane1 <= 0 && plane2 <= 0 && plane3 <= 0)) {
    return true;
  }
  
  return false;
}

function barycentricCoordinates(v1, v2, v3, p) {
  const [x1, y1, [r1, g1, b1]] = v1;
  const [x2, y2, [r2, g2, b2]] = v2;
  const [x3, y3, [r3, g3, b3]] = v3;
  const [x, y] = p;

  // Calculate areas by re-using line equations from inside test
  const a1 = ((x3 - x2)*(y - y2)) - ((y3 - y2)*(x - x2));
  const a2 = ((x1 - x3)*(y - y3)) - ((y1 - y3)*(x - x3));
  const a3 = ((x2 - x1)*(y - y1)) - ((y2 - y1)*(x - x1));
  const a = a1 + a2 + a3;

  // Calculate Barycentric coordinates
  const u = a1 / a;
  const v = a2 / a;
  const w = a3 / a;

  // Determine color at the point
  const pc = [
    u * v1[2][0] + v * v2[2][0] + w * v3[2][0], 
    u * v1[2][1] + v * v2[2][1] + w * v3[2][1],
    u * v1[2][2] + v * v2[2][2] + w * v3[2][2] 
  ];

  return pc;
}

// take 3 vertices defining a solid triangle and rasterize to framebuffer
Rasterizer.prototype.drawTriangle = function(v1, v2, v3) {
  const [x1, y1, [r1, g1, b1]] = v1;
  const [x2, y2, [r2, g2, b2]] = v2;
  const [x3, y3, [r3, g3, b3]] = v3;

  // Calculate bounding box coordinates
  const xMin = Math.ceil(Math.min(x1, x2, x3));
  const xMax = Math.ceil(Math.max(x1, x2, x3));
  const yMin = Math.ceil(Math.min(y1, y2 ,y3));
  const yMax = Math.ceil(Math.max(y1, y2, y3));

  // Iterate over bounding box
  for (let row = yMin; row <= yMax; row++) {
    for (let col = xMin; col <= xMax; col++) {
      // Check if point is inside triangle
      if (pointIsInsideTriangle(v1, v2, v3, [col, row]) == true) {
        // Set pixel color using barycentric function
        this.setPixel(Math.floor(col), Math.floor(row), barycentricCoordinates(v1, v2, v3, [col, row]));
      }
    }
  }
}


////////////////////////////////////////////////////////////////////////////////
// EXTRA CREDIT: change DEF_INPUT to create something interesting!
////////////////////////////////////////////////////////////////////////////////
const DEF_INPUT = [
"v,10,20,1.0,0.0,0.0;",
"v,30,30,0.0,1.0,0.0;",
"v,50,20,0.0,0.0,1.0;",
"v,30,10,1.0,0.0,1.0;",
"v,30,50,1.0,1.0,1.0;",
"v,10,40,1.0,1.0,0.0;",
"v,50,40,0.0,1.0,1.0;",
"v,50,10,0.0,0.0,0.0;",
"t,0,1,3;",
"t,1,3,2;",
"t,0,1,5;",
"t,1,5,4;",
"t,4,1,6;",
"t,1,6,2;",
"v,10,20,1.0,1.0,1.0;",
"v,30,30,0.0,0.0,0.0;",
"v,50,20,1.0,1.0,1.0;",
"v,30,10,0.0,0.0,0.0;",
"v,30,50,1.0,1.0,1.0;",
"v,10,40,0.0,0.0,0.0;",
"v,50,40,0.0,0.0,0.0;",
"v,52,10,0.0,0.0,0.0;",
"l,8,9;",
"l,9,10;",
"l,8,11;",
"l,10,11;",
"l,9,12;",
"l,8,13;",
"l,10,14;",
"l,12,13;",
"l,12,14;"
].join("\n");


// "v,10,10,1.0,0.0,0.0;",
//   "v,52,52,0.0,1.0,0.0;",
//   "v,52,10,0.0,0.0,1.0;",
//   "v,10,52,1.0,1.0,1.0;",
//   "t,0,1,2;",
//   "t,0,3,1;",
//   "v,10,10,1.0,1.0,1.0;",
//   "v,10,52,0.0,0.0,0.0;",
//   "v,52,52,1.0,1.0,1.0;",
//   "v,52,10,0.0,0.0,0.0;",
//   "l,4,5;",
//   "l,5,6;",
//   "l,6,7;",
//   "l,7,4;"

// DO NOT CHANGE ANYTHING BELOW HERE
export { Rasterizer, Framebuffer, DEF_INPUT };
