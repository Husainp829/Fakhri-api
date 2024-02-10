module.exports = {
  findById: "SELECT * FROM ?? WHERE ?? = ?",
  findAll: "SELECT * FROM tableName WHERE is_active = 1",
  findAllById: "SELECT * FROM ?? WHERE is_active = 1 and ?? in (?)",
  findAllQuery: "SELECT * FROM ?? WHERE is_active = 1 ",
  countAll: "SELECT count(*) as count FROM ? where is_active = 1",
  countAllQuery: "SELECT count(*) as count FROM ?? WHERE is_active = 1",
  countAllById: "SELECT count(*) as count FROM ?? WHERE is_active = 1 and ?? in (?)",
};
