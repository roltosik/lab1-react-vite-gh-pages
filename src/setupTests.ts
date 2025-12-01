import { vi } from 'vitest'
import '@testing-library/jest-dom'

// Делаем псевдоним: jest -> vi
;(globalThis as any).jest = vi