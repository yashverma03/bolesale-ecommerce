import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, fs } from '../config/config';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import CartProducts from './CartProducts';
import StripeCheckout from 'react-stripe-checkout';

const Cart = () => {
  const GetCurrentUser = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user.email);
        } else {
          setUser(null);
        }
      });
    }, []);

    return user;
  };

  const user = GetCurrentUser();

  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        onSnapshot(collection(fs, `Cart ${user.uid}`), (snapshot) => {
          const newCartProduct = snapshot.docs.map((doc) => ({
            ID: doc.id,
            ...doc.data()
          }));

          setCartProducts(newCartProduct);
        });
      } else {
        console.log('User is not signed in to retrieve cart');
      }
    });
  }, []);

  // console.log(cartProducts);

  const qty = cartProducts.map((cartProduct) => {
    return cartProduct.qty;
  });

  const reducerOfQty = (accumulator, currentValue) => accumulator + currentValue;

  const totalQty = qty.reduce(reducerOfQty, 0);

  // console.log(totalQty);

  const price = cartProducts.map((cartProduct) => {
    return cartProduct.TotalProductPrice;
  });

  const reducerOfPrice = (accumulator, currentValue) => accumulator + currentValue;

  const totalPrice = price.reduce(reducerOfPrice, 0);

  let Product;

  const cartProductIncrease = (cartProduct) => {
    // console.log(cartProduct);
    Product = cartProduct;
    Product.qty = Product.qty + 1;
    Product.TotalProductPrice = Product.qty * Product.price;

    onAuthStateChanged(auth, (user) => {
      if (user) {
        updateDoc(doc(fs, `Cart ${user.uid}`, cartProduct.ID), Product)
          .then(() => {
            console.log('increment added');
          });
      } else {
        console.log('User is not logged in');
      }
    });
  };

  const cartProductDecrease = (cartProduct) => {
    // console.log(cartProduct);
    Product = cartProduct;

    if (Product.qty > 1) {
      Product.qty = Product.qty - 1;
      Product.TotalProductPrice = Product.qty * Product.price;

      onAuthStateChanged(auth, (user) => {
        if (user) {
          updateDoc(doc(fs, `Cart ${user.uid}`, cartProduct.ID), Product)
            .then(() => {
              console.log('decremented');
            });
        } else {
          console.log('User is not logged in');
        }
      });
    }
  };

  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        onSnapshot(collection(fs, `Cart ${user.uid}`), (snapshot) => {
          const qty = snapshot.docs.length;
          setTotalProducts(qty);
        });
      }
    });
  }, []);

  return (
    <>
      <Navbar user={user} totalProducts={totalProducts} />
      <br />

      {cartProducts.length > 0 && (
        <div className='container-fluid'>
          <h1 className='text-center'> Cart </h1>

          <div className='products-box'>
            <CartProducts
              cartProducts={cartProducts}
              cartProductIncrease={cartProductIncrease}
              cartProductDecrease={cartProductDecrease}
            />
          </div>

          <div className='summary-box'>
            <h5> Cart Summary </h5>
            <br />
            <div> Total No of Products: <span> {totalQty} </span> </div>
            <div> Total Price to Pay: <span>$ {totalPrice} </span> </div>
            <br />

            {/* Stripe payment method to be implemented */}
            <StripeCheckout />
          </div>
        </div>
      )}

      {cartProducts.length < 1 && (
        <div className='container-fluid'> No products to show </div>
      )}
    </>
  );
};

export default Cart;
