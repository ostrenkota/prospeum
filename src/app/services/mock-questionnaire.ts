import { IQuestionnaire } from '../models/questionnaire.interface';

export const mockQuestionnaire: IQuestionnaire = [
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
    answer: 2,
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

export const mockQuestionnaire2: IQuestionnaire = [
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
    answer: 2,
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
];

export const mockQuestionnaire3: IQuestionnaire = [
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
    answer: 3,
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
    is_triggered: true,
    answer: [2, 3],
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
    is_triggered: true,
    answer: [],
  },
];
