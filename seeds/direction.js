/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('direction').del()
  await knex('direction').insert([
    {name: 'Dasturlash'},
    {name: 'Dizayn'},
    {name: 'Grafika'}
  ]);
};
