-- ============================================
-- DaterXP Seed Data
-- Run after migrations
-- ============================================

-- Badges
INSERT INTO public.badges (slug, name, description, icon, trigger_type, trigger_value, xp_bonus) VALUES
  ('first-step', 'First Step', 'Complete your first lesson', '👣', 'lesson_complete', 1, 0),
  ('on-fire', 'On Fire', '3-day streak', '🔥', 'streak', 3, 10),
  ('week-warrior', 'Week Warrior', '7-day streak', '⚡', 'streak', 7, 25),
  ('month-master', 'Month Master', '30-day streak', '👑', 'streak', 30, 100),
  ('student', 'Student', 'Complete 10 lessons', '📚', 'lesson_complete', 10, 20),
  ('scholar', 'Scholar', 'Complete 25 lessons', '🎓', 'lesson_complete', 25, 50),
  ('charmer', 'Charmer', 'Reach Level 5', '✨', 'level', 5, 50),
  ('legend', 'Legend', 'Reach Level 10', '🏆', 'level', 10, 200)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- COURSE 1: Confidence & Mindset
-- ============================================
INSERT INTO public.courses (slug, title, description, icon, color, order_index, is_published) VALUES
  ('confidence', 'Confidence & Mindset', 'Build unshakeable self-worth and stop letting fear hold you back. Master the internal game that makes everything else possible.', '💪', '#ff1a1a', 1, true)
ON CONFLICT (slug) DO NOTHING;

DO $$
DECLARE
  course_id UUID := (SELECT id FROM public.courses WHERE slug = 'confidence');
BEGIN

INSERT INTO public.lessons (course_id, slug, title, description, order_index, xp_reward, is_published, content) VALUES
(course_id, 'what-is-confidence', 'What Is Real Confidence?', 'The difference between fake confidence and the real thing', 0, 50, true,
'[
  {"type":"theory","heading":"The Confidence Myth","body":"Most guys think confidence means being loud, bold, or never feeling nervous. That''s wrong.\n\nReal confidence is quiet. It''s knowing your value without needing others to confirm it. It''s acting despite uncertainty — not because you have no fear, but because you move forward anyway."},
  {"type":"theory","heading":"Internal vs External Confidence","body":"External confidence depends on circumstances: your looks, job, or how the date is going. When those things fail, it collapses.\n\nInternal confidence is rooted in your relationship with yourself. It doesn''t fluctuate based on whether a girl texts back or a date goes well."},
  {"type":"quiz","question":"What is the foundation of real confidence?","options":["Having a great physique","External validation from others","Your internal relationship with yourself","Getting lots of matches on dating apps"],"correct":2,"explanation":"Real confidence comes from within — it''s your belief in your own value regardless of external results."},
  {"type":"quiz","question":"Which best describes someone with genuine confidence?","options":["Never feels nervous","Acts despite nervousness","Boasts about achievements","Is always the loudest in the room"],"correct":1,"explanation":"Confidence is not the absence of fear but taking action regardless of it."},
  {"type":"exercise","prompt":"Write down 3 moments in your life where you acted confidently despite feeling uncertain. What was the outcome?","placeholder":"Example: I gave a presentation while nervous and it went better than expected..."}
]'),

(course_id, 'overcoming-rejection', 'Overcoming Rejection', 'How to process and reframe rejection so it fuels rather than stops you', 1, 50, true,
'[
  {"type":"theory","heading":"Rejection Is Redirection","body":"Every time someone rejects you, they''re not saying you''re worthless. They''re saying you''re not a match for them right now.\n\nThink about this: if 1000 random people were asked if they wanted to date you, most would say no — and that''s completely normal. Rejection is statistical, not personal."},
  {"type":"theory","heading":"The 48-Hour Rule","body":"When you get rejected, allow yourself to feel it fully for 48 hours. Don''t suppress it. Then ask: \"What did I learn? What can I do differently?\"\n\nThe goal is to extract the lesson and move on. Men who succeed at dating treat rejection as data, not as a verdict on their worth."},
  {"type":"quiz","question":"What is the healthiest response to rejection?","options":["Never approach anyone again","Feel bad forever","Extract the lesson and move on","Pretend it didn''t happen"],"correct":2,"explanation":"Rejection is information. Process the feeling, find the lesson, and use it to grow."},
  {"type":"exercise","prompt":"Think of a recent rejection. What story did you tell yourself about it? Now rewrite that story from a growth perspective.","placeholder":"Old story: She rejected me because I''m not good enough...\nNew story: ..."}
]'),

(course_id, 'body-posture-presence', 'Power Posture & Presence', 'How your physical presence communicates confidence before you say a word', 2, 50, true,
'[
  {"type":"theory","heading":"Your Body Tells a Story","body":"Before you open your mouth, your posture has already told her whether you''re confident or insecure.\n\nHunched shoulders, looking at the ground, taking up minimal space — these signal low status. Standing tall, taking up space, and moving slowly signal confidence and authority."},
  {"type":"theory","heading":"The Three Posture Rules","body":"1. Shoulders back and down — not forced, but natural.\n2. Head up — chin parallel to the floor.\n3. Move slowly — confident people are never in a rush.\n\nPractice this daily. Your body shapes your mind too: standing in a power posture for 2 minutes actually changes your hormones."},
  {"type":"quiz","question":"Which posture signals HIGH confidence?","options":["Hunched shoulders looking at phone","Hands in pockets, avoiding eye contact","Upright, taking up space, moving slowly","Nodding constantly to seem agreeable"],"correct":2},
  {"type":"quiz","question":"What is the third posture rule?","options":["Speak loudly","Move quickly to show energy","Move slowly","Cross your arms"],"correct":2,"explanation":"Confident people are never in a rush. Slow movement signals comfort and authority."},
  {"type":"exercise","prompt":"Stand in front of a mirror for 60 seconds in your natural posture. Then apply the 3 posture rules for another 60 seconds. What differences do you notice?","placeholder":"Natural posture felt...\nWith the rules applied I noticed..."}
]'),

(course_id, 'inner-narrative', 'Rewriting Your Inner Narrative', 'The stories you tell yourself are shaping your dating life', 3, 50, true,
'[
  {"type":"theory","heading":"The Voice Inside Your Head","body":"We all have an inner narrator. For most guys, that narrator says things like: \"She''s out of my league,\" \"I''ll probably get rejected,\" or \"I''m not interesting enough.\"\n\nHere''s the truth: that voice is not reality — it''s a habit. And habits can be changed."},
  {"type":"theory","heading":"From Fixed to Growth Narrative","body":"Fixed narrative: \"I''m bad at talking to women.\"\nGrowth narrative: \"I''m developing my social skills every day.\"\n\nThe shift is subtle but profound. You go from a closed identity to an evolving one. Every interaction becomes practice, not a verdict."},
  {"type":"quiz","question":"Which is an example of a GROWTH narrative?","options":["I am naturally bad with women","I don''t have looks so it won''t work","I''m getting better at this with every interaction","Attractive guys have it easy, I can''t compete"],"correct":2,"explanation":"Growth narratives keep the door open. They frame your current state as temporary and improvable."},
  {"type":"exercise","prompt":"Write down your 3 most common negative inner narratives about dating. Then rewrite each one as a growth narrative.","placeholder":"Negative: I''m awkward...\nGrowth: I''m learning how to feel more comfortable in social situations..."}
]'),

(course_id, 'daily-confidence-practices', 'Daily Confidence Practices', 'Five habits that compound into unshakeable confidence over time', 4, 100, true,
'[
  {"type":"theory","heading":"Confidence Is Built, Not Born","body":"You weren''t born confident or unconfident. You learned your current level of confidence through experience — which means you can upgrade it.\n\nThe key is daily micro-habits that compound. Small daily actions are the only way to rewire deep patterns."},
  {"type":"theory","heading":"The Five Practices","body":"1. Cold exposure (cold shower, 2 min) — builds tolerance for discomfort\n2. One social risk per day — talk to a stranger, give a compliment, ask a question\n3. Journaling 5 min — track wins, no matter how small\n4. Physical training — feeling strong translates to feeling confident\n5. No porn/no excessive social media — protect your dopamine system"},
  {"type":"quiz","question":"Why is daily practice more effective than occasional big efforts?","options":["It isn''t — big efforts are better","Small actions compound over time","Daily practice is too time-consuming","Big efforts create instant change"],"correct":1,"explanation":"Confidence is built through consistent small actions that wire new neural pathways over time."},
  {"type":"quiz","question":"What does cold exposure primarily train?","options":["Muscle growth","Tolerance for discomfort","Memorization","Faster metabolism"],"correct":1},
  {"type":"exercise","prompt":"Design your personal 7-day confidence challenge. For each day, write one small social risk you will take.","placeholder":"Day 1: Compliment a stranger on their style\nDay 2: Start a conversation with someone in line...\n"}
]');

END $$;

-- ============================================
-- COURSE 2: Conversation Skills
-- ============================================
INSERT INTO public.courses (slug, title, description, icon, color, order_index, is_published) VALUES
  ('conversation', 'Conversation Skills', 'Master the art of engaging conversation that creates real connection and attraction.', '💬', '#ff6600', 2, true)
ON CONFLICT (slug) DO NOTHING;

DO $$
DECLARE
  course_id UUID := (SELECT id FROM public.courses WHERE slug = 'conversation');
BEGIN

INSERT INTO public.lessons (course_id, slug, title, description, order_index, xp_reward, is_published, content) VALUES
(course_id, 'opening-lines', 'Opening Lines That Actually Work', 'How to start conversations in a natural, non-cringe way', 0, 50, true,
'[
  {"type":"theory","heading":"Why Most Openers Fail","body":"The internet is full of \"killer openers\" that make you cringe in real life. The problem: scripted lines are obvious, and women can spot them instantly.\n\nThe best opener is genuine observation or a playful comment on your shared environment. \"Is that book any good?\" beats any pickup line."},
  {"type":"theory","heading":"The Three Types of Good Openers","body":"1. Situational — based on what''s happening around you\n2. Genuine curiosity — you''re actually interested in something about her\n3. Light tease — playful, not mean-spirited\n\nAll three are natural and create real conversations instead of performance moments."},
  {"type":"quiz","question":"Which is the BEST type of opener?","options":["A memorized pickup line","A situational comment on the environment","Asking for her number immediately","Complimenting her appearance first"],"correct":1,"explanation":"Situational openers feel natural because they''re genuine and based on shared reality."},
  {"type":"exercise","prompt":"Think of 3 environments where you might meet women (coffee shop, gym, bookstore, etc.). Write one genuine situational opener for each.","placeholder":"Coffee shop: ''I notice you''ve been here a while — is the wifi actually good here?''\n..."}
]'),

(course_id, 'active-listening', 'Active Listening', 'The underrated skill that makes you the most interesting person in the room', 1, 50, true,
'[
  {"type":"theory","heading":"Most People Are Waiting to Talk","body":"In most conversations, people are not listening — they''re waiting for their turn to speak. This is obvious, and it kills connection.\n\nActive listening means being genuinely present with what someone is saying. It''s not a technique — it''s a mindset shift."},
  {"type":"theory","heading":"How to Actually Listen","body":"1. Make eye contact while she speaks\n2. Don''t interrupt — let silence exist\n3. Reflect back what you heard: ''So what you''re saying is...''\n4. Ask follow-up questions based on what she just said, not what you planned to ask\n5. React emotionally — laugh, frown, lean in"},
  {"type":"quiz","question":"What is the main error most people make in conversation?","options":["Talking too slowly","Waiting to speak instead of listening","Making too much eye contact","Asking too many questions"],"correct":1},
  {"type":"quiz","question":"Which is a sign of active listening?","options":["Nodding without paying attention","Asking questions you planned before she spoke","Asking follow-ups based on what she just said","Looking at your phone between responses"],"correct":2},
  {"type":"exercise","prompt":"In your next 3 conversations (with anyone), practice only active listening. No planning responses. Reflect afterward: what did you notice about the other person that you normally miss?","placeholder":"I noticed that when I truly listened, I discovered..."}
]'),

(course_id, 'storytelling', 'Storytelling That Creates Attraction', 'How to share yourself in a way that captivates and builds emotional connection', 2, 50, true,
'[
  {"type":"theory","heading":"Why Stories Are Magnetic","body":"Facts tell, stories sell. When you share your life through vivid stories instead of dry facts, you become memorable and attractive.\n\nA story is not: \"I traveled to Japan.\" A story is: \"I got completely lost in Tokyo at midnight with no data, and a street vendor who spoke zero English somehow knew exactly what I needed.\""},
  {"type":"theory","heading":"The Story Formula","body":"Every great story has:\n1. Context: Set the scene briefly\n2. Tension: What went wrong or got interesting\n3. Resolution: What happened and what you learned\n4. Emotional punch: How it felt\n\nKeep stories under 90 seconds. End with a question to pull her into the conversation."},
  {"type":"quiz","question":"What makes a story compelling versus forgettable?","options":["Including every detail","Tension — something interesting happened","Using formal language","Talking about achievements"],"correct":1},
  {"type":"exercise","prompt":"Take a real experience from your life (travel, work, childhood, adventure) and write it as a story using the formula: Context → Tension → Resolution → Emotional punch.","placeholder":"Context: Last year I was hiking alone in...\nTension: Then I realized...\nResolution: ...\nEmotional punch: It made me feel..."}
]'),

(course_id, 'humor-fundamentals', 'Humor Fundamentals', 'Why humor is the most powerful attraction tool, and how to use it', 3, 50, true,
'[
  {"type":"theory","heading":"Humor Is Not About Being Funny","body":"Trying to be funny kills humor. The most attractive version of humor is being playful and not taking things too seriously — including yourself.\n\nSelf-deprecating humor (done right) signals confidence: only truly confident people can laugh at themselves."},
  {"type":"theory","heading":"Three Humor Moves","body":"1. Exaggeration — take something small and make it absurd\n2. Misdirection — set up an obvious answer, deliver a surprising one\n3. Callback — reference something said earlier in the conversation\n\nNever punch down, never try too hard, and never over-explain the joke."},
  {"type":"quiz","question":"Which type of humor is most attractive?","options":["Mean-spirited teasing","Self-deprecating humor that requires confidence","Shock humor","Repeating memes"],"correct":1,"explanation":"Self-deprecating humor signals confidence — you''re secure enough to laugh at yourself."},
  {"type":"quiz","question":"What kills humor instantly?","options":["Being too quiet","Explaining the joke","Making eye contact","Using callbacks"],"correct":1},
  {"type":"exercise","prompt":"Think of one mildly embarrassing or funny thing that''s happened to you. Write it as a self-deprecating anecdote using one of the three humor moves.","placeholder":"Use exaggeration, misdirection, or a callback: When I tried to cook for a date, I somehow managed to..."}
]'),

(course_id, 'deep-questions', 'Questions That Create Deep Connection', 'Move beyond small talk into conversations that matter', 4, 100, true,
'[
  {"type":"theory","heading":"Small Talk Is a Bridge, Not a Destination","body":"Weather, jobs, and weekend plans are fine to start — but they don''t create emotional connection. They''re the warm-up.\n\nThe goal is to move from surface topics to feelings, values, and experiences that reveal who someone actually is."},
  {"type":"theory","heading":"The Question Escalation Ladder","body":"Surface: ''Where are you from?''\nMedium: ''What do you love about living there?''\nDeep: ''Has where you grew up shaped who you are?''\n\nYou escalate gradually. You can''t jump from ''What do you do?'' to ''What are your deepest fears?'' — it''s jarring. Build trust first."},
  {"type":"quiz","question":"What is the PURPOSE of small talk?","options":["To fill silence","To learn facts about someone","To build comfort before going deeper","To test if someone is intelligent"],"correct":2},
  {"type":"quiz","question":"Which is a DEEP question?","options":["Where are you from?","What do you do for work?","Has where you grew up shaped who you are?","Do you like sushi?"],"correct":2},
  {"type":"exercise","prompt":"Take one of these topics (family, travel, work, dreams) and write a surface, medium, and deep question for each. Then plan how you''d naturally escalate through them in conversation.","placeholder":"Topic: Travel\nSurface: Have you traveled much?\nMedium: What was the trip that surprised you most?\nDeep: Has travel changed how you see yourself?"}
]');

END $$;

-- ============================================
-- COURSE 3: First Dates
-- ============================================
INSERT INTO public.courses (slug, title, description, icon, color, order_index, is_published) VALUES
  ('first-dates', 'First Dates', 'Plan, execute, and crush first dates that lead to second ones.', '🍷', '#cc0044', 3, true)
ON CONFLICT (slug) DO NOTHING;

DO $$
DECLARE
  course_id UUID := (SELECT id FROM public.courses WHERE slug = 'first-dates');
BEGIN

INSERT INTO public.lessons (course_id, slug, title, description, order_index, xp_reward, is_published, content) VALUES
(course_id, 'choosing-the-venue', 'Choosing the Perfect Venue', 'The first date location sets the entire tone', 0, 50, true,
'[
  {"type":"theory","heading":"The Venue Is the Message","body":"Your choice of venue communicates who you are before the date even starts.\n\nA loud club says: I don''t care about connecting. A boring coffee chain says: I''m playing it safe. A unique cocktail bar or walkable neighborhood says: I''m thoughtful and confident enough to lead."},
  {"type":"theory","heading":"The Ideal First Date Formula","body":"Best first dates are:\n- 1–2 hours max (leave her wanting more)\n- Low pressure, mobile — a walk + a drink works perfectly\n- In a place you know and like (you''re the guide, not a tourist)\n- Not dinner: too much pressure, face-to-face, trapped\n\nBonus: plan a possible ''venue 2'' to extend the date if it''s going well."},
  {"type":"quiz","question":"Why is dinner a poor choice for a first date?","options":["It''s too expensive","It''s high pressure and you''re trapped for 1+ hours","Restaurants are always loud","It''s too romantic too soon"],"correct":1},
  {"type":"quiz","question":"What does your venue choice communicate?","options":["Nothing — she doesn''t care","Your taste, thoughtfulness, and confidence","Your income level","Your intentions"],"correct":1},
  {"type":"exercise","prompt":"Think of 3 date venues in your area that fit the ideal formula. Describe why each works.","placeholder":"1. [Venue name]: A cocktail bar I know well. Great vibe, not too loud, easy to walk somewhere after...\n2. ...\n3. ..."}
]'),

(course_id, 'conversation-flow', 'Mastering Conversation Flow', 'How to keep the conversation moving without it feeling like an interview', 1, 50, true,
'[
  {"type":"theory","heading":"The Interview Trap","body":"A first date conversation that sounds like: ''Where are you from? What do you do? Do you have siblings?'' is exhausting. It''s an interview.\n\nConversation flow means the exchange feels effortless — you''re both building on each other''s ideas, laughing, and going off on tangents."},
  {"type":"theory","heading":"Free Association Technique","body":"Instead of moving to a new topic every time, dig into the interesting parts of what she''s saying.\n\nShe says: ''I just got back from Thailand.''\nBad: ''Cool! Where are you from originally?''\nGood: ''Really? What surprised you most about it?''\n\nFollow the thread. Go deeper before going wider."},
  {"type":"quiz","question":"What is the interview trap?","options":["Asking questions that are too personal","Rapid-fire factual questions that feel like a job interview","Making the date too long","Talking about work too much"],"correct":1},
  {"type":"exercise","prompt":"Practice the free association technique. Take this starter: ''I''ve been really into cooking lately.'' Write a 6-exchange conversation that digs deeper instead of jumping to new topics.","placeholder":"Her: I''ve been really into cooking lately.\nYou: What got you into it?\nHer: ...\nYou: ..."}
]'),

(course_id, 'reading-signals', 'Reading Her Interest Signals', 'Know when things are going well — and what to do next', 2, 50, true,
'[
  {"type":"theory","heading":"She''s Telling You Constantly","body":"Women communicate interest through behavior, not words. They''re signaling to you constantly — most guys just don''t notice.\n\nPositive signals: laughing, touching her hair, leaning in, asking you personal questions, mirroring your body language, extending the conversation when you try to end it."},
  {"type":"theory","heading":"Green, Yellow, and Red Lights","body":"Green: She''s engaged, smiling, asking questions, touching you\nYellow: Distracted, giving short answers, checking her phone\nRed: Leaning away, giving one-word answers, looking for an exit\n\nYour job is not to force things when it''s red — it''s to create more green light moments."},
  {"type":"quiz","question":"Which is a positive interest signal?","options":["Giving short answers","Checking her phone","Leaning in toward you","Looking around the room"],"correct":2},
  {"type":"quiz","question":"What should you do if you see red light signals?","options":["Push harder","End the date, don''t force it","Give her more compliments","Ask if she''s okay"],"correct":1},
  {"type":"exercise","prompt":"Recall a past date or interaction with a woman. List all the signals you now recognize — positive or negative — that you may have missed at the time.","placeholder":"Looking back, I now notice she was... [positive signals]\nI also notice she was probably signaling... [negative signals]"}
]'),

(course_id, 'physical-escalation', 'Physical Escalation Basics', 'How to build physical connection naturally and confidently', 3, 50, true,
'[
  {"type":"theory","heading":"Touch Is Communication","body":"Physical touch is not a trick or technique — it''s communication. When done naturally and confidently, touch deepens connection and signals confidence.\n\nThe key is gradual escalation: start with socially acceptable touch (shoulder, arm) and build progressively based on positive responses."},
  {"type":"theory","heading":"The Escalation Ladder","body":"1. Hand on shoulder during a funny moment\n2. Touch her arm when making a point\n3. Guide her with a hand on the lower back when walking\n4. High-five that transitions to held hands briefly\n5. Move to her side instead of across from her\n\nAlways read her response. Proceed if positive, back off and rebuild if negative."},
  {"type":"quiz","question":"What is the purpose of physical touch on a date?","options":["To show dominance","To communicate and deepen connection","To test her boundaries","To impress her friends"],"correct":1},
  {"type":"quiz","question":"What should you do if she pulls back from touch?","options":["Apologize immediately","Ignore it and continue","Back off and rebuild comfort","End the date"],"correct":2},
  {"type":"exercise","prompt":"Map out your current ''escalation comfort zone.'' Where do you typically stop, and why? What would be one step further you could take with more confidence?","placeholder":"I''m comfortable with... I usually stop at... because... One step further would be..."}
]'),

(course_id, 'ending-the-date', 'Ending the Date Like a Pro', 'How you end a date determines whether there''s a second one', 4, 100, true,
'[
  {"type":"theory","heading":"Leave While It''s Good","body":"The biggest mistake on first dates: staying too long. People remember how they felt at the end of an experience most strongly.\n\nEnd the date while energy is still high — not when it''s fizzling. She should want more, not be relieved it''s over."},
  {"type":"theory","heading":"The Confident Exit","body":"1. Call the end of the date (''I should get going — early morning'')\n2. Walk her out / to her car\n3. If signals were green: go for the kiss\n4. If not: a warm hug + direct statement: ''I had a great time. Let''s do this again.''\n5. Follow up the next day with a short, specific message\n\nNever: ''So... did you have fun?'' Never ask for permission."},
  {"type":"quiz","question":"When should you end a first date?","options":["After at least 3 hours","When energy is still high","When she yawns","As late as possible to maximize connection"],"correct":1},
  {"type":"quiz","question":"What is the best follow-up timing after a first date?","options":["Wait 3 days to seem less eager","Never follow up, let her text first","The next day with a short specific message","Immediately after the date ends"],"correct":2},
  {"type":"exercise","prompt":"Write out your ideal date ending — from the moment you call it to the follow-up message. Make it feel natural and confident, not scripted.","placeholder":"I''d say something like: ''This was great — I should get going.''\nThen I''d...\nFollow-up message: ''Hey [name], I had a great time last night. [Specific callback]. We should [specific plan].''"}
]');

END $$;

-- ============================================
-- COURSE 4: Body Language
-- ============================================
INSERT INTO public.courses (slug, title, description, icon, color, order_index, is_published) VALUES
  ('body-language', 'Body Language', 'Communicate attraction, confidence, and interest without saying a word.', '👁️', '#8800ff', 4, true)
ON CONFLICT (slug) DO NOTHING;

DO $$
DECLARE
  course_id UUID := (SELECT id FROM public.courses WHERE slug = 'body-language');
BEGIN

INSERT INTO public.lessons (course_id, slug, title, description, order_index, xp_reward, is_published, content) VALUES
(course_id, 'eye-contact', 'Eye Contact Mastery', 'The most powerful non-verbal signal you can control', 0, 50, true,
'[
  {"type":"theory","heading":"Eye Contact Is Primal","body":"Before language, eye contact was the primary way humans communicated status, safety, and interest.\n\nConfident, warm eye contact communicates: I am present, I am interested, I am not threatened. Evasive eye contact communicates the opposite."},
  {"type":"theory","heading":"The Eye Contact Formula","body":"During conversation: 70% eye contact when listening, 50% when speaking.\n\nKey: eye contact should feel warm and interested, not cold or intimidating. Think of it as curiosity, not a staring contest.\n\nWhen you first lock eyes with a stranger: hold it 1 second longer than comfortable. Then smile or look away slowly (never snap away — that signals nervousness)."},
  {"type":"quiz","question":"What does confident eye contact communicate?","options":["Aggression","Presence, interest, and security","Submission","Nervousness"],"correct":1},
  {"type":"quiz","question":"How should you break eye contact with a stranger?","options":["Snap away immediately","Look down at the floor","Look away slowly","Close your eyes"],"correct":2},
  {"type":"exercise","prompt":"Today, practice making eye contact with 5 strangers (barista, cashier, passerby). Hold it 1 second longer than feels normal. Record what happened.","placeholder":"Person 1: I held eye contact with the barista for an extra second. They...\nPerson 2: ..."}
]'),

(course_id, 'open-posture', 'Open vs Closed Posture', 'How your body shape signals your state to everyone around you', 1, 50, true,
'[
  {"type":"theory","heading":"Open vs Closed Signals","body":"Closed posture: crossed arms, hunched forward, taking up minimal space, head down.\n\nOpen posture: shoulders back, chest open, arms relaxed at sides or expressive, head up.\n\nClosed posture signals: threat, insecurity, discomfort. Open posture signals: confidence, openness, safety."},
  {"type":"theory","heading":"The Space Principle","body":"Dominant, confident people take up space. They sit with their legs spread, arms wide, leaning back.\n\nNervous or low-confidence people make themselves small. They cross legs and arms, turn shoulders in.\n\nPractice: wherever you sit, consciously take up slightly more space than feels natural. Not aggressively — comfortably."},
  {"type":"quiz","question":"Which posture signals HIGH status and confidence?","options":["Arms crossed, legs together","Hunched forward, taking minimal space","Shoulders back, chest open, legs spread","Constantly adjusting clothes or hair"],"correct":2},
  {"type":"exercise","prompt":"Spend one day consciously practicing open posture everywhere you go. Note 3 specific moments where you caught yourself closing off and what you did instead.","placeholder":"Moment 1: I was sitting in the waiting room and noticed I had...\nI changed it to...\nMoment 2: ..."}
]'),

(course_id, 'mirroring', 'Mirroring for Connection', 'The unconscious technique that builds instant rapport', 2, 50, true,
'[
  {"type":"theory","heading":"We Sync When We Connect","body":"When two people are genuinely connected, their body language naturally synchronizes. They lean the same way, adopt similar postures, match speaking pace.\n\nThis mirroring happens unconsciously — but you can also use it consciously to deepen rapport."},
  {"type":"theory","heading":"How to Mirror","body":"Mirror her:\n- Posture (she leans in → you lean in)\n- Speaking pace (she talks slowly → you slow down)\n- Energy level (she''s animated → you match it)\n- Vocabulary (she uses casual language → you do too)\n\nImportant: mirror with a 3-5 second delay. Immediate mirroring is obvious. And never mirror negative body language (crossed arms, leaning away)."},
  {"type":"quiz","question":"What is the appropriate delay when mirroring?","options":["Immediately","3-5 seconds later","After 1 minute","Only mirror once per conversation"],"correct":1},
  {"type":"quiz","question":"What should you NOT mirror?","options":["Her speaking pace","Her energy level","Crossed arms and leaning away","Her vocabulary"],"correct":2},
  {"type":"exercise","prompt":"In your next social interaction, consciously try mirroring for 5 minutes. Describe what you did and whether you felt the connection shift.","placeholder":"I tried mirroring [person]''s posture and pace. I noticed..."}
]'),

(course_id, 'proximity', 'Proximity & Personal Space', 'How physical distance communicates interest and confidence', 3, 50, true,
'[
  {"type":"theory","heading":"Distance Is a Signal","body":"The physical distance you keep from someone communicates your level of comfort and interest.\n\nStanding too far: either you''re not interested, or you''re nervous about invading space. Standing at an appropriate, close distance: you''re comfortable and interested.\n\nThe key: move closer gradually, and watch her reaction. If she maintains the distance or closes it further, that''s a green signal."},
  {"type":"theory","heading":"Zone Awareness","body":"Public zone: 4+ feet — strangers\nSocial zone: 4–1.5 feet — acquaintances\nPersonal zone: 1.5 feet — friends, dates\nIntimate zone: 18 inches or less — close relationships\n\nYour goal on a date: get to personal zone naturally, and read signals for intimate zone."},
  {"type":"quiz","question":"What does maintaining too much distance typically signal?","options":["Strong attraction","Nervousness or lack of interest","Dominance","Respect"],"correct":1},
  {"type":"exercise","prompt":"Think of 3 recent conversations with women. What zone were you in for most of the conversation? What would have happened if you''d moved slightly closer?","placeholder":"Conversation 1: I stayed at [public/social/personal] zone because... If I''d moved closer..."}
]'),

(course_id, 'touch-calibration', 'Touch Calibration', 'Developing a natural, confident touch that feels appropriate — not awkward', 4, 100, true,
'[
  {"type":"theory","heading":"Touch Is a Skill","body":"Touch is uncomfortable for many guys because it was never modeled as natural and platonic. Result: they either avoid all touch (robotic) or over-touch (creepy).\n\nCalibrated touch is light, contextual, and responsive to feedback. It says: I am comfortable in my own skin."},
  {"type":"theory","heading":"Types of Natural Touch","body":"Context-appropriate touch:\n- High five or fist bump as greeting\n- Brief arm touch to emphasize a point\n- Shoulder touch during a laugh\n- Guiding hand on the lower back when leading\n- Holding her hand to show her something\n\nThe test: does the touch feel motivated by genuine connection, or by anxiety about making a move? Women can feel the difference."},
  {"type":"quiz","question":"What makes touch feel natural vs. awkward?","options":["How long it lasts","Whether it feels motivated by genuine connection vs. anxiety","The specific body part touched","Whether she''s looking"],"correct":1},
  {"type":"quiz","question":"Which is an example of context-appropriate touch?","options":["Grabbing her hand immediately after meeting","Brief arm touch while making a point","Stroking her hair on a first meeting","Touching her face during conversation"],"correct":1},
  {"type":"exercise","prompt":"Rate your current touch comfort level (1-10) and identify where it comes from. What''s one specific touch habit you want to develop? Design a 30-day plan to normalize it.","placeholder":"My touch comfort level is [x] because...\nOne habit I want to develop: ...\n30-day plan: ..."}
]');

END $$;
