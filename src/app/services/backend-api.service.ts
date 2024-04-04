import { Injectable } from '@angular/core';
import { IQuestionnaire } from '../models/questionnaire.interface';
import { map, Observable, timer } from 'rxjs';

const mockedData: IQuestionnaire = [
  {
    id: 1,
    sort_id: 1,
    title: 'Question 1',
    type: 'single_choice',
    options: [
      {
        id: 1,
        verbose_name: 'Option 1',
        value: 'value 1',
      },
      {
        id: 2,
        verbose_name: 'Option 2',
        value: 'value 2',
      },
      {
        id: 3,
        verbose_name: 'Option 3',
        value: 'value 3',
      },
    ],
    condition: null,
    is_triggered: true,
  },
  {
    id: 2,
    sort_id: 2,
    title: 'Question 2',
    type: 'multiple_choice',
    options: [
      {
        id: 1,
        verbose_name: 'Option 1',
        value: 'value 1',
      },
      {
        id: 2,
        verbose_name: 'Option 2',
        value: 'value 2',
      },
      {
        id: 3,
        verbose_name: 'Option 3',
        value: 'value 3',
      },
    ],
    condition: [
      {
        question: 1,
        value: 3,
      },
    ],
    is_triggered: false,
    answer: [2],
  },
  {
    id: 3,
    sort_id: 3,
    title: 'Question 3',
    type: 'multi_line_text',
    condition: [
      {
        question: 1,
        value: 3,
      },
      {
        question: 2,
        value: [2, 3],
      },
    ],
    is_triggered: false,
    answer: [],
  },
];

// Mock backend api service
@Injectable({
  providedIn: 'root',
})
export class BackendApiService {
  public getQuestionnaire(): Observable<IQuestionnaire> {
    // simulate an async backend request
    return timer(500).pipe(map(() => mockedData));
  }

  public postQuestionnaire(
    questionnaire: IQuestionnaire
  ): Observable<IQuestionnaire> {
    const newQuestionnaire = questionnaire.map((question) => {
      let is_triggered = true;
      if (question.condition) {
        is_triggered = question.condition.every((c) => {
          const currentAnswer = questionnaire.find(
            (q) => q.id === c.question
          )?.answer;

          // Case "all elements in answer array should exactly match the condition", e.g. answer [1,2,3] is NOT suitable
          // for condition [1,2]
          /* return (
            currentAnswer !== undefined &&
            JSON.stringify(currentAnswer) === JSON.stringify(c.value)
          );*/

          // Case "all elements in answer array should be included in the condition array", e.g. answer [1,2,3]
          // is suitable for condition [1,2]
          if (Array.isArray(currentAnswer) && Array.isArray(c.value)) {
            return c.value.every((x) =>
              (currentAnswer as number[]).includes(x)
            );
          } else {
            return (
              currentAnswer !== undefined &&
              currentAnswer.toString() === c.value.toString()
            );
          }
        });
      }
      return {
        ...question,
        is_triggered,
      };
    });

    // simulate an async backend request
    return timer(300).pipe(map(() => newQuestionnaire));
  }
}
