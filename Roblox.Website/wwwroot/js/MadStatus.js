MadStatus = {
    // Usage:
    //MadStatus.init($('.MadStatusField'),$('.MadStatusBackBuffer'), 2000, [1000]);
    //MadStatus.start();

    running: false,
    init: function (field, backBuffer, updateInterval, fadeInterval) {
        if (MadStatus.running) {
            MadStatus.stop();
        }
        MadStatus.updateInterval = updateInterval ? updateInterval : 2000;
        MadStatus.fadeInterval = fadeInterval ? fadeInterval : 1000;
        MadStatus.timeout = null;
        MadStatus.running = true;
        MadStatus.field = field;
        MadStatus.backBuffer = backBuffer;

        MadStatus.field.show();
        MadStatus.backBuffer.hide();
    },
    participle: [
					MadStatus.Resources.accelerating,
					MadStatus.Resources.aggregating,
					MadStatus.Resources.allocating,
                    MadStatus.Resources.acquiring,
					MadStatus.Resources.automating,
					MadStatus.Resources.backtracing,
					MadStatus.Resources.bloxxing,
					MadStatus.Resources.bootstrapping,
					MadStatus.Resources.calibrating,
					MadStatus.Resources.correlating,
					MadStatus.Resources.denoobing,
					MadStatus.Resources.deionizing,
					MadStatus.Resources.deriving,
                    MadStatus.Resources.energizing,
					MadStatus.Resources.filtering,
					MadStatus.Resources.generating,
					MadStatus.Resources.indexing,
					MadStatus.Resources.loading,
					MadStatus.Resources.noobing,
					MadStatus.Resources.optimizing,
					MadStatus.Resources.oxidizing,
					MadStatus.Resources.queueing,
					MadStatus.Resources.parsing,
					MadStatus.Resources.processing,
					MadStatus.Resources.rasterizing,
					MadStatus.Resources.reading,
					MadStatus.Resources.registering,
					MadStatus.Resources.rerouting,
					MadStatus.Resources.resolving,
					MadStatus.Resources.sampling,
					MadStatus.Resources.updating,
					MadStatus.Resources.writing
				],
    modifier: [
					MadStatus.Resources.blox,
					MadStatus.Resources.countzero,
					MadStatus.Resources.cylon,
					MadStatus.Resources.data,
					MadStatus.Resources.ectoplasm,
					MadStatus.Resources.encryption,
					MadStatus.Resources.event,
					MadStatus.Resources.farnsworth,
					MadStatus.Resources.bebop,
					MadStatus.Resources.fluxcapacitor,
					MadStatus.Resources.fusion,
					MadStatus.Resources.game,
					MadStatus.Resources.gibson,
					MadStatus.Resources.host,
					MadStatus.Resources.mainframe,
					MadStatus.Resources.metaverse,
					MadStatus.Resources.nerfherder,
					MadStatus.Resources.neutron,
					MadStatus.Resources.noob,
					MadStatus.Resources.photon,
					MadStatus.Resources.profile,
					MadStatus.Resources.script,
					MadStatus.Resources.skynet,
					MadStatus.Resources.tardis,
					MadStatus.Resources.virtual
				],
    subject: [
					MadStatus.Resources.analogs,
					MadStatus.Resources.blocks,
					MadStatus.Resources.cannon,
					MadStatus.Resources.channels,
					MadStatus.Resources.core,
					MadStatus.Resources.database,
					MadStatus.Resources.dimensions,
					MadStatus.Resources.directives,
					MadStatus.Resources.engine,
					MadStatus.Resources.files,
					MadStatus.Resources.gear,
					MadStatus.Resources.index,
					MadStatus.Resources.layer,
					MadStatus.Resources.matrix,
					MadStatus.Resources.paradox,
					MadStatus.Resources.parameters,
					MadStatus.Resources.parsecs,
					MadStatus.Resources.pipeline,
					MadStatus.Resources.players,
					MadStatus.Resources.ports,
					MadStatus.Resources.protocols,
					MadStatus.Resources.reactors,
					MadStatus.Resources.sphere,
					MadStatus.Resources.spooler,
					MadStatus.Resources.stream,
					MadStatus.Resources.switches,
					MadStatus.Resources.table,
					MadStatus.Resources.targets,
					MadStatus.Resources.throttle,
					MadStatus.Resources.tokens,
					MadStatus.Resources.torpedoes,
					MadStatus.Resources.tubes
			],
    newLib: function () {
        return libString = this.participle[Math.floor(Math.random() * (this.participle.length))] + " " +
					this.modifier[Math.floor(Math.random() * (this.modifier.length))] + " " +
					this.subject[Math.floor(Math.random() * (this.subject.length))] + "...";
    },
    start: function () {
        if (MadStatus.timeout == null) {
            MadStatus.timeout = setInterval("MadStatus.update()", MadStatus.updateInterval);
            //console.log("timeout set: " + MadStatus.timeout + ", at " + (new Error()).stack);
            MadStatus.running = true;
        }
    },
    stop: function (msg) {
        //if (MadStatus.running) {
        clearInterval(MadStatus.timeout);
        //console.log("timeout cleared: " + MadStatus.timeout + ", at " + (new Error()).stack);
        MadStatus.timeout = null;
        if (typeof (msg) != typeof (undefined)) {
            MadStatus.field[0].innerHTML = msg;
        }
        else {
            MadStatus.field[0].innerHTML = "";
        }
        MadStatus.running = false;
        //}
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
            MadStatus.field[0].innerHTML = MadStatus.backBuffer[0].innerHTML;
            MadStatus.field.show();
            MadStatus.backBuffer.hide();
        });
    }
};
