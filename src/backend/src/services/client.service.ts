import { Pool } from 'pg';
import { IClient, ICreateClientDTO, IUpdateClientDTO, IClientFilters } from '../types/client.types';

export class ClientService {
  constructor(private pool: Pool) {}

  async getClients(filters?: IClientFilters): Promise<{ data: IClient[]; total: number }> {
    let query = 'SELECT * FROM clients WHERE 1=1';
    const params: any[] = [];

    if (filters?.search) {
      query += ` AND (first_name ILIKE $${params.length + 1} OR last_name ILIKE $${params.length + 1} OR email ILIKE $${params.length + 1})`;
      params.push(`%${filters.search}%`);
    }

    if (filters?.language) {
      query += ` AND language = $${params.length + 1}`;
      params.push(filters.language);
    }

    if (filters?.type) {
      query += ` AND type = $${params.length + 1}`;
      params.push(filters.type);
    }

    const countResult = await this.pool.query(`SELECT COUNT(*) as count FROM (${query}) as filtered`, params);
    const total = parseInt(countResult.rows[0].count, 10);

    query += ` ORDER BY created_at DESC`;

    if (filters?.limit) {
      query += ` LIMIT $${params.length + 1}`;
      params.push(filters.limit);
    }

    if (filters?.offset) {
      query += ` OFFSET $${params.length + 1}`;
      params.push(filters.offset);
    }

    const result = await this.pool.query(query, params);
    return { data: result.rows as IClient[], total };
  }

  async getClientById(id: string): Promise<IClient | null> {
    const result = await this.pool.query('SELECT * FROM clients WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async createClient(dto: ICreateClientDTO): Promise<IClient> {
    const id = Math.random().toString(36).substr(2, 9);
    const result = await this.pool.query(
      'INSERT INTO clients (id, first_name, last_name, email, phone, language, type) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [id, dto.firstName, dto.lastName, dto.email, dto.phone, dto.language, dto.type]
    );
    return result.rows[0];
  }

  async updateClient(id: string, dto: IUpdateClientDTO): Promise<IClient | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (dto.firstName) {
      fields.push(`first_name = $${paramCount}`);
      values.push(dto.firstName);
      paramCount++;
    }

    if (dto.lastName) {
      fields.push(`last_name = $${paramCount}`);
      values.push(dto.lastName);
      paramCount++;
    }

    if (dto.email) {
      fields.push(`email = $${paramCount}`);
      values.push(dto.email);
      paramCount++;
    }

    if (dto.phone) {
      fields.push(`phone = $${paramCount}`);
      values.push(dto.phone);
      paramCount++;
    }

    if (dto.language) {
      fields.push(`language = $${paramCount}`);
      values.push(dto.language);
      paramCount++;
    }

    if (dto.type) {
      fields.push(`type = $${paramCount}`);
      values.push(dto.type);
      paramCount++;
    }

    if (fields.length === 0) return this.getClientById(id);

    values.push(id);
    const query = `UPDATE clients SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${paramCount} RETURNING *`;

    const result = await this.pool.query(query, values);
    return result.rows[0] || null;
  }

  async deleteClient(id: string): Promise<boolean> {
    const result = await this.pool.query('DELETE FROM clients WHERE id = $1', [id]);
    return result.rowCount! > 0;
  }

  async mergeClients(primaryId: string, secondaryId: string): Promise<boolean> {
    const client = await this.getConnection();
    try {
      await client.query('BEGIN');
      await client.query('UPDATE vehicles SET client_id = $1 WHERE client_id = $2', [primaryId, secondaryId]);
      await client.query('UPDATE repair_orders SET client_id = $1 WHERE client_id = $2', [primaryId, secondaryId]);
      await client.query('DELETE FROM clients WHERE id = $1', [secondaryId]);
      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  }

  private getConnection() {
    return this.pool.connect();
  }
}