import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireFormComponent } from './questionnaire-form.component';
import { QuestionnaireService } from '../../services/questionnaire.service';
import Mocked = jest.Mocked;
import { Subject } from 'rxjs';
import { IQuestionnaire } from '../../models/questionnaire.interface';
import {
  mockQuestionnaire,
  mockQuestionnaire3,
} from '../../services/mock-questionnaire';

describe('QuestionnaireFormComponent', () => {
  let component: QuestionnaireFormComponent;
  let fixture: ComponentFixture<QuestionnaireFormComponent>;
  let questionnaireService: Mocked<
    QuestionnaireService & { questionnaire$: Subject<IQuestionnaire | null> }
  >;

  beforeEach(async () => {
    questionnaireService = {
      updateQuestionnaireData: jest.fn(),
      questionnaire$: new Subject<IQuestionnaire | null>(),
    } as unknown as Mocked<
      QuestionnaireService & { questionnaire$: Subject<IQuestionnaire | null> }
    >;

    await TestBed.configureTestingModule({
      imports: [QuestionnaireFormComponent],
      providers: [
        {
          provide: QuestionnaireService,
          useValue: questionnaireService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionnaireFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render Loading... when form is not fetched yet', () => {
    const template = fixture.nativeElement.querySelector(
      '.form__loading'
    ) as HTMLDivElement;
    expect(template).toBeTruthy();
  });

  it('should render form when data is fetched', () => {
    questionnaireService.questionnaire$.next([]);
    fixture.detectChanges();

    const template = fixture.nativeElement.querySelector(
      '.form-container'
    ) as HTMLDivElement;
    expect(template.childElementCount).toBe(1);
    expect(template.firstChild?.nodeName).toBe('FORM');
  });

  it('should display error if data was not fetched successfully', () => {
    questionnaireService.questionnaire$.next(null);
    fixture.detectChanges();
    const template = fixture.nativeElement.querySelector(
      '.form__loading-error'
    ) as HTMLDivElement;
    expect(template).toBeTruthy();
  });

  it('should parse json to form correctly', () => {
    questionnaireService.questionnaire$.next(mockQuestionnaire);

    expect(component.dynamicForm.value).toEqual({ '1': 2 });
  });

  it('should parse json to form correctly', () => {
    questionnaireService.questionnaire$.next(mockQuestionnaire3);

    expect(component.dynamicForm.value).toEqual({
      '1': 3,
      '2': [false, true, true],
      '3': '',
    });
  });

  it('should convert form to json correctly and post it to the service', () => {
    questionnaireService.questionnaire$.next(mockQuestionnaire3);

    component.dynamicForm.patchValue({
      '1': 2,
      '2': [true, true, true],
      '3': 'test',
    });

    const expected = [
      {
        ...mockQuestionnaire3[0],
        answer: 2,
      },
      {
        ...mockQuestionnaire3[1],
        answer: [1, 2, 3],
      },
      {
        ...mockQuestionnaire3[2],
        answer: ['test'],
      },
    ];

    expect(questionnaireService.updateQuestionnaireData).toHaveBeenCalledWith(
      expected as IQuestionnaire
    );
  });
});
