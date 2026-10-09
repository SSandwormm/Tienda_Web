const getPool = require("../../db/pool");

const PRODUCT_TYPES = new Set([
  "camiseta",
  "buzo",
  "balaclava",
  "accesorio",
  "bolso",
  "gafas",
  "joya",
]);

const CATEGORY_NAMES = {
  novedades: "Novedades",
  "mas-vendido": "Mas-Vendido",
  hombre: "Hombre",
  mujer: "Mujer",
  accesorios: "Accesorios",
  general: "General",
};

function slugify(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeCategories(categories) {
  const values = Array.isArray(categories) ? categories : [categories];
  const normalized = values
    .filter(Boolean)
    .map(
      (category) => CATEGORY_NAMES[String(category).toLowerCase()] || category,
    )
    .filter((category) => Object.values(CATEGORY_NAMES).includes(category));

  return [...new Set(normalized.length ? normalized : ["General"])];
}

function normalizeInput(input = {}) {
  const productType = String(input.product_type || "accesorio").toLowerCase();
  if (!PRODUCT_TYPES.has(productType)) {
    const error = new Error("Tipo de producto no valido.");
    error.status = 400;
    throw error;
  }

  if (!String(input.name || "").trim()) {
    const error = new Error("El nombre del producto es obligatorio.");
    error.status = 400;
    throw error;
  }

  return {
    name: String(input.name).trim(),
    slug: slugify(input.slug || input.name),
    price: Number(input.price) || 0,
    material: String(input.material || ""),
    color: String(input.color || ""),
    productType,
    description: String(input.description || ""),
    isFuture: Boolean(
      input.is_future ?? input.future_drop ?? input.is_future_drop,
    ),
    sizes: Array.isArray(input.variants)
      ? input.variants.map((variant) => ({
          size: String(variant.size || "Unica"),
          stock: Math.max(0, Number(variant.stock) || 0),
        }))
      : [],
    images: (Array.isArray(input.images) ? input.images : [])
      .map((image) =>
        typeof image === "string" ? image : image?.dataUrl || image?.preview,
      )
      .filter(Boolean)
      .map((url, position) => ({ url, position })),
    categories: normalizeCategories(input.categories || input.category),
  };
}

function mapProduct(row) {
  if (!row) return null;

  const images = row.images || [];
  const variants = row.variants || [];
  const categories = row.categories || ["General"];

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    price: Number(row.price),
    material: row.material,
    color: row.color,
    product_type: row.product_type,
    description: row.description,
    is_future: row.is_future,
    future_drop: row.is_future,
    is_future_drop: row.is_future,
    created_at: row.created_at,
    categories: categories.map((category) => category.toLowerCase()),
    category: categories[0].toLowerCase(),
    variants,
    stock: variants.reduce(
      (total, variant) => total + Number(variant.stock || 0),
      0,
    ),
    images,
    image: images[0] || "/placeholder.svg",
    image_url: images[0] || "/placeholder.svg",
  };
}

const productSelect = `
  select
    p.*,
    coalesce((select json_agg(json_build_object('size', ps.size, 'stock', ps.stock) order by ps.id) from product_sizes ps where ps.product_id = p.id), '[]') as variants,
    coalesce((select json_agg(pi.url order by pi.position) from product_images pi where pi.product_id = p.id), '[]') as images,
    coalesce((select json_agg(pc.category order by pc.category) from product_categories pc where pc.product_id = p.id), '["General"]') as categories
  from products p
`;

async function list({
  category,
  includeFuture = false,
  futureOnly = false,
} = {}) {
  const values = [];
  const conditions = [];

  if (!includeFuture) conditions.push("p.is_future = false");
  if (futureOnly) conditions.push("p.is_future = true");
  if (category) {
    values.push(CATEGORY_NAMES[String(category).toLowerCase()] || category);
    conditions.push(
      `exists (select 1 from product_categories pc_filter where pc_filter.product_id = p.id and pc_filter.category = $${values.length})`,
    );
  }

  const result = await getPool().query(
    `${productSelect}${conditions.length ? ` where ${conditions.join(" and ")}` : ""} order by p.created_at desc`,
    values,
  );
  return result.rows.map(mapProduct);
}

async function getBySlug(slug) {
  const result = await getPool().query(`${productSelect} where p.slug = $1`, [
    slug,
  ]);
  return mapProduct(result.rows[0]);
}

async function create(input) {
  return save(null, input);
}

async function update(id, input) {
  return save(id, input);
}

async function save(id, input) {
  const product = normalizeInput(input);
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("begin");
    const result = id
      ? await client.query(
          `update products set name = $1, slug = $2, price = $3, material = $4, color = $5, product_type = $6, description = $7, is_future = $8 where id = $9 returning id`,
          [
            product.name,
            product.slug,
            product.price,
            product.material,
            product.color,
            product.productType,
            product.description,
            product.isFuture,
            id,
          ],
        )
      : await client.query(
          `insert into products (name, slug, price, material, color, product_type, description, is_future) values ($1, $2, $3, $4, $5, $6, $7, $8) returning id`,
          [
            product.name,
            product.slug,
            product.price,
            product.material,
            product.color,
            product.productType,
            product.description,
            product.isFuture,
          ],
        );

    if (!result.rowCount) {
      await client.query("rollback");
      return null;
    }
    const productId = result.rows[0].id;
    await client.query("delete from product_sizes where product_id = $1", [
      productId,
    ]);
    await client.query("delete from product_images where product_id = $1", [
      productId,
    ]);
    await client.query("delete from product_categories where product_id = $1", [
      productId,
    ]);

    for (const variant of product.sizes) {
      await client.query(
        "insert into product_sizes (product_id, size, stock) values ($1, $2, $3)",
        [productId, variant.size, variant.stock],
      );
    }
    for (const image of product.images) {
      await client.query(
        "insert into product_images (product_id, url, position) values ($1, $2, $3)",
        [productId, image.url, image.position],
      );
    }
    for (const category of product.categories) {
      await client.query(
        "insert into product_categories (product_id, category) values ($1, $2)",
        [productId, category],
      );
    }

    await client.query("commit");
    const saved = await getById(productId);
    return mapProduct(saved);
  } catch (error) {
    await client.query("rollback");
    if (error.code === "23505") error.status = 409;
    throw error;
  } finally {
    client.release();
  }
}

async function getById(id) {
  const result = await getPool().query(`${productSelect} where p.id = $1`, [
    id,
  ]);
  return result.rows[0];
}

async function remove(id) {
  const client = await getPool().connect();
  try {
    await client.query("begin");
    const result = await client.query(
      "delete from products where id = $1 returning id",
      [id],
    );
    await client.query("commit");
    return result.rowCount > 0;
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { create, getBySlug, list, remove, update };
