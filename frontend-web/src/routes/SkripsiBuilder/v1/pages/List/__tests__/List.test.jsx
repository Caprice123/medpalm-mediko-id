import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import SkripsiList from '../index'
import skripsiReducer from '@store/skripsi/reducer'

// Mock navigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock actions
vi.mock('@store/skripsi/action', () => ({
  fetchSets: vi.fn(() => ({ type: 'MOCK_FETCH_SETS' })),
  createSet: vi.fn(() => ({ type: 'MOCK_CREATE_SET' })),
  deleteSet: vi.fn(() => ({ type: 'MOCK_DELETE_SET' })),
}))

describe('SkripsiList Component', () => {
  let store

  const createMockStore = (initialState = {}) => {
    return configureStore({
      reducer: {
        skripsi: skripsiReducer,
      },
      preloadedState: {
        skripsi: {
          sets: [],
          currentSet: null,
          currentTab: null,
          loading: {
            isSetsLoading: false,
            isSetLoading: false,
            isSendingMessage: false,
            isSavingContent: false,
          },
          pagination: {
            page: 1,
            perPage: 20,
            total: 0,
            totalPages: 0,
            isLastPage: false,
          },
          error: null,
          ...initialState,
        },
      },
    })
  }

  const renderWithProviders = (component, customStore = store) => {
    return render(
      <Provider store={customStore}>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </Provider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
    store = createMockStore()
  })

  it('should render loading state', () => {
    store = createMockStore({
      loading: { isSetsLoading: true },
    })

    renderWithProviders(<SkripsiList />)

    expect(screen.getByText(/memuat data/i)).toBeInTheDocument()
  })

  it('should render empty state when no sets', () => {
    renderWithProviders(<SkripsiList />)

    expect(screen.getByText(/belum ada set skripsi/i)).toBeInTheDocument()
    expect(screen.getByText(/mulai dengan membuat set baru/i)).toBeInTheDocument()
  })

  it('should render list of sets', () => {
    const mockSets = [
      {
        id: 1,
        title: 'Test Set 1',
        description: 'Description 1',
        created_at: new Date('2024-01-01').toISOString(),
        updated_at: new Date('2024-01-02').toISOString(),
      },
      {
        id: 2,
        title: 'Test Set 2',
        description: 'Description 2',
        created_at: new Date('2024-01-03').toISOString(),
        updated_at: new Date('2024-01-04').toISOString(),
      },
    ]

    store = createMockStore({ sets: mockSets })
    renderWithProviders(<SkripsiList />)

    expect(screen.getByText('Test Set 1')).toBeInTheDocument()
    expect(screen.getByText('Test Set 2')).toBeInTheDocument()
    expect(screen.getAllByText(/dibuat:/i)).toHaveLength(2)
    expect(screen.getAllByText(/diupdate:/i)).toHaveLength(2)
  })

  it('should open create modal when clicking create button', () => {
    renderWithProviders(<SkripsiList />)

    const createButton = screen.getByText(/buat set/i)
    fireEvent.click(createButton)

    expect(screen.getByText(/buat set baru/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/masukkan judul/i)).toBeInTheDocument()
  })

  it('should show validation when creating without title', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    renderWithProviders(<SkripsiList />)

    // Open modal
    const createButton = screen.getAllByText(/buat set/i)[0]
    fireEvent.click(createButton)

    // Click submit without entering title
    const submitButton = screen.getAllByText(/buat set/i)[1]
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Judul set tidak boleh kosong')
    })

    alertSpy.mockRestore()
  })

  it('should navigate to editor when clicking Buka button', () => {
    const mockSets = [
      {
        id: 1,
        title: 'Test Set',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    store = createMockStore({ sets: mockSets })
    renderWithProviders(<SkripsiList />)

    const bukaButton = screen.getByText(/buka/i)
    fireEvent.click(bukaButton)

    expect(mockNavigate).toHaveBeenCalledWith('/skripsi/sets/1')
  })

  it('should open delete confirmation when clicking delete button', () => {
    const mockSets = [
      {
        id: 1,
        title: 'Test Set',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    store = createMockStore({ sets: mockSets })
    renderWithProviders(<SkripsiList />)

    const deleteButton = screen.getByRole('button', { name: '' })
    fireEvent.click(deleteButton)

    expect(screen.getByText(/hapus set/i)).toBeInTheDocument()
    expect(screen.getByText(/apakah anda yakin/i)).toBeInTheDocument()
  })

  it('should format dates correctly', () => {
    const mockSets = [
      {
        id: 1,
        title: 'Test Set',
        created_at: new Date('2024-01-15').toISOString(),
        updated_at: new Date('2024-02-20').toISOString(),
      },
    ]

    store = createMockStore({ sets: mockSets })
    renderWithProviders(<SkripsiList />)

    expect(screen.getByText(/dibuat: 15\/01\/2024/i)).toBeInTheDocument()
    expect(screen.getByText(/diupdate: 20\/02\/2024/i)).toBeInTheDocument()
  })
})
