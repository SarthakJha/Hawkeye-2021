import Region from '../models/Region';
import { NextFunction, Request, Response } from 'express';
import ErrorResponse from '../utils/ErrorResponse';
import { UserDoc } from '../models/User';
import Question, { QuestionDoc } from '../models/Question';

import { compareAnswers, unlockRegion } from '../utils/helperFunctions';

const costs = {
  regionMult: 500,
  questionSkip: 400,
  strike: 300,
  fiftyfifty: 200,
};

const skipQuestion = async (
  req: Request,
  user: UserDoc,
  question: QuestionDoc
) => {
  for (let i = 0; i <= user?.lastUnlockedIndex; i++) {
    if (user.regions[i].regionid.toString() == question.region.toString()) {
      if (
        user.regions[i].level.toString() == process.env.MAX_LEVEL?.toString()
      ) {
        user.regions[i].isCompleted = true;
        await user.save();
        unlockRegion(req);
      } else {
        user.regions[i].level++;
        await user.save();
      }
    }
  }
};

const coinFlip = () => {
  return Math.floor(Math.random() * 2) == 0 ? 'heads' : 'tails';
};

export const purchase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const user = req.currentUser;
    if (!user) return next(new ErrorResponse('User not found', 404));
    if (id == '1') {
      //RegionMultipler

      if (user.powerupsHistory[0].available == 0)
        return next(new ErrorResponse('Out of stock', 400));

      if (user!.score < costs.regionMult)
        return next(new ErrorResponse('Not enough Credits', 400));

      user!.score -= costs.regionMult;

      user?.inventory.push({
        id: 1,
        purchasedAt: new Date(Date.now()),
        usedAt: null,
        powerupName: 'Region Multiplier',
        active: false,
        region: undefined,
        question: undefined,
      });

      user.powerupsHistory[0].available--;
      user.powerupsHistory[0].owned++;

      await user.save();

      res.status(200).send({
        success: true,
        updatedScore: user.score,
      });
    } else if (id == '2') {
      //QuestionSkip

      if (user.powerupsHistory[1].available == 0)
        return next(new ErrorResponse('Out of stock', 400));

      if (user!.score < costs.questionSkip)
        return next(new ErrorResponse('Not enough Credits', 400));

      user!.score -= costs.questionSkip;

      user?.inventory.push({
        id: 2,
        purchasedAt: new Date(Date.now()),
        usedAt: null,
        powerupName: 'Question Skip',
        active: false,
        region: undefined,
        question: undefined,
      });

      user.powerupsHistory[1].available--;
      user.powerupsHistory[1].owned++;

      await user.save();

      res.status(200).send({
        success: true,
        updatedScore: user.score,
      });
    } else if (id == '3') {
      //Strike

      if (user.powerupsHistory[2].available == 0)
        return next(new ErrorResponse('Out of stock', 400));

      if (user!.score < costs.strike)
        return next(new ErrorResponse('Not enough Credits', 400));

      user!.score -= costs.strike;

      user?.inventory.push({
        id: 3,
        purchasedAt: new Date(Date.now()),
        usedAt: null,
        powerupName: 'Strike',
        active: false,
        region: undefined,
        question: undefined,
      });

      user.powerupsHistory[2].available--;
      user.powerupsHistory[2].owned++;

      await user.save();

      res.status(200).send({
        success: true,
        updatedScore: user.score,
      });
    } else if (id == '4') {
      //Fifty Fifty

      if (user.powerupsHistory[3].available == 0)
        return next(new ErrorResponse('Out of stock', 400));

      if (user!.score < costs.fiftyfifty)
        return next(new ErrorResponse('Not enough Credits', 400));

      user!.score -= costs.fiftyfifty;

      user?.inventory.push({
        id: 4,
        purchasedAt: new Date(Date.now()),
        usedAt: null,
        powerupName: 'Fifty Fifty',
        active: false,
        region: undefined,
        question: undefined,
      });

      user.powerupsHistory[3].available--;
      user.powerupsHistory[3].owned++;

      await user.save();

      res.status(200).send({
        success: true,
        updatedScore: user.score,
      });
    }
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
};

export const apply = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const user = req.currentUser;
    if (!user) return next(new ErrorResponse('User not found', 404));
    if (id == '1') {
      for (let i = 0; i < user.inventory.length; i++) {
        if (user.inventory[i].id == 1 && user.inventory[i].usedAt == null) {
          user.inventory[i].usedAt = new Date(Date.now());
          user.inventory[i].region = req.body.regionid;
          user.inventory[i].question = req.body.questionid;
          user.inventory[i].active = true;
          break;
        }
      }

      for (let i = 0; i < user.regions.length; i++) {
        if (user.regions[i].regionid.toString() == req.body.regionid) {
          user.regions[i].multiplier *= 1.5;
        }
      }

      user.powerupsHistory[0].owned--;

      await user!.save();
    } else if (id == '2') {
      const question = await Question.findById(req.body.questionid);
      if (!question) return next(new ErrorResponse('Question not found', 404));

      for (let i = 0; i < user.inventory.length; i++) {
        if (user.inventory[i].id == 2 && user.inventory[i].usedAt == null) {
          user.inventory[i].usedAt = new Date(Date.now());
          user.inventory[i].region = req.body.regionid;
          user.inventory[i].question = req.body.questionid;
          user.inventory[i].active = false;
          break;
        }
      }
      skipQuestion(req, user, question);

      user.powerupsHistory[1].owned--;
    } else if (id == '4') {
      const question = await Question.findById(req.body.questionid);
      if (!question) return next(new ErrorResponse('Question not found', 404));

      if (coinFlip() == 'heads') {
        for (let i = 0; i < user.inventory.length; i++) {
          if (user.inventory[i].id == 3 && user.inventory[i].usedAt == null) {
            user.inventory[i].usedAt = new Date(Date.now());
            user.inventory[i].region = req.body.regionid;
            user.inventory[i].question = req.body.questionid;
            user.inventory[i].active = false;
            break;
          }
        }
        skipQuestion(req, user, question);
        user.powerupsHistory[1].owned--;
      } else {
        user.powerupsHistory[1].owned--;
        return res.status(200).send({
          success: false,
          message: 'Bad luck',
        });
      }

      user.powerupsHistory[1].owned--;
    }
    res.status(200).send({
      success: true,
    });
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
};

export const getInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.currentUser;
    if (!user) return next(new ErrorResponse('User not found', 404));

    res.send(user.powerupsHistory);
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
};
