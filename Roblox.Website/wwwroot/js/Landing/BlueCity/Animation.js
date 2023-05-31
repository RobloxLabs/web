; // /js/Landing/Animation.js
var Animator = function() {
    if (!(this instanceof Animator)) return new Animator;
	var n = this;
    this.init = function(t, i, r, u, f, e) {
        n.properties = t;
		n.onUpdate = i;
		n.frames = r;
		n.fps = u;
		n.finiteLoops = f;
		n.loops = e;
		n.currentFrame = 0;
		n.currentLoop = 0;
		return n;
    };
	this.restart = function() {
        n.currentFrame = 0;
		n.currentLoop = 0;
		n.start();
    };
	this.start = function() {
		n.intervalId = setInterval(n.animate, 1e3 / n.fps);
    };
	this.stop = function() {
        clearInterval(n.intervalId);
    };
	this.animate = function() {
        n.onUpdate(n.currentFrame, n.properties);
        n.currentFrame++;
		if (n.currentFrame >= n.frames && n.finiteLoops) {
			n.currentLoop++;
			n.currentFrame = 0;
		}else if (n.currentFrame % n.frames == 0) {
			n.currentLoop++;
			n.currentFrame = 0;
		}
		if (n.currentLoop >= n.loops && n.finiteLoops) {
			n.stop();
		}
    }
};