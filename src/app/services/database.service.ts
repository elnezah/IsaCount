import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import * as dayjs from 'dayjs';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private static readonly TAG = 'DatabaseService';

  public dbReady = new BehaviorSubject(false);

  private db: SQLiteObject;

  public constructor(private http: HttpClient,
                     private platform: Platform,
                     private sqlite: SQLite) {
    this.platform.ready().then(async () => {
      this.db = await this.sqlite.create({
        name: 'data.db',
        location: 'default'
      });

      await this.initDatabase();
    });
  }

  // region Bills
  public async getAllBills(): Promise<any> {
    const query = 'SELECT * FROM bill';

    return this.db.executeSql(query);
  }

  public async getBillForId(id: number): Promise<any> {
    const query = 'SELECT * FROM bill WHERE id=?';
    const params = [id];

    return this.db.executeSql(query, params);
  }

  public async insertBill(name: string, description: string, imageUri: string, geoLocation: string,
                          dateTime: string, currency: string = '€', meta?: string): Promise<any> {
    const query = 'INSERT INTO bill ' +
      '(name, description, currency, imageUri, geoLocation, dateTime, meta, createdAt, lastUpdate) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const createdAt = dayjs().format();
    const lastUpdate = dayjs().format();
    const values = [name, description, currency, imageUri, geoLocation, dateTime, meta, createdAt, lastUpdate];

    return this.db.executeSql(query, values);
  }

  public async updateBill(id: number, name: string, description: string, imageUri: string, geoLocation: string,
                          dateTime: string, meta: string): Promise<any> {
    const query = 'UPDATE bill ' +
      'SET name=? ,description=? ,imageUri=? ,geoLocation=? ,dateTime=? ,meta=?, lastUpdate=? ' +
      'WHERE id=?';
    const lastUpdate = dayjs().format();
    const values = [name, description, imageUri, geoLocation, dateTime, meta, lastUpdate, id];

    return this.db.executeSql(query, values);
  }

  public async deleteBill(id: number): Promise<any> {
    const query = 'DELETE FROM bill WHERE id=?';
    const values = [id];

    return this.db.executeSql(query, values);
  }

  // endregion

  // region Counts
  public async getAllCountersForBillId(billId: number): Promise<any> {
    const query = 'SELECT * FROM counter WHERE bill=?';
    const values = [billId];

    return this.db.executeSql(query, values);
  }

  public async getCounterForId(id: number): Promise<any> {
    const query = 'SELECT * FROM counter WHERE id=?';
    const values = [id];

    return this.db.executeSql(query, values);
  }

  public async insertCounter(bill: number, name: string, count: number, description: string,
                             imageUri: string, price: number, meta: string): Promise<any> {
    const query = 'INSERT INTO counter ' +
      '(bill, name, count, description, imageUri, price, meta) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [bill, name, count, description, imageUri, price, meta];

    return this.db.executeSql(query, values);
  }

  public async updateCounter(id: number, bill: number, name: string, count: number, description: string,
                             imageUri: string, price: number, meta: string): Promise<any> {
    const query = 'UPDATE counter ' +
      'SET bill=?, name=?, count=?, description=?, imageUri=?, price=?, meta=? ' +
      'WHERE id=?';
    const values = [bill, name, count, description, imageUri, price, meta, id];

    return this.db.executeSql(query, values);
  }

  public async updateCountersCount(counterId: number, newCount: number): Promise<any> {
    const query = 'UPDATE counter SET count=? WHERE id=?';
    const values = [newCount, counterId];

    return this.db.executeSql(query, values);
  }

  public async deleteCounter(id: number): Promise<any> {
    const query = 'DELETE FROM counter WHERE id=?';
    const values = [id];

    return this.db.executeSql(query, values);
  }

  // endregion

  private async initDatabase(): Promise<void> {
    const sqlScript = await this.http.get('assets/init.sql', {responseType: 'text'}).toPromise();
    const queries = sqlScript.split(';').map(q => q.trim());
    for(const query of queries) {
      console.log(DatabaseService.TAG, 'initDatabase before', {query});
      await this.db.executeSql(query, []);
      console.log(DatabaseService.TAG, 'initDatabase executeSql', query);
    }
    this.dbReady.next(true);
  }
}
