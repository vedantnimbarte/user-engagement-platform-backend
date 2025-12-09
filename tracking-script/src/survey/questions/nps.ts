interface NPSOptions {
    title?: string;
    subtitle?: string;
    minLabel?: string;
    maxLabel?: string;
    minValue?: number;
    maxValue?: number;
    questionId: string;
    surveyId: string;
    containerId: string;
    onRatingChange?: (rating: number | null) => void;
  }
  
  interface SurveyAnswerEvent extends CustomEvent {
    detail: {
      questionId: string;
      answer: number;
      surveyId: string;
    };
  }
  
  class NPSComponent {
    private title: string;
    private subtitle: string;
    private minLabel: string;
    private maxLabel: string;
    private minValue: number;
    private maxValue: number;
    private questionId: string;
    private surveyId: string;
    private selectedValue: number | null = null;
    private container: HTMLElement;
    private onRatingChange: (rating: number | null) => void;
  
    constructor(options: NPSOptions) {
      this.title = options.title || 'How likely are you to recommend us to your friends or colleagues?';
      this.subtitle = options.subtitle || "We'd love to hear your honest feedback!";
      this.minLabel = options.minLabel || 'Not likely';
      this.maxLabel = options.maxLabel || 'Extremely likely';
      this.minValue = options.minValue || 0;
      this.maxValue = options.maxValue || 10;
      this.questionId = options.questionId;
      this.surveyId = options.surveyId;
      this.onRatingChange = options.onRatingChange || (() => {});
      
      const containerElement = document.getElementById(options.containerId);
      if (!containerElement) {
        throw new Error(`Container with id "${options.containerId}" not found`);
      }
      this.container = containerElement;
      
      this.render();
    }
  
    private generateRatings(): number[] {
      const length = this.maxValue - this.minValue + 1;
      return Array.from({ length }, (_, i) => this.minValue + i);
    }
  
    private getColorClass(value: number): string {
      const colorMap: { [key: number]: string } = {
        0: 'nps-rating-0',
        1: 'nps-rating-1',
        2: 'nps-rating-2',
        3: 'nps-rating-3',
        4: 'nps-rating-4',
        5: 'nps-rating-5',
        6: 'nps-rating-6',
        7: 'nps-rating-7',
        8: 'nps-rating-8',
        9: 'nps-rating-9'
      };
      
      return colorMap[value] || 'nps-rating-10';
    }
  
    private handleRatingSelect(value: number): void {
      this.selectedValue = value;
      this.updateSelectedState();
      this.onRatingChange(value);
      this.dispatchSurveyAnswer();
    }
  
    private updateSelectedState(): void {
      const buttons = this.container.querySelectorAll('.nps-rating-button');
      buttons.forEach((button) => {
        const buttonElement = button as HTMLButtonElement;
        const buttonValue = parseInt(buttonElement.dataset.value || '0');
        
        if (buttonValue === this.selectedValue) {
          buttonElement.classList.add('nps-rating-selected');
        } else {
          buttonElement.classList.remove('nps-rating-selected');
        }
      });
    }
  
    private dispatchSurveyAnswer(): void {
      if (this.selectedValue !== null) {
        const event: SurveyAnswerEvent = new CustomEvent('SurvayAnswer', {
          detail: {
            questionId: this.questionId,
            answer: this.selectedValue,
            surveyId: this.surveyId
          }
        }) as SurveyAnswerEvent;
        
        document.dispatchEvent(event);
      }
    }
  
    private render(): void {
      const ratings = this.generateRatings();
      
      this.container.innerHTML = `
        <div class="nps-container">
          <!-- Rating Scale -->
          <div class="nps-rating-scale">
            ${ratings.map(value => `
              <button
                type="button"
                class="nps-rating-button ${this.getColorClass(value)}"
                data-value="${value}"
              >
                ${value}
              </button>
            `).join('')}
          </div>
  
          <!-- Min/Max Labels -->
          <div class="nps-labels">
            <span class="nps-label-min">${this.minLabel}</span>
            <span class="nps-label-max">${this.maxLabel}</span>
          </div>
        </div>
      `;
  
      this.attachEventListeners();
    }
  
    private attachEventListeners(): void {
      const buttons = this.container.querySelectorAll('.nps-rating-button');
      
      buttons.forEach((button) => {
        const buttonElement = button as HTMLButtonElement;
        const value = parseInt(buttonElement.dataset.value || '0');
        
        buttonElement.addEventListener('click', () => {
          this.handleRatingSelect(value);
        });
        
        // Add keyboard support
        buttonElement.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.handleRatingSelect(value);
          }
        });
      });
    }
  
    public getSelectedValue(): number | null {
      return this.selectedValue;
    }
  
    public setSelectedValue(value: number | null): void {
      if (value === null || (value >= this.minValue && value <= this.maxValue)) {
        this.selectedValue = value;
        this.updateSelectedState();
        this.onRatingChange(value);
      }
    }
  
    public reset(): void {
      this.selectedValue = null;
      this.updateSelectedState();
      this.onRatingChange(null);
    }
  
    public getNPSCategory(): string | null {
      if (this.selectedValue === null) return null;
      
      if (this.selectedValue >= 0 && this.selectedValue <= 6) return 'Detractor';
      if (this.selectedValue >= 7 && this.selectedValue <= 8) return 'Passive';
      if (this.selectedValue >= 9 && this.selectedValue <= 10) return 'Promoter';
      
      return null;
    }
  
    public updateLabels(minLabel: string, maxLabel: string): void {
      this.minLabel = minLabel;
      this.maxLabel = maxLabel;
      
      const minLabelElement = this.container.querySelector('.nps-label-min') as HTMLElement;
      const maxLabelElement = this.container.querySelector('.nps-label-max') as HTMLElement;
      
      if (minLabelElement) minLabelElement.textContent = minLabel;
      if (maxLabelElement) maxLabelElement.textContent = maxLabel;
    }
  
    public updateRange(minValue: number, maxValue: number): void {
      this.minValue = minValue;
      this.maxValue = maxValue;
      this.selectedValue = null;
      this.render();
    }
  }
  
  // Export for module usage
  export default NPSComponent;