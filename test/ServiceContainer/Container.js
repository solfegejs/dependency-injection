import chai from "chai"
import Container from "../../src/ServiceContainer/Container"

const expect = chai.expect;
const should = chai.should;


describe("Container", () => {
    describe("#setConfiguration()", () => {
        it("should successfully set a Solfege configuration instance", function *() {
            let container = new Container;
            let config = {};

            container.setConfiguration(config);

            expect(container.getConfiguration()).to.equal(config);
        });
    });

});
