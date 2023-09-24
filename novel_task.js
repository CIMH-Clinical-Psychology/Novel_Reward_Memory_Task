// Maps for reward values
const fillRewards = { 'red': 0, 'blue': 1, 'yellow': 2, 'green': 3, 'orange': 4 };
const edgeColorRewards = { 'red': 4, 'blue': 3, 'yellow': 2, 'green': 1, 'orange': 0 };
const sizeRewards = { 50: 1, 60: 2, 70: 3, 80: 4, 90: 5 };
const opacityRewards = { 0.2: -1, 0.4: -2, 0.6: -3, 0.8: -4, 1.0: -5 };

// Create the stimuli --> this is randomly generated at first
function createStimulus() {
  const numberOfEdges = [3, 4, 5, 6, 7, 8, 9, 10];
  const fillingColors = ['red', 'blue', 'yellow', 'green', 'orange'];
  const edgeColors = ['red', 'blue', 'yellow', 'green', 'orange'];
  const sizes = [50, 60, 70, 80, 90];
  const opacities = [0.2, 0.4, 0.6, 0.8, 1.0];

  const stimuli = [];
  for (let i = 0; i < 2; i++) {
      const edges = numberOfEdges[Math.floor(Math.random() * numberOfEdges.length)];
      const fillColor = fillingColors[Math.floor(Math.random() * fillingColors.length)];
      const edgeColor = edgeColors[Math.floor(Math.random() * edgeColors.length)];
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      const opacity = opacities[Math.floor(Math.random() * opacities.length)];

      const angle = 360 / edges;
      let polygonPoints = '';
      for (let i = 0; i < edges; i++) {
          const x = size + size * Math.cos(i * angle * (Math.PI / 180));
          const y = size + size * Math.sin(i * angle * (Math.PI / 180));
          polygonPoints += `${x},${y} `;
      }
      
      const html = `<svg width="${size * 2}" height="${size * 2}" style="margin:5px; opacity: ${opacity};">
                      <polygon points="${polygonPoints}" style="fill:${fillColor};stroke:${edgeColor};stroke-width:5" />
                    </svg>`;
      
      stimuli.push({ html, edges, fillColor, edgeColor, size, opacity });
  }
  return stimuli;
}

// Calculate the reward
function rewardFunction(stimulus) {
  let reward = 0;
  
  if (stimulus && typeof stimulus === 'object') {
    reward += stimulus.edges; // reward for edges
    reward += fillRewards[stimulus.fillColor];
    reward += edgeColorRewards[stimulus.edgeColor];
    reward += sizeRewards[stimulus.size];
    reward += opacityRewards[stimulus.opacity];
  } else {
    console.error("Invalid stimulus passed to rewardFunction:", stimulus);
  }
  
  return reward;
}

// Define the fixation cross trial
let fixationTrial = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '+',
  choices: "NO_KEYS",
  trial_duration: 500,
  post_trial_gap: 0
};

// Push to LearningBlock
let learningBlock = [];
let n_Trials = 5;
for (let i = 0; i < n_Trials; i++) {
    let stimuli = createStimulus();
    
    let learningTrials = {
        type: jsPsychHtmlButtonResponse,
        stimulus: stimuli.map(s => s.html).join(' '),
        choices: ['Option 1', 'Option 2'],
        post_trial_gap: 0,
        on_finish: function (data) {
            let choice = data.button_pressed;
            let reward = rewardFunction(stimuli[choice]);
            data.reward = reward;
            
            // Logging the rewards for stim1 and stim2
            console.log("Reward for stim1:", rewardFunction(stimuli[0]));
            console.log("Reward for stim2:", rewardFunction(stimuli[1]));
        }
    };

    let delta = rewardFunction(stimuli[0]) - rewardFunction(stimuli[1]);

    let rewardTrial = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: 'Reward: ' + delta,
        choices: "NO_KEYS",
        trial_duration: 500,
        post_trial_gap: 0
    };
    
    learningBlock.push(fixationTrial, learningTrials, rewardTrial);
}

