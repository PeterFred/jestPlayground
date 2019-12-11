const lib = require("../lib");
const fizz = require("../exercise1");
const db = require("../db");
const mail = require("../mail");

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

//Test strings with regex OR toContain to keep them general
describe("greet", () => {
  it("should return the greeeting message", () => {
    const result = lib.greet("Peter");
    expect(result).toMatch(/Peter/);
    expect(result).toContain("Peter");
  });
});

//Testing arrays
describe("getCurrencies", () => {
  it("Should return supported currencies", () => {
    const result = lib.getCurrencies();
    expect(result).toEqual(expect.arrayContaining(["EUR", "USD", "AUD"]));
  });
});

//Testing objects
//.toBe checks identical objects - use toMatchObject OR toHaveProperty
describe("getProduct", () => {
  it("should return product with the given id", () => {
    const result = lib.getProduct(1);
    //expect(result).toEqual({ id: 1, price: 10 }); //Exact props and values
    expect(result).toMatchObject({ id: 1, price: 10 }); //Match slice of props and values
    expect(result).toHaveProperty("id", 1); //Must match props type
  });
});
//Testing Exceptions - need to test all falsy conditions
//Exceptions MUST be used in a a callback
describe("registerUser", () => {
  it("should throw if username is falsy", () => {
    const args = [null, undefined, NaN, "", 0, false];
    args.forEach(a => {
      expect(() => {
        lib.registerUser(a);
      }).toThrow();
    });
  });

  //The timestamp on id cannot be checked concurrently, so just check its in the future
  it("should return a user object if a valid username is passed", () => {
    const result = lib.registerUser("Peter");
    expect(result).toMatchObject({ username: "Peter" });
    expect(result.id).toBeGreaterThan(0);
  });
});

//Check module functions
describe("FizzBuzz", () => {
  //Exceptions MUST be used in a a callback -nb NaN is of number type
  it("should throw an exception if input is not a number", () => {
    expect(() => fizz.fizzBuzz("a")).toThrow();
    expect(() => fizz.fizzBuzz(null)).toThrow();
    expect(() => fizz.fizzBuzz(undefined)).toThrow();
    expect(() => fizz.fizzBuzz({})).toThrow();
  });
  it("should return FizzBuzz", () => {
    const result = fizz.fizzBuzz(15);
    expect(result).toBe("FizzBuzz");
  });
  it("should return Fizz", () => {
    const result = fizz.fizzBuzz(6);
    expect(result).toBe("Fizz");
  });
  it("should return Buzz", () => {
    const result = fizz.fizzBuzz(10);
    expect(result).toBe("Buzz");
  });
});

//Check mock functions
//Set-up mock function (getCustomerSync) to replace db function to simulate db call
describe("applyDiscount", () => {
  it("should apply 10% discount if a customer has more than 10 points", () => {
    db.getCustomerSync = function(customerId) {
      console.log("Mock reading customer...");
      return { id: customerId, points: 20 };
    };

    const order = { customeId: 1, totalPrice: 10 };
    lib.applyDiscount(order);
    expect(order.totalPrice).toBe(9);
  });
});

//Check mock functions - utilising Jest mock functions
describe("notifyCustomer", () => {
  it("should send an email to a customer", () => {
    db.getCustomerSync = jest.fn().mockReturnValue({ email: "a" });
    mail.send = jest.fn(); //fn = function

    lib.notifyCustomer({ customerId: 1 });

    expect(mail.send).toHaveBeenCalled();
    //To check arguments passed to functions:
    expect(mail.send.mock.calls[0][0]).toBe("a");
    expect(mail.send.mock.calls[0][1]).toMatch(/order/);

    //Resolving promises with jest.fn()
    // const mockFunction = jest.fn();
    // mockFunction.mockResolveValue(1);
    // mockFunction.mockRejectValue(new Error('...'));
    // const result = await mockFunction();
  });
});
