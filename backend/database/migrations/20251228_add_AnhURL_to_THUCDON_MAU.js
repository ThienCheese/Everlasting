/**
 * Add AnhURL column to THUCDON_MAU if it doesn't exist
 */

export function up(knex) {
  return knex.schema.hasColumn('THUCDON_MAU', 'AnhURL').then((exists) => {
    if (exists) return;
    return knex.schema.alterTable('THUCDON_MAU', (table) => {
      table.string('AnhURL', 1024).nullable();
    });
  });
}

export function down(knex) {
  return knex.schema.hasColumn('THUCDON_MAU', 'AnhURL').then((exists) => {
    if (!exists) return;
    return knex.schema.alterTable('THUCDON_MAU', (table) => {
      table.dropColumn('AnhURL');
    });
  });
}
