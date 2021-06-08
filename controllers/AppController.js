import dbClient from '../utils/db';
import redisClient from '../utils/redis';

export default class AppController {
  static getStatus(req, res) {
    const answer = { redis: redisClient.isAlive(), db: dbClient.isAlive() };
    return res.status(200).send(answer);
  }

  static getStats(req, res) {
    const answer = { users: dbClient.nbUsers(), files: dbClient.nbFiles() };
    return res.status(200).send(answer);
  }
}
