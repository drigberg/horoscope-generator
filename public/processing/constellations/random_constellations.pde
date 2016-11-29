int numConstellations = 200;
float probabilityOfSingleStars = 0.8;
int minStarsInConstellation = 3;
int maxStarsInConstellation = 12;

Constellation[] constellations;

void setup() {
  size(1080, 720);
  background(255, 255, 255);
  constellations = new Constellation[numConstellations];
  for (int i = 0; i < numConstellations; i++){
    constellations[i] = newConstellation(-width, width * 1.5, -height, height * 1.5);
  };
}

void draw() {
  background(230,230,230);
  for (int i = 0; i < constellations.length; i++){
    boolean offscreen = false;
    for (int j = 0; j < constellations[i].constellationStars.length; j++){
        constellations[i].constellationStars[j].update();
        if (constellations[i].constellationStars[j].xpos > width && constellations[i].constellationStars[j].ypos > height){
            offscreen = true;
        };
        if (offscreen) {
            constellations[i] = newConstellation(-width * 4, 0, -height, height/2);
            break;
        };
    };
    for (int j = 0; j < constellations[i].constellationLines.length; j++){
        constellations[i].constellationLines[j].update();
    };   
  };
};

class Star { 
  float xpos, ypos, size, red, green, blue; 
  float speed = 4;
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

class Constellation {
  Star[] constellationStars; 
  Line[] constellationLines;
  Constellation (int numStars, float xmin, float xmax, float ymin, float ymax){
    constellationStars = new Star[numStars];
    float r = random(0, 255);
    float g = random(0, 255 - r);
    float b = random(0, 255 - g);
    for (int k = 0; k < numStars; k++){
      constellationStars[k] = new Star(random(xmin, xmax), random(ymin, ymax), random(5), r, g, b);
    };
    
    constellationLines = new Line[numStars - 1];
    for (int k = 1; k < numStars; k++){
      constellationLines[k-1] = new Line(constellationStars[k-1], constellationStars[k], r, g, b);
    };
  };
};

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
    float angle = 0;
    return angle;
};

Constellation newConstellation(float minx, float maxx, float miny, float maxy){
    float xmin = random(minx, maxx);
    float ymin = random(miny, maxy);
    float xmax = random(xmin, maxx);
    float ymax = random(ymin, maxy);
    int numStars = int(random(minStarsInConstellation, maxStarsInConstellation));
    float singleStar = random(0, 1);
    if (singleStar < probabilityOfSingleStars){
        numStars = 1;
    };
    return new Constellation(numStars, xmin, xmax, ymin, ymax);
}
  