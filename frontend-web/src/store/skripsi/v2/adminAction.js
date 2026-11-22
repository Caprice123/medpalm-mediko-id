import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '../../../utils/requestUtils'
import { actions } from './reducer'

const base = Endpoints.admin.skripsiV2

// Report templates, as the admin panel manages them. The list accumulates
// through "Muat Lebih Banyak", so the thunk only reads whichever page the
// reducer currently points at and is told whether to append.
export const fetchAdminSkripsiTemplates = ({ append = false } = {}) => async (dispatch, getState) => {
  try {
    dispatch(actions.setLoading({ key: 'isFetchingAdminTemplates', value: true }))

    const { adminTemplatesPagination, adminTemplatesFilter } = getState().skripsiV2
    const response = await getWithToken(`${base}/templates`, {
      page: adminTemplatesPagination.page,
      perPage: adminTemplatesPagination.perPage,
      // Left out entirely when empty, so an untouched search box does not turn
      // into `search=` on every request.
      ...(adminTemplatesFilter.search.trim() ? { search: adminTemplatesFilter.search.trim() } : {}),
    })

    const templates = response.data.data || []
    dispatch(append ? actions.appendAdminTemplates(templates) : actions.setAdminTemplates(templates))
    if (response.data.pagination) {
      dispatch(actions.setAdminTemplatesPagination(response.data.pagination))
    }

    return templates
  } finally {
    dispatch(actions.setLoading({ key: 'isFetchingAdminTemplates', value: false }))
  }
}

export const loadMoreAdminSkripsiTemplates = () => (dispatch, getState) => {
  const { adminTemplatesPagination } = getState().skripsiV2
  if (adminTemplatesPagination.isLastPage) return

  dispatch(actions.setAdminTemplatesPagination({ page: adminTemplatesPagination.page + 1 }))
  dispatch(fetchAdminSkripsiTemplates({ append: true }))
}

// Item counts shift on every write, so each mutation reloads from page 1
// rather than refetching whichever page the list had accumulated to. Running a
// search is the same move: a new filter means a new first page.
export const reloadAdminSkripsiTemplates = () => (dispatch) => {
  dispatch(actions.setAdminTemplatesPagination({ page: 1 }))
  return dispatch(fetchAdminSkripsiTemplates())
}

// Read when the edit form opens. The listing left the outline out, so this is
// where the form gets the headings it edits.
export const fetchAdminSkripsiTemplate = (id) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isFetchingAdminTemplateDetail', value: true }))

    const response = await getWithToken(`${base}/templates/${id}`)
    dispatch(actions.setAdminTemplateDetail(response.data.data))

    return response.data.data
  } finally {
    dispatch(actions.setLoading({ key: 'isFetchingAdminTemplateDetail', value: false }))
  }
}

export const clearAdminSkripsiTemplateDetail = () => (dispatch) => (
  dispatch(actions.setAdminTemplateDetail(null))
)

export const createAdminSkripsiTemplate = (payload) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isSavingTemplate', value: true }))

    const response = await postWithToken(`${base}/templates`, payload)
    await dispatch(reloadAdminSkripsiTemplates())

    return response.data.data
  } finally {
    dispatch(actions.setLoading({ key: 'isSavingTemplate', value: false }))
  }
}

export const updateAdminSkripsiTemplate = (id, payload) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isSavingTemplate', value: true }))

    const response = await putWithToken(`${base}/templates/${id}`, payload)
    await dispatch(reloadAdminSkripsiTemplates())

    return response.data.data
  } finally {
    dispatch(actions.setLoading({ key: 'isSavingTemplate', value: false }))
  }
}

export const deleteAdminSkripsiTemplate = (id) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isDeletingTemplate', value: true }))

    await deleteWithToken(`${base}/templates/${id}`)
    await dispatch(reloadAdminSkripsiTemplates())
  } finally {
    dispatch(actions.setLoading({ key: 'isDeletingTemplate', value: false }))
  }
}
