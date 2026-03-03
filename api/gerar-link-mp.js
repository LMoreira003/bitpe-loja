const { MercadoPagoConfig, Preference } = require('mercadopago');

module.exports = async function handler(req, res) {
    // 1. Permissões de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

    const dadosGerais = req.body;
    const valorFrete = parseFloat(dadosGerais.freteOpcao.preco) || 0;
    const TOKEN_MP = process.env.MERCADOPAGO_TOKEN;

    if (!TOKEN_MP) {
        return res.status(500).json({ error: 'Chave do Mercado Pago não configurada no servidor.' });
    }

    // 2. Conecta ao MP
    const client = new MercadoPagoConfig({ accessToken: TOKEN_MP, options: { timeout: 5000 } });
    const preference = new Preference(client);

    // 3. Monta lista de itens
    const items = dadosGerais.produtos.map(p => ({
        id: String(p.id),
        title: p.nome,
        quantity: Number(p.qtd),
        unit_price: Number(p.preco),
        currency_id: 'BRL'
    }));

    // Adiciona frete como um item na conta
    if (valorFrete > 0) {
        items.push({
            id: 'frete',
            title: `Frete (${dadosGerais.freteOpcao.tipo.toUpperCase()})`,
            quantity: 1,
            unit_price: Number(valorFrete),
            currency_id: 'BRL'
        });
    }

    const body = {
        items,
        payer: {
            name: dadosGerais.clienteCadastro?.nome || "Cliente",
            email: dadosGerais.clienteCadastro?.email || "contato@bitpe.com"
        },
        // O Mercado Pago sabe para onde devolver o cliente quando ele concluir (sucesso ou falha)
        back_urls: {
            success: 'https://bitpecalcados.vercel.app/index.html', // Depois criamos tela de sucesso se precisar
            failure: 'https://bitpecalcados.vercel.app/checkout.html',
            pending: 'https://bitpecalcados.vercel.app/checkout.html'
        },
        auto_return: 'approved'
    };

    try {
        const mpResponse = await preference.create({ body });
        // O MP nos devolve o link (init_point) da página de checkout seguro dele
        return res.status(200).json({ init_point: mpResponse.init_point });
    } catch (mpErr) {
        console.error("ERRO MERCADO PAGO:", JSON.stringify(mpErr, null, 2));
        return res.status(500).json({ error: 'Erro ao gerar link de pagamento.' });
    }
};
