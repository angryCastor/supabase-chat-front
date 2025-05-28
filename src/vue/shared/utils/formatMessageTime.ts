import { format } from 'fecha'

export default (date: Date) =>
  format(date, 'HH:mm D MMM', {
    monthNamesShort: [
      'янв',
      'фев',
      'март',
      'апр',
      'май',
      'июнь',
      'июль',
      'авг',
      'сен',
      'окт',
      'ноя',
      'дек',
    ],
  })
