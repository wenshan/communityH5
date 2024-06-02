import roomDataB from './roomDataB.js';
import roomDataC from './roomDataC.js';

export default [
  {
    label: '翠苑三区',
    value: '翠苑三区',
    key: 'areas',
    children: [
      {
        label: 'B片区',
        value: 'B',
        key: 'region',
        children: roomDataB
      },
      {
        label: 'C片区',
        value: 'C',
        key: 'region',
        children: roomDataC
      }
    ]
  }
];
