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
const service = app.service("mailQues").Model;
const patch = {
  subject: "subject updated",
};
let testData = [];
let usersRefDataResults = [];

describe("mailQues service", () => {
  let results = [];
  it("registered the service", () => {
    assert.ok(service, "Registered the service (mailQues)");
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

  it("create mailQues data", async () => {
    const standardUser = await usersService.findOne({
      email: "standard@example.com",
    });

    // create a object array of mailQues test schema model
    testData = [
      {
        name: "Admin",
        from: "Administrator role with full permissions",
        recipients: ["email@domain.com"],
        status: true,
        data: { data: "Administrator role with full permissions" },
        templateId: "template123",
        subject: "Administrator role with full permissions",
        content: "Administrator role with full permissions",
        jobId: 12345,
        errorMessage: "None",
        end: new Date("2026-01-18T00:00:00Z"),
        createdBy: standardUser._id,
        updatedBy: standardUser._id,
      }
    ];
    results = await service.create(testData).catch((err) => {
      console.error(err);
      throw err;
    });
    if (!results || results.length === 0)
      assert.fail("mailQues creation failed!");
    assert.ok(service, `Created (${results.length} mailQues) success!`);
  });

  it("verify mailQues creation", async () => {
    for (let i = 0; i < results.length; i++) {
      const exists = await service.findById(results[i]._id);
      assert.ok(exists, `userPhone ${results[i]} exists!`);
    }
  });

  it("patch mailQues", async () => {
    for (let i = 0; i < results.length; i++) {
      const patched = await service.findByIdAndUpdate(results[i]._id, patch, {
        new: true,
      } );
      assert.ok(patched, `mailQues ${patched} patched!`);
      assert.strictEqual(patched.subject, patch.subject);
    }
  });

  it("remove all mailQues test data", async () => {
    for (let i = 0; i < results.length; i++) {
      const removed = await service.findByIdAndDelete(results[i]._id);
      assert.ok(removed, `mailQues data ${results[i].number} removed!`);
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
