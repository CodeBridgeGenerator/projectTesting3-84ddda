const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "password",
  },
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
  {
    name: "Supervirsor User",
    email: "supervisor@example.com",
    password: "password",
  },
];

const usersService = app.service("users").Model;
const service = app.service("superiors").Model;

let testData = [];
let usersRefDataResults = [];
let patch = null;

describe("superiors service", () => {
  let results = [];
  it("registered the service", () => {
    assert.ok(service, "Registered the service (superiors)");
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
    patch = {
      subordinate: usersRefDataResults[1]._id,
    };
  });

  it("create superiors data", async () => {
    const standardUser = await usersService.findOne({
      email: "standard@example.com",
    });

    // create a object array of superiors test schema model
    testData = [
      {
        superior: usersRefDataResults[2]._id,
        subordinate: usersRefDataResults[0]._id,
        createdBy: standardUser._id,
        updatedBy: standardUser._id,
      },
    ];
    results = await service.create(testData).catch((err) => {
      console.error(err);
      throw err;
    });
    if (!results || results.length === 0)
      assert.fail("superiors creation failed!");
    assert.ok(service, `Created (${results.length} superiors) success!`);
  });

  it("verify superiors creation", async () => {
    for (let i = 0; i < results.length; i++) {
      const exists = await service.findById(results[i]._id);
      assert.ok(exists, `userPhone ${results[i]} exists!`);
    }
  });

  it("patch superiors", async () => {
    for (let i = 0; i < results.length; i++) {
      const patched = await service.findByIdAndUpdate(results[i]._id, patch, {
        new: true,
      });
      assert.ok(patched, `superiors ${patched} patched!`);
      assert.strictEqual(patched.type, patch.type);
    }
  });

  it("remove all superiors test data", async () => {
    for (let i = 0; i < results.length; i++) {
      const removed = await service.findByIdAndDelete(results[i]._id);
      assert.ok(removed, `superiors data ${results[i].number} removed!`);
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
