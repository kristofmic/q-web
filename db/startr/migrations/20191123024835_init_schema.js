exports.up = (knex) => knex.schema
  .createTable('users', (table) => {
    table
      .string('id', 255)
      .notNullable()
      .unique()
      .primary();
    table
      .string('email_address', 255)
      .notNullable()
      .unique();
    table.string('given_name', 255);
    table.string('family_name', 255);
    table.string('picture', 255);
    table.string('password_hash', 255);
    table.string('oauth_access_token', 255);
    table.string('oauth_refresh_token', 255);
    table.enu('oauth_provider', ['GOOGLE'], {
      useNative: true,
      enumName: 'oauth_provider_type',
    });
    table
      .bigInteger('created_at')
      .unsigned()
      .notNullable();
    table
      .bigInteger('updated_at')
      .unsigned()
      .notNullable();

    table.index(['email_address']);
  })

  .createTable('refresh_tokens', (table) => {
    table
      .string('id', 255)
      .notNullable()
      .unique()
      .primary();
    table.string('user_id', 255).notNullable();
    table
      .bigInteger('created_at')
      .unsigned()
      .notNullable();
    table
      .bigInteger('updated_at')
      .unsigned()
      .notNullable();

    table
      .foreign('user_id')
      .references('id')
      .inTable('users');

    table.index(['user_id']);
  });

exports.down = (knex) => knex.schema
  .dropTableIfExists('refresh_tokens')
  .dropTableIfExists('users')
  .raw('DROP TYPE IF EXISTS oauth_provider_type');
