import request from 'supertest';
import { app } from '../server.js';

let createdTicket = {};
let ticketForAdminUser = {} // ticket para los test del admin user ya que el no puede crear tickets
describe('Tickets Endpoints', () => {

  describe("For an suscrisbed user", () => {

    it('should create a new ticket', async () => {
      const response = await request(app)
        .post('/api/ticket')
        .set('Cookie', `access_token=${__SUSCRIBED_USER_TOKEN__}`)
        .send({ title: "Sample Ticket for Tests", description: "This is a sample description  for Tests" });
      expect(response.statusCode).toEqual(201);

      createdTicket = { ...response.body }
    });

    it('should get all tickets', async () => {
      const response = await request(app)
        .get('/api/ticket')
        .set('Cookie', `access_token=${__SUSCRIBED_USER_TOKEN__}`);
      expect(response.statusCode).toEqual(200);

    });

    it('should get a ticket by id', async () => {
      const response = await request(app)
        .get(`/api/ticket/${createdTicket._id}`)
        .set('Cookie', `access_token=${__SUSCRIBED_USER_TOKEN__}`);
      expect(response.statusCode).toEqual(200);
    });

    it('should update a ticket', async () => {
      const response = await request(app)
        .patch(`/api/ticket/${createdTicket._id}`)
        .set('Cookie', `access_token=${__SUSCRIBED_USER_TOKEN__}`)
        .send({ title: "Sample Ticket for Tests v2" });
      expect(response.statusCode).toEqual(200);
    });

    it('should delete a ticket', async () => {
      const response = await request(app)
        .delete(`/api/ticket/${createdTicket._id}`)
        .set('Cookie', `access_token=${__SUSCRIBED_USER_TOKEN__}`);
      expect(response.statusCode).toEqual(200);
    });
  })


  describe("For a non-subscribed user", () => {

    it('should create a new ticket', async () => {
      const response = await request(app)
        .post('/api/ticket')
        .set('Cookie', `access_token=${__NON_SUSCRIBED_USER_TOKEN__}`)
        .send({ title: "Sample Ticket for Tests", description: "This is a sample description  for Tests" });
      expect(response.statusCode).toEqual(201);

      createdTicket = { ...response.body }
    });

    it('should get all tickets', async () => {
      const response = await request(app)
        .get('/api/ticket')
        .set('Cookie', `access_token=${__NON_SUSCRIBED_USER_TOKEN__}`);
      expect(response.statusCode).toEqual(200);
    });


    it('should get a ticket by id', async () => {
      const response = await request(app)
        .get(`/api/ticket/${createdTicket._id}`)
        .set('Cookie', `access_token=${__NON_SUSCRIBED_USER_TOKEN__}`);
      expect(response.statusCode).toEqual(200);
    });

    it('should update a ticket', async () => {
      const response = await request(app)
        .patch(`/api/ticket/${createdTicket._id}`)
        .set('Cookie', `access_token=${__NON_SUSCRIBED_USER_TOKEN__}`)
        .send({ title: "Sample Ticket for Tests updated" });
      expect(response.statusCode).toEqual(200);
    });

    it('should delete a ticket', async () => {
      const response = await request(app)
        .delete(`/api/ticket/${createdTicket._id}`)
        .set('Cookie', `access_token=${__NON_SUSCRIBED_USER_TOKEN__}`);
      expect(response.statusCode).toEqual(200);
    });
  })


  describe("For an admin user", () => {

    it.failing('should not create a new ticket', async () => {
      ticketForAdminUser = await request(app)
        .post('/api/ticket')
        .set('Cookie', `access_token=${__SUSCRIBED_USER_TOKEN__}`)
        .send({ title: "Sample Ticket for Tests", description: "This is a sample description  for Tests" })
      const response = await request(app)
        .post('/api/ticket')
        .set('Cookie', `access_token=${__ADMIN_USER_TOKEN__}`)
        .send({ title: "Sample Ticket for Tests", description: "This is a sample description  for Tests" });
      expect(response.statusCode).toEqual(200);

    });

    it('should get all tickets', async () => {
      const response = await request(app)
        .get('/api/ticket')
        .set('Cookie', `access_token=${__ADMIN_USER_TOKEN__}`);
      expect(response.statusCode).toEqual(200);
    });


    it('should get a ticket by id', async () => {
      const response = await request(app)
        .get(`/api/ticket/${ticketForAdminUser.body._id}`)
        .set('Cookie', `access_token=${__ADMIN_USER_TOKEN__}`);
      expect(response.statusCode).toEqual(200);
    });

    it('should update a ticket', async () => {
      const response = await request(app)
        .patch(`/api/ticket/${ticketForAdminUser.body._id}`)
        .set('Cookie', `access_token=${__ADMIN_USER_TOKEN__}`)
        .send({ title: "Sample Ticket for Tests updated" });
      expect(response.statusCode).toEqual(200);
    });

    it('should delete a ticket', async () => {
      const response = await request(app)
        .delete(`/api/ticket/${ticketForAdminUser.body._id}`)
        .set('Cookie', `access_token=${__ADMIN_USER_TOKEN__}`);
      expect(response.statusCode).toEqual(200);


    });
  })
});
