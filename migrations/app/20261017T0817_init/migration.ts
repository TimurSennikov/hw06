#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/fef6f13e9a3d8568e6022733eadb602b086e15f51dc80521cd089f07dfd1d0f1/contract';
import endContract from '../../snapshots/fef6f13e9a3d8568e6022733eadb602b086e15f51dc80521cd089f07dfd1d0f1/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'MovieSession',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('movieTitle', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('startsAt', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Seat',
        columns: [
          col('column', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('row', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'SeatMovie',
        columns: [
          col('booked', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('movieSessionId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('seatId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['seatId', 'movieSessionId'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Seat',
        constraint: 'Seat_row_column_key',
        columns: ['row', 'column'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'SeatMovie',
        index: 'SeatMovie_movieSessionId_idx_afa0b5c5',
        columns: ['movieSessionId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'SeatMovie',
        index: 'SeatMovie_seatId_idx_3076c3cd',
        columns: ['seatId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'SeatMovie',
        foreignKey: {
          name: 'SeatMovie_seatId_fkey',
          columns: ['seatId'],
          references: { schema: 'public', table: 'Seat', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'SeatMovie',
        foreignKey: {
          name: 'SeatMovie_movieSessionId_fkey',
          columns: ['movieSessionId'],
          references: { schema: 'public', table: 'MovieSession', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
