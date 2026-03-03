// API Serverless — Calcula o frete usando a API do Melhor Envio
// Roda na Vercel automaticamente como endpoint: /api/calcular-frete

module.exports = async function handler(req, res) {
    // CORS — permite o site chamar essa API
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

    const { cepDestino } = req.body;

    if (!cepDestino) {
        return res.status(400).json({ error: 'CEP de destino é obrigatório' });
    }

    const TOKEN = process.env.melhorenvio;

    if (!TOKEN) {
        return res.status(500).json({ error: 'Token da API não configurado no servidor.' });
    }

    const cepLimpo = String(cepDestino).replace(/\D/g, '');

    // URL CORRETA de produção do Melhor Envio
    // ATENÇÃO: Se usar token de SANDBOX, trocar para:
    // https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate
    const MELHOR_ENVIO_URL = 'https://www.melhorenvio.com.br/api/v2/me/shipment/calculate';

    const payload = {
        from: { postal_code: '74450010' },       // CEP de origem (Goiânia/GO)
        to: { postal_code: cepLimpo },          // CEP de destino do cliente
        products: [
            {
                id: '1',
                width: 30,
                height: 15,
                length: 35,
                weight: 0.5,
                insurance_value: 100,
                quantity: 1
            }
        ],
        options: {
            receipt: false,
            own_hand: false
        }
        // Sem filtro de serviços — retorna TODOS disponíveis para o CEP
    };

    try {
        const response = await fetch(MELHOR_ENVIO_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`,
                'Accept': 'application/json',
                'User-Agent': 'Bitpe Calcados (contato@bitpe.com.br)'
            },
            body: JSON.stringify(payload)
        });

        // Lê o corpo bruto para debug
        const rawText = await response.text();

        // Tenta parsear o JSON
        let data;
        try {
            data = JSON.parse(rawText);
        } catch (parseErr) {
            console.error('[DEBUG] HTTP Status:', response.status);
            console.error('[DEBUG] Resposta bruta (não-JSON):', rawText.substring(0, 500));
            return res.status(502).json({
                error: 'Resposta inesperada da transportadora',
                debug_status: response.status,
                debug_body: rawText.substring(0, 300)
            });
        }

        // Se a API retornou um objeto de erro (ex: token inválido)
        if (!Array.isArray(data)) {
            console.error('[DEBUG] HTTP Status:', response.status);
            console.error('[DEBUG] Resposta não-array:', JSON.stringify(data));
            return res.status(502).json({
                error: 'Erro retornado pela transportadora',
                debug_status: response.status,
                debug_resposta: data
            });
        }

        // IDs dos serviços permitidos:
        // 1 = PAC (Correios), 2 = SEDEX (Correios)
        // 3 = .Package (Jadlog), 4 = .Com (Jadlog)
        const idsPermitidos = [1, 2, 3, 4];

        const nomesAmigaveis = {
            1: 'Correios Transporte (PAC)',
            2: 'Correios Avião (SEDEX)',
            3: 'Jadlog Transporte',
            4: 'Jadlog Avião'
        };

        // Filtra opções válidas e apenas as transportadoras escolhidas
        const opcoes = data
            .filter(opcao => !opcao.error && opcao.price && idsPermitidos.includes(opcao.id))
            .map(opcao => ({
                id: opcao.id,
                nome: nomesAmigaveis[opcao.id] || opcao.name,
                empresa: opcao.company?.name || 'Transportadora',
                preco: parseFloat(opcao.custom_price || opcao.price),
                prazo: opcao.delivery_time,
                icone: (opcao.company?.name || '').toLowerCase().includes('correios') ? 'fa-box' : 'fa-truck'
            }))
            .sort((a, b) => a.preco - b.preco);

        if (opcoes.length === 0) {
            // Coleta os erros detalhados de cada serviço para diagnóstico
            const detalhes = data.map(o => ({
                servico: o.name || o.id,
                erro: o.error || null,
                preco: o.price || null
            }));
            console.error('[DEBUG] Nenhuma opção válida. Detalhes:', JSON.stringify(detalhes));
            return res.status(200).json({
                error: 'Nenhuma opção de frete disponível para este CEP.',
                debug_detalhes: detalhes
            });
        }

        return res.status(200).json({ opcoes, simulado: false });

    } catch (error) {
        console.error('[DEBUG] Erro de rede ao chamar Melhor Envio:', error.message);
        return res.status(503).json({
            error: 'Falha de conexão com a transportadora',
            debug_mensagem: error.message
        });
    }
};
