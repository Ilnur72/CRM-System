const bcrypt = require('bcrypt')
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('stuff').del()
  await knex('stuff').insert([
    { first_name: 'Ilnur', last_name: 'Umirbayev', role: 'super_admin', username: 'Ilnur', password: bcrypt.hashSync('ilnur8808', 10)},
    { first_name: 'Ali', last_name: 'Mamadaliyev', role: 'teacher', username: 'Ali', password: bcrypt.hashSync('ali72', 10)},
    { first_name: 'Otabek', last_name: 'Qo\'ldoshev', role: 'assistent_teacher', username: 'Otash', password: bcrypt.hashSync('otash72', 10)}
  ]);
};
