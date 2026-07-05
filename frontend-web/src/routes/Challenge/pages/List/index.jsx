import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchChallenges, fetchMyBadges } from '@store/challenge/userAction'
import { fetchTags } from '@store/tags/userAction'
import { actions } from '@store/challenge/reducer'
import { actions as tagActions } from '@store/tags/reducer'
import FilterComponent from '@components/common/Filter'
import Dropdown from '@components/common/Dropdown'
import Loading from '@components/common/Loading'
import EmptyState from '@components/common/EmptyState'
import Pagination from '@components/Pagination'
import { formatJakartaDateLong } from '@utils/dateUtils'
import { ChallengeRoute } from '../../routes'
import {
  PageWrapper, Container, BackBtn, PageTitle, PageSubtitle, TabBar, TabBtn, Grid,
  ChallengeCard, CardTitle, CardTopRow, CategoryChip, CardDesc,
  TagList, Tag, CardFooter, PlayedCount, TimeLeftTag, StatusBtn, DateLabel,
  BadgeGrid, BadgeCard, BadgeImg, BadgePlaceholder, BadgeName, BadgeChallenge, BadgeMeta, BadgeRankTag,
} from './List.styles'

function getDaysLeft(endAt) {
  if (!endAt) return null
  const diff = new Date(endAt) - new Date()
  if (diff <= 0) return 0
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

const TABS = [
  { key: 'ongoing',  label: 'Sedang Berlangsung' },
  { key: 'upcoming', label: 'Akan Datang' },
  { key: 'past',     label: 'Telah Berlangsung' },
//   { key: 'badges',   label: '🏅 Badge Saya' },
]

const SCORING_LABEL = { classic: 'Classic', blitz: 'Blitz' }
const SCORING_VARIANT = { classic: 'gray', blitz: 'yellow' }

export default function ChallengePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { challenges, pagination, myBadges, loading, filter } = useSelector(state => state.challenge)
  const { tags } = useSelector(state => state.tags)
  const [tab, setTab] = useState('ongoing')

  const universityTags = useMemo(() =>
    tags?.find(tag => tag.name === 'university')?.tags?.map(tag => ({ label: tag.name, value: tag.id })) || []
  , [tags])

  const semesterTags = useMemo(() =>
    tags?.find(tag => tag.name === 'semester')?.tags?.map(tag => ({ label: tag.name, value: tag.id })) || []
  , [tags])

  useEffect(() => {
    dispatch(tagActions.updateFilter({ key: 'tagGroupNames', value: ['semester', 'university'] }))
    dispatch(fetchTags())
  }, [dispatch])

  useEffect(() => {
    if (tab === 'badges') {
      dispatch(fetchMyBadges())
    } else {
      dispatch(actions.setPage(1))
      dispatch(fetchChallenges(tab))
    }
  }, [tab, dispatch])

  const handleFilterChange = (key, value) => {
    dispatch(actions.updateFilter({ key, value }))
    dispatch(actions.setPage(1))
    dispatch(fetchChallenges(tab))
  }

  const handlePageChange = (page) => {
    dispatch(actions.setPage(page))
    dispatch(fetchChallenges(tab))
  }

  const statusLabel = (c) => {
    if (c.myStatus === 'completed') return 'Selesai ✓'
    if (c.myStatus === 'in_progress') return 'Lanjut →'
    return 'Mulai →'
  }

  const questionLabel = (c) => {
    const parts = [`${c.totalQuestions} soal`]
    if (c.maxSpecialPerSession > 0) parts.push(`+${c.maxSpecialPerSession} spesial`)
    return parts.join(' · ')
  }

  const isListLoading = loading.isGetListLoading
  const isBadgesLoading = loading.isGetMyBadgesLoading

  return (
    <PageWrapper>
      <Container>
        <BackBtn onClick={() => navigate(ChallengeRoute.homeRoute)}>← Kembali</BackBtn>
        <PageTitle>🏆 Challenge</PageTitle>
        <PageSubtitle>Uji pengetahuanmu dan bersaing dengan pengguna lain dalam challenge eksklusif</PageSubtitle>

        <TabBar>
          {TABS.map(t => (
            <TabBtn key={t.key} $active={tab === t.key} onClick={() => setTab(t.key)}>
              {t.label}
            </TabBtn>
          ))}
        </TabBar>

        {tab !== 'badges' && (
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <FilterComponent>
              <FilterComponent.Group>
                <FilterComponent.Label>Universitas</FilterComponent.Label>
                <Dropdown
                  options={universityTags}
                  value={filter.university ? universityTags.find(t => t.value === filter.university) : null}
                  onChange={option => handleFilterChange('university', option?.value || undefined)}
                  placeholder="Semua universitas..."
                />
              </FilterComponent.Group>

              <FilterComponent.Group>
                <FilterComponent.Label>Semester</FilterComponent.Label>
                <Dropdown
                  options={semesterTags}
                  value={filter.semester ? semesterTags.find(t => t.value === filter.semester) : null}
                  onChange={option => handleFilterChange('semester', option?.value || undefined)}
                  placeholder="Semua semester..."
                />
              </FilterComponent.Group>
            </FilterComponent>
          </div>
        )}

        {tab === 'badges' ? (
          isBadgesLoading ? (
            <Loading text="Memuat badge..." minHeight="300px" />
          ) : myBadges.length === 0 ? (
            <EmptyState
              icon="🏅"
              title="Belum ada badge yang diperoleh"
              subtitle="Selesaikan challenge dan raih peringkat terbaik untuk mendapatkan badge"
            />
          ) : (
            <BadgeGrid>
              {myBadges.map(b => (
                <BadgeCard key={b.badgeUniqueId}>
                  {b.image?.url
                    ? <BadgeImg src={b.image.url} alt={b.name} />
                    : <BadgePlaceholder>🏅</BadgePlaceholder>}
                  <BadgeName>{b.name}</BadgeName>
                  {b.finalRank && <BadgeRankTag>Peringkat #{b.finalRank}</BadgeRankTag>}
                  <BadgeChallenge>{b.challengeTitle}</BadgeChallenge>
                  {b.completedAt && (
                    <BadgeMeta>Diperoleh {formatJakartaDateLong(b.completedAt)}</BadgeMeta>
                  )}
                </BadgeCard>
              ))}
            </BadgeGrid>
          )
        ) : (
          <>
            {isListLoading ? (
              <Loading text="Memuat challenge..." minHeight="300px" />
            ) : challenges.length === 0 ? (
              <EmptyState
                icon="🏆"
                title={
                  tab === 'ongoing'  ? 'Tidak ada challenge yang sedang berlangsung.' :
                  tab === 'upcoming' ? 'Tidak ada challenge yang akan datang.' :
                                       'Belum ada challenge yang telah selesai.'
                }
              />
            ) : (
              <Grid>
                {challenges.map(c => {
                  const label = statusLabel(c)
                  const universityTags = (c.tags || []).filter(t => t.tagGroupName === 'university')
                  const semesterTags = (c.tags || []).filter(t => t.tagGroupName === 'semester')
                  const days = tab === 'ongoing' ? getDaysLeft(c.endAt) : null
                  return (
                    <ChallengeCard
                      key={c.uniqueId}
                      $clickable={tab === 'ongoing' || tab === 'past'}
                      onClick={tab === 'ongoing' || tab === 'past' ? () => navigate(ChallengeRoute.detailRoute(c.uniqueId)) : undefined}
                    >
                      <CardTopRow>
                        <CategoryChip $type={c.scoringType}>
                          {SCORING_LABEL[c.scoringType] || c.scoringType?.toUpperCase()}
                        </CategoryChip>
                        {tab === 'ongoing' && days !== null && days > 0 && (
                          <TimeLeftTag $urgent={days <= 3}>{days}h tersisa</TimeLeftTag>
                        )}
                        {tab === 'upcoming' && c.startAt && (
                          <DateLabel>Mulai {formatJakartaDateLong(c.startAt)}</DateLabel>
                        )}
                        {tab === 'past' && c.endAt && (
                          <DateLabel>Berakhir {formatJakartaDateLong(c.endAt)}</DateLabel>
                        )}
                      </CardTopRow>

                      <CardTitle>{c.title}</CardTitle>
                      {c.description && <CardDesc>{c.description}</CardDesc>}

                      {(universityTags.length > 0 || semesterTags.length > 0) && (
                        <div>
                          {universityTags.length > 0 && (
                            <TagList>
                              {universityTags.map(t => <Tag key={t.id} $university>🏛️ {t.name}</Tag>)}
                            </TagList>
                          )}
                          {semesterTags.length > 0 && (
                            <TagList>
                              {semesterTags.map(t => <Tag key={t.id} $semester>📚 {t.name}</Tag>)}
                            </TagList>
                          )}
                        </div>
                      )}

                      <CardFooter>
                        <PlayedCount>{c.playedCount?.toLocaleString('id-ID')} peserta</PlayedCount>
                        {tab !== 'upcoming' && (
                          <StatusBtn $status={c.myStatus}>{label}</StatusBtn>
                        )}
                      </CardFooter>
                    </ChallengeCard>
                  )
                })}
              </Grid>
            )}

            {(pagination.page > 1 || !pagination.isLastPage) && (
              <Pagination
                currentPage={pagination.page}
                isLastPage={pagination.isLastPage}
                onPageChange={handlePageChange}
                isLoading={isListLoading}
                language="id"
              />
            )}
          </>
        )}
      </Container>
    </PageWrapper>
  )
}
