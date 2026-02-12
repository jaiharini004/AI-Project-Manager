from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from contextvars import ContextVar

# Global context variable for the current tenant ID
organization_id_ctx: ContextVar[str] = ContextVar("organization_id", default=None)

class TenantMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # In a real app, this comes from the JWT. 
        # For this demo/hackathon, we accept a header or default to logic.
        org_id = request.headers.get("X-Organization-ID")
        
        token = organization_id_ctx.set(org_id)
        try:
            response = await call_next(request)
            return response
        finally:
            organization_id_ctx.reset(token)

def get_current_org_id():
    return organization_id_ctx.get()
