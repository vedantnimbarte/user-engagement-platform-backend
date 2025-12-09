import { Router } from "express";
import {
  listSurveys,
  getSurvey,
  createSurvey,
  updateSurvey,
  deleteSurvey,
  listQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  publishSurvey,
} from "../controllers/surveyController.js";
import { checkToken } from "../middlewares/checkToken.js";


const router = Router();

// Survey routes
router.get("/", checkToken, listSurveys);
router.get("/:id", checkToken, getSurvey);
router.post("/", checkToken, createSurvey);
router.put("/:id", checkToken, updateSurvey);
router.delete("/:id", checkToken, deleteSurvey);

// Question routes
router.get("/questions/:surveyId", checkToken, listQuestions);
router.post("/questions/:surveyId", checkToken, createQuestion);
router.put("/questions/:questionId", checkToken, updateQuestion);
router.delete("/questions/:questionId", checkToken, deleteQuestion);

// Publish/Unpublish routes
router.post("/publish/:id", checkToken, publishSurvey);

export default router;
