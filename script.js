/**
 * ARCHITECTURE JAVASCRIPT - SITAFRIQUE
 * Orientée performance, expérience utilisateur et maintenabilité.
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    
    // --- INITIALISATION DES MODULES ---
    ScrollManager.init();
    FormManager.init();
    ContentManager.init();
    
});

/**
 * GESTIONNAIRE DE DÉFILEMENT (Scroll Animations)
 */
const ScrollManager = {
    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach(el => this.observer.observe(el));
    }
};

/**
 * GESTIONNAIRE DE FORMULAIRE (Progressive Flow)
 */
const FormManager = {
    form: document.getElementById('partner-form'),
    steps: document.querySelectorAll('.form-step'),
    nextBtns: document.querySelectorAll('.btn-next'),
    backBtns: document.querySelectorAll('.btn-back'),
    currentStep: 1,
    
    // Configuration des destinataires
    contactInfo: {
        waNumber: "+33641286657",
        emailAddress: "kevinwilliammkd@gmail.com"
    },

    init() {
        this.setupNavigation();
        this.setupSubmission();
        this.setupFinalTriggers();
    },

    // Navigation entre les étapes
    setupNavigation() {
        this.nextBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.validateCurrentStep()) {
                    this.goToStep(this.currentStep + 1);
                }
            });
        });

        this.backBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.goToStep(this.currentStep - 1);
            });
        });
    },

    // Validation basique des champs par étape
    validateCurrentStep() {
        const currentStepEl = Array.from(this.steps).find(step => parseInt(step.dataset.step) === this.currentStep);
        const inputs = currentStepEl.querySelectorAll('input, select, textarea');
        
        let isValid = true;
        inputs.forEach(input => {
            if (!input.checkValidity()) {
                input.reportValidity();
                isValid = false;
            }
        });
        return isValid;
    },

    goToStep(stepNumber) {
        this.steps.forEach(step => step.classList.remove('active'));
        const targetStep = Array.from(this.steps).find(step => parseInt(step.dataset.step) === stepNumber);
        if (targetStep) {
            targetStep.classList.add('active');
            this.currentStep = stepNumber;
        }
    },

    // Gestion de la soumission finale (Validation des données)
    setupSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.goToStep(4); // Afficher le choix final
        });
    },

    // Déclencheurs pour WhatsApp et Mail
    setupFinalTriggers() {
        const waBtn = document.getElementById('whatsapp-trigger');
        const mailBtn = document.getElementById('email-trigger');

        waBtn.addEventListener('click', () => this.handleRedirection('whatsapp'));
        mailBtn.addEventListener('click', () => this.handleRedirection('email'));
    },

    // Formatage et Envoi
    handleRedirection(type) {
        const data = {
            name: document.getElementById('fullname').value,
            country: document.getElementById('country').value,
            phone: document.getElementById('phone-input').value,
            email: document.getElementById('email-input').value,
            message: document.getElementById('message-input').value
        };

        const structuredText = this.formatMessage(data);

        if (type === 'whatsapp') {
            const encoded = encodeURIComponent(structuredText);
            window.open(`https://wa.me/${this.contactInfo.waNumber}?text=${encoded}`, '_blank');
        } else {
            const subject = encodeURIComponent("Partenariat SITAFRIQUE - " + data.name);
            const encodedBody = encodeURIComponent(structuredText);
            window.location.href = `mailto:${this.contactInfo.emailAddress}?subject=${subject}&body=${encodedBody}`;
        }
    },

    // Construction du bloc de texte structuré
    formatMessage(d) {
        return `SITAFRIQUE - NOUVELLE DEMANDE DE PARTENARIAT\n\n` +
               `👤 Nom Complet : ${d.name}\n` +
               `🌍 Pays : ${d.country}\n` +
               `📱 Téléphone : ${d.phone}\n` +
               `📧 Email : ${d.email}\n\n` +
               `📝 Nature du Soutien / Partenariat :\n${d.message}`;
    }
};

/**
 * GESTIONNAIRE DE CONTENU DYNAMIQUE (Modals / Infinite Content)
 */
const ContentManager = {
    overlay: document.getElementById('content-overlay'),
    contentBox: document.getElementById('dynamic-content'),
    closeBtn: document.querySelector('.close-overlay'),
    
    // Base de données de contenu pour l'aspect "contenu infini"
    library: {
        'vision-details': {
            title: "Vision & Espoir",
            content: `
                <p>SITAFRIQUE est née d’un cri de douleur, d’un appel à la préservation de l’avenir de notre jeunesse. Cette jeunesse, véritable don de Dieu, est pleine de rêves et d’une énergie créatrice inestimable.</p>
                <p>Notre vision est de créer un espace où l’éthique, l’innovation et les cultures diverses se rencontrent pour bâtir des projets solides et durables.</p>
                <div style="margin-top:2rem; padding:2rem; background:rgba(255,255,255,0.05); border-radius:20px;">
                    <h4>Une Lumière dans l'Obscurité</h4>
                    <p>Nous souhaitons offrir une opportunité de rédemption à ceux qui ont été victimes de la corruption et des injustices.</p>
                </div>
            `
        },
        'mission-details': {
            title: "Notre Mission Sociale",
            content: `
                <p>Aider la jeunesse à se redécouvrir, à se lever et à utiliser ses talents pour le bien de la société. Nous travaillons main dans la main avec des personnes sincères et animées par des valeurs humaines profondes.</p>
                <ul>
                    <li>Valorisation des cultures africaines et antillaises.</li>
                    <li>Promotion des produits locaux sur les marchés internationaux.</li>
                    <li>Partenariats locaux durables pour une croissance équitable.</li>
                </ul>
            `
        },
        'principes-details': {
            title: "Principes Fondamentaux",
            content: `
                <p>Nous rejetons toutes les formes d’exploitation et d’immoralité. Nous croyons que chaque être humain a été créé avec un potentiel unique qui doit servir le bien collectif.</p>
                <blockquote>"Aime ton prochain comme toi-même."</blockquote>
                <p>La règle d'or qui guide chacune de nos transactions commerciales et relations humaines.</p>
            `
        }
    },

    init() {
        this.setupTriggers();
        this.setupClose();
    },

    setupTriggers() {
        document.querySelectorAll('.card-interactive').forEach(card => {
            card.addEventListener('click', () => {
                const target = card.dataset.target;
                this.showContent(target);
            });
        });
    },

    showContent(id) {
        const data = this.library[id];
        if (!data) return;

        this.contentBox.innerHTML = `
            <span class="badge" style="margin-bottom:1rem">Détails</span>
            <h2 style="font-size:3rem; margin-bottom:2rem">${data.title}</h2>
            <div class="rich-text" style="font-size:1.2rem; color:var(--text-dim)">
                ${data.content}
            </div>
        `;

        this.overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Empêcher le scroll
    },

    setupClose() {
        this.closeBtn.addEventListener('click', () => this.close());
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });
    },

    close() {
        this.overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};
