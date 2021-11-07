let pts = []
let mcurve = []
let drawn = false
let done = false
const increment = 0.005

class Vector{
    constructor(x, y){
        this.x = x
        this.y = y
    }

    interpolate(to, percent){
        return new Vector(lerp(this.x, to.x, percent), lerp(this.y, to.y, percent))
    }

    lineto(to){
        line(this.x, this.y, to.x, to.y)
    }

    point(radius){
        ellipse(this.x, this.y, radius)
    }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
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
    pts[i].point(4)
    if(i+1 < pts.length){
      stroke(0)
      strokeWeight(1)
      pts[i].lineto(pts[i+1])
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
    pts[pts.length-1].lineto(new Vector(mouseX, mouseY))
  }

  if(mcurve.length > 1){
    for(let i=0; i<mcurve.length - 1; i++){
      strokeWeight(4)
      mcurve[i].lineto(mcurve[i+1])
    }
  }
  
  stroke(0)
  ellipse(mouseX, mouseY, 5)
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
    pts.push(new Vector(mouseX, mouseY))
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
    lines.push(points[i].interpolate(points[i+1], t))
  }
  for(let i=0; i<lines.length; i++){
    lines[i].point(3)
    if(i+1 < lines.length){
      lines[i].lineto(lines[i+1])
    }
  }
  if(lines.length == 2){
    let pos = lines[0].interpolate(lines[1], t)
    pos.point(10)
    return pos
  }
  else{
    return spline(lines)
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}