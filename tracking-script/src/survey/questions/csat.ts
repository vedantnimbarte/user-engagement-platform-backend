interface CSATOptions {
    title?: string;
    subtitle?: string;
    minLabel?: string;
    maxLabel?: string;
    minValue?: number;
    maxValue?: number;
    shape?: 'smile' | 'like' | 'number' | 'thumb' | '';
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
  
  type EmojiShape = 'smile' | 'like' | 'number' | 'thumb' | '';
  
  class CSAT {
    private title: string;
    private subtitle: string;
    private minLabel: string;
    private maxLabel: string;
    private minValue: number;
    private maxValue: number;
    private shape: EmojiShape;
    private questionId: string;
    private surveyId: string;
    private selectedValue: number | null = null;
    private container: HTMLElement;
  
    constructor(options: CSATOptions) {
      this.title = options.title || 'How satisfied are you with our service?';
      this.subtitle = options.subtitle || `We'd love to hear your honest feedback!`;
      this.minLabel = options.minLabel || 'Unsatisfied';
      this.maxLabel = options.maxLabel || 'Satisfied';
      this.minValue = options.minValue || 1;
      this.maxValue = options.maxValue || 5;
      this.shape = options.shape || 'smile';
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
        1: 'csat-rating-1',
        2: 'csat-rating-2',
        3: 'csat-rating-3',
        4: 'csat-rating-4',
        5: 'csat-rating-5'
      };
      
      return colorMap[value] || 'csat-rating-5';
    }
  
    private createEmojiSVG(shape: EmojiShape): SVGElement {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '37');
      svg.setAttribute('height', '37');
      svg.setAttribute('viewBox', '0 0 37 37');
      svg.setAttribute('fill', 'none');
  
      switch (shape) {
        case 'smile':
          return this.createEmojiOne(svg);
        case 'like':
          return this.createEmojiTwo(svg);
        case 'number':
          return this.createEmojiThree(svg);
        case 'thumb':
          return this.createEmojiFour(svg);
        default:
          return this.createEmojiFive(svg);
      }
    }
  
    private createEmojiOne(svg: SVGElement): SVGElement {
      // Sad face (red)
      const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path1.setAttribute('d', 'M18.6001 33.769C26.8844 33.769 33.6001 27.0533 33.6001 18.769C33.6001 10.4848 26.8844 3.76904 18.6001 3.76904C10.3158 3.76904 3.6001 10.4848 3.6001 18.769C3.6001 27.0533 10.3158 33.769 18.6001 33.769Z');
      path1.setAttribute('stroke', '#F55E53');
      path1.setAttribute('stroke-width', '1.5');
      path1.setAttribute('stroke-linejoin', 'round');
  
      const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path2.setAttribute('d', 'M11 26.269C12.3682 24.4474 13.9466 22 18.4001 22C22.8537 22 24.6319 24.4474 26 26.269');
      path2.setAttribute('stroke', '#F55E53');
      path2.setAttribute('stroke-width', '1.5');
      path2.setAttribute('stroke-linecap', 'round');
      path2.setAttribute('stroke-linejoin', 'round');
  
      const path3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path3.setAttribute('d', 'M12.6136 14.269H12.6001M24.6001 14.269H24.5866');
      path3.setAttribute('stroke', '#F55E53');
      path3.setAttribute('stroke-width', '3');
      path3.setAttribute('stroke-linecap', 'round');
      path3.setAttribute('stroke-linejoin', 'round');
  
      svg.appendChild(path1);
      svg.appendChild(path2);
      svg.appendChild(path3);
      return svg;
    }
  
    private createEmojiTwo(svg: SVGElement): SVGElement {
      // Slightly sad face (red)
      const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path1.setAttribute('d', 'M18.8003 33.769C27.0846 33.769 33.8003 27.0533 33.8003 18.769C33.8003 10.4848 27.0846 3.76904 18.8003 3.76904C10.516 3.76904 3.80029 10.4848 3.80029 18.769C3.80029 27.0533 10.516 33.769 18.8003 33.769Z');
      path1.setAttribute('stroke', '#F55E53');
      path1.setAttribute('stroke-width', '1.5');
      path1.setAttribute('stroke-linejoin', 'round');
  
      const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path2.setAttribute('d', 'M12.8003 26.269C14.1685 24.4474 16.3467 23.269 18.8003 23.269C21.2538 23.269 23.4321 24.4474 24.8003 26.269');
      path2.setAttribute('stroke', '#F55E53');
      path2.setAttribute('stroke-width', '1.5');
      path2.setAttribute('stroke-linejoin', 'round');
  
      const path3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path3.setAttribute('d', 'M12.8137 14.269H12.8003M24.8003 14.269H24.7868');
      path3.setAttribute('stroke', '#F55E53');
      path3.setAttribute('stroke-width', '3');
      path3.setAttribute('stroke-linecap', 'round');
      path3.setAttribute('stroke-linejoin', 'round');
  
      svg.appendChild(path1);
      svg.appendChild(path2);
      svg.appendChild(path3);
      return svg;
    }
  
    private createEmojiThree(svg: SVGElement): SVGElement {
      // Neutral face (yellow)
      svg.setAttribute('width', '36');
      
      const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path1.setAttribute('d', 'M18 33.769C26.2843 33.769 33 27.0533 33 18.769C33 10.4848 26.2843 3.76904 18 3.76904C9.71573 3.76904 3 10.4848 3 18.769C3 27.0533 9.71573 33.769 18 33.769Z');
      path1.setAttribute('stroke', '#E0A700');
      path1.setAttribute('stroke-width', '1.5');
      path1.setAttribute('stroke-linejoin', 'round');
  
      const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path2.setAttribute('d', 'M11.7137 14.269H11.7002M23.7002 14.269H23.6867');
      path2.setAttribute('stroke', '#E0A700');
      path2.setAttribute('stroke-width', '3');
      path2.setAttribute('stroke-linecap', 'round');
      path2.setAttribute('stroke-linejoin', 'round');
  
      const path3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path3.setAttribute('d', 'M12 24H24');
      path3.setAttribute('stroke', '#E0A700');
      path3.setAttribute('stroke-width', '1.5');
      path3.setAttribute('stroke-linejoin', 'round');
  
      svg.appendChild(path1);
      svg.appendChild(path2);
      svg.appendChild(path3);
      return svg;
    }
  
    private createEmojiFour(svg: SVGElement): SVGElement {
      // Happy face (light green)
      const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path1.setAttribute('d', 'M18.2002 33.769C26.4845 33.769 33.2002 27.0533 33.2002 18.769C33.2002 10.4848 26.4845 3.76904 18.2002 3.76904C9.91592 3.76904 3.2002 10.4848 3.2002 18.769C3.2002 27.0533 9.91592 33.769 18.2002 33.769Z');
      path1.setAttribute('stroke', '#89C560');
      path1.setAttribute('stroke-width', '1.5');
      path1.setAttribute('stroke-linecap', 'round');
      path1.setAttribute('stroke-linejoin', 'round');
  
      const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path2.setAttribute('d', 'M12.2002 23.269C13.5684 25.0906 15.7466 26.269 18.2002 26.269C20.6537 26.269 22.832 25.0906 24.2002 23.269');
      path2.setAttribute('stroke', '#89C560');
      path2.setAttribute('stroke-width', '1.5');
      path2.setAttribute('stroke-linecap', 'round');
      path2.setAttribute('stroke-linejoin', 'round');
  
      const path3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path3.setAttribute('d', 'M12.2137 14.269H12.2002M24.2002 14.269H24.1867');
      path3.setAttribute('stroke', '#89C560');
      path3.setAttribute('stroke-width', '3');
      path3.setAttribute('stroke-linecap', 'round');
      path3.setAttribute('stroke-linejoin', 'round');
  
      svg.appendChild(path1);
      svg.appendChild(path2);
      svg.appendChild(path3);
      return svg;
    }
  
    private createEmojiFive(svg: SVGElement): SVGElement {
      // Very happy face (green)
      const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path1.setAttribute('d', 'M18.4001 33.769C26.6844 33.769 33.4001 27.0533 33.4001 18.769C33.4001 10.4848 26.6844 3.76904 18.4001 3.76904C10.1159 3.76904 3.40015 10.4848 3.40015 18.769C3.40015 27.0533 10.1159 33.769 18.4001 33.769Z');
      path1.setAttribute('stroke', '#25D172');
      path1.setAttribute('stroke-width', '1.5');
      path1.setAttribute('stroke-linecap', 'round');
      path1.setAttribute('stroke-linejoin', 'round');
  
      const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path2.setAttribute('d', 'M11 22C12.3682 23.8216 13.9466 26.269 18.4001 26.269C22.8537 26.269 24.6319 23.8216 26 22');
      path2.setAttribute('stroke', '#25D172');
      path2.setAttribute('stroke-width', '1.5');
      path2.setAttribute('stroke-linecap', 'round');
      path2.setAttribute('stroke-linejoin', 'round');
  
      const path3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path3.setAttribute('d', 'M12.4136 14.269H12.4001M24.4001 14.269H24.3866');
      path3.setAttribute('stroke', '#25D172');
      path3.setAttribute('stroke-width', '3');
      path3.setAttribute('stroke-linecap', 'round');
      path3.setAttribute('stroke-linejoin', 'round');
  
      svg.appendChild(path1);
      svg.appendChild(path2);
      svg.appendChild(path3);
      return svg;
    }
  
    private handleRatingSelect(value: number): void {
      this.selectedValue = value;
      this.updateSelectedState();
      this.dispatchSurveyAnswer();
    }
  
    private updateSelectedState(): void {
      const buttons = this.container.querySelectorAll('.csat-rating-button');
      buttons.forEach((button) => {
        const buttonElement = button as HTMLButtonElement;
        const buttonValue = parseInt(buttonElement.dataset.value || '0');
        
        if (buttonValue === this.selectedValue) {
          buttonElement.classList.add('csat-rating-selected');
        } else {
          buttonElement.classList.remove('csat-rating-selected');
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
      mainDiv.className = 'csat-container';
      
      // Create rating scale container
      const ratingScaleDiv = document.createElement('div');
      ratingScaleDiv.className = 'csat-rating-scale';
      
      // Create rating buttons
      ratings.forEach((value) => {
        const button = document.createElement('button');
        button.className = `csat-rating-button ${this.getColorClass(value)}`;
        button.dataset.value = value.toString();
        button.type = 'button';
        
        // Create emoji container
        const emojiContainer = document.createElement('span');
        emojiContainer.className = 'csat-emoji-container';
        
        // Create and append emoji SVG
        const emojiSVG = this.createEmojiSVG(this.shape);
        emojiContainer.appendChild(emojiSVG);
        button.appendChild(emojiContainer);
        
        button.addEventListener('click', () => {
          this.handleRatingSelect(value);
        });
        
        ratingScaleDiv.appendChild(button);
      });
      
      // Create labels container
      const labelsDiv = document.createElement('div');
      labelsDiv.className = 'csat-labels';
      
      const minLabelSpan = document.createElement('span');
      minLabelSpan.className = 'csat-label-min';
      minLabelSpan.textContent = this.minLabel;
      
      const maxLabelSpan = document.createElement('span');
      maxLabelSpan.className = 'csat-label-max';
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
  export default CSAT;