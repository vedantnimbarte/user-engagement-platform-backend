interface AttachmentFile {
    id: string;
    file: File;
    preview: string | null;
    name: string;
    size: number;
    type: string;
  }
  
  interface AttachmentOptions {
    acceptedFileTypes?: string;
    maxFileSize?: number; // in MB
    maxFiles?: number;
    buttonLabel?: string;
    showBackButton?: boolean;
    questionId: string;
    surveyId: string;
    containerId: string;
    onSubmit?: (files: File[] | null) => void;
    onFilesChange?: (files: File[]) => void;
  }
  
  interface SurveyAnswerEvent extends CustomEvent {
    detail: {
      questionId: string;
      answer: File[];
      surveyId: string;
    };
  }
  
  class Attachment {
    private acceptedFileTypes: string;
    private maxFileSize: number;
    private maxFiles: number;
    private buttonLabel: string;
    private showBackButton: boolean;
    private questionId: string;
    private surveyId: string;
    private files: AttachmentFile[] = [];
    private dragActive: boolean = false;
    private error: string = '';
    private container: HTMLElement;
    private onSubmit: (files: File[] | null) => void;
    private onFilesChange: (files: File[]) => void;
  
    constructor(options: AttachmentOptions) {
      this.acceptedFileTypes = options.acceptedFileTypes || 'image/*, .pdf, .doc, .docx';
      this.maxFileSize = options.maxFileSize || 5;
      this.maxFiles = options.maxFiles || 3;
      this.buttonLabel = options.buttonLabel || 'Submit';
      this.showBackButton = options.showBackButton || false;
      this.questionId = options.questionId;
      this.surveyId = options.surveyId;
      this.onSubmit = options.onSubmit || (() => {});
      this.onFilesChange = options.onFilesChange || (() => {});
      
      const containerElement = document.getElementById(options.containerId);
      if (!containerElement) {
        throw new Error(`Container with id "${options.containerId}" not found`);
      }
      this.container = containerElement;
      
      this.render();
    }
  
    private validateFile(file: File): boolean {
      // Check file size
      if (file.size > this.maxFileSize * 1024 * 1024) {
        this.error = `File too large. Maximum size is ${this.maxFileSize}MB.`;
        return false;
      }
  
      // Check if file type is accepted
      if (this.acceptedFileTypes !== '*') {
        const fileType = file.type;
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        const acceptedTypes = this.acceptedFileTypes
          .split(',')
          .map((type) => type.trim());
  
        if (
          !acceptedTypes.some(
            (type) =>
              type === fileType ||
              type === `${fileType.split('/')[0]}/*` ||
              type === fileExtension
          )
        ) {
          this.error = `File type not accepted. Please upload ${this.acceptedFileTypes}`;
          return false;
        }
      }
  
      return true;
    }
  
    private processFiles(fileList: FileList): void {
      if (this.files.length + fileList.length > this.maxFiles) {
        this.error = `Maximum ${this.maxFiles} files allowed.`;
        this.updateErrorDisplay();
        return;
      }
  
      this.error = '';
      const validFiles: AttachmentFile[] = [];
  
      Array.from(fileList).forEach((file) => {
        if (this.validateFile(file)) {
          validFiles.push({
            id: `file-${Date.now()}-${file.name}`,
            file,
            preview: file.type.startsWith('image/')
              ? URL.createObjectURL(file)
              : null,
            name: file.name,
            size: file.size,
            type: file.type,
          });
        }
      });
  
      if (validFiles.length) {
        this.files = [...this.files, ...validFiles];
        this.onFilesChange(this.files.map((f) => f.file));
        this.render();
      } else {
        this.updateErrorDisplay();
      }
    }
  
    private handleDrag = (e: DragEvent): void => {
      e.preventDefault();
      e.stopPropagation();
  
      if (e.type === 'dragenter' || e.type === 'dragover') {
        this.dragActive = true;
      } else if (e.type === 'dragleave') {
        this.dragActive = false;
      }
      this.updateDropZone();
    };
  
    private handleDrop = (e: DragEvent): void => {
      e.preventDefault();
      e.stopPropagation();
      this.dragActive = false;
  
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        this.processFiles(e.dataTransfer.files);
      }
    };
  
    private handleFileInput = (e: Event): void => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        this.processFiles(target.files);
      }
    };
  
    private removeFile(fileId: string): void {
      this.files = this.files.filter((f) => f.id !== fileId);
      this.onFilesChange(this.files.map((f) => f.file));
      this.render();
    }
  
    private getFileIcon(fileType: string): string {
      if (fileType.startsWith('image/')) {
        return `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 15L16 10L5 21" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `;
      } else if (fileType.includes('pdf')) {
        return `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 2V8H20" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 15H15" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 11H15" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `;
      } else if (fileType.includes('doc') || fileType.includes('word')) {
        return `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 2V8H20" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 13H8" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 17H8" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10 9H9H8" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `;
      } else {
        return `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 2V8H20" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `;
      }
    }
  
    private formatFileSize(bytes: number): string {
      if (bytes < 1024) return bytes + ' B';
      else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
      else return (bytes / 1048576).toFixed(1) + ' MB';
    }
  
    private updateDropZone(): void {
      const dropZone = this.container.querySelector('.attachment-drop-zone') as HTMLElement;
      if (dropZone) {
        dropZone.className = `attachment-drop-zone ${this.dragActive ? 'attachment-drop-zone-active' : ''} ${this.error ? 'attachment-drop-zone-error' : ''}`;
      }
    }
  
    private updateErrorDisplay(): void {
      const errorElement = this.container.querySelector('.attachment-error') as HTMLElement;
      if (errorElement) {
        if (this.error) {
          errorElement.textContent = this.error;
          errorElement.style.display = 'block';
        } else {
          errorElement.style.display = 'none';
        }
      }
    }
  
    private handleSubmit(): void {
      const fileArray = this.files.map((f) => f.file);
      this.onSubmit(fileArray);
      
      if (fileArray.length > 0) {
        // Dispatch survey answer event for file uploads
        const event: SurveyAnswerEvent = new CustomEvent('SurvayAnswer', {
          detail: {
            questionId: this.questionId,
            answer: fileArray,
            surveyId: this.surveyId
          }
        }) as SurveyAnswerEvent;
        
        document.dispatchEvent(event);
      }
    }
  
    private handleBack(): void {
      this.onSubmit(null);
    }
  
    private render(): void {
      this.container.innerHTML = `
        <div class="attachment-component">
          <!-- Drop Zone -->
          <div class="attachment-drop-zone ${this.dragActive ? 'attachment-drop-zone-active' : ''} ${this.error ? 'attachment-drop-zone-error' : ''}">
            <input type="file" class="attachment-file-input" ${this.maxFiles > 1 ? 'multiple' : ''} accept="${this.acceptedFileTypes}" />
            
            ${this.files.length === 0 ? `
              <div class="attachment-empty-state">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 13V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H13" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18 21V15" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M15 18H21" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p class="attachment-drag-text">Drag & drop your files here or</p>
                <button type="button" class="attachment-browse-btn">Browse files</button>
                <p class="attachment-info-text">Max ${this.maxFiles} files, up to ${this.maxFileSize}MB each</p>
              </div>
            ` : `
              <div class="attachment-file-list">
                ${this.files.map(file => `
                  <div class="attachment-file-item" data-file-id="${file.id}">
                    <div class="attachment-file-info">
                      ${file.preview ? `
                        <div class="attachment-file-preview">
                          <img src="${file.preview}" alt="${file.name}" class="attachment-preview-image" />
                        </div>
                      ` : `
                        <div class="attachment-file-icon">
                          ${this.getFileIcon(file.type)}
                        </div>
                      `}
                      <div class="attachment-file-details">
                        <p class="attachment-file-name">${file.name}</p>
                        <p class="attachment-file-size">${this.formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button type="button" class="attachment-remove-btn" data-file-id="${file.id}">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                `).join('')}
                
                ${this.files.length < this.maxFiles ? `
                  <button type="button" class="attachment-add-more-btn">Add more files</button>
                ` : ''}
              </div>
            `}
          </div>
  
          <!-- Action Buttons -->
          <div class="attachment-actions">
            ${this.showBackButton ? `
              <button type="button" class="attachment-back-btn">Back</button>
            ` : ''}
            <button type="button" class="attachment-submit-btn">${this.buttonLabel}</button>
          </div>
  
          <!-- Error Display -->
          <div class="attachment-error" style="display: none;"></div>
        </div>
      `;
  
      this.attachEventListeners();
    }
  
    private attachEventListeners(): void {
      const dropZone = this.container.querySelector('.attachment-drop-zone') as HTMLElement;
      const fileInput = this.container.querySelector('.attachment-file-input') as HTMLInputElement;
      const browsBtn = this.container.querySelector('.attachment-browse-btn');
      const addMoreBtn = this.container.querySelector('.attachment-add-more-btn');
      const submitBtn = this.container.querySelector('.attachment-submit-btn');
      const backBtn = this.container.querySelector('.attachment-back-btn');
      const removeButtons = this.container.querySelectorAll('.attachment-remove-btn');
  
      // Drag and drop events
      if (dropZone) {
        dropZone.addEventListener('dragenter', this.handleDrag);
        dropZone.addEventListener('dragleave', this.handleDrag);
        dropZone.addEventListener('dragover', this.handleDrag);
        dropZone.addEventListener('drop', this.handleDrop);
      }
  
      // File input change
      if (fileInput) {
        fileInput.addEventListener('change', this.handleFileInput);
      }
  
      // Browse and add more buttons
      [browsBtn, addMoreBtn].forEach(btn => {
        if (btn) {
          btn.addEventListener('click', () => fileInput?.click());
        }
      });
  
      // Submit button
      if (submitBtn) {
        submitBtn.addEventListener('click', () => this.handleSubmit());
      }
  
      // Back button
      if (backBtn) {
        backBtn.addEventListener('click', () => this.handleBack());
      }
  
      // Remove file buttons
      removeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const target = e.target as HTMLElement;
          const button = target.closest('.attachment-remove-btn') as HTMLButtonElement;
          const fileId = button?.dataset.fileId;
          if (fileId) {
            this.removeFile(fileId);
          }
        });
      });
    }
  
    public getFiles(): File[] {
      return this.files.map(f => f.file);
    }
  
    public reset(): void {
      // Clean up preview URLs
      this.files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
      
      this.files = [];
      this.error = '';
      this.dragActive = false;
      this.render();
    }
  
    public destroy(): void {
      // Clean up preview URLs
      this.files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    }
  }
  
  // Export for module usage
  export default Attachment;