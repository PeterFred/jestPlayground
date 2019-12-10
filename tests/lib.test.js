const lib = require("../lib");
//Check matchers at https://jestjs.io/docs/en/using-matchers

//Group related tests inside a describe block
describe("absolute", () => {
  it("should return a pos num if input is pos", () => {
    const result = lib.absolute(1);
    expect(result).toBe(1);
  });

  it("should return a pos num if input is neg", () => {
    const result = lib.absolute(-1);
    expect(result).toBe(1);
  });

  it("should return 0 if input is 0", () => {
    const result = lib.absolute(0);
    expect(result).toBe(0);
  });
});
