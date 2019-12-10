const lib = require("../lib");

//Check matchers at https://jestjs.io/docs/en/using-matchers

test("absolute - should return a pos num if input is pos", () => {
  const result = lib.absolute(1);
  expect(result).toBe(1);
});
