// Conexão centralizada com o Supabase
// Todas as rotas da API importam daqui para não repetir código
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Service Role Key (nunca expôr no frontend!)

if (!supabaseUrl || !supabaseKey) {
    console.warn('[SUPABASE] Variáveis SUPABASE_URL ou SUPABASE_SERVICE_KEY não configuradas.');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

module.exports = supabase;
