import { Injectable } from '@angular/core';
import { IQuestionnaire } from '../models/questionnaire.interface';
import { map, Observable, timer } from 'rxjs';
import { mockQuestionnaire } from './mock-questionnaire';

// Mock backend api service
@Injectable({
  providedIn: 'root',
})
export class BackendApiService {
  public getQuestionnaire(): Observable<IQuestionnaire> {
    // simulate an async backend request
    return timer(500).pipe(map(() => mockQuestionnaire));
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
          return (
            currentAnswer !== undefined &&
            JSON.stringify(currentAnswer) === JSON.stringify(c.value)
          );

          // Case "all elements in answer array should be included in the condition array", e.g. answer [1,2,3]
          // is suitable for condition [1,2]
          /*if (Array.isArray(currentAnswer) && Array.isArray(c.value)) {
            return c.value.every((x) =>
              (currentAnswer as number[]).includes(x)
            );
          } else {
            return (
              currentAnswer !== undefined &&
              currentAnswer.toString() === c.value.toString()
            );
          }*/
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
