const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

const ObjectId = mongodb.ObjectId

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart; // {item: []}
    this._id = id
  }
  save() {
    const db = getDb();
    return db.collection('users').insertOne(this)
    .then(result => {
      console.log('user saved', result);
    })
    .catch(err => console.log(err));
  }

  addToCart(product) {
    const cartProductIndex =  this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    let updatedCartItems = [...this.cart.items];
    if(cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    }
    else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity
      });
    }
    const updatedCart = updatedCartItems;
    const db = getDb();
    return db.collection('users').updateOne(
      {_id: new ObjectId(this._id)},
      {$set: {cart: {items: updatedCart}}}
    );
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map(i => {
      return i.productId;
    })
    return db.collection('products').find({ _id: { $in:  productIds }}).toArray()
    .then(products => {
      return products.map(p => {
        return  {...p, quantity: this.cart.items.find(i => {
          return i.productId.toString() === p._id.toString();
          }).quantity
        };
      })
    })
    .catch(err => console.log(err));
    
  }

  deleteItemFromCart(prodId) {
    const updatedCartItems = this.cart.items.filter(i => {
      return i.productId.toString() !== prodId.toString(); 
    });

    const db = getDb();
    return db.collection('users').updateOne(
      {_id: new ObjectId(this._id)},
      {$set: {cart: {items: updatedCartItems}}}
    );
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
    .then(products => {
      const order = {
        items: products,
        users: {
          _id: new ObjectId(this._id),
          name: this.name
        }
      };  
      return db.collection('orders').insertOne(order)
    })
    .then(result => {
      this.cart = {items: []};
      return db.collection('users').updateOne(
        {_id: new ObjectId(this._id)},
        {$set: {cart: {items: []}}}
      );
    })
    .catch(err => console.log(err));
  }

  getOrders() {
    const db = getDb();      
    // console.log('users', new ObjectId(this._id))
    return db.collection('orders').find({'users._id': new ObjectId(this._id)}).toArray()
    // .then(result => {
    //   console.log('result', result);
    // })
    // .catch(err => console.log(err));
    // console.log('orders', x);
    // return x;
  }

  static findById(userId) {
    const db = getDb();
    return db.collection('users').
    findOne({ _id: new ObjectId(userId) })
      .then(user => {
        console.log('user saved', user);
        return user;
      })
      .catch(err => console.log(err));
  }
}
module.exports = User;
