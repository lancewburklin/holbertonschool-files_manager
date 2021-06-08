import dbClient from '../utils/db';
import redisClient from '../utils/redis';

export default class AppController {
  static getStatus(req, res) {
    const answer = { redis: redisClient.isAlive(), db: dbClient.isAlive() };
    return res.status(200).send(answer);
  }

  static async getStats(req, res) {
    const answer = { users: await dbClient.nbUsers(), files: await dbClient.nbFiles() };
    return res.status(200).send(answer);
  }
}
