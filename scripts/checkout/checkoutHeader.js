import { calculateCartQuantity } from "../../data/cart.js";

export function renderCheckoutHeader() {
  let cartQuantity = calculateCartQuantity();
  if (cartQuantity === 0)
    document.querySelector('.js-checkout-items-link').innerText = '';
  else {
    document.querySelector('.js-checkout-items-link').innerText = cartQuantity;
  }
}