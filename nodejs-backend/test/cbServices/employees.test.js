const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
  {
    name: "Manager User",
    email: "manager@example.com",
    password: "password",
  },
];

const usersService = app.service("users").Model;
const service = app.service("employees").Model;
const patch = {
  empCode: "E1001 updated",
};

let testData = [];
let usersRefDataResults = [];
let companyResults = [];
let departmentResults = [];
let sectionResults = [];
let roleResults = [];
let positionResults = [];
let branchResults = [];
let profilesResults = [];

describe("employees service", () => {
  let results = [];
  it("registered the service", () => {
    assert.ok(service, "Registered the service (employees)");
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

  it("create employees data", async () => {
    const standardUser = await usersService.findOne({
      email: "standard@example.com",
    });

    // create a company test data
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
      .catch((err) => {
        console.error(err);
        throw err;
      });

    // create a department test data
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
      .catch((err) => {
        console.error(err);
        throw err;
      });

    // create a section test data
    const sectionTestData = [
      {
        name: "Section A",
        description: "This is Section A",
        createdBy: standardUser._id,
        updatedBy: standardUser._id,
      },
    ];
    sectionResults = await app

      .service("sections")
      .Model.create(sectionTestData)
      .catch((err) => {
        console.error(err);
        throw err;
      });

    // create a role test data
    const roleTestData = [
      {
        name: "Admin",
        description: "Administrator role with full permissions",
        isDefault: true,
        createdBy: standardUser._id,

        updatedBy: standardUser._id,
      },
    ];
    roleResults = await app
      .service("roles")
      .Model.create(roleTestData)
      .catch((err) => {
        console.error(err);
        throw err;
      });

    // create a postions test data
    const positionTestData = [
      {
        roleId: roleResults[0]._id,
        name: "Manager",
        description: "Manages team operations",
        abbr: "MGR",
        isDefault: true,
        createdBy: standardUser._id,
        updatedBy: standardUser._id,
      },
    ];
    positionResults = await app
      .service("positions")
      .Model.create(positionTestData)
      .catch((err) => {
        console.error(err);
        throw err;
      });

    // create branch test data
    const branchTestData = [
      {
        companyId: companyResults[0]._id,
        name: "Main Branch",
        isDefault: true,
        createdBy: standardUser._id,
        updatedBy: standardUser._id,
      },
    ];
    branchResults = await app
      .service("branches")
      .Model.create(branchTestData)
      .catch((err) => {
        console.error(err);
        throw err;
      });

    // create a profile test schema model
    const profilesService = app.service("profiles").Model;
    const profilesTestData = [
      {
        name: "John Doe",
        userId: usersRefDataResults[0]._id,
        image: "http://example.com/image.jpg",
        bio: "This is a sample bio",
        department: departmentResults[0]._id,
        hod: true,
        section: sectionResults[0]._id,
        hos: false,
        role: roleResults[0]._id,
        position: positionResults[0]._id,
        manager: usersRefDataResults[1]._id,
        company: companyResults[0]._id,
        branch: branchResults[0]._id,
        isDefault: true,
        createdBy: standardUser._id,
        updatedBy: standardUser._id,
      },
    ];
    profilesResults = await profilesService
      .create(profilesTestData)
      .catch((err) => {
        console.error(err);
        throw err;
      });
    if (profilesResults.length === 0) assert.fail("Profile creation failed!");
    assert.ok(
      profilesService,
      `Created (${profilesResults.length} profiles) success!`,
    );

    // create a object array of employees test schema model
    testData = [
      {
        empNo: "JD001",
        name: "John Doe",
        empCode: "E1001",
        empGroup: "Group A",
        resigned: "No",
        fullname: "Johnathan Doe",
        userEmail: "jonathan@example.com",
        company: companyResults[0]._id,
        branch: branchResults[0]._id,
        department: departmentResults[0]._id,
        section: sectionResults[0]._id,
        supervisor: null,
        position: positionResults[0]._id,
        dateJoined: new Date("2021-06-15"),
        dateTerminated: null,
        createdBy: standardUser._id,
        updatedBy: standardUser._id,
      },
    ];
    results = await service.create(testData).catch((err) => {
      console.error(err);
      throw err;
    });
    if (!results || results.length === 0)
      assert.fail("employees creation failed!");
    assert.ok(service, `Created (${results.length} employees) success!`);
  });

  it("verify employees creation", async () => {
    for (let i = 0; i < results.length; i++) {
      const exists = await service.findById(results[i]._id);
      assert.ok(exists, `userPhone ${results[i]} exists!`);
    }
  });

  it("patch employees", async () => {
    for (let i = 0; i < results.length; i++) {
      const patched = await service.findByIdAndUpdate(results[i]._id, patch, {
        new: true,
      });
      assert.ok(patched, `employees ${patched} patched!`);
      assert.strictEqual(patched.empCode, patch.empCode);
    }
  });

  it("remove all employees test data", async () => {
    for (let i = 0; i < results.length; i++) {
      const removed = await service.findByIdAndDelete(results[i]._id);
      assert.ok(removed, `employees data ${results[i].number} removed!`);
    }
  });

  it("remove all user test data", async () => {
    for (let i = 0; i < usersRefDataResults.length; i++) {
      const removed = await usersService.findByIdAndDelete(
        usersRefDataResults[i]._id,
      );
      assert.ok(removed, `User data ${usersRefDataResults[i].name} removed!`);
    }

    await Promise.all([
      ...companyResults.map((item) =>
        app.service("companies").Model.findByIdAndDelete(item._id),
      ),
      ...departmentResults.map((item) =>
        app.service("departments").Model.findByIdAndDelete(item._id),
      ),
      ...sectionResults.map((item) =>
        app.service("sections").Model.findByIdAndDelete(item._id),
      ),
      ...roleResults.map((item) =>
        app.service("roles").Model.findByIdAndDelete(item._id),
      ),
      ...positionResults.map((item) =>
        app.service("positions").Model.findByIdAndDelete(item._id),
      ),
      ...branchResults.map((item) =>
        app.service("branches").Model.findByIdAndDelete(item._id),
      ),
      ...profilesResults.map((item) =>
        app.service("profiles").Model.findByIdAndDelete(item._id),
      ),
    ]);
  });
});
