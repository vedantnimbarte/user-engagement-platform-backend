interface RadioOptions {
    options?: string[];
    questionId: string;
    surveyId: string;
    containerId: string;
    onSelectionChange?: (selectedOption: string | null, selectedIndex: number | null) => void;
  }
  
  interface SurveyAnswerEvent extends CustomEvent {
    detail: {
      questionId: string;
      answer: string;
      surveyId: string;
    };
  }
  
  class RadioComponent {
    private options: string[];
    private questionId: string;
    private surveyId: string;
    private selectedOption: number | null = null;
    private container: HTMLElement;
    private onSelectionChange: (selectedOption: string | null, selectedIndex: number | null) => void;
  
    constructor(options: RadioOptions) {
      this.options = options.options || [
        'Dashboards',
        'Reports',
        'Analytics',
        'User Management',
        'Notifications',
        'Mobile App'
      ];
      this.questionId = options.questionId;
      this.surveyId = options.surveyId;
      this.onSelectionChange = options.onSelectionChange || (() => {});
      
      const containerElement = document.getElementById(options.containerId);
      if (!containerElement) {
        throw new Error(`Container with id "${options.containerId}" not found`);
      }
      this.container = containerElement;
      
      this.render();
    }
  
    private handleOptionToggle(index: number): void {
      this.selectedOption = index;
      this.updateVisualState();
      this.notifySelectionChange();
      this.dispatchSurveyAnswer();
    }
  
    private updateVisualState(): void {
      const buttons = this.container.querySelectorAll('.radio-option-button');
      
      buttons.forEach((button, index) => {
        const buttonElement = button as HTMLElement;
        const radioVisual = buttonElement.querySelector('.radio-visual') as HTMLElement;
        const radioDot = buttonElement.querySelector('.radio-dot') as HTMLElement;
        
        if (index === this.selectedOption) {
          buttonElement.classList.add('radio-option-selected');
          buttonElement.classList.remove('radio-option-unselected');
          radioVisual.classList.add('radio-visual-selected');
          radioVisual.classList.remove('radio-visual-unselected');
          if (radioDot) {
            radioDot.style.display = 'flex';
          }
        } else {
          buttonElement.classList.remove('radio-option-selected');
          buttonElement.classList.add('radio-option-unselected');
          radioVisual.classList.remove('radio-visual-selected');
          radioVisual.classList.add('radio-visual-unselected');
          if (radioDot) {
            radioDot.style.display = 'none';
          }
        }
      });
    }
  
    private notifySelectionChange(): void {
      const selectedOptionText = this.selectedOption !== null ? this.options[this.selectedOption] : null;
      this.onSelectionChange(selectedOptionText, this.selectedOption);
    }
  
    private dispatchSurveyAnswer(): void {
      if (this.selectedOption !== null) {
        const selectedOptionText = this.options[this.selectedOption];
        
        const event: SurveyAnswerEvent = new CustomEvent('SurvayAnswer', {
          detail: {
            questionId: this.questionId,
            answer: selectedOptionText,
            surveyId: this.surveyId
          }
        }) as SurveyAnswerEvent;
        
        document.dispatchEvent(event);
      }
    }
  
    private createRadioDotSVG(): string {
      return `
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="6" cy="6" r="5" fill="white" stroke="#3B82F6" />
        </svg>
      `;
    }
  
    private render(): void {
      const optionsHTML = this.options.map((option, index) => `
        <button
          type="button"
          class="radio-option-button radio-option-unselected"
          data-index="${index}"
        >
          <div class="radio-visual radio-visual-unselected">
            <div class="radio-dot" style="display: none;">
              ${this.createRadioDotSVG()}
            </div>
          </div>
          <span class="radio-option-text">${option}</span>
        </button>
      `).join('');
  
      this.container.innerHTML = `
        <div class="radio-component">
          ${optionsHTML}
        </div>
      `;
  
      this.attachEventListeners();
    }
  
    private attachEventListeners(): void {
      const buttons = this.container.querySelectorAll('.radio-option-button');
      
      buttons.forEach((button, index) => {
        button.addEventListener('click', () => {
          this.handleOptionToggle(index);
        });
        
        // Add keyboard support
        button.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.handleOptionToggle(index);
          }
          
          // Arrow key navigation
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const direction = e.key === 'ArrowDown' ? 1 : -1;
            const newIndex = (index + direction + this.options.length) % this.options.length;
            const nextButton = this.container.querySelectorAll('.radio-option-button')[newIndex] as HTMLElement;
            if (nextButton) {
              nextButton.focus();
            }
          }
        });
      });
    }
  
    public getSelectedOption(): string | null {
      return this.selectedOption !== null ? this.options[this.selectedOption] : null;
    }
  
    public getSelectedIndex(): number | null {
      return this.selectedOption;
    }
  
    public setSelectedOption(index: number | null): void {
      if (index === null || (index >= 0 && index < this.options.length)) {
        this.selectedOption = index;
        this.updateVisualState();
        this.notifySelectionChange();
      }
    }
  
    public reset(): void {
      this.selectedOption = null;
      this.updateVisualState();
      this.notifySelectionChange();
    }
  
    public updateOptions(newOptions: string[]): void {
      this.options = [...newOptions];
      this.selectedOption = null;
      this.render();
    }
  
    public addOption(option: string): void {
      this.options.push(option);
      this.render();
    }
  
    public removeOption(index: number): void {
      if (index >= 0 && index < this.options.length) {
        this.options.splice(index, 1);
        
        // Reset selection if removed option was selected
        if (this.selectedOption === index) {
          this.selectedOption = null;
        } else if (this.selectedOption !== null && this.selectedOption > index) {
          this.selectedOption--;
        }
        
        this.render();
      }
    }
  
    public disable(): void {
      const buttons = this.container.querySelectorAll('.radio-option-button');
      buttons.forEach(button => {
        (button as HTMLButtonElement).disabled = true;
        button.classList.add('radio-disabled');
      });
    }
  
    public enable(): void {
      const buttons = this.container.querySelectorAll('.radio-option-button');
      buttons.forEach(button => {
        (button as HTMLButtonElement).disabled = false;
        button.classList.remove('radio-disabled');
      });
    }
  }
  
  // Export for module usage
  export default RadioComponent;