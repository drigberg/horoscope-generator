int numConstellations = 300;
float probabilityOfSingleStars = 0.8;
int minStarsInConstellation = 3;
int maxStarsInConstellation = 12;
float minStarSize = 0.1;
float maxStarSize = 5;
float speed = 0.05;
float minMagnitude = 5;
float maxMagnitude = 100;
float[] verticalUnitVector = {1,0};



//Generate constellation as arraylist
//Generate first Star: random in space
//Work from node recursively


Constellation[] constellations;

void setup() {
  size(1080, 720);
  background(255, 255, 255);
  constellations = new Constellation[numConstellations];
  for (int i = 0; i < numConstellations; i++){
    constellations[i] = new Constellation(-width, width, -height, height);
  };
}

void draw() {
  background(230,230,230);
  for (int i = 0; i < constellations.length; i++){
    boolean offscreen = false;
    for (int j = 0; j < constellations[i].constellationStars.size(); j++){
        constellations[i].constellationStars.get(j).update();
        if (constellations[i].constellationStars.get(j).xpos > width && constellations[i].constellationStars.get(j).ypos > height){
            offscreen = true;
        };
        if (offscreen) {
            constellations[i] = new Constellation(-width, 0, -height/4, height * 3 / 4);
            break;
        };
    };
    for (int j = 0; j < constellations[i].constellationLines.size(); j++){
        constellations[i].constellationLines.get(j).update();
    };   
  };
};


class Constellation {
  ArrayList<Star> constellationStars = new ArrayList<Star>();
  ArrayList<Line> constellationLines = new ArrayList<Line>();
  Constellation (float minx, float maxx, float miny, float maxy){
    float r = random(0, 255);
    float g = random(0, 255 - r);
    float b = random(0, 255 - g);
    float startX = random(minx, maxx);
    float startY = random(miny, maxy);
    float singleStar = random(0, 1);
    if (singleStar < probabilityOfSingleStars){
        //numStars = 1;
    };
    constellationStars.add(new Star(startX, startY, random(minStarSize, maxStarSize), r, g, b));
    workFromNode(constellationStars.get(0));
  };
};

class Star { 
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

void workFromNode(Star node){
  
};

float[] newVector(float[] oldVector){
  float[] vector = new float[2];
  //angle = random(findAngle
  vector[0] = 1;
  vector[1] = 1;
  return vector;
}
  
float[] findUnitVector(Star star1, Star star2){
    //calculate normal vector
    float[] normalVector = new float[2];
    normalVector[0] = star2.xpos - star2.xpos;
    normalVector[1] = star2.ypos - star1.ypos;  
    //calculate unit vector
    float d = sqrt(sq(normalVector[0]) + sq(normalVector[1]));
    float[] unitVector = new float[2];
    unitVector[0] = normalVector[0]/d;
    unitVector[1] = normalVector[1]/d;
    return unitVector;
};

float findAngle(float[] vector1, float[] vector2){
    float angle = acos(vector1[0] * vector2[0] + vector1[1] * vector2[1]) * 180 / PI;
    return angle;
};

class Line {
  Star[] lineStars;
  float red, green, blue;
  Line (Star star1, Star star2, float r, float g, float b){
    lineStars = new Star[2];
    lineStars[0] = star1;
    lineStars[1] = star2;
    red = r;
    green = g;
    blue = b;
  }
  void update() {
      stroke(red, green, blue);
      line(lineStars[0].xpos, lineStars[0].ypos, lineStars[1].xpos, lineStars[1].ypos);
  }
}