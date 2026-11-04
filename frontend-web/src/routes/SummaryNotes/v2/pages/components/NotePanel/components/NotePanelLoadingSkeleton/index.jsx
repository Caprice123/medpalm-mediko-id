import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import {
  SkeletonShell, SkeletonToolbar, SkeletonCrumbs, SkeletonActions, CrumbSeparator,
  SkeletonLayout, SkeletonArticle, SkeletonMetaRow, SkeletonLede, SkeletonParagraph,
  SkeletonHeading, SkeletonBulletList, SkeletonBullet, SkeletonToc,
} from './NotePanelLoadingSkeleton.styles'

const BULLET_WIDTHS = ['75%', '90%', '60%', '82%']
const TOC_WIDTHS = ['85%', '70%', '78%', '62%', '74%']

function Paragraph({ widths }) {
  return (
    <SkeletonParagraph>
      {widths.map((width, index) => (
        <Skeleton key={index} height={16} width={width} borderRadius={4} />
      ))}
    </SkeletonParagraph>
  )
}

// Shaped like a real note — title, meta, lede, then alternating headings, prose and
// a figure — so the page does not visibly rearrange itself when the content lands.
export default function NotePanelLoadingSkeleton() {
  return (
    <SkeletonShell>
      <SkeletonToolbar>
        <SkeletonCrumbs>
          <Skeleton width={84} height={14} borderRadius={4} />
          <CrumbSeparator>/</CrumbSeparator>
          <Skeleton width={110} height={14} borderRadius={4} />
        </SkeletonCrumbs>
        <SkeletonActions>
          <Skeleton width={32} height={32} borderRadius={7} />
          <Skeleton width={32} height={32} borderRadius={7} />
          <Skeleton width={32} height={32} borderRadius={7} />
        </SkeletonActions>
      </SkeletonToolbar>

      <SkeletonLayout>
        <SkeletonArticle>
          <Skeleton height={36} width="68%" borderRadius={4} />

          <SkeletonMetaRow>
            <Skeleton width={120} height={13} borderRadius={4} />
            <Skeleton width={96} height={13} borderRadius={4} />
            <Skeleton width={140} height={13} borderRadius={4} />
          </SkeletonMetaRow>

          <SkeletonLede>
            <Skeleton height={15} width="94%" borderRadius={4} />
            <Skeleton height={15} width="72%" borderRadius={4} />
          </SkeletonLede>

          <SkeletonHeading>
            <Skeleton height={24} width="42%" borderRadius={4} />
          </SkeletonHeading>
          <Paragraph widths={['100%', '96%', '84%']} />

          <SkeletonHeading>
            <Skeleton height={21} width="36%" borderRadius={4} />
          </SkeletonHeading>
          <SkeletonBulletList>
            {BULLET_WIDTHS.map((width, index) => (
              <SkeletonBullet key={index}>
                <Skeleton circle width={7} height={7} />
                <Skeleton height={15} width={width} borderRadius={4} />
              </SkeletonBullet>
            ))}
          </SkeletonBulletList>

          <SkeletonHeading>
            <Skeleton height={21} width="48%" borderRadius={4} />
          </SkeletonHeading>
          <Skeleton height={190} borderRadius={8} />
          <Paragraph widths={['100%', '78%']} />
        </SkeletonArticle>

        <SkeletonToc>
          <Skeleton width={96} height={12} borderRadius={4} />
          {TOC_WIDTHS.map((width, index) => (
            <Skeleton key={index} height={13} width={width} borderRadius={4} />
          ))}
        </SkeletonToc>
      </SkeletonLayout>
    </SkeletonShell>
  )
}
