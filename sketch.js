  let system;

  window.setup = function() {
    createCanvas(windowWidth, windowHeight);
    system = new ParticleSystem(createVector(width / 2, 50));
  }

  window.draw = function() {
    background(0);
    system.addParticle();
    system.run();
  }

  let Particle = function() {
    this.position = createVector(width/2, height/2);
    this.velocity = createVector(random(-1, 1), random(-1, 1));
    this.velocity.normalize();
    this.velocity.mult(random(2, 4));
    this.size = random(1, 4);
    this.lifespan = 500;
    this.alpha = 0;
    this.alphaIncrease = false;
  };

  Particle.prototype.run = function() {
    this.update();
    this.display();
  };

  Particle.prototype.update = function() {
    this.position.add(this.velocity);
    this.lifespan -= 2;
    this.velocity.mult(1.05);

    // Постепенно увеличиваем прозрачность после того, как частица движется достаточно далеко от центра
    if (this.alphaIncrease) {
      this.alpha += 5;
    } else if (dist(width/2, height/2, this.position.x, this.position.y) > 50) {
      this.alphaIncrease = true;
    }
  };

  Particle.prototype.display = function() {
    let distance = dist(width / 2, height / 2, this.position.x, this.position.y);
    let alpha = map(distance, 0, width / 2, 0, this.lifespan);
    stroke(200, alpha);
    strokeWeight(2);
    fill(255, alpha);
    ellipse(this.position.x, this.position.y, this.size, this.size);
  };


  Particle.prototype.isDead = function() {
    return this.lifespan < 0 || this.position.x < 0 || this.position.x > width || this.position.y < 0 || this.position.y > height;
  };

  let ParticleSystem = function(position) {
    this.origin = position.copy();
    this.particles = [];
  };

  ParticleSystem.prototype.addParticle = function() {
    this.particles.push(new Particle(createVector(random(width), height)));
  };

  ParticleSystem.prototype.run = function() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];
      p.run();
      if (p.isDead()) {
        this.particles.splice(i, 1);
      }
    }
  };
