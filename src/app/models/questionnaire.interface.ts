export type IQuestionnaire = Array<
  IMultiLineQuestion | IMultipleChoiceQuestion | ISingleChoiceQuestion
>;

interface IBaseQuestion {
  id: number;
  sort_id: number;
  title: string;
  condition: null | Array<ICondition>;
  is_triggered: boolean;
}
interface IMultiLineQuestion extends IBaseQuestion {
  type: 'multi_line_text';
  answer?: Array<string>;
}

export interface IMultipleChoiceQuestion extends IBaseQuestion {
  type: 'multiple_choice';
  options: Array<IOption>;
  answer?: Array<number>;
}

interface ISingleChoiceQuestion extends IBaseQuestion {
  type: 'single_choice';
  options: Array<IOption>;
  answer?: number;
}

interface ICondition {
  question: number;
  value: Array<number> | number;
}

export interface IOption {
  id: number;
  verbose_name: string;
  value: string;
}
