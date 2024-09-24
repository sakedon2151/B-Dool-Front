interface FileModel {
  id: number
  fName: string
  path: string
  size: number
  extension: string
  uploadedAt: Date

  profileId: number
  channelId: number
  workspaceId: number
}