const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
  {
    name: "From User",
    email: "sender@example.com",
    password: "password",
  },
  {
    name: "To User",
    email: "recipient@example.com",
    password: "password",
  },
];

const usersService = app.service("users").Model;
const service = app.service("inbox").Model;
const patch = {
  subject: "subject updated",
};
let testData = [];
let usersRefDataResults = [];

describe("inbox service", () => {
  let results = [];
  it("registered the service", () => {
    assert.ok(service, "Registered the service (inbox)");
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

  it("create inbox data", async () => {
    const standardUser = await usersService.findOne({
      email: "standard@example.com",
    });

    // create a object array of inbox test schema model
    testData = [
      {
        from: usersRefDataResults[1]._id,
        toUser: usersRefDataResults[2]._id,
        subject: "Sample Inbox Text",
        content: "Content of Inbox messsage",
        service: "serviceName Postions",
        read: true,
        flagged: true,
        sent: Date.now(),
        createdBy: standardUser._id,
        updatedBy: standardUser._id,
      },
    ];
    results = await service.create(testData).catch((err) => {
      console.error(err);
      throw err;
    });
    if (!results || results.length === 0) assert.fail("inbox creation failed!");
    assert.ok(service, `Created (${results.length} inbox) success!`);
  });

  it("verify inbox creation", async () => {
    for (let i = 0; i < results.length; i++) {
      const exists = await service.findById(results[i]._id);
      assert.ok(exists, `userPhone ${results[i]} exists!`);
    }
  });

  it("patch inbox", async () => {
    for (let i = 0; i < results.length; i++) {
      const patched = await service.findByIdAndUpdate(results[i]._id, patch, {
        new: true,
      });
      assert.ok(patched, `inbox ${patched} patched!`);
      assert.strictEqual(patched.subject, patch.subject);
    }
  });

  it("remove all inbox test data", async () => {
    for (let i = 0; i < results.length; i++) {
      const removed = await service.findByIdAndDelete(results[i]._id);
      assert.ok(removed, `inbox data ${results[i].number} removed!`);
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
