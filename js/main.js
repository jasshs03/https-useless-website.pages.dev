import { initRunawayButton } from './modules/runaway-button.js';
import { initCounter } from './modules/counter.js';
import { initLoader } from './modules/loader.js';
import { initCatFacts } from './modules/cat-facts.js';
import { initNothingButton } from './modules/nothing-button.js';
import { initPotatoes } from './modules/potatoes.js';
import { initChoiceHover } from './modules/choice-hover.js';
import { initCatTrail } from './modules/cat-trail.js';
import { initCreditPrompt } from './modules/credit-prompt.js';
import { initSocialsModal } from './modules/socials-modal.js';

// Site-wide chrome
import { initFunFact } from './modules/fun-fact.js';
import { initMilestones } from './modules/milestones.js';
import { initKonami } from './modules/konami.js';
import { initBootSequence } from './modules/boot-sequence.js';
import { initPixelPet } from './modules/pixel-pet.js';
import { initGlobalCounter } from './modules/global-counter.js';
import { initSecretCat } from './modules/secret-cat.js';
import { initVoidMode } from './modules/void-mode.js';

// New experience modules
import { initBored } from './modules/bored.js';
import { initWheel } from './modules/wheel.js';
import { initComplaints } from './modules/complaints.js';
import { initVisitorsMap } from './modules/visitors.js';
import { initIdleAura } from './modules/idle-aura.js';

// Boot all the uselessness. Each module no-ops if its elements
// aren't on the current page, so a single entry point works everywhere. 🥔
initVoidMode();      // first so .void-mode class is applied before paint
initFunFact();
initMilestones();
initBootSequence();
initKonami();
initSecretCat();

initRunawayButton();
initCounter();
initLoader();
initCatFacts();
initNothingButton();
initChoiceHover();
initCatTrail();
initCreditPrompt();
initSocialsModal();

initBored();
initWheel();
initComplaints();
initVisitorsMap();
initIdleAura();
initGlobalCounter();

initPixelPet();
initPotatoes();
