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
const service = app.service("sections").Model;
const patch = {
  code: "Second code",
};
let testData = [];
let usersRefDataResults = [];
let departmentResults = [];
let companyResults = [];

describe("sections service", () => {
  let results = [];
  it("registered the service", () => {
    assert.ok(service, "Registered the service (sections)");
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

  it("create sections data", async () => {
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

    // create department test data
    const departmentTestData = [
      {
        companyId: companyResults[0]._id,
        name: "Development",
        code: "232D001",
        createdBy: standardUser._id,
        updatedBy: standardUser._id,
      },
    ];
    departmentResults = await app
      .service("departments")
      .Model.create(departmentTestData)
      .catch(console.error);

    // create a object array of sections test schema model
    testData = [
      {
        departmentId: departmentResults[0]._id,
        name: "Software Development",
        code: "SD001",
        isDefault: true,
        createdBy: standardUser._id,
        updatedBy: standardUser._id,
      },
    ];
    results = await service.create(testData).catch((err) => {
      console.error(err);
      throw err;
    });
    if (!results || results.length === 0)
      assert.fail("sections creation failed!");
    assert.ok(service, `Created (${results.length} sections) success!`);
  });

  it("verify sections creation", async () => {
    for (let i = 0; i < results.length; i++) {
      const exists = await service.findById(results[i]._id);
      assert.ok(exists, `userPhone ${results[i]} exists!`);
    }
  });

  it("patch sections", async () => {
    for (let i = 0; i < results.length; i++) {
      const patched = await service.findByIdAndUpdate(results[i]._id, patch, {
        new: true,
      });
      assert.ok(patched, `sections ${patched} patched!`);
      assert.strictEqual(patched.type, patch.type);
    }
  });

  it("remove all sections test data", async () => {
    for (let i = 0; i < results.length; i++) {
      const removed = await service.findByIdAndDelete(results[i]._id);
      assert.ok(removed, `sections data ${results[i].number} removed!`);
    }
  });

  it("remove all user test data", async () => {
    await Promise.all([
      ...usersRefDataResults.map((item) =>
        usersService.findByIdAndDelete(item._id),
      ),
      ...departmentResults.map((item) =>
        app.service("departments").Model.findByIdAndDelete(item._id),
      ),
      ...companyResults.map((item) =>
        app.service("companies").Model.findByIdAndDelete(item._id),
      ),
    ]);
  });
});
