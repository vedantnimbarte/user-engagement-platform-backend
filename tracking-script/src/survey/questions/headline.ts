interface HeadlineOptions {
    primaryButtonText?: string;
    secondaryButtonText?: string;
    questionId: string;
    surveyId: string;
    containerId: string;
    onPrimaryClick?: () => void;
    onSecondaryClick?: () => void;
  }
  
  interface SurveyAnswerEvent extends CustomEvent {
    detail: {
      questionId: string;
      answer: string;
      surveyId: string;
    };
  }
  
  class HeadlineComponent {
    private primaryButtonText: string;
    private secondaryButtonText: string;
    private questionId: string;
    private surveyId: string;
    private hoverPrimary: boolean = false;
    private hoverSecondary: boolean = false;
    private container: HTMLElement;
    private onPrimaryClick: () => void;
    private onSecondaryClick: () => void;
  
    constructor(options: HeadlineOptions) {
      this.primaryButtonText = options.primaryButtonText || 'Get Started';
      this.secondaryButtonText = options.secondaryButtonText || 'Learn More';
      this.questionId = options.questionId;
      this.surveyId = options.surveyId;
      this.onPrimaryClick = options.onPrimaryClick || (() => {});
      this.onSecondaryClick = options.onSecondaryClick || (() => {});
      
      const containerElement = document.getElementById(options.containerId);
      if (!containerElement) {
        throw new Error(`Container with id "${options.containerId}" not found`);
      }
      this.container = containerElement;
      
      this.render();
    }
  
    private handlePrimaryClick(): void {
      this.onPrimaryClick();
      this.dispatchSurveyAnswer('primary', this.primaryButtonText);
    }
  
    private handleSecondaryClick(): void {
      this.onSecondaryClick();
      this.dispatchSurveyAnswer('secondary', this.secondaryButtonText);
    }
  
    private handlePrimaryHover(isHovering: boolean): void {
      this.hoverPrimary = isHovering;
      this.updateButtonStates();
    }
  
    private handleSecondaryHover(isHovering: boolean): void {
      this.hoverSecondary = isHovering;
      this.updateButtonStates();
    }
  
    private updateButtonStates(): void {
      const primaryButton = this.container.querySelector('.headline-primary-button') as HTMLButtonElement;
      const secondaryButton = this.container.querySelector('.headline-secondary-button') as HTMLButtonElement;
  
      if (primaryButton) {
        if (this.hoverPrimary) {
          primaryButton.classList.add('headline-primary-hover');
        } else {
          primaryButton.classList.remove('headline-primary-hover');
        }
      }
  
      if (secondaryButton) {
        if (this.hoverSecondary) {
          secondaryButton.classList.add('headline-secondary-hover');
        } else {
          secondaryButton.classList.remove('headline-secondary-hover');
        }
      }
    }
  
    private dispatchSurveyAnswer(buttonType: 'primary' | 'secondary', answerText: string): void {
      const event: SurveyAnswerEvent = new CustomEvent('SurvayAnswer', {
        detail: {
          questionId: this.questionId,
          answer: answerText,
          surveyId: this.surveyId
        }
      }) as SurveyAnswerEvent;
      
      document.dispatchEvent(event);
    }
  
    private render(): void {
      this.container.innerHTML = `
        <div class="headline-component">
          <button type="button" class="headline-primary-button">
            ${this.primaryButtonText}
          </button>
          <button type="button" class="headline-secondary-button">
            ${this.secondaryButtonText}
          </button>
        </div>
      `;
  
      this.attachEventListeners();
    }
  
    private attachEventListeners(): void {
      const primaryButton = this.container.querySelector('.headline-primary-button') as HTMLButtonElement;
      const secondaryButton = this.container.querySelector('.headline-secondary-button') as HTMLButtonElement;
  
      if (primaryButton) {
        primaryButton.addEventListener('click', () => this.handlePrimaryClick());
        primaryButton.addEventListener('mouseenter', () => this.handlePrimaryHover(true));
        primaryButton.addEventListener('mouseleave', () => this.handlePrimaryHover(false));
        
        // Keyboard support
        primaryButton.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.handlePrimaryClick();
          }
        });
      }
  
      if (secondaryButton) {
        secondaryButton.addEventListener('click', () => this.handleSecondaryClick());
        secondaryButton.addEventListener('mouseenter', () => this.handleSecondaryHover(true));
        secondaryButton.addEventListener('mouseleave', () => this.handleSecondaryHover(false));
        
        // Keyboard support
        secondaryButton.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.handleSecondaryClick();
          }
        });
      }
    }
  
    public updateButtonTexts(primaryText: string, secondaryText: string): void {
      this.primaryButtonText = primaryText;
      this.secondaryButtonText = secondaryText;
      
      const primaryButton = this.container.querySelector('.headline-primary-button') as HTMLButtonElement;
      const secondaryButton = this.container.querySelector('.headline-secondary-button') as HTMLButtonElement;
      
      if (primaryButton) {
        primaryButton.textContent = primaryText;
      }
      
      if (secondaryButton) {
        secondaryButton.textContent = secondaryText;
      }
    }
  
    public disable(): void {
      const buttons = this.container.querySelectorAll('button');
      buttons.forEach(button => {
        button.disabled = true;
        button.classList.add('headline-disabled');
      });
    }
  
    public enable(): void {
      const buttons = this.container.querySelectorAll('button');
      buttons.forEach(button => {
        button.disabled = false;
        button.classList.remove('headline-disabled');
      });
    }
  
    public simulateClick(buttonType: 'primary' | 'secondary'): void {
      if (buttonType === 'primary') {
        this.handlePrimaryClick();
      } else {
        this.handleSecondaryClick();
      }
    }
  }
  
  // Export for module usage
  export default HeadlineComponent;