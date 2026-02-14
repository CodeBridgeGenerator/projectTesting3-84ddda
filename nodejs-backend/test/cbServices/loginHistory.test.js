const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

const usersService = app.service("users").Model;
const service = app.service("loginHistory").Model;
const patch = {
  loginTime: new Date("2026-01-19"),
};
let testData = [];
let usersRefDataResults = [];

describe("loginHistory service", () => {
  let results = [];
  it("registered the service", () => {
    assert.ok(service, "Registered the service (loginHistory)");
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

  it("create loginHistory data", async () => {
    const standardUser = await usersService.findOne({
      email: "standard@example.com",
    });

    // create a object array of loginHistory test schema model
    testData = [
      {
        userId: standardUser._id,
        loginTime: Date.now(),
        createdBy: standardUser._id,
        updatedBy: standardUser._id,
      }
    ];
    results = await service.create(testData).catch((err) => {
      console.error(err);
      throw err;
    });
    if (!results || results.length === 0)
      assert.fail("loginHistory creation failed!");
    assert.ok(service, `Created (${results.length} loginHistory) success!`);
  });

  it("verify loginHistory creation", async () => {
    for (let i = 0; i < results.length; i++) {
      const exists = await service.findById(results[i]._id);
      assert.ok(exists, `userPhone ${results[i]} exists!`);
    }
  });

  it("patch loginHistory", async () => {
    for (let i = 0; i < results.length; i++) {
      const patched = await service.findByIdAndUpdate(results[i]._id, patch, {
        new: true,
      } );
      assert.ok(patched, `loginHistory ${patched} patched!`);
      assert.strictEqual(patched.type, patch.type);
    }
  });

  it("remove all loginHistory test data", async () => {
    for (let i = 0; i < results.length; i++) {
      const removed = await service.findByIdAndDelete(results[i]._id);
      assert.ok(removed, `loginHistory data ${results[i].number} removed!`);
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
