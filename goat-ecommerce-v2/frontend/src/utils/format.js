export function formatPrice(value) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
}