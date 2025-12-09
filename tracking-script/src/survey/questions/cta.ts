interface CTAOptions {
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
  
  type ButtonSelection = 'primary' | 'secondary' | null;
  
  class CTA {
    private primaryButtonText: string;
    private secondaryButtonText: string;
    private questionId: string;
    private surveyId: string;
    private selected: ButtonSelection = null;
    private container: HTMLElement;
    private onPrimaryClick: () => void;
    private onSecondaryClick: () => void;
  
    constructor(options: CTAOptions) {
      this.primaryButtonText = options.primaryButtonText || 'Yes, tell me more';
      this.secondaryButtonText = options.secondaryButtonText || 'Maybe later';
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
      this.selected = 'primary';
      this.updateButtonStates();
      this.onPrimaryClick();
      this.dispatchSurveyAnswer('primary');
    }
  
    private handleSecondaryClick(): void {
      this.selected = 'secondary';
      this.updateButtonStates();
      this.onSecondaryClick();
      this.dispatchSurveyAnswer('secondary');
    }
  
    private updateButtonStates(): void {
      const primaryButton = this.container.querySelector('.cta-primary-button') as HTMLButtonElement;
      const secondaryButton = this.container.querySelector('.cta-secondary-button') as HTMLButtonElement;
  
      if (primaryButton && secondaryButton) {
        // Reset all classes first
        primaryButton.className = 'cta-primary-button';
        secondaryButton.className = 'cta-secondary-button';
  
        // Apply selected state classes
        if (this.selected === 'primary') {
          primaryButton.classList.add('cta-primary-selected');
        } else {
          primaryButton.classList.add('cta-primary-default');
        }
  
        if (this.selected === 'secondary') {
          secondaryButton.classList.add('cta-secondary-selected');
        } else {
          secondaryButton.classList.add('cta-secondary-default');
        }
      }
    }
  
    private dispatchSurveyAnswer(buttonType: 'primary' | 'secondary'): void {
      const answerText = buttonType === 'primary' ? this.primaryButtonText : this.secondaryButtonText;
      
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
        <div class="cta-component">
          <button type="button" class="cta-primary-button cta-primary-default">
            ${this.primaryButtonText}
          </button>
          <button type="button" class="cta-secondary-button cta-secondary-default">
            ${this.secondaryButtonText}
          </button>
        </div>
      `;
  
      this.attachEventListeners();
    }
  
    private attachEventListeners(): void {
      const primaryButton = this.container.querySelector('.cta-primary-button') as HTMLButtonElement;
      const secondaryButton = this.container.querySelector('.cta-secondary-button') as HTMLButtonElement;
  
      if (primaryButton) {
        primaryButton.addEventListener('click', () => this.handlePrimaryClick());
        
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
        
        // Keyboard support
        secondaryButton.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.handleSecondaryClick();
          }
        });
      }
    }
  
    public getSelectedButton(): ButtonSelection {
      return this.selected;
    }
  
    public getSelectedAnswer(): string | null {
      if (this.selected === 'primary') {
        return this.primaryButtonText;
      } else if (this.selected === 'secondary') {
        return this.secondaryButtonText;
      }
      return null;
    }
  
    public reset(): void {
      this.selected = null;
      this.updateButtonStates();
    }
  
    public setSelected(selection: ButtonSelection): void {
      this.selected = selection;
      this.updateButtonStates();
      
      if (selection) {
        this.dispatchSurveyAnswer(selection);
      }
    }
  
    public updateButtonTexts(primaryText: string, secondaryText: string): void {
      this.primaryButtonText = primaryText;
      this.secondaryButtonText = secondaryText;
      
      const primaryButton = this.container.querySelector('.cta-primary-button') as HTMLButtonElement;
      const secondaryButton = this.container.querySelector('.cta-secondary-button') as HTMLButtonElement;
      
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
        button.classList.add('cta-disabled');
      });
    }
  
    public enable(): void {
      const buttons = this.container.querySelectorAll('button');
      buttons.forEach(button => {
        button.disabled = false;
        button.classList.remove('cta-disabled');
      });
    }
  }
  
  // Export for module usage
  export default CTA;