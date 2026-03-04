// API Serverless — Busca pedidos para o Painel Admin
// Endpoint: GET /api/admin/pedidos?senha=XXXX
const supabase = require('../lib/supabase');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // Autenticação simples por token no header (depois migramos para Firebase Auth)
    const authToken = req.headers.authorization?.replace('Bearer ', '');
    const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

    if (!ADMIN_TOKEN || authToken !== ADMIN_TOKEN) {
        return res.status(401).json({ error: 'Acesso negado. Token inválido.' });
    }

    // GET = Lista pedidos
    if (req.method === 'GET') {
        try {
            const { data, error } = await supabase
                .from('pedidos')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(100);

            if (error) {
                console.error('[ADMIN] Erro ao buscar pedidos:', error);
                return res.status(500).json({ error: 'Erro ao buscar pedidos.' });
            }

            return res.status(200).json({ pedidos: data || [] });

        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    // PATCH = Atualizar status de um pedido
    if (req.method === 'PATCH') {
        const { pedido_id, status, codigo_rastreio } = req.body;

        if (!pedido_id || !status) {
            return res.status(400).json({ error: 'pedido_id e status são obrigatórios.' });
        }

        const statusPermitidos = ['pendente', 'pago', 'preparando', 'enviado', 'entregue', 'cancelado'];
        if (!statusPermitidos.includes(status)) {
            return res.status(400).json({ error: `Status inválido. Use: ${statusPermitidos.join(', ')}` });
        }

        try {
            const updateData = { status };
            if (codigo_rastreio) updateData.codigo_rastreio = codigo_rastreio;
            if (status === 'enviado') updateData.data_envio = new Date().toISOString();

            const { data, error } = await supabase
                .from('pedidos')
                .update(updateData)
                .eq('id', pedido_id)
                .select()
                .single();

            if (error) {
                console.error('[ADMIN] Erro ao atualizar pedido:', error);
                return res.status(500).json({ error: 'Erro ao atualizar.' });
            }

            return res.status(200).json({ sucesso: true, pedido: data });

        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    return res.status(405).json({ error: 'Método não suportado.' });
};
