
import { WebServer } from "../http/webServer";
import { Database } from "../persistence/database";
import { UserController } from "../../controllers/userController";

export class CompositionRoot {
  private database: Database;
  private webServer: WebServer;
  private userController: UserController;

  constructor () {
    this.database = this.createDatabase();
    this.userController = this.createUserController();
    this.webServer = this.createWebServer();
  }

  private createDatabase () {
    return new Database();
  }
  
  public getDatabase() {
    return this.database;
  }

  private createWebServer () {
    let userController = this.getUserController();
    return new WebServer(userController);
  }

  public getWebServer () {
    return this.webServer;
  }
  
  private createUserController () {
    let database = this.getDatabase();
    return new UserController(database);
  }

  private getUserController () {
    return this.userController;
  }
}