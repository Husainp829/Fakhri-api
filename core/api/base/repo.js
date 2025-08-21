const Sequelize = require("sequelize");

const { Op } = Sequelize;
const models = require("../../../models");

function findAll(resource, query) {
  const {
    orderBy,
    order,
    limit,
    startAfter,
    filter,
    columnName,
    include,
    where,
    attributes,
    keyName = "id",
    ...rest
  } = query;

  const whereCondition = {
    ...(where || rest),
  };

  if (filter) {
    const { id } = JSON.parse(filter) || {};
    whereCondition[keyName] = {
      [Op.in]: id || [],
    };
  }

  const params = {
    where: whereCondition,
    attributes: attributes || { exclude: ["deletedAt"] },
  };

  if (orderBy && order && limit && startAfter >= 0) {
    params.order = [[orderBy, order]];
    params.limit = parseInt(limit, 10);
    params.offset = parseInt(startAfter, 10);
  }

  if (include) {
    params.include = include;
  }

  return models[resource].findAndCountAll(params);
}

async function findById(resource, columnName = "id", id, include, attributes) {
  const whereCondition = {
    [columnName]: id,
  };

  const params = {
    where: whereCondition,
    attributes: attributes || { exclude: ["deletedAt"] },
  };

  if (include) {
    params.include = include;
  }

  const rows = await models[resource].findAll(params).then((row) => row.map((r) => r.toJSON()));
  return { count: rows.length, rows: rows || [] };
}

function insert(resource, data, transaction) {
  return models[resource].create(data, { transaction }).then((response) => ({
    count: 1,
    rows: [{ id: response.id }],
  }));
}

function findOrCreate(resource, data, condition = {}) {
  return models[resource]
    .findOrCreate({
      where: condition,
      defaults: data,
    })
    .then((response) => response);
}

function update(resource, id, data, transaction) {
  const where = {
    id,
  };

  return models[resource]
    .update(data, {
      where,
      transaction,
    })
    .then(() => ({
      count: 1,
      rows: [{ id }],
    }));
}

function updateMany(resource, ids, data) {
  return models[resource].update(data, {
    where: {
      id: ids,
    },
  });
}

function remove(resource, id, force = false) {
  const where = {
    id,
  };

  return models[resource].destroy({ where, force });
}

function updateOrCreate(resource, where, newItem) {
  return models[resource].findOne({ where }).then((foundItem) => {
    if (!foundItem) {
      return models[resource].create(newItem).then((response) => ({
        count: 1,
        rows: [{ id: response.id }],
      }));
    }
    return models[resource].update(newItem, { where }).then(() => ({
      count: 1,
      rows: [{ id: foundItem.id }],
    }));
  });
}

async function getCurrentSequence(id) {
  const seqResult = await models.sequence.findOne({
    where: { name: id },
  });
  return seqResult;
}

async function updateSequence(id, transaction) {
  const incrementResult = await models.sequence.increment(
    { currentValue: 1 },
    {
      where: { name: id },
      transaction,
    }
  );
  return incrementResult;
}

function appendAmount(resource, id, data, transaction) {
  const where = {
    id,
  };

  return models[resource]
    .increment(data, {
      where,
      transaction,
    })
    .then(() => ({
      count: 1,
      rows: [{ id }],
    }));
}

module.exports = {
  findAll,
  findById,
  insert,
  findOrCreate,
  update,
  updateMany,
  updateOrCreate,
  remove,
  getCurrentSequence,
  updateSequence,
  appendAmount,
};
