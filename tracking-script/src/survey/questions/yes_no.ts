interface YesNoOptions {
    yesText?: string;
    noText?: string;
    questionId: string;
    surveyId: string;
    containerId: string;
    onSelect?: (option: 'yes' | 'no') => void;
  }
  
  interface SurveyAnswerEvent extends CustomEvent {
    detail: {
      questionId: string;
      answer: string;
      surveyId: string;
    };
  }
  
  type YesNoSelection = 'yes' | 'no' | null;
  
  class YesNoComponent {
    private yesText: string;
    private noText: string;
    private questionId: string;
    private surveyId: string;
    private selectedOption: YesNoSelection = null;
    private container: HTMLElement;
    private onSelect: (option: 'yes' | 'no') => void;
  
    constructor(options: YesNoOptions) {
      this.yesText = options.yesText || 'Yes';
      this.noText = options.noText || 'No';
      this.questionId = options.questionId;
      this.surveyId = options.surveyId;
      this.onSelect = options.onSelect || (() => {});
      
      const containerElement = document.getElementById(options.containerId);
      if (!containerElement) {
        throw new Error(`Container with id "${options.containerId}" not found`);
      }
      this.container = containerElement;
      
      this.render();
    }
  
    private handleSelect(option: 'yes' | 'no'): void {
      this.selectedOption = option;
      this.updateVisualState();
      this.onSelect(option);
      this.dispatchSurveyAnswer();
    }
  
    private updateVisualState(): void {
      const yesButton = this.container.querySelector('.yesno-yes-button') as HTMLElement;
      const noButton = this.container.querySelector('.yesno-no-button') as HTMLElement;
      const yesIcon = this.container.querySelector('.yesno-yes-icon') as HTMLElement;
      const noIcon = this.container.querySelector('.yesno-no-icon') as HTMLElement;
  
      if (!yesButton || !noButton) return;
  
      // Reset all button classes
      yesButton.className = 'yesno-button yesno-yes-button';
      noButton.className = 'yesno-button yesno-no-button';
  
      // Hide all icons initially
      if (yesIcon) yesIcon.style.display = 'none';
      if (noIcon) noIcon.style.display = 'none';
  
      if (this.selectedOption === null) {
        yesButton.classList.add('yesno-button-default');
        noButton.classList.add('yesno-button-default');
      } else if (this.selectedOption === 'yes') {
        yesButton.classList.add('yesno-button-yes-selected');
        noButton.classList.add('yesno-button-unselected');
        if (yesIcon) yesIcon.style.display = 'flex';
      } else if (this.selectedOption === 'no') {
        noButton.classList.add('yesno-button-no-selected');
        yesButton.classList.add('yesno-button-unselected');
        if (noIcon) noIcon.style.display = 'flex';
      }
    }
  
    private dispatchSurveyAnswer(): void {
      if (this.selectedOption !== null) {
        const answerText = this.selectedOption === 'yes' ? this.yesText : this.noText;
        
        const event: SurveyAnswerEvent = new CustomEvent('SurvayAnswer', {
          detail: {
            questionId: this.questionId,
            answer: answerText,
            surveyId: this.surveyId
          }
        }) as SurveyAnswerEvent;
        
        document.dispatchEvent(event);
      }
    }
  
    private createCheckIcon(): string {
      return `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6L9 17L4 12" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
    }
  
    private createCrossIcon(): string {
      return `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
    }
  
    private render(): void {
      this.container.innerHTML = `
        <div class="yesno-component">
          <div class="yesno-button-container">
            <button type="button" class="yesno-button yesno-yes-button yesno-button-default">
              <div class="yesno-button-content">
                <div class="yesno-yes-icon" style="display: none;">
                  ${this.createCheckIcon()}
                </div>
                <span class="yesno-button-text">${this.yesText}</span>
              </div>
            </button>
  
            <button type="button" class="yesno-button yesno-no-button yesno-button-default">
              <div class="yesno-button-content">
                <div class="yesno-no-icon" style="display: none;">
                  ${this.createCrossIcon()}
                </div>
                <span class="yesno-button-text">${this.noText}</span>
              </div>
            </button>
          </div>
        </div>
      `;
  
      this.attachEventListeners();
    }
  
    private attachEventListeners(): void {
      const yesButton = this.container.querySelector('.yesno-yes-button') as HTMLElement;
      const noButton = this.container.querySelector('.yesno-no-button') as HTMLElement;
  
      if (yesButton) {
        yesButton.addEventListener('click', () => {
          this.handleSelect('yes');
        });
        
        // Keyboard support
        yesButton.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.handleSelect('yes');
          }
          
          // Arrow key navigation
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            noButton?.focus();
          }
        });
      }
  
      if (noButton) {
        noButton.addEventListener('click', () => {
          this.handleSelect('no');
        });
        
        // Keyboard support
        noButton.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.handleSelect('no');
          }
          
          // Arrow key navigation
          if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            yesButton?.focus();
          }
        });
      }
    }
  
    public getSelectedOption(): YesNoSelection {
      return this.selectedOption;
    }
  
    public getSelectedAnswer(): string | null {
      if (this.selectedOption === 'yes') return this.yesText;
      if (this.selectedOption === 'no') return this.noText;
      return null;
    }
  
    public setSelectedOption(option: YesNoSelection): void {
      this.selectedOption = option;
      this.updateVisualState();
      
      if (option !== null) {
        this.dispatchSurveyAnswer();
      }
    }
  
    public reset(): void {
      this.selectedOption = null;
      this.updateVisualState();
    }
  
    public updateButtonTexts(yesText: string, noText: string): void {
      this.yesText = yesText;
      this.noText = noText;
      
      const yesTextElement = this.container.querySelector('.yesno-yes-button .yesno-button-text') as HTMLElement;
      const noTextElement = this.container.querySelector('.yesno-no-button .yesno-button-text') as HTMLElement;
      
      if (yesTextElement) yesTextElement.textContent = yesText;
      if (noTextElement) noTextElement.textContent = noText;
    }
  
    public disable(): void {
      const buttons = this.container.querySelectorAll('.yesno-button');
      buttons.forEach(button => {
        (button as HTMLButtonElement).disabled = true;
        button.classList.add('yesno-disabled');
      });
    }
  
    public enable(): void {
      const buttons = this.container.querySelectorAll('.yesno-button');
      buttons.forEach(button => {
        (button as HTMLButtonElement).disabled = false;
        button.classList.remove('yesno-disabled');
      });
    }
  
    public getSelectionBoolean(): boolean | null {
      if (this.selectedOption === 'yes') return true;
      if (this.selectedOption === 'no') return false;
      return null;
    }
  
    public setSelectionByBoolean(value: boolean | null): void {
      if (value === true) {
        this.setSelectedOption('yes');
      } else if (value === false) {
        this.setSelectedOption('no');
      } else {
        this.setSelectedOption(null);
      }
    }
  }
  
  // Export for module usage
  export default YesNoComponent;