/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('groups', (table) => {
    table.integer('direction_id').references('id').inTable('direction').onDelete('SET NULL').unique();
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('groups', (table) => {
    table.dropColumn('direction_id')
  })
};
