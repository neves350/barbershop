import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const CurrentWorker = createParamDecorator(
	(_data: unknown, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest()
		return request.user
	},
)
