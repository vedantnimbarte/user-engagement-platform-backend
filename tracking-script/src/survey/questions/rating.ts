interface RatingOptions {
    maxRating?: number;
    ratingType?: 'stars' | 'numbers' | 'hearts' | 'thumbs';
    allowHalfRatings?: boolean;
    showLabels?: boolean;
    labels?: string[];
    size?: 'small' | 'medium' | 'large';
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
  
  class RatingComponent {
    private maxRating: number;
    private ratingType: 'stars' | 'numbers' | 'hearts' | 'thumbs';
    private allowHalfRatings: boolean;
    private showLabels: boolean;
    private labels: string[];
    private size: 'small' | 'medium' | 'large';
    private questionId: string;
    private surveyId: string;
    private selectedRating: number | null = null;
    private hoverRating: number | null = null;
    private container: HTMLElement;
    private onRatingChange: (rating: number | null) => void;
  
    constructor(options: RatingOptions) {
      this.maxRating = options.maxRating || 5;
      this.ratingType = options.ratingType || 'stars';
      this.allowHalfRatings = options.allowHalfRatings || false;
      this.showLabels = options.showLabels || false;
      this.labels = options.labels || ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
      this.size = options.size || 'medium';
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
  
    private handleRatingClick(rating: number): void {
      this.selectedRating = rating;
      this.updateVisualState();
      this.onRatingChange(rating);
      this.dispatchSurveyAnswer();
    }
  
    private handleRatingHover(rating: number | null): void {
      this.hoverRating = rating;
      this.updateVisualState();
    }
  
    private updateVisualState(): void {
      const ratingItems = this.container.querySelectorAll('.rating-item');
      const currentRating = this.hoverRating || this.selectedRating || 0;
      
      ratingItems.forEach((item, index) => {
        const itemElement = item as HTMLElement;
        const itemRating = index + 1;
        
        // Remove all state classes
        itemElement.classList.remove('rating-active', 'rating-inactive', 'rating-half');
        
        if (itemRating <= currentRating) {
          itemElement.classList.add('rating-active');
        } else if (this.allowHalfRatings && itemRating - 0.5 === currentRating) {
          itemElement.classList.add('rating-half');
        } else {
          itemElement.classList.add('rating-inactive');
        }
      });
      
      // Update label if shown
      if (this.showLabels) {
        const label = this.container.querySelector('.rating-label') as HTMLElement;
        if (label && currentRating > 0) {
          const labelIndex = Math.ceil(currentRating) - 1;
          label.textContent = this.labels[labelIndex] || '';
          label.style.display = 'block';
        } else if (label) {
          label.style.display = 'none';
        }
      }
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
  
    private createRatingIcon(type: string): string {
      switch (type) {
        case 'stars':
          return `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            </svg>
          `;
        case 'hearts':
          return `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.84 4.61A5.5 5.5 0 0 0 16.5 2.5C15.03 2.5 13.67 3.24 12.73 4.38C11.79 3.24 10.43 2.5 8.96 2.5A5.5 5.5 0 0 0 4.62 4.61C3.47 5.75 2.77 7.26 2.77 8.92C2.77 10.58 3.47 12.09 4.62 13.23L12 20.5L19.38 13.23C20.53 12.09 21.23 10.58 21.23 8.92C21.23 7.26 20.53 5.75 19.84 4.61Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            </svg>
          `;
        case 'thumbs':
          return `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10V20H21V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M14 10V7A3 3 0 0 0 11 4L7 10V20H21L23 16V10H19L17 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M1 10H5V20H1V10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          `;
        case 'numbers':
        default:
          return '';
      }
    }
  
    private render(): void {
      const sizeClass = `rating-${this.size}`;
      const typeClass = `rating-${this.ratingType}`;
      
      let ratingsHTML = '';
      
      for (let i = 1; i <= this.maxRating; i++) {
        if (this.ratingType === 'numbers') {
          ratingsHTML += `
            <button
              type="button"
              class="rating-item rating-number ${sizeClass} rating-inactive"
              data-rating="${i}"
            >
              ${i}
            </button>
          `;
        } else {
          ratingsHTML += `
            <button
              type="button"
              class="rating-item rating-icon ${sizeClass} ${typeClass} rating-inactive"
              data-rating="${i}"
            >
              ${this.createRatingIcon(this.ratingType)}
            </button>
          `;
        }
      }
  
      this.container.innerHTML = `
        <div class="rating-component ${sizeClass} ${typeClass}">
          <div class="rating-container">
            ${ratingsHTML}
          </div>
          ${this.showLabels ? '<div class="rating-label" style="display: none;"></div>' : ''}
        </div>
      `;
  
      this.attachEventListeners();
    }
  
    private attachEventListeners(): void {
      const ratingItems = this.container.querySelectorAll('.rating-item');
      
      ratingItems.forEach((item) => {
        const itemElement = item as HTMLElement;
        const rating = parseInt(itemElement.dataset.rating || '0');
        
        itemElement.addEventListener('click', () => {
          this.handleRatingClick(rating);
        });
        
        itemElement.addEventListener('mouseenter', () => {
          this.handleRatingHover(rating);
        });
        
        itemElement.addEventListener('mouseleave', () => {
          this.handleRatingHover(null);
        });
        
        // Keyboard support
        itemElement.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.handleRatingClick(rating);
          }
          
          // Arrow key navigation
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            const direction = e.key === 'ArrowRight' ? 1 : -1;
            const newRating = Math.max(1, Math.min(this.maxRating, rating + direction));
            const nextItem = this.container.querySelector(`[data-rating="${newRating}"]`) as HTMLElement;
            if (nextItem) {
              nextItem.focus();
            }
          }
        });
      });
    }
  
    public getRating(): number | null {
      return this.selectedRating;
    }
  
    public setRating(rating: number | null): void {
      if (rating === null || (rating >= 1 && rating <= this.maxRating)) {
        this.selectedRating = rating;
        this.updateVisualState();
        this.onRatingChange(rating);
      }
    }
  
    public reset(): void {
      this.selectedRating = null;
      this.hoverRating = null;
      this.updateVisualState();
      this.onRatingChange(null);
    }
  
    public updateMaxRating(maxRating: number): void {
      this.maxRating = maxRating;
      this.selectedRating = null;
      this.render();
    }
  
    public updateLabels(labels: string[]): void {
      this.labels = labels;
      this.updateVisualState();
    }
  
    public disable(): void {
      const ratingItems = this.container.querySelectorAll('.rating-item');
      ratingItems.forEach(item => {
        (item as HTMLButtonElement).disabled = true;
        item.classList.add('rating-disabled');
      });
    }
  
    public enable(): void {
      const ratingItems = this.container.querySelectorAll('.rating-item');
      ratingItems.forEach(item => {
        (item as HTMLButtonElement).disabled = false;
        item.classList.remove('rating-disabled');
      });
    }
  
    public getRatingCategory(): string | null {
      if (this.selectedRating === null) return null;
      
      const percentage = (this.selectedRating / this.maxRating) * 100;
      
      if (percentage <= 20) return 'Poor';
      if (percentage <= 40) return 'Fair';
      if (percentage <= 60) return 'Good';
      if (percentage <= 80) return 'Very Good';
      return 'Excellent';
    }
  }
  
  // Export for module usage
  export default RatingComponent;