// Bloque base skeleton
function Sk({ w = '100%', h = 16, radius = 8, style = {} }) {
    return (
        <div
            className="skeleton"
            style={{ width: w, height: h, borderRadius: radius, flexShrink: 0, ...style }}
        />
    );
}

// Skeleton para las tarjetas de estadísticas del Dashboard
export function SkeletonStatCards() {
    return (
        <div className="stats-container">
            {[1, 2].map(i => (
                <div key={i} className="skeleton-stat-card">
                    <Sk w="40%" h={14} />
                    <Sk w="60%" h={36} radius={10} />
                    <Sk w="30%" h={12} />
                </div>
            ))}
        </div>
    );
}

// Skeleton para gráficas
export function SkeletonChart({ height = 260 }) {
    return (
        <div className="skeleton-chart-container">
            <Sk w="40%" h={20} radius={6} />
            <Sk w="100%" h={height} radius={12} style={{ marginTop: '8px' }} />
        </div>
    );
}

// Skeleton para el grid de dos columnas del Dashboard
export function SkeletonDashboard() {
    return (
        <div>
            <SkeletonStatCards />
            <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                <SkeletonChart height={180} />
            </div>
            <div className="grid-two-columns">
                <SkeletonChart height={260} />
                <SkeletonChart height={260} />
            </div>
            <div className="grid-two-columns" style={{ marginTop: '20px' }}>
                <SkeletonChart height={220} />
                <SkeletonChart height={220} />
            </div>
        </div>
    );
}

// Skeleton para lista de items (Gastos / Deporte)
export function SkeletonListaItems({ cantidad = 5 }) {
    return (
        <div>
            {/* Simula un grupo de día */}
            {[1, 2].map(grupo => (
                <div key={grupo} style={{ marginBottom: '24px' }}>
                    {/* Cabecera del día */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px',
                        padding: '0 4px'
                    }}>
                        <Sk w="200px" h={16} radius={6} />
                        <Sk w="80px" h={16} radius={6} />
                    </div>
                    {/* Items */}
                    {Array.from({ length: grupo === 1 ? 3 : 2 }).map((_, i) => (
                        <div key={i} className="skeleton-item">
                            <Sk w={44} h={44} radius={10} style={{ flexShrink: 0 }} />
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <Sk w="35%" h={13} radius={5} />
                                <Sk w="55%" h={11} radius={5} />
                            </div>
                            <Sk w="60px" h={20} radius={6} />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Sk;