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
