import * as BunnyStorageSDK from '@bunny.net/storage-sdk'
import fs from 'fs'
import path from 'path'

class BunnyStorageService {
  _zone() {
    const regionKey = process.env.BUNNY_STORAGE_REGION || 'SG'
    const region = BunnyStorageSDK.regions.StorageRegion[regionKey]
    return BunnyStorageSDK.zone.connect_with_accesskey(
      region,
      process.env.BUNNY_STORAGE_ZONE_NAME,
      process.env.BUNNY_STORAGE_ACCESS_KEY,
    )
  }

  cdnUrl(storagePath) {
    return `https://${process.env.BUNNY_CDN_HOSTNAME}/${storagePath}`
  }

  async uploadVideo(filePath, originalName) {
    const ext = path.extname(originalName)
    const base = path.basename(originalName, ext).toLowerCase().replace(/[^a-z0-9]/g, '-')
    const storagePath = `feature-nodes/videos/${Date.now()}-${base}${ext}`
    const fileStream = fs.createReadStream(filePath)
    await BunnyStorageSDK.file.upload(this._zone(), `/${storagePath}`, fileStream)
    return { key: storagePath, cdnUrl: this.cdnUrl(storagePath) }
  }
}

export default new BunnyStorageService()
