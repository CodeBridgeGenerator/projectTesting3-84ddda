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
const service = app.service("branches").Model;
const patch = {
  description: "branches updated",
};
let testData = [];
let usersRefDataResults = [];
let companyResults = [];

describe("branches service", () => {
  let results = [];
  it("registered the service", () => {
    assert.ok(service, "Registered the service (branches)");
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

  it("create branches data", async () => {
    const standardUser = await usersService.findOne({
      email: "standard@example.com",
    });

    // create company test data
    const companyTestData = [
      {
        name: "ABC Company",
        companyNo: "TC123456",
        newCompanyNumber: 123456,
        DateOfIncorporation: new Date("2020-01-01"),
        isdefault: false,
        createdBy: standardUser._id,
        updatedBy: standardUser._id,
      },
    ];

    companyResults = await app
      .service("companies")
      .Model.create(companyTestData)
      .catch(console.error);

    // create a object array of branches test schema model
    testData = [
      {
        companyId: companyResults[0]._id,
        name: "Branch HQ",
        isDefault: false,
        createdBy: standardUser._id,
        updatedBy: standardUser._id,
      },
    ];
    results = await service.create(testData).catch((err) => {
      console.error(err);
      throw err;
    });
    if (!results || results.length === 0)
      assert.fail("branches creation failed!");
    assert.ok(service, `Created (${results.length} branches) success!`);
  });

  it("verify branches creation", async () => {
    for (let i = 0; i < results.length; i++) {
      const exists = await service.findById(results[i]._id);
      assert.ok(exists, `userPhone ${results[i]} exists!`);
    }
  });

  it("patch branches", async () => {
    for (let i = 0; i < results.length; i++) {
      const patched = await service.findByIdAndUpdate(results[i]._id, patch, {
        new: true,
      });
      assert.ok(patched, `branches ${patched} patched!`);
      assert.strictEqual(patched.type, patch.type);
    }
  });

  it("remove all branches test data", async () => {
    for (let i = 0; i < results.length; i++) {
      const removed = await service.findByIdAndDelete(results[i]._id);
      assert.ok(removed, `branches data ${results[i].number} removed!`);
    }
  });

  it("remove all test data", async () => {
    const removed = await Promise.all([
      ...companyResults.map((item) =>
        app.service("companies").Model.findByIdAndDelete(item._id),
      ),
      ...usersRefDataResults.map((item) =>
        usersService.findByIdAndDelete(item._id),
      ),
    ]);
    assert.ok(removed, "User data removed!");
  });
});
