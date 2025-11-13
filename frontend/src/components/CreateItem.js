import React, { useState } from 'react';
import axios from 'axios';

const CreateItem = () => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();

    const item = {
      itemName,
      quantity,
      price,
      description,
      category
    }

    console.log(item);

    axios.post('http://localhost:5000/items/add', item)
      .then(res => console.log(res.data));

    window.location = '/';
  }

  return (
    <div>
      <h3>Create New Item</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group"> 
          <label>Item Name: </label>
          <input  type="text"
              required
              className="form-control"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              />
        </div>
        <div className="form-group">
          <label>Quantity: </label>
          <input 
              type="text" 
              className="form-control"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              />
        </div>
        <div className="form-group">
          <label>Price: </label>
          <input 
              type="text" 
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              />
        </div>
        <div className="form-group">
          <label>Description: </label>
          <input 
              type="text" 
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              />
        </div>
        <div className="form-group">
          <label>Category: </label>
          <input 
              type="text" 
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              />
        </div>

        <div className="form-group">
          <input type="submit" value="Create Item" className="btn btn-primary" />
        </div>
      </form>
    </div>
  )
}

export default CreateItem;
