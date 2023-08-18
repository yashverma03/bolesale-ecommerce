import React, { useState } from 'react';
import { storage, fs } from '../config/config';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AddProducts = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);

  const [imageError, setImageError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [uploadError, setUploadError] = useState('');

  const types = ['image/jpg', 'image/jpeg', 'image/png', 'image/PNG'];

  const handleProductImg = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      if (selectedFile && types.includes(selectedFile.type)) {
        setImage(selectedFile);
        setImageError('');
      } else {
        setImage(null);
        setImageError('please select a valid image file type (png or jpg)');
      }
    } else {
      console.log('please select your file');
    }
  };

  const handleAddProducts = (e) => {
    e.preventDefault();

    const imageRef = ref(storage, `product-images/${image.name}`);

    uploadBytes(imageRef, image)
      .then(() => {
        getDownloadURL(imageRef)
          .then((url) => {
            addDoc(collection(fs, 'Products'), {
              title,
              description,
              category,
              price: Number(price),
              url
            })
              .then(() => {
                setSuccessMsg('Product added successfully');
                setTitle('');
                setDescription('');
                setCategory('');
                setPrice('');
                setImage(null);
                document.getElementById('file').value = '';
                setImageError('');
                setUploadError('');
                setTimeout(() => {
                  setSuccessMsg('');
                }, 3000);
              })
              .catch((error) => setUploadError(error.message));
          })
          .catch((error) => {
            console.error('Error getting download URL:', error);
          });
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
      });
  };

  return (
    <div className='container'>
      <br />
      <br />
      <h1>Add Products</h1>
      <hr></hr>

      {successMsg && (
        <>
          <div className='success-msg'>{successMsg}</div>
          <br />
        </>
      )}

      <form autoComplete='off' className='form-group' onSubmit={handleAddProducts}>
        <label>Product Title</label>
        <input type='text' className='form-control' onChange={(e) => setTitle(e.target.value)} value={title} required />
        <br />
        <label>Product Description</label>
        <input type='text' className='form-control' onChange={(e) => setDescription(e.target.value)} value={description} required />
        <br />
        <label>Product Price</label>
        <input type='number' className='form-control' onChange={(e) => setPrice(e.target.value)} value={price} required />
        <br />
        <label>Product Category</label>

        <select className='form-control' required value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value=''>Select Product Category</option>
          <option>Electronic Devices</option>
          <option>Mobile Accessories</option>
          <option>TV & Home Appliances</option>
          <option>Sports & outdoors</option>
          <option>Health & Beauty</option>
          <option>Home & Lifestyle</option>
          <option>Men's Fashion</option>
          <option>Watches, bags & Jewellery</option>
          <option>Groceries</option>
        </select>

        <br />
        <label>Upload Product Image</label>
        <input type='file' id='file' className='form-control' required onChange={handleProductImg} />

        {imageError && (
          <>
            <br />
            <div className='error-msg'>{imageError}</div>

          </>
        )}

        <br />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type='submit' className='btn btn-success btn-md'> SUBMIT </button>
        </div>
      </form>

      {uploadError && (
        <>
          <br />
          <div className='error-msg'>{uploadError}</div>
        </>
      )}

    </div>
  );
};

export default AddProducts;
