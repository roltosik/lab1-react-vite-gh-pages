import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test } from 'vitest';
import Counter from './components/Counter.tsx';

test('renders initial counter value', () => {
  render(<Counter />);

  // Проверяем текст "count is 0"
  const buttonElement = screen.getByRole('button', { name: /count is 0/i });
  expect(buttonElement).toBeInTheDocument();
});

test('increments counter on click', () => {
  render(<Counter />);

  const buttonElement = screen.getByRole('button');

  // Один клик
  fireEvent.click(buttonElement);

  // Теперь должно быть "count is 1"
  expect(buttonElement).toHaveTextContent('count is 1');
});
