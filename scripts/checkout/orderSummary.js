import {cart, removeFromCart, calculateCartQuantity, updateItemQuantity, updateDeliveryOption} from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import {calculateDeliveryDate, deliveryOptions, getDeliveryOption} from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import { renderCheckoutHeader } from "./checkoutHeader.js";

export function renderOrderSummary() {
  
  renderCheckoutHeader();

  let cartSummaryHtml = ''; 
  // if (cart.length === 0)
  //   document.querySelector('.js-order-summary').innerText = 'The cart is empty';
  cart.forEach((cartItem) => {
    const {productId} = cartItem;
    const matchingProduct = getProduct(productId);

    const {deliveryOptionId} = cartItem;
    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const dateString = calculateDeliveryDate(); //func returning string
  
    cartSummaryHtml += 
    `
      <div class="cart-item-container 
        js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
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
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  });
  
  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = '';
    deliveryOptions.forEach((deliveryOption) => {
      const dateString = calculateDeliveryDate(); //func returning string
  
      const priceString = deliveryOption.priceCents === 0 
        ? 'FREE'
        : `$${formatCurrency(deliveryOption.priceCents)} -`;
  
      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
      html += 
      `
        <div class="delivery-option js-delivery-option"
        data-product-id="${matchingProduct.id}"
        data-delivery-option-id="${deliveryOption.id}">
          <input type="radio"
            ${isChecked ? 'checked' : ''}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </div>
      `
    });
  
    return html;
  };
  
  document.querySelector('.js-order-summary').innerHTML = cartSummaryHtml;
  
  document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);
        renderPaymentSummary();
        renderOrderSummary();
        renderCheckoutHeader();
      });
    });
  
  document.querySelectorAll('.js-update-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const {productId} = link.dataset;
        const cartItemContainer = document.querySelector(`.js-cart-item-container-${productId}`);
        cartItemContainer.classList.add('is-updating');

        const quantityInputElement = document.querySelector(`.js-quantity-input-${productId}`);
        const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);

        quantityInputElement.value = quantityLabel.innerText; // Set the default value based on current quantity
        // Focus the input field after setting the value
        quantityInputElement.focus();
      });
    });
  
  document.querySelectorAll('.js-save-link')
    .forEach((link) => {
      const {productId} = link.dataset;
      const saveEvent = () => {
        const cartItemContainer = document.querySelector(`.js-cart-item-container-${productId}`);
        cartItemContainer.classList.remove('is-updating');
  
        const quantityInputElement = document.querySelector(`.js-quantity-input-${productId}`);
        const newQuantity = Number(quantityInputElement.value);
        if (newQuantity >= 0 && newQuantity < 1000) {
          updateItemQuantity(productId, newQuantity);
          renderOrderSummary();
          renderPaymentSummary();
          renderCheckoutHeader();
        }
        else 
          alert('Add quantity between 0 and 1000');
      };
  
      link.addEventListener('click', saveEvent);
  
      const quantityInputElement = document.querySelector(`.js-quantity-input-${productId}`);
      quantityInputElement.addEventListener('keydown', (event) => {
        if (event.key === 'Enter')
          saveEvent();
      });
    });
  
  document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      element.addEventListener('click', () => {
        const {productId, deliveryOptionId} = element.dataset;
        updateDeliveryOption(productId, deliveryOptionId);
        renderOrderSummary();
        renderPaymentSummary();
      });
    });
}

renderOrderSummary();