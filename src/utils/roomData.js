import roomDataA from './roomDataA.js';
import roomDataB from './roomDataB.js';
import roomDataC from './roomDataC.js';
import roomDataE from './roomDataE.js';

export default [
  {
    label: '翠苑三区',
    value: '翠苑三区',
    key: 'areas',
    children: [
      {
        label: 'A片区',
        value: 'A',
        key: 'region',
        children: roomDataA
      },
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
      },
      {
        label: 'E片区',
        value: 'E',
        key: 'region',
        children: roomDataE
      }
    ]
  }
];
