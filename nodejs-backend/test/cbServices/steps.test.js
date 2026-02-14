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
const service = app.service("steps").Model;
const patch = {
  Description: "Second step Description",
};
let testData = [];
let usersRefDataResults = [];

describe("steps service", () => {
  let results = [];
  it("registered the service", () => {
    assert.ok(service, "Registered the service (steps)");
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

  it("create steps data", async () => {
    const standardUser = await usersService.findOne({
      email: "standard@example.com",
    });

    const testUserGuideData = [
      {
        serviceName: "Initial Table Name",
        expiry: new Date("2025-12-31"),
        createdBy: standardUser._id,
        updatedBy: standardUser._id,
      },
    ];

    const userGuideServiceData = await app
      .service("userGuide")
      .Model.create(testUserGuideData)
      .catch((err) => {
        console.error(err);
        throw err;
      });

    // create a object array of steps test schema model
    testData = [
      {
        userGuideID: userGuideServiceData[0]._id,
        Steps: "First Step",
        Description: "First step description",
        createdBy: standardUser._id,
        updatedBy: standardUser._id,
      },
    ];
    results = await service.create(testData).catch((err) => {
      console.error(err);
      throw err;
    });
    if (!results || results.length === 0) assert.fail("steps creation failed!");
    assert.ok(service, `Created (${results.length} steps) success!`);
  });

  it("verify steps creation", async () => {
    for (let i = 0; i < results.length; i++) {
      const exists = await service.findById(results[i]._id);
      assert.ok(exists, `userPhone ${results[i]} exists!`);
    }
  });

  it("patch steps", async () => {
    for (let i = 0; i < results.length; i++) {
      const patched = await service.findByIdAndUpdate(results[i]._id, patch, {
        new: true,
      });
      assert.ok(patched, `steps ${patched} patched!`);
      assert.strictEqual(patched.type, patch.type);
    }
  });

  it("remove all steps test data", async () => {
    for (let i = 0; i < results.length; i++) {
      const removed = await service.findByIdAndDelete(results[i]._id);
      assert.ok(removed, `steps data ${results[i].number} removed!`);
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
