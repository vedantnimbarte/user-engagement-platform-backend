interface SurveyContainerOptions {
    containerId: string;
    showBranding?: boolean;
    brandingText?: string;
    brandingUrl?: string;
  }
  
  interface SurveySection {
    title?: string;
    description?: string;
    illustration?: string;
    content?: string;
  }
  
  class SurveyContainerComponent {
    private containerId: string;
    private showBranding: boolean;
    private brandingText: string;
    private brandingUrl: string;
    private container: HTMLElement;
    private sections: SurveySection[] = [];
  
    constructor(options: SurveyContainerOptions) {
      this.containerId = options.containerId;
      this.showBranding = options.showBranding !== false; // Default to true
      this.brandingText = options.brandingText || 'Powered by SurveyTool';
      this.brandingUrl = options.brandingUrl || '#';
      
      const containerElement = document.getElementById(options.containerId);
      if (!containerElement) {
        throw new Error(`Container with id "${options.containerId}" not found`);
      }
      this.container = containerElement;
      
      this.render();
    }
  
    private createTitle(title: string): string {
      return `<h2 class="survey-container-title">${title}</h2>`;
    }
  
    private createDescription(description: string): string {
      return `<p class="survey-container-description">${description}</p>`;
    }
  
    private createSection(section: SurveySection): string {
      let sectionContent = '';
      
      if (section.title) {
        sectionContent += this.createTitle(section.title);
      }
      
      if (section.description) {
        sectionContent += this.createDescription(section.description);
      }
      
      if (section.content) {
        sectionContent += section.content;
      }
      
      return `<div class="survey-container-section">${sectionContent}</div>`;
    }
  
    private createIllustration(illustration: SurveySection): string {
      let illustrationContent = '';
      
      if (illustration.title) {
        illustrationContent += this.createTitle(illustration.title);
      }
      
      if (illustration.description) {
        illustrationContent += this.createDescription(illustration.description);
      }
      
      if (illustration.content) {
        illustrationContent += illustration.content;
      }
      
      return `<div class="survey-container-illustration">${illustrationContent}</div>`;
    }
  
    private createBranding(): string {
      if (!this.showBranding) return '';
      
      return `
        <div class="survey-container-branding">
          <a href="${this.brandingUrl}" class="survey-container-branding-link" target="_blank" rel="noopener noreferrer">
            ${this.brandingText}
          </a>
        </div>
      `;
    }
  
    private render(): void {
      const sectionsHTML = this.sections.map(section => {
        if (section.illustration) {
          return this.createIllustration(section);
        } else {
          return this.createSection(section);
        }
      }).join('');
  
      this.container.innerHTML = `
        <div class="survey-container">
          <div class="survey-container-content">
            ${sectionsHTML}
          </div>
          ${this.createBranding()}
        </div>
      `;
    }
  
    public addTitle(title: string): SurveyContainerComponent {
      this.sections.push({ title });
      this.render();
      return this;
    }
  
    public addDescription(description: string): SurveyContainerComponent {
      this.sections.push({ description });
      this.render();
      return this;
    }
  
    public addSection(section: SurveySection): SurveyContainerComponent {
      this.sections.push(section);
      this.render();
      return this;
    }
  
    public addIllustration(illustration: SurveySection): SurveyContainerComponent {
      this.sections.push({ ...illustration, illustration: 'true' });
      this.render();
      return this;
    }
  
    public addCustomContent(content: string): SurveyContainerComponent {
      this.sections.push({ content });
      this.render();
      return this;
    }
  
    public addComponentContainer(elementId: string, title?: string, description?: string): SurveyContainerComponent {
      const content = `<div id="${elementId}"></div>`;
      this.sections.push({ title, description, content });
      this.render();
      return this;
    }
  
    public clear(): SurveyContainerComponent {
      this.sections = [];
      this.render();
      return this;
    }
  
    public updateBranding(text: string, url?: string): SurveyContainerComponent {
      this.brandingText = text;
      if (url) this.brandingUrl = url;
      this.render();
      return this;
    }
  
    public toggleBranding(show: boolean): SurveyContainerComponent {
      this.showBranding = show;
      this.render();
      return this;
    }
  
    public getContainer(): HTMLElement {
      return this.container;
    }
  
    public getElementById(id: string): HTMLElement | null {
      return this.container.querySelector(`#${id}`);
    }
  
    // Static helper methods for creating content
    public static createQuestionSection(questionId: string, title: string, description?: string): SurveySection {
      const content = `<div id="${questionId}"></div>`;
      return { title, description, content };
    }
  
    public static createWelcomeSection(title: string, description: string, illustration?: string): SurveySection {
      return { title, description, content: illustration };
    }
  
    public static createThankYouSection(title: string, description: string): SurveySection {
      return { title, description, illustration: 'true' };
    }
  
    // Chainable methods for fluent interface
    public withTitle(title: string): SurveyContainerComponent {
      return this.addTitle(title);
    }
  
    public withDescription(description: string): SurveyContainerComponent {
      return this.addDescription(description);
    }
  
    public withSection(section: SurveySection): SurveyContainerComponent {
      return this.addSection(section);
    }
  
    public withQuestion(questionId: string, title: string, description?: string): SurveyContainerComponent {
      return this.addComponentContainer(questionId, title, description);
    }
  
    public withCustomContent(content: string): SurveyContainerComponent {
      return this.addCustomContent(content);
    }
  
    public withBranding(text: string, url?: string): SurveyContainerComponent {
      return this.updateBranding(text, url);
    }
  
    public withoutBranding(): SurveyContainerComponent {
      return this.toggleBranding(false);
    }
  }
  
  // Export for module usage
  export default SurveyContainerComponent;