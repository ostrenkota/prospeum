import { TestBed } from '@angular/core/testing';

import { QuestionnaireService } from './questionnaire.service';
import { BackendApiService } from './backend-api.service';
import Mocked = jest.Mocked;
import { map, of, skip, throwError, timer } from 'rxjs';
import { mockQuestionnaire, mockQuestionnaire2 } from './mock-questionnaire';

describe('QuestionnaireService', () => {
  let service: QuestionnaireService;
  let apiServiceMock: Mocked<BackendApiService>;

  beforeEach(() => {
    apiServiceMock = {
      getQuestionnaire: jest.fn(),
      postQuestionnaire: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: BackendApiService,
          useValue: apiServiceMock,
        },
      ],
    });
    service = TestBed.inject(QuestionnaireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should download data from backend', () => {
    apiServiceMock.getQuestionnaire.mockReturnValue(of(mockQuestionnaire));
    service.questionnaire$.subscribe();
    expect(apiServiceMock.getQuestionnaire).toHaveBeenCalledTimes(1);
  });

  it('should download data from backend only once', () => {
    apiServiceMock.getQuestionnaire.mockReturnValue(of(mockQuestionnaire));

    service.questionnaire$.subscribe();
    service.questionnaire$.subscribe();

    expect(apiServiceMock.getQuestionnaire).toHaveBeenCalledTimes(1);
  });

  it('should post data to backend when updated', (done) => {
    apiServiceMock.getQuestionnaire.mockReturnValue(of([]));
    apiServiceMock.postQuestionnaire.mockReturnValue(of(mockQuestionnaire));

    let emitsNumber = 0;
    service.questionnaire$.subscribe((v) => {
      // first emit should contain data returned from apiServiceMock.getQuestionnaire
      if (emitsNumber === 0) {
        expect(v).toEqual([]);
        emitsNumber = emitsNumber + 1;

        // other emits should contain data returned from apiServiceMock.postQuestionnaire
      } else {
        expect(v).toEqual(mockQuestionnaire);
        done();
      }
    });

    service.updateQuestionnaireData(mockQuestionnaire);

    expect(apiServiceMock.postQuestionnaire).toHaveBeenCalledTimes(1);
    expect(apiServiceMock.postQuestionnaire).toHaveBeenCalledWith(
      mockQuestionnaire
    );
  });

  it('should handle backend errors when first loading the form', (done) => {
    apiServiceMock.getQuestionnaire.mockReturnValue(throwError(() => 'Error!'));
    window.alert = jest.fn();
    console.error = () => {};

    service.questionnaire$.subscribe((v) => {
      expect(v).toBe(null);
      done();
    });

    expect(window.alert).toHaveBeenCalledWith("Can't download the form");
  });

  it('should handle backend errors when post the form', (done) => {
    apiServiceMock.getQuestionnaire.mockReturnValue(of([]));
    apiServiceMock.postQuestionnaire.mockReturnValue(
      throwError(() => 'Error!')
    );
    window.alert = jest.fn();
    console.error = () => {};

    service.questionnaire$.pipe(skip(1)).subscribe((v) => {
      expect(v).toBe(mockQuestionnaire);
      done();
    });

    service.updateQuestionnaireData(mockQuestionnaire);

    expect(window.alert).toHaveBeenCalledWith(
      'Something went wrong, please try again later'
    );
  });

  it('should cancel uncompleted prev request if next request is received', (done) => {
    apiServiceMock.getQuestionnaire.mockReturnValue(of([]));
    apiServiceMock.postQuestionnaire.mockImplementation((v) =>
      timer(200).pipe(map(() => v))
    );

    service.questionnaire$.pipe(skip(1)).subscribe((v) => {
      expect(v).toBe(mockQuestionnaire2);
      done();
    });

    service.updateQuestionnaireData(mockQuestionnaire);
    setTimeout(() => service.updateQuestionnaireData(mockQuestionnaire2), 100);
  });
});
