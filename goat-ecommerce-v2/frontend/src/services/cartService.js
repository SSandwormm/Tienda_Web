export function addToCart(dispatch, product) {
  dispatch({ type: "ADD", payload: product });
}

export function removeFromCart(dispatch, product) {
  dispatch({ type: "REMOVE", payload: product });
}
