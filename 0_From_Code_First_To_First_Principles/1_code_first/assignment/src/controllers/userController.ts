import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client'
import { APIResponse } from '../models/responseModel'
import generator from 'generate-password-ts';

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
  try {
    validateUserData(req, res);
    const { email, userName, firstName, lastName } = req.body;
    const randomPassword = generator.generate({
      numbers: true,
      symbols: true,
      strict: true
    });

    const user = await prisma.user.create({
      data: { email, userName, firstName, lastName, password: randomPassword },
    });

    return res.status(201).json(new APIResponse({ data: { id: user.id, email, userName, firstName, lastName }, success: true }));
  } catch (error) {
    handleError(error, res);
  }
};

export const editUser = async (req: Request, res: Response) => {
  try {
    validateUserData(req, res);
    const userId = parseInt(req.params.userId);
    const { email, userName, firstName, lastName } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { email, userName, firstName, lastName },
    });

    return res.json(new APIResponse({ data: { id: userId, email, userName, firstName, lastName }, success: true }));
  } catch (error) {
    handleError(error, res);
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const userEmail = req.query.email as string;

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (user === null)
      return res.status(404).json(new APIResponse({ data: "UserNotFound'", success: false }));

    const { id, email, userName, firstName, lastName } = user;
    return res.json(new APIResponse({ data: { id, email, userName, firstName, lastName }, success: true }));
  } catch (error) {
    handleError(error, res);
  }
};

const validateUserData = (req: Request, res: Response) => {
  const { email, userName, firstName, lastName } = req.body;
    if (email === undefined || email.length === 0 || userName === undefined || userName.length === 0 || 
      firstName === undefined || firstName.length === 0 || lastName === undefined || lastName.length === 0)
      return res.status(400).json(new APIResponse({ data: "ValidationError'", success: false }));
}

const handleError = (error: any, res: Response) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaError = error as Prisma.PrismaClientKnownRequestError;
    if (prismaError.code === 'P2002') {
      const errorTargets = prismaError.meta?.target as Array<String>;
      if (errorTargets[0] === 'userName')
        return res.status(409).json(new APIResponse({ error: "UsernameAlreadyTaken", success: false }));
      if (errorTargets[0] === 'email')
        return res.status(409).json(new APIResponse({ error: "EmailAlreadyInUse", success: false }));
    }
    if (prismaError.code === 'P2025') {
      return res.status(404).json(new APIResponse({ data: "UserNotFound'", success: false }));
    }
  }
  return res.status(500).json(new APIResponse({ error: error, success: false }));
}
