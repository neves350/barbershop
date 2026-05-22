import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

@Injectable()
export class SupabaseService {
	private readonly client: SupabaseClient

	constructor(configService: ConfigService) {
		// Admin client — uses service_role key to access auth.admin APIs (bypasses RLS)
		this.client = createClient(
			configService.getOrThrow('SUPABASE_URL'),
			configService.getOrThrow('SUPABASE_SERVICE_ROLE_KEY'),
		)
	}

	// Checks if a Supabase auth user exists by their UUID — returns null if not found
	async getUserById(supabaseId: string) {
		const { data, error } = await this.client.auth.admin.getUserById(supabaseId)
		if (error) return null
		return data.user
	}
}
