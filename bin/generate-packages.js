"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
const common_1 = require("./lib/common");
const package_generator_1 = require("./lib/package-generator");
const packages_1 = require("./lib/packages");
const versions_1 = require("./lib/versions");
const logging_1 = require("./util/logging");
const tgz_1 = require("./util/tgz");
const util_1 = require("./util/util");
if (!module.parent) {
    const all = yargs.argv.all;
    const singleName = yargs.argv.single;
    const tgz = !!yargs.argv.tgz;
    if (all && singleName) {
        throw new Error("Select only one of -single=foo or --all.");
    }
    util_1.done((singleName ? single(singleName, common_1.Options.defaults) : main(common_1.Options.defaults, all, tgz)));
}
function main(options, all = false, tgz = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const [log, logResult] = logging_1.logger();
        log(`\n## Generating ${all ? "all" : "changed"} packages\n`);
        const allPackages = yield packages_1.AllPackages.read(options);
        const versions = yield versions_1.default.load();
        const packages = all ? allPackages.allPackages() : yield versions_1.changedPackages(allPackages);
        yield util_1.nAtATime(10, packages, (pkg) => __awaiter(this, void 0, void 0, function* () {
            const logs = yield package_generator_1.default(pkg, allPackages, versions, options);
            if (tgz) {
                yield tgz_1.writeTgz(pkg.outputDirectory, pkg.outputDirectory + ".tgz");
            }
            log(` * ${pkg.libraryName}`);
            logging_1.moveLogs(log, logs, line => `   * ${line}`);
        }));
        yield logging_1.writeLog("package-generator.md", logResult());
    });
}
exports.default = main;
function single(singleName, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const allPackages = yield packages_1.AllPackages.read(options);
        const pkg = allPackages.getSingle(singleName);
        const versions = yield versions_1.default.load();
        const logs = yield package_generator_1.default(pkg, allPackages, versions, options);
        console.log(logs.join("\n"));
    });
}
//# sourceMappingURL=generate-packages.js.map