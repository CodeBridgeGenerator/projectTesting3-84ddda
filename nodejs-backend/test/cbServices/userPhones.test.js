const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Super User",
    email: "super@example.com",
    password: "password",
  },
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

const usersService = app.service("users").Model;
const service = app.service("userPhones").Model;
let userPhonesTestData = [];
let usersRefDataResults = [];

describe("userPhones service", () => {
  let results = [];
  it("registered the service", () => {
    assert.ok(service, "Registered the service (userPhones)");
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

  it("create user phones data", async () => {
    const superUser = await usersService.findOne({
      email: "super@example.com",
    });
    const standardUser = await usersService.findOne({
      email: "standard@example.com",
    });

    userPhonesTestData = [
      {
        userId: standardUser._id,
        countryCode: 60,
        operatorCode: 19,
        number: 56781901,
        type: "Mobile",
        isDefault: true,
        createdBy: superUser._id,
        updatedBy: superUser._id,
      },
      {
        userId: standardUser._id,
        countryCode: 1,
        operatorCode: 234,
        number: 56789091,
        type: "Land line",
        isDefault: true,
        createdBy: superUser._id,
        updatedBy: superUser._id,
      },
      {
        userId: standardUser._id,
        countryCode: 1,
        operatorCode: 234,
        number: 5678,
        type: "Fax",
        isDefault: true,
        createdBy: superUser._id,
        updatedBy: superUser._id,
      },
    ];
    results = await service.create(userPhonesTestData).catch((err) => {
      console.error(err);
      throw err;
    });
    if (!results || results.length === 0)
      assert.fail("User phone creation failed!");
    assert.ok(service, `Created (${results.length} user phones) success!`);
  });

  it("verify user phone creation", async () => {
    for (let i = 0; i < results.length; i++) {
      const exists = await service.findById(results[i]._id);
      assert.ok(exists, `User phone ${results[i]} exists!`);
    }
  });

  it("patch userPhones", async () => {
    for (let i = 0; i < results.length; i++) {
      const patched = await service.findByIdAndUpdate(
        results[i]._id,
        {
          type: "Mobile",
        },
        { new: true },
      );
      assert.ok(patched, `userPhones ${patched} patched!`);
      assert.strictEqual(patched.type, "Mobile");
    }
  });

  it("remove all user phone test data", async () => {
    for (let i = 0; i < results.length; i++) {
      const removed = await service.findByIdAndDelete(results[i]._id);
      assert.ok(removed, `User phone data ${results[i].number} removed!`);
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
