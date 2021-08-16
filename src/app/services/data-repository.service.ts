/* eslint-disable no-console */
import { Injectable } from '@angular/core';
import { Dayjs } from 'dayjs';
import * as dayjs from 'dayjs';
import { DatabaseService } from './database.service';
import { BehaviorSubject } from 'rxjs';

// region Interfaces for data model
export interface Bill {
  id: number;
  createdAt: Dayjs;
  lastUpdate: Dayjs;
  meta: any;
  name: string;
  description: string;
  currency: string;
  imageUri: string;
  geoCoordinates: GeoCoordinates;
  dateTime: Dayjs;
}

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
  altitude: number;
  accuracy: number;
}

export interface Counter {
  id: number;
  bill: number;
  createdAt: Dayjs;
  lastUpdate: Dayjs;
  meta: any;
  name: string;
  count: number;
  description: string;
  imageUri: string;
  price: number;
}

export interface WriteResult {
  rowsAffected: number;
  insertId: number;
}

// endregion

@Injectable({
  providedIn: 'root'
})
export class DataRepositoryService {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private static readonly TAG = 'DataRepositoryService';

  public constructor(private db: DatabaseService) {
  }

  // region Static methos for object conversion
  /**
   * Transforms an instance of any into another instance of any, being sure that this second contains every field
   * mentioned in the fieldList parameter
   *
   * @param mAny the input object
   * @param fieldList a list of the field names
   * @returns an object with all and only the fields in fiendList or null if mAny did not contain some of the necessary fields
   */
  private static any2FormattedObject(mAny: any, fieldList: string[]): any {
    const res: any = {};

    fieldList.forEach(fieldName => {
      if (!(fieldName in mAny)) {
        return null;
      }

      res[fieldName] = mAny[fieldName];
    });

    return res;
  }

  private static any2Bill(a: any): Bill {
    const res = DataRepositoryService.any2FormattedObject(
      a,
      ['id', 'createdAt', 'lastUpdate', 'meta', 'name', 'description', 'currency', 'imageUri', 'geoLocation', 'dateTime']
    );

    res.createdAt = this.safeParseDayjs(res.createdAt);
    res.lastUpdate = this.safeParseDayjs(res.lastUpdate);
    res.dateTime = this.safeParseDayjs(res.dateTime);
    res.meta = this.safeParseAny(res.meta);

    return res as Bill;
  }

  private static any2Counter(a: any): Counter {
    const res = DataRepositoryService.any2FormattedObject(
      a,
      ['id', 'bill', 'createdAt', 'lastUpdate', 'meta', 'name', 'count', 'description', 'imageUri', 'price']
    );

    res.createdAt = this.safeParseDayjs(res.createdAt);
    res.lastUpdate = this.safeParseDayjs(res.lastUpdate);
    res.count = this.safeParseInt(res.count);
    res.meta = this.safeParseAny(res.meta);

    return res as Counter;
  }

  private static safeParseInt(n: string): number {
    try {
      return Number.parseInt(n, 10);
    } catch (e) {
      console.warn(this.TAG, 'safeParseInt: error parsing integer, will fallback to 0\n', e);
      return 0;
    }
  }

  private static safeParseDayjs(n: string): Dayjs {
    try {
      return dayjs(n);
    } catch (e) {
      console.trace(this.TAG, 'safeParseDayjs: error parsing dayjs, will fallback to present day time\n', e);
      return dayjs();
    }
  }

  private static safeParseAny(n: string): any {
    try {
      return JSON.parse(n);
    } catch (e) {
      console.trace(this.TAG, 'error in safeParseAny', e);
      return {};
    }
  }

  // endregion

  public getDbState(): BehaviorSubject<boolean> {
    return this.db.dbReady;
  }

  // region Bill
  public async getAllBills(): Promise<Bill[]> {
    const elementName = 'Bill';
    const startTime = dayjs();

    try {
      const r = await this.db.getAllBills();
      if (r && r.rows.length > 0) {
        const res: Bill[] = [];

        for (let i = 0; i < r.rows.length; i++) {
          res.push(DataRepositoryService.any2Bill(r.rows.item(i)));
        }

        console.debug(DataRepositoryService.TAG, `${res.length} ${elementName}(s) retrieved from DB.`);
        return res;
      }

      console.debug(DataRepositoryService.TAG, `No ${elementName} found in DB.`);
      return null;
    } catch (e) {
      console.error(DataRepositoryService.TAG, `Error trying to get all ${elementName}s.`, e);
      return null;
    } finally {
      const endTime = dayjs();
      console.debug(`Elapsed time: ${endTime.diff(startTime, 'ms')} ms`);
    }
  }

  public async getBillForId(id: number): Promise<Bill> {
    const elementName = 'Bill';
    const startTime = dayjs();

    try {
      const r = await this.db.getBillForId(id);
      if (r && r.rows.length > 0) {
        const res: Bill = DataRepositoryService.any2Bill(r.rows.item(0));

        console.debug(DataRepositoryService.TAG, `1 ${elementName} retrieved from DB.`);
        return res;
      }

      console.debug(DataRepositoryService.TAG, `No ${elementName} found in DB.`);
      return null;
    } catch (e) {
      console.error(DataRepositoryService.TAG, `Error trying to get ${elementName}.`, e);
      return null;
    } finally {
      const endTime = dayjs();
      console.debug(`Elapsed time: ${endTime.diff(startTime, 'ms')} ms`);
    }
  }

  public async createBill(bill: Bill): Promise<WriteResult> {
    const elementName = 'Bill';
    const startTime = dayjs();

    try {
      const r = await this.db.insertBill(
        bill.name,
        bill.description,
        bill.imageUri,
        JSON.stringify(bill.geoCoordinates),
        bill.dateTime.format(),
        bill.currency ? bill.currency : '€',
        JSON.stringify(bill.meta));

      console.debug(`Success on ${elementName} insertion. Rows affected: ${r.rowsAffected}`);
      return {rowsAffected: r.rowsAffected, insertId: r.insertId};
    } catch (e) {
      console.error(`Error on ${elementName} insertion.`, e);
      return null;
    } finally {
      const endTime = dayjs();
      console.debug(`Elapsed time: ${endTime.diff(startTime, 'ms')} ms`);
    }
  }

  public async updateBill(bill: Bill): Promise<WriteResult> {
    const elementName = 'Bill';
    const startTime = dayjs();

    try {
      const r = await this.db.updateBill(
        bill.id,
        bill.name,
        bill.description,
        bill.imageUri,
        JSON.stringify(bill.geoCoordinates),
        bill.dateTime.format(),
        JSON.stringify(bill.meta)
      );

      console.debug(DataRepositoryService.TAG, `Success on ${elementName} update. Rows affected: ${r.rowsAffected}`);
      return {rowsAffected: r.rowsAffected, insertId: r.insertId};
    } catch (e) {
      console.error(DataRepositoryService.TAG, `Error on ${elementName} update.`, e);
      return null;
    } finally {
      const endTime = dayjs();
      console.debug(DataRepositoryService.TAG, `Elapsed time: ${endTime.diff(startTime, 'ms')} ms`);
    }
  }

  public async deleteBill(bill: Bill): Promise<WriteResult> {
    const elementName = 'Bill';
    const startTime = dayjs();

    try {
      const r = await this.db.deleteBill(bill.id);
      console.debug(DataRepositoryService.TAG, `Success on ${elementName} deletion. Rows affected: ${r.rowsAffected}`);
      return r.rowsAffected;
    } catch (e) {
      console.error(DataRepositoryService.TAG, `Error on ${elementName} deletion.`, e);
      return null;
    } finally {
      const endTime = dayjs();
      console.debug(DataRepositoryService.TAG, `Elapsed time: ${endTime.diff(startTime, 'ms')} ms`);
    }
  }

  // endregion

  // region Counter
  public async getCountersForBill(bill: Bill): Promise<Counter[]> {
    const elementName = 'Counter';
    const startTime = dayjs();

    try {
      const r = await this.db.getAllCountersForBillId(bill.id);
      if (r && r.rows.length > 0) {
        const res: Counter[] = [];

        for (let i = 0; i < r.rows.length; i++) {
          res.push(DataRepositoryService.any2Counter(r.rows.item(i)));
        }

        console.debug(DataRepositoryService.TAG, `${res.length} ${elementName}(s) retrieved from DB.`);
        return res;
      }

      console.debug(DataRepositoryService.TAG, `No ${elementName} found in DB.`);
      return null;
    } catch (e) {
      console.error(DataRepositoryService.TAG, `Error trying to get all ${elementName}s.`, e);
      return null;
    } finally {
      const endTime = dayjs();
      console.debug(`Elapsed time: ${endTime.diff(startTime, 'ms')} ms`);
    }
  }

  public async getCounterForId(id: number): Promise<Counter> {
    const elementName = 'Counter';
    const startTime = dayjs();

    try {
      const r = await this.db.getCounterForId(id);
      if (r && r.rows.length > 0) {
        const res: Counter = DataRepositoryService.any2Counter(r.rows.item(0));

        console.debug(DataRepositoryService.TAG, `1 ${elementName} retrieved from DB.`);
        return res;
      }

      console.debug(DataRepositoryService.TAG, `No ${elementName} found in DB.`);
      return null;
    } catch (e) {
      console.error(DataRepositoryService.TAG, `Error trying to get ${elementName}.`, e);
      return null;
    } finally {
      const endTime = dayjs();
      console.debug(`Elapsed time: ${endTime.diff(startTime, 'ms')} ms`);
    }
  }

  public async createCounter(counter: Counter): Promise<WriteResult> {
    const elementName = 'Counter';
    const startTime = dayjs();

    try {
      const r = await this.db.insertCounter(
        counter.bill,
        counter.name,
        counter.count,
        counter.description,
        counter.imageUri,
        counter.price,
        counter.meta
      );

      console.debug(`Success on ${elementName} insertion. Rows affected: ${r.rowsAffected}`);
      return {rowsAffected: r.rowsAffected, insertId: r.insertId};
    } catch (e) {
      console.error(`Error on ${elementName} insertion.`, e);
      return null;
    } finally {
      const endTime = dayjs();
      console.debug(`Elapsed time: ${endTime.diff(startTime, 'ms')} ms`);
    }
  }

  public async updateCounter(counter: Counter): Promise<WriteResult> {
    const elementName = 'Counter';
    const startTime = dayjs();

    try {
      const r = await this.db.updateCounter(
        counter.id,
        counter.bill,
        counter.name,
        counter.count,
        counter.description,
        counter.imageUri,
        counter.price,
        DataRepositoryService.safeParseAny(counter.meta)
      );

      console.debug(DataRepositoryService.TAG, `Success on ${elementName} update. Rows affected: ${r.rowsAffected}`);
      return {rowsAffected: r.rowsAffected, insertId: r.insertId};
    } catch (e) {
      console.error(DataRepositoryService.TAG, `Error on ${elementName} update.`, e);
      return null;
    } finally {
      const endTime = dayjs();
      console.debug(DataRepositoryService.TAG, `Elapsed time: ${endTime.diff(startTime, 'ms')} ms`);
    }
  }

  public async updateCountersCount(counterId: number, newCount: number): Promise<WriteResult> {
    const elementName = 'Counter';
    const startTime = dayjs();

    try {
      const r = await this.db.updateCountersCount(counterId, newCount);

      console.debug(DataRepositoryService.TAG, `Success on ${elementName} update. Rows affected: ${r.rowsAffected}`);
      return {rowsAffected: r.rowsAffected, insertId: r.insertId};
    } catch (e) {
      console.error(DataRepositoryService.TAG, `Error on ${elementName} update.`, e);
      return null;
    } finally {
      const endTime = dayjs();
      console.debug(DataRepositoryService.TAG, `Elapsed time: ${endTime.diff(startTime, 'ms')} ms`);
    }
  }

  public async deleteCounter(counter: Counter): Promise<WriteResult> {
    const elementName = 'Counter';
    const startTime = dayjs();

    try {
      const r = await this.db.deleteCounter(counter.id);
      console.debug(DataRepositoryService.TAG, `Success on ${elementName} deletion. Rows affected: ${r.rowsAffected}`);
      return r.rowsAffected;
    } catch (e) {
      console.error(DataRepositoryService.TAG, `Error on ${elementName} deletion.`, e);
      return null;
    } finally {
      const endTime = dayjs();
      console.debug(DataRepositoryService.TAG, `Elapsed time: ${endTime.diff(startTime, 'ms')} ms`);
    }
  }

  // endregion
}
