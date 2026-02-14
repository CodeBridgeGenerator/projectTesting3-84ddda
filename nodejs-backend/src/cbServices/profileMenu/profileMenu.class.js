const { Service } = require("feathers-mongoose");
const FindService = require("../../utils/abstracts/FindService");
const MixedService = FindService(Service);

exports.ProfileMenu = class ProfileMenu extends MixedService {
  async find(params) {
    const query = { ...params.query };
    if (query.profile || query.position || query.role) {
      const fallbackOrder = ["profile", "position", "role"];
      for (const field of fallbackOrder) {
        if (query[field]) {
          const fallbackQuery = { [field]: query[field] };
          const results = await super.find({ ...params, query: fallbackQuery });
          if (results.length > 0) {
            return results;
          }
        }
      }
    }
    return super.find({ ...params, query });
  }
};
