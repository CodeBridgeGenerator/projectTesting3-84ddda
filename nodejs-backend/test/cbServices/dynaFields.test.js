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
const service = app.service("dynaFields").Model;
const patch = {
  to2: "employees updated",
};
let testData = [];
let usersRefDataResults = [];
let dynaLoaderResults = [];

describe("dynaFields service", () => {
  let results = [];
  it("registered the service", () => {
    assert.ok(service, "Registered the service (dynaFields)");
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

  it("create dynaFields data", async () => {
    const standardUser = await usersService.findOne({
      email: "standard@example.com",
    });

    // create dynaLoader test data
    const dynaLoaderTestData = [
      {
        from: "ServiceA",
        to2: "ServiceB",
        fileUploadedId: standardUser._id,
        isFile: true,
        isKey: "",
        upsert:"",
        toUpdate: [""],
        name: "dfsdf",
        createdBy: standardUser._id,
        updatedBy: standardUser._id,
      },
    ];
    dynaLoaderResults = await app
      .service("dynaLoader")
      .Model.create(dynaLoaderTestData)
      .catch((err) => {
        console.error(err);
        throw err;
      });

    // create a object array of dynaFields test schema model
    testData = [
      {
        dynaLoader: dynaLoaderResults[0]._id,
        from: "staffinfo",
        fromType: { data: "Apple" },
        to2: "employees",
        toType: "Orange",
        fromService: "employees",
        toService: "company",
        toRefService: "companies",
        identifierFieldName: "name",
        duplicates: false,
        createdBy: standardUser._id,
        updatedBy: standardUser._id,
      },
    ];
    results = await service.create(testData).catch((err) => {
      console.error(err);
      throw err;
    });
    if (!results || results.length === 0)
      assert.fail("dynaFields creation failed!");
    assert.ok(service, `Created (${results.length} dynaFields) success!`);
  });

  it("verify dynaFields creation", async () => {
    for (let i = 0; i < results.length; i++) {
      const exists = await service.findById(results[i]._id);
      assert.ok(exists, `userPhone ${results[i]} exists!`);
    }
  });

  it("patch dynaFields", async () => {
    for (let i = 0; i < results.length; i++) {
      const patched = await service.findByIdAndUpdate(results[i]._id, patch, {
        new: true,
      });
      assert.ok(patched, `dynaFields ${patched} patched!`);
      assert.strictEqual(patched.to2, patch.to2);
    }
  });

  it("remove all dynaFields test data", async () => {
    for (let i = 0; i < results.length; i++) {
      const removed = await service.findByIdAndDelete(results[i]._id);
      assert.ok(removed, `dynaFields data ${results[i].number} removed!`);
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
