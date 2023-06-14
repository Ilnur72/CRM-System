/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('groups_students', (table) => {
      table.increments('id').primary(),
      table.integer('student_id').notNullable().references('id').inTable('students').onDelete('SET NULL'),
      table.integer('group_id').notNullable().references('id').inTable('groups').onDelete('SET NULL')
    })
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.dropTable('groups_students')
  };
  