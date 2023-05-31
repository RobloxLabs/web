MadStatus = {
    // Usage:
    //MadStatus.init('MadStatusField','MadStatusBackBuffer', 2000, [1000]);
    //MadStatus.start();

    running: false,
    init: function (field, backBuffer, updateInterval, fadeInterval) {
        this.timeout = null;
        this.running = true;
        this.field = field;
        this.backBuffer = backBuffer;
        this.updateInterval = updateInterval ? updateInterval : 2000;
        this.fadeInterval = fadeInterval ? fadeInterval : 1000;
        this.field.show();
        this.backBuffer.hide();
    },
    participle: [
					"Accelerating",
					"Aggregating",
					"Allocating",
                    "Aquiring",
					"Automating",
					"Backtracing",
					"Bloxxing",
					"Bootstraping",
					"Calibrating",
					"Correlating",
					"De-noobing",
					"De-ionizing",
					"Deriving",
                    "Energizing",
					"Filtering",
					"Generating",
					"Indexing",
					"Loading",
					"Noobing",
					"Optimizing",
					"Oxidizing",
					"Queueing",
					"Parsing",
					"Processing",
					"Rasterizing",
					"Reading",
					"Registering",
					"Re-routing",
					"Resolving",
					"Sampling",
					"Updating",
					"Writing"
				],
    modifier: [
					"Blox",
					"Count Zero",
					"Cylon",
					"Data",
					"Ectoplasm",
					"Encryption",
					"Event",
					"Farnsworth",
					"Bebop",
					"Flux Capacitor",
					"Fusion",
					"Game",
					"Gibson",
					"Host",
					"Mainframe",
					"Metaverse",
					"Nerf Herder",
					"Neutron",
					"Noob",
					"Photon",
					"Profile",
					"Script",
					"Skynet",
					"TARDIS",
					"Virtual"
				],
    subject: [
					"Analogs",
					"Blocks",
					"Cannon",
					"Channels",
					"Core",
					"Database",
					"Dimensions",
					"Directives",
					"Engine",
					"Files",
					"Gear",
					"Index",
					"Layer",
					"Matrix",
					"Paradox",
					"Parameters",
					"Parsecs",
					"Pipeline",
					"Players",
					"Ports",
					"Protocols",
					"Reactors",
					"Sphere",
					"Spooler",
					"Stream",
					"Switches",
					"Table",
					"Targets",
					"Throttle",
					"Tokens",
					"Torpedoes",
					"Tubes"
			],
    newLib: function () {
        return libString = this.participle[Math.floor(Math.random() * (this.participle.length))] + " " +
					this.modifier[Math.floor(Math.random() * (this.modifier.length))] + " " +
					this.subject[Math.floor(Math.random() * (this.subject.length))] + "...";
    },
    start: function () {
        if (MadStatus.timeout == null)
            MadStatus.timeout = setInterval("MadStatus.update()", MadStatus.updateInterval);
    },
    stop: function (msg) {
        if (MadStatus.running) {
            clearInterval(MadStatus.timeout);
            MadStatus.timeout = null;
            if (typeof (msg) != typeof (undefined))
                MadStatus.field[0].innerHTML = msg;
            else
                MadStatus.field[0].innerHTML = "";
        }
    },
    manualUpdate: function (staticMsg, resumeAfterUpdate, animate) {
        if (MadStatus.timeout)
            MadStatus.stop();

        this.update(staticMsg, animate);

        if (resumeAfterUpdate)
            setTimeout("MadStatus.start()", 1000);
    },
    update: function (staticMsg, animate) {
        if (typeof (staticMsg) != typeof (undefined))
            MadStatus.backBuffer[0].innerHTML = staticMsg;
        else
            MadStatus.backBuffer[0].innerHTML = this.newLib();

        if (typeof (noAnim) != typeof (undefined) && animate == false)
            return;

        this.field.hide();
        this.backBuffer.fadeIn(this.fadeInterval + 2, function () {
            MadStatus.field[0].innerHTML = MadStatus.backBuffer[0].innerHTML
            MadStatus.field.show();
            MadStatus.backBuffer.hide();
        });
    }
}
