interface CheckboxOptions {
    options?: string[];
    questionId: string;
    surveyId: string;
    containerId: string;
    allowMultiple?: boolean;
    onSelectionChange?: (selectedOptions: string[], selectedIndices: number[]) => void;
  }
  
  interface SurveyAnswerEvent extends CustomEvent {
    detail: {
      questionId: string;
      answer: string[];
      surveyId: string;
    };
  }
  
  class Checkbox {
    private options: string[];
    private questionId: string;
    private surveyId: string;
    private allowMultiple: boolean;
    private selectedOptions: { [key: number]: boolean } = {};
    private container: HTMLElement;
    private onSelectionChange: (selectedOptions: string[], selectedIndices: number[]) => void;
  
    constructor(options: CheckboxOptions) {
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
      this.allowMultiple = options.allowMultiple !== false; // Default to true
      this.onSelectionChange = options.onSelectionChange || (() => {});
      
      const containerElement = document.getElementById(options.containerId);
      if (!containerElement) {
        throw new Error(`Container with id "${options.containerId}" not found`);
      }
      this.container = containerElement;
      
      // Initialize all options as unselected
      this.selectedOptions = this.options.reduce((acc, _, index) => {
        acc[index] = false;
        return acc;
      }, {} as { [key: number]: boolean });
      
      this.render();
    }
  
    private handleOptionToggle(index: number): void {
      if (!this.allowMultiple) {
        // Single selection mode - clear all other selections
        Object.keys(this.selectedOptions).forEach(key => {
          this.selectedOptions[parseInt(key)] = false;
        });
        this.selectedOptions[index] = true;
      } else {
        // Multiple selection mode - toggle the clicked option
        this.selectedOptions[index] = !this.selectedOptions[index];
      }
      
      this.updateVisualState();
      this.notifySelectionChange();
      this.dispatchSurveyAnswer();
    }
  
    private updateVisualState(): void {
      const buttons = this.container.querySelectorAll('.checkbox-option-button');
      
      buttons.forEach((button, index) => {
        const buttonElement = button as HTMLElement;
        const checkbox = buttonElement.querySelector('.checkbox-visual') as HTMLElement;
        const checkmark = buttonElement.querySelector('.checkbox-checkmark') as HTMLElement;
        
        if (this.selectedOptions[index]) {
          buttonElement.classList.add('checkbox-option-selected');
          buttonElement.classList.remove('checkbox-option-unselected');
          checkbox.classList.add('checkbox-visual-selected');
          checkbox.classList.remove('checkbox-visual-unselected');
          if (checkmark) {
            checkmark.style.display = 'block';
          }
        } else {
          buttonElement.classList.remove('checkbox-option-selected');
          buttonElement.classList.add('checkbox-option-unselected');
          checkbox.classList.remove('checkbox-visual-selected');
          checkbox.classList.add('checkbox-visual-unselected');
          if (checkmark) {
            checkmark.style.display = 'none';
          }
        }
      });
    }
  
    private notifySelectionChange(): void {
      const selectedIndices = Object.keys(this.selectedOptions)
        .filter(key => this.selectedOptions[parseInt(key)])
        .map(key => parseInt(key));
      
      const selectedOptionTexts = selectedIndices.map(index => this.options[index]);
      
      this.onSelectionChange(selectedOptionTexts, selectedIndices);
    }
  
    private dispatchSurveyAnswer(): void {
      const selectedIndices = Object.keys(this.selectedOptions)
        .filter(key => this.selectedOptions[parseInt(key)])
        .map(key => parseInt(key));
      
      const selectedOptionTexts = selectedIndices.map(index => this.options[index]);
      
      if (selectedOptionTexts.length > 0) {
        const event: SurveyAnswerEvent = new CustomEvent('SurvayAnswer', {
          detail: {
            questionId: this.questionId,
            answer: selectedOptionTexts,
            surveyId: this.surveyId
          }
        }) as SurveyAnswerEvent;
        
        document.dispatchEvent(event);
      }
    }
  
    private createCheckmarkSVG(): string {
      return `
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 3L4.5 8.5L2 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
    }
  
    private render(): void {
      const optionsHTML = this.options.map((option, index) => `
        <button
          type="button"
          class="checkbox-option-button checkbox-option-unselected"
          data-index="${index}"
        >
          <div class="checkbox-visual checkbox-visual-unselected">
            <div class="checkbox-checkmark" style="display: none;">
              ${this.createCheckmarkSVG()}
            </div>
          </div>
          <span class="checkbox-option-text">${option}</span>
        </button>
      `).join('');
  
      this.container.innerHTML = `
        <div class="checkbox-component">
          ${optionsHTML}
        </div>
      `;
  
      this.attachEventListeners();
    }
  
    private attachEventListeners(): void {
      const buttons = this.container.querySelectorAll('.checkbox-option-button');
      
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
        });
      });
    }
  
    public getSelectedOptions(): string[] {
      const selectedIndices = Object.keys(this.selectedOptions)
        .filter(key => this.selectedOptions[parseInt(key)])
        .map(key => parseInt(key));
      
      return selectedIndices.map(index => this.options[index]);
    }
  
    public getSelectedIndices(): number[] {
      return Object.keys(this.selectedOptions)
        .filter(key => this.selectedOptions[parseInt(key)])
        .map(key => parseInt(key));
    }
  
    public setSelectedOptions(indices: number[]): void {
      // Clear all selections
      Object.keys(this.selectedOptions).forEach(key => {
        this.selectedOptions[parseInt(key)] = false;
      });
      
      // Set new selections
      indices.forEach(index => {
        if (index >= 0 && index < this.options.length) {
          this.selectedOptions[index] = true;
        }
      });
      
      this.updateVisualState();
      this.notifySelectionChange();
    }
  
    public reset(): void {
      Object.keys(this.selectedOptions).forEach(key => {
        this.selectedOptions[parseInt(key)] = false;
      });
      
      this.updateVisualState();
      this.notifySelectionChange();
    }
  
    public addOption(option: string): void {
      const newIndex = this.options.length;
      this.options.push(option);
      this.selectedOptions[newIndex] = false;
      this.render();
    }
  
    public removeOption(index: number): void {
      if (index >= 0 && index < this.options.length) {
        this.options.splice(index, 1);
        
        // Rebuild selectedOptions object with new indices
        const newSelectedOptions: { [key: number]: boolean } = {};
        this.options.forEach((_, newIndex) => {
          const oldIndex = newIndex >= index ? newIndex + 1 : newIndex;
          newSelectedOptions[newIndex] = this.selectedOptions[oldIndex] || false;
        });
        
        this.selectedOptions = newSelectedOptions;
        this.render();
      }
    }
  
    public updateOptions(newOptions: string[]): void {
      this.options = [...newOptions];
      this.selectedOptions = this.options.reduce((acc, _, index) => {
        acc[index] = false;
        return acc;
      }, {} as { [key: number]: boolean });
      
      this.render();
    }
  }
  
  // Export for module usage
  export default Checkbox;