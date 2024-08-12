import React, { Component } from 'react';
import '../index.css';

class Orders extends Component {
  state = {
    buyOrders: [],
    sellOrders: [],
    completedOrders: [],
    quantity: '',
    price: '',
    type: 'buy', // Default type
  };

  async componentDidMount() {
    this.fetchOrders();
    this.interval = setInterval(this.fetchOrders, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  fetchOrders = async () => {
    const buyResponse = await fetch('http://localhost:5000/buy_pending_orders');
    const sellResponse = await fetch('http://localhost:5000/sell_pending_orders');
    const completedResponse = await fetch('http://localhost:5000/completed_orders');

    const buyOrders = await buyResponse.json();
    const sellOrders = await sellResponse.json();
    const completedOrders = await completedResponse.json();

    this.setState({ buyOrders, sellOrders, completedOrders });
  };

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleOrderSubmit = async () => {
    const { quantity, price, type } = this.state;
    if (!quantity || !price) return;

    await fetch(`http://localhost:5000/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity, price }),
    });

    this.setState({ quantity: '', price: '' });
    this.fetchOrders();
  };

  render() {
    const { buyOrders, sellOrders, completedOrders, quantity, price, type } = this.state;

    return (
      <div className="container">
        <header>
          <h1>Spot Trading Application</h1>
        </header>
        <div className="input-section">
          <input
            type="number"
            name="quantity"
            value={quantity}
            placeholder="Quantity"
            onChange={this.handleInputChange}
          />
          <input
            type="number"
            name="price"
            value={price}
            placeholder="Price"
            onChange={this.handleInputChange}
          />
          <button
            className="button buy"
            onClick={() => this.setState({ type: 'buy' }, this.handleOrderSubmit)}
          >
            Buy
          </button>
          <button
            className="button sell"
            onClick={() => this.setState({ type: 'sell' }, this.handleOrderSubmit)}
          >
            Sell
          </button>
        </div>
        <div className="tables">
          <div className="table-container">
            <h2>Pending Buy Orders</h2>
            <table>
              <thead>
                <tr>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {buyOrders.map(order => (
                  <tr key={order.id}>
                    <td>{order.quantity}</td>
                    <td>{order.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-container">
            <h2>Pending Sell Orders</h2>
            <table>
              <thead>
                <tr>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {sellOrders.map(order => (
                  <tr key={order.id}>
                    <td>{order.quantity}</td>
                    <td>{order.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="table-container">
          <h2>Completed Orders</h2>
          <table>
            <thead>
              <tr>
                <th>Quantity</th>
                <th>Price</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {completedOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.quantity}</td>
                  <td>{order.price}</td>
                  <td>{order.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Orders;
