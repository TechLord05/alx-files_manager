import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';
import fs from 'fs';
import path from 'path';

class FilesController {
  static async postUpload(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const key = `auth_${token}`;
    const userId = await redisClient.get(key);


    console.log('Token:', token);
    console.log('UserId from Redis:', userId);

    if (!userId) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const { name, type, parentId = 0, isPublic = false, data } = req.body;
    if (!name) {
      return res.status(400).send({ error: 'Missing name' });
    }
    if (!type || !['folder', 'file', 'image'].includes(type)) {
      return res.status(400).send({ error: 'Missing type' });
    }
    if (type !== 'folder' && !data) {
      return res.status(400).send({ error: 'Missing data' });
    }

    const parent = parentId === 0 ? null : await dbClient.db.collection('files').findOne({ _id: dbClient.ObjectId(parentId) });
    if (parentId !== 0 && !parent) {
      return res.status(400).send({ error: 'Parent not found' });
    }
    if (parent && parent.type !== 'folder') {
      return res.status(400).send({ error: 'Parent is not a folder' });
    }

    const fileDocument = {
      userId: dbClient.ObjectId(userId),
      name,
      type,
      isPublic,
      parentId: parentId === 0 ? 0 : dbClient.ObjectId(parentId),
      localPath: null,
    };

    if (type === 'folder') {
      await dbClient.db.collection('files').insertOne(fileDocument);
      return res.status(201).send(fileDocument);
    } else {
      const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      const localPath = path.join(folderPath, uuidv4());
      fs.writeFileSync(localPath, Buffer.from(data, 'base64'));

      fileDocument.localPath = localPath;
      await dbClient.db.collection('files').insertOne(fileDocument);
      return res.status(201).send(fileDocument);
    }
  }
}

export default FilesController;
