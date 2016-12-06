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
var maxMagnitudeSlider, minAngleSlider, maxConstellationSizeSlider;
var sliders_div;

//------TO DO-------
//MERGE AFTER SENTENCE EXPANSION (to get rid of matching commits) :P :P :P
//Reference constellation colors; too many arguments being passed on
//Figure out bug with closed loop density

var constellations;

//=========================
//Main functions
//=========================
function setup() {
  //interface elements are created first so that canvas covers entire page
  createInterface();
  makeCanvas();

  //generate constellations
  setInitialValues();
  setSliderDependentVariables();
  resetDisplay();
}

function makeCanvas(){
    var canvas = createCanvas(($(window).width()), $(window).height() + 50);
    canvas.parent('canvas-background');
    backgroundColor = "#011433";
};

function setInitialValues(){
  constellations = new Array(numConstellations);
  speed = 0.5;
  minimumConstellationSize = 4;
  minStarSize = 1;
  maxStarSize = 5;
  minMagnitude = 15;
  maxClosedLoopsPerConstellation = 1;
  zeroNodeProbAfterMinSizeReached = 0.3
  initialZeroNodeProb = 0;
  initialOneNodeProb = 0.3;
  initialTwoNodeProb = 0.5;
  initialThreeNodeProb = 0.2;
  probabilityOfClosedLoops = 0.3;
  persistence = 50;
  //vector helper
  emptyVector = [0,0];
};

function setSliderDependentVariables(){
  numConstellations = numberOfConstellationsSlider.value();
  maximumConstellationSize = maxConstellationSizeSlider.value();
  maxMagnitude = maxMagnitudeSlider.value();
  minAngle = minAngleSlider.value();
  probabilityOfSingleStars = probSingleStarSlider.value();
}

function createInterface(){
  sliders_div = createDiv("");
  sliders_div.id("sliders-div");
  sliders_div_ul = createElement("ul").id("sliders-div-list").parent("sliders-div").style("list-style", "none");
  sliders_div_list = [];
  for (var i = 0; i < 5; i++){
    var id = "sliders-div-list-" + i;
    sliders_div_list.push(createElement('li').id(id));
    sliders_div_list[i].parent("sliders-div-list");
    switch (i){
      case 0:
          numberOfConstellationsText = createElement("h5", "Number of Constellations: ").class("slider-text").parent(id)
          numberOfConstellationsSlider = createSlider(5, 300, 150, 5).id("slider").parent(id);
          break;
      case 1:
          probSingleStarText = createElement("h5", "Ratio of Stars to Constellations: ").class("slider-text").parent(id)
          probSingleStarSlider = createSlider(0, 1, 0.85, 0.01).id("slider").parent(id);
          break;
      case 2:
          maxConstellationSizeText = createElement("h5", "Max No. Stars Per Constellation: ").class("slider-text").parent(id)
          maxConstellationSizeSlider = createSlider(5, 100, 8).id("slider").parent(id);
          break;
      case 3:
          maxMagnitudeText = createElement("h5", "Maximum Line Magnitude: ").class("slider-text").parent(id)
          maxMagnitudeSlider = createSlider(60, 150, 100).id("slider").parent(id);
          break;
      case 4:
          mindAngleText = createElement("h5", "Minimum Angle Size: ").class("slider-text").parent(id)
          minAngleSlider = createSlider(0, 0.97 * PI, PI/3, 0.01).id("slider").parent(id);
          break;
    }
  };

  resetButton = createButton('Generate New Constellations').class("btn btn-warning btn-md small-link").parent('sliders-div');
  resetButton.mousePressed(resetDisplay);
};

function resetDisplay(){
  numConstellations = numberOfConstellationsSlider.value();
  constellations = new Array(numConstellations);
  for (var i = 0; i < numConstellations; i++) {
    constellations[i] = new Constellation(-width, width, -height / 4, height);
  };
};

function draw() {
  setSliderDependentVariables();

  //move all constellations
  background(backgroundColor);
  for (var i = 0; i < constellations.length; i++) {
    var offscreen = true;
    for (var j = 0; j < constellations[i].stars.length; j++) {
      noStroke();
      fill(constellations[i].r, constellations[i].g, constellations[i].b);
      constellations[i].stars[j].update();
      //check if entire constellation is offscreen
      if (constellations[i].stars[j].x < width && constellations[i].stars[j].y < height) {
        offscreen = false;
      };
    };
    //if offscreen, replace with new constellation to the left of and slightly above the screen
    if (offscreen) {
      constellations[i] = new Constellation(-width * 1.5, -width * 0.5, -height/4, height * 3 / 4);
    };
    for (var j = 0; j < constellations[i].lines.length; j++) {
      stroke(constellations[i].r, constellations[i].g, constellations[i].b);
      constellations[i].lines[j].update();
    };
  };
};


//=========================
//Classes
//=========================
var Constellation = function(minx, maxx, miny, maxy){
  //collection of stars and lines which connect them, or single star
  var that = this;
  this.stars = [];
  this.lines = [];
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
      that.stars.push(new Star(that.startX, that.startY, random(minStarSize, maxStarSize)));
      that.singleStar = random(0, 1);
      if (that.singleStar > probabilityOfSingleStars) {
          workFromNode(that, that.stars[0]);
      };
  };
  this.init();
};

var Star = function(x, y, s){
  //set of coordinates, radius, and color
  var that = this;
  this.x = x;
  this.y = y;
  this.size = s;
  this.update = function(){
    that.x += speed;
    that.y += speed / 4;
    ellipse(this.x, this.y, that.size, that.size);
  };
};

var Line = function (star1, star2){
  //line between two stars
  this.star1 = star1;
  this.star2 = star2;
  this.update = function() {
    line(this.star1.x, this.star1.y, this.star2.x, this.star2.y);
  };
};

//=========================
//Functions
//=========================

function workFromNode(constellation, node) {
  //recursively evaluates whether to grow from node, how many new vectors to draw, and where to place them
  var newNodes = 0;
  if (constellation.stars.length >= minimumConstellationSize && constellation.nodeProbabilities[0] == 0) {
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
    if (constellation.stars.length < maximumConstellationSize) {
      //create closed loop if chance dictates and if possible
      closedLoop = createClosedLoop(closedLoop, constellation, node);

      //make new node if closed loop was not created already
      //only make new vector if newVector function was able to find a nonconflicting option within 10 tries (arbitrary value)
      if (!closedLoop) {
        var newVector = createNewVector(constellation, node);
        if (newVector != emptyVector) {
          var x = newVector[0] + node.x;
          var y = newVector[1] + node.y;
          var newStar = new Star(x, y, random(minStarSize, maxStarSize));
          var newLine = new Line(node, newStar);
          constellation.stars.push(newStar);
          constellation.lines.push(newLine);
          workFromNode(constellation, newStar);
        };
      };
    };
  };
};

function createClosedLoop(complete, constellation, node){
  //connect to old node if chance dictates and if possible, but do not retrace an existing line
  if (constellation.stars.length >= 3 && constellation.closedLoops < maxClosedLoopsPerConstellation && random(0, 1) < probabilityOfClosedLoops) {
        for (var k = 0; k < constellation.stars.length; k++) {
          if (node == constellation.stars[k]){
            continue;
          };
          var connected = false;
          for (var m = 0; m < constellation.lines.length; m++) {
            var oldStarInLine = constellation.lines[m].star1 == constellation.stars[k] || constellation.lines[m].star2 == constellation.stars[k];
            var nodeInLine = constellation.lines[m].star1 == node && constellation.lines[m].star2 == node;
            if (oldStarInLine && nodeInLine) {
              connected = true;
              break;
            };
          };

          if (!connected) {
            var vector = [constellation.stars[k].x - node.x, constellation.stars[k].y - node.y];
            //vector = checkForAngleConflicts(constellation, node, vector);
            //check for intersection with lines in this constellation
            var intersect = false;
            for (var h = 0; h < constellation.lines.length; h++) {
              if (!intersect) {
                var existingLine = constellation.lines[h];
                intersect = intersection(node, vector, existingLine);
              };
            };
            //check for intersection with lines in all other constellations
            for (var i = 0; i < constellations.length; i++) {
              if (constellations[i] != null) {
                for (var l = 0; l < constellations[i].lines.length; l++) {
                  if (!intersect) {
                    var existingLine = constellations[i].lines[l];
                    intersect = intersection(node, vector, existingLine);
                  };
                };
              };
            };
            if (!intersect) {
              constellation.closedLoops += 1;
              var newLine = new Line(node, constellation.stars[k]);
              constellation.lines.push(newLine);
              workFromNode(constellation, constellation.stars[k]);
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
  line1_x1 = star1.x;
  line1_x2 = star1.x + vector1[0];
  line1_y1 = star1.y;
  line1_y2 = star1.y + vector1[1];
  line2_x1 = existingLine.star1.x;
  line2_x2 = existingLine.star2.x;
  line2_y1 = existingLine.star1.y;
  line2_y2 = existingLine.star2.y;

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
      for (var h = 0; h < constellation.lines.length; h++) {
        if (!intersect) {
          var existingLine = constellation.lines[h];
          intersect = intersection(node, vector, existingLine);
        };
      };
      //check for intersection with lines in all other constellations
      for (var i = 0; i < constellations.length; i++) {
        if (constellations[i] != null) {
          for (var j = 0; j < constellations[i].lines.length; j++) {
            if (!intersect) {
              var existingLine = constellations[i].lines[j];
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
  for (var i = 0; i < constellation.lines.length; i++) {
    var existingLine = constellation.lines[i];
    var star1x = existingLine.star1.x;
    var star1y = existingLine.star2.y;
    var star2x = existingLine.star2.x;
    var star2y = existingLine.star2.y;
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
