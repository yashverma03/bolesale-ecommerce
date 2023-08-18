import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Products from './Products';
import { auth, fs } from '../config/config';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDocs, onSnapshot, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const GetUserUid = () => {
    const [uid, setUid] = useState(null);

    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUid(user.uid);
        }
      });
    }, []);

    return uid;
  };

  const uid = GetUserUid();

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

  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      const productsQuerySnapshot = await getDocs(collection(fs, 'Products'));

      const productsArray = productsQuerySnapshot.docs.map(doc => ({
        ...doc.data(),
        ID: doc.id
      }));

      setProducts(productsArray);
      // console.log(products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

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

  let Product;

  const addToCart = (product) => {
    if (uid !== null) {
      // console.log(product);
      Product = product;
      Product['qty'] = 1;
      Product['TotalProductPrice'] = Product.qty * Product.price;
      setDoc(doc(fs, `Cart ${uid}`, product.ID), Product).then(() => {
        console.log('Successfully added to cart');
      });
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <Navbar user={user} totalProducts={totalProducts} />
      <br />
      {products.length > 0 && (
        <div className='container-fluid'>
          <h1 className='text-center'> Products </h1>
          <div className='products-box'>
            <Products products={products} addToCart={addToCart} />
          </div>
        </div>
      )}

      {products.length < 1 && (
        <div className='container-fluid'> Please wait ... </div>
      )}
    </>
  );
};

export default Home;
