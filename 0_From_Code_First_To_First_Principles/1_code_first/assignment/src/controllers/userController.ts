import { Request, Response } from 'express';
import { Prisma } from '@prisma/client'
import { PrismaClient } from '../../generated/prisma-client';
import { APIResponse } from '../models/responseModel'
import generator from 'generate-password-ts';

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, userName, firstName, lastName } = req.body;
    if (email === undefined || email.length === 0 || userName === undefined || userName.length === 0 || 
      firstName === undefined || firstName.length === 0 || lastName === undefined || lastName.length === 0)
      console.log(`lastname = ${lastName}`);
      res.status(400).json(new APIResponse({ data: "ValidationError'", success: false }));

    const randomPassword = generator.generate({
      numbers: true,
      symbols: true,
      strict: true
    });

    const user = await prisma.user.create({
      data: { email, userName, firstName, lastName, password: randomPassword },
    });

    res.status(201).json(new APIResponse({ data: JSON.stringify(user), success: true }));
  } catch (error) {
    /* if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (error.code === 'P2002') {
        console.log(
          'There is a unique constraint violation, a new user cannot be created with this email'
        )
      }
    } */
    res.status(500).json(new APIResponse({ error: JSON.stringify(error), success: false }));
  }
};

export const editUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const { email, userName, firstName, lastName } = req.body;
    if (email === null || email.length === 0 || userName === null || userName.length === 0 || 
      firstName === null || firstName.length === 0 || lastName === null || lastName.length === 0)
      res.status(400).json(new APIResponse({ data: "ValidationError'", success: false }));

    const user = await prisma.user.update({
      where: { id: userId },
      data: { email, userName, firstName, lastName },
    });

    res.json(new APIResponse({ data: JSON.stringify(user), success: true }));
  } catch (error) {
    res.status(500).json(new APIResponse({ error: JSON.stringify(error), success: false }));
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const email = req.query.email as string;
    if (email === null || email.length === 0)
      res.status(400).json(new APIResponse({ data: "ValidationError'", success: false }));

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user === null)
      res.status(404).json(new APIResponse({ data: "UserNotFound'", success: false }));
    res.json(new APIResponse({ data: JSON.stringify(user), success: true }));
  } catch (error) {
    res.status(500).json(new APIResponse({ error: JSON.stringify(error), success: false }));
  }
};
