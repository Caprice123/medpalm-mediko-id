import {
    ResultSection,
    ResultHeader,
    ResultLabel,
    ResultValue,
    ResultUnit,
    ClassificationsSection,
    ClassificationTitle,
    ClassificationItem,
    ClassificationName,
    ClassificationValue,
    ClassificationEmpty,
    ClinicalReferencesSection,
    ClinicalReferenceBox,
    ClinicalReferenceItem
} from './Detail.styles'

function CalculatorResult({ result, clinicalReferences }) {
    return (
        <ResultSection>
            <ResultHeader>
                <ResultLabel>{result.result_label}</ResultLabel>
                <ResultValue>
                    {typeof result.result === 'number'
                        ? result.result.toFixed(2)
                        : result.result}
                    {result.result_unit && (
                        <ResultUnit>{result.result_unit}</ResultUnit>
                    )}
                </ResultValue>
            </ResultHeader>

            {result.classifications && result.classifications.length > 0 && (
                <ClassificationsSection>
                    <ClassificationTitle>Interpretasi Hasil</ClassificationTitle>
                    {result.classifications.map((classification, index) => (
                        <ClassificationItem key={index}>
                            <ClassificationName>{classification.name}</ClassificationName>
                            {classification.matched_options && classification.matched_options.length > 0 ? (
                                <ClassificationValue>
                                    {classification.matched_options.join(' • ')}
                                </ClassificationValue>
                            ) : (
                                <ClassificationEmpty>
                                    Tidak ada klasifikasi
                                </ClassificationEmpty>
                            )}
                        </ClassificationItem>
                    ))}
                </ClassificationsSection>
            )}

            {clinicalReferences && clinicalReferences.length > 0 && (
                <ClinicalReferencesSection>
                    <ClassificationTitle>Referensi Klinis</ClassificationTitle>
                    <ClinicalReferenceBox>
                        {clinicalReferences.map((reference, index) => (
                            <ClinicalReferenceItem
                                key={index}
                                isLast={index === clinicalReferences.length - 1}
                            >
                                <strong>{index + 1}.</strong> {reference}
                            </ClinicalReferenceItem>
                        ))}
                    </ClinicalReferenceBox>
                </ClinicalReferencesSection>
            )}
        </ResultSection>
    )
}

export default CalculatorResult
