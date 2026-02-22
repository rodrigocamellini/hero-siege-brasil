import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock(
  'react-router-dom',
  () => {
    const React = require('react');
    return {
      Routes: ({ children }) => React.createElement('div', null, children),
      Route: ({ element }) => element,
      Navigate: () => null,
    };
  },
  { virtual: true }
);

jest.mock('./NewDesign', () => {
  const React = require('react');
  return function NewDesign() {
    return React.createElement('div', null, 'Hero Siege Brasil');
  };
});

test('renderiza layout principal da aplicação', () => {
  render(<App />);
  const elements = screen.getAllByText(/Hero Siege Brasil/i);
  expect(elements.length).toBeGreaterThan(0);
});
