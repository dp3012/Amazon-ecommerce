import { cart, removeFromCart, calculateCartQuantity, updateItemQuantity} from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

updateCartQuantity();

let cartSummaryHtml = ''; 

// if (cart.length === 0)
//   document.querySelector('.js-order-summary').innerText = 'The cart is empty';

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProduct;
  products.forEach((product) => {
    if (product.id === productId)
      matchingProduct = product;
  });

  cartSummaryHtml += 
  `
    <div class="cart-item-container 
      js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: Tuesday, June 21
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
              Update 
            </span>
            <input class="quantity-input js-quantity-input-${matchingProduct.id}" type="number">
            <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}">
            Save
            </span> 
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          <div class="delivery-option">
            <input type="radio" checked
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Tuesday, June 21
              </div>
              <div class="delivery-option-price">
                FREE Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio"
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Wednesday, June 15
              </div>
              <div class="delivery-option-price">
                $4.99 - Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio"
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Monday, June 13
              </div>
              <div class="delivery-option-price">
                $9.99 - Shipping
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
});
document.querySelector('.js-order-summary').innerHTML = cartSummaryHtml;

function updateCartQuantity() {
  let cartQuantity = calculateCartQuantity();
  if (cartQuantity === 0)
    document.querySelector('.js-checkout-items-link').innerText = '';
  else {
    document.querySelector('.js-checkout-items-link').innerText = cartQuantity;
  }
}

document.querySelectorAll('.js-delete-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      updateCartQuantity();
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.remove();
    });
  });

document.querySelectorAll('.js-update-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      const {productId} = link.dataset;
      const cartItemContainer = document.querySelector(`.js-cart-item-container-${productId}`);
      cartItemContainer.classList.add('is-updating');
    });
  });

document.querySelectorAll('.js-save-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      const {productId} = link.dataset;
      const cartItemContainer = document.querySelector(`.js-cart-item-container-${productId}`);
      cartItemContainer.classList.remove('is-updating');

      const quantityInputElement = document.querySelector(`.js-quantity-input-${productId}`);
      const newQuantity = Number(quantityInputElement.value);

      updateItemQuantity(productId, newQuantity);

      document.querySelector(`.js-quantity-label-${productId}`).innerText = newQuantity;
      updateCartQuantity();
    });
  });