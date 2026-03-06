export interface JwtPayload {
    sub: string;
    name: string;
    role: string;
    puskesmas_id?: string | null;  // For OPERATOR - their assigned puskesmas
    active_tenant?: string;        // For SUPER_ADMIN - currently selected tenant
}
