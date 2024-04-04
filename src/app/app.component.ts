import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { QuestionnaireFormComponent } from './components/questionnaire-form/questionnaire-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [QuestionnaireFormComponent],
  template: '<app-questionnaire-form></app-questionnaire-form>',
})
export class AppComponent {}
