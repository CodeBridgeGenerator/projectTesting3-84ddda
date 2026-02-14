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
const service = app.service("staffinfo").Model;
const patch = {
  name: "Janis Joplin",
};
let testData = [];
let usersRefDataResults = [];

describe("staffInfo service", () => {
  let results = [];
  it("registered the service", () => {
    assert.ok(service, "Registered the service (staffInfo)");
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

  it("create staffInfo data", async () => {
    const standardUser = await usersService.findOne({
      email: "standard@example.com",
    });

    // create a object array of staffInfo test schema model
    testData = [
      {
        empno: 101,
        name: "John Doe",
        designation: "Software Engineer",
        namenric: "ジョン・ドウ",
        compcode: 1343,
        compname: "Tech Solutions Inc.",
        deptcode: "D001",
        deptname: "Development",
        grade: "G5",  
        sectcode: 6754,
        sectdesc: "Software Development",
        email: "sample@example.com",
        resign: false,
        createdBy: standardUser._id,
        updatedBy: standardUser._id,
      }
    ];
    results = await service.create(testData).catch((err) => {
      console.error(err);
      throw err;
    });
    if (!results || results.length === 0)
      assert.fail("staffInfo creation failed!");
    assert.ok(service, `Created (${results.length} staffInfo) success!`);
  });

  it("verify staffInfo creation", async () => {
    for (let i = 0; i < results.length; i++) {
      const exists = await service.findById(results[i]._id);
      assert.ok(exists, `userPhone ${results[i]} exists!`);
    }
  });

  it("patch staffInfo", async () => {
    for (let i = 0; i < results.length; i++) {
      const patched = await service.findByIdAndUpdate(results[i]._id, patch, {
        new: true,
      } );
      assert.ok(patched, `staffInfo ${patched} patched!`);
      assert.strictEqual(patched.type, patch.type);
    }
  });

  it("remove all staffInfo test data", async () => {
    for (let i = 0; i < results.length; i++) {
      const removed = await service.findByIdAndDelete(results[i]._id);
      assert.ok(removed, `staffInfo data ${results[i].number} removed!`);
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
