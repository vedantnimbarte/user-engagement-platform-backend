interface CESOptions {
    minLabel?: string;
    maxLabel?: string;
    minValue?: number;
    maxValue?: number;
    questionId: string;
    surveyId: string;
    containerId: string;
  }
  
  interface SurveyAnswerEvent extends CustomEvent {
    detail: {
      questionId: string;
      answer: number;
      surveyId: string;
    };
  }
  
  class CES {
    private minLabel: string;
    private maxLabel: string;
    private minValue: number;
    private maxValue: number;
    private questionId: string;
    private surveyId: string;
    private selectedValue: number | null = null;
    private container: HTMLElement;
  
    constructor(options: CESOptions) {
      this.minLabel = options.minLabel || 'Not likely';
      this.maxLabel = options.maxLabel || 'Extremely likely';
      this.minValue = options.minValue || 0;
      this.maxValue = options.maxValue || 10;
      this.questionId = options.questionId;
      this.surveyId = options.surveyId;
      
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
        0: 'ces-rating-0',
        1: 'ces-rating-1',
        2: 'ces-rating-2',
        3: 'ces-rating-3',
        4: 'ces-rating-4',
        5: 'ces-rating-5',
        6: 'ces-rating-6',
        7: 'ces-rating-7',
        8: 'ces-rating-8',
        9: 'ces-rating-9'
      };
      
      return colorMap[value] || 'ces-rating-10';
    }
  
    private handleRatingSelect(value: number): void {
      this.selectedValue = value;
      this.updateSelectedState();
      this.dispatchSurveyAnswer();
    }
  
    private updateSelectedState(): void {
      const buttons = this.container.querySelectorAll('.ces-rating-button');
      buttons.forEach((button) => {
        const buttonElement = button as HTMLButtonElement;
        const buttonValue = parseInt(buttonElement.dataset.value || '0');
        
        if (buttonValue === this.selectedValue) {
          buttonElement.classList.add('ces-rating-selected');
        } else {
          buttonElement.classList.remove('ces-rating-selected');
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
      
      // Create main container
      const mainDiv = document.createElement('div');
      mainDiv.className = 'ces-container';
      
      // Create rating scale container
      const ratingScaleDiv = document.createElement('div');
      ratingScaleDiv.className = 'ces-rating-scale';
      
      // Create rating buttons
      ratings.forEach((value) => {
        const button = document.createElement('button');
        button.className = `ces-rating-button ${this.getColorClass(value)}`;
        button.dataset.value = value.toString();
        button.textContent = value.toString();
        button.type = 'button';
        
        button.addEventListener('click', () => {
          this.handleRatingSelect(value);
        });
        
        ratingScaleDiv.appendChild(button);
      });
      
      // Create labels container
      const labelsDiv = document.createElement('div');
      labelsDiv.className = 'ces-labels';
      
      const minLabelSpan = document.createElement('span');
      minLabelSpan.className = 'ces-label-min';
      minLabelSpan.textContent = this.minLabel;
      
      const maxLabelSpan = document.createElement('span');
      maxLabelSpan.className = 'ces-label-max';
      maxLabelSpan.textContent = this.maxLabel;
      
      labelsDiv.appendChild(minLabelSpan);
      labelsDiv.appendChild(maxLabelSpan);
      
      // Append all elements
      mainDiv.appendChild(ratingScaleDiv);
      mainDiv.appendChild(labelsDiv);
      
      // Clear container and append new content
      this.container.innerHTML = '';
      this.container.appendChild(mainDiv);
    }
  
    public getSelectedValue(): number | null {
      return this.selectedValue;
    }
  
    public reset(): void {
      this.selectedValue = null;
      this.updateSelectedState();
    }
  }
  
  // Export for module usage
  export default CES;