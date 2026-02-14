
    module.exports = function (app) {
        const modelName = "students";
        const mongooseClient = app.get("mongooseClient");
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            name: { type:  String , comment: "Name, p, false, true, true, true, true, true, true, , , , ," },
address: { type:  String , comment: "Address, p, false, true, true, true, true, true, true, , , , ," },
contact: { type: Number, max: 10000000, comment: "Contact, p_number, false, true, true, true, true, true, true, , , , ," },
dob: { type: Date, comment: "DOB, p_date, false, true, true, true, true, true, true, , , , ," },
user: { type: Schema.Types.ObjectId, ref: "users", comment: "User, dropdown, false, true, true, true, true, true, true, users, users, one-to-one, name," },
isActive: { type: Boolean, required: false, comment: "Is active, p_boolean, false, true, true, true, true, true, true, , , , ," },

            createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
            updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true }
          },
          {
            timestamps: true
        });
      
       
        if (mongooseClient.modelNames().includes(modelName)) {
          mongooseClient.deleteModel(modelName);
        }
        return mongooseClient.model(modelName, schema);
        
      };