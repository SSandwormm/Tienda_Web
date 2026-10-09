const { query } = require("./db");

// Supabase user IDs are stored as UUIDs in PostgreSQL, but are not foreign keys
// because Supabase Auth lives in a different database.
async function listOrdersBySupabaseUserId(supabaseUserId) {
  const result = await query(
    `
      select
        o.id,
        o.status,
        o.total,
        o.created_at,
        coalesce(
          jsonb_agg(
            jsonb_build_object(
              'productId', oi.product_id,
              'quantity', oi.quantity,
              'unitPrice', oi.unit_price
            ) order by oi.id
          ) filter (where oi.id is not null),
          '[]'::jsonb
        ) as items
      from orders o
      left join order_items oi on oi.order_id = o.id
      where o.user_id = $1::uuid
      group by o.id
      order by o.created_at desc
    `,
    [supabaseUserId],
  );

  return result.rows;
}

async function upsertAppUser({ userId, email, displayName }) {
  const result = await query(
    `
      insert into app_users (user_id, email, display_name)
      values ($1::uuid, $2, $3)
      on conflict (user_id) do update set
        email = excluded.email,
        display_name = excluded.display_name,
        updated_at = now()
      returning user_id, email, display_name, role, created_at, updated_at
    `,
    [userId, email || null, displayName || null],
  );

  return result.rows[0];
}

module.exports = { listOrdersBySupabaseUserId, upsertAppUser };
