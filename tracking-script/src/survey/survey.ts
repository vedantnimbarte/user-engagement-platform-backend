import CES from "./questions/ces";
import CSAT from "./questions/csat";
import YesNoComponent from "./questions/yes_no";
import StarRatingComponent from "./questions/star_rating";
import RatingMatrixComponent from "./questions/rating_matrix";
import RatingComponent from "./questions/rating";
import RadioComponent from "./questions/radio";
import NPSComponent from "./questions/nps";
import OpenTextComponent from "./questions/open_text";
import MultipleChoiceComponent from "./questions/multiple_choice";
import HeadlineComponent from "./questions/headline";
import EmailComponent from "./questions/email";
import CTA from "./questions/cta";
import Attachment from "./questions/attachment";
import Checkbox from "./questions/checkbox";
import SurveyContainerComponent from "./container";

const STYLE_URL = "/src/survey/styles/survay.css";

class Survey {
  private shadowRoot: ShadowRoot | null = null;
  private container: HTMLElement | null = null;
  private questions: any[] = [];
  private questionMap: Record<string, any> = {};
  private currentQuestionId: string | null = null;

  public generate(questions: any[], mountSelector: string) {
    const mountEl = document.querySelector(mountSelector);
    if (!mountEl) throw new Error("Mount element not found");
    this.shadowRoot = mountEl.attachShadow({ mode: "open" });

    // Add CSS
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = STYLE_URL;
    this.shadowRoot.appendChild(style);

    // Survey container
    this.container = document.createElement("div");
    this.container.className = "survey-container";
    this.shadowRoot.appendChild(this.container);

    this.questions = questions;
    this.questionMap = {};
    questions.forEach(q => {
      if (q.questionId) {
        this.questionMap[q.questionId] = q;
      }
    });
    // Start with the first question
    if (questions.length > 0) {
      this.showQuestion(questions[0].questionId);
    }
  }

  public showQuestion(questionId: string) {
    this.currentQuestionId = questionId;
    const q = this.questionMap[questionId];
    if (!q) return;
    // Clear previous content
    if (this.container) this.container.innerHTML = "";

    // Create a unique container for the question
    const qContainerId = `survey-q-${questionId}`;
    const qDiv = document.createElement("div");
    qDiv.id = qContainerId + "-outer";
    this.container!.appendChild(qDiv);

    // Use SurveyContainerComponent for the question
    const surveyContainer = new SurveyContainerComponent({
      containerId: qContainerId + "-outer",
      showBranding: false,
    });

    // Add illustration if present
    if (q.image) {
      surveyContainer.addIllustration({
        content: `<img src='${q.image}' alt='${q.title || ''}' class='survey-illustration-img' />`,
      });
    }
    // Add title and description
    if (q.title) surveyContainer.addTitle(q.title);
    if (q.description) surveyContainer.addDescription(q.description);
    // Add the question component container
    surveyContainer.addComponentContainer(qContainerId);

    // Instantiate the question component and call its render method
    let questionInstance: any = null;
    switch (q.type) {
      case "ces":
        questionInstance = new CES({ ...q, containerId: qContainerId });
        break;
      case "csat":
        questionInstance = new CSAT({ ...q, containerId: qContainerId });
        break;
      case "yes_no":
        questionInstance = new YesNoComponent({ ...q, containerId: qContainerId });
        break;
      case "star_rating":
        questionInstance = new StarRatingComponent({ ...q, containerId: qContainerId });
        break;
      case "rating_matrix":
        questionInstance = new RatingMatrixComponent({ ...q, containerId: qContainerId });
        break;
      case "rating":
        questionInstance = new RatingComponent({ ...q, containerId: qContainerId });
        break;
      case "radio":
        questionInstance = new RadioComponent({ ...q, containerId: qContainerId });
        break;
      case "nps":
        questionInstance = new NPSComponent({ ...q, containerId: qContainerId });
        break;
      case "open_text":
        questionInstance = new OpenTextComponent({ ...q, containerId: qContainerId });
        break;
      case "multiple_choice":
        questionInstance = new MultipleChoiceComponent({ ...q, containerId: qContainerId });
        break;
      case "headline":
        questionInstance = new HeadlineComponent({ ...q, containerId: qContainerId });
        break;
      case "email":
        questionInstance = new EmailComponent({ ...q, containerId: qContainerId });
        break;
      case "cta":
        questionInstance = new CTA({ ...q, containerId: qContainerId });
        break;
      case "attachment":
        questionInstance = new Attachment({ ...q, containerId: qContainerId });
        break;
      case "checkbox":
        questionInstance = new Checkbox({ ...q, containerId: qContainerId });
        break;
      default:
        const innerDiv = document.getElementById(qContainerId);
        if (innerDiv) innerDiv.innerText = "Unknown question type";
    }
    // If the question instance has a render method, call it (for explicitness)
    if (questionInstance && typeof questionInstance.render === "function") {
      questionInstance.render();
    }
  }

  public completeSurvey() {
    if (this.container) {
      this.container.innerHTML = '<div class="survey-complete">Thank you for completing the survey!</div>';
    }
    // You can add more logic here (e.g., fire a callback, event, etc.)
  }
}

export default Survey;

// Add this to expose Survey globally for dynamic loading
if (typeof window !== "undefined") {
  (window as any).Survey = Survey;
}