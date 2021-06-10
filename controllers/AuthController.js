import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const crypto = require('crypto');

export default class AuthController {
  static async getConnect(req, res) {
    let codeT = req.headers.authorization.split(' ')[1];
    const hash = crypto.createHash('sha1');
    codeT = Buffer.from(codeT, 'base64').toString().split(':');
    const email = codeT[0];
    let password = codeT[1];
    password = hash.update(password, 'utf8').digest('hex');
    const person = await dbClient.db.collection('users').find({ email, password }).toArray();
    if (person.length === 0) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    const toke = uuidv4();
    const retToken = { token: toke };
    await redisClient.set(`auth_${toke}`, email, 86400);
    return res.status(200).send(retToken);
  }

  static async getDisconnect(req, res) {
    const toke = req.headers['x-token'];
    const exst = await redisClient.get(`auth_${toke}`);
    if (exst === null) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    await redisClient.del(`auth_${toke}`);
    return res.status(204).send();
  }
}
