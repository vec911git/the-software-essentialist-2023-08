import { Request, Response } from 'express';
import generator from 'generate-password-ts';
import { Prisma, PrismaClient } from '@prisma/client';
import { Database } from "../shared/persistence/database";

export class UserController {

  private dbConnection: PrismaClient; 

  constructor(private database: Database) {
    this.dbConnection = this.database.getConnection();
  }

  public createUser = async (req: Request, res: Response) => {
    try {
      this.validateUserData(req, res);
      const { email, userName, firstName, lastName } = req.body;
      const randomPassword = generator.generate({
        numbers: true,
        symbols: true,
        strict: true
      });

      const user = await this.dbConnection.user.create({
        data: { email, userName, firstName, lastName, password: randomPassword },
      });

      res.status(201).json({ data: { id: user.id, email, userName, firstName, lastName }, success: true });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public editUser = async (req: Request, res: Response) => {
    try {
      this.validateUserData(req, res);
      const userId = parseInt(req.params.userId);
      const { email, userName, firstName, lastName } = req.body;

      const user = await this.dbConnection.user.update({
        where: { id: userId },
        data: { email, userName, firstName, lastName },
      });

      res.json({ data: { id: userId, email, userName, firstName, lastName }, success: true });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getUserByEmail = async (req: Request, res: Response) => {
    try {
      const userEmail = req.query.email as string;

      const user = await this.dbConnection.user.findUnique({
        where: { email: userEmail },
      });

      if (user === null)
        return res.status(404).json({ data: "UserNotFound'", success: false });

      const { id, email, userName, firstName, lastName } = user;
      res.json({ data: { id, email, userName, firstName, lastName }, success: true });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  private validateUserData = (req: Request, res: Response) => {
    const { email, userName, firstName, lastName } = req.body;
      if (email === undefined || email.length === 0 || userName === undefined || userName.length === 0 || 
        firstName === undefined || firstName.length === 0 || lastName === undefined || lastName.length === 0)
        return res.status(400).json({ data: "ValidationError'", success: false });
  }

  private handleError = (error: any, res: Response) => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaError = error as Prisma.PrismaClientKnownRequestError;
      if (prismaError.code === 'P2002') {
        const errorTargets = prismaError.meta?.target as Array<String>;
        if (errorTargets[0] === 'userName')
          return res.status(409).json({ error: "UsernameAlreadyTaken", success: false });
        if (errorTargets[0] === 'email')
          return res.status(409).json({ error: "EmailAlreadyInUse", success: false });
      }
      if (prismaError.code === 'P2025') {
        return res.status(404).json({ data: "UserNotFound'", success: false });
      }
    }
    res.status(500).json({ error: error, success: false });
  }
}
