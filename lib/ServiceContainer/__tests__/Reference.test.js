const Reference = require("../Reference");

describe("Reference", () => {
  it("should store identifier", () => {
    const reference = new Reference("id");

    expect(reference.getId()).toEqual("id");
  });

  it("should throw an error with invalid argument", () => {
    expect(() => {
      new Reference(42);
    }).toThrow();
  });
});
