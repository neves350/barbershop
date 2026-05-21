import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt } from 'passport-jwt'
import type { Request } from 'express'
import { Strategy } from 'passport-jwt'
import { passportJwtSecret } from 'jwks-rsa'

const fromCookieOrBearer = (req: Request): string | null =>
	req?.cookies?.['sb-access-token'] ?? ExtractJwt.fromAuthHeaderAsBearerToken()(req)

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'supabase') {
	constructor(configService: ConfigService) {
		const supabaseUrl = configService.getOrThrow<string>('SUPABASE_URL')

		super({
			jwtFromRequest: fromCookieOrBearer,
			ignoreExpiration: false,
			secretOrKeyProvider: passportJwtSecret({
				jwksUri: `${supabaseUrl}/auth/v1/.well-known/jwks.json`,
				cache: true,
				rateLimit: true,
				jwksRequestsPerMinute: 10,
			}),
		})
	}

	async validate(payload: { sub: string; email: string }) {
		return { supabaseId: payload.sub, email: payload.email }
	}
}
