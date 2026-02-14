
import { faker } from "@faker-js/faker";
export default (user,count,userIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
name: faker.datatype.boolean(""),
address: faker.datatype.boolean(""),
contact: faker.datatype.boolean(""),
dob: faker.datatype.boolean(""),
user: userIds[i % userIds.length],
isActive: faker.datatype.boolean(""),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
