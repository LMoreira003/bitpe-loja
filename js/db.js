// Este é o seu BANCO DE DADOS ("Database") simulado pelo Javascript.
// Daqui para frente, sempre que quiser adicionar ou alterar um produto no site, 
// você SÓ PRECISA MEXER AQUI neste arquivo. O site vai construir tudo sozinho!

const bancoDeProdutos = [
    {
        id: "1",
        nome: "Babuche Homem Aranha",
        categoria: "INFANTIL",
        precoAtual: 149.90,
        precoAntigo: 189.90, // Se não tiver desconto, coloque null sem aspas
        etiqueta: "LANÇAMENTO", // Pode ser "ESGOTADO", "LANÇAMENTO", "-20% OFF", etc. ou ficar null
        etiquetaCor: "bg-red-500", // Cores do tailwind: bg-red-500, bg-brand, bg-black, etc.
        imagem: "assets/img/produtos/homem-aranha.png", /* <-- AQUI: Coloque a sua imagem neste formato "assets/img/produtos/nomedafoto.png" */
        cores: [
            { nome: "Vermelha", classeCss: "bg-red-600" }, // Esta é a cor principal
            { nome: "Azul V", classeCss: "bg-blue-600" },
            { nome: "Branca", classeCss: "bg-white" },
            { nome: "Amarela", classeCss: "bg-yellow-400" },
            { nome: "Azul C", classeCss: "bg-blue-400" },
            { nome: "Preta", classeCss: "bg-black" },
            { nome: "Cinza", classeCss: "bg-gray-400" },
            { nome: "Verde", classeCss: "bg-green-500" },
            { nome: "Marrom", classeCss: "bg-amber-800" }
        ],
        // NOVO: Controle de tamanhos (estilo objeto para saber se existe e se está em estoque real)
        tamanhos: [
            { numero: "23/24", disponivel: true },
            { numero: "25/26", disponivel: true },
            { numero: "27/28", disponivel: false }, // Isso vai fazer o tamanho ficar com um X de esgotado no visual
            { numero: "29/30", disponivel: true },
            { numero: "31/32", disponivel: true }
        ],
        // NOVO: Descrições ricas e galerias de imagens para essa versão da página
        galeriaImagens: [
            "assets/img/produtos/homem-aranha.png",
            "assets/img/produtos/homem-aranha2.png",
            "assets/img/produtos/homem-aranha3.png"
        ],
        descricao: "Para os pequenos heróis da casa, chegou o Babuche Bitpe Homem Aranha! Feito com material ultraleve de alta tecnologia que garante o máximo conforto durante todas as aventuras. Solado antiderrapante e alça móvel no calcanhar que permite usar como sandália ou chinelo.",
        beneficios: [
            "Resistente a odores, fácil de limpar e de secagem rápida",
            "Aberturas para ventilação e respiração dos pés",
            "Solado super macio que amortece o caminhar infantil",
            "Design anatômico que acomoda os pezinhos confortavelmente"
        ],
        esgotado: false
    },
    {
        id: "2",
        nome: "Babuche Minecraft",
        categoria: "INFANTIL",
        precoAtual: 139.90,
        precoAntigo: 179.90,
        etiqueta: "LANÇAMENTO",
        etiquetaCor: "bg-green-600",
        imagem: "assets/img/produtos/minecraft.png",
        cores: [
            { nome: "Verde", classeCss: "bg-green-600" },
            { nome: "Preta", classeCss: "bg-black" },
            { nome: "Marrom", classeCss: "bg-amber-800" },
            { nome: "Azul", classeCss: "bg-blue-500" },
            { nome: "Cinza", classeCss: "bg-gray-400" },
            { nome: "Vermelha", classeCss: "bg-red-600" }
        ],
        tamanhos: [
            { numero: "23/24", disponivel: true },
            { numero: "25/26", disponivel: true },
            { numero: "27/28", disponivel: true },
            { numero: "29/30", disponivel: true },
            { numero: "31/32", disponivel: false }
        ],
        galeriaImagens: [
            "assets/img/produtos/minecraft.png",
            "assets/img/produtos/minecraft2.png"
        ],
        descricao: "Para os aventureiros que amam construir mundos! O Babuche Bitpe Minecraft traz todo o universo pixelado para os pés dos pequenos. Material ultraleve, solado antiderrapante e alça móvel no calcanhar. Perfeito para o dia a dia e para explorar novos biomas!",
        beneficios: [
            "Material ultraleve e resistente a odores",
            "Solado antiderrapante para segurança nas aventuras",
            "Fácil de limpar — só passar água e pronto",
            "Design anatômico que acomoda os pezinhos confortavelmente"
        ],
        esgotado: false
    }
    // Para adicionar mais, basta botar uma vírgula no final da chave } acima e copiar o bloco!
];

// BANCO DE BANNERS (Os grandes que ficam passando no começo do site)
// Para colocar seus 3 banners, crie imagens JPG ou PNG no formato 16:9 (Desktop sugerido: 1920x800 ou 1600x600 px)
// E salve dentro da nova pasta assets/img/banners/ que criei para você
const bancoDeBanners = [
    {
        id: "1",
        imagem: "assets/img/banners/IMG-20260302-WA0027.jpg",
        imagemMobile: "",
        link: "produtos.html",
        titulo: "CONFORTO SEM LIMITES",
        corEscuraOverlay: 0.2
    },
    {
        id: "2",
        imagem: "assets/img/banners/IMG-20260302-WA0028.jpg",
        imagemMobile: "",
        link: "produtos.html",
        titulo: "Novos Babuches",
        corEscuraOverlay: 0.2
    }
];
