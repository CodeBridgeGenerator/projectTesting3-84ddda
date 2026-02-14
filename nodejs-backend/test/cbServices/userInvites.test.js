const assert = require("assert");
const app = require("../../src/app");

const service = app.service("userInvites").Model;
let testData = [
  {
    emailToInvite: "super@example.com",
    code: 123456,
    access: "full",
    sendMailCounter: 1, 
  },
];
const patch = {
  access: "patched_access",
};

describe("'userInvites' service", () => {
  let results = [];
  it("registered the service", () => {
    assert.ok(service, "Registered the service (userInvites)");
  });

  it("create multi userInvites service", async () => {
    results = await service.create(testData).catch((err) => {
      console.error(err);
      throw err;
    });
    if (results.length === 0) assert.fail("userInvites creation failed!");
    assert.ok(service, `Created (${results.length} userInvites ) success!`);
    assert.ok(service, "Registered the service (userInvites)");
  });

  it("verify userInvites creation", async () => {
    for (let i = 0; i < results.length; i++) {
      const exists = await service.findById(results[i]._id);
      assert.ok(exists, `userInvites ${results[i]} exists!`);
    }
  });

  it("patch users", async () => {
    for (let i = 0; i < results.length; i++) {
      const patched = await service.findByIdAndUpdate(results[i]._id, patch, {
        new: true,
      });
      assert.ok(patched, `userInvites ${patched} patched!`);
    }
  });

  it("remove all userInvites test data", async () => {
    for (let i = 0; i < results.length; i++) {
      const removed = await service.findByIdAndDelete(results[i]._id);
      assert.ok(removed, `userInvites data ${results[i].number} removed!`);
    }
  });
});
