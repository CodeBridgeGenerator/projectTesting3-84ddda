const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Super User",
    email: "super@example.com",
    password: "password",
  },
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

const usersService = app.service("users").Model;
const service = app.service("userAddresses").Model;
let testData = [];
let usersRefDataResults = [];
const patch = {
  Street1: "123, Main Street Updated",
};

describe("userAddresses service", () => {
  let results = [];
  it("registered the service", () => {
    assert.ok(service, "Registered the service (userAddresses)");
  });

  it("create multi ref users", async () => {
    usersRefDataResults = await usersService
      .create(usersRefData)
      .catch((err) => {
        console.error(err);
        throw err;
      });
    if (usersRefDataResults.length === 0) assert.fail("User creation failed!");
    assert.ok(
      usersService,
      `Created (${usersRefDataResults.length} users) success!`,
    );
  });

  it("create userAddresses data", async () => {
    const superUser = await usersService.findOne({
      email: "super@example.com",
    });
    const standardUser = await usersService.findOne({
      email: "standard@example.com",
    });

    testData = [
      {
        userId: standardUser._id,
        Street1: "123, Main Street",
        Street2: "Apt 4B",
        City: "Metropolis",
        State: "NY",
        Poscode: "10001",
        Province: "New York",
        Country: "USA",
        createdBy: superUser._id,
        updatedBy: superUser._id,
      }
    ];
    results = await service.create(testData).catch((err) => {
      console.error(err);
      throw err;
    });
    if (!results || results.length === 0)
      assert.fail("userAddresses creation failed!");
    assert.ok(service, `Created (${results.length} userAddresses) success!`);
  });

  it("verify userAddresses creation", async () => {
    for (let i = 0; i < results.length; i++) {
      const exists = await service.findById(results[i]._id);
      assert.ok(exists, `userPhone ${results[i]} exists!`);
    }
  });

  it("patch userAddresses", async () => {
    for (let i = 0; i < results.length; i++) {
      const patched = await service.findByIdAndUpdate(results[i]._id, patch, {
        new: true,
      } );
      assert.ok(patched, `userAddresses ${patched} patched!`);
      assert.strictEqual(patched.Street1, patch.Street1);
    }
  });

  it("remove all userAddresses test data", async () => {
    for (let i = 0; i < results.length; i++) {
      const removed = await service.findByIdAndDelete(results[i]._id);
      assert.ok(removed, `userAddresses data ${results[i].number} removed!`);
    }
  });

  it("remove all user test data", async () => {
    for (let i = 0; i < usersRefDataResults.length; i++) {
      const removed = await usersService.findByIdAndDelete(
        usersRefDataResults[i]._id,
      );
      assert.ok(removed, `User data ${usersRefDataResults[i].name} removed!`);
    }
  });
});
