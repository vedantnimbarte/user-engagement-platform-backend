interface StarRatingOptions {
    minLabel?: string;
    maxLabel?: string;
    maxStars?: number;
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
  
  class StarRatingComponent {
    private minLabel: string;
    private maxLabel: string;
    private maxStars: number;
    private questionId: string;
    private surveyId: string;
    private selectedRating: number | null = null;
    private hoveredRating: number | null = null;
    private container: HTMLElement;
    private onRatingChange: (rating: number | null) => void;
  
    constructor(options: StarRatingOptions) {
      this.minLabel = options.minLabel || 'Not satisfied';
      this.maxLabel = options.maxLabel || 'Satisfied';
      this.maxStars = options.maxStars || 5;
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
  
    private generateStars(): number[] {
      return Array.from({ length: this.maxStars }, (_, i) => i + 1);
    }
  
    private handleStarSelect(value: number): void {
      this.selectedRating = value;
      this.updateVisualState();
      this.onRatingChange(value);
      this.dispatchSurveyAnswer();
    }
  
    private handleStarHover(value: number | null): void {
      this.hoveredRating = value;
      this.updateVisualState();
    }
  
    private updateVisualState(): void {
      const starButtons = this.container.querySelectorAll('.star-rating-button');
      const currentRating = this.hoveredRating || this.selectedRating;
      
      starButtons.forEach((button, index) => {
        const buttonElement = button as HTMLElement;
        const starValue = index + 1;
        
        // Remove all state classes
        buttonElement.classList.remove('star-rating-active', 'star-rating-inactive');
        
        if (currentRating !== null && starValue <= currentRating) {
          buttonElement.classList.add('star-rating-active');
        } else {
          buttonElement.classList.add('star-rating-inactive');
        }
      });
    }
  
    private dispatchSurveyAnswer(): void {
      if (this.selectedRating !== null) {
        const event: SurveyAnswerEvent = new CustomEvent('SurvayAnswer', {
          detail: {
            questionId: this.questionId,
            answer: this.selectedRating,
            surveyId: this.surveyId
          }
        }) as SurveyAnswerEvent;
        
        document.dispatchEvent(event);
      }
    }
  
    private createStarSVG(): string {
      return `
        <svg
          height="35"
          width="35"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 277.56 277.56"
          class="star-rating-icon"
        >
          <g>
            <path d="M147.415,13.699l28.522,57.795c4.77,9.671,17.291,18.77,27.968,20.32l63.784,9.268 c10.671,1.55,13.065,8.909,5.341,16.437l-46.145,44.986c-7.723,7.528-12.504,22.246-10.682,32.879l10.889,63.528 c1.822,10.633-4.438,15.18-13.984,10.16l-57.045-29.996c-9.546-5.02-25.025-5.02-34.571,0l-57.045,29.996 c-9.546,5.015-15.806,0.468-13.984-10.16l10.894-63.528c1.822-10.633-2.959-25.351-10.682-32.879L4.53,117.52 c-7.723-7.528-5.33-14.892,5.341-16.437l63.784-9.268c10.671-1.55,23.192-10.65,27.968-20.32l28.506-57.795 C134.905,4.023,142.639,4.023,147.415,13.699z"></path>
          </g>
        </svg>
      `;
    }
  
    private render(): void {
      const stars = this.generateStars();
      
      const starsHTML = stars.map((value) => `
        <button
          type="button"
          class="star-rating-button star-rating-inactive"
          data-value="${value}"
        >
          ${this.createStarSVG()}
        </button>
      `).join('');
  
      this.container.innerHTML = `
        <div class="star-rating-component">
          <div class="star-rating-container">
            ${starsHTML}
          </div>
          
          <!-- Min/Max Labels -->
          <div class="star-rating-labels">
            <span class="star-rating-label-min">${this.minLabel}</span>
            <span class="star-rating-label-max">${this.maxLabel}</span>
          </div>
        </div>
      `;
  
      this.attachEventListeners();
    }
  
    private attachEventListeners(): void {
      const starButtons = this.container.querySelectorAll('.star-rating-button');
      
      starButtons.forEach((button) => {
        const buttonElement = button as HTMLElement;
        const value = parseInt(buttonElement.dataset.value || '0');
        
        buttonElement.addEventListener('click', () => {
          this.handleStarSelect(value);
        });
        
        buttonElement.addEventListener('mouseenter', () => {
          this.handleStarHover(value);
        });
        
        buttonElement.addEventListener('mouseleave', () => {
          this.handleStarHover(null);
        });
        
        // Add keyboard support
        buttonElement.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.handleStarSelect(value);
          }
          
          // Arrow key navigation
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            const direction = e.key === 'ArrowRight' ? 1 : -1;
            const newValue = Math.max(1, Math.min(this.maxStars, value + direction));
            const nextButton = this.container.querySelector(`[data-value="${newValue}"]`) as HTMLElement;
            if (nextButton) {
              nextButton.focus();
            }
          }
        });
      });
    }
  
    public getSelectedRating(): number | null {
      return this.selectedRating;
    }
  
    public setSelectedRating(rating: number | null): void {
      if (rating === null || (rating >= 1 && rating <= this.maxStars)) {
        this.selectedRating = rating;
        this.updateVisualState();
        this.onRatingChange(rating);
      }
    }
  
    public reset(): void {
      this.selectedRating = null;
      this.hoveredRating = null;
      this.updateVisualState();
      this.onRatingChange(null);
    }
  
    public updateMaxStars(maxStars: number): void {
      this.maxStars = maxStars;
      this.selectedRating = null;
      this.hoveredRating = null;
      this.render();
    }
  
    public updateLabels(minLabel: string, maxLabel: string): void {
      this.minLabel = minLabel;
      this.maxLabel = maxLabel;
      
      const minLabelElement = this.container.querySelector('.star-rating-label-min') as HTMLElement;
      const maxLabelElement = this.container.querySelector('.star-rating-label-max') as HTMLElement;
      
      if (minLabelElement) minLabelElement.textContent = minLabel;
      if (maxLabelElement) maxLabelElement.textContent = maxLabel;
    }
  
    public disable(): void {
      const starButtons = this.container.querySelectorAll('.star-rating-button');
      starButtons.forEach(button => {
        (button as HTMLButtonElement).disabled = true;
        button.classList.add('star-rating-disabled');
      });
    }
  
    public enable(): void {
      const starButtons = this.container.querySelectorAll('.star-rating-button');
      starButtons.forEach(button => {
        (button as HTMLButtonElement).disabled = false;
        button.classList.remove('star-rating-disabled');
      });
    }
  
    public getRatingCategory(): string | null {
      if (this.selectedRating === null) return null;
      
      const percentage = (this.selectedRating / this.maxStars) * 100;
      
      if (percentage <= 20) return 'Very Poor';
      if (percentage <= 40) return 'Poor';
      if (percentage <= 60) return 'Average';
      if (percentage <= 80) return 'Good';
      return 'Excellent';
    }
  
    public getRatingPercentage(): number | null {
      if (this.selectedRating === null) return null;
      return Math.round((this.selectedRating / this.maxStars) * 100);
    }
  }
  
  // Export for module usage
  export default StarRatingComponent;