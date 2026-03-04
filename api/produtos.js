// API Serverless — Retorna os produtos do Supabase para o site
// Endpoint: GET /api/produtos
const supabase = require('./lib/supabase');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const { data, error } = await supabase
            .from('produtos')
            .select('*')
            .eq('ativo', true)
            .order('destaque', { ascending: false });

        if (error) {
            console.error('[PRODUTOS] Erro Supabase:', error);
            return res.status(500).json({ error: 'Erro ao buscar produtos.' });
        }

        // Formata para o mesmo formato que o db.js usa hoje
        const produtosFormatados = (data || []).map(p => ({
            id: String(p.id),
            nome: p.nome,
            categoria: p.categoria || 'GERAL',
            precoAtual: p.preco_atual,
            precoAntigo: p.preco_antigo || null,
            etiqueta: p.etiqueta || null,
            etiquetaCor: p.etiqueta_cor || 'bg-brand',
            imagem: p.imagem_principal,
            cores: p.cores || [],
            tamanhos: p.tamanhos || [],
            galeriaImagens: p.galeria_imagens || [p.imagem_principal],
            descricao: p.descricao || '',
            beneficios: p.beneficios || [],
            esgotado: p.esgotado || false
        }));

        return res.status(200).json({ produtos: produtosFormatados });

    } catch (err) {
        console.error('[PRODUTOS] Erro geral:', err.message);
        return res.status(500).json({ error: 'Falha interna ao carregar produtos.' });
    }
};
