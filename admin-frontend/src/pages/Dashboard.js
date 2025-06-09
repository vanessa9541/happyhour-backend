// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import socket from '../socket';

function Dashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    socket.on('newOrder', (order) => {
      setOrders((prevOrders) => [order, ...prevOrders]);
    });

    return () => {
      socket.off('newOrder');
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Interface Admin - RestoApp</h1>
      <h2>Commandes reçues :</h2>
      {orders.length === 0 ? (
        <p>Aucune commande pour le moment.</p>
      ) : (
        orders.map((order, index) => (
          <div key={index} style={{ marginBottom: 20, border: '1px solid gray', padding: 10 }}>
            <p><strong>Client :</strong> {order.clientName}</p>
            <p><strong>Téléphone :</strong> {order.phone}</p>
            <p><strong>Adresse :</strong> {order.address}</p>
            <p><strong>Note :</strong> {order.note}</p>
            <p><strong>Articles :</strong></p>
            <ul>
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} - {item.quantity} x {item.price} FCFA
                </li>
              ))}
            </ul>
            <p><strong>Total :</strong> {order.totalPrice} FCFA</p>
            <p><strong>Date :</strong> {new Date (order.createdAt).toLocaleDateString()} </p>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard; 