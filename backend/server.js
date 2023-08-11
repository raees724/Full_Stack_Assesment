const express = require('express')
const bodyParser = require('body-parser');
const app =express();
const cors = require('cors')
const PORT =3001;
app.use(cors());

const products=[
    {product_id:1,name:'Laptop',price:85000},
    {product_id:2,name:'Smartphone',price:16999},
    {product_id:3,name:'Headphone',price:1600},
    {product_id:4,name:'tablet',price:28000},
    {product_id:5,name:'Camera',price:156500}
]


const customers = [
    { product_id: 1, preference_id: 'p1' },
    { product_id: 2, preference_id: 'p1' },
    { product_id: 4, preference_id: 'p1' },
    { product_id: 2, preference_id: 'p2' },
    { product_id: 3, preference_id: 'p2' },
    { product_id: 1, preference_id: 'p3' },
    { product_id: 3, preference_id: 'p3' },
    { product_id: 5, preference_id: 'p3' },
    { product_id: 4, preference_id: 'p4' },
    { product_id: 2, preference_id: 'p4' },
    { product_id: 1, preference_id: 'p5' },
    { product_id: 3, preference_id: 'p5' },
    { product_id: 4, preference_id: 'p5' },
    { product_id: 5, preference_id: 'p5' }
];


const orders = [
  { customer_id: 'user1', preference: 'p1', date: '2023-04-15' },
  { customer_id: 'user2', preference: 'p3', date: '2023-04-16' },
  { customer_id: 'user2', preference: 'p4', date: '2023-05-17' },
  { customer_id: 'user4', preference: 'p2', date: '2023-05-17' },
  { customer_id: 'user1', preference: 'p2', date: '2023-06-01' },
  { customer_id: 'user5', preference: 'p2', date: '2023-06-04' },
  { customer_id: 'user4', preference: 'p4', date: '2023-06-06' },
  { customer_id: 'user3', preference: 'p3', date: '2023-06-06' },
  { customer_id: 'user2', preference: 'p5', date: '2023-06-08' },
  { customer_id: 'user5', preference: 'p5', date: '2023-06-11' },
  { customer_id: 'user5', preference: 'p3', date: '2023-06-11' },
  { customer_id: 'user3', preference: 'p1', date: '2023-06-15' }
];

app.use(bodyParser.json());

app.get('/api/products',(req,res)=>{
    res.json(products);
})

app.get('/api/customers',(req,res)=>{
    res.json(customers);
})

app.get('/api/orders',(req,res)=>{
    res.json(orders);
})

app.get('/api/most-popular-product', (req, res) => {
    const productCounts = {};
    customers.forEach((customer) => {
      if (!productCounts[customer.product_id]) {
        productCounts[customer.product_id] = 1;
      } else {
        productCounts[customer.product_id]++;
      }
    });
    const mostPopularProductId = Object.keys(productCounts).reduce((a, b) =>
      productCounts[a] > productCounts[b] ? a : b
    );
    const mostPopularProduct = products.find(
      (product) => product.product_id === parseInt(mostPopularProductId)
    );
    res.json(mostPopularProduct);
  });
  

  app.get('/api/customers-ordered-all-products', (req, res) => {
    const customersOrderedAllProducts = [];
  
    orders.forEach((order) => {
      const customer = customersOrderedAllProducts.find(
        (c) => c.customer_id === order.customer_id
      );
  
      if (customer) {
        customer.products.add(order.preference);
      } else {
        customersOrderedAllProducts.push({
          customer_id: order.customer_id,
          products: new Set([order.preference]),
        });
      }
    });
  
    const customersWithAllProducts = customersOrderedAllProducts.filter(
      (customer) => customer.products.size === products.length
    );
  
    res.json(customersWithAllProducts);
  });
  

  app.get('/api/customers-inexpensive-items', (req, res) => {
    const customersWithInexpensiveItems = [];
  
    orders.forEach((order) => {
      const product = products.find(
        (product) => product.product_id === parseInt(order.preference.substr(1))
      );
  
      if (product && product.name === 'Headphone') {
        const customer = customersWithInexpensiveItems.find(
          (c) => c.customer_id === order.customer_id
        );
        console.log("Order",order)
  
        if (customer) {
          customer.totalPrice += product.price;
        } else {
          customersWithInexpensiveItems.push({
            customer_id: order.customer_id,
            totalPrice: product.price,
          });
        }
      }
    });
  
    customersWithInexpensiveItems.filter(
      (customer) => customer.totalPrice < 200
    );
    console.log('Customers With Inexpensive Items:', customersWithInexpensiveItems);

  
    res.json(customersWithInexpensiveItems);
  });
  
   
app.listen(PORT,()=>{
    console.log(`Server is running on Port ${PORT}`)
})