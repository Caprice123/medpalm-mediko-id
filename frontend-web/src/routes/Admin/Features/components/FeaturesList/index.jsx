import {
  Grid,
  Card,
  CardHeader,
  StatusBadge,
  CardTitle,
  Description,
  CardActions,
  CardIcon,
} from './FeaturesList.styles'

import Button from "@/components/common/Button"



function FeaturesList({ features, onFeatureClick }) {
    return (
        <Grid>
      {features.map((feature) => (
          <Card key={feature.name}>
            <CardHeader>
                <CardIcon>{feature.icon}</CardIcon>
                <StatusBadge active={feature.isActive}>
                    {feature.isActive ? 'Aktif' : 'Nonaktif'}
                </StatusBadge>
            </CardHeader>

            <Description>
                <CardTitle>{feature.name}</CardTitle>
                <p>{feature.description}</p>
            </Description>

            <div style={{flex: "1"}}></div>

            <CardActions>
                <Button variant="primary" onClick={() => onFeatureClick(feature)} style={{ flex: 1 }}>
                    Konfigurasi
                </Button>
            </CardActions>
        </Card>
      ))}
    </Grid>
  )
}

export default FeaturesList
