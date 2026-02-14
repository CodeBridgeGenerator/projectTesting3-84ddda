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
const service = app.service("dynaLoader").Model;
const patch = {
  from: "dynaLoader updated",
};
let testData = [];
let usersRefDataResults = [];

describe("dynaLoader service", () => {
  let results = [];
  it("registered the service", () => {
    assert.ok(service, "Registered the service (dynaLoader)");
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

  it("create dynaLoader data", async () => {
    const standardUser = await usersService.findOne({
      email: "standard@example.com",
    });

    // create a object array of dynaLoader test schema model
    testData = [
      {
        from: "ServiceA",
        to2: "ServiceB",
        fileUploadedId: standardUser._id,
        isFile: true,
        isKey: "",
        upsert:"",
        toUpdate: [""],
        name: "asdfasd",
        createdBy: standardUser._id,
        updatedBy: standardUser._id,
      },
    ];
    results = await service.create(testData).catch((err) => {
      console.error(err);
      throw err;
    });
    if (!results || results.length === 0)
      assert.fail("dynaLoader creation failed!");
    assert.ok(service, `Created (${results.length} dynaLoader) success!`);
  });

  it("verify dynaLoader creation", async () => {
    for (let i = 0; i < results.length; i++) {
      const exists = await service.findById(results[i]._id);
      assert.ok(exists, `userPhone ${results[i]} exists!`);
    }
  });

  it("patch dynaLoader", async () => {
    for (let i = 0; i < results.length; i++) {
      const patched = await service.findByIdAndUpdate(results[i]._id, patch, {
        new: true,
      });
      assert.ok(patched, `dynaLoader ${patched} patched!`);
      assert.strictEqual(patched.from, patch.from);
    }
  });

  it("remove all dynaLoader test data", async () => {
    for (let i = 0; i < results.length; i++) {
      const removed = await service.findByIdAndDelete(results[i]._id);
      assert.ok(removed, `dynaLoader data ${results[i].number} removed!`);
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
