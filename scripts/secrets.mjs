#!/usr/bin/env node

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { pipeline, Transform } from 'stream';
import meow from 'meow';

class AppendInitVect extends Transform {
  constructor(initVect, opts) {
    super(opts);
    this.initVect = initVect;
    this.appended = false;
  }

  _transform(chunk, encoding, cb) {
    if (!this.appended) {
      this.push(this.initVect);
      this.appended = true;
    }
    this.push(chunk);
    cb();
  }
}

function getCipherKey(password) {
  return crypto.createHash('sha256').update(password).digest();
}

function encrypt(fileName, inputDir, outputDir, password) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(inputDir, fileName);

    // Generate a secure, pseudo random initialization vector.
    const initVect = crypto.randomBytes(16);

    // Generate a cipher key from the password.
    const CIPHER_KEY = getCipherKey(password);
    const readStream = fs.createReadStream(filePath);
    const gzip = zlib.createGzip();
    const cipher = crypto.createCipheriv('aes256', CIPHER_KEY, initVect);
    const appendInitVect = new AppendInitVect(initVect);
    // Create a write stream with a different file extension.
    const writeStream = fs.createWriteStream(path.join(outputDir, fileName));

    pipeline(readStream, gzip, cipher, appendInitVect, writeStream, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function decrypt(fileName, inputDir, outputDir, password) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(inputDir, fileName);

    // First, get the initialization vector from the file.
    const readInitVect = fs.createReadStream(filePath, { end: 15 });

    let initVect;
    readInitVect.on('data', (chunk) => {
      initVect = chunk;
    });

    // Once we’ve got the initialization vector, we can decrypt the file.
    readInitVect.on('close', () => {
      const cipherKey = getCipherKey(password);
      const readStream = fs.createReadStream(filePath, { start: 16 });
      const decipher = crypto.createDecipheriv('aes256', cipherKey, initVect);
      const unzip = zlib.createUnzip();
      const writeStream = fs.createWriteStream(path.join(outputDir, fileName));

      pipeline(readStream, decipher, unzip, writeStream, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
}

async function main(flags) {
  if (flags.encrypt && flags.decrypt) {
    console.error('--encrypt and --decrypt flags cannot both be set');
    return process.exit(1);
  }

  if (!flags.encrypt && !flags.decrypt) {
    console.error('--encrypt or --decrypt flag must be set');
    return process.exit(1);
  }

  if (!flags.password) {
    console.error('No password provided');
    return process.exit(1);
  }

  const inputSubDir = flags.encrypt ? 'decrypted' : 'encrypted';
  const outputSubDir = flags.encrypt ? 'encrypted' : 'decrypted';
  const inputDirPath = path.join(process.cwd(), 'conf', 'secrets', inputSubDir);
  const outputDirPath = path.join(
    process.cwd(),
    'conf',
    'secrets',
    outputSubDir
  );
  const secrets = fs.readdirSync(inputDirPath);

  if (!secrets.length) {
    console.error(`No files found in directory ${inputDirPath}`);
    return process.exit(1);
  }

  try {
    fs.mkdirSync(outputDirPath);
  } catch {
    // eat it
  }

  const action = flags.encrypt ? encrypt : decrypt;

  const actions = secrets.map((secretFile) => {
    console.log(`${action.name}ing file ${secretFile}`);
    return action(secretFile, inputDirPath, outputDirPath, flags.password);
  });

  try {
    await Promise.all(actions);
    console.log(`Successfully ${action.name}ed ${secrets.length} file(s)`);
  } catch (e) {
    console.error(`Error ${action.name}ing ${secrets.length} file(s)`, e);
  }
}

const cli = meow(
  `
      Usage
        $ secrets
  
      Options
        --encrypt, -e    Encrypt secrets
        --decrypt, -d    Decrypt secrets
        --password, -p   Password for encrypting/decrypting
  
      Examples
        $ secrets --encrypt
  `,
  {
    flags: {
      encrypt: {
        type: 'boolean',
        alias: 'e',
      },
      decrypt: {
        type: 'boolean',
        alias: 'd',
      },
      password: {
        type: 'string',
        alias: 'p',
        default: process.env.STARTR_SECRETS_PASSWORD || '',
      },
    },
    importMeta: import.meta,
  }
);

main(cli.flags);
