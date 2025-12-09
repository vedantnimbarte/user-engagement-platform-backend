import { dbStatus, getTenantByAccountId } from "../../common/functions.js";


const organizationScriptIdChecker = async (req, res, next) => {
  try {
      const { script_id } = req.body;
  
      const organization = await $main.oneOrNone(
        'SELECT id,email FROM organizations WHERE script_id = $1 AND status = $2',
        [script_id,dbStatus.ENABLE]
      );

      if (!organization) {
        return res.status(400).send("Invalid script_id");
      }

      const { id,email } = organization;
      
      req.userInfo = {
         email: email,
        organization_id: id,
      };


      next();
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }

  export {
    organizationScriptIdChecker
  }
