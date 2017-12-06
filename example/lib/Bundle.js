"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Bundle = class Bundle {
    constructor() {}

    getPath() {
        return __dirname;
    }

    initialize(app) {
        app.on("start", this.onStart);
        console.log("Bundle initialized");
    }

    async onStart(app) {
        var parameters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        console.log("started");

        var container = app.getParameter("serviceContainer");
        console.log("Service container:", container);

        var selfService = await container.get("container");
        console.log("Service container from service container:", selfService);
    }
};
exports.default = Bundle;