interface EmailFormData {
    name: string;
    email: string;
  }
  
  interface EmailErrors {
    name?: string;
    email?: string;
  }
  
  interface EmailOptions {
    buttonLabel?: string;
    isAnswerRequired?: boolean;
    showBackButton?: boolean;
    placeholder?: string;
    fieldName?: string;
    questionId: string;
    surveyId: string;
    containerId: string;
    onSubmit?: (data: EmailFormData | null) => void;
  }
  
  interface SurveyAnswerEvent extends CustomEvent {
    detail: {
      questionId: string;
      answer: EmailFormData;
      surveyId: string;
    };
  }
  
  class EmailComponent {
    private buttonLabel: string;
    private isAnswerRequired: boolean;
    private showBackButton: boolean;
    private placeholder: string;
    private fieldName: string;
    private questionId: string;
    private surveyId: string;
    private formData: EmailFormData = { name: '', email: '' };
    private errors: EmailErrors = {};
    private submitted: boolean = false;
    private container: HTMLElement;
    private onSubmit: (data: EmailFormData | null) => void;
  
    constructor(options: EmailOptions) {
      this.buttonLabel = options.buttonLabel || 'Submit';
      this.isAnswerRequired = options.isAnswerRequired || false;
      this.showBackButton = options.showBackButton || false;
      this.placeholder = options.placeholder || '';
      this.fieldName = options.fieldName || 'Email';
      this.questionId = options.questionId;
      this.surveyId = options.surveyId;
      this.onSubmit = options.onSubmit || (() => {});
      
      const containerElement = document.getElementById(options.containerId);
      if (!containerElement) {
        throw new Error(`Container with id "${options.containerId}" not found`);
      }
      this.container = containerElement;
      
      this.render();
    }
  
    private validateEmail(email: string): boolean {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  
    private validateForm(): boolean {
      const newErrors: EmailErrors = {};
  
      if (this.fieldName.toLowerCase().includes('name') && !this.formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
  
      if (!this.formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!this.validateEmail(this.formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
  
      this.errors = newErrors;
      this.updateErrorDisplay();
      return Object.keys(newErrors).length === 0;
    }
  
    private handleChange(e: Event): void {
      const target = e.target as HTMLInputElement;
      const { name, value } = target;
      
      this.formData = {
        ...this.formData,
        [name]: value
      };
  
      // Clear error when user types
      if (this.errors[name as keyof EmailErrors]) {
        this.errors = {
          ...this.errors,
          [name]: undefined
        };
        this.updateErrorDisplay();
      }
    }
  
    private handleSubmit(e: Event): void {
      e.preventDefault();
  
      const isValidated = this.isAnswerRequired ? this.validateForm() : true;
  
      if (isValidated) {
        this.onSubmit(this.formData);
        this.submitted = true;
        this.errors = {};
        this.updateErrorDisplay();
        this.dispatchSurveyAnswer();
      }
    }
  
    private handleBack(): void {
      this.onSubmit(null);
    }
  
    private updateErrorDisplay(): void {
      // Update email field error
      const emailInput = this.container.querySelector('#email') as HTMLInputElement;
      const emailError = this.container.querySelector('#email-error') as HTMLElement;
      
      if (emailInput) {
        if (this.errors.email) {
          emailInput.classList.add('email-input-error');
          emailInput.classList.remove('email-input-normal');
          if (emailError) {
            emailError.textContent = this.errors.email;
            emailError.style.display = 'block';
          }
        } else {
          emailInput.classList.remove('email-input-error');
          emailInput.classList.add('email-input-normal');
          if (emailError) {
            emailError.style.display = 'none';
          }
        }
      }
  
      // Update name field error if it exists
      const nameInput = this.container.querySelector('#name') as HTMLInputElement;
      const nameError = this.container.querySelector('#name-error') as HTMLElement;
      
      if (nameInput) {
        if (this.errors.name) {
          nameInput.classList.add('email-input-error');
          nameInput.classList.remove('email-input-normal');
          if (nameError) {
            nameError.textContent = this.errors.name;
            nameError.style.display = 'block';
          }
        } else {
          nameInput.classList.remove('email-input-error');
          nameInput.classList.add('email-input-normal');
          if (nameError) {
            nameError.style.display = 'none';
          }
        }
      }
    }
  
    private dispatchSurveyAnswer(): void {
      const event: SurveyAnswerEvent = new CustomEvent('SurvayAnswer', {
        detail: {
          questionId: this.questionId,
          answer: this.formData,
          surveyId: this.surveyId
        }
      }) as SurveyAnswerEvent;
      
      document.dispatchEvent(event);
    }
  
    private render(): void {
      const needsNameField = this.fieldName.toLowerCase().includes('name') || this.fieldName.toLowerCase().includes('contact');
      
      this.container.innerHTML = `
        <div class="email-component">
          <form class="email-form">
            ${needsNameField ? `
              <!-- Name field -->
              <div class="email-field-group">
                <label for="name" class="email-field-label">
                  Name ${this.isAnswerRequired ? '<span class="email-required">*</span>' : ''}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value="${this.formData.name}"
                  placeholder="Enter your full name"
                  class="email-input email-input-normal"
                />
                <p id="name-error" class="email-error-message" style="display: none;"></p>
              </div>
            ` : ''}
            
            <!-- Email field -->
            <div class="email-field-group">
              <label for="email" class="email-field-label">
                ${this.fieldName} ${this.isAnswerRequired ? '<span class="email-required">*</span>' : ''}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value="${this.formData.email}"
                placeholder="${this.placeholder || 'Enter your email address'}"
                class="email-input email-input-normal"
              />
              <p id="email-error" class="email-error-message" style="display: none;"></p>
            </div>
  
            <!-- Action buttons -->
            <div class="email-actions">
              ${this.showBackButton ? `
                <button type="button" class="email-back-btn">Back</button>
              ` : ''}
              <button type="submit" class="email-submit-btn">${this.buttonLabel}</button>
            </div>
          </form>
        </div>
      `;
  
      this.attachEventListeners();
    }
  
    private attachEventListeners(): void {
      const form = this.container.querySelector('.email-form') as HTMLFormElement;
      const nameInput = this.container.querySelector('#name') as HTMLInputElement;
      const emailInput = this.container.querySelector('#email') as HTMLInputElement;
      const backBtn = this.container.querySelector('.email-back-btn') as HTMLButtonElement;
  
      if (form) {
        form.addEventListener('submit', (e) => this.handleSubmit(e));
      }
  
      if (nameInput) {
        nameInput.addEventListener('input', (e) => this.handleChange(e));
        nameInput.addEventListener('blur', () => {
          if (this.isAnswerRequired) this.validateForm();
        });
      }
  
      if (emailInput) {
        emailInput.addEventListener('input', (e) => this.handleChange(e));
        emailInput.addEventListener('blur', () => {
          if (this.isAnswerRequired) this.validateForm();
        });
      }
  
      if (backBtn) {
        backBtn.addEventListener('click', () => this.handleBack());
      }
    }
  
    public getFormData(): EmailFormData {
      return { ...this.formData };
    }
  
    public setFormData(data: Partial<EmailFormData>): void {
      this.formData = { ...this.formData, ...data };
      
      // Update input values
      const nameInput = this.container.querySelector('#name') as HTMLInputElement;
      const emailInput = this.container.querySelector('#email') as HTMLInputElement;
      
      if (nameInput && data.name !== undefined) {
        nameInput.value = data.name;
      }
      
      if (emailInput && data.email !== undefined) {
        emailInput.value = data.email;
      }
    }
  
    public reset(): void {
      this.formData = { name: '', email: '' };
      this.errors = {};
      this.submitted = false;
      
      const nameInput = this.container.querySelector('#name') as HTMLInputElement;
      const emailInput = this.container.querySelector('#email') as HTMLInputElement;
      
      if (nameInput) nameInput.value = '';
      if (emailInput) emailInput.value = '';
      
      this.updateErrorDisplay();
    }
  
    public validate(): boolean {
      return this.validateForm();
    }
  
    public isValid(): boolean {
      if (!this.isAnswerRequired) return true;
      
      const emailValid = this.formData.email.trim() !== '' && this.validateEmail(this.formData.email);
      const nameValid = !this.fieldName.toLowerCase().includes('name') || this.formData.name.trim() !== '';
      
      return emailValid && nameValid;
    }
  }
  
  // Export for module usage
  export default EmailComponent;