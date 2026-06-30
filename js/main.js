import { initRunawayButton } from './modules/runaway-button.js';
import { initCounter } from './modules/counter.js';
import { initLoader } from './modules/loader.js';
import { initCatFacts } from './modules/cat-facts.js';
import { initNothingButton } from './modules/nothing-button.js';
import { initPotatoes } from './modules/potatoes.js';
import { initChoiceHover } from './modules/choice-hover.js';
import { initCatTrail } from './modules/cat-trail.js';
import { initCreditPrompt } from './modules/credit-prompt.js';

// Boot all the uselessness. Each module no-ops if its elements
// aren't on the current page, so a single entry point works everywhere. 🥔
initRunawayButton();
initCounter();
initLoader();
initCatFacts();
initNothingButton();
initChoiceHover();
initCatTrail();
initCreditPrompt();
initPotatoes();
