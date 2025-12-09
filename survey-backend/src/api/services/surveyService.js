import { dbStatus, httpStatus, responseREST, responseRESTError } from "../../common/functions.js";

export const listSurveysService = async (req, res) => {
  const functionName = "listSurveysService";
  try {
    const tenantDb = $connectTenant(req.userInfo.email);

    const surveys = await tenantDb.query(
      `SELECT id, name, description, type, status, created_at, updated_at 
       FROM survey_draft WHERE status != $1 
       ORDER BY updated_at, created_at DESC`,
      [dbStatus.DELETE]
    );

    return responseREST(res, httpStatus.SUCCESS, req.t("list_surveys"), surveys);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const getSurveyService = async (req, res) => {
  const functionName = "getSurveyService";
  try {
    const { id } = req.params;
    const tenantDb = $connectTenant(req.userInfo.email);

    const result = await tenantDb.query(
      `SELECT 
    s.id,
    s.name,
    s.description,
    s.status,
    s.type,
    s.design,
    s.target,
    s.other,
    s.created_at,
    s.updated_at,
    s.created_by,
    s.updated_by,
    COALESCE(
        (SELECT json_agg(
            json_build_object(
                'id', q.id,
                'element_type', q.element_type,
                'question', q.question,
                'logic', q.logic,
                'setting', q.setting,
                'other', q.other,
                'sort_order', q.sort_order
            ) ORDER BY q.created_at
        )
        FROM survey_draft_questions q 
        WHERE q.survey_id = s.id and q.status != $2),
        '[]'::json
    ) as questions
    FROM survey_draft s
    WHERE s.id = $1 AND s.status != $2`,
      [id, dbStatus.DELETE]
    );
  
    if (!result) {
      return responseREST(res, httpStatus.NOT_FOUND, req.t("survey_not_found"));
    }

    // If no questions, convert null to empty array
    if (!result.questions) {
      result.questions = [];
    }
  
    return responseREST(res, httpStatus.SUCCESS, req.t("get_survey"), result);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const createSurveyService = async (req, res) => {
  const functionName = "createSurveyService";
  try {
    const { name, description, type } = req.body;

    const tenantDb = $connectTenant(req.userInfo.email);
    const survey = await tenantDb.one(
      `INSERT INTO survey_draft (name, description, type, created_by, status) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, description, type, req.userInfo.user_id, dbStatus.DISABLE]
    );

    return responseREST(res, httpStatus.SUCCESS, req.t("create_survey"), survey);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const updateSurveyService = async (req, res) => {
  const functionName = "updateSurveyService";
  try {
    const { id } = req.params;
    const { name, description, design, target, trigger, other } = req.body;
    const tenantDb = $connectTenant(req.userInfo.email);

    const survey = await tenantDb.one(
      `SELECT status FROM survey_draft WHERE id = $1 AND status != $2`,
      [id, dbStatus.DELETE]
    );

    if (!survey) {
      return responseREST(res, httpStatus.NOT_FOUND, req.t("survey_not_found"));
    }

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    // Add fields only if they are provided
    if (name !== undefined) {
      updates.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount}`);
      values.push(description);
      paramCount++;
    }
    if (design !== undefined) {
      updates.push(`design = $${paramCount}`);
      values.push(design);
      paramCount++;
    }
    if (target !== undefined) {
      updates.push(`target = $${paramCount}`);
      values.push(target);
      paramCount++;
    }
    if (trigger !== undefined) {
      updates.push(`trigger = $${paramCount}`);
      values.push(trigger);
      paramCount++;
    }
    if (other !== undefined) {
      updates.push(`other = $${paramCount}`);
      values.push(other);
      paramCount++;
    }

    // Add updated_at and updated_by
    updates.push(`updated_at = now()`);
    updates.push(`updated_by = $${paramCount}`);
    values.push(req.userInfo.user_id);
    paramCount++;

    // Add id as the last parameter
    values.push(id);

    // Only proceed if there are fields to update
    if (updates.length > 0) {

      if(survey.status === dbStatus.ENABLE) {
        updates.push(`status = $${paramCount}`);
        values.push(dbStatus.PENDING_CHANGES);
        paramCount++;
      }

      const query = `
        UPDATE survey_draft 
        SET ${updates.join(', ')}
        WHERE id = $${paramCount} AND status != $${paramCount + 1}
        RETURNING *
      `;

      values.push(dbStatus.DELETE);

      const survey = await tenantDb.one(query, values);

      if (!survey) {
        return responseREST(res, httpStatus.NOT_FOUND, req.t("survey_not_found"));
      }

      return responseREST(res, httpStatus.SUCCESS, req.t("update_survey"), survey);
    } else {
      // If no fields to update, just return the current survey
      const survey = await tenantDb.one(
        'SELECT * FROM survey_draft WHERE id = $1 AND status != $2',
        [id, dbStatus.DELETE]
      );

      if (!survey) {
        return responseREST(res, httpStatus.NOT_FOUND, req.t("survey_not_found"));
      }

      return responseREST(res, httpStatus.SUCCESS, req.t("no_changes"), survey);
    }
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const deleteSurveyService = async (req, res) => {
  const functionName = "deleteSurvey";
  try {
    const { id } = req.params;
    const tenantDb = $connectTenant(req.userInfo.email);
    
    await tenantDb.task(async t => {
      // Delete survey draft and its questions
      await t.batch([
        t.query(
          `UPDATE survey_draft 
           SET deleted_at = now(), status = $2, deleted_by = $3
           WHERE id = $1`,
          [id, dbStatus.DELETE, req.userInfo.user_id]
        ),
        t.query(
          `UPDATE survey_draft_questions 
           SET deleted_at = now(), status = $2, deleted_by = $3
           WHERE survey_id = $1`,
          [id, dbStatus.DELETE, req.userInfo.user_id]
        ),
        t.query(
          `UPDATE surveys
           SET deleted_at = now(), status = $2, deleted_by = $3
           WHERE id = $1`,
          [id, dbStatus.DELETE, req.userInfo.user_id]
        ),
        t.query(
          `UPDATE survey_questions 
           SET deleted_at = now(), status = $2, deleted_by = $3
           WHERE survey_id = $1`,
          [id, dbStatus.DELETE, req.userInfo.user_id]
        )
      ]);
    });
    
    return responseREST(res, httpStatus.SUCCESS, req.t("delete_survey"));
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const listQuestionsService = async (req, res) => {
  const functionName = "listQuestions";
  try {
    const { surveyId } = req.params;
    const tenantDb = $connectTenant(req.userInfo.email);

    const questions = await tenantDb.query(
      `SELECT id, survey_id, element_type, question, logic, setting, other, sort_order FROM survey_draft_questions WHERE survey_id = $1 AND status != $2`,
      [surveyId, dbStatus.DELETE]
    );

    return responseREST(res, httpStatus.SUCCESS, req.t("list_questions"), questions);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const createQuestionService = async (req, res) => {

  const functionName = "createQuestion";
  try {
    const { surveyId } = req.params;
    const { element_type, question, logic, setting, other, sort_order } = req.body;

    const tenantDb = $connectTenant(req.userInfo.email);

    const survey = await tenantDb.one(
      `SELECT status FROM survey_draft WHERE id = $1 AND status != $2`,
      [surveyId, dbStatus.DELETE]
    );

    if(!survey) {
      return responseREST(res, httpStatus.NOT_FOUND, req.t("survey_not_found"));
    }

    if(survey.status === dbStatus.ENABLE) {
      await tenantDb.query(
        `UPDATE survey_draft 
         SET status = $1, updated_at = now(), updated_by = $2
         WHERE id = $3`,
        [dbStatus.PENDING_CHANGES, req.userInfo.user_id, surveyId]
      );
    }

    const createdQuestion = await tenantDb.one(
      `INSERT INTO survey_draft_questions 
       (survey_id, element_type, question, logic, setting, other, sort_order, created_by, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [surveyId, element_type, question, logic, setting, other, sort_order, req.userInfo.user_id, dbStatus.DISABLE]
    );

    return responseREST(res, httpStatus.SUCCESS, req.t("create_question"), createdQuestion);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const updateQuestionService = async (req, res) => {
  const functionName = "updateQuestion";
  try {
    const { questionId } = req.params;
    const { element_type, question, logic, setting, other, sort_order } = req.body;
    const tenantDb = $connectTenant(req.userInfo.email);

    const findSurvey = await tenantDb.one(
      `SELECT status FROM survey_draft WHERE id = $1 AND status != $2`,
      [questionId, dbStatus.DELETE]
    );

    if(!findSurvey) {
      return responseREST(res, httpStatus.NOT_FOUND, req.t("survey_not_found"));
    }

    if(findSurvey.status === dbStatus.ENABLE) {
      await tenantDb.query(
        `UPDATE survey_draft 
         SET status = $1, updated_at = now(), updated_by = $2
         WHERE id = $3`,
        [dbStatus.PENDING_CHANGES, req.userInfo.user_id, questionId]
      );
    }

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    // Add fields only if they are provided
    if (element_type !== undefined) {
      updates.push(`element_type = $${paramCount}`);
      values.push(element_type);
      paramCount++;
    }
    if (question !== undefined) {
      updates.push(`question = $${paramCount}`);
      values.push(question);
      paramCount++;
    }
    if (logic !== undefined) {
      updates.push(`logic = $${paramCount}`);
      values.push(logic);
      paramCount++;
    }
    if (setting !== undefined) {
      updates.push(`setting = $${paramCount}`);
      values.push(setting);
      paramCount++;
    }
    if (other !== undefined) {
      updates.push(`other = $${paramCount}`);
      values.push(other);
      paramCount++;
    }
    if (sort_order !== undefined) {
      updates.push(`sort_order = $${paramCount}`);
      values.push(sort_order);
      paramCount++;
    }

    // Add updated_at and updated_by
    updates.push(`updated_at = now()`);
    updates.push(`updated_by = $${paramCount}`);
    values.push(req.userInfo.user_id);
    paramCount++;

    // Add id as the last parameter
    values.push(questionId);

    // Only proceed if there are fields to update
    if (updates.length > 0) {
      const query = `
        UPDATE survey_draft_questions 
        SET ${updates.join(', ')}
        WHERE id = $${paramCount} AND status != $${paramCount + 1}
        RETURNING *
      `;

      values.push(dbStatus.DELETE);

      const updatedQuestion = await tenantDb.one(query, values);

      if (!updatedQuestion) {
        return responseREST(res, httpStatus.NOT_FOUND, req.t("question_not_found"));
      }

      return responseREST(res, httpStatus.SUCCESS, req.t("update_question"), updatedQuestion);
    } else {
      // If no fields to update, just return the current question
      const question = await tenantDb.one(
        'SELECT * FROM survey_draft_questions WHERE id = $1 AND status != $2',
        [questionId, dbStatus.DELETE]
      );

      if (!question) {
        return responseREST(res, httpStatus.NOT_FOUND, req.t("question_not_found"));
      }

      return responseREST(res, httpStatus.SUCCESS, req.t("no_changes"), question);
    }
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const deleteQuestionService = async (req, res) => {
  const functionName = "deleteQuestionService";
  try {
    const { questionId } = req.params;

    const tenantDb = $connectTenant(req.userInfo.email);
    
    await tenantDb.none(
      `UPDATE survey_draft_questions SET status = $1 WHERE id = $2`,
      [dbStatus.DELETE, questionId]
    );

    return responseREST(res, httpStatus.SUCCESS, req.t("delete_question"));
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const publishSurveyService = async (req, res) => {
  const functionName = "publishSurveyService";
  const tenantDb = $connectTenant(req.userInfo.email);
  const { id } = req.params;
  const { status } = req.body;

  try {

    if(status === "publish") {
      await tenantDb.tx(async t => {
        // const t = tenantDb;
      // Add status update queries to batch
        t.none(
          `UPDATE survey_draft SET status = $1 WHERE id = $2`,
          [dbStatus.ENABLE, id]
        );
        t.none(
          `UPDATE survey_questions SET status = $1 WHERE survey_id = $2`,
          [dbStatus.ENABLE, id]
        )

        t.none(
          `INSERT INTO surveys 
           SELECT * FROM survey_draft 
           WHERE id = $1
           ON CONFLICT (id) DO UPDATE
           SET name = EXCLUDED.name,
               description = EXCLUDED.description,
               status = EXCLUDED.status,
               type = EXCLUDED.type,
               design = EXCLUDED.design,
               target = EXCLUDED.target,
               trigger = EXCLUDED.trigger,
               other = EXCLUDED.other`,
          [id]
        )

        t.none(
          `INSERT INTO survey_questions 
           SELECT * FROM survey_draft_questions sdq
           WHERE sdq.survey_id = $1 and sdq.status != $2
           ON CONFLICT (id) DO UPDATE 
           SET element_type = EXCLUDED.element_type,
               question = EXCLUDED.question,
               logic = EXCLUDED.logic,
               setting = EXCLUDED.setting,
               other = EXCLUDED.other,
               sort_order = EXCLUDED.sort_order,
               status = EXCLUDED.status`,
          [id, dbStatus.DELETE]
        );
      });

      return responseREST(res, httpStatus.SUCCESS, req.t("publish_survey"));
    } 

    if(status === "unpublish") {
      await tenantDb.tx(async t => {
        t.none( 
          `UPDATE surveys SET status = $1 WHERE id = $2`,
          [dbStatus.DISABLE, id]
        );

        t.none(
          `UPDATE survey_questions SET status = $1 WHERE survey_id = $2`,
          [dbStatus.DISABLE, id]
        );

        t.none(
          `UPDATE survey_draft SET status = $1 WHERE id = $2`,
          [dbStatus.DISABLE, id]
        );

        t.none(
          `UPDATE survey_draft_questions SET status = $1 WHERE survey_id = $2 and status != $3`,
          [dbStatus.DISABLE, id, dbStatus.DELETE]
        );
      });

      return responseREST(res, httpStatus.SUCCESS, req.t("unpublish_survey"));
    }

    return responseREST(res, httpStatus.SUCCESS, req.t("not_found"));
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};
