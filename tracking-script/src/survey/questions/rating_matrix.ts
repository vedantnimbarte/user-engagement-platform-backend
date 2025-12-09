interface RatingMatrixOptions {
    questions?: string[];
    scaleLabels?: string[];
    scaleValues?: number[];
    questionId: string;
    surveyId: string;
    containerId: string;
    onRatingsChange?: (ratings: { [key: number]: number | null }) => void;
  }
  
  interface SurveyAnswerEvent extends CustomEvent {
    detail: {
      questionId: string;
      answer: { [key: string]: number };
      surveyId: string;
    };
  }
  
  class RatingMatrixComponent {
    private questions: string[];
    private scaleLabels: string[];
    private scaleValues: number[];
    private questionId: string;
    private surveyId: string;
    private ratings: { [key: number]: number | null } = {};
    private container: HTMLElement;
    private onRatingsChange: (ratings: { [key: number]: number | null }) => void;
  
    constructor(options: RatingMatrixOptions) {
      this.questions = options.questions || [
        'Ease of use',
        'Customer support', 
        'Value for money',
        'Overall satisfaction'
      ];
      this.scaleLabels = options.scaleLabels || ['Poor', 'Fair', 'Average', 'Good', 'Excellent'];
      this.scaleValues = options.scaleValues || [1, 2, 3, 4, 5];
      this.questionId = options.questionId;
      this.surveyId = options.surveyId;
      this.onRatingsChange = options.onRatingsChange || (() => {});
      
      const containerElement = document.getElementById(options.containerId);
      if (!containerElement) {
        throw new Error(`Container with id "${options.containerId}" not found`);
      }
      this.container = containerElement;
      
      // Initialize ratings state with null values for each question
      this.ratings = this.questions.reduce((acc, _, index) => {
        acc[index] = null;
        return acc;
      }, {} as { [key: number]: number | null });
      
      this.render();
    }
  
    private handleRatingSelect(questionIndex: number, value: number): void {
      this.ratings = {
        ...this.ratings,
        [questionIndex]: value
      };
      
      this.updateVisualState(questionIndex, value);
      this.onRatingsChange(this.ratings);
      this.dispatchSurveyAnswer();
    }
  
    private updateVisualState(questionIndex: number, selectedValue: number): void {
      const questionRow = this.container.querySelector(`[data-question-index="${questionIndex}"]`);
      if (!questionRow) return;
      
      const buttons = questionRow.querySelectorAll('.rating-matrix-button');
      buttons.forEach((button) => {
        const buttonElement = button as HTMLElement;
        const buttonValue = parseInt(buttonElement.dataset.value || '0');
        
        if (buttonValue === selectedValue) {
          buttonElement.classList.add('rating-matrix-selected');
        } else {
          buttonElement.classList.remove('rating-matrix-selected');
        }
      });
    }
  
    private getColorClass(value: number): string {
      const colorMap: { [key: number]: string } = {
        1: 'rating-matrix-value-1',
        2: 'rating-matrix-value-2', 
        3: 'rating-matrix-value-3',
        4: 'rating-matrix-value-4',
        5: 'rating-matrix-value-5'
      };
      
      return colorMap[value] || 'rating-matrix-value-5';
    }
  
    private dispatchSurveyAnswer(): void {
      // Only dispatch if at least one rating is provided
      const hasRatings = Object.values(this.ratings).some(rating => rating !== null);
      
      if (hasRatings) {
        // Convert ratings to a more readable format for the event
        const answersObject: { [key: string]: number } = {};
        Object.entries(this.ratings).forEach(([questionIndex, rating]) => {
          if (rating !== null) {
            const questionText = this.questions[parseInt(questionIndex)];
            answersObject[questionText] = rating;
          }
        });
        
        const event: SurveyAnswerEvent = new CustomEvent('SurvayAnswer', {
          detail: {
            questionId: this.questionId,
            answer: answersObject,
            surveyId: this.surveyId
          }
        }) as SurveyAnswerEvent;
        
        document.dispatchEvent(event);
      }
    }
  
    private render(): void {
      // Create table header
      const headerCells = this.scaleValues.map((value, index) => `
        <th class="rating-matrix-header-cell">
          ${this.scaleLabels[index] || value}
        </th>
      `).join('');
  
      // Create table rows for each question
      const questionRows = this.questions.map((question, qIndex) => {
        const ratingCells = this.scaleValues.map((value) => `
          <td class="rating-matrix-cell">
            <button
              type="button"
              class="rating-matrix-button ${this.getColorClass(value)}"
              data-question-index="${qIndex}"
              data-value="${value}"
            >
              <span class="rating-matrix-value">${value}</span>
            </button>
          </td>
        `).join('');
  
        const rowClass = qIndex % 2 === 0 ? 'rating-matrix-row-even' : 'rating-matrix-row-odd';
        
        return `
          <tr class="rating-matrix-row ${rowClass}" data-question-index="${qIndex}">
            <td class="rating-matrix-question-cell">
              ${question}
            </td>
            ${ratingCells}
          </tr>
        `;
      }).join('');
  
      this.container.innerHTML = `
        <div class="rating-matrix-component">
          <table class="rating-matrix-table">
            <thead>
              <tr class="rating-matrix-header-row">
                <th class="rating-matrix-question-header"></th>
                ${headerCells}
              </tr>
            </thead>
            <tbody>
              ${questionRows}
            </tbody>
          </table>
        </div>
      `;
  
      this.attachEventListeners();
    }
  
    private attachEventListeners(): void {
      const buttons = this.container.querySelectorAll('.rating-matrix-button');
      
      buttons.forEach((button) => {
        const buttonElement = button as HTMLElement;
        const questionIndex = parseInt(buttonElement.dataset.questionIndex || '0');
        const value = parseInt(buttonElement.dataset.value || '0');
        
        buttonElement.addEventListener('click', () => {
          this.handleRatingSelect(questionIndex, value);
        });
        
        // Add keyboard support
        buttonElement.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.handleRatingSelect(questionIndex, value);
          }
          
          // Arrow key navigation
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            const direction = e.key === 'ArrowRight' ? 1 : -1;
            const currentValueIndex = this.scaleValues.indexOf(value);
            const newValueIndex = Math.max(0, Math.min(this.scaleValues.length - 1, currentValueIndex + direction));
            const newValue = this.scaleValues[newValueIndex];
            
            const nextButton = this.container.querySelector(
              `[data-question-index="${questionIndex}"][data-value="${newValue}"]`
            ) as HTMLElement;
            if (nextButton) {
              nextButton.focus();
            }
          }
          
          if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            const direction = e.key === 'ArrowDown' ? 1 : -1;
            const newQuestionIndex = Math.max(0, Math.min(this.questions.length - 1, questionIndex + direction));
            
            const nextButton = this.container.querySelector(
              `[data-question-index="${newQuestionIndex}"][data-value="${value}"]`
            ) as HTMLElement;
            if (nextButton) {
              nextButton.focus();
            }
          }
        });
      });
    }
  
    public getRatings(): { [key: number]: number | null } {
      return { ...this.ratings };
    }
  
    public getRatingsWithQuestions(): { [key: string]: number | null } {
      const result: { [key: string]: number | null } = {};
      Object.entries(this.ratings).forEach(([questionIndex, rating]) => {
        const questionText = this.questions[parseInt(questionIndex)];
        result[questionText] = rating;
      });
      return result;
    }
  
    public setRating(questionIndex: number, value: number | null): void {
      if (questionIndex >= 0 && questionIndex < this.questions.length) {
        if (value === null || this.scaleValues.includes(value)) {
          this.ratings[questionIndex] = value;
          if (value !== null) {
            this.updateVisualState(questionIndex, value);
          } else {
            // Clear selection
            const questionRow = this.container.querySelector(`[data-question-index="${questionIndex}"]`);
            if (questionRow) {
              const buttons = questionRow.querySelectorAll('.rating-matrix-button');
              buttons.forEach(button => button.classList.remove('rating-matrix-selected'));
            }
          }
          this.onRatingsChange(this.ratings);
        }
      }
    }
  
    public reset(): void {
      this.ratings = this.questions.reduce((acc, _, index) => {
        acc[index] = null;
        return acc;
      }, {} as { [key: number]: number | null });
      
      // Remove all selected states
      const buttons = this.container.querySelectorAll('.rating-matrix-button');
      buttons.forEach(button => button.classList.remove('rating-matrix-selected'));
      
      this.onRatingsChange(this.ratings);
    }
  
    public getCompletionPercentage(): number {
      const totalQuestions = this.questions.length;
      const answeredQuestions = Object.values(this.ratings).filter(rating => rating !== null).length;
      return Math.round((answeredQuestions / totalQuestions) * 100);
    }
  
    public getAverageRating(): number | null {
      const validRatings = Object.values(this.ratings).filter(rating => rating !== null) as number[];
      if (validRatings.length === 0) return null;
      
      const sum = validRatings.reduce((total, rating) => total + rating, 0);
      return Math.round((sum / validRatings.length) * 10) / 10; // Round to 1 decimal place
    }
  
    public updateQuestions(newQuestions: string[]): void {
      this.questions = [...newQuestions];
      this.ratings = this.questions.reduce((acc, _, index) => {
        acc[index] = null;
        return acc;
      }, {} as { [key: number]: number | null });
      this.render();
    }
  
    public updateScale(newLabels: string[], newValues: number[]): void {
      this.scaleLabels = [...newLabels];
      this.scaleValues = [...newValues];
      this.reset(); // Reset ratings since scale changed
      this.render();
    }
  
    public disable(): void {
      const buttons = this.container.querySelectorAll('.rating-matrix-button');
      buttons.forEach(button => {
        (button as HTMLButtonElement).disabled = true;
        button.classList.add('rating-matrix-disabled');
      });
    }
  
    public enable(): void {
      const buttons = this.container.querySelectorAll('.rating-matrix-button');
      buttons.forEach(button => {
        (button as HTMLButtonElement).disabled = false;
        button.classList.remove('rating-matrix-disabled');
      });
    }
  }
  
  // Export for module usage
  export default RatingMatrixComponent;