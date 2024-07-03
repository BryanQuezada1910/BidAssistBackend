import request from 'supertest';
import { app } from '../server.js';

describe('Tickets Endpoints', () => {

  beforeAll(() => {
    // Aquí puedes generar un token de acceso válido para las pruebas
  });

  it('should get all tickets', async () => {
    const response = await request(app)
      .get('/api/ticket')
      .set('Cookie', `access_token=${__ACCESS_TOKEN__}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should get a ticket by id', async () => {
    const response = await request(app)
      .get('/api/ticket/6684f1a11ba03c1d8f62b52b')
      .set('Cookie', `access_token=${__ACCESS_TOKEN__}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty('_id');
  });

  // it('should create a new ticket', async () => {
  //   const response = await request(app)
  //     .post('/api/ticket')
  //     .set('Cookie', `access_token=${__ACCESS_TOKEN__}`)
  //     .send({ title: "Sample Ticket for Tests", description: "This is a sample description  for Tests" });
  //   expect(response.statusCode).toEqual(201);
  //   expect(response.body).toHaveProperty('_id');
  // });

  // it('should update a ticket', async () => {
  //   const response = await request(app)
  //     .patch('/api/ticket/valid_ticket_id')
  //     .set('Cookie', `access_token=${__ACCESS_TOKEN__}`)
  //     .send({ title: 'Updated Ticket' });
  //   expect(response.statusCode).toEqual(200);
  //   expect(response.body).toHaveProperty('_id');
  // });

  // it('should delete a ticket', async () => {
  //   const response = await request(app)
  //     .delete('/api/ticket/valid_ticket_id')
  //     .set('Cookie', `access_token=${__ACCESS_TOKEN__}`);
  //   expect(response.statusCode).toEqual(200);
  //   expect(response.body).toHaveProperty('message', 'Deleted Ticket');
  // });
});
