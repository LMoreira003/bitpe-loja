// Arquivo que lê os dados e constrói as caixinhas de produto sozinho no site
function renderizarProdutos(lista, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return; // Se a página não tiver a área dos produtos, aborta (só avita erro)

    container.innerHTML = ''; // Limpa antes para não duplicar se rodar de novo

    lista.forEach(produto => {
        // --- MONTANDO AS CORES ---
        let coresHtml = '';
        let maxCores = 3; // Mostrar até 3 bolinhas para não quebrar a caixa
        produto.cores.slice(0, maxCores).forEach((cor, index) => {
            let selectedRing = index === 0 ? "ring-2 ring-offset-1 ring-gray-400" : "";
            coresHtml += `<div class="w-5 h-5 rounded-full ${cor.classeCss} border border-gray-300 cursor-pointer ${selectedRing}" title="${cor.nome}"></div>`;
        });
        if (produto.cores.length > maxCores) {
            coresHtml += `<span class="text-xs text-gray-500 font-semibold self-center ml-1">+${produto.cores.length - maxCores}</span>`;
        }

        // --- MONTANDO O PREÇO ---
        let precoHtml = `<span class="text-brand font-bold text-xl">R$ ${produto.precoAtual.toFixed(2).replace('.', ',')}</span>`;
        if (produto.precoAntigo) { // Só mostra o riscado se houver preço antigo
            precoHtml += `<span class="line-through text-gray-400 text-sm ml-2">R$ ${produto.precoAntigo.toFixed(2).replace('.', ',')}</span>`;
        }

        // --- MONTANDO O SELO/TAG (Lançamento ou Esgotado) ---
        let tagHtml = '';
        if (produto.esgotado) {
            tagHtml = `<span class="absolute top-2 left-2 bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 z-20 rounded-sm">${'ESGOTADO'}</span>`;
        } else if (produto.etiqueta) {
            tagHtml = `<span class="absolute top-2 left-2 ${produto.etiquetaCor} text-white text-[10px] font-bold px-2 py-0.5 z-20 rounded-sm">${produto.etiqueta}</span>`;
        }

        // --- MONTANDO A IMAGEM ---
        // Se a imagem não for encontrada, eu criei uma inteligência artificial para jogar uma caixinha cinza no lugar avisando
        let imgErroFallout = "onerror=\"this.onerror=null; this.src='https://placehold.co/500x500/eaeaea/999?text=Cade+a+Sua+Foto+O+Chefe';\"";
        let opacityEsgotado = produto.esgotado ? "grayscale opacity-60" : "mix-blend-multiply";
        let imagemHtml = `<img src="${produto.imagem}" ${imgErroFallout} alt="${produto.nome}" class="product-img object-contain w-full h-full p-3 ${opacityEsgotado}">`;

        // --- FINAL DO CARD COMPLETO EM HTML ---
        // A tag <a> envolve quase todo o card para ser clicável, menos o coração (z-10)
        let cardHtml = `
            <div class="product-card bg-white p-4 group cursor-pointer border border-gray-100 shadow-sm hover:shadow-xl transition-shadow relative flex flex-col h-full">
                <button class="absolute top-4 right-4 text-gray-300 hover:text-red-500 z-20 transition-colors" title="Favoritar">
                    <i class="far fa-heart text-xl"></i>
                </button>
                
                <a href="produto-detalhe.html?id=${produto.id}" class="flex-grow flex flex-col z-10">
                    <div class="w-full overflow-hidden bg-gray-50 mb-4 aspect-square flex items-center justify-center relative rounded-lg">
                        ${tagHtml}
                        ${imagemHtml}
                        <!-- Hover Overlay Effect pra ficar mais premium -->
                        <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity"></div>
                    </div>
                    
                    <div class="flex flex-col flex-grow">
                        <div class="flex space-x-2 mb-2">
                            ${coresHtml}
                        </div>
                        <h3 class="text-gray-500 text-xs font-semibold mb-1">${produto.categoria}</h3>
                        <p class="font-bold text-gray-900 text-base md:text-lg mb-2 font-display uppercase break-words leading-tight flex-grow">${produto.nome}</p>
                        <div class="flex items-center gap-2 mb-4">
                            ${precoHtml}
                        </div>
                    </div>
                </a>

                <!-- Botão de Comprar Maior e 100% Largo preso no rodapé do card -->
                <div class="mt-auto z-10 pt-2 border-t border-gray-100">
                    <a href="produto-detalhe.html?id=${produto.id}" class="w-full bg-gray-900 text-white font-bold text-sm px-4 py-3 uppercase flex items-center justify-center hover:bg-brand transition-colors shadow-sm group-hover:shadow-md">
                        <i class="fas fa-shopping-bag mr-2"></i> VER DETALHES
                    </a>
                </div>
            </div>
        `;

        container.innerHTML += cardHtml; // Joga a carta inteira na tela!
    });
}

// Inicia as duas telas (O que não achar ele pula sozinho)
document.addEventListener('DOMContentLoaded', () => {
    // 0. Estrutura o Carrinho (Criando a gaveta na tela)
    iniciarCarrinhoLateral();

    // 1. Renderiza Produtos
    renderizarProdutos(bancoDeProdutos, 'vitrine-home');
    renderizarProdutos(bancoDeProdutos, 'vitrine-catalogo');

    // 2. Renderiza Banners se estiver na página inicial
    const bannerSliderContainer = document.getElementById('banner-slider');
    if (bannerSliderContainer && typeof bancoDeBanners !== 'undefined') {
        let bannerHtml = '';
        bancoDeBanners.forEach(banner => {
            let overlayOpacity = banner.corEscuraOverlay || 0;

            // Tratamento pra imagem mobile se existir
            let mobileClass = banner.imagemMobile ? 'hidden md:block' : '';
            let imgDesktop = `<img src="${banner.imagem}" alt="${banner.titulo}" class="w-full h-full object-cover select-none scale-[1.15] md:scale-100 ${mobileClass}" onerror="this.onerror=null; this.src='https://placehold.co/1920x800/eaeaea/999?text=Banner+Aqui';">`;

            let imgMobile = '';
            if (banner.imagemMobile) {
                imgMobile = `<img src="${banner.imagemMobile}" alt="${banner.titulo}" class="w-full h-full object-cover select-none md:hidden" onerror="this.onerror=null; this.src='https://placehold.co/800x800/eaeaea/999?text=Banner+Mobile';">`;
            }

            bannerHtml += `
                <div class="swiper-slide relative">
                    <a href="${banner.link}" class="w-full h-full block">
                        ${imgDesktop}
                        ${imgMobile}
                        <div class="absolute inset-0 bg-black pointer-events-none" style="opacity: ${overlayOpacity}"></div>
                    </a>
                </div>
            `;
        });
        bannerSliderContainer.innerHTML = bannerHtml;

        // Inicia inteligência do SwiperJS
        new Swiper('.mySwiper', {
            loop: true,
            autoplay: {
                delay: 4500, // Passa sozinho a cada 4.5 segundos
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }
});

// MOTOR DA PÁGINA DE DETALHES DO PRODUTO (produto-detalhe.html)
function renderizarPaginaDeDetalhes(idRequisitado) {
    if (typeof bancoDeProdutos === 'undefined') return;

    // Acha o produto certo baseando-se no ID (ex: 1 = Homem Aranha)
    const produto = bancoDeProdutos.find(p => String(p.id) === String(idRequisitado));

    // Se digitou ID errado na barra (ex ?id=999) manda pros produtos
    if (!produto) {
        window.location.href = 'produtos.html';
        return;
    }

    // 1. ARRUMA O BREADCRUMB NO TOPO 
    const containerBreadcrumb = document.getElementById('breadcrumb-container');
    if (containerBreadcrumb) {
        containerBreadcrumb.innerHTML = `
            <a href="index.html" class="hover:text-brand transition-colors">Início</a> <span class="mx-2 text-gray-300">/</span>
            <a href="produtos.html" class="hover:text-brand transition-colors">${produto.categoria}</a> <span class="mx-2 text-gray-300">/</span>
            <span class="text-gray-900 font-medium">${produto.nome}</span>
        `;
    }

    // 2. MONTA A ÁREA CENTRAL DA TELA 
    const containerPrincipal = document.getElementById('produto-container');
    if (!containerPrincipal) return;

    //   Preço HTML (Parecido com as vitrines)
    let precoHtml = `<span class="text-brand font-bold text-3xl font-display uppercase tracking-tight">R$ ${produto.precoAtual.toFixed(2).replace('.', ',')}</span>`;
    if (produto.precoAntigo) {
        precoHtml += `<span class="line-through text-gray-400 text-lg ml-3">R$ ${produto.precoAntigo.toFixed(2).replace('.', ',')}</span>`;
    }

    //  Galeria de Fotos (Slider automático + swipe + thumbs)
    const fotosParaMostrar = (produto.galeriaImagens && produto.galeriaImagens.length > 0) ? produto.galeriaImagens : [produto.imagem];

    let htmlThumbs = '';
    let htmlSliders = '';

    fotosParaMostrar.forEach((foto, i) => {
        let activeClass = i === 0 ? 'thumb-active' : 'opacity-60';

        htmlThumbs += `
            <div class="h-16 w-16 flex-shrink-0 border-2 border-transparent rounded cursor-pointer transition-all hover:opacity-100 ${activeClass} bg-gray-50 overflow-hidden" onclick="irParaSlide(${i})" data-thumb-index="${i}">
                <img src="${foto}" class="w-full h-full object-cover mix-blend-multiply" alt="Vista ${i + 1}">
            </div>
        `;

        let hiddenClass = i === 0 ? '' : 'hidden';
        htmlSliders += `
            <div data-slide-index="${i}" class="foto-display aspect-w-4 aspect-h-3 w-full h-full bg-gray-50 rounded flex items-center justify-center p-4 ${hiddenClass} transition-opacity duration-300">
               <img src="${foto}" class="w-full h-full object-contain mix-blend-multiply drop-shadow-lg" alt="${produto.nome}">
            </div>
        `;
    });

    //  Cores HTML (Selecionáveis - A primeira já começa ativa)
    let selecionarCorHtml = `<p class="font-bold text-sm mb-3">Cor: <span id="cor-nome-selecionada" class="text-brand font-bold">${produto.cores[0].nome}</span></p><div class="flex flex-wrap gap-3 mb-6" id="seletor-cores">`;
    produto.cores.forEach((cor, i) => {
        let ringBaseInfo = i === 0 ? "ring-2 ring-brand ring-offset-2 cor-ativa" : "border-gray-200";
        selecionarCorHtml += `
            <button onclick="selecionarCor(this, '${cor.nome}')" data-cor="${cor.nome}" title="${cor.nome}" class="btn-cor w-8 h-8 rounded-full ${cor.classeCss} border ${ringBaseInfo} shadow-sm hover:scale-110 transition-transform focus:outline-none"></button>
        `;
    });
    selecionarCorHtml += `</div>`;


    //  Tamanhos Disponiveis HTML (Interativos e obrigatórios)
    let selecionarTamanhoHtml = `<div class="flex justify-between items-end mb-3">
                                    <p class="font-bold text-sm">Tamanho: <span id="tam-nome-selecionado" class="text-brand font-bold">Selecione</span></p>
                                    <a href="#" class="text-brand text-xs font-bold underline">Guia de Tamanhos</a>
                                 </div>
                                 <div class="grid grid-cols-4 sm:grid-cols-5 gap-2 mb-4" id="seletor-tamanhos">`;

    // Tratamento para não quebrar se for produto antigo do BD
    let calcTamanhosArray = (typeof produto.tamanhos[0] === 'object') ? produto.tamanhos : produto.tamanhos.map(t => { return { numero: t, disponivel: true } });

    calcTamanhosArray.forEach(tam => {
        if (tam.disponivel) {
            selecionarTamanhoHtml += `
                 <button onclick="selecionarTamanho(this, '${tam.numero}')" data-tamanho="${tam.numero}" class="btn-tam border border-gray-300 py-3 rounded text-sm font-bold shadow-sm hover:border-brand hover:text-brand transition-colors focus:ring-2 focus:ring-brand focus:outline-none bg-white">
                    ${tam.numero}
                 </button>
             `;
        } else {
            selecionarTamanhoHtml += `
                 <button disabled class="border border-gray-200 bg-gray-100 text-gray-400 py-3 rounded text-sm font-bold cursor-not-allowed relative overflow-hidden">
                    ${tam.numero}
                    <div class="absolute inset-0 flex items-center justify-center"><div class="w-full h-px bg-gray-300 transform rotate-45"></div></div>
                 </button>
             `;
        }
    });
    selecionarTamanhoHtml += `</div>`;
    // Aviso de erro que só aparece quando clicar sem ter escolhido
    selecionarTamanhoHtml += `<p id="aviso-tamanho" class="text-red-500 text-xs font-bold mb-4 hidden"><i class="fas fa-exclamation-triangle mr-1"></i> Escolha um tamanho antes de continuar.</p>`;

    let btnComprarInfo = produto.esgotado ? "ESGOTADO" : `ADICIONAR R$ ${produto.precoAtual.toFixed(2).replace('.', ',')}`;
    let btnComprarClass = produto.esgotado ? "bg-gray-400 text-gray-100 cursor-not-allowed" : "bg-brand text-white hover:bg-brand-dark cursor-pointer";

    // MONTANDO A TELA INTEIRA AGORA - DIVIDIDO EM 2 BLOCOS (FOTOS ESQUERDA | COMPRAS DIREITA)
    containerPrincipal.innerHTML = `
        <div class="flex flex-col md:flex-row gap-12 lg:gap-16">
            
            <!-- COLUNA ESQUERDA: GALERIA MAGNÍFICA -->
            <div class="md:w-1/2 lg:w-3/5">
                 
                <!-- Visualizador Grandão com Setas -->
                <div id="galeria-principal" class="relative w-full h-[400px] md:h-[500px] lg:h-[600px] mb-4 select-none">
                     <!--  A etiqueta redonda chique se for lançamento  -->
                     ${produto.etiqueta ? `<span class="absolute top-6 left-6 ${produto.etiquetaCor || 'bg-brand'} text-white text-xs font-bold tracking-widest px-3 py-1 z-10 shadow-md">${produto.etiqueta}</span>` : ''}
                      
                     <!-- Botão de coração flutuante -->
                     <button class="absolute top-6 right-6 text-gray-400 hover:text-red-500 hover:scale-110 transition-all z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                        <i class="far fa-heart text-xl"></i>
                     </button>

                     <!-- Setas de navegação -->
                     <button onclick="slideAnterior()" class="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md text-gray-600 hover:text-brand transition-all">
                        <i class="fas fa-chevron-left"></i>
                     </button>
                     <button onclick="slideProximo()" class="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md text-gray-600 hover:text-brand transition-all">
                        <i class="fas fa-chevron-right"></i>
                     </button>
                      
                     ${htmlSliders}
                </div>
                
                <!-- Lista de Miniaturas (Thumbnails) abaixo -->
                <div class="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                     ${htmlThumbs}
                </div>
                 
                 ${produto.descricao ? `
                <!-- SOBRE O PRODUTO (Somente em Desktop, no mobile pode ficar piorzinho) -->
                <div class="hidden md:block mt-12 border-t border-gray-100 pt-8 text-gray-700 leading-relaxed">
                     <h2 class="text-2xl font-bold text-gray-900 mb-4 font-display">SOBRE O PRODUTO</h2>
                     <p class="mb-6">${produto.descricao}</p>
                     
                     ${produto.beneficios ? `
                     <ul class="space-y-2 list-disc pl-5">
                         ${produto.beneficios.map(b => `<li>${b}</li>`).join('')}
                     </ul>` : ''}
                </div> ` : ''}
            </div>
            
            <!-- COLUNA DIREITA: INFORMAÇÕES E BOTÕES DE AÇÃO -->
            <div class="md:w-1/2 lg:w-2/5 flex flex-col pt-2 lg:pt-8 relative">
                 <h1 class="text-3xl md:text-4xl font-bold font-display uppercase leading-none mb-2 text-gray-900">
                    ${produto.nome}
                 </h1>
                 
                 <div class="flex items-center gap-2 mb-6">
                     <div class="flex text-yellow-400 text-sm">
                        <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i>
                     </div>
                     <span class="text-sm text-gray-500 font-medium underline cursor-pointer">(124 Avaliações)</span>
                 </div>
                 
                 <div class="mb-8 flex items-end">
                     ${precoHtml}
                 </div>
                 
                 <!-- VARIÁVEIS DO PRODUTO (Cor e Tamanho gerados la emcima) -->
                 ${selecionarCorHtml}
                 ${selecionarTamanhoHtml}
                 
                 <!-- BOTÕES DE AÇÃO DUPLOS (CARRINHO E COMPRAR DIRETO) -->
                 <div class="flex flex-col gap-3 mb-6">
                      <button onclick="adicionarItemAoCarrinho('${produto.id}', false)" class="w-full bg-black text-white hover:bg-gray-800 h-14 font-display font-bold text-lg uppercase tracking-wider flex items-center justify-center shadow-md transition-colors ${produto.esgotado ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}">
                          <i class="fas fa-cart-plus mr-3"></i> 
                          ADICIONAR AO CARRINHO
                      </button>
                      
                      <button onclick="adicionarItemAoCarrinho('${produto.id}', true)" class="w-full ${btnComprarClass} h-16 font-display font-bold text-xl uppercase tracking-wider flex items-center justify-center shadow-lg transition-colors">
                          <i class="fas fa-bolt mr-3"></i> 
                          ${produto.esgotado ? 'ESGOTADO' : `COMPRAR AGORA (R$ ${produto.precoAtual.toFixed(2).replace('.', ',')})`}
                      </button>
                 </div>
                 
                 <!-- FRETE E PRAZOS -->
                 <div class="bg-gray-50 border border-gray-200 rounded p-4 mb-6">
                      <div class="flex items-start">
                           <i class="fas fa-truck text-gray-400 text-xl mt-1 mr-4"></i>
                           <div>
                                <p class="font-bold text-sm text-gray-900">Calcular Frete e Prazo</p>
                                <div class="flex mt-2 gap-2">
                                     <input type="text" placeholder="Seu CEP..." class="bg-white border border-gray-300 w-full py-2 px-3 text-sm rounded focus:ring-brand focus:border-brand outline-none">
                                     <button class="bg-black text-white px-4 text-sm font-bold rounded">OK</button>
                                </div>
                           </div>
                      </div>
                 </div>
                 
                 <!-- SANFONA DE INFORMAÇÕES (Estilo Accordion) -->
                 <div class="border-t border-gray-200 divide-y divide-gray-200 text-sm">
                      
                      ${produto.descricao ? `
                      <details class="group py-4 cursor-pointer md:hidden">
                          <summary class="flex justify-between items-center font-bold font-display uppercase select-none outline-none">
                              DESCRIÇÃO DO PRODUTO
                              <span class="transition group-open:rotate-180"><i class="fas fa-chevron-down text-gray-400"></i></span>
                          </summary>
                          <div class="pt-4 text-gray-600">
                              <p>${produto.descricao}</p>
                          </div>
                      </details>` : ''}
                      
                      <details class="group py-4 cursor-pointer">
                          <summary class="flex justify-between items-center font-bold font-display uppercase select-none outline-none">
                              CUIDADOS E MATERIAIS
                              <span class="transition group-open:rotate-180"><i class="fas fa-chevron-down text-gray-400"></i></span>
                          </summary>
                          <div class="pt-4 text-gray-600">
                              <p>Lave apenas com água e sabão neutro. Não utilize produtos químicos nem deixe secar ao sol forte para evitar encolhimento.</p>
                          </div>
                      </details>
                      
                 </div>
                 
            </div>
            
        </div>
    `;

    // Inicia o autoplay da galeria de fotos
    iniciarAutoplayGaleria();
}

// ==========================================================
// 🖼️ SLIDER DE GALERIA DO PRODUTO (Autoplay + Swipe + Setas)
// ==========================================================
let _slideAtual = 0;
let _totalSlides = 0;
let _autoplayInterval = null;
let _touchStartX = 0;
let _touchEndX = 0;

window.irParaSlide = function (index) {
    _slideAtual = index;
    atualizarSlide();
    reiniciarAutoplay();
}

window.slideAnterior = function () {
    _slideAtual = (_slideAtual - 1 + _totalSlides) % _totalSlides;
    atualizarSlide();
    reiniciarAutoplay();
}

window.slideProximo = function () {
    _slideAtual = (_slideAtual + 1) % _totalSlides;
    atualizarSlide();
    reiniciarAutoplay();
}

function atualizarSlide() {
    // Esconde todos os slides
    document.querySelectorAll('.foto-display').forEach(fd => fd.classList.add('hidden'));
    // Mostra o slide atual
    const slideAtivo = document.querySelector(`[data-slide-index="${_slideAtual}"]`);
    if (slideAtivo) slideAtivo.classList.remove('hidden');

    // Atualiza thumbs
    document.querySelectorAll('[data-thumb-index]').forEach(t => {
        t.classList.remove('thumb-active');
        t.classList.add('opacity-60');
    });
    const thumbAtivo = document.querySelector(`[data-thumb-index="${_slideAtual}"]`);
    if (thumbAtivo) {
        thumbAtivo.classList.add('thumb-active');
        thumbAtivo.classList.remove('opacity-60');
    }
}

function iniciarAutoplayGaleria() {
    _totalSlides = document.querySelectorAll('.foto-display').length;
    if (_totalSlides <= 1) return; // Sem autoplay se só tem 1 foto

    _autoplayInterval = setInterval(() => {
        _slideAtual = (_slideAtual + 1) % _totalSlides;
        atualizarSlide();
    }, 3500);

    // Swipe no mobile
    const galeria = document.getElementById('galeria-principal');
    if (galeria) {
        galeria.addEventListener('touchstart', (e) => {
            _touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        galeria.addEventListener('touchend', (e) => {
            _touchEndX = e.changedTouches[0].screenX;
            const diff = _touchStartX - _touchEndX;
            if (Math.abs(diff) > 50) { // Precisa de pelo menos 50px de swipe
                if (diff > 0) {
                    window.slideProximo();
                } else {
                    window.slideAnterior();
                }
            }
        }, { passive: true });
    }
}

function reiniciarAutoplay() {
    clearInterval(_autoplayInterval);
    _autoplayInterval = setInterval(() => {
        _slideAtual = (_slideAtual + 1) % _totalSlides;
        atualizarSlide();
    }, 3500);
}

// ==========================================================
// 🎨 FUNÇÕES INTERATIVAS DA PÁGINA DE DETALHES
// ==========================================================

// Variáveis temporárias da seleção ativa (vivem só enquanto o cara tá na página)
let _corSelecionada = null;
let _tamanhoSelecionado = null;

window.selecionarCor = function (botaoClicado, nomeCor) {
    document.querySelectorAll('.btn-cor').forEach(b => {
        b.classList.remove('ring-2', 'ring-brand', 'ring-offset-2', 'cor-ativa');
        b.classList.add('border-gray-200');
    });
    botaoClicado.classList.add('ring-2', 'ring-brand', 'ring-offset-2', 'cor-ativa');
    botaoClicado.classList.remove('border-gray-200');
    _corSelecionada = nomeCor;
    const labelCor = document.getElementById('cor-nome-selecionada');
    if (labelCor) labelCor.innerText = nomeCor;
}

window.selecionarTamanho = function (botaoClicado, numeroTam) {
    document.querySelectorAll('.btn-tam').forEach(b => {
        b.classList.remove('border-brand', 'bg-brand', 'text-white', 'tam-ativa');
        b.classList.add('border-gray-300', 'bg-white');
    });
    botaoClicado.classList.add('border-brand', 'bg-brand', 'text-white', 'tam-ativa');
    botaoClicado.classList.remove('border-gray-300', 'bg-white');
    _tamanhoSelecionado = numeroTam;
    const labelTam = document.getElementById('tam-nome-selecionado');
    if (labelTam) labelTam.innerText = numeroTam;
    const aviso = document.getElementById('aviso-tamanho');
    if (aviso) aviso.classList.add('hidden');
}

// ==========================================================
// 🛒 ECOSSISTEMA MÁGICO DO CARRINHO (LocalStorage)
// ==========================================================

function iniciarCarrinhoLateral() {
    // 1. Injeta o HTML do Carrinho e da Sombra Escura (Overlay) no fim do site
    const htmlCarrinho = `
        <!-- SOMBRA PRETA DO FUNDO -->
        <div id="carrinho-overlay" onclick="fecharCarrinho()" class="fixed inset-0 bg-black bg-opacity-50 z-[60] hidden transition-opacity opacity-0 duration-300"></div>
        
        <!-- A GAVETA LATERAL BRANCA (sem transition no início pra evitar flash) -->
        <div id="carrinho-lateral" class="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[70] shadow-2xl transform translate-x-full flex flex-col" style="visibility: hidden;">
            
            <!-- CABEÇALHO DO CARRINHO -->
            <div class="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 class="font-bold font-display text-xl uppercase tracking-wider flex items-center">
                    <i class="fas fa-shopping-bag mr-3 text-brand"></i> Meu Carrinho
                </h2>
                <button onclick="fecharCarrinho()" class="text-gray-400 hover:text-red-500 hover:scale-110 transition-all focus:outline-none">
                    <i class="fas fa-times text-2xl"></i>
                </button>
            </div>
            
            <!-- ÁREA DOS PRODUTOS ESCOLHIDOS (Rola a página) -->
            <div id="carrinho-lista-produtos" class="flex-grow p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4">
                <!-- Se tiver vazio, isso aqui aparece por padrão -->
            </div>
            
            <!-- RODAPÉ DO CARRINHO (Preço final e CHECKOUT) -->
            <div class="border-t border-gray-200 p-6 bg-white shrink-0 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
                <div class="flex justify-between items-end mb-6">
                    <span class="text-gray-500 font-bold uppercase tracking-wider text-sm">Total Estimado</span>
                    <span id="carrinho-total" class="font-display font-bold text-3xl text-gray-900 leading-none">R$ 0,00</span>
                </div>
                
                <p class="text-xs text-center text-gray-500 mb-4">Frete e descontos calculados no Checkout.</p>
                
                <button id="btn-finalizar-carrinho" onclick="irParaCheckout()" disabled class="w-full bg-gray-300 text-gray-500 font-bold h-14 uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center cursor-not-allowed">
                    FINALIZAR COMPRA <i class="fas fa-arrow-right ml-2 text-sm"></i>
                </button>
            </div>
        </div>
    `;

    // Gruda isso tudo dentro da nossa tag body HTML sem precisar ter escrito nos arquivos originais html
    document.body.insertAdjacentHTML('beforeend', htmlCarrinho);

    // 2. Transforma a bolsinha lá no menu de cima (Header) em um botão funcional que abre o carrinho
    const bolsinhasIcons = document.querySelectorAll('.fa-shopping-bag');
    bolsinhasIcons.forEach(icon => {
        // Ignora icones dentro dos cards
        if (!icon.parentElement.classList.contains('bg-gray-900') && !icon.parentElement.classList.contains('bg-brand')) {
            icon.parentElement.addEventListener('click', (e) => {
                e.preventDefault();
                abrirCarrinho();
            });
        }
    });

    // 3. Lê o banco de dados do navegador caso o cliente tenha fechado o site e voltado
    atualizarEVisibilizarCarrinhoHTML();

    // 4. Habilita a transition e visibilidade DEPOIS do DOM estabilizar (evita flash no load)
    setTimeout(() => {
        const carrinho = document.getElementById('carrinho-lateral');
        if (carrinho) {
            carrinho.style.visibility = 'visible';
            carrinho.classList.add('transition-transform', 'duration-300');
        }
    }, 200);
}

// Global no window para o HTML achar
window.abrirCarrinho = function () {
    const carrinho = document.getElementById('carrinho-lateral');
    const overlay = document.getElementById('carrinho-overlay');
    if (carrinho && overlay) {
        overlay.classList.remove('hidden');
        // Usar um timeout minusculo permite transição suave
        setTimeout(() => overlay.classList.remove('opacity-0'), 10);

        carrinho.classList.remove('translate-x-full');
    }
}

window.fecharCarrinho = function () {
    const carrinho = document.getElementById('carrinho-lateral');
    const overlay = document.getElementById('carrinho-overlay');
    if (carrinho && overlay) {
        carrinho.classList.add('translate-x-full');
        overlay.classList.add('opacity-0');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    }
}

// ESTA FUNÇÃO É CHAMADA PELO BOTÃO DA PAGINA DE DETALHES
window.adicionarItemAoCarrinho = function (idProduto, diretoProPagamento) {
    if (typeof bancoDeProdutos === 'undefined') return;

    const produtoEncontrado = bancoDeProdutos.find(p => String(p.id) === String(idProduto));
    if (!produtoEncontrado) return;

    // VALIDAÇÃO OBRIGATÓRIA: Se não escolheu tamanho, TRAVA
    if (!_tamanhoSelecionado) {
        const aviso = document.getElementById('aviso-tamanho');
        if (aviso) {
            aviso.classList.remove('hidden');
            document.getElementById('seletor-tamanhos').scrollIntoView({ behavior: 'smooth', block: 'center' });
            document.querySelectorAll('.btn-tam').forEach(b => {
                b.classList.add('animate-pulse');
                setTimeout(() => b.classList.remove('animate-pulse'), 1500);
            });
        }
        return; // PARA TUDO!
    }

    let corFinal = _corSelecionada || produtoEncontrado.cores[0].nome;

    let listaCarrinhoAtual = JSON.parse(localStorage.getItem('bitpe_carrinho')) || [];

    listaCarrinhoAtual.push({
        idArrayGerado: Date.now(),
        produtoId: produtoEncontrado.id,
        cor: corFinal,
        tamanho: _tamanhoSelecionado,
        qtd: 1
    });

    localStorage.setItem('bitpe_carrinho', JSON.stringify(listaCarrinhoAtual));
    atualizarEVisibilizarCarrinhoHTML();

    if (diretoProPagamento) {
        window.irParaCheckout();
    } else {
        window.abrirCarrinho();
    }
}

window.deletarDoCarrinho = function (idUnicoPraExcluir) {
    let listaCarrinhoAtual = JSON.parse(localStorage.getItem('bitpe_carrinho')) || [];
    // Filtra removendo quem clicamos
    let novaLista = listaCarrinhoAtual.filter(item => item.idArrayGerado !== idUnicoPraExcluir);
    localStorage.setItem('bitpe_carrinho', JSON.stringify(novaLista));
    atualizarEVisibilizarCarrinhoHTML();
}

function atualizarEVisibilizarCarrinhoHTML() {
    let listaCarrinhoAtual = JSON.parse(localStorage.getItem('bitpe_carrinho')) || [];
    const containerLista = document.getElementById('carrinho-lista-produtos');
    const containerTotal = document.getElementById('carrinho-total');

    if (!containerLista) return;

    if (listaCarrinhoAtual.length === 0) {
        containerLista.innerHTML = `
              <div class="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center mt-12">
                  <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300 mx-auto">
                     <i class="fas fa-shopping-bag text-4xl mt-2"></i>
                  </div>
                  <h3 class="font-bold font-display uppercase text-gray-900 text-xl tracking-wider mb-2">Seu Carrinho Vazio</h3>
                  <p class="text-xs">Comece a comprar novos babuches.</p>
                  <button onclick="fecharCarrinho()" class="mt-6 font-bold text-brand uppercase text-xs tracking-widest underline hover:text-brand-dark transition-colors">
                      Ver Catálogo
                  </button>
              </div>
         `;
        containerTotal.innerText = "R$ 0,00";
        // Limpador do badge no topo
        document.querySelectorAll('.carrinho-badge').forEach(e => e.remove());
        // Travar o botão Finalizar
        const btnFin = document.getElementById('btn-finalizar-carrinho');
        if (btnFin) { btnFin.disabled = true; btnFin.className = 'w-full bg-gray-300 text-gray-500 font-bold h-14 uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center cursor-not-allowed'; }
        return;
    }

    let htmlProdutosDentro = '';
    let totalAcumulado = 0;

    listaCarrinhoAtual.forEach(itemCarregado => {
        // Busca info usando ID que está salvo
        const produtoBase = bancoDeProdutos.find(p => String(p.id) === String(itemCarregado.produtoId));
        if (produtoBase) {
            totalAcumulado += produtoBase.precoAtual * itemCarregado.qtd;

            // Monta o Card listado dentro do Carrinho
            let infoExtra = '';
            if (itemCarregado.cor) infoExtra += `<span>Cor: ${itemCarregado.cor}</span>`;
            if (itemCarregado.tamanho) infoExtra += `<span class="ml-2">| Tam: ${itemCarregado.tamanho}</span>`;

            htmlProdutosDentro += `
                  <div class="bg-white border border-gray-100 p-3 rounded shadow-sm flex gap-4 relative pr-10 hover:border-gray-300 transition-colors">
                       <div class="w-20 h-20 bg-gray-50 rounded flex-shrink-0 flex items-center justify-center border border-gray-100 overflow-hidden">
                           <img src="${produtoBase.imagem}" class="object-cover w-full h-full mix-blend-multiply" alt="${produtoBase.nome}">
                       </div>
                       
                       <div class="flex flex-col flex-grow pt-1">
                            <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">${produtoBase.categoria}</span>
                            <span class="font-bold text-sm text-gray-900 leading-tight mb-1 pr-4 break-words">${produtoBase.nome}</span>
                            <span class="text-[11px] text-gray-500 mb-2">${infoExtra}</span>
                            
                            <div class="mt-auto flex items-end justify-between">
                                <span class="font-display font-bold text-brand uppercase text-lg">R$ ${produtoBase.precoAtual.toFixed(2).replace('.', ',')}</span>
                            </div>
                       </div>

                       <!-- Botão Lixeira Colorido Absolute -->
                       <button onclick="deletarDoCarrinho(${itemCarregado.idArrayGerado})" class="absolute top-3 right-3 text-red-400 hover:text-white hover:bg-red-500 w-8 h-8 rounded-full flex items-center justify-center transition-all focus:outline-none">
                             <i class="fas fa-trash-alt text-sm"></i>
                       </button>
                  </div>
             `;
        }
    });

    containerLista.innerHTML = htmlProdutosDentro;
    containerTotal.innerText = `R$ ${totalAcumulado.toFixed(2).replace('.', ',')}`;

    // Destravar o botão Finalizar (agora tem itens!)
    const btnFin2 = document.getElementById('btn-finalizar-carrinho');
    if (btnFin2) { btnFin2.disabled = false; btnFin2.className = 'w-full bg-brand text-white font-bold h-14 uppercase tracking-wider hover:bg-brand-dark transition-colors shadow-lg flex items-center justify-center cursor-pointer'; }

    // A mágica Badge (um selinho vermelho perto do icone de cima)
    document.querySelectorAll('.carrinho-badge').forEach(e => e.remove());
    const iconsSacola = document.querySelectorAll('.fa-shopping-bag');
    iconsSacola.forEach(icon => {
        if (!icon.parentElement.classList.contains('bg-gray-900') && !icon.parentElement.classList.contains('bg-brand') && !icon.closest('.absolute')) {
            if (icon.parentElement.tagName === 'BUTTON' || icon.parentElement.tagName === 'A') {
                icon.parentElement.classList.add('relative');
                icon.parentElement.insertAdjacentHTML('beforeend', `
                     <span class="carrinho-badge absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center outline outline-2 outline-white shadow-sm z-50 animate-bounce">
                         ${listaCarrinhoAtual.length}
                     </span>
                 `);
            }
        }
    });
}

// E O BOTÃO DO DINHEIRO REAL:
window.irParaCheckout = function () {
    let listaCarrinhoAtual = JSON.parse(localStorage.getItem('bitpe_carrinho')) || [];
    if (listaCarrinhoAtual.length > 0) {
        window.location.href = 'checkout.html';
    }
    // Se vazio, o botão já está travado visualmente então nunca chega aqui
}
