import {addToCart, cart, loadFromStorage} from '../data/cart.js';

describe('test suite: addToCart', () => {
  it('adds a new product to the cart', () => {            
    spyOn(localStorage, 'getItem').and.callFake(() => {   // here we made a dummy method for localStorage.getItem where
      return JSON.stringify([]);                          // it will return an empty list instead of 2 products in 
    });                                                   // the orginal method. (check **cart.js** file)
    spyOn(localStorage, 'setItem'); //dummy method which is not storing anything in the localStorage from cart
    
    loadFromStorage(); // it is needed bcz cart is already imported & loaded above & this spyOn code will have no effect on it therefore we are loading cart after we define the dummy method.
    
    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6')
    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(1);
    expect(cart[0].deliveryOptionId).toEqual('1');
  });

  it('add an existing product to the cart', () => {
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 1,
        deliveryOptionId: '1'
      }]);
    });
    
    spyOn(localStorage, 'setItem');

    loadFromStorage();

    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(2);
  })
})