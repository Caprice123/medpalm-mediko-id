export class AtlasQuizAtlasModelSerializer {
  static serialize(atlasModel) {
    return {
      uniqueId: atlasModel.unique_id,
      title: atlasModel.title,
      description: atlasModel.description,
      embedUrl: atlasModel.embed_url,
      editorContent: atlasModel.editor_content,
    }
  }
}
