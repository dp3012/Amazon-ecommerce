export let cart = JSON.parse(localStorage.getItem('cart'));

if (cart === null || !Array.isArray(cart)) {
  cart = [];
}

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId)
      matchingItem = cartItem;
  });

  if (matchingItem) {
    matchingItem.quantity += 1;
  } else {
    cart.push({
      productId: productId,
      quantity: 1
    });
  }

  saveToStorage();
}

export function removeFromCart(productId) {
  if (cart.length !== 0) {
    cart = cart.filter((item) => {
      return item.productId !== productId
    });
  }

  saveToStorage();
}

export function calculateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  return cartQuantity;
}

export function updateItemQuantity(productId, newQuantity) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId)
      matchingItem = cartItem;
  });

  matchingItem.quantity = newQuantity;

  saveToStorage();
}