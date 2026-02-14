const assert = require("assert");
const app = require("../../src/app");

const service = app.service("userChangePassword").Model;
let testData = [
  {
    userEmail: "super@example.com",
    server: "server1",
    environment: "production",
    code: "ABC123",
    status: false,
    sendEmailCounter: 0,  
  },
];
const patch = {
  environment: "staging",
};

describe("'userChangePassword' service", () => {
  let results = [];
  it("registered the service", () => {
    const service = app.service("userChangePassword");
    assert.ok(service, "Registered the service (userChangePassword)");
  });

  it("create multi userChangePassword service", async () => {
    results = await service.create(testData).catch((err) => {
      console.error(err);
      throw err;
    });
    if (results.length === 0)
      assert.fail("userChangePassword creation failed!");
    assert.ok(
      service,
      `Created (${results.length} userChangePassword ) success!`,
    );
    assert.ok(service, "Registered the service (userChangePassword)");
  });

  it("verify userChangePassword creation", async () => {
    for (let i = 0; i < results.length; i++) {
      const exists = await service.findById(results[i]._id);
      assert.ok(exists, `userChangePassword ${results[i]} exists!`);
    }
  });

  it("patch users", async () => {
    for (let i = 0; i < results.length; i++) {
      const patched = await service.findByIdAndUpdate(results[i]._id, patch, {
        new: true,
      });
      assert.ok(patched, `userChangePassword ${patched} patched!`);
    }
  });

  it("remove all userChangePassword test data", async () => {
    for (let i = 0; i < results.length; i++) {
      const removed = await service.findByIdAndDelete(results[i]._id);
      assert.ok(
        removed,
        `userChangePassword data ${results[i].number} removed!`,
      );
    }
  });
});
