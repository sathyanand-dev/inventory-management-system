import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Item = props => (
  <tr>
    <td>{props.item.itemName}</td>
    <td>{props.item.quantity}</td>
    <td>{props.item.price}</td>
    <td>{props.item.description}</td>
    <td>{props.item.category}</td>
    <td>
      <Link to={"/edit/"+props.item._id}>edit</Link> | <a href="#" onClick={() => { props.deleteItem(props.item._id) }}>delete</a>
    </td>
  </tr>
)

const ItemsList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/items/')
      .then(response => {
        setItems(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }, []);

  const deleteItem = (id) => {
    axios.delete('http://localhost:5000/items/'+id)
      .then(res => console.log(res.data));

    setItems(items.filter(el => el._id !== id));
  }

  const itemList = () => {
    return items.map(currentitem => {
      return <Item item={currentitem} deleteItem={deleteItem} key={currentitem._id}/>;
    })
  }

  return (
    <div>
      <h3>Inventory Items</h3>
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Description</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          { itemList() }
        </tbody>
      </table>
    </div>
  )
}

export default ItemsList;
