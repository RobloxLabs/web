"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getDataset = function () {
    var _a;
    var metaTag = document.querySelector('meta[name="environment-meta"]');
    return (_a = metaTag === null || metaTag === void 0 ? void 0 : metaTag.dataset) !== null && _a !== void 0 ? _a : null;
};
var isTestSite = function () {
    var _a;
    return ((_a = getDataset()) === null || _a === void 0 ? void 0 : _a.isTestingSite) === 'true';
};
exports.default = {
    isTestSite: isTestSite()
};
//# sourceMappingURL=environmentSites.js.map