module.exports = function (app) {
  const modelName = "login_history";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
      loginTime: { type: Date, default: Date.now },
      device: { type: String },
      ip: { type: String },
      browser: { type: String },
      userAgent: { type: String },
      logoutTime: { type: Date },
      network: { type: String },
      version: { type: String },
      city: { type: String },
      region: { type: String },
      region_code: { type: String },
      country: { type: String },
      country_name: { type: String },
      country_code: { type: String },
      country_code_iso3: { type: String },
      country_capital: { type: String },
      country_tld: { type: String },
      continent_code: { type: String },
      in_eu: { type: Boolean },
      postal: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
      timezone: { type: String },
      utc_offset: { type: String },
      country_calling_code: { type: String },
      currency: { type: String },
      currency_name: { type: String },
      languages: { type: String },
      country_area: { type: Number },
      country_population: { type: Number },
      asn: { type: String },
      org: { type: String },
    },
    {
      timestamps: true,
    },
  );

  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
};
