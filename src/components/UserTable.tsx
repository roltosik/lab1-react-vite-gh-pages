import { useState } from 'react'

type User = {
  id: number
  name: string
  email: string
  phone: string
  website: string
}

const CACHE_KEY = 'usersCache'
const CACHE_TTL_MS = 60_000 // 1 минута

type UsersCache = {
  timestamp: number
  data: User[]
}

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cacheHint, setCacheHint] = useState<string | null>(null)

  const loadFromCacheIfFresh = (): boolean => {
    try {
      const raw = localStorage.getItem(CACHE_KEY)
      if (!raw) return false

      const parsed = JSON.parse(raw) as UsersCache
      const isFresh = Date.now() - parsed.timestamp < CACHE_TTL_MS

      if (!isFresh) {
        return false
      }

      setUsers(parsed.data)
      setCacheHint('Данные из кэша')
      return true
    } catch {
      // битый кэш игнорируем
      return false
    }
  }

  const handleLoadUsers = async () => {
    setError(null)
    setCacheHint(null)

    // 1. Пытаемся прочитать свежий кэш
    const loadedFromCache = loadFromCacheIfFresh()
    if (loadedFromCache) {
      return
    }

    // 2. Кэш устарел или отсутствует — грузим с API
    setIsLoading(true)
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users')
      if (!response.ok) {
        throw new Error('Ошибка при загрузке')
      }

      const data = (await response.json()) as User[]
      setUsers(data)

      const cache: UsersCache = {
        timestamp: Date.now(),
        data,
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Ошибка при загрузке'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearCache = () => {
    localStorage.removeItem(CACHE_KEY)
    setCacheHint(null)
  }

  return (
    <div className="user-table-container">
      <button onClick={handleLoadUsers} disabled={isLoading}>
        Загрузить пользователей
      </button>

      <button
        type="button"
        onClick={handleClearCache}
        style={{ marginLeft: '8px' }}
      >
        Очистить кэш
      </button>

      {isLoading && <p>Загрузка...</p>}

      {cacheHint && (
        <p style={{ color: 'gray' }}>
          {cacheHint}
        </p>
      )}

      {error && (
        <p style={{ color: 'red' }}>
          {error}
        </p>
      )}

      {users.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Имя</th>
              <th>Email</th>
              <th>Телефон</th>
              <th>Сайт</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.website}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default UserTable
