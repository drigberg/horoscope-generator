//----------global defaults
//---display
var backgroundColor;
var speed;
var numConstellations;

//---constellation parameters
//minimum constellation size is subject to conflicts with trapped constellations by angle or overlap
var minimumConstellationSize;
var maximumConstellationSize;
var minStarSize;
var maxStarSize;
var minMagnitude;
var maxMagnitude;
var minAngle;
var maxClosedLoopsPerConstellation;
var frameCounter;

//probabilities
var probabilityOfSingleStars;
var zeroNodeProbAfterMinSizeReached;
var initialZeroNodeProb;
var initialOneNodeProb;
var initialTwoNodeProb;
var initialThreeNodeProb;
var probabilityOfClosedLoops;

//persistence = number of attempts at randomly creating a vector that has no intersect or angle conflicts
var persistence;

//vector helper
var emptyVector;

//------TO DO-------
//MERGE AFTER SENTENCE EXPANSION (to get rid of matching commits) :P :P :P
//Reference constellation colors; too many arguments being passed on
//Figure out bug with closed loop density


var constellations;

//=========================
//Main functions
//=========================
function setup() {
  //generate constellations
  createCanvas(1300, 800);
  //background(backgroundColor);
  constellations = new Array(numConstellations);
  for (var i = 0; i < numConstellations; i++) {
    constellations[i] = new Constellation(-width, width, -height / 4, height);
  };

  backgroundColor = "#011433";
  speed = 1;
  numConstellations = 100;
  minimumConstellationSize = 5;
  maximumConstellationSize = 10;
  minStarSize = 1;
  maxStarSize = 5;
  minMagnitude = 20;
  maxMagnitude = 100;
  minAngle = PI/10;
  maxClosedLoopsPerConstellation = 2;
  frameCounter = 0;
  probabilityOfSingleStars = 0.6;
  zeroNodeProbAfterMinSizeReached = 0.5;
  initialZeroNodeProb = 0;
  initialOneNodeProb = 0.3;
  initialTwoNodeProb = 0.5;
  initialThreeNodeProb = 0.2;
  probabilityOfClosedLoops = 1;
  persistence = 5;

  //vector helper
  var emptyVector = [0,0];
}

function draw() {
  //move all constellations
  frameCounter += 1;
  if (frameCounter % 1 == 0){
    background(0, 75);
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
      for (var j = 0; j < constellations[i].constellationLines.size(); j++) {
        stroke(constellations[i].r, constellations[i].g, constellations[i].b);
        constellations[i].constellationLines[j].update();
      };
    };
  }

};


//=========================
//Classes
//=========================
var Constellation = function(minx, maxx, miny, maxy){
  //collection of stars and lines which connect them, or single star
  this.constellationStars = [];
  this.constellationLines = [];
  this.closedLoops = 0;
  this.r = 255;
  this.g = 0;
  this.b = 0;
  this.startX = random(minx, maxx);
  this.startY = random(miny, maxy);
  this.nodeProbabilities = {
    0 : initialZeroNodeProb,
    1 : initialOneNodeProb,
    2 : initialTwoNodeProb,
    3 : initialThreeNodeProb
  };
  constellationStars.append(new Star(startX, startY, random(minStarSize, maxStarSize)));
  this.singleStar = random(0, 1);
  if (this.singleStar > probabilityOfSingleStars) {
      workFromNode(this, constellationStars.get(0));
  };
};

var Star = function(x, y, x){
  //set of coordinates, radius, and color
  var that = this;
  this.xpos = x;
  this.ypos = y;
  this.size = s;
  this.update = function(){
    that.xpos += speed;
    that.ypos += speed / 4;
    ellipse(this.xpos, this.ypos, this.size, this.size);
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
    if (constellation.constellationStars.size() < maximumConstellationSize) {
      //create closed loop if chance dictates and if possible
      closedLoop = createClosedLoop(closedLoop, constellation, node);

      //make new node if closed loop was not created already
      //only make new vector if newVector function was able to find a nonconflicting option within 10 tries (arbitrary value)
      if (!closedLoop) {
        var newVector = createNewVector(constellation, node);
        if (newVector != emptyVector) {
          var x = newVector.x + node.xpos;
          var y = newVector.y + node.ypos;
          var newStar = new Star(x, y, random(minStarSize, maxStarSize));
          var newLine = new Line(node, newStar);
          constellation.constellationStars.append(newStar);
          constellation.constellationLines.append(newLine);
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
            var vector = new PVector(constellation.constellationStars.get(k).xpos - node.xpos, constellation.constellationStars.get(k).ypos - node.ypos);
            //vector = checkForAngleConflicts(constellation, node, vector);
            //check for intersection with lines in this constellation
            var intersect = false;
            for (var h = 0; h < constellation.constellationLines.size(); h++) {
              if (!intersect) {
                var existingLine = constellation.constellationLines[h];
                intersect = intersection(node, vector, existingLine);
              };
            };
            //check for intersection with lines in all other constellations
            for (var i = 0; i < constellations.length; i++) {
              if (constellations[i] != null) {
                for (var l = 0; l < constellations[i].constellationLines.size(); l++) {
                  if (!intersect) {
                    var existingLine = constellations[i].constellationLines[l];
                    intersect = intersection(node, vector, existingLine);
                  };
                };
              };
            };
            if (!intersect) {
              constellation.closedLoops += 1;
              constellation.constellationLines.append(new Line(node, constellation.constellationStars[k]));
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
  line1_x2 = star1.xpos + vector1.x;
  line1_y1 = star1.ypos;
  line1_y2 = star1.ypos + vector1.y;
  line2_x1 = existingLine.lineStars[0].xpos;
  line2_x2 = existingLine.lineStars[1].xpos;
  line2_y1 = existingLine.lineStars[0].ypos;
  line2_y2 = existingLine.lineStars[1].ypos;

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
  var newUnitVector = findUnitVector(0, 0, vector.x, vector.y);
  for (var i = 0; i < constellation.constellationLines.length; i++) {
    var existingLine = constellation.constellationLines[i];
    var star1x = existingLine.lineStars[0].xpos;
    var star1y = existingLine.lineStars[0].ypos;
    var star2x = existingLine.lineStars[1].xpos;
    var star2y = existingLine.lineStars[1].ypos;
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
  var normalVector = new [x2 - x1, y2 - y1];
  var d = sqrt((normalVector.x) ** 2 + (normalVector.y) ** 2);
  var unitVector = [normalVector.x / d, normalVector.y / d];
  return unitVector;
};

function findAngle(vector1, vector2) {
  //finds angle between two vectors, assuming same starting point
  var angle = acos(vector1.dot(vector2));
  return angle;
};
