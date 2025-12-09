interface OpenTextOptions {
    placeholder?: string;
    maxLength?: number;
    rows?: number;
    questionId: string;
    surveyId: string;
    containerId: string;
    onTextChange?: (text: string) => void;
  }
  
  interface SurveyAnswerEvent extends CustomEvent {
    detail: {
      questionId: string;
      answer: string;
      surveyId: string;
    };
  }
  
  class OpenTextComponent {
    private placeholder: string;
    private maxLength: number;
    private rows: number;
    private questionId: string;
    private surveyId: string;
    private text: string = '';
    private container: HTMLElement;
    private onTextChange: (text: string) => void;
  
    constructor(options: OpenTextOptions) {
      this.placeholder = options.placeholder || 'Type your answer here...';
      this.maxLength = options.maxLength || 500;
      this.rows = options.rows || 4;
      this.questionId = options.questionId;
      this.surveyId = options.surveyId;
      this.onTextChange = options.onTextChange || (() => {});
      
      const containerElement = document.getElementById(options.containerId);
      if (!containerElement) {
        throw new Error(`Container with id "${options.containerId}" not found`);
      }
      this.container = containerElement;
      
      this.render();
    }
  
    private handleTextChange(e: Event): void {
      const target = e.target as HTMLTextAreaElement;
      const value = target.value;
      
      if (value.length <= this.maxLength) {
        this.text = value;
        this.updateCharacterCounter();
        this.onTextChange(value);
        
        // Dispatch survey answer for non-empty text
        if (value.trim().length > 0) {
          this.dispatchSurveyAnswer();
        }
      } else {
        // Prevent exceeding max length
        target.value = this.text;
      }
    }
  
    private updateCharacterCounter(): void {
      const counter = this.container.querySelector('.opentext-counter') as HTMLElement;
      if (counter) {
        counter.textContent = `${this.text.length}/${this.maxLength} characters`;
        
        // Add visual feedback when approaching limit
        if (this.text.length > this.maxLength * 0.9) {
          counter.classList.add('opentext-counter-warning');
        } else {
          counter.classList.remove('opentext-counter-warning');
        }
      }
    }
  
    private dispatchSurveyAnswer(): void {
      if (this.text.trim().length > 0) {
        const event: SurveyAnswerEvent = new CustomEvent('SurvayAnswer', {
          detail: {
            questionId: this.questionId,
            answer: this.text.trim(),
            surveyId: this.surveyId
          }
        }) as SurveyAnswerEvent;
        
        document.dispatchEvent(event);
      }
    }
  
    private render(): void {
      this.container.innerHTML = `
        <div class="opentext-component">
          <textarea
            class="opentext-textarea"
            placeholder="${this.placeholder}"
            rows="${this.rows}"
            maxlength="${this.maxLength}"
          >${this.text}</textarea>
          
          <!-- Character Counter -->
          <div class="opentext-footer">
            <span class="opentext-counter">${this.text.length}/${this.maxLength} characters</span>
          </div>
        </div>
      `;
  
      this.attachEventListeners();
    }
  
    private attachEventListeners(): void {
      const textarea = this.container.querySelector('.opentext-textarea') as HTMLTextAreaElement;
      
      if (textarea) {
        textarea.addEventListener('input', (e) => this.handleTextChange(e));
        textarea.addEventListener('paste', (e) => {
          // Handle paste events to respect max length
          setTimeout(() => this.handleTextChange(e), 0);
        });
        
        // Auto-resize textarea based on content
        textarea.addEventListener('input', () => {
          this.autoResize(textarea);
        });
      }
    }
  
    private autoResize(textarea: HTMLTextAreaElement): void {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  
    public getText(): string {
      return this.text;
    }
  
    public setText(text: string): void {
      if (text.length <= this.maxLength) {
        this.text = text;
        const textarea = this.container.querySelector('.opentext-textarea') as HTMLTextAreaElement;
        if (textarea) {
          textarea.value = text;
          this.autoResize(textarea);
        }
        this.updateCharacterCounter();
        this.onTextChange(text);
      }
    }
  
    public reset(): void {
      this.text = '';
      const textarea = this.container.querySelector('.opentext-textarea') as HTMLTextAreaElement;
      if (textarea) {
        textarea.value = '';
        textarea.style.height = 'auto';
      }
      this.updateCharacterCounter();
      this.onTextChange('');
    }
  
    public focus(): void {
      const textarea = this.container.querySelector('.opentext-textarea') as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
      }
    }
  
    public getWordCount(): number {
      return this.text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }
  
    public getRemainingCharacters(): number {
      return this.maxLength - this.text.length;
    }
  
    public updatePlaceholder(placeholder: string): void {
      this.placeholder = placeholder;
      const textarea = this.container.querySelector('.opentext-textarea') as HTMLTextAreaElement;
      if (textarea) {
        textarea.placeholder = placeholder;
      }
    }
  
    public updateMaxLength(maxLength: number): void {
      this.maxLength = maxLength;
      const textarea = this.container.querySelector('.opentext-textarea') as HTMLTextAreaElement;
      if (textarea) {
        textarea.maxLength = maxLength;
      }
      this.updateCharacterCounter();
    }
  }
  
  // Export for module usage
  export default OpenTextComponent;