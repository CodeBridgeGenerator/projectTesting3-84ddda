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
const service = app.service("departments").Model;
const patch = {
  code: "c0de updated",
};
let testData = [];
let usersRefDataResults = [];
let companyResults = [];

describe("departments service", () => {
  let results = [];
  it("registered the service", () => {
    assert.ok(service, "Registered the service (departments)");
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

  it("create departments data", async () => {
    const standardUser = await usersService.findOne({
      email: "standard@example.com",
    });

    // create company test data
    const companyTestData = [
      {
        name: "Test Company",
        companyNo: "TC123456",
        newCompanyNumber: 123456,
        DateOfIncorporation: new Date("2020-01-01"),
        isdefault: true,
        createdBy: standardUser._id,
        updatedBy: standardUser._id,
      },
    ];
    companyResults = await app
      .service("companies")
      .Model.create(companyTestData)
      .catch(console.error);

    // create a object array of departments test schema model
    testData = [
      {
        companyId: companyResults[0]._id,
        name: "Department A",
        code: "DPRTA",
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
      assert.fail("departments creation failed!");
    assert.ok(service, `Created (${results.length} departments) success!`);
  });

  it("verify departments creation", async () => {
    for (let i = 0; i < results.length; i++) {
      const exists = await service.findById(results[i]._id);
      assert.ok(exists, `userPhone ${results[i]} exists!`);
    }
  });

  it("patch departments", async () => {
    for (let i = 0; i < results.length; i++) {
      const patched = await service.findByIdAndUpdate(results[i]._id, patch, {
        new: true,
      });
      assert.ok(patched, `departments ${patched} patched!`);
      assert.strictEqual(patched.type, patch.type);
    }
  });

  it("remove all departments test data", async () => {
    for (let i = 0; i < results.length; i++) {
      const removed = await service.findByIdAndDelete(results[i]._id);
      assert.ok(removed, `departments data ${results[i].number} removed!`);
    }
  });

  it("remove all user test data", async () => {
    await Promise.all([
      ...usersRefDataResults.map((item) =>
        usersService.findByIdAndDelete(item._id),
      ),
      ...companyResults.map((item) => app.service("companies").Model.findByIdAndDelete(item._id))
    ]);
  });
});
