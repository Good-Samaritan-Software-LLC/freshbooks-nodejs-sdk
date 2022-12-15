/* eslint-disable @typescript-eslint/camelcase */
import { Nullable } from './helpers'

export default interface ProjectGroup {
	id: string
	members?: Nullable<ProjectGroupMembers[]>
}

export interface ProjectGroupMembers {
	firstName: string
	lastName: string
	role: 'owner'
	identityId: number
	active: boolean
	company: string
	id: number
	email: string
}

export function transformProjectGroupResponse(projectGroup: any): ProjectGroup {
	return {
		id: projectGroup.id,
		members: projectGroup.members && projectGroup.members.map(transformProjectGroupMemberResponse),
	}
}

export function transformProjectGroupMemberResponse(data: any): ProjectGroupMembers {
	return {
		firstName: data.first_name,
		lastName: data.last_name,
		role: data.role,
		identityId: data.identity_id,
		active: data.active,
		company: data.company,
		id: data.id,
		email: data.email,
	}
}
