import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
} from '@angular/core';
import { QuestionnaireService } from '../../services/questionnaire.service';
import {
  IMultipleChoiceQuestion,
  IQuestionnaire,
} from '../../models/questionnaire.interface';
import { AsyncPipe } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormRecord,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { exhaustiveCheck } from '../../utils/types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type FormControlQSingle = FormControl<number | null>;
type FormControlQMultiLine = FormControl<string>;
type FormControlQMulti = FormArray<FormControl<boolean>>;

@Component({
  selector: 'app-questionnaire-form',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: './questionnaire-form.component.html',
  styleUrl: './questionnaire-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionnaireFormComponent implements OnInit {
  public questionnaire: IQuestionnaire = [];
  public dynamicForm = new FormRecord<
    FormControlQSingle | FormControlQMultiLine | FormControlQMulti
  >({});
  public formIsLoading = true;
  public formLoadingError = false;

  constructor(
    private readonly questionnaireService: QuestionnaireService,
    private readonly fb: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
    private readonly destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.questionnaireService.questionnaire$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((questionnaire) => {
        this.formIsLoading = false;

        if (!questionnaire) {
          this.formLoadingError = true;
          this.cdr.markForCheck();
          return;
        }

        this.questionnaire = questionnaire;

        this.updateFormControls();
        this.cdr.markForCheck();
      });

    this.dynamicForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.questionnaireService.updateQuestionnaireData(
          this.convertFormToQuestionnaire(value)
        );
      });
  }

  public onSubmit() {
    alert(JSON.stringify(this.dynamicForm.value));
  }

  public getFormArray(id: number) {
    return this.dynamicForm.get(id.toString()) as FormArray<
      FormControl<boolean>
    >;
  }

  private updateFormControls() {
    this.questionnaire.forEach((question) => {
      const stringId = question.id.toString();

      if (!question.is_triggered) {
        this.dynamicForm.removeControl(stringId, { emitEvent: false });
        return;
      }

      switch (question.type) {
        case 'multiple_choice':
          this.dynamicForm.addControl(
            stringId,
            this.generateFormArray(question),
            { emitEvent: false }
          );
          break;
        case 'single_choice':
          this.dynamicForm.addControl(
            stringId,
            this.fb.control(question.answer || null, {
              validators: [Validators.required],
            }),
            { emitEvent: false }
          );
          break;
        case 'multi_line_text':
          this.dynamicForm.addControl(
            stringId,
            this.fb.nonNullable.control(question.answer?.[0] || '', {
              validators: [Validators.required],
            }),
            { emitEvent: false }
          );
          break;
        default:
          exhaustiveCheck(question);
      }
    });
  }
  private convertFormToQuestionnaire(
    formValues: (typeof this.dynamicForm)['value']
  ): IQuestionnaire {
    return this.questionnaire.map((question) => {
      const answerFormValue = formValues[question.id.toString()];

      // control is not registered yet
      if (answerFormValue === undefined) {
        return {
          ...question,
          answer: undefined,
        };
      }

      switch (question.type) {
        case 'multiple_choice': {
          const answer = (answerFormValue as boolean[])
            .map((checked: boolean, index: number) => checked && index + 1)
            .filter(Boolean) as number[];
          return {
            ...question,
            answer,
          };
        }
        case 'single_choice':
          return {
            ...question,
            answer: answerFormValue as number,
          };
        case 'multi_line_text':
          return {
            ...question,
            answer: [answerFormValue] as string[],
          };
        default:
          exhaustiveCheck(question);
      }
    });
  }

  private generateFormArray(
    question: IMultipleChoiceQuestion
  ): FormArray<FormControl<boolean>> {
    const arr = question.options.map((option) => {
      return this.fb.nonNullable.control(
        !!question.answer?.includes(option.id)
      );
    });
    return this.fb.array(arr);
  }
}
