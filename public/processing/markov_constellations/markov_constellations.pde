//global defaults
int numConstellations = 300;
float probabilityOfSingleStars = 0.8;
int minStarsInConstellation = 3;
int maxStarsInConstellation = 12;
float minStarSize = 0.1;
float maxStarSize = 5;
float speed = 0.05;
float minMagnitude = 5;
float maxMagnitude = 100;
float minAngle = PI / 6;

//vector helpers
PVector zeroDegreeUnitVector = new PVector(1,0);
PVector emptyVector = new PVector(0,0);


//Generate constellation as arraylist
//Generate first Star: random in space
//Work from node recursively


Constellation[] constellations;

void setup() {
  //generate constellations
  size(1080, 720);
  background(#4da6ff);
  constellations = new Constellation[numConstellations];
  for (int i = 0; i < numConstellations; i++){
    constellations[i] = new Constellation(-width, width, -height, height);
  };
}

void draw() {
  //move all constellations
  background(#4da6ff);
  for (int i = 0; i < constellations.length; i++){
    boolean offscreen = true;
    for (int j = 0; j < constellations[i].constellationStars.size(); j++){
        constellations[i].constellationStars.get(j).update();
        //check if entire constellation is offscreen
        if (constellations[i].constellationStars.get(j).xpos < width && constellations[i].constellationStars.get(j).ypos < height){
            offscreen = false;
        };
    };
    //if offscreen, replace with new constellation to the left of and slightly above the screen
    if (offscreen) {
      constellations[i] = new Constellation(-width, 0, -height/4, height * 3 / 4);
     };
    for (int j = 0; j < constellations[i].constellationLines.size(); j++){
        constellations[i].constellationLines.get(j).update();
    };   
  };
};


class Constellation {
  //collection of stars and lines which connect them, or single star
  ArrayList<Star> constellationStars = new ArrayList<Star>();
  ArrayList<Line> constellationLines = new ArrayList<Line>();
  FloatDict constellationChain = new FloatDict();  
  Constellation (float minx, float maxx, float miny, float maxy){
    //float r = random(0, 255);
    //float g = random(0, 255 - r);
    //float b = random(0, 255 - g);
    float r = 255;
    float g = 255;
    float b = 255;
    float startX = random(minx, maxx);
    float startY = random(miny, maxy);
    constellationChain.set("0", 0);
    constellationChain.set("1", 0.4);
    constellationChain.set("2", 0.3);
    constellationChain.set("3", 0.3);
    constellationStars.add(new Star(startX, startY, random(minStarSize, maxStarSize), r, g, b));
    float singleStar = random(0, 1);
    if (singleStar > probabilityOfSingleStars){
        workFromNode(this, constellationStars.get(0), emptyVector);
    };  
  };
};

void workFromNode(Constellation constellation, Star node, PVector startVector){
  //recursively evaluates whether to grow from node, how many new vectors to draw, and where to place them
  float nextMoveProb = random(0,1);
  String nextMove = "";
  for (int i = 0; i < constellation.constellationChain.keyArray().length; i++){
    if (nextMoveProb <= constellation.constellationChain.get(constellation.constellationChain.keyArray()[i])){
       nextMove = constellation.constellationChain.keyArray()[i];
       break;
    } else {
      nextMoveProb -= constellation.constellationChain.get(constellation.constellationChain.keyArray()[i]);
    }
  }
  int newNodes = int(nextMove);
  for (int j = 0; j < newNodes; n++){
    //make new node or connect to old node; lower probability of connecting to old node if selected
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

PVector newVector(PVector startVector){
  //creates new vector sprouting from end of old vector
  //empty vector is used as check for starting vector of constellation
  
  float angle;
  float magnitude = random(minMagnitude, maxMagnitude);
  PVector vector = new PVector();
  if (startVector == emptyVector){
    angle = random(0, 2 * PI);
    vector = new PVector(cos(angle) * magnitude, sin(angle) * magnitude);
  } else {
    //if sprouting from old vector, generate new random angle outside of minimum cone
    //flip old vector in order to evaluate against end point, not start point
    angle = random(minAngle / 2, 2 * PI - minAngle / 2);
    float startAngle = findAngle(zeroDegreeUnitVector, startVector) - PI;
    angle += startAngle;
    vector = new PVector(cos(angle) * magnitude, sin(angle) * magnitude);
  };

  return vector;
}
  
PVector findUnitVector(Star star1, Star star2){
    //calculates normal vector between stars (in order), converts to unit vector
    PVector normalVector = new PVector(star2.xpos - star2.xpos, star2.ypos - star1.ypos);
    float d = sqrt(sq(normalVector.x) + sq(normalVector.y));
    PVector unitVector = new PVector(normalVector.x/d, normalVector.y/d);
    return unitVector;
};

float findAngle(PVector vector1, PVector vector2){
  //finds angle between two vectors
  float angle = acos(vector1.dot(vector2)) * 180 / PI;
  return angle;
};

class Line {
  //line between two stars
  Star[] lineStars;
  float red, green, blue;
  Line (Star star1, Star star2, float r, float g, float b){
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