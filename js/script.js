// Script para a landing page de Saulo Larangeira

document.addEventListener('DOMContentLoaded', function() {
    // Inicialização de todas as funcionalidades
    setupSmoothScrolling();
    setupMobileMenu();
    setupAulaDetails();
    setupGaleriaCarousel();
    setupVideoCarousel();
    setupTestimonialCarousel();
    setupAccordion();
    setupForms();
    setupBackToTop();
    setupInstrumentoSelect();
    setupGuitarAnimation();
});

// Função para navegação suave entre seções
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Fechar menu mobile se estiver aberto
                const menu = document.querySelector('.menu');
                if (menu.classList.contains('active')) {
                    menu.classList.remove('active');
                }
                
                // Scroll suave para a seção
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Função para menu mobile
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    const header = document.getElementById('header');
    
    if (menuToggle && menu) {
        menuToggle.addEventListener('click', function() {
            menu.classList.toggle('active');
            this.classList.toggle('active');
            
            // Alternar ícone do hamburger
            const hamburger = this.querySelector('.hamburger');
            if (hamburger) {
                hamburger.classList.toggle('active');
            }
        });
    }
    
    // Header com efeito de scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Função para exibir detalhes das aulas
function setupAulaDetails() {
    const detailButtons = document.querySelectorAll('.btn-details');
    const closeButtons = document.querySelectorAll('.btn-close, .details-close');
    
    // Função auxiliar para fechar o modal
    function closeModal(target) {
        const detailsElement = document.getElementById(`${target}-details`);
        if (detailsElement) {
            detailsElement.classList.remove('active');
            document.body.style.overflow = ''; // Restaurar rolagem do body
        }
    }
    
    // Função auxiliar para abrir o modal
    function openModal(target) {
        const detailsElement = document.getElementById(`${target}-details`);
        if (detailsElement) {
            detailsElement.classList.add('active');
            document.body.style.overflow = 'hidden'; // Impedir rolagem do body
        }
    }
    
    // Ação do botão "Ver Detalhes" removida
    
    // Fechar modal ao clicar em qualquer botão de fechar
    closeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const target = this.getAttribute('data-target');
            closeModal(target);
        });
    });
    
    // Fechar ao clicar fora do conteúdo (no overlay)
    const detailsElements = document.querySelectorAll('.aula-details');
    detailsElements.forEach(element => {
        element.addEventListener('click', function(e) {
            // Fechar apenas se clicar diretamente no overlay (não no conteúdo)
            if (e.target === this) {
                const target = this.id.replace('-details', '');
                closeModal(target);
            }
        });
    });
    
    // Fechar modal com a tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.aula-details.active');
            if (activeModal) {
                const target = activeModal.id.replace('-details', '');
                closeModal(target);
            }
        }
    });
}

// Função para carrossel da galeria de fotos
function setupGaleriaCarousel() {
    const track = document.querySelector('.galeria-track');
    const prevBtn = document.querySelector('.galeria-btn.prev');
    const nextBtn = document.querySelector('.galeria-btn.next');
    const items = document.querySelectorAll('.galeria-item');
    const modal = document.getElementById('galeria-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    const modalClose = document.querySelector('.modal-close');
    
    if (!track || !items.length) return;
    
    let currentIndex = 1; // Começa com a segunda foto (índice 1) no centro
    const totalItems = items.length;
    
    // Função para atualizar o carrossel
    function updateCarousel() {
        items.forEach((item, index) => {
            const itemIndex = parseInt(item.getAttribute('data-index'));
            
            // Remover todas as classes
            item.classList.remove('center', 'side');
            item.style.display = 'block';
            
            // Calcular posição relativa ao índice atual
            let relativeIndex = itemIndex - currentIndex;
            
            // Ajustar para loop circular
            if (relativeIndex < -Math.floor(totalItems / 2)) {
                relativeIndex += totalItems;
            } else if (relativeIndex > Math.floor(totalItems / 2)) {
                relativeIndex -= totalItems;
            }
            
            // Aplicar classes baseado na posição
            if (relativeIndex === 0) {
                // Foto central
                item.classList.add('center');
                item.style.display = 'block';
            } else if (Math.abs(relativeIndex) <= 1) {
                // Fotos laterais visíveis
                item.classList.add('side');
                item.style.display = 'block';
            } else {
                // Fotos escondidas
                item.style.display = 'none';
            }
        });
    }
    
    // Função para avançar
    function goToNext() {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    }
    
    // Função para voltar
    function goToPrev() {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
    }
    
    // Event listeners para os botões
    if (prevBtn) prevBtn.addEventListener('click', goToPrev);
    if (nextBtn) nextBtn.addEventListener('click', goToNext);
    
    // Abrir modal ao clicar na foto central
    items.forEach(item => {
        item.addEventListener('click', function() {
            if (this.classList.contains('center') && modal && modalImg && modalCaption) {
                const img = this.querySelector('img');
                const caption = this.querySelector('.galeria-overlay span');
                
                modal.style.display = 'block';
                modalImg.src = img.src;
                modalCaption.textContent = caption ? caption.textContent : '';
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Fechar modal
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
    
    // Fechar modal ao clicar fora
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
    
    // Inicializar carrossel
    updateCarousel();
}

// Função para carrossel de vídeos moderno
function setupVideoCarousel() {
    const mainVideo = document.getElementById('video-main');
    const mainVideoTitle = document.getElementById('video-main-title');
    const thumbnailItems = document.querySelectorAll('.video-thumbnail-item');
    const prevBtn = document.getElementById('video-prev');
    const nextBtn = document.getElementById('video-next');
    const indicatorsContainer = document.getElementById('video-indicators');
    
    if (!mainVideo || !thumbnailItems.length) return;
    
    let currentIndex = 1; // Começa com o segundo vídeo
    const totalVideos = thumbnailItems.length;
    
    // Criar indicadores
    if (indicatorsContainer) {
        indicatorsContainer.innerHTML = '';
        thumbnailItems.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'video-indicator';
            if (index === currentIndex) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToVideo(index));
            indicatorsContainer.appendChild(indicator);
        });
    }
    
    // Função para atualizar o vídeo principal
    function updateMainVideo(index) {
        const thumbnail = thumbnailItems[index];
        const videoSrc = thumbnail.getAttribute('data-video');
        const videoTitle = thumbnail.getAttribute('data-title');
        
        if (mainVideo && videoSrc) {
            mainVideo.src = videoSrc;
            mainVideo.load(); // Recarregar o vídeo
        }
        
        if (mainVideoTitle && videoTitle) {
            mainVideoTitle.textContent = videoTitle;
        }
        
        // Atualizar thumbnail ativo
        thumbnailItems.forEach((item, idx) => {
            item.classList.remove('active');
            if (idx === index) {
                item.classList.add('active');
            }
        });
        
        // Atualizar indicadores
        if (indicatorsContainer) {
            const indicators = indicatorsContainer.querySelectorAll('.video-indicator');
            indicators.forEach((indicator, idx) => {
                indicator.classList.remove('active');
                if (idx === index) {
                    indicator.classList.add('active');
                }
            });
        }
        
        // Atualizar botões
        updateButtons();
    }
    
    // Função para atualizar estado dos botões
    function updateButtons() {
        if (prevBtn) {
            prevBtn.disabled = currentIndex === 0;
        }
        if (nextBtn) {
            nextBtn.disabled = currentIndex === totalVideos - 1;
        }
    }
    
    // Função para ir para um vídeo específico
    function goToVideo(index) {
        if (index >= 0 && index < totalVideos) {
            currentIndex = index;
            updateMainVideo(currentIndex);
        }
    }
    
    // Função para avançar
    function goToNext() {
        if (currentIndex < totalVideos - 1) {
            currentIndex++;
            updateMainVideo(currentIndex);
        }
    }
    
    // Função para voltar
    function goToPrev() {
        if (currentIndex > 0) {
            currentIndex--;
            updateMainVideo(currentIndex);
        }
    }
    
    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', goToPrev);
    if (nextBtn) nextBtn.addEventListener('click', goToNext);
    
    // Clique nas miniaturas
    thumbnailItems.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            goToVideo(index);
        });
    });
    
    // Carregar vídeos das miniaturas
    thumbnailItems.forEach(thumbnail => {
        const video = thumbnail.querySelector('video');
        if (video) {
            video.addEventListener('loadeddata', function() {
                // Vídeo carregado, pode mostrar thumbnail
            });
        }
    });
    
    // Inicializar
    updateMainVideo(currentIndex);
}

// Função para carrossel de depoimentos
function setupTestimonialCarousel() {
    const track = document.querySelector('.testimonial-track');
    const prevBtn = document.querySelector('.testimonial-btn.prev');
    const nextBtn = document.querySelector('.testimonial-btn.next');
    const items = document.querySelectorAll('.testimonial-item');
    
    if (!track || !items.length) return;
    
    let currentIndex = 0;
    const itemCount = items.length;
    
    function updateCarousel() {
        const itemWidth = items[0].offsetWidth;
        track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    }
    
    function goToNext() {
        currentIndex = (currentIndex + 1) % itemCount;
        updateCarousel();
    }
    
    function goToPrev() {
        currentIndex = (currentIndex - 1 + itemCount) % itemCount;
        updateCarousel();
    }
    
    if (prevBtn) prevBtn.addEventListener('click', goToPrev);
    if (nextBtn) nextBtn.addEventListener('click', goToNext);
    
    // Atualizar carrossel quando a janela for redimensionada
    window.addEventListener('resize', updateCarousel);
    
    // Inicializar
    updateCarousel();
    
    // Auto-rotação a cada 5 segundos
    setInterval(goToNext, 5000);
}

// Função para acordeão do FAQ
function setupAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        if (header) {
            header.addEventListener('click', function() {
                // Fechar todos os outros itens
                accordionItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Alternar estado do item atual
                item.classList.toggle('active');
            });
        }
    });
}

// Função para validação e submissão de formulários
function setupForms() {
    const formAula = document.getElementById('form-aula-experimental');
    const formContato = document.getElementById('form-contato');
    const formSuccessAula = document.getElementById('form-success-aula');
    const formSuccessContato = document.getElementById('form-success-contato');
    
    // Validação e submissão do formulário de aula experimental
    if (formAula && formSuccessAula) {
        formAula.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                // Simulação de envio (em produção, aqui seria uma chamada AJAX)
                setTimeout(() => {
                    formAula.style.display = 'none';
                    formSuccessAula.style.display = 'block';
                }, 1000);
            }
        });
    }
    
    // Validação e submissão do formulário de contato
    if (formContato && formSuccessContato) {
        formContato.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                // Simulação de envio (em produção, aqui seria uma chamada AJAX)
                setTimeout(() => {
                    formContato.style.display = 'none';
                    formSuccessContato.style.display = 'block';
                }, 1000);
            }
        });
    }
    
    
    // Função auxiliar para validação de formulários
    function validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                isValid = false;
                showError(input, 'Este campo é obrigatório');
            } else if (input.type === 'email' && input.value && !validateEmail(input.value)) {
                isValid = false;
                showError(input, 'Por favor, insira um e-mail válido');
            } else {
                removeError(input);
            }
        });
        
        return isValid;
    }
    
    // Função auxiliar para validação de e-mail
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Função auxiliar para exibir mensagem de erro
    function showError(input, message) {
        removeError(input);
        
        input.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        const parent = input.parentElement;
        parent.appendChild(errorElement);
    }
    
    // Função auxiliar para remover mensagem de erro
    function removeError(input) {
        input.classList.remove('error');
        
        const parent = input.parentElement;
        const errorElement = parent.querySelector('.error-message');
        if (errorElement) {
            parent.removeChild(errorElement);
        }
    }
}

// Função para mostrar/ocultar campo de outro instrumento
function setupInstrumentoSelect() {
    const instrumentoSelect = document.getElementById('instrumento-aula');
    const outroInstrumentoGroup = document.getElementById('outro-instrumento-group');
    
    if (instrumentoSelect && outroInstrumentoGroup) {
        instrumentoSelect.addEventListener('change', function() {
            if (this.value === 'outro') {
                outroInstrumentoGroup.style.display = 'block';
            } else {
                outroInstrumentoGroup.style.display = 'none';
            }
        });
    }
}

// Função para botão "Voltar ao Topo"
function setupBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('active');
            } else {
                backToTopButton.classList.remove('active');
            }
        });
        
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Adicionar efeito de hamburger no menu mobile
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const hamburger = this.querySelector('.hamburger');
            
            if (hamburger) {
                hamburger.classList.toggle('active');
                
                if (hamburger.classList.contains('active')) {
                    hamburger.style.transform = 'rotate(45deg)';
                    hamburger.style.backgroundColor = 'transparent';
                } else {
                    hamburger.style.transform = 'rotate(0)';
                    hamburger.style.backgroundColor = 'var(--color-black)';
                }
                
                const before = window.getComputedStyle(hamburger, '::before');
                const after = window.getComputedStyle(hamburger, '::after');
                
                if (hamburger.classList.contains('active')) {
                    hamburger.style.setProperty('--hamburger-before', 'rotate(90deg) translate(0, 0)');
                    hamburger.style.setProperty('--hamburger-after', 'rotate(0) translate(0, 0)');
                } else {
                    hamburger.style.setProperty('--hamburger-before', 'rotate(0) translate(0, -8px)');
                    hamburger.style.setProperty('--hamburger-after', 'rotate(0) translate(0, 8px)');
                }
            }
        });
    }
});

// Função para animação do guitarrista
function setupGuitarAnimation() {
    const canvas = document.getElementById('guitar-animation');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Configurações da animação
    let time = 0;
    const animationSpeed = 0.05;
    
    // Cores do tema
    const orange = '#FF8C42';
    const orangeDark = '#FF6B1A';
    const white = '#FFFFFF';
    const dark = '#1a1a1a';
    
    function drawGuitarist() {
        // Limpar canvas
        ctx.clearRect(0, 0, width, height);
        
        // Centro do canvas
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Animação de movimento
        const bodyBounce = Math.sin(time * 2) * 2;
        const handMovement = Math.sin(time * 3) * 8;
        const headSway = Math.sin(time * 1.5) * 3;
        
        // Corpo
        ctx.fillStyle = orange;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + 20 + bodyBounce, 25, 35, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Cabeça
        ctx.fillStyle = '#FFD4A3'; // Cor de pele
        ctx.beginPath();
        ctx.arc(centerX + headSway, centerY - 50, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Cabelo
        ctx.fillStyle = dark;
        ctx.beginPath();
        ctx.arc(centerX + headSway, centerY - 55, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFD4A3';
        ctx.beginPath();
        ctx.arc(centerX + headSway, centerY - 50, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Olhos
        ctx.fillStyle = dark;
        ctx.beginPath();
        ctx.arc(centerX - 5 + headSway, centerY - 52, 2, 0, Math.PI * 2);
        ctx.arc(centerX + 5 + headSway, centerY - 52, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Braço esquerdo (tocando)
        ctx.strokeStyle = orange;
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(centerX - 15, centerY - 10);
        ctx.lineTo(centerX - 35 - handMovement, centerY - 5);
        ctx.stroke();
        
        // Mão esquerda
        ctx.fillStyle = '#FFD4A3';
        ctx.beginPath();
        ctx.arc(centerX - 35 - handMovement, centerY - 5, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Braço direito
        ctx.strokeStyle = orange;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(centerX + 15, centerY - 10);
        ctx.lineTo(centerX + 30, centerY + 10);
        ctx.stroke();
        
        // Mão direita
        ctx.fillStyle = '#FFD4A3';
        ctx.beginPath();
        ctx.arc(centerX + 30, centerY + 10, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Guitarra
        const guitarRotation = Math.sin(time * 2) * 0.05;
        ctx.save();
        ctx.translate(centerX, centerY + 30);
        ctx.rotate(guitarRotation);
        
        // Corpo da guitarra
        ctx.fillStyle = '#8B4513'; // Marrom
        ctx.beginPath();
        ctx.ellipse(0, 0, 40, 60, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Buraco do som
        ctx.fillStyle = dark;
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Braço da guitarra
        ctx.fillStyle = '#654321';
        ctx.fillRect(-5, -60, 10, 60);
        
        // Trastes
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        for (let i = 1; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(-5, -60 + i * 12);
            ctx.lineTo(5, -60 + i * 12);
            ctx.stroke();
        }
        
        // Cordas
        ctx.strokeStyle = '#DDD';
        ctx.lineWidth = 1;
        const stringPositions = [-3, -1, 1, 3];
        stringPositions.forEach(pos => {
            ctx.beginPath();
            ctx.moveTo(pos, -60);
            ctx.lineTo(pos, 0);
            ctx.stroke();
        });
        
        ctx.restore();
        
        // Efeito de ondas sonoras
        const waveRadius = (Math.sin(time * 4) * 10 + 30) % 40;
        if (waveRadius > 0) {
            ctx.strokeStyle = orange;
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.arc(centerX, centerY + 30, waveRadius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
        
        // Notas musicais flutuantes
        const notes = [
            { x: centerX - 60, y: centerY - 30 + Math.sin(time * 2) * 10 },
            { x: centerX + 60, y: centerY - 20 + Math.sin(time * 2.5) * 10 },
            { x: centerX - 50, y: centerY - 60 + Math.sin(time * 1.5) * 10 }
        ];
        
        notes.forEach((note, index) => {
            ctx.fillStyle = orange;
            ctx.font = 'bold 16px Arial';
            ctx.fillText('♪', note.x, note.y);
        });
    }
    
    function animate() {
        time += animationSpeed;
        drawGuitarist();
        requestAnimationFrame(animate);
    }
    
    // Iniciar animação
    animate();
}
