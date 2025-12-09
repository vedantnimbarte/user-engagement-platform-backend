interface MultipleChoiceOptions {
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
  
  class MultipleChoiceComponent {
    private options: string[];
    private questionId: string;
    private surveyId: string;
    private selectedOption: number | null = null;
    private container: HTMLElement;
    private onSelectionChange: (selectedOption: string | null, selectedIndex: number | null) => void;
  
    constructor(options: MultipleChoiceOptions) {
      this.options = options.options || [
        'Search Engine',
        'Social Media',
        'Friend or Family',
        'Blog or Publication',
        'Advertisement',
        'Other'
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
  
    private handleOptionSelect(index: number): void {
      this.selectedOption = index;
      this.updateVisualState();
      this.notifySelectionChange();
      this.dispatchSurveyAnswer();
    }
  
    private updateVisualState(): void {
      const buttons = this.container.querySelectorAll('.multiplechoice-option-button');
      
      buttons.forEach((button, index) => {
        const buttonElement = button as HTMLElement;
        
        if (index === this.selectedOption) {
          buttonElement.classList.add('multiplechoice-option-selected');
          buttonElement.classList.remove('multiplechoice-option-unselected');
        } else {
          buttonElement.classList.remove('multiplechoice-option-selected');
          buttonElement.classList.add('multiplechoice-option-unselected');
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
  
    private render(): void {
      const optionsHTML = this.options.map((option, index) => `
        <button
          type="button"
          class="multiplechoice-option-button multiplechoice-option-unselected"
          data-index="${index}"
        >
          <span class="multiplechoice-option-text">${option}</span>
        </button>
      `).join('');
  
      this.container.innerHTML = `
        <div class="multiplechoice-component">
          ${optionsHTML}
        </div>
      `;
  
      this.attachEventListeners();
    }
  
    private attachEventListeners(): void {
      const buttons = this.container.querySelectorAll('.multiplechoice-option-button');
      
      buttons.forEach((button, index) => {
        button.addEventListener('click', () => {
          this.handleOptionSelect(index);
        });
        
        // Add keyboard support
        button.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.handleOptionSelect(index);
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
  }
  
  // Export for module usage
  export default MultipleChoiceComponent;