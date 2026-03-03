const { MercadoPagoConfig, Payment } = require('mercadopago');

module.exports = async function handler(req, res) {
    // 1. Permissões de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

    // 2. Coleta os dados que o seu Checkout mandou
    const dadosGerais = req.body;

    // Calcula o valor final no servidor por segurança
    const valorFrete = parseFloat(dadosGerais.freteOpcao.preco) || 0;
    const somaProdutos = dadosGerais.produtos.reduce((acc, p) => acc + (parseFloat(p.preco) * Number(p.qtd)), 0);
    const totalComanda = somaProdutos + valorFrete;

    const TOKEN_MP = process.env.MERCADOPAGO_TOKEN;

    if (!TOKEN_MP) {
        return res.status(500).json({ error: 'Chave do Mercado Pago não configurada no servidor.' });
    }

    // 3. Conecta no seu Mercado Pago
    const client = new MercadoPagoConfig({ accessToken: TOKEN_MP, options: { timeout: 5000 } });
    const payment = new Payment(client);

    // 4. Monta o corpo da cobrança PIX
    // Um CPF aleatório para mock. O usuário do site na fase 2 digitaria o dele.
    const cpfFicticioOuLimpo = (dadosGerais.clienteCadastro?.cpf || '12345678909').replace(/\D/g, '');

    const body = {
        transaction_amount: Number(totalComanda.toFixed(2)),
        description: `Pedido Bitpe - ${dadosGerais.produtos.length} item(s)`,
        payment_method_id: 'pix',
        payer: {
            email: dadosGerais.clienteCadastro?.email || "contato@bitpe.com",
            first_name: dadosGerais.clienteCadastro?.nome || "Cliente",
            identification: {
                type: 'CPF',
                number: cpfFicticioOuLimpo
            }
        },
        // O Mercado Pago não gosta do IdemPotency vazio ou muito igual, usamos data pra gerar codigo unico
        metadata: {
            app_gerador: "bitpe-v1"
        }
    };

    try {
        // Envia o pedido de dinheiro pro banco!
        const mpResponse = await payment.create({
            body: body,
            requestOptions: { idempotencyKey: `pedido_${Date.now()}_${Math.random().toString(36).substr(2, 5)}` }
        });

        // Retorna pro site do cliente o QRCode e a Linha Digitável ("Copia e Cola")
        // E tbm o ID do MercadoPago para a gente testar se pagou.
        return res.status(200).json({
            id_transacao: mpResponse.id,
            qr_code_base64: mpResponse.point_of_interaction?.transaction_data?.qr_code_base64,
            pix_copia_e_cola: mpResponse.point_of_interaction?.transaction_data?.qr_code
        });

    } catch (mpErr) {
        console.error("ERRO MERCADO PAGO:", JSON.stringify(mpErr, null, 2));
        return res.status(500).json({
            error: 'O banco recusou a geração do código Pix.',
            msg: mpErr.message || 'Dados inválidos'
        });
    }
};
