// API Serverless — Calcula o frete usando a API do Melhor Envio
// Roda na Vercel automaticamente como endpoint: /api/calcular-frete

export default async function handler(req, res) {
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

    const TOKEN = process.env.MELHOR_ENVIO_TOKEN;

    if (!TOKEN) {
        // Se não tem token configurado, retorna frete simulado
        return res.status(200).json({
            opcoes: [
                { id: 1, nome: 'PAC', empresa: 'Correios', preco: 19.90, prazo: 10, icone: 'fa-box' },
                { id: 2, nome: 'SEDEX', empresa: 'Correios', preco: 34.90, prazo: 4, icone: 'fa-rocket' }
            ],
            simulado: true
        });
    }

    try {
        const response = await fetch('https://melhorenvio.com.br/api/v2/me/shipment/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`,
                'Accept': 'application/json',
                'User-Agent': 'Bitpe Calcados (contato@bitpe.com.br)'
            },
            body: JSON.stringify({
                from: { postal_code: '74450010' },
                to: { postal_code: cepDestino.replace(/\D/g, '') },
                products: [
                    {
                        id: "1",
                        width: 30,
                        height: 15,
                        length: 35,
                        weight: 0.5,
                        insurance_value: 100,
                        quantity: 1
                    }
                ]
            })
        });

        const data = await response.json();

        // Filtra apenas opções disponíveis (sem erro)
        const opcoes = data
            .filter(opcao => !opcao.error && opcao.price)
            .map(opcao => ({
                id: opcao.id,
                nome: opcao.name,
                empresa: opcao.company.name,
                preco: parseFloat(opcao.custom_price || opcao.price),
                prazo: opcao.delivery_time,
                icone: opcao.company.name.includes('Correios') ? 'fa-box' : 'fa-truck'
            }))
            .sort((a, b) => a.preco - b.preco); // Mais barato primeiro

        if (opcoes.length === 0) {
            return res.status(200).json({
                opcoes: [
                    { id: 1, nome: 'PAC', empresa: 'Correios', preco: 19.90, prazo: 10, icone: 'fa-box' },
                    { id: 2, nome: 'SEDEX', empresa: 'Correios', preco: 34.90, prazo: 4, icone: 'fa-rocket' }
                ],
                simulado: true,
                aviso: 'Frete estimado — valores reais podem variar'
            });
        }

        return res.status(200).json({ opcoes, simulado: false });

    } catch (error) {
        console.error('Erro Melhor Envio:', error);
        // Fallback: frete simulado em caso de erro
        return res.status(200).json({
            opcoes: [
                { id: 1, nome: 'PAC', empresa: 'Correios', preco: 19.90, prazo: 10, icone: 'fa-box' },
                { id: 2, nome: 'SEDEX', empresa: 'Correios', preco: 34.90, prazo: 4, icone: 'fa-rocket' }
            ],
            simulado: true
        });
    }
}
