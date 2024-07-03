import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { auctionRouter } from '../src/routes/auctionRoutes.js';
import Auction from '../src/models/Auction.js';

const app = express();
app.use(bodyParser.json());
app.use(cookieParser()); // Usar cookie-parser
app.use('/api/auctions', auctionRouter);

let mongoServer;

beforeAll(async () => {
  mongoServer = await mongoose.connect('mongodb://127.0.0.1/BidAssistDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Auctions API', () => {
  it('should create a new auction', async () => {
    const response = await request(app)
      .post('/api/auctions')
      .set('Cookie', ['access_token=valid_token']) // Establecer la cookie
      .send({
        title: 'Test Auction',
        description: 'This is a test auction',
        product: {
          name: 'Test Product',
          images: ['image1.png', 'image2.png'],
        },
        initialPrice: 100,
        minimumBid: 10,
        category: 'Test Category',
        startDate: new Date(Date.now() + 60 * 60 * 1000),
        endDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
        ownerUser: new mongoose.Types.ObjectId(),
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
  }, 10000); // Aumentar el tiempo de espera a 10000 ms (10 segundos)

  it('should get all auctions', async () => {
    const response = await request(app)
      .get('/api/auctions')
      .set('Cookie', ['access_token=valid_token']); // Establecer la cookie

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  }, 10000); // Aumentar el tiempo de espera a 10000 ms (10 segundos)

  it('should get an auction by id', async () => {
    const newAuction = await request(app)
      .post('/api/auctions')
      .set('Cookie', ['access_token=valid_token']) // Establecer la cookie
      .send({
        title: 'Test Auction',
        description: 'This is a test auction',
        product: {
          name: 'Test Product',
          images: ['image1.png', 'image2.png'],
        },
        initialPrice: 100,
        minimumBid: 10,
        category: 'Test Category',
        startDate: new Date(Date.now() + 60 * 60 * 1000),
        endDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
        ownerUser: new mongoose.Types.ObjectId(),
      });

    const response = await request(app)
      .get(`/api/auctions/${newAuction.body._id}`)
      .set('Cookie', ['access_token=valid_token']); // Establecer la cookie

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', newAuction.body._id);
  }, 10000); // Aumentar el tiempo de espera a 10000 ms (10 segundos)

  it('should update an auction', async () => {
    const newAuction = await request(app)
      .post('/api/auctions')
      .set('Cookie', ['access_token=valid_token']) // Establecer la cookie
      .send({
        title: 'Test Auction',
        description: 'This is a test auction',
        product: {
          name: 'Test Product',
          images: ['image1.png', 'image2.png'],
        },
        initialPrice: 100,
        minimumBid: 10,
        category: 'Test Category',
        startDate: new Date(Date.now() + 60 * 60 * 1000),
        endDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
        ownerUser: new mongoose.Types.ObjectId(),
      });

    const response = await request(app)
      .put(`/api/auctions/${newAuction.body._id}`)
      .set('Cookie', ['access_token=valid_token']) // Establecer la cookie
      .send({ title: 'Updated Auction' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('title', 'Updated Auction');
  }, 10000); // Aumentar el tiempo de espera a 10000 ms (10 segundos)

  it('should delete an auction', async () => {
    const newAuction = await request(app)
      .post('/api/auctions')
      .set('Cookie', ['access_token=valid_token']) // Establecer la cookie
      .send({
        title: 'Test Auction',
        description: 'This is a test auction',
        product: {
          name: 'Test Product',
          images: ['image1.png', 'image2.png'],
        },
        initialPrice: 100,
        minimumBid: 10,
        category: 'Test Category',
        startDate: new Date(Date.now() + 60 * 60 * 1000),
        endDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
        ownerUser: new mongoose.Types.ObjectId(),
      });

    const response = await request(app)
      .delete(`/api/auctions/${newAuction.body._id}`)
      .set('Cookie', ['access_token=valid_token']); // Establecer la cookie

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Auction deleted');
  }, 10000); // Aumentar el tiempo de espera a 10000 ms (10 segundos)
});