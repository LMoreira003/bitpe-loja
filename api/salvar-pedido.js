// API Serverless — Salva um novo pedido no Supabase
// Endpoint: POST /api/salvar-pedido
const supabase = require('./lib/supabase');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

    const { cliente, produtos, frete, pagamento } = req.body;

    if (!cliente || !produtos || produtos.length === 0) {
        return res.status(400).json({ error: 'Dados do pedido incompletos.' });
    }

    // Calcula total do pedido no servidor (segurança)
    const totalProdutos = produtos.reduce((acc, p) => acc + (parseFloat(p.preco) * Number(p.qtd)), 0);
    const totalFrete = parseFloat(frete?.preco) || 0;
    const totalGeral = totalProdutos + totalFrete;

    try {
        const { data, error } = await supabase
            .from('pedidos')
            .insert([{
                // Dados do cliente
                cliente_nome: cliente.nome,
                cliente_email: cliente.email,
                cliente_cpf: cliente.cpf,
                cliente_telefone: cliente.telefone,
                // Endereço
                endereco_cep: cliente.cep,
                endereco_rua: cliente.rua,
                endereco_numero: cliente.numero,
                endereco_complemento: cliente.complemento || '',
                endereco_bairro: cliente.bairro,
                endereco_cidade: cliente.cidade,
                endereco_estado: cliente.estado,
                // Pedido
                itens: produtos,  // JSON array com os produtos
                frete_tipo: frete?.tipo || 'indefinido',
                frete_valor: totalFrete,
                total: totalGeral,
                // Status
                status: 'pendente',  // pendente → pago → enviado → entregue
                pagamento_gateway: pagamento?.gateway || 'indefinido',
                pagamento_id: pagamento?.id_transacao || null,
                // Timestamps automáticos pelo Supabase
            }])
            .select()
            .single();

        if (error) {
            console.error('[PEDIDO] Erro Supabase:', error);
            return res.status(500).json({ error: 'Erro ao salvar pedido.' });
        }

        return res.status(201).json({
            sucesso: true,
            pedido_id: data.id,
            mensagem: `Pedido #${data.id} registrado com sucesso!`
        });

    } catch (err) {
        console.error('[PEDIDO] Erro geral:', err.message);
        return res.status(500).json({ error: 'Falha interna ao registrar pedido.' });
    }
};
