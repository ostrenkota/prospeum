import { Injectable } from '@angular/core';
import { BackendApiService } from './backend-api.service';
import { IQuestionnaire } from '../models/questionnaire.interface';
import { BehaviorSubject, shareReplay, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuestionnaireService {
  private _questionnaire$ = new BehaviorSubject<IQuestionnaire | null>(null);

  public questionnaire$ = this._questionnaire$.pipe(
    switchMap((v) => {
      if (v) {
        return this.mockBackendService.postQuestionnaire(v);
      } else {
        return this.mockBackendService.getQuestionnaire();
      }
    }),
    shareReplay(1)
  );
  constructor(private readonly mockBackendService: BackendApiService) {}

  public updateQuestionnaireData(questionnaire: IQuestionnaire) {
    this._questionnaire$.next(questionnaire);
  }
}
