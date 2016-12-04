//----------global defaults
//---display
/* @pjs transparent="true"; */
/* @pjs crisp="true"; pauseOnBlur="true"; */
int backgroundColor = #011433;
float speed = 1;
int numConstellations = 100;


//---constellation parameters
//minimum constellation size is subject to conflicts with trapped constellations by angle or overlap
int minimumConstellationSize = 5;
int maximumConstellationSize = 10;
float minStarSize = 1;
float maxStarSize = 5;
float minMagnitude = 20;
float maxMagnitude = 100;
float minAngle = PI/10;
int maxClosedLoopsPerConstellation = 2;
int frameCounter = 0;

//probabilities
float probabilityOfSingleStars = 0.6;
float zeroNodeProbAfterMinSizeReached = 0.5;
float initialZeroNodeProb = 0;
float initialOneNodeProb = 0.3;
float initialTwoNodeProb = 0.5;
float initialThreeNodeProb = 0.2;
float probabilityOfClosedLoops = 1;

//persistence = number of attempts at randomly creating a vector that has no intersect or angle conflicts
int persistence = 5;

//vector helper
PVector emptyVector = new PVector(0, 0);

//------TO DO-------
//MERGE AFTER SENTENCE EXPANSION (to get rid of matching commits) :P :P :P
//Reference constellation colors; too many arguments being passed on
//Figure out bug with closed loop density


Constellation[] constellations;

//=========================
//Main functions
//=========================
void setup() {
  //generate constellations
  size(1300, 800, P2D);
  //background(backgroundColor);
  constellations = new Constellation[numConstellations];
  for (int i = 0; i < numConstellations; i++) {
    constellations[i] = new Constellation(-width, width, -height / 4, height);
  };
}

void draw() {
  //move all constellations
  frameCounter += 1;
  if (frameCounter % 1 == 0){
    background(0, 75);
    for (int i = 0; i < constellations.length; i++) {
      boolean offscreen = true;
      for (int j = 0; j < constellations[i].constellationStars.size(); j++) {
        noStroke();
        fill(constellations[i].r, constellations[i].g, constellations[i].b);
        constellations[i].constellationStars.get(j).update();
        //check if entire constellation is offscreen
        if (constellations[i].constellationStars.get(j).xpos < width && constellations[i].constellationStars.get(j).ypos < height) {
          offscreen = false;
        };
      };
      //if offscreen, replace with new constellation to the left of and slightly above the screen
      if (offscreen) {
        constellations[i] = new Constellation(-width * 1.5, -width * 0.5, -height/4, height * 3 / 4);
      };
      for (int j = 0; j < constellations[i].constellationLines.size(); j++) {
        stroke(constellations[i].r, constellations[i].g, constellations[i].b);
        constellations[i].constellationLines.get(j).update();
      };
    };
  }

};


//=========================
//Classes
//=========================
class Constellation {
  //collection of stars and lines which connect them, or single star
  ArrayList<Star> constellationStars = new ArrayList<Star>();
  ArrayList<Line> constellationLines = new ArrayList<Line>();
  float zeroNodeProb;
  float oneNodeProb;
  float twoNodeProb;
  float threeNodeProb;
  int closedLoops = 0;
  float r;
  float g;
  float b;
  Constellation (float minx, float maxx, float miny, float maxy) {
    //r = random(0, 255);
    //g = random(0, 255 - r);
    //b = random(0, 255 - g);
    r = 255;
    g = 255;
    b = 255;
    float startX = random(minx, maxx);
    float startY = random(miny, maxy);
    zeroNodeProb = initialZeroNodeProb;
    oneNodeProb = initialOneNodeProb;
    twoNodeProb = initialTwoNodeProb;
    threeNodeProb = initialThreeNodeProb;
    constellationStars.add(new Star(startX, startY, random(minStarSize, maxStarSize)));
    float singleStar = random(0, 1);
    if (singleStar > probabilityOfSingleStars) {
      workFromNode(this, constellationStars.get(0));
    };
  };
};

class Star {
  //set of coordinates, radius, and color
  float xpos, ypos, size;
  Star (float x, float y, float s) {
    xpos = x;
    ypos = y;
    size = s;
  };
  void update() {
    xpos += speed;
    ypos += speed / 4;
    ellipse(xpos, ypos, size, size);
  };
};

class Line {
  //line between two stars
  Star[] lineStars;
  float red, green, blue;
  Line (Star star1, Star star2) {
    lineStars = new Star[2];
    lineStars[0] = star1;
    lineStars[1] = star2;
  };
  void update() {
    line(lineStars[0].xpos, lineStars[0].ypos, lineStars[1].xpos, lineStars[1].ypos);
  };
};

//=========================
//Functions
//=========================

void workFromNode(Constellation constellation, Star node) {
  //recursively evaluates whether to grow from node, how many new vectors to draw, and where to place them
  int newNodes = 0;
  if (constellation.constellationStars.size() >= minimumConstellationSize && constellation.zeroNodeProb == 0) {
    constellation.zeroNodeProb = zeroNodeProbAfterMinSizeReached;
    constellation.oneNodeProb -= zeroNodeProbAfterMinSizeReached / 3;
    constellation.twoNodeProb -= zeroNodeProbAfterMinSizeReached / 3;
    constellation.threeNodeProb -= zeroNodeProbAfterMinSizeReached / 3;
  };

  float nextMoveProb = random(0, 1);
  //construct array out of node probabilities because processing.js can't handle dictionaries
  float[] newNodeProbabilities = new float[4];
  newNodeProbabilities[0] = constellation.zeroNodeProb;
  newNodeProbabilities[1] = constellation.oneNodeProb;
  newNodeProbabilities[2] = constellation.twoNodeProb;
  newNodeProbabilities[3] = constellation.threeNodeProb;
  
  for (int i = 0; i < 4; i++) {
    if (nextMoveProb <= newNodeProbabilities[i]) {
      newNodes = i;
      break;
    } else {
      nextMoveProb -= newNodeProbabilities[i];
    }
  }

  for (int j = 0; j < newNodes; j++) {
    boolean closedLoop = false;
    if (constellation.constellationStars.size() < maximumConstellationSize) {
      //create closed loop if chance dictates and if possible
      closedLoop = createClosedLoop(closedLoop, constellation, node);

      //make new node if closed loop was not created already
      //only make new vector if newVector function was able to find a nonconflicting option within 10 tries (arbitrary value)
      if (!closedLoop) {
        PVector newVector = createNewVector(constellation, node);
        if (newVector != emptyVector) {
          float x = newVector.x + node.xpos;
          float y = newVector.y + node.ypos;
          Star newStar = new Star(x, y, random(minStarSize, maxStarSize));
          constellation.constellationStars.add(newStar);
          constellation.constellationLines.add(new Line(node, newStar));
          workFromNode(constellation, newStar);
        };
        //allow for old node to fail and reset if not possible without a collision
        //make new node and/or path, evaluate new node if applicable
      };
    };
  };
};

boolean createClosedLoop(Boolean complete, Constellation constellation, Star node){
  //connect to old node if chance dictates and if possible, but do not retrace an existing line
  if (constellation.constellationStars.size() >= 3 && constellation.closedLoops < maxClosedLoopsPerConstellation && random(0, 1) < probabilityOfClosedLoops) {
        for (int k = 0; k < constellation.constellationStars.size(); k++) {
          if (node == constellation.constellationStars.get(k)){
            continue;
          };
          boolean connected = false;
          for (int m = 0; m < constellation.constellationLines.size(); m++) {
            boolean oldStarInLine = (constellation.constellationLines.get(m).lineStars[0] == constellation.constellationStars.get(k) || constellation.constellationLines.get(m).lineStars[1] == constellation.constellationStars.get(k));
            boolean nodeInLine = (constellation.constellationLines.get(m).lineStars[0] == node && constellation.constellationLines.get(m).lineStars[1] == node);
            if (oldStarInLine && nodeInLine) {
              connected = true;
              break;
            };
          };

          if (!connected) {
            PVector vector = new PVector(constellation.constellationStars.get(k).xpos - node.xpos, constellation.constellationStars.get(k).ypos - node.ypos);
            //vector = checkForAngleConflicts(constellation, node, vector);
            //check for intersection with lines in this constellation
            boolean intersect = false;
            for (int h = 0; h < constellation.constellationLines.size(); h++) {
              if (!intersect) {
                Line existingLine = constellation.constellationLines.get(h);
                intersect = intersection(node, vector, existingLine);
              };
            };
            //check for intersection with lines in all other constellations
            for (int i = 0; i < constellations.length; i++) {
              if (constellations[i] != null) {
                for (int l = 0; l < constellations[i].constellationLines.size(); l++) {
                  if (!intersect) {
                    Line existingLine = constellations[i].constellationLines.get(l);
                    intersect = intersection(node, vector, existingLine);
                  };
                };
              };
            };   
            if (!intersect) {
              constellation.closedLoops += 1;
              constellation.constellationLines.add(new Line(node, constellation.constellationStars.get(k)));
              workFromNode(constellation, constellation.constellationStars.get(k));
              complete = true;
            };
          };
        };
      };
    return complete;
};

boolean intersection(Star star1, PVector vector1, Line existingLine) {
  //find point of intersection of lines; return true if overlap
  float line1_slope, line2_slope, line1_b, line2_b, int_x, line1_x1, line1_x2, line1_y1, line1_y2, line2_x1, line2_x2, line2_y1, line2_y2;
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

  //rule out parallel lines, avoid dividing by zero later
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

PVector createNewVector(Constellation constellation, Star node) {
  //creates new vector sprouting from end of old vector
  //empty vector is used as check for starting vector of constellation
  PVector vector = new PVector();
  vector = emptyVector;

  //evaluate for minimum angle against all vectors in constellation that contain the new vector's start point
  int counter = 0;
  boolean intersect = true;
  while (counter < persistence && vector == emptyVector) {
    intersect = false;
    counter += 1;
    float angle = random(0, 2 * PI);
    float magnitude = random(minMagnitude, maxMagnitude);
    vector = new PVector(cos(angle) * magnitude, sin(angle) * magnitude);
    vector = checkForAngleConflicts(constellation, node, vector);
    if (vector != emptyVector) {
      //check for intersection with lines in this constellation
      for (int h = 0; h < constellation.constellationLines.size(); h++) {
        if (!intersect) {
          Line existingLine = constellation.constellationLines.get(h);
          intersect = intersection(node, vector, existingLine);
        };
      };

      //check for intersection with lines in all other constellations
      for (int i = 0; i < constellations.length; i++) {
        if (constellations[i] != null) {
          for (int j = 0; j < constellations[i].constellationLines.size(); j++) {
            if (!intersect) {
              Line existingLine = constellations[i].constellationLines.get(j);
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

PVector checkForAngleConflicts(Constellation constellation, Star node, PVector vector) {
  PVector newUnitVector = findUnitVector(0, 0, vector.x, vector.y);
  for (int i = 0; i < constellation.constellationLines.size(); i++) {
    Line existingLine = constellation.constellationLines.get(i);
    float star1x = existingLine.lineStars[0].xpos;
    float star1y = existingLine.lineStars[0].ypos;
    float star2x = existingLine.lineStars[1].xpos;
    float star2y = existingLine.lineStars[1].ypos;
    PVector existingVector = emptyVector;

    if (existingLine.lineStars[0] == node) {
      existingVector = findUnitVector(star1x, star1y, star2x, star2y);
    } else if (existingLine.lineStars[1] == node) {
      existingVector = findUnitVector(star2x, star2y, star1x, star1y);
    };

    if (existingVector != emptyVector) {
      float proposedAngle = findAngle(newUnitVector, existingVector);
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

PVector findUnitVector(float x1, float y1, float x2, float y2) {
  //calculates normal vector between stars (in order), converts to unit vector
  PVector normalVector = new PVector(x2 - x1, y2 - y1);
  float d = sqrt(sq(normalVector.x) + sq(normalVector.y));
  PVector unitVector = new PVector(normalVector.x/d, normalVector.y/d);
  return unitVector;
};

float findAngle(PVector vector1, PVector vector2) {
  //finds angle between two vectors, assuming same starting point
  float angle = acos(vector1.dot(vector2));
  return angle;
};