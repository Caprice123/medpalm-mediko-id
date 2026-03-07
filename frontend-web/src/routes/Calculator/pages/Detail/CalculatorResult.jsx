import { useState } from 'react'
import {
    ResultTabsWrapper,
    ResultTabBar,
    ResultTab,
    ResultTabContent,
    ResultValue,
    ResultUnit,
    ClassificationTable,
    ClassificationThead,
    ClassificationTh,
    ClassificationTr,
    ClassificationTd,
    ClassificationBadge,
    ClassificationEmptyBadge,
    ClassificationTitle,
    ClinicalReferencesSection,
    ClinicalReferenceBox,
    ClinicalReferenceItem
} from './Detail.styles'

function CalculatorResult({ results, classifications, clinicalReferences }) {
    const [activeTab, setActiveTab] = useState('hasil')

    return (
        <ResultTabsWrapper>
            <ResultTabBar>
                <ResultTab $active={activeTab === 'hasil'} onClick={() => setActiveTab('hasil')}>
                    Hasil
                </ResultTab>
                {classifications && classifications.length > 0 && (
                    <ResultTab $active={activeTab === 'klasifikasi'} onClick={() => setActiveTab('klasifikasi')}>
                        Klasifikasi
                    </ResultTab>
                )}
            </ResultTabBar>

            <ResultTabContent>
                {activeTab === 'hasil' && (
                    <ClassificationTable>
                        <ClassificationThead>
                            <tr>
                                <ClassificationTh>Hasil</ClassificationTh>
                                <ClassificationTh>Nilai</ClassificationTh>
                            </tr>
                        </ClassificationThead>
                        <tbody>
                            {results.map((result, index) => (
                                <ClassificationTr key={result.key || index}>
                                    <ClassificationTd>{result.result_label}</ClassificationTd>
                                    <ClassificationTd>
                                        <ResultValue style={{ fontSize: '1.5rem', margin: 0, justifyContent: 'flex-start' }}>
                                            {typeof result.result === 'number'
                                                ? result.result.toFixed(2)
                                                : result.result}
                                            {result.result_unit && (
                                                <ResultUnit style={{ fontSize: '1rem' }}>{result.result_unit}</ResultUnit>
                                            )}
                                        </ResultValue>
                                    </ClassificationTd>
                                </ClassificationTr>
                            ))}
                        </tbody>
                    </ClassificationTable>
                )}

                {activeTab === 'klasifikasi' && (
                    <ClassificationTable>
                        <ClassificationThead>
                            <tr>
                                <ClassificationTh>Kategori</ClassificationTh>
                                <ClassificationTh>Hasil</ClassificationTh>
                            </tr>
                        </ClassificationThead>
                        <tbody>
                            {classifications.map((classification, index) => (
                                <ClassificationTr key={index}>
                                    <ClassificationTd>{classification.name}</ClassificationTd>
                                    <ClassificationTd>
                                        {classification.matched_options && classification.matched_options.length > 0
                                            ? classification.matched_options.join(' • ')
                                            : '-'
                                        }
                                    </ClassificationTd>
                                </ClassificationTr>
                            ))}
                        </tbody>
                    </ClassificationTable>
                )}

                {clinicalReferences && clinicalReferences.length > 0 && (
                    <ClinicalReferencesSection>
                        <ClassificationTitle style={{ marginTop: '1.5rem' }}>Referensi Klinis</ClassificationTitle>
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
            </ResultTabContent>
        </ResultTabsWrapper>
    )
}

export default CalculatorResult
