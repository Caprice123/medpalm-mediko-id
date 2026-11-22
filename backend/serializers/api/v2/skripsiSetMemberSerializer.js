// One member of the group a PBL report belongs to. Names are typed in, so this
// carries no user id — a member need not have a MedPal account.
export class SkripsiSetMemberV2Serializer {
  static serializeOne(member) {
    return {
      id: member.id,
      name: member.name,
      studentNumber: member.student_number ?? null,
      position: member.position,
    }
  }

  static serialize(members) {
    return (members || []).map(member => this.serializeOne(member))
  }
}
