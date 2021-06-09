import dbClient from '../utils/db';

const crypto = require('crypto');

export default class UsersController {
  static async postNew(req, res) {
    const { email } = req.body;
    const { password } = req.body;
    if (email === undefined) {
      return res.status(400).send({ error: 'Missing email' });
    }
    if (password === undefined) {
      return res.status(400).send({ error: 'Missing password' });
    }
    const info = await dbClient.db.collection('users').find({ email }).toArray();
    if (info.length !== 0) {
      return res.status(400).send({ error: 'Already exist' });
    }
    let hasPass = crypto.createHash('sha1');
    hasPass = hasPass.update(password, 'utf-8').digest('hex');
    const newItem = await dbClient.db.collection('users').insertOne({ 'email': email, 'password': hasPass });
    return res.status(201).send({ id: newItem.ops[0]._id, email });
  }
}
