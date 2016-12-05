//----------global defaults
//---display
var backgroundColor, speed, numConstellations;

//---constellation parameters
//minimum constellation size is subject to conflicts with trapped constellations by angle or overlap
var minimumConstellationSize, maximumConstellationSize;
var minStarSize, maxStarSize;
var minMagnitude, maxMagnitude;
var minAngle;
var maxClosedLoopsPerConstellation;

//probabilities
var probabilityOfSingleStars;
var probabilityOfClosedLoops;
var zeroNodeProbAfterMinSizeReached, initialZeroNodeProb, initialOneNodeProb, initialTwoNodeProb, initialThreeNodeProb;

//persistence = number of attempts at randomly creating a vector that has no intersect or angle conflicts
var persistence;

//vector helper
var emptyVector;

//interface
var minMagnitudeSlider, maxMagnitudeSlider, minAngleSlider;
var spacing, sliderLeftAlign, textLeftAlign, interfaceRows, numElements, padding;

//------TO DO-------
//MERGE AFTER SENTENCE EXPANSION (to get rid of matching commits) :P :P :P
//Reference constellation colors; too many arguments being passed on
//Figure out bug with closed loop density

var constellations;

//=========================
//Main functions
//=========================
function setup() {
  makeCanvas();
  createInterface();

  //generate constellations
  setInitialValues();
  resetDisplay();
}
function makeCanvas(){
    var canvas = createCanvas($(window).width(), $(window).height());
    canvas.parent('canvas-background');
    backgroundColor = "#011433";
};

function setInitialValues(){
  constellations = new Array(numConstellations);
  speed = 0.5;
  numConstellations = 150;
  minimumConstellationSize = 4;
  maximumConstellationSize = 8;
  minStarSize = 1;
  maxStarSize = 5;
  minMagnitude = minMagnitudeSlider.value();
  maxMagnitude = maxMagnitudeSlider.value();
  minAngle = minAngleSlider.value();
  maxClosedLoopsPerConstellation = 1;
  probabilityOfSingleStars = 0.85;
  zeroNodeProbAfterMinSizeReached = 0.5;
  initialZeroNodeProb = 0;
  initialOneNodeProb = 0.3;
  initialTwoNodeProb = 0.5;
  initialThreeNodeProb = 0.2;
  probabilityOfClosedLoops = 0.5;
  persistence = 5;

  //vector helper
  emptyVector = [0,0];
};

function createInterface(){
  spacing = 20;
  sliderLeftAlign = 200;
  textLeftAlign = 20;
  padding = 20;
  rows = [];
  numElements = 4;

  for (var i = 1; i < numElements + 1; i++){
    rows.push(height - i * spacing - padding)
  }

  minMagnitudeSlider = createSlider(5, 50, 15);
  minMagnitudeSlider.position(sliderLeftAlign, rows[3]);
  maxMagnitudeSlider = createSlider(60, 150, 100);
  maxMagnitudeSlider.position(sliderLeftAlign, rows[2]);
  minAngleSlider = createSlider(0, 0.97 * PI, PI/3);
  minAngleSlider.position(sliderLeftAlign, rows[1]);

  resetButton = createButton('Generate New Constellations');
  resetButton.position(textLeftAlign, rows[0]);
  resetButton.mousePressed(resetDisplay);

  minMagnitudeSlider.style('width', '80px');
  maxMagnitudeSlider.style('width', '80px');
  minAngleSlider.style('width', '80px');


};

function resetDisplay(){
  for (var i = 0; i < numConstellations; i++) {
    constellations[i] = new Constellation(-width, width, -height / 4, height);
  };
}
function drawText() {
    var textSliderAlign = 13;
    fill(255, 255, 255);
    textSize(15);
    text("Minimum Line Magnitude", textLeftAlign, rows[3] + textSliderAlign);
    text("Maximum Line Magnitude", textLeftAlign, rows[2] + textSliderAlign);
    text("Minimum Angle", textLeftAlign, rows[1] + textSliderAlign);
};

function draw() {
  minMagnitude = minMagnitudeSlider.value();
  maxMagnitude = maxMagnitudeSlider.value();
  minAngle = minAngleSlider.value();

  //move all constellations
  background(backgroundColor);
  drawText();
  for (var i = 0; i < constellations.length; i++) {
    var offscreen = true;
    for (var j = 0; j < constellations[i].constellationStars.length; j++) {
      noStroke();
      fill(constellations[i].r, constellations[i].g, constellations[i].b);
      constellations[i].constellationStars[j].update();
      //check if entire constellation is offscreen
      if (constellations[i].constellationStars[j].xpos < width && constellations[i].constellationStars[j].ypos < height) {
        offscreen = false;
      };
    };
    //if offscreen, replace with new constellation to the left of and slightly above the screen
    if (offscreen) {
      constellations[i] = new Constellation(-width * 1.5, -width * 0.5, -height/4, height * 3 / 4);
    };
    for (var j = 0; j < constellations[i].constellationLines.length; j++) {
      stroke(constellations[i].r, constellations[i].g, constellations[i].b);
      constellations[i].constellationLines[j].update();
    };
  };
};


//=========================
//Classes
//=========================
var Constellation = function(minx, maxx, miny, maxy){
  //collection of stars and lines which connect them, or single star
  var that = this;
  this.constellationStars = [];
  this.constellationLines = [];
  this.closedLoops = 0;
  this.r = 255;
  this.g = 255;
  this.b = 255;
  this.startX = random(minx, maxx);
  this.startY = random(miny, maxy);
  this.nodeProbabilities = {
    0 : initialZeroNodeProb,
    1 : initialOneNodeProb,
    2 : initialTwoNodeProb,
    3 : initialThreeNodeProb
  };
  this.init = function(){
      that.constellationStars.push(new Star(that.startX, that.startY, random(minStarSize, maxStarSize)));
      that.singleStar = random(0, 1);
      if (that.singleStar > probabilityOfSingleStars) {
          workFromNode(that, that.constellationStars[0]);
      };
  };
  this.init();
};

var Star = function(x, y, s){
  //set of coordinates, radius, and color
  var that = this;
  this.xpos = x;
  this.ypos = y;
  this.size = s;
  this.update = function(){
    that.xpos += speed;
    that.ypos += speed / 4;
    ellipse(this.xpos, this.ypos, that.size, that.size);
  };
};

var Line = function (star1, star2){
  //line between two stars
  this.star1 = star1;
  this.star2 = star2;
  this.update = function() {
    line(this.star1.xpos, this.star1.ypos, this.star2.xpos, this.star2.ypos);
  };
};

//=========================
//Functions
//=========================

function workFromNode(constellation, node) {
  //recursively evaluates whether to grow from node, how many new vectors to draw, and where to place them
  var newNodes = 0;
  if (constellation.constellationStars.length >= minimumConstellationSize && constellation.zeroNodeProb == 0) {
    constellation.nodeProbabilities[0] = zeroNodeProbAfterMinSizeReached;
    constellation.nodeProbabilities[1] -= zeroNodeProbAfterMinSizeReached / 3;
    constellation.nodeProbabilities[2] -= zeroNodeProbAfterMinSizeReached / 3;
    constellation.nodeProbabilities[3] -= zeroNodeProbAfterMinSizeReached / 3;
  };

  var nextMoveProb = random(0, 1);
  for (var i = 0; i < 4; i++) {
    if (nextMoveProb <= constellation.nodeProbabilities[i]) {
      newNodes = i;
      break;
    } else {
      nextMoveProb -= constellation.nodeProbabilities[i];
    }
  }

  for (var j = 0; j < newNodes; j++) {
    var closedLoop = false;
    if (constellation.constellationStars.length < maximumConstellationSize) {
      //create closed loop if chance dictates and if possible
      closedLoop = createClosedLoop(closedLoop, constellation, node);

      //make new node if closed loop was not created already
      //only make new vector if newVector function was able to find a nonconflicting option within 10 tries (arbitrary value)
      if (!closedLoop) {
        var newVector = createNewVector(constellation, node);
        if (newVector != emptyVector) {
          var x = newVector[0] + node.xpos;
          var y = newVector[1] + node.ypos;
          var newStar = new Star(x, y, random(minStarSize, maxStarSize));
          var newLine = new Line(node, newStar);
          constellation.constellationStars.push(newStar);
          constellation.constellationLines.push(newLine);
          workFromNode(constellation, newStar);
        };
      };
    };
  };
};

function createClosedLoop(complete, constellation, node){
  //connect to old node if chance dictates and if possible, but do not retrace an existing line
  if (constellation.constellationStars.length >= 3 && constellation.closedLoops < maxClosedLoopsPerConstellation && random(0, 1) < probabilityOfClosedLoops) {
        for (var k = 0; k < constellation.constellationStars.length; k++) {
          if (node == constellation.constellationStars[k]){
            continue;
          };
          var connected = false;
          for (var m = 0; m < constellation.constellationLines.length; m++) {
            var oldStarInLine = constellation.constellationLines[m].star1 == constellation.constellationStars[k] || constellation.constellationLines[m].star2 == constellation.constellationStars[k];
            var nodeInLine = constellation.constellationLines[m].star1 == node && constellation.constellationLines[m].star2 == node;
            if (oldStarInLine && nodeInLine) {
              connected = true;
              break;
            };
          };

          if (!connected) {
            var vector = [constellation.constellationStars[k].xpos - node.xpos, constellation.constellationStars[k].ypos - node.ypos];
            //vector = checkForAngleConflicts(constellation, node, vector);
            //check for intersection with lines in this constellation
            var intersect = false;
            for (var h = 0; h < constellation.constellationLines.length; h++) {
              if (!intersect) {
                var existingLine = constellation.constellationLines[h];
                intersect = intersection(node, vector, existingLine);
              };
            };
            //check for intersection with lines in all other constellations
            for (var i = 0; i < constellations.length; i++) {
              if (constellations[i] != null) {
                for (var l = 0; l < constellations[i].constellationLines.length; l++) {
                  if (!intersect) {
                    var existingLine = constellations[i].constellationLines[l];
                    intersect = intersection(node, vector, existingLine);
                  };
                };
              };
            };
            if (!intersect) {
              constellation.closedLoops += 1;
              var newLine = new Line(node, constellation.constellationStars[k]);
              constellation.constellationLines.push(newLine);
              workFromNode(constellation, constellation.constellationStars[k]);
              complete = true;
            };
          };
        };
      };
    return complete;
};

function intersection(star1, vector1, existingLine) {
  //find povar of intersection of lines; return true if overlap
  var line1_slope, line2_slope, line1_b, line2_b, int_x, line1_x1, line1_x2, line1_y1, line1_y2, line2_x1, line2_x2, line2_y1, line2_y2;
  line1_x1 = star1.xpos;
  line1_x2 = star1.xpos + vector1[0];
  line1_y1 = star1.ypos;
  line1_y2 = star1.ypos + vector1[1];
  line2_x1 = existingLine.star1.xpos;
  line2_x2 = existingLine.star2.xpos;
  line2_y1 = existingLine.star1.ypos;
  line2_y2 = existingLine.star2.ypos;

  if (max(line1_x1, line1_x2) < min(line2_x1, line2_x2) || max(line1_y1, line1_y2) < min(line2_y1, line2_y2)) {
    return false;
  }

  line1_slope = (line1_y2 - line1_y1) / (line1_x2 - line1_x1);
  line2_slope = (line2_y2 - line2_y1) / (line2_x2 - line2_x1);
  line1_b = line1_y1 - line1_slope * line1_x1;
  line2_b = line2_y1 - line2_slope * line2_x1;

  //rule out parallel lines, afunction dividing by zero later
  if (line1_slope == line2_slope) {
    return false;
  };

  int_x = (line2_b - line1_b) / (line1_slope - line2_slope);

  //check if intersection is outside of the overlap of the line segments' domains
  if (int_x < max(min(line1_x1, line1_x2), min(line2_x1, line2_x2)) || int_x > min(max(line1_x1, line1_x2), max(line2_x1, line2_x2))) {
    return false;
  }

  return true;
};

function createNewVector(constellation, node) {
  //creates new vector sprouting from end of old vector
  //empty vector is used as check for starting vector of constellation
  var vector = emptyVector;

  //evaluate for minimum angle against all vectors in constellation that contain the new vector's start point
  var counter = 0;
  var intersect = true;
  while (counter < persistence && vector == emptyVector) {
    intersect = false;
    counter += 1;
    var angle = random(0, 2 * PI);
    var magnitude = random(minMagnitude, maxMagnitude);
    vector = [cos(angle) * magnitude, sin(angle) * magnitude];
    vector = checkForAngleConflicts(constellation, node, vector);
    if (vector != emptyVector) {
      //check for intersection with lines in this constellation
      for (var h = 0; h < constellation.constellationLines.length; h++) {
        if (!intersect) {
          var existingLine = constellation.constellationLines[h];
          intersect = intersection(node, vector, existingLine);
        };
      };
      //check for intersection with lines in all other constellations
      for (var i = 0; i < constellations.length; i++) {
        if (constellations[i] != null) {
          for (var j = 0; j < constellations[i].constellationLines.length; j++) {
            if (!intersect) {
              var existingLine = constellations[i].constellationLines[j];
              intersect = intersection(node, vector, existingLine);
            };
          };
        };
      };
    };
    if (intersect) {
      vector = emptyVector;
    };
  };
  return vector;
}

function checkForAngleConflicts(constellation, node, vector) {
  var newUnitVector = findUnitVector(0, 0, vector[0], vector[1]);
  for (var i = 0; i < constellation.constellationLines.length; i++) {
    var existingLine = constellation.constellationLines[i];
    var star1x = existingLine.star1.xpos;
    var star1y = existingLine.star2.ypos;
    var star2x = existingLine.star2.xpos;
    var star2y = existingLine.star2.ypos;
    var existingVector = [];

    if (existingLine.star1 == node) {
      existingVector = findUnitVector(star1x, star1y, star2x, star2y);
    } else if (existingLine.star2 == node) {
      existingVector = findUnitVector(star2x, star2y, star1x, star1y);
    };

    if (existingVector != emptyVector) {
      var proposedAngle = findAngle(newUnitVector, existingVector);
      while (proposedAngle > 2 * PI) {
        proposedAngle -= 2 * PI;
      };
      while (proposedAngle < -2 * PI) {
        proposedAngle += 2 * PI;
      };
      if (proposedAngle < minAngle || proposedAngle > 360 - minAngle) {
        vector = emptyVector;
        break;
      };
    };
  };
  return vector;
};

function findUnitVector(x1, y1, x2, y2) {
  //calculates normal vector between stars (in order), converts to unit vector
  var normalVector = [x2 - x1, y2 - y1];
  var d = sqrt((normalVector[0]) ** 2 + (normalVector[1]) ** 2);
  var unitVector = [normalVector[0] / d, normalVector[1] / d];
  return unitVector;
};

function dotProduct(vector1, vector2){
    return vector1[0] * vector2[0] + vector1[1] * vector2[1]
};

function findAngle(vector1, vector2) {
  //finds angle between two vectors, assuming same starting point
  var angle = acos(dotProduct(vector1, vector2));
  return angle;
};
