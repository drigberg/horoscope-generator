int numConstellations = 100;
float probabilityOfSingleStars = 0.8;
int minStarsInConstellation = 3;
int maxStarsInConstellation = 12;

Constellation[] constellations;

void setup() {
  size(1080, 720);
  background(255, 255, 255);
  constellations = new Constellation[numConstellations];
  for (int i = 0; i < numConstellations; i++){
    float xmin = random(0, width);
    float ymin = random(0, height);
    float xmax = random(xmin, width);
    float ymax = random(ymin, height);
    int numStars = int(random(minStarsInConstellation, maxStarsInConstellation));
    float singleStar = random(0, 1);
    if (singleStar < probabilityOfSingleStars){
        numStars = 1;
    }
    constellations[i] = new Constellation(numStars, xmin, xmax, ymin, ymax);
  };
}

void draw() {
  background(230,230,230);
  for (int i = 0; i < constellations.length; i++){
    for (int j = 0; j < constellations[i].these_stars.length; j++){
        constellations[i].these_stars[j].update();
    };
  };
};

class Star { 
  float xpos, ypos, size, red, green, blue; 
  float speed = 0.05;
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
    if (ypos > height) { 
      ypos = 0; 
    };
    if (xpos > width) { 
      xpos = 0; 
    };
    ellipse(xpos, ypos, size, size);
  };
};

class Lines {
  
}

class Constellation {
  Star[] these_stars;
  Constellation (int numStars, float xmin, float xmax, float ymin, float ymax){
    these_stars = new Star[numStars];
    float r = random(0, 255);
    float g = random(0, 255 - r);
    float b = random(0, 255 - g);
    for (int k = 0; k < numStars; k++){
      these_stars[k] = new Star(random(xmin, xmax), random(ymin, ymax), random(5), r, g, b);
    };
  };
};