export function checkFeatureLock(sessionType, features, userStatus) {
  const feature = features.find(f => f.sessionType === sessionType)
  if (!feature) return { isLocked: false, lockReason: '' }
  const userCredits = parseFloat(userStatus?.creditBalance || 0)
  const activeFeatureKeys = userStatus?.activeFeatureKeys || []
  const hasFeatureSubscription = activeFeatureKeys.some(f => f.feature === sessionType)
  const isFree = feature.accessType === 'free'
  const needsSubscription = feature.accessType === 'subscription' || feature.accessType === 'subscription_and_credits'
  const needsCredits = feature.accessType === 'credits' || feature.accessType === 'subscription_and_credits'
  const subscriptionMet = !needsSubscription || hasFeatureSubscription
  const creditsMet = !needsCredits || userCredits >= (feature.cost || 0)
  const canUse = (subscriptionMet && creditsMet) || isFree || hasFeatureSubscription
  const isLocked = !canUse && !isFree
  let lockReason = ''
  if (isLocked) {
    if (!subscriptionMet && !creditsMet) lockReason = `Perlu berlangganan & ${feature.cost} credits`
    else if (!subscriptionMet) lockReason = 'Perlu berlangganan'
    else lockReason = `Perlu ${feature.cost} credits`
  }
  return { isLocked, lockReason }
}
