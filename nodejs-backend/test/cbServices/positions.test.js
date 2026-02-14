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
const service = app.service("positions").Model;
const patch = {
  description: "Position updated",
};
let rolesResults = [];
let testData = [];
let usersRefDataResults = [];

describe("positions service", () => {
  let results = [];
  it("registered the service", () => {
    assert.ok(service, "Registered the service (positions)");
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

  it("create positions data", async () => {
    const standardUser = await usersService.findOne({
      email: "standard@example.com",
    });

    const roleTestData = [
      {
        name: "Admin",
        description: "Administrator role with full permissions",
        isDefault: true,
        createdBy: standardUser._id,
        updatedBy: standardUser._id,
      },
    ];

    rolesResults = await app
      .service("roles")
      .Model.create(roleTestData)
      .catch((err) => {
        console.error(err);
        throw err;
      });


    // create a object array of positions test schema model

    testData = {
      roleId: rolesResults[0]._id,
      name: "Developer",
      description: "Some dscription",
      abbr: "CMD",
      isDefault: false,
    };

    results = await service.create(testData).catch((err) => {
      console.error(err);
      throw err;
    });
    if (!results || results.length === 0)
      assert.fail("positions creation failed!");
    assert.ok(service, `Created (${results.length} positions) success!`);
  });

  it("verify positions creation", async () => {
    for (let i = 0; i < results.length; i++) {
      const exists = await service.findById(results[i]._id);
      assert.ok(exists, `userPhone ${results[i]} exists!`);
    }
  });

  it("patch positions", async () => {
    for (let i = 0; i < results.length; i++) {
      const patched = await service.findByIdAndUpdate(results[i]._id, patch, {
        new: true,
      });
      assert.ok(patched, `positions ${patched} patched!`);
      assert.strictEqual(patched.type, patch.type);
    }
  });

  it("remove all positions test data", async () => {
    for (let i = 0; i < results.length; i++) {
      const removed = await service.findByIdAndDelete(results[i]._id);
      assert.ok(removed, `positions data ${results[i].number} removed!`);
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
