import dbClient from '../utils/db';
import redisClient from '../utils/redis';

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
    const newItem = await dbClient.db.collection('users').insertOne({ email, password: hasPass });
    return res.status(201).send({ id: newItem.ops[0]._id, email });
  }

  static async getMe(req, res) {
    const toke = req.headers['x-token'];
    const email = await redisClient.get(toke);
    if (email === null) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    const user = await dbClient.db.collection('users').find({ email }).toArray();
    const answer = { id: user[0]._id, email: user[0].email };
    return res.status(200).send(answer);
  }
}
