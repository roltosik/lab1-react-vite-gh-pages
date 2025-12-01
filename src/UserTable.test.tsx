import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, beforeEach, vi, expect } from 'vitest'
import UserTable from './components/UserTable'

describe('UserTable with cache', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // сбрасываем fetch мок
    globalThis.fetch = vi.fn() as any
    // чистим localStorage
    localStorage.clear()
  })

  test('loads users from fresh cache without calling fetch', async () => {
    const mockUsers = [
      {
        id: 1,
        name: 'Иван Иванов',
        email: 'ivan@example.com',
        phone: '+7 (999) 123-45-67',
        website: 'example.com',
      },
    ]

    const cache = {
      timestamp: Date.now(), // свежий
      data: mockUsers,
    }

    localStorage.setItem('usersCache', JSON.stringify(cache))

    render(<UserTable />)

    fireEvent.click(screen.getByText(/загрузить пользователей/i))

    // fetch не должен вызываться
    expect(globalThis.fetch).not.toHaveBeenCalled()

    // данные из кэша должны появиться в таблице
    expect(await screen.findByText(/иван иванов/i)).toBeInTheDocument()
    expect(screen.getByText(/данные из кэша/i)).toBeInTheDocument()
  })

  test('clears cache when "Очистить кэш" is clicked', () => {
    localStorage.setItem('usersCache', JSON.stringify({ timestamp: Date.now(), data: [] }))

    render(<UserTable />)

    fireEvent.click(screen.getByText(/очистить кэш/i))

    expect(localStorage.getItem('usersCache')).toBeNull()
  })
})
