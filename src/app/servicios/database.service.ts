import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  databaseObj: SQLiteObject;
  tables ={
    categoria : "categoria",
    persona : "persona"
  }

  constructor(private sqlite: SQLite) { }

  async createDatabase(){
    await this.sqlite.create({
      name: "DB_Crud",
      location: "default",
    }).then((db: SQLiteObject) => {
      this.databaseObj = db;
    }).catch((e) => {
        alert("Error al crear la base de datos "+ JSON.stringify(e));
    });

    await this.createTables();
  }

  async createTables(){
    await this.databaseObj.executeSql(
      `CREATE TABLE IF NOT EXISTS ${this.tables.categoria} (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(200) NOT NULL UNIQUE)`,[]
    );

    await this.databaseObj.executeSql(
      `CREATE TABLE IF NOT EXISTS ${this.tables.persona} (id INTEGER PRIMARY KEY AUTOINCREMENT, categoria_id INTEGER UNSIGNED NOT NULL, name VARCHAR(255) NOT NULL`), []
  }

  async addCategoria(name: string){
    return this.databaseObj.executeSql(
      `INSERT INTO ${this.tables.categoria} (name) VALUES ('${name}')`,
      []
      ).then(() => {
        return "categoria creada"
      }).catch((e) => {
        if(e.code === 6){
          return "Categoria ya existe";
        }

        return "Error al crear categoria "+ JSON.stringify(e);
      });
  }

  async getCategoria(){
    return this.databaseObj.executeSql(
      `SELECT * FROM ${this.tables.categoria} ORDER BY name ASC`, []
    ).then((res) => {
      return res;
    }).catch((e) =>{
      return "Error al optener las categorias "+ JSON.stringify(e);
    });
  }

  async deleteCategoria(id: number){
    return this.databaseObj.executeSql(
      `DELETE FROM ${this.tables.categoria} WHERE id = ${id}`,[]
    ).then(()=>{
      return "Categoria eliminada";
    }).catch((e)=>{
      return "Error al eliminar categorias "+ JSON.stringify(e);
    });
  }

  async editCategoria(name: string, id: number){
    return this.databaseObj.executeSql(
      `UPDATE ${this.tables.categoria} SET name = '${name}' WHERE id = ${id}`,[]
    ).then(() => {
      return "Categoria actualizada";
    }).catch((e)=>{
      if(e.code === 6){
        return "Categoria ya existe";
      }

      return "Error al actualizar categoria "+ JSON.stringify(e);
    });
  }
}
