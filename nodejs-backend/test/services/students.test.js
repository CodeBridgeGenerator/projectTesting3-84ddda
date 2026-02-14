const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("students service", () => {
  let thisService;
  let studentCreated;
  let usersServiceResults;
  let users;

  beforeEach(async () => {
    thisService = await app.service("students");

    // Create users here
    usersServiceResults = await app.service("users").Model.create(usersRefData);
    users = {
      createdBy: usersServiceResults[0]._id,
      updatedBy: usersServiceResults[0]._id,
    };
  });

  after(async () => {
    if (usersServiceResults) {
      await Promise.all(
        usersServiceResults.map((i) =>
          app.service("users").Model.findByIdAndDelete(i._id)
        )
      );
    }
  });

  it("registered the service", () => {
    assert.ok(thisService, "Registered the service (students)");
  });

  describe("#create", () => {
    const options = {"name":"new value","address":"new value","contact":23,"dob":1771092265908,"user":"aasdfasdfasdfadsfadfa","isActive":true};

    beforeEach(async () => {
      studentCreated = await thisService.create({...options, ...users});
    });

    it("should create a new student", () => {
      assert.strictEqual(studentCreated.name, options.name);
assert.strictEqual(studentCreated.address, options.address);
assert.strictEqual(studentCreated.contact, options.contact);
assert.strictEqual(studentCreated.dob, options.dob);
assert.strictEqual(studentCreated.user, options.user);
assert.strictEqual(studentCreated.isActive, options.isActive);
    });
  });

  describe("#get", () => {
    it("should retrieve a student by ID", async () => {
      const retrieved = await thisService.findById(studentCreated._id);
      assert.strictEqual(retrieved._id.toString(), studentCreated._id.toString());
    });
  });

  describe("#update", () => {
    const options = {"name":"updated value","address":"updated value","contact":100,"dob":null,"user":"345345345345345345345","isActive":false};

    it("should update an existing student ", async () => {
      const studentUpdated = await thisService.findByIdAndUpdate(
        studentCreated._id, 
        options, 
        { new: true } // Ensure it returns the updated doc
      );
      assert.strictEqual(studentUpdated.name, options.name);
assert.strictEqual(studentUpdated.address, options.address);
assert.strictEqual(studentUpdated.contact, options.contact);
assert.strictEqual(studentUpdated.dob, options.dob);
assert.strictEqual(studentUpdated.user, options.user);
assert.strictEqual(studentUpdated.isActive, options.isActive);
    });
  });

  describe("#delete", () => {
    it("should delete a student", async () => {
      const studentDeleted = await thisService.remove(studentCreated._id);
      assert.strictEqual(studentDeleted._id.toString(), studentCreated._id.toString());
    });
  });
});