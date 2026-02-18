import Button from '@components/common/Button'
import { useNavigate } from 'react-router-dom'
import {
    FormHeader,
    HeaderTop,
    TopicInfo,
    TagList,
    Tag
} from './Detail.styles'

function CalculatorHeader({ detail, categoryTags }) {
    const navigate = useNavigate()

    return (
        <FormHeader>
            <HeaderTop>
                <Button variant="secondary" onClick={() => navigate(-1)}>
                    ← Kembali
                </Button>
            </HeaderTop>

            <TopicInfo>
                <h2>{detail.title}</h2>
                {detail.description && <p>{detail.description}</p>}

                {categoryTags.length > 0 && (
                    <TagList>
                        {categoryTags.map((tag) => (
                            <Tag key={tag.id} kategori>
                                {tag.name}
                            </Tag>
                        ))}
                    </TagList>
                )}
            </TopicInfo>
        </FormHeader>
    )
}

export default CalculatorHeader
