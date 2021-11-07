let pts = []
let mcurve = []
let drawn = false
let done = false
let  increment = 0.005

function setup() {
  createCanvas(700, 700);
  document.addEventListener('contextmenu', event => event.preventDefault());
}

let hint = ""
let t = 1
function draw() {
  noStroke()
  background(245);
  fill(0)
  
  text("t=" + round(1-t, 2), 10, 35)
  text("Left Click to create a point", 10, 50)
  text("Right Click to start curve", 10, 65)
  text(hint, 10, 75)

  rect(0, 0, width * (1-t), 20) 
  if(mouseY < 20 && drawn && done){
    t = 1- (mouseX / width)
  }

  for(let i=0; i<pts.length; i++){
    ellipse(pts[i][0], pts[i][1], 4)
    if(i+1 < pts.length){
      stroke(0)
      strokeWeight(1)
      line(pts[i][0], pts[i][1], pts[i+1][0], pts[i+1][1])
    }
  }
  
  if(drawn && t > 0){
    if(!done){
      mcurve.push(spline(pts))
    }
    else{
      spline(pts)
    }
    t -= increment
  }

  if(t <= increment){
    done = true
  }
  
  if(!drawn && pts.length != 0){
    line(mouseX, mouseY, pts[pts.length-1][0], pts[pts.length-1][1])
  }

  if(mcurve.length > 1){
    for(let i=0; i<mcurve.length - 1; i++){
      strokeWeight(4)
      line(mcurve[i][0], mcurve[i][1], mcurve[i+1][0], mcurve[i+1][1])
    }
  }
  
  stroke(0)
  ellipse(mouseX, mouseY, 5)
  //if(t < increment) { t = 0 }
}

function mousePressed(){
  if(drawn){
    drawn = false
    done  = false
    mcurve = []
    t = 1
    pts = []
  }
  if(mouseButton === LEFT){
    pts.push([mouseX, mouseY])
  }
  if(mouseButton === RIGHT){
    if(pts.length > 2){
      t = 1
      drawn = true
      hint = ""
    }
    else{
      hint = "You need at least 3 points to draw a curve."
    }
  }
}

function spline(points){
  let lines = []
  for(let i=0; i<points.length - 1; i++){
    let x1 = percentBetween(points[i][0], points[i+1][0], t)
    let y1 = percentBetween(points[i][1], points[i+1][1], t)
    lines.push([x1, y1])
  }
  for(let i=0; i<lines.length; i++){
    ellipse(lines[i][0], lines[i][1], 3)
    if(i+1 < lines.length){
      line(lines[i][0], lines[i][1], lines[i+1][0], lines[i+1][1])
    }
  }
  if(lines.length == 2){
    let x1 = percentBetween(lines[0][0], lines[1][0], t)
    let y1 = percentBetween(lines[0][1], lines[1][1], t)
    ellipse(x1, y1, 10)
    return [x1, y1]
  }
  else{
    return spline(lines)
  }
}

function percentBetween(a, b, p){
  let change = b - a
  let pchange = p * change
  return b - pchange
}
