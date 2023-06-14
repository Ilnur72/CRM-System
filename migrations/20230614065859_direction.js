/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("direction", (table) => {
    table.increments('id').primary(),
    table.enum('name', ['Dasturlash', 'Dizayn', 'Grafika', 'Boshqa']).notNullable()
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('direction')
};
