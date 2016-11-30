//global defaults
int numConstellations = 100;
float probabilityOfSingleStars = 0.2;
int minStarsInConstellation = 3;
int maxStarsInConstellation = 12;
float minStarSize = 3;
float maxStarSize = 8;
float speed = 0.7;
float minMagnitude = 5;
float maxMagnitude = 100;
float minAngle = PI/4;

//vector helpers
PVector zeroDegreeUnitVector = new PVector(1, 0);
PVector emptyVector = new PVector(0, 0);

//Generate constellation as arraylist
//Generate first Star: random in space
//Work from node recursively
//Reference constellation colors; too many arguments being passed on


Constellation[] constellations;

void setup() {
  //generate constellations
  size(1080, 720);
  background(#1a4791);
  constellations = new Constellation[numConstellations];
  for (int i = 0; i < numConstellations; i++) {
    constellations[i] = new Constellation(-width, width, -height, height);
  };
}

void draw() {
  //move all constellations
  background(#1a4791);
  for (int i = 0; i < constellations.length; i++) {
    boolean offscreen = true;
    for (int j = 0; j < constellations[i].constellationStars.size(); j++) {
      constellations[i].constellationStars.get(j).update();
      //check if entire constellation is offscreen
      if (constellations[i].constellationStars.get(j).xpos < width && constellations[i].constellationStars.get(j).ypos < height) {
        offscreen = false;
      };
    };
    //if offscreen, replace with new constellation to the left of and slightly above the screen
    if (offscreen) {
      constellations[i] = new Constellation(-width, 0, -height/4, height * 3 / 4);
    };
    for (int j = 0; j < constellations[i].constellationLines.size(); j++) {
      constellations[i].constellationLines.get(j).update();
    };
  };
};


class Constellation {
  //collection of stars and lines which connect them, or single star
  ArrayList<Star> constellationStars = new ArrayList<Star>();
  ArrayList<Line> constellationLines = new ArrayList<Line>();
  FloatDict constellationChain = new FloatDict();
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
    constellationChain.set("0", 0.5);
    constellationChain.set("1", 0.35);
    constellationChain.set("2", 0.1);
    constellationChain.set("3", 0.05);
    constellationStars.add(new Star(startX, startY, random(minStarSize, maxStarSize), r, g, b));
    float singleStar = random(0, 1);
    if (singleStar > probabilityOfSingleStars) {
      workFromNode(this, constellationStars.get(0));
    };
  };
};

void workFromNode(Constellation constellation, Star node) {
  //recursively evaluates whether to grow from node, how many new vectors to draw, and where to place them
  float nextMoveProb = random(0, 1);
  String nextMove = "";
  for (int i = 0; i < constellation.constellationChain.keyArray().length; i++) {
    if (nextMoveProb <= constellation.constellationChain.get(constellation.constellationChain.keyArray()[i])) {
      nextMove = constellation.constellationChain.keyArray()[i];
      break;
    } else {
      nextMoveProb -= constellation.constellationChain.get(constellation.constellationChain.keyArray()[i]);
    }
  }
  int newNodes = int(nextMove);
  for (int j = 0; j < newNodes; j++) {
    //make new node or connect to old node; lower probability of connecting to old node if selected
    //only make new vector if newVector function was able to find a nonconflicting option within 10 tries (arbitrary value)
    PVector newVector = newVector(constellation, node);
    if (newVector != emptyVector){
      float x = newVector.x + node.xpos;
      float y = newVector.y + node.ypos;
      Star newStar = new Star(x, y, random(minStarSize, maxStarSize), constellation.r, constellation.g, constellation.b);
      constellation.constellationStars.add(newStar);
      constellation.constellationLines.add(new Line(node, newStar, constellation.r, constellation.g, constellation.b));
      workFromNode(constellation, newStar);
    };
    //allow for old node to fail and reset if not possible without a collision
    //make new node and/or path, evaluate new node if applicable
  }
};

class Star {
  //set of coordinates, radius, and color
  float xpos, ypos, size, red, green, blue;
  Star (float x, float y, float s, float r, float g, float b) {
    xpos = x;
    ypos = y;
    size = s;
    red = r;
    green = g;
    blue = b;
  };
  void update() {
    noStroke();
    fill(red, green, blue);
    xpos += speed;
    ypos += speed / 4;
    ellipse(xpos, ypos, size, size);
  };
};

boolean intersect(PVector vector1, PVector vector2){

  return true;
}

PVector newVector(Constellation constellation, Star node) {
  //creates new vector sprouting from end of old vector
  //empty vector is used as check for starting vector of constellation

  float angle;
  float magnitude = random(minMagnitude, maxMagnitude);
  PVector vector = new PVector();
  boolean angleConflicts = true;
  //if sprouting from old vector, generate new random angle outside of minimum cone
  //flip old vector in order to evaluate against end point, not start point
  //evaluate against all other vectors in constellation that contain the start point
  int counter = 0;
  while (counter < 10 && angleConflicts == true){
    counter += 1;
    angleConflicts = false;
    angle = random(0, 2 * PI);
    vector = new PVector(cos(angle) * magnitude, sin(angle) * magnitude);
    PVector newUnitVector = findUnitVector(0, 0, vector.x, vector.y);
    for (int i = 0; i < constellation.constellationLines.size(); i++){
      Line existingLine = constellation.constellationLines.get(i);
      float star1x = existingLine.lineStars[0].xpos;
      float star1y = existingLine.lineStars[0].ypos;
      float star2x = existingLine.lineStars[1].xpos;
      float star2y = existingLine.lineStars[1].ypos;
      float proposedAngle = 9999;
      PVector existingVector = emptyVector;
      if (existingLine.lineStars[0] == node){
        existingVector = findUnitVector(star1x, star1y, star2x, star2y);
      } else if (existingLine.lineStars[1] == node){
        existingVector = findUnitVector(star2x, star2y, star1x, star1y);
      };
      if (existingVector != emptyVector){
        proposedAngle = findAngle(newUnitVector, existingVector);
        while (proposedAngle > 2 * PI){
          proposedAngle -= 2 * PI;
        };
        while (proposedAngle < -2 * PI){
          proposedAngle += 2 * PI;
        };
        if (proposedAngle != 9999 && proposedAngle < minAngle || proposedAngle > 360 - minAngle){
          angleConflicts = true;
          break;
        };
      };
    };
  };
  if (!angleConflicts) {
    return vector;
  }
  return emptyVector;
}

PVector findUnitVector(float x1, float y1, float x2, float y2) {
  //calculates normal vector between stars (in order), converts to unit vector
  PVector normalVector = new PVector(x2 - x1, y2 - y1);
  float d = sqrt(sq(normalVector.x) + sq(normalVector.y));
  PVector unitVector = new PVector(normalVector.x/d, normalVector.y/d);
  return unitVector;
};

float findAngle(PVector vector1, PVector vector2) {
  //finds angle between two vectors
  float angle = acos(vector1.dot(vector2));
  return angle;
};

class Line {
  //line between two stars
  Star[] lineStars;
  float red, green, blue;
  Line (Star star1, Star star2, float r, float g, float b) {
    lineStars = new Star[2];
    lineStars[0] = star1;
    lineStars[1] = star2;
    red = r;
    green = g;
    blue = b;
  };
  void update() {
    stroke(red, green, blue);
    line(lineStars[0].xpos, lineStars[0].ypos, lineStars[1].xpos, lineStars[1].ypos);
  };
};