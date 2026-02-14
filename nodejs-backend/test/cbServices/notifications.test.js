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
const service = app.service("notifications").Model;
const patch = {
  fieldName: "fileno updated",
};
let testData = [];
let usersRefDataResults = [];
let servicePermissionsResults = [];

describe("notifications service", () => {
  let results = [];
  it("registered the service", () => {
    assert.ok(service, "Registered the service (notifications)");
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

  it("create notifications data", async () => {
    const standardUser = await usersService.findOne({
      email: "standard@example.com",
    });

    // create servicePermissions
    const servicePermissionsTestData = [
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
    servicePermissionsResults = await app
      .service("companies")
      .Model.create(servicePermissionsTestData)
      .catch((err) => {
        console.error(err);
        throw err;
      });

    // create a object array of notifications test schema model
    testData = [
      {
        servicePermissionId: servicePermissionsResults[0]._id,
        fieldName: "upload.csv",
        onCreate: true,
        onUpdate: false,
        onDetail: true,
        onTable: true,
        createdBy: standardUser._id,
        updatedBy: standardUser._id,
      },
    ];
    results = await service.create(testData).catch((err) => {
      console.error(err);
      throw err;
    });
    if (!results || results.length === 0)
      assert.fail("notifications creation failed!");
    assert.ok(service, `Created (${results.length} notifications) success!`);
  });

  it("verify notifications creation", async () => {
    for (let i = 0; i < results.length; i++) {
      const exists = await service.findById(results[i]._id);
      assert.ok(exists, `userPhone ${results[i]} exists!`);
    }
  });

  it("patch notifications", async () => {
    for (let i = 0; i < results.length; i++) {
      const patched = await service.findByIdAndUpdate(results[i]._id, patch, {
        new: true,
      });
      assert.ok(patched, `notifications ${patched} patched!`);
      assert.strictEqual(patched.fieldName, patch.fieldName);
    }
  });

  it("remove all notifications test data", async () => {
    for (let i = 0; i < results.length; i++) {
      const removed = await service.findByIdAndDelete(results[i]._id);
      assert.ok(removed, `notifications data ${results[i].number} removed!`);
    }
  });

  it("remove all user test data", async () => {
    const removed = Promise.all([
      ...usersRefDataResults.map((item) =>
        usersService.findByIdAndDelete(item._id),
      ),
      ...servicePermissionsResults.map((item) =>
        app.service("permissionServices").Model.findByIdAndDelete(item._id),
      ),
    ]);
    assert.ok(removed, "User data removed!");
  });
});
